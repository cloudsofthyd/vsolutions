import { headers } from "next/headers";
import { prisma } from "@vsi/db";
import { requireAdmin } from "@/lib/session";
import { AppShell, type NavGroup } from "@/components/site/AppShell";

export const dynamic = "force-dynamic";

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const hdrs = await headers();
  const path = hdrs.get("x-pathname") ?? hdrs.get("x-invoke-path") ?? "/admin/";
  const session = await requireAdmin(path);

  const [openTickets, overdueInvoices, newContacts] = await Promise.all([
    prisma.ticket.count({ where: { status: { in: ["OPEN", "IN_PROGRESS", "WAITING_CLIENT", "WAITING_INTERNAL"] } } }),
    prisma.invoice.count({ where: { status: { in: ["OVERDUE", "SENT"] }, paidAt: null } }),
    prisma.contactSubmission.count({ where: { status: "NEW" } }),
  ]);

  const groups: NavGroup[] = [
    {
      items: [
        { href: "/admin/", label: "Overview", icon: "dashboard" },
      ],
    },
    {
      title: "Operate",
      items: [
        { href: "/admin/clients/", label: "Clients", icon: "users" },
        { href: "/admin/tickets/", label: "Tickets", icon: "ticket", count: openTickets },
        { href: "/admin/invoices/", label: "Invoices", icon: "invoice", count: overdueInvoices },
      ],
    },
    {
      title: "Engage",
      items: [
        { href: "/admin/contacts/", label: "Contact Inbox", icon: "mail", count: newContacts },
        { href: "/admin/content/", label: "Content", icon: "newspaper" },
        { href: "/admin/documents/", label: "Documents", icon: "folder" },
      ],
    },
    {
      title: "Configure",
      items: [{ href: "/admin/settings/", label: "Settings", icon: "settings" }],
    },
  ];

  return (
    <AppShell
      groups={groups}
      brandLabel="V Solutions"
      brandSub="Admin Console"
      brandMark="VS"
      currentPath={path}
      user={{
        name: session.displayName,
        role: session.role,
        initials: initialsFor(session.displayName),
      }}
    >
      {children}
    </AppShell>
  );
}
