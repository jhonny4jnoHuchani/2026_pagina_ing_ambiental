import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "apiadministrador.upea.bo" },
      { protocol: "https", hostname: "archivosminio.upea.bo" },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://apiadministrador.upea.bo https://archivosminio.upea.bo",
              "font-src 'self'",
              "connect-src 'self' https://apiadministrador.upea.bo https://servicioadministrador.upea.bo https://api.iconify.design https://api.simplesvg.com https://api.unisvg.com",
              // ✅ NUEVO — permite iframes de Google Maps y YouTube
              "frame-src 'self' https://www.google.com https://www.youtube.com https://maps.googleapis.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;