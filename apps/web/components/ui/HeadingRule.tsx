import type { HTMLAttributes } from "react";

export type HeadingRuleProps = HTMLAttributes<HTMLHRElement>;

export function HeadingRule({ className, ...rest }: HeadingRuleProps) {
  const cls = ["ui-heading-rule", className].filter(Boolean).join(" ");
  return <hr role="presentation" className={cls} {...rest} />;
}
