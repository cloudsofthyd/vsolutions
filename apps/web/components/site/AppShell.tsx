import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Ticket,
  FileText,
  Settings,
  Mail,
  FolderOpen,
  Newspaper,
} from "lucide-react";
import type { ReactNode } from "react";
import { AppShellMobileToggle } from "./AppShellMobile";

export type NavItem = {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
  count?: number;
};

export type NavGroup = {
  title?: string;
  items: NavItem[];
};

const ICONS = {
  dashboard: LayoutDashboard,
  users: Users,
  ticket: Ticket,
  invoice: FileText,
  settings: Settings,
  mail: Mail,
  folder: FolderOpen,
  newspaper: Newspaper,
};

interface Props {
  groups: NavGroup[];
  user: { name: string; role: string; initials: string };
  brandLabel: string;
  brandSub: string;
  brandMark?: string;
  brandColor?: string | null;
  currentPath: string;
  children: ReactNode;
}

function brandMonogram(label: string, fallback?: string): string {
  if (fallback) return fallback;
  const parts = label.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function AppShell({ groups, user, brandLabel, brandSub, brandMark, brandColor, currentPath, children }: Props) {
  const monogram = brandMonogram(brandLabel, brandMark);
  return (
    <div className="app-shell" style={brandColor ? ({ ["--rose" as never]: brandColor } as React.CSSProperties) : undefined}>
      <AppShellMobileToggle brand={{ mark: monogram, label: brandLabel, sub: brandSub }} />
      <aside className="app-side">
        <Link href="/" className="app-brand">
          <span className="app-brand-mark" aria-hidden="true">{monogram}</span>
          <span className="app-brand-text-wrap">
            <span className="app-brand-text">{brandLabel}</span>
            <span className="app-brand-sub">{brandSub}</span>
          </span>
        </Link>

        <nav className="app-nav">
          {groups.map((g, gi) => (
            <div key={gi}>
              {g.title ? <div className="app-nav-group">{g.title}</div> : null}
              {g.items.map((item) => {
                const Icon = ICONS[item.icon];
                const isActive =
                  item.href === currentPath ||
                  (item.href !== "/" && currentPath.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`app-nav-link${isActive ? " is-active" : ""}`}
                  >
                    <Icon className="app-nav-icon" />
                    <span>{item.label}</span>
                    {typeof item.count === "number" && item.count > 0 ? (
                      <span className="app-nav-count">{item.count}</span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="app-side-foot">
          <div className="app-user">
            <div className="app-avatar">{user.initials}</div>
            <div className="app-user-meta">
              <span className="app-user-name">{user.name}</span>
              <span className="app-user-role">{user.role}</span>
            </div>
          </div>
          <form action="/api/auth/logout/" method="post">
            <button type="submit" className="app-logout">
              Sign out →
            </button>
          </form>
        </div>
      </aside>

      <main className="app-main">{children}</main>
    </div>
  );
}
