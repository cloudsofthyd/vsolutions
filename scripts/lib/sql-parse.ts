// Streaming MySQL INSERT parser. Handles:
//   - multi-row INSERTs split across lines
//   - escaped sequences: \', \", \\, \n, \r, \t, \0, \Z, \b
//   - NULL literal (unquoted)
//   - integer/float literals (unquoted)
//   - mid-string commas, parens, quotes
//
// Approach: read the file line-by-line, accumulate one statement per ';' that's
// outside any string literal. Then tokenize each VALUES (...),(...) row.

import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

export type Row = Array<string | number | null>;

export interface InsertStatement {
  table: string;
  columns: string[];
  rows: Row[];
}

const ESCAPES: Record<string, string> = {
  n: "\n",
  r: "\r",
  t: "\t",
  "0": "\0",
  Z: "\x1a",
  b: "\b",
  '"': '"',
  "'": "'",
  "\\": "\\",
  "%": "%",
  _: "_",
};

function unescapeSql(raw: string): string {
  let out = "";
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (c === "\\" && i + 1 < raw.length) {
      const next = raw[i + 1];
      out += ESCAPES[next] ?? next;
      i++;
    } else {
      out += c;
    }
  }
  return out;
}

/**
 * Parse one statement: `INSERT INTO \`table\` (cols) VALUES (...),(...)`.
 * Returns null if it isn't an INSERT INTO we want.
 */
export function parseInsert(stmt: string): InsertStatement | null {
  // Find INSERT INTO `table`
  const tableMatch = stmt.match(/^INSERT\s+(?:IGNORE\s+)?INTO\s+`([^`]+)`\s*/i);
  if (!tableMatch) return null;
  const table = tableMatch[1];
  let i = tableMatch[0].length;

  // Optional column list (cols)
  const columns: string[] = [];
  if (stmt[i] === "(") {
    const closeIdx = stmt.indexOf(")", i);
    const colList = stmt.slice(i + 1, closeIdx);
    for (const col of colList.split(",")) {
      const m = col.trim().match(/^`([^`]+)`$/);
      if (m) columns.push(m[1]);
    }
    i = closeIdx + 1;
  }

  // VALUES
  const valuesIdx = stmt.toUpperCase().indexOf("VALUES", i);
  if (valuesIdx < 0) return null;
  i = valuesIdx + 6;

  // Each row is wrapped in (...). Tokenize raw chars.
  const rows: Row[] = [];
  while (i < stmt.length) {
    // skip whitespace + commas between rows
    while (i < stmt.length && /[\s,;]/.test(stmt[i])) i++;
    if (i >= stmt.length) break;
    if (stmt[i] !== "(") break;
    i++; // consume (
    const row: Row = [];
    let cur = "";
    let inStr = false;
    let strCh: string | null = null;

    while (i < stmt.length) {
      const c = stmt[i];
      if (inStr) {
        if (c === "\\") {
          cur += c + (stmt[i + 1] ?? "");
          i += 2;
          continue;
        }
        if (c === strCh) {
          inStr = false;
          strCh = null;
          cur += c; // include the closing quote so coerceValue can strip both
          i++;
          continue;
        }
        cur += c;
        i++;
        continue;
      }
      // not in string
      if (c === "'" || c === '"') {
        inStr = true;
        strCh = c;
        cur += c; // include the opening quote
        i++;
        continue;
      }
      if (c === ",") {
        row.push(coerceValue(cur));
        cur = "";
        i++;
        continue;
      }
      if (c === ")") {
        row.push(coerceValue(cur));
        cur = "";
        i++;
        rows.push(row);
        break;
      }
      cur += c;
      i++;
    }
  }

  return { table, columns, rows };
}

function coerceValue(token: string): string | number | null {
  const t = token.trim();
  if (t.length === 0) return null;
  if (t === "NULL" || t === "null") return null;
  if (t.startsWith("'") && t.endsWith("'")) {
    return unescapeSql(t.slice(1, -1));
  }
  if (t.startsWith('"') && t.endsWith('"')) {
    return unescapeSql(t.slice(1, -1));
  }
  // numeric
  if (/^-?\d+$/.test(t)) {
    const n = Number(t);
    if (Number.isSafeInteger(n)) return n;
    return t; // bigint as string
  }
  if (/^-?\d+\.\d+$/.test(t)) return Number(t);
  return t;
}

/**
 * Stream parse a MySQL dump file. Calls `onInsert` for every INSERT statement
 * matching `tablesOfInterest`. Statements that span multiple lines are buffered.
 */
export async function streamMysqlDump(
  filePath: string,
  tablesOfInterest: Set<string>,
  onInsert: (stmt: InsertStatement) => Promise<void> | void,
): Promise<{ statements: number; rows: number }> {
  const rl = createInterface({
    input: createReadStream(filePath, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  let buffer = "";
  let inStr = false;
  let strCh: string | null = null;
  let stats = { statements: 0, rows: 0 };

  for await (const line of rl) {
    if (!line || line.startsWith("--") || line.startsWith("/*")) {
      // SQL comments — only safe to skip if we're not inside a multi-line string
      if (!inStr) continue;
    }
    buffer += (buffer ? "\n" : "") + line;

    // Walk the appended portion looking for an unquoted ';' that ends a statement.
    // We need to maintain inStr state across line iterations.
    let cursor = buffer.length - line.length - (buffer.length > line.length ? 1 : 0);
    if (cursor < 0) cursor = 0;
    while (cursor < buffer.length) {
      const c = buffer[cursor];
      if (inStr) {
        if (c === "\\") {
          cursor += 2;
          continue;
        }
        if (c === strCh) {
          inStr = false;
          strCh = null;
        }
        cursor++;
        continue;
      }
      if (c === "'" || c === '"') {
        inStr = true;
        strCh = c;
        cursor++;
        continue;
      }
      if (c === ";") {
        const stmt = buffer.slice(0, cursor).trim();
        buffer = buffer.slice(cursor + 1);
        cursor = 0;
        if (stmt.toUpperCase().startsWith("INSERT")) {
          const parsed = parseInsert(stmt);
          if (parsed && tablesOfInterest.has(parsed.table)) {
            stats.statements++;
            stats.rows += parsed.rows.length;
            await onInsert(parsed);
          }
        }
        continue;
      }
      cursor++;
    }
  }

  return stats;
}

/**
 * Convert column-array form (the parser's output) to row objects keyed by column name.
 */
export function rowToObj(stmt: InsertStatement, row: Row): Record<string, string | number | null> {
  const obj: Record<string, string | number | null> = {};
  for (let i = 0; i < stmt.columns.length; i++) {
    obj[stmt.columns[i]] = row[i] ?? null;
  }
  return obj;
}
