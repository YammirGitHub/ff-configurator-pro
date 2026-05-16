import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🔥 Activa el motor de React 19 para eliminar re-renders y fugas de memoria
  experimental: {
    reactCompiler: true,
  },
  // 🛡️ Seguridad y Caché PWA
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
