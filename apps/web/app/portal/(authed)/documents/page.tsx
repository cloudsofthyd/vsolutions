import { prisma } from "@vsi/db";
import { requireClient } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Documents", robots: { index: false, follow: false } };

export default async function ClientDocumentsPage() {
  const session = await requireClient("/portal/documents/");

  const docs = await prisma.clientDocument.findMany({
    where: { clientId: session.clientId, visibility: "CLIENT" },
    orderBy: { uploadedAt: "desc" },
  });

  return (
    <>
      <header className="app-header">
        <div>
          <h1>Documents</h1>
          <p className="sub">Contracts, deliverables, and reports shared by your account team.</p>
        </div>
      </header>

      <div className="panel">
        <div className="panel-body">
          {docs.length === 0 ? (
            <div className="panel-empty">
              No documents yet. Your account manager will share contracts and deliverables here.
            </div>
          ) : (
            <table className="app-table">
              <thead>
                <tr>
                  <th>File</th>
                  <th>Category</th>
                  <th>Size</th>
                  <th>Uploaded</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <a href={d.url} target="_blank" rel="noopener noreferrer">
                        {d.filename}
                      </a>
                    </td>
                    <td>{d.category ?? "—"}</td>
                    <td className="num">{(d.filesize / 1024 / 1024).toFixed(2)} MB</td>
                    <td>{new Date(d.uploadedAt).toLocaleDateString()}</td>
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
