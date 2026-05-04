import Link from "next/link";
import { prisma } from "@vsi/db";
import { requireClient } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Invoices", robots: { index: false, follow: false } };

function fmtMoney(n: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(n);
}

export default async function ClientInvoicesPage() {
  const session = await requireClient("/portal/invoices/");

  const invoices = await prisma.invoice.findMany({
    where: { clientId: session.clientId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const totals = await prisma.invoice.aggregate({
    where: { clientId: session.clientId },
    _sum: { total: true, amountPaid: true },
  });

  const outstanding =
    Number(totals._sum.total ?? 0) - Number(totals._sum.amountPaid ?? 0);

  return (
    <>
      <header className="app-header">
        <div>
          <h1>Invoices</h1>
          <p className="sub">
            <strong style={{ color: "var(--rose-deep)" }}>{fmtMoney(outstanding, "USD")}</strong> outstanding ·
            {" "}
            {fmtMoney(Number(totals._sum.amountPaid ?? 0), "USD")} paid to date
          </p>
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
                  <th>Issued</th>
                  <th>Due</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => {
                  const overdue = inv.status !== "PAID" && new Date(inv.dueDate) < new Date();
                  return (
                    <tr key={inv.id}>
                      <td className="num">{inv.number}</td>
                      <td>{new Date(inv.issueDate).toLocaleDateString()}</td>
                      <td style={overdue ? { color: "var(--rose-deep)", fontWeight: 600 } : undefined}>
                        {new Date(inv.dueDate).toLocaleDateString()}
                      </td>
                      <td className="num">{fmtMoney(Number(inv.total), inv.currency)}</td>
                      <td className="num">{fmtMoney(Number(inv.amountPaid), inv.currency)}</td>
                      <td>
                        <span className={`badge badge-${inv.status}`}>{inv.status.replace(/_/g, " ")}</span>
                      </td>
                      <td>
                        <Link href={`/invoices/view/${inv.publicViewToken}/`} className="btn btn-ghost" style={{ padding: ".4rem .85rem", fontSize: ".82rem" }}>
                          View
                        </Link>
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
