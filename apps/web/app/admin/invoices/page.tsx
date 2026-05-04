import Link from "next/link";
import { prisma } from "@vsi/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Invoices · Admin", robots: { index: false, follow: false } };

function fmtMoney(n: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(n);
}

function daysFromNow(date: Date) {
  return Math.floor((new Date(date).getTime() - Date.now()) / 86400_000);
}

export default async function AdminInvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: true },
    take: 100,
  });

  const totals = await prisma.invoice.aggregate({
    _sum: { total: true, amountPaid: true },
  });

  const outstandingTotal = Number(totals._sum.total ?? 0) - Number(totals._sum.amountPaid ?? 0);

  return (
    <>
      <header className="app-header">
        <div>
          <h1>Invoices</h1>
          <p className="sub">
            {invoices.length} invoices · {fmtMoney(Number(totals._sum.total ?? 0), "USD")} billed total ·
            {" "}
            <strong style={{ color: "var(--rose-deep)" }}>{fmtMoney(outstandingTotal, "USD")}</strong> outstanding
          </p>
        </div>
        <div className="app-header-actions">
          <Link href="/admin/invoices/new/" className="btn btn-primary">
            New invoice <span className="btn-arrow">→</span>
          </Link>
        </div>
      </header>

      <div className="panel">
        <div className="panel-body panel-body--flush">
          {invoices.length === 0 ? (
            <div className="panel-empty">No invoices yet.</div>
          ) : (
            <table className="app-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Client</th>
                  <th>Issued</th>
                  <th>Due</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => {
                  const days = daysFromNow(inv.dueDate);
                  const overdue = inv.status !== "PAID" && days < 0;
                  return (
                    <tr key={inv.id}>
                      <td>
                        <Link href={`/admin/invoices/${inv.id}/`} className="num">
                          {inv.number}
                        </Link>
                      </td>
                      <td>
                        <Link href={`/admin/clients/${inv.clientId}/`}>{inv.client.companyName}</Link>
                      </td>
                      <td>{new Date(inv.issueDate).toLocaleDateString()}</td>
                      <td style={overdue ? { color: "var(--rose-deep)", fontWeight: 600 } : undefined}>
                        {new Date(inv.dueDate).toLocaleDateString()}
                        {overdue ? (
                          <div style={{ fontSize: ".7rem", color: "var(--rose-deep)" }}>
                            {Math.abs(days)}d overdue
                          </div>
                        ) : null}
                      </td>
                      <td className="num">{fmtMoney(Number(inv.total), inv.currency)}</td>
                      <td className="num">{fmtMoney(Number(inv.amountPaid), inv.currency)}</td>
                      <td>
                        <span className={`badge badge-${inv.status}`}>{inv.status.replace(/_/g, " ")}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
