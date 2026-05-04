// Seed Phase 2 portal/helpdesk/invoicing essentials.
// Idempotent: re-runnable without dupes.

import {
  prisma,
  TicketPriority,
  TicketStatus,
  TicketType,
  ClientRole,
  InvoiceStatus,
  ClientStatus,
} from "@vsi/db";
import { hashPassword, generateToken } from "@vsi/auth";
import crypto from "node:crypto";

async function ensureAdmin() {
  const existing = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (existing) return existing;
  return prisma.user.create({
    data: {
      email: "admin@vsolutionsinc.com",
      username: "admin",
      displayName: "V Solutions Admin",
      role: "ADMIN",
      passwordHash: await hashPassword("VSolutions@2026"),
      passwordAlgo: "argon2id",
      emailVerified: new Date(),
    },
  });
}

async function seedSlaConfigs() {
  const rows = [
    { name: "Urgent", priority: TicketPriority.URGENT, responseHours: 1, resolutionHours: 4 },
    { name: "High", priority: TicketPriority.HIGH, responseHours: 4, resolutionHours: 24 },
    { name: "Medium", priority: TicketPriority.MEDIUM, responseHours: 8, resolutionHours: 72 },
    { name: "Low", priority: TicketPriority.LOW, responseHours: 24, resolutionHours: 168 },
  ];
  for (const r of rows) {
    await prisma.slaConfig.upsert({
      where: { priority: r.priority },
      update: { name: r.name, responseHours: r.responseHours, resolutionHours: r.resolutionHours, active: true },
      create: { ...r, active: true },
    });
  }
  return rows.length;
}

async function seedTaxRates() {
  const rows = [
    { name: "Michigan Sales Tax 6%", rate: 6.0, region: "US-MI" },
    { name: "GST 18%", rate: 18.0, region: "IN" },
    { name: "VAT 20%", rate: 20.0, region: "EU" },
    { name: "No Tax", rate: 0.0, region: null },
  ];
  for (const r of rows) {
    const found = await prisma.taxRate.findFirst({ where: { name: r.name } });
    if (!found) await prisma.taxRate.create({ data: r });
  }
  return rows.length;
}

async function seedServiceItems() {
  const rows = [
    { name: "AI / ML Consulting", category: "AI", unit: "hour", defaultPrice: 200, description: "Custom AI strategy, model selection, deployment." },
    { name: "AI Pipeline Engineering", category: "AI", unit: "project", defaultPrice: 25000, description: "End-to-end AI pipeline build." },
    { name: "Cloud DevOps Engineering", category: "Cloud", unit: "hour", defaultPrice: 175, description: "AWS/Azure/GCP architecture, CI/CD, IaC." },
    { name: "SRE Retainer", category: "Cloud", unit: "month", defaultPrice: 8500, description: "24/7 monitoring + incident response." },
    { name: "Cybersecurity Audit", category: "Security", unit: "project", defaultPrice: 12000, description: "SAST/DAST + penetration test + report." },
    { name: "SOC 2 Compliance Prep", category: "Security", unit: "project", defaultPrice: 18000, description: "Gap analysis + policies + evidence." },
    { name: "Mobile App Development", category: "Mobile", unit: "project", defaultPrice: 45000, description: "iOS or Android native build." },
    { name: "Cross-platform App", category: "Mobile", unit: "project", defaultPrice: 35000, description: "React Native or Flutter build." },
    { name: "Website Development", category: "Web", unit: "project", defaultPrice: 28000, description: "Next.js marketing site or product portal." },
    { name: "SEO + Content Engagement", category: "Marketing", unit: "month", defaultPrice: 4500, description: "Strategy, content production, link building." },
    { name: "Performance Paid Media", category: "Marketing", unit: "month", defaultPrice: 5500, description: "Google + Meta + LinkedIn campaign management." },
    { name: "VDI Architecture & Deployment", category: "VDI", unit: "project", defaultPrice: 22000, description: "Citrix/VMware/AVD design and rollout." },
    { name: "Endpoint Management", category: "VDI", unit: "month", defaultPrice: 3200, description: "Intune/Jamf operations." },
    { name: "Editorial Content Writing", category: "Content", unit: "item", defaultPrice: 450, description: "Per article, SEO-optimized." },
  ];
  for (const r of rows) {
    const found = await prisma.serviceItem.findFirst({ where: { name: r.name } });
    if (!found) await prisma.serviceItem.create({ data: r });
  }
  return rows.length;
}

