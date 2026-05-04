import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@vsi/db";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

function fmtDateTime(date: Date) {
  return new Date(date).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default async function AdminTicketDetailPage({ params }: Props) {
  const { id } = await params;
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      client: true,
      reporter: true,
      assignee: true,
      project: true,
      comments: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!ticket) notFound();

  // Resolve comment authors via discriminator
  const adminIds = ticket.comments.filter((c) => c.authorType === "ADMIN").map((c) => c.authorId);
  const clientIds = ticket.comments.filter((c) => c.authorType === "CLIENT").map((c) => c.authorId);
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
            <span style={{ fontFamily: "var(--font-mono)", fontSize: ".95rem", color: "var(--muted)", marginRight: ".75rem" }}>
              {ticket.number}
            </span>
            {ticket.subject}
          </h1>
          <p className="sub">
            <span className={`badge badge-${ticket.status}`}>{ticket.status.replace(/_/g, " ")}</span>{" "}
            <span className={`badge badge-${ticket.priority}`}>{ticket.priority}</span>{" "}
            · Reported by {ticket.reporter.firstName} {ticket.reporter.lastName ?? ""} · {fmtDateTime(ticket.createdAt)}
            {" · "}
            <Link href={`/admin/clients/${ticket.client.id}/`}>{ticket.client.companyName}</Link>
          </p>
        </div>
        <div className="app-header-actions">
          <Link href="/admin/tickets/" className="btn btn-ghost">
            ← Tickets
          </Link>
        </div>
      </header>

      <div className="two-col">
        <div className="panel">
          <div className="panel-head">
            <h3>Conversation</h3>
            <span className="panel-meta">{ticket.comments.length} comments</span>
          </div>
          <div className="panel-body">
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-icon">📨</div>
                <div className="timeline-body">
                  <div className="timeline-text">
                    <strong>{ticket.reporter.firstName}</strong> opened this ticket
                  </div>
                  <div className="timeline-time">{fmtDateTime(ticket.createdAt)}</div>
                  <div style={{ marginTop: ".75rem", padding: "1rem", background: "var(--bg-2)", borderRadius: ".75rem", fontSize: ".95rem", lineHeight: 1.55 }}>
                    {ticket.description}
                  </div>
                </div>
              </div>
              {ticket.comments.map((c) => {
                const author =
                  c.authorType === "ADMIN" ? adminMap.get(c.authorId) ?? "Admin" : clientMap.get(c.authorId) ?? "Client";
                return (
                  <div key={c.id} className="timeline-item">
                    <div
                      className="timeline-icon"
                      style={
                        c.isInternal
                          ? { background: "linear-gradient(135deg,#f59e0b,#d97706)" }
                          : c.authorType === "ADMIN"
                            ? { background: "linear-gradient(135deg,#3b82f6,#1d4ed8)" }
                            : undefined
                      }
                    >
                      {c.authorType === "ADMIN" ? "🛡" : "👤"}
                    </div>
                    <div className="timeline-body">
                      <div className="timeline-text">
                        <strong>{author}</strong>
                        {c.isInternal ? <span className="badge badge-HIGH" style={{ marginLeft: ".5rem" }}>Internal note</span> : null}
                        {c.aiDraft ? <span className="badge badge-MEDIUM" style={{ marginLeft: ".5rem" }}>AI draft</span> : null}
                      </div>
                      <div className="timeline-time">{fmtDateTime(c.createdAt)}</div>
                      <div
                        style={{
                          marginTop: ".5rem",
                          padding: ".85rem 1rem",
                          background: c.isInternal ? "#fff7ed" : "var(--paper)",
                          border: c.isInternal ? "1px solid #fed7aa" : "1px solid var(--line)",
                          borderRadius: ".55rem",
                          fontSize: ".92rem",
                          lineHeight: 1.55,
                        }}
                      >
                        {c.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Details</h3>
          </div>
          <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: ".88rem" }}>
            <div>
              <div className="kpi-label">Client</div>
              <div style={{ marginTop: ".25rem" }}>
                <Link href={`/admin/clients/${ticket.client.id}/`}>{ticket.client.companyName}</Link>
              </div>
            </div>
            <div>
              <div className="kpi-label">Reporter</div>
              <div style={{ marginTop: ".25rem" }}>
                {ticket.reporter.firstName} {ticket.reporter.lastName ?? ""}
                <div style={{ color: "var(--muted)", fontSize: ".8rem" }}>{ticket.reporter.email}</div>
              </div>
            </div>
            <div>
              <div className="kpi-label">Assignee</div>
              <div style={{ marginTop: ".25rem" }}>{ticket.assignee?.displayName ?? "Unassigned"}</div>
            </div>
            <div>
              <div className="kpi-label">Type / Category</div>
              <div style={{ marginTop: ".25rem" }}>
                {ticket.type} {ticket.category ? `· ${ticket.category}` : ""}
              </div>
            </div>
            {ticket.project ? (
              <div>
                <div className="kpi-label">Project</div>
                <div style={{ marginTop: ".25rem" }}>{ticket.project.name}</div>
              </div>
            ) : null}
            {ticket.aiSummary ? (
              <div>
                <div className="kpi-label">AI Summary</div>
                <div style={{ marginTop: ".25rem", color: "var(--ink-2)", lineHeight: 1.5 }}>{ticket.aiSummary}</div>
              </div>
            ) : null}
            {ticket.satisfactionScore ? (
              <div>
                <div className="kpi-label">Satisfaction</div>
                <div style={{ marginTop: ".25rem", fontSize: "1.2rem" }}>
                  {"★".repeat(ticket.satisfactionScore)}
                  {"☆".repeat(5 - ticket.satisfactionScore)}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
