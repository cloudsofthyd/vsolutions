import type { HTMLAttributes } from "react";

export type StatBlockProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
  label: string;
};

export function StatBlock({ value, label, className, ...rest }: StatBlockProps) {
  const cls = ["ui-stat", className].filter(Boolean).join(" ");
  return (
    <div className={cls} {...rest}>
      <span className="ui-stat__value">{value}</span>
      <span className="ui-stat__label">{label}</span>
    </div>
  );
}
