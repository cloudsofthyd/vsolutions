import Link from "next/link";
import { prisma } from "@vsi/db";
import { requireClient } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tickets", robots: { index: false, follow: false } };

function fmtTimeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400_000);
  if (days >= 1) return `${days}d ago`;
  const hours = Math.floor(diff / 3_600_000);
  return hours >= 1 ? `${hours}h ago` : `${Math.max(1, Math.floor(diff / 60_000))}m ago`;
}

export default async function ClientTicketsPage() {
  const session = await requireClient("/portal/tickets/");

  const tickets = await prisma.ticket.findMany({
    where: { clientId: session.clientId },
    orderBy: { updatedAt: "desc" },
    include: { reporter: true, assignee: true },
    take: 100,
  });

  return (
    <>
      <header className="app-header">
        <div>
          <h1>Tickets</h1>
          <p className="sub">All requests for {session.clientName}</p>
        </div>
        <div className="app-header-actions">
          <Link href="/portal/tickets/new/" className="btn btn-primary">
            Open new ticket <span className="btn-arrow">→</span>
          </Link>
        </div>
      </header>

      <div className="panel">
        <div className="panel-body panel-body--flush">
          {tickets.length === 0 ? (
            <div className="panel-empty">
              No tickets yet. <Link href="/portal/tickets/new/">Open your first one</Link>.
            </div>
          ) : (
            <table className="app-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Subject</th>
                  <th>Reported by</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Last update</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td className="num">
                      <Link href={`/portal/tickets/${t.id}/`}>{t.number}</Link>
                    </td>
                    <td>
                      <Link href={`/portal/tickets/${t.id}/`}>{t.subject}</Link>
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
