import type { HTMLAttributes, ReactNode } from "react";

export type DisplayItalicProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function DisplayItalic({ children, className, ...rest }: DisplayItalicProps) {
  const cls = ["ui-display-italic", className].filter(Boolean).join(" ");
  return (
    <em className={cls} {...rest}>
      {children}
    </em>
  );
}
