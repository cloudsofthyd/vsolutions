import Link from "next/link";
import { prisma } from "@vsi/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Overview", robots: { index: false, follow: false } };

function fmtMoney(amount: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

function fmtTimeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400_000);
  if (days >= 1) return `${days}d ago`;
  const hours = Math.floor(diff / 3_600_000);
  if (hours >= 1) return `${hours}h ago`;
  const mins = Math.max(1, Math.floor(diff / 60_000));
  return `${mins}m ago`;
}

export default async function AdminOverviewPage() {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [
    activeClients,
    totalClients,
    openTickets,
    overdueInvoices,
    paidThisMonth,
    revenueAgg,
    newContacts,
    recentTickets,
    recentInvoices,
    recentContacts,
  ] = await Promise.all([
    prisma.client.count({ where: { status: "ACTIVE" } }),
    prisma.client.count(),
    prisma.ticket.count({
      where: { status: { in: ["OPEN", "IN_PROGRESS", "WAITING_CLIENT", "WAITING_INTERNAL"] } },
    }),
    prisma.invoice.count({ where: { status: { in: ["OVERDUE", "SENT"] }, paidAt: null } }),
    prisma.invoice.aggregate({
      where: { status: "PAID", paidAt: { gte: monthStart } },
      _sum: { amountPaid: true },
    }),
    prisma.invoice.aggregate({
      where: { paidAt: { gte: monthStart } },
      _sum: { amountPaid: true },
    }),
    prisma.contactSubmission.count({ where: { status: "NEW" } }),
    prisma.ticket.findMany({
      take: 6,
      orderBy: { updatedAt: "desc" },
      include: { client: true, reporter: true, assignee: true },
    }),
    prisma.invoice.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { client: true },
    }),
    prisma.contactSubmission.findMany({
      where: { status: "NEW" },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const monthRevenue = Number(paidThisMonth._sum.amountPaid ?? 0);

  return (
    <>
      <header className="app-header">
        <div>
          <h1>
            Operations <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400 }}>overview</em>
          </h1>
          <p className="sub">Real-time pulse across clients, tickets, and revenue.</p>
        </div>
        <div className="app-header-actions">
          <Link href="/admin/clients/new/" className="btn btn-primary">
            Create client <span className="btn-arrow">→</span>
          </Link>
          <Link href="/admin/invoices/new/" className="btn btn-ghost">
            New invoice
          </Link>
        </div>
      </header>

      <section className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Active Clients</span>
          <span className="kpi-value">{activeClients}</span>
          <span className="kpi-delta">{totalClients} total in book</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Open Tickets</span>
          <span className="kpi-value">{openTickets}</span>
          <span className="kpi-delta">awaiting team action</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Outstanding Invoices</span>
          <span className="kpi-value">{overdueInvoices}</span>
          <span className="kpi-delta down">unpaid · sent or overdue</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Revenue · This Month</span>
          <span className="kpi-value">
            <em>{fmtMoney(monthRevenue)}</em>
          </span>
          <span className="kpi-delta up">collected through today</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">New Contact Submissions</span>
          <span className="kpi-value">{newContacts}</span>
          <span className="kpi-delta">awaiting first response</span>
        </div>
      </section>

      <section className="two-col">
        <div className="panel">
          <div className="panel-head">
            <h3>Latest tickets</h3>
            <Link href="/admin/tickets/" className="panel-meta">
              View all →
            </Link>
          </div>
          <div className="panel-body panel-body--flush">
            {recentTickets.length === 0 ? (
              <div className="panel-empty">No tickets yet.</div>
            ) : (
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Client</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTickets.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <Link href={`/admin/tickets/${t.id}/`}>
                          <span className="num">{t.number}</span>
                          <div style={{ fontSize: ".82rem", color: "var(--muted)", marginTop: ".15rem" }}>{t.subject}</div>
                        </Link>
                      </td>
                      <td>{t.client.companyName}</td>
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

        <div className="panel">
          <div className="panel-head">
            <h3>Recent invoices</h3>
            <Link href="/admin/invoices/" className="panel-meta">
              View all →
            </Link>
          </div>
          <div className="panel-body panel-body--flush">
            {recentInvoices.length === 0 ? (
              <div className="panel-empty">No invoices yet.</div>
            ) : (
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Client</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((inv) => (
                    <tr key={inv.id}>
                      <td>
                        <Link href={`/admin/invoices/${inv.id}/`}>
                          <span className="num">{inv.number}</span>
                        </Link>
                      </td>
                      <td>{inv.client.companyName}</td>
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
      </section>

      <section className="panel">
        <div className="panel-head">
          <h3>New contact submissions</h3>
          <Link href="/admin/contacts/" className="panel-meta">
            View inbox →
          </Link>
        </div>
        <div className="panel-body panel-body--flush">
          {recentContacts.length === 0 ? (
            <div className="panel-empty">Inbox is clear.</div>
          ) : (
            <table className="app-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Service</th>
                  <th>Message</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {recentContacts.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong style={{ display: "block", color: "var(--ink)" }}>{c.name}</strong>
                      <span style={{ color: "var(--muted)", fontSize: ".82rem" }}>{c.email}</span>
                    </td>
                    <td>{c.service ?? "—"}</td>
                    <td style={{ maxWidth: 380, color: "var(--muted)" }}>
                      {c.message.slice(0, 100)}
                      {c.message.length > 100 ? "…" : ""}
                    </td>
                    <td>{fmtTimeAgo(c.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
}
