import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - EA Yammir",
  description: "Panel de control maestro",

  // 🍎 Esto cambia el nombre y el ícono al darle a "Agregar al inicio" en esta URL
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Yammir ADMIN", // 👈 Nombre diferente bajo el iconoo
  },

  // 📱 Aquí es donde sucede la magia del cambio de logo
  icons: {
    icon: "/icon-admin.png",
    apple: "/icon-admin.png", // 👈 El nuevo logo que creaste en tu carpeta public
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
