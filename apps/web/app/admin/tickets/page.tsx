import Link from "next/link";
import { prisma } from "@vsi/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tickets · Admin", robots: { index: false, follow: false } };

interface Props {
  searchParams: Promise<{ status?: string; priority?: string; client?: string; q?: string }>;
}

function fmtTimeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400_000);
  if (days >= 1) return `${days}d ago`;
  const hours = Math.floor(diff / 3_600_000);
  return hours >= 1 ? `${hours}h ago` : `${Math.max(1, Math.floor(diff / 60_000))}m ago`;
}

export default async function AdminTicketsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const where: Record<string, unknown> = {};
  if (sp.client) where.clientId = sp.client;
  if (sp.status) where.status = sp.status;
  if (sp.priority) where.priority = sp.priority;
  if (sp.q) where.subject = { contains: sp.q, mode: "insensitive" };

  const [tickets, counts] = await Promise.all([
    prisma.ticket.findMany({
      where,
      orderBy: [{ priority: "desc" }, { updatedAt: "desc" }],
      include: { client: true, reporter: true, assignee: true },
      take: 100,
    }),
    prisma.ticket.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const countByStatus = Object.fromEntries(counts.map((c) => [c.status, c._count._all]));

  return (
    <>
      <header className="app-header">
        <div>
          <h1>Tickets</h1>
          <p className="sub">{tickets.length} matching</p>
        </div>
        <div className="app-toolbar">
          <Link href="/admin/tickets/" className={`badge ${!sp.status ? "badge-RESOLVED" : "badge-CLOSED"}`}>
            All ({tickets.length})
          </Link>
          <Link href="/admin/tickets/?status=OPEN" className={`badge badge-OPEN`}>
            Open ({countByStatus.OPEN ?? 0})
          </Link>
          <Link href="/admin/tickets/?status=IN_PROGRESS" className={`badge badge-IN_PROGRESS`}>
            In Progress ({countByStatus.IN_PROGRESS ?? 0})
          </Link>
          <Link href="/admin/tickets/?status=WAITING_INTERNAL" className={`badge badge-WAITING_INTERNAL`}>
            Waiting Internal ({countByStatus.WAITING_INTERNAL ?? 0})
          </Link>
          <Link href="/admin/tickets/?status=RESOLVED" className={`badge badge-RESOLVED`}>
            Resolved ({countByStatus.RESOLVED ?? 0})
          </Link>
        </div>
      </header>

      <div className="panel">
        <div className="panel-body panel-body--flush">
          {tickets.length === 0 ? (
            <div className="panel-empty">No tickets match.</div>
          ) : (
            <table className="app-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Subject</th>
                  <th>Client</th>
                  <th>Reporter</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assignee</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td className="num">
                      <Link href={`/admin/tickets/${t.id}/`}>{t.number}</Link>
                    </td>
                    <td>
                      <Link href={`/admin/tickets/${t.id}/`}>{t.subject}</Link>
                      {t.category ? (
                        <div style={{ fontSize: ".7rem", color: "var(--muted)", marginTop: ".15rem" }}>
                          {t.category}
                        </div>
                      ) : null}
                    </td>
                    <td>
                      <Link href={`/admin/clients/${t.clientId}/`}>{t.client.companyName}</Link>
                    </td>
                    <td>
                      {t.reporter.firstName} {t.reporter.lastName ?? ""}
                    </td>
                    <td>
                      <span className={`badge badge-${t.priority}`}>{t.priority}</span>
                    </td>
                    <td>
                      <span className={`badge badge-${t.status}`}>{t.status.replace(/_/g, " ")}</span>
                    </td>
                    <td>{t.assignee?.displayName ?? "Unassigned"}</td>
                    <td>{fmtTimeAgo(t.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