async function seedDemoClient(adminId: string) {
  // Check existing
  const existing = await prisma.client.findUnique({ where: { slug: "acme-corp" } });
  if (existing) {
    console.log("  · demo client already exists, skipping");
    return existing;
  }

  const client = await prisma.client.create({
    data: {
      companyName: "Acme Corp",
      slug: "acme-corp",
      status: ClientStatus.ACTIVE,
      industry: "B2B SaaS",
      accountManagerId: adminId,
      services: ["AI", "Cloud", "Security"],
      startDate: new Date("2026-01-15"),
      notes: "Strategic flagship account. Engaged across AI, DevOps, and SOC 2 prep.",
      billingEmail: "billing@acmecorp.demo",
      billingAddress: { line1: "1 Innovation Way", city: "Detroit", region: "MI", postal: "48226", country: "US" },
      taxId: "EIN-12-3456789",
      defaultCurrency: "USD",
      paymentTerms: 30,
      brandColor: "#6366F1",
      dashboardConfig: {
        widgets: [
          { type: "tickets-summary", order: 1 },
          { type: "invoices-summary", order: 2 },
          { type: "active-projects", order: 3 },
          { type: "recent-activity", order: 4 },
          { type: "service-usage", order: 5 },
        ],
      },
      createdBy: adminId,
    },
  });

  // Two client users — OWNER + MEMBER
  const owner = await prisma.clientUser.create({
    data: {
      clientId: client.id,
      email: "owner@acmecorp.demo",
      firstName: "Alex",
      lastName: "Chen",
      jobTitle: "CTO",
      phone: "+1-313-555-0101",
      role: ClientRole.OWNER,
      passwordHash: await hashPassword("Client@2026"),
      emailVerified: new Date(),
      acceptedAt: new Date(),
      invitedBy: adminId,
    },
  });
  const member = await prisma.clientUser.create({
    data: {
      clientId: client.id,
      email: "member@acmecorp.demo",
      firstName: "Priya",
      lastName: "Patel",
      jobTitle: "Director of Operations",
      role: ClientRole.MEMBER,
      passwordHash: await hashPassword("Client@2026"),
      emailVerified: new Date(),
      acceptedAt: new Date(),
      invitedBy: adminId,
    },
  });

  // Two projects
  const proj1 = await prisma.clientProject.create({
    data: {
      clientId: client.id,
      name: "Lead-scoring AI Platform",
      slug: "lead-scoring-ai",
      description: "Predictive lead scoring across CRM + ad platforms.",
      status: "ACTIVE",
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-08-31"),
      budget: 85000,
      progress: 62,
      managerId: adminId,
    },
  });
  await prisma.clientProject.create({
    data: {
      clientId: client.id,
      name: "Cloud Migration to Azure",
      slug: "cloud-migration-azure",
      description: "Lift-and-shift of legacy monolith to AKS.",
      status: "PLANNING",
      startDate: new Date("2026-05-01"),
      budget: 120000,
      progress: 8,
      managerId: adminId,
    },
  });

  // 5 demo tickets across statuses + priorities
  const ticketSeed: Array<{
    subject: string;
    description: string;
    type: TicketType;
    priority: TicketPriority;
    status: TicketStatus;
    category: string;
    reporter: string;
    daysAgo: number;
    comments?: Array<{ author: "client" | "admin"; content: string; isInternal?: boolean; daysAgo: number }>;
    satisfaction?: number;
  }> = [
    {
      subject: "Lead scoring model returning low-confidence outputs",
      description: "We're seeing the model hover around 0.55 confidence on most leads. Expected closer to 0.8 based on the training data we shared.",
      type: TicketType.BUG,
      priority: TicketPriority.HIGH,
      status: TicketStatus.IN_PROGRESS,
      category: "AI",
      reporter: owner.id,
      daysAgo: 2,
      comments: [
        { author: "admin", content: "Looking into the feature distribution — will update by EOD.", daysAgo: 1 },
        { author: "admin", content: "Internal: validation set differs significantly from training. Need new sample.", isInternal: true, daysAgo: 1 },
      ],
    },
    {
      subject: "Request: SSO integration for the dashboard",
      description: "Can we wire Okta SSO so our team doesn't need separate creds?",
      type: TicketType.FEATURE_REQUEST,
      priority: TicketPriority.MEDIUM,
      status: TicketStatus.OPEN,
      category: "Web",
      reporter: member.id,
      daysAgo: 5,
    },
    {
      subject: "Production deploy failed at 3am — rollback succeeded",
      description: "Pipeline stage 'db-migrate' failed. Rollback was clean but we'd like a postmortem.",
      type: TicketType.INCIDENT,
      priority: TicketPriority.URGENT,
      status: TicketStatus.RESOLVED,
      category: "Cloud",
      reporter: owner.id,
      daysAgo: 8,
      comments: [
        { author: "admin", content: "Incident commander assigned. Publishing postmortem in 24h.", daysAgo: 8 },
        { author: "admin", content: "Postmortem published to docs. Root cause: index lock during migration.", daysAgo: 7 },
        { author: "client", content: "Thanks, all clear from our side.", daysAgo: 7 },
      ],
      satisfaction: 5,
    },
    {
      subject: "Quarterly cost optimization review",
      description: "Standing request — review AWS + Azure spend, recommend cuts for Q3.",
      type: TicketType.TASK,
      priority: TicketPriority.MEDIUM,
      status: TicketStatus.WAITING_INTERNAL,
      category: "Cloud",
      reporter: owner.id,
      daysAgo: 12,
    },
    {
      subject: "How to add custom fields to the lead scoring API?",
      description: "We have a 'lead source channel' field internally. How do we feed it into the scoring model?",
      type: TicketType.QUESTION,
      priority: TicketPriority.LOW,
      status: TicketStatus.CLOSED,
      category: "AI",
      reporter: member.id,
      daysAgo: 20,
      comments: [
        { author: "admin", content: "Two ways — (1) extend the schema in our shared API client, or (2) preprocess in your ETL. Docs link inside.", daysAgo: 19 },
      ],
      satisfaction: 4,
    },
  ];

  let ticketIdx = 1;
  for (const t of ticketSeed) {
    const createdAt = new Date(Date.now() - t.daysAgo * 86400_000);
    const number = `VS-2026-${String(ticketIdx).padStart(5, "0")}`;
    const ticket = await prisma.ticket.create({
      data: {
        number,
        clientId: client.id,
        projectId: proj1.id,
        reporterId: t.reporter,
        assigneeId: adminId,
        subject: t.subject,
        description: t.description,
        type: t.type,
        priority: t.priority,
        status: t.status,
        category: t.category,
        createdAt,
        firstResponseAt: t.comments?.length ? new Date(createdAt.getTime() + 86400_000 * 0.5) : null,
        resolvedAt:
          t.status === TicketStatus.RESOLVED || t.status === TicketStatus.CLOSED
            ? new Date(createdAt.getTime() + 86400_000)
            : null,
        closedAt: t.status === TicketStatus.CLOSED ? new Date(createdAt.getTime() + 86400_000 * 2) : null,
        satisfactionScore: t.satisfaction ?? null,
      },
    });
    if (t.comments) {
      for (const c of t.comments) {
        await prisma.ticketComment.create({
          data: {
            ticketId: ticket.id,
            authorId: c.author === "client" ? t.reporter : adminId,
            authorType: c.author === "client" ? "CLIENT" : "ADMIN",
            content: c.content,
            isInternal: c.isInternal ?? false,
            createdAt: new Date(Date.now() - c.daysAgo * 86400_000),
          },
        });
      }
    }
    ticketIdx++;
  }

  // 3 demo invoices: 1 paid, 1 sent (current), 1 overdue
  const invoiceSeed: Array<{
    status: InvoiceStatus;
    issuedDaysAgo: number;
    dueDaysFromIssue: number;
    items: Array<{ description: string; quantity: number; unitPrice: number; serviceCode?: string }>;
    paidDaysAgo?: number;
    paymentMethod?: string;
  }> = [
    {
      status: InvoiceStatus.PAID,
      issuedDaysAgo: 45,
      dueDaysFromIssue: 30,
      paidDaysAgo: 20,
      paymentMethod: "STRIPE",
      items: [
        { description: "AI / ML Consulting — March", quantity: 40, unitPrice: 200, serviceCode: "AI" },
        { description: "Cloud DevOps Engineering — March", quantity: 32, unitPrice: 175, serviceCode: "Cloud" },
      ],
    },
    {
      status: InvoiceStatus.SENT,
      issuedDaysAgo: 8,
      dueDaysFromIssue: 30,
      items: [
        { description: "AI Pipeline Engineering — Phase 2 milestone", quantity: 1, unitPrice: 25000, serviceCode: "AI" },
        { description: "SRE Retainer — April", quantity: 1, unitPrice: 8500, serviceCode: "Cloud" },
      ],
    },
    {
      status: InvoiceStatus.OVERDUE,
      issuedDaysAgo: 50,
      dueDaysFromIssue: 30,
      items: [
        { description: "Cybersecurity Audit — initial pass", quantity: 1, unitPrice: 12000, serviceCode: "Security" },
        { description: "SOC 2 Compliance Prep — kickoff", quantity: 1, unitPrice: 18000, serviceCode: "Security" },
      ],
    },
  ];

  let invIdx = 1;
  for (const inv of invoiceSeed) {
    const issueDate = new Date(Date.now() - inv.issuedDaysAgo * 86400_000);
    const dueDate = new Date(issueDate.getTime() + inv.dueDaysFromIssue * 86400_000);
    const subtotal = inv.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
    const taxRate = 6.0;
    const taxAmount = +((subtotal * taxRate) / 100).toFixed(2);
    const total = +(subtotal + taxAmount).toFixed(2);
    const number = `INV-2026-${String(invIdx).padStart(5, "0")}`;
    const publicViewToken = generateToken(24);

    const invoice = await prisma.invoice.create({
      data: {
        number,
        clientId: client.id,
        projectId: proj1.id,
        status: inv.status,
        issueDate,
        dueDate,
        paidAt: inv.paidDaysAgo ? new Date(Date.now() - inv.paidDaysAgo * 86400_000) : null,
        subtotal,
        taxRate,
        taxAmount,
        total,
        amountPaid: inv.status === InvoiceStatus.PAID ? total : 0,
        currency: "USD",
        billToName: "Acme Corp",
        billToEmail: "billing@acmecorp.demo",
        billToAddress: { line1: "1 Innovation Way", city: "Detroit", region: "MI", postal: "48226", country: "US" },
        billToTaxId: "EIN-12-3456789",
        notes: "Thank you for your business.",
        termsConditions: "Payment due within 30 days.",
        publicViewToken,
        paymentMethod: inv.paymentMethod ?? null,
        sentAt: inv.status !== InvoiceStatus.DRAFT ? issueDate : null,
        createdById: adminId,
      },
    });
    for (const [idx, it] of inv.items.entries()) {
      await prisma.invoiceItem.create({
        data: {
          invoiceId: invoice.id,
          description: it.description,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          amount: it.quantity * it.unitPrice,
          serviceCode: it.serviceCode ?? null,
          orderIndex: idx,
        },
      });
    }
    if (inv.status === InvoiceStatus.PAID) {
      await prisma.invoicePayment.create({
        data: {
          invoiceId: invoice.id,
          amount: total,
          currency: "USD",
          paymentMethod: inv.paymentMethod ?? "STRIPE",
          paymentReference: `ch_${crypto.randomBytes(10).toString("hex")}`,
          paidAt: new Date(Date.now() - inv.paidDaysAgo! * 86400_000),
          recordedById: adminId,
        },
      });
    }
    invIdx++;
  }

  // Activity / contact submission demo for the admin overview
  const existingContact = await prisma.contactSubmission.count();
  if (existingContact === 0) {
    await prisma.contactSubmission.createMany({
      data: [
        { name: "Jordan Reeves", email: "jordan@northwind.demo", phone: "+1-313-555-0188", company: "Northwind Solutions", service: "AI", message: "Looking for a partner to help us deploy GenAI for customer support." },
        { name: "Maya Singh", email: "maya@summitlabs.demo", company: "Summit Labs", service: "Cybersecurity", message: "Need a SOC 2 readiness audit before our Series B." },
        { name: "Lucas Park", email: "lucas@helio.demo", company: "Helio Energy", service: "Cloud", message: "Want to migrate our monolith from on-prem VMware to AWS." },
      ],
    });
  }

  return client;
}

