import Link from "next/link";
import { prisma } from "@vsi/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { generateToken, hashToken } from "@vsi/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Create client · Admin", robots: { index: false, follow: false } };

async function createClientAction(formData: FormData) {
  "use server";

  const admin = await requireAdmin("/admin/clients/new/");

  const companyName = String(formData.get("companyName") || "").trim();
  const industry = String(formData.get("industry") || "").trim();
  const services = String(formData.get("services") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const billingEmail = String(formData.get("billingEmail") || "").trim() || null;
  const taxId = String(formData.get("taxId") || "").trim() || null;
  const defaultCurrency = String(formData.get("defaultCurrency") || "USD");
  const paymentTerms = parseInt(String(formData.get("paymentTerms") || "30"), 10);
  const brandColor = String(formData.get("brandColor") || "").trim() || null;

  // Primary contact
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim() || null;
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const jobTitle = String(formData.get("jobTitle") || "").trim() || null;
  const phone = String(formData.get("phone") || "").trim() || null;

  if (!companyName || !firstName || !email) {
    redirect("/admin/clients/new/?error=" + encodeURIComponent("Company name, contact name, and email are required."));
  }

  // Slug
  const baseSlug = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "client";
  let slug = baseSlug;
  let n = 2;
  while (await prisma.client.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${n++}`;
  }

  // Default dashboard config
  const dashboardConfig = {
    widgets: [
      { type: "tickets-summary", order: 1 },
      { type: "invoices-summary", order: 2 },
      { type: "active-projects", order: 3 },
      { type: "recent-activity", order: 4 },
    ],
  };

  const client = await prisma.client.create({
    data: {
      companyName,
      slug,
      industry: industry || null,
      services,
      billingEmail,
      taxId,
      defaultCurrency,
      paymentTerms: Number.isFinite(paymentTerms) ? paymentTerms : 30,
      brandColor,
      accountManagerId: admin.id,
      dashboardConfig,
      createdBy: admin.id,
    },
  });

  // Create primary client user (passwordHash null until invite accepted)
  const cu = await prisma.clientUser.create({
    data: {
      clientId: client.id,
      email,
      firstName,
      lastName,
      jobTitle,
      phone,
      role: "OWNER",
      invitedBy: admin.id,
    },
  });

  // Create invitation token (24h)
  const token = generateToken(24);
  await prisma.clientInvitation.create({
    data: {
      clientUserId: cu.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      invitedBy: admin.id,
    },
  });

  // Log auth event (email send is wired in Phase 12)
  await prisma.authEvent.create({
    data: {
      type: "client_invite_sent",
      clientUserId: cu.id,
      metadata: { clientId: client.id, email, byAdmin: admin.id },
    },
  });

  await prisma.client.update({ where: { id: client.id }, data: { primaryContactId: cu.id } });

  revalidatePath("/admin/clients/");
  redirect(`/admin/clients/${client.id}/?invited=${encodeURIComponent(email)}`);
}

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function CreateClientPage({ searchParams }: Props) {
  const sp = await searchParams;

  return (
    <>
      <header className="app-header">
        <div>
          <h1>Create a new client</h1>
          <p className="sub">
            We&apos;ll set up the workspace and email an invitation to the primary contact. Public sign-up is disabled — every account is admin-created.
          </p>
        </div>
        <div className="app-header-actions">
          <Link href="/admin/clients/" className="btn btn-ghost">
            ← Back
          </Link>
        </div>
      </header>

      {sp.error ? <div className="auth-flash auth-flash--error">{sp.error}</div> : null}

      <form action={createClientAction} className="form-card">
        <h3>Company</h3>
        <div className="form-row">
          <label>
            Company name
            <input name="companyName" required placeholder="Acme Corp" />
          </label>
          <label>
            Industry
            <input name="industry" placeholder="B2B SaaS" />
          </label>
        </div>
        <label>
          Services assigned
          <input name="services" placeholder="AI, Cloud, Security" />
          <span className="helper">Comma-separated. These tag the engagement scope.</span>
        </label>
        <div className="form-row">
          <label>
            Default currency
            <select name="defaultCurrency" defaultValue="USD">
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — Pound</option>
              <option value="INR">INR — Rupee</option>
              <option value="CAD">CAD — Canadian Dollar</option>
            </select>
          </label>
          <label>
            Payment terms (days)
            <input type="number" name="paymentTerms" defaultValue={30} min={0} max={120} />
          </label>
        </div>
        <div className="form-row">
          <label>
            Billing email
            <input type="email" name="billingEmail" placeholder="billing@example.com" />
          </label>
          <label>
            Tax ID
            <input name="taxId" placeholder="EIN / GST / VAT" />
          </label>
        </div>
        <label>
          Brand accent color (optional)
          <input name="brandColor" placeholder="#6366F1" />
          <span className="helper">Used to theme this client&apos;s portal. Leave blank to use the default V Solutions accent.</span>
        </label>

        <h3 style={{ marginTop: "1rem" }}>Primary contact</h3>
        <div className="form-row">
          <label>
            First name
            <input name="firstName" required />
          </label>
          <label>
            Last name
            <input name="lastName" />
          </label>
        </div>
        <label>
          Email
          <input type="email" name="email" required />
          <span className="helper">An invitation link will be emailed to this address (24-hour expiry).</span>
        </label>
        <div className="form-row">
          <label>
            Job title
            <input name="jobTitle" placeholder="CTO" />
          </label>
          <label>
            Phone
            <input name="phone" placeholder="+1 …" />
          </label>
        </div>

        <div className="form-actions">
          <Link href="/admin/clients/" className="btn btn-ghost">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Create &amp; send invite <span className="btn-arrow">→</span>
          </button>
        </div>
      </form>
    </>
  );
}
