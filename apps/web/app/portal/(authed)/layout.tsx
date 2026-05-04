import { headers } from "next/headers";
import { prisma } from "@vsi/db";
import { requireClient } from "@/lib/session";
import { AppShell, type NavGroup } from "@/components/site/AppShell";

export const dynamic = "force-dynamic";

function initialsFor(first: string, last?: string | null) {
  return ((first?.[0] ?? "?") + (last?.[0] ?? "")).toUpperCase();
}

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const hdrs = await headers();
  const path = hdrs.get("x-pathname") ?? "/portal/dashboard/";
  const session = await requireClient(path);

  const [openTickets, unpaidInvoices] = await Promise.all([
    prisma.ticket.count({
      where: {
        clientId: session.clientId,
        status: { in: ["OPEN", "IN_PROGRESS", "WAITING_CLIENT"] },
      },
    }),
    prisma.invoice.count({
      where: { clientId: session.clientId, status: { in: ["SENT", "VIEWED", "PARTIALLY_PAID", "OVERDUE"] } },
    }),
  ]);

  const groups: NavGroup[] = [
    {
      items: [
        { href: "/portal/dashboard/", label: "Dashboard", icon: "dashboard" },
        { href: "/portal/tickets/", label: "Tickets", icon: "ticket", count: openTickets },
        { href: "/portal/invoices/", label: "Invoices", icon: "invoice", count: unpaidInvoices },
        { href: "/portal/documents/", label: "Documents", icon: "folder" },
      ],
    },
    {
      title: "Account",
      items: [{ href: "/portal/settings/", label: "Settings", icon: "settings" }],
    },
  ];

  return (
    <AppShell
      groups={groups}
      brandLabel={session.clientName}
      brandSub="Client Portal"
      brandColor={session.brandColor}
      currentPath={path}
      user={{
        name: `${session.firstName} ${session.lastName ?? ""}`.trim(),
        role: session.role,
        initials: initialsFor(session.firstName, session.lastName),
      }}
    >
      {children}
    </AppShell>
  );
}