async function main() {
  console.log("Seeding Phase 2 portal data…");

  const admin = await ensureAdmin();
  console.log("  ✓ admin user:", admin.email);

  const slaCount = await seedSlaConfigs();
  console.log(`  ✓ SLA configs: ${slaCount}`);

  const taxCount = await seedTaxRates();
  console.log(`  ✓ tax rates: ${taxCount}`);

  const itemCount = await seedServiceItems();
  console.log(`  ✓ service items: ${itemCount}`);

  await seedDemoClient(admin.id);
  console.log("  ✓ demo client (Acme Corp) + users + tickets + invoices");

  const counts = await prisma.$transaction([
    prisma.client.count(),
    prisma.clientUser.count(),
    prisma.ticket.count(),
    prisma.invoice.count(),
    prisma.slaConfig.count(),
    prisma.taxRate.count(),
    prisma.serviceItem.count(),
    prisma.contactSubmission.count(),
  ]);
  console.log("Final counts:");
  console.log(`  Clients=${counts[0]}  ClientUsers=${counts[1]}  Tickets=${counts[2]}  Invoices=${counts[3]}`);
  console.log(`  SlaConfigs=${counts[4]}  TaxRates=${counts[5]}  ServiceItems=${counts[6]}  ContactSubmissions=${counts[7]}`);

  await prisma.$disconnect();
  console.log("Done.");
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
