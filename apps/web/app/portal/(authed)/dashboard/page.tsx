import Link from "next/link";
import { prisma } from "@vsi/db";
import { requireClient } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard", robots: { index: false, follow: false } };

type WidgetSpec = { type: string; order?: number; config?: Record<string, unknown> };

function fmtMoney(n: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
}

function fmtTimeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400_000);
  if (days >= 1) return `${days}d ago`;
  const hours = Math.floor(diff / 3_600_000);
  return hours >= 1 ? `${hours}h ago` : `${Math.max(1, Math.floor(diff / 60_000))}m ago`;
}

export default async function ClientDashboardPage() {
  const session = await requireClient("/portal/dashboard/");

  const client = await prisma.client.findUnique({
    where: { id: session.clientId },
    include: {
      projects: { where: { status: { not: "CANCELLED" } }, orderBy: { createdAt: "desc" }, take: 5 },
    },
  });
  if (!client) return <div className="panel-empty">Client not found.</div>;

  const cfg = (client.dashboardConfig as { widgets?: WidgetSpec[] }) ?? {};
  const widgets =
    cfg.widgets && cfg.widgets.length
      ? [...cfg.widgets].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      : [
          { type: "tickets-summary", order: 1 },
          { type: "invoices-summary", order: 2 },
          { type: "active-projects", order: 3 },
          { type: "recent-activity", order: 4 },
        ];

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [
    openTickets,
    inProgressTickets,
    resolvedThisMonth,
    invoiceTotalsAll,
    invoiceTotalsUnpaid,
    paidThisYear,
    recentActivity,
  ] = await Promise.all([
    prisma.ticket.count({ where: { clientId: client.id, status: "OPEN" } }),
    prisma.ticket.count({ where: { clientId: client.id, status: "IN_PROGRESS" } }),
    prisma.ticket.count({
      where: { clientId: client.id, status: "RESOLVED", resolvedAt: { gte: monthStart } },
    }),
    prisma.invoice.aggregate({
      where: { clientId: client.id },
      _sum: { total: true, amountPaid: true },
    }),
    prisma.invoice.aggregate({
      where: { clientId: client.id, status: { in: ["SENT", "VIEWED", "PARTIALLY_PAID", "OVERDUE"] } },
      _sum: { total: true, amountPaid: true },
    }),
    prisma.invoice.aggregate({
      where: {
        clientId: client.id,
        status: "PAID",
        paidAt: { gte: new Date(new Date().getFullYear(), 0, 1) },
      },
      _sum: { amountPaid: true },
    }),
    prisma.ticketComment.findMany({
      where: { ticket: { clientId: client.id }, isInternal: false },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { ticket: { select: { number: true, subject: true } } },
    }),
  ]);

  const outstandingTotal =
    Number(invoiceTotalsUnpaid._sum.total ?? 0) - Number(invoiceTotalsUnpaid._sum.amountPaid ?? 0);

  // resolve admin / client comment authors
  const adminIds = recentActivity.filter((c) => c.authorType === "ADMIN").map((c) => c.authorId);
  const clientIds = recentActivity.filter((c) => c.authorType === "CLIENT").map((c) => c.authorId);
  const [admins, clients] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: adminIds } }, select: { id: true, displayName: true } }),
    prisma.clientUser.findMany({ where: { id: { in: clientIds } }, select: { id: true, firstName: true, lastName: true } }),
  ]);
  const adminMap = new Map(admins.map((a) => [a.id, a.displayName]));
  const clientMap = new Map(clients.map((c) => [c.id, `${c.firstName} ${c.lastName ?? ""}`.trim()]));

  return (
    <>
      <header className="app-header">
        <div>
          <h1>
            Welcome back, <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400 }}>{session.firstName}</em>
          </h1>
          <p className="sub">
            {client.companyName} · {client.services.join(" · ") || "—"}
          </p>
        </div>
        <div className="app-header-actions">
          <Link href="/portal/tickets/new/" className="btn btn-primary">
            Open ticket <span className="btn-arrow">→</span>
          </Link>
          <Link href="/portal/invoices/" className="btn btn-ghost">
            View invoices
          </Link>
        </div>
      </header>

      <section className="widget-grid">
        {widgets.map((w, i) => {
          switch (w.type) {
            case "tickets-summary":
              return (
                <div key={i} className="widget-card">
                  <div className="widget-head">
                    <h3>Tickets</h3>
                    <Link href="/portal/tickets/">All →</Link>
                  </div>
                  <div className="metric-row">
                    <div className="metric">
                      <span className="v">{openTickets}</span>
                      <span className="l">Open</span>
                    </div>
                    <div className="metric">
                      <span className="v">{inProgressTickets}</span>
                      <span className="l">In Progress</span>
                    </div>
                    <div className="metric">
                      <span className="v">
                        <em>{resolvedThisMonth}</em>
                      </span>
                      <span className="l">Resolved · MTD</span>
                    </div>
                  </div>
                </div>
              );
            case "invoices-summary":
              return (
                <div key={i} className="widget-card">
                  <div className="widget-head">
                    <h3>Invoices</h3>
                    <Link href="/portal/invoices/">All →</Link>
                  </div>
                  <div className="metric-row">
                    <div className="metric">
                      <span className="v" style={{ color: "var(--rose-deep)" }}>
                        {fmtMoney(outstandingTotal, client.defaultCurrency)}
                      </span>
                      <span className="l">Outstanding</span>
                    </div>
                    <div className="metric">
                      <span className="v">{fmtMoney(Number(paidThisYear._sum.amountPaid ?? 0), client.defaultCurrency)}</span>
                      <span className="l">Paid · YTD</span>
                    </div>
                    <div className="metric">
                      <span className="v">{fmtMoney(Number(invoiceTotalsAll._sum.total ?? 0), client.defaultCurrency)}</span>
                      <span className="l">Total Billed</span>
                    </div>
                  </div>
                </div>
              );
            case "active-projects":
              return (
                <div key={i} className="widget-card">
                  <div className="widget-head">
                    <h3>Active projects</h3>
                  </div>
                  {client.projects.length === 0 ? (
                    <div style={{ color: "var(--muted)", fontSize: ".88rem" }}>No active projects.</div>
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
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            case "service-usage":
              return (
                <div key={i} className="widget-card">
                  <div className="widget-head">
                    <h3>Services engaged</h3>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
                    {(client.services.length ? client.services : ["—"]).map((s) => (
                      <span key={s} className="badge badge-MEDIUM">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              );
            case "recent-activity":
              return (
                <div key={i} className="widget-card span-12">
                  <div className="widget-head">
                    <h3>Recent activity</h3>
                  </div>
                  <div className="timeline">
                    {recentActivity.length === 0 ? (
                      <div style={{ color: "var(--muted)", fontSize: ".88rem" }}>No recent activity.</div>
                    ) : (
                      recentActivity.map((c) => {
                        const author =
                          c.authorType === "ADMIN" ? adminMap.get(c.authorId) ?? "V Solutions team" : clientMap.get(c.authorId) ?? "Your team";
                        return (
                          <div key={c.id} className="timeline-item">
                            <div className="timeline-icon">{c.authorType === "ADMIN" ? "🛡" : "👤"}</div>
                            <div className="timeline-body">
                              <div className="timeline-text">
                                <strong>{author}</strong> commented on{" "}
                                <Link href={`/portal/tickets/${c.ticketId}/`}>
                                  {c.ticket.number} — {c.ticket.subject}
                                </Link>
                              </div>
                              <div className="timeline-time">{fmtTimeAgo(c.createdAt)}</div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            case "custom-html":
              return (
                <div key={i} className="widget-card span-12">
                  <div className="widget-head">
                    <h3>{(w.config?.title as string) ?? "Announcement"}</h3>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: (w.config?.html as string) ?? "" }}
                    style={{ color: "var(--ink-2)", lineHeight: 1.6 }}
                  />
                </div>
              );
            default:
              return null;
          }
        })}
      </section>
    </>
  );
}
