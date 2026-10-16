import PluginInit from "@/helper/PluginInit";
import "./font.css";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Admin",
  description: "Manage orders, catalogue and settings for your store.",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        <link rel="stylesheet" href="/assets/admin-css/remixicon.css" />
        <link rel="stylesheet" href="/assets/admin-css/lib/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/admin-css/lib/apexcharts.css" />
        <link rel="stylesheet" href="/assets/admin-css/lib/animate.min.css" />
        <link rel="stylesheet" href="/assets/admin-css/style.css" />
        <link rel="stylesheet" href="/assets/admin-css/extra.css" />
      </head>
      <PluginInit />
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
