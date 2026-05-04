// Tiny PHP unserializer — enough to read postmeta values like
//   a:2:{s:5:"width";i:1024;s:6:"height";i:768;}
// Returns plain JS values: null, bool, number, string, array, object.

type Cursor = { s: string; i: number };

function readUntil(c: Cursor, delim: string): string {
  const idx = c.s.indexOf(delim, c.i);
  if (idx < 0) throw new Error(`PHP unserialize: missing '${delim}' at ${c.i}`);
  const out = c.s.slice(c.i, idx);
  c.i = idx + 1;
  return out;
}

function expect(c: Cursor, ch: string) {
  if (c.s[c.i] !== ch) throw new Error(`PHP unserialize: expected '${ch}' at ${c.i}, got '${c.s[c.i]}'`);
  c.i++;
}

function parseValue(c: Cursor): unknown {
  const tag = c.s[c.i];
  c.i++;
  expect(c, ":");
  switch (tag) {
    case "N": {
      // N;
      expect(c, ";");
      return null;
    }
    case "b": {
      const v = c.s[c.i] === "1";
      c.i += 2; // digit + ;
      return v;
    }
    case "i": {
      const raw = readUntil(c, ";");
      return Number(raw);
    }
    case "d": {
      const raw = readUntil(c, ";");
      return Number(raw);
    }
    case "s": {
      const len = Number(readUntil(c, ":"));
      expect(c, '"');
      const str = c.s.substr(c.i, len);
      c.i += len;
      expect(c, '"');
      expect(c, ";");
      return str;
    }
    case "a": {
      const count = Number(readUntil(c, ":"));
      expect(c, "{");
      const isObj: boolean = false; // arrays may be assoc-or-indexed; return as object for assoc safety
      const obj: Record<string, unknown> = {};
      const arr: unknown[] = [];
      let allNumericKeys = true;
      let nextNumericKey = 0;
      for (let k = 0; k < count; k++) {
        const key = parseValue(c);
        const val = parseValue(c);
        if (typeof key === "number" && key === nextNumericKey) {
          arr.push(val);
          nextNumericKey++;
        } else {
          allNumericKeys = false;
        }
        obj[String(key)] = val;
      }
      expect(c, "}");
      return allNumericKeys ? arr : obj;
    }
    case "O": {
      // O:8:"stdClass":2:{...}  — treat as object
      const nameLen = Number(readUntil(c, ":"));
      expect(c, '"');
      c.i += nameLen;
      expect(c, '"');
      expect(c, ":");
      const count = Number(readUntil(c, ":"));
      expect(c, "{");
      const obj: Record<string, unknown> = {};
      for (let k = 0; k < count; k++) {
        const key = parseValue(c);
        const val = parseValue(c);
        obj[String(key)] = val;
      }
      expect(c, "}");
      return obj;
    }
    default:
      throw new Error(`PHP unserialize: unknown tag '${tag}' at ${c.i - 2}`);
  }
}

export function phpUnserialize(s: string): unknown {
  if (!s) return null;
  try {
    const c: Cursor = { s, i: 0 };
    return parseValue(c);
  } catch {
    return null;
  }
}
