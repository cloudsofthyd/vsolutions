import type { HTMLAttributes, ReactNode } from "react";

export type TagPillProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
};

export function TagPill({ children, className, ...rest }: TagPillProps) {
  const cls = ["ui-tag-pill", className].filter(Boolean).join(" ");
  return (
    <span className={cls} {...rest}>
      {children}
    </span>
  );
}

export type TagPillGroupProps = HTMLAttributes<HTMLDivElement> & {
  items: string[];
};

export function TagPillGroup({ items, className, ...rest }: TagPillGroupProps) {
  return (
    <div className={className} {...rest}>
      {items.map((item) => (
        <TagPill key={item}>{item}</TagPill>
      ))}
    </div>
  );
}
