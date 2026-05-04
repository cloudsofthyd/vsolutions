import Link from "next/link";
import { prisma } from "@vsi/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Clients · Admin", robots: { index: false, follow: false } };

export default async function AdminClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { users: true, tickets: true, invoices: true } },
      accountManager: { select: { displayName: true } },
    },
  });

  return (
    <>
      <header className="app-header">
        <div>
          <h1>Clients</h1>
          <p className="sub">{clients.length} accounts in book</p>
        </div>
        <div className="app-header-actions">
          <Link href="/admin/clients/new/" className="btn btn-primary">
            New client <span className="btn-arrow">→</span>
          </Link>
        </div>
      </header>

      <div className="panel">
        <div className="panel-body panel-body--flush">
          {clients.length === 0 ? (
            <div className="panel-empty">
              No clients yet. <Link href="/admin/clients/new/">Create your first one.</Link>
            </div>
          ) : (
            <table className="app-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Account Manager</th>
                  <th>Users</th>
                  <th>Tickets</th>
                  <th>Invoices</th>
                  <th>Industry</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link href={`/admin/clients/${c.id}/`}>
                        <strong style={{ color: "var(--ink)" }}>{c.companyName}</strong>
                      </Link>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: ".7rem", color: "var(--muted)", marginTop: ".15rem" }}>
                        /{c.slug}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${c.status}`}>{c.status}</span>
                    </td>
                    <td>{c.accountManager?.displayName ?? "—"}</td>
                    <td className="num">{c._count.users}</td>
                    <td className="num">{c._count.tickets}</td>
                    <td className="num">{c._count.invoices}</td>
                    <td>{c.industry ?? "—"}</td>
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
