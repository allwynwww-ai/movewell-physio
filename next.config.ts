import type { NextConfig } from "next";

const noIndex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];

const nextConfig: NextConfig = {
  // All images are served locally from /public/images (see public/images/CREDITS.md).
  // If you load images from another host, add it under images.remotePatterns.

  // Online booking (Pro): the database auto-creates its tables from this SQL file
  // on first use, so make sure it is bundled with the server functions.
  outputFileTracingIncludes: {
    "/*": ["./db/migrations/**/*.sql"],
  },

  async headers() {
    return [
      { source: "/admin", headers: noIndex },
      { source: "/admin/:path*", headers: noIndex },
      { source: "/book/manage/:path*", headers: [...noIndex, { key: "Referrer-Policy", value: "no-referrer" }] },
      { source: "/api/:path*", headers: noIndex },
    ];
  },
};

export default nextConfig;
