import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@vsi/db";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ invited?: string }>;
}

function fmtMoney(n: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
}

export default async function AdminClientDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      users: { orderBy: { createdAt: "asc" } },
      tickets: { orderBy: { createdAt: "desc" }, take: 5, include: { reporter: true } },
      invoices: { orderBy: { createdAt: "desc" }, take: 5 },
      projects: { orderBy: { createdAt: "desc" }, take: 5 },
      accountManager: true,
      _count: { select: { tickets: true, invoices: true, users: true, documents: true } },
    },
  });

  if (!client) notFound();

  const totalBilled = client.invoices.reduce((s, inv) => s + Number(inv.total), 0);
  const totalPaid = client.invoices.reduce((s, inv) => s + Number(inv.amountPaid), 0);

  return (
    <>
      <header className="app-header">
        <div>
          <h1>{client.companyName}</h1>
          <p className="sub">
            <span className={`badge badge-${client.status}`}>{client.status}</span>
            {client.industry ? <> · {client.industry}</> : null}
            {client.accountManager ? <> · Managed by {client.accountManager.displayName}</> : null}
          </p>
        </div>
        <div className="app-header-actions">
          <Link href={`/admin/tickets/?client=${client.id}`} className="btn btn-ghost">
            Tickets
          </Link>
          <Link href={`/admin/invoices/new/?client=${client.id}`} className="btn btn-primary">
            New invoice <span className="btn-arrow">→</span>
          </Link>
        </div>
      </header>

      {sp.invited ? (
        <div className="auth-flash">
          Invitation sent to <strong>{sp.invited}</strong>. The client has 24 hours to accept and set a password.
          (Email delivery is wired in Phase 12 — invitation token logged to the database.)
        </div>
      ) : null}

      <section className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Users</span>
          <span className="kpi-value">{client._count.users}</span>
          <span className="kpi-delta">portal accounts</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Tickets</span>
          <span className="kpi-value">{client._count.tickets}</span>
          <span className="kpi-delta">all-time</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Invoices</span>
          <span className="kpi-value">{client._count.invoices}</span>
          <span className="kpi-delta">all-time</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Total Billed</span>
          <span className="kpi-value">
            <em>{fmtMoney(totalBilled, client.defaultCurrency)}</em>
          </span>
          <span className="kpi-delta up">{fmtMoney(totalPaid, client.defaultCurrency)} collected</span>
        </div>
      </section>

      <div className="two-col">
        <div className="panel">
          <div className="panel-head">
            <h3>Users on this account</h3>
            <span className="panel-meta">{client.users.length} total</span>
          </div>
          <div className="panel-body panel-body--flush">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {client.users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong style={{ color: "var(--ink)" }}>
                        {u.firstName} {u.lastName ?? ""}
                      </strong>
                      {u.jobTitle ? (
                        <div style={{ fontSize: ".78rem", color: "var(--muted)" }}>{u.jobTitle}</div>
                      ) : null}
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className="badge badge-MEDIUM">{u.role}</span>
                    </td>
                    <td>
                      {u.acceptedAt ? (
                        <span className="badge badge-RESOLVED">Active</span>
                      ) : (
                        <span className="badge badge-OPEN">Invited</span>
                      )}
                    </td>
                  </tr>
                ))}
                {client.users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="panel-empty">
                      No users yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Active projects</h3>
          </div>
          <div className="panel-body">
            {client.projects.length === 0 ? (
              <div className="panel-empty">No projects yet.</div>
            ) : (
              <div>
                {client.projects.map((p) => (
                  <div key={p.id} className="project-row">
                    <div className="project-meta">
                      <span className="project-name">{p.name}</span>
                      <span className="project-pct">{p.progress}%</span>
                    </div>
                    <div className="project-bar">
                      <div className="project-bar-fill" style={{ width: `${p.progress}%` }} />
                    </div>
                    <div style={{ fontSize: ".78rem", color: "var(--muted)" }}>
                      <span className={`badge badge-${p.status === "ACTIVE" ? "RESOLVED" : "OPEN"}`}>{p.status}</span>
                      {p.endDate ? <> · due {new Date(p.endDate).toLocaleDateString()}</> : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Recent tickets</h3>
          <Link href="/admin/tickets/" className="panel-meta">
            View all →
          </Link>
        </div>
        <div className="panel-body panel-body--flush">
          {client.tickets.length === 0 ? (
            <div className="panel-empty">No tickets yet for this client.</div>
          ) : (
            <table className="app-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Subject</th>
                  <th>Reporter</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {client.tickets.map((t) => (
                  <tr key={t.id}>
                    <td className="num">{t.number}</td>
                    <td>{t.subject}</td>
                    <td>
                      {t.reporter.firstName} {t.reporter.lastName ?? ""}
                    </td>
                    <td>
                      <span className={`badge badge-${t.priority}`}>{t.priority}</span>
                    </td>
                    <td>
                      <span className={`badge badge-${t.status}`}>{t.status.replace(/_/g, " ")}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Recent invoices</h3>
        </div>
        <div className="panel-body panel-body--flush">
          {client.invoices.length === 0 ? (
            <div className="panel-empty">No invoices yet.</div>
          ) : (
            <table className="app-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Issued</th>
                  <th>Due</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {client.invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="num">{inv.number}</td>
                    <td>{new Date(inv.issueDate).toLocaleDateString()}</td>
                    <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
                    <td className="num">{fmtMoney(Number(inv.total), inv.currency)}</td>
                    <td>
                      <span className={`badge badge-${inv.status}`}>{inv.status.replace(/_/g, " ")}</span>
                    </td>
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
