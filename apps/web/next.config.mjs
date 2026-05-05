import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  poweredByHeader: false,

  // Self-contained server bundle for EC2 deployment. The monorepo root needs to
  // be set explicitly so workspace deps (@vsi/auth, @vsi/db) are traced.
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../.."),

  // Native modules that must NOT be bundled by Turbopack/webpack — keep them as runtime deps.
  serverExternalPackages: ["@node-rs/argon2", "bcryptjs", "@prisma/client"],

  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "vsolutionsinc.com" },
      { protocol: "https", hostname: "www.vsolutionsinc.com" },
    ],
  },

  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "vsolutionsinc.com",
        "www.vsolutionsinc.com",
      ],
    },
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
