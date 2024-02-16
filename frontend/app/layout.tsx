import { inter, sfPro } from "@/app/fonts";
import "@/app/globals.css";
import Providers from "@/app/providers";
import cx from "classnames";

export const metadata = {
  title: "NeoTexto",
  description:
    "Learn languages by reading, reading and reading. Use artificial intelligence to generate texts from your list of vocabulary.",
  metadataBase: new URL("https://neotexto.com"),
  themeColor: "#FFF",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="NeoTexto" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="NeoTexto" />
        <meta
          name="description"
          content="Learn languages by reading, reading and reading. Use artificial intelligence to generate texts from your list of vocabulary."
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="neotexto.webmanifest" />
      </head>
      <body
        className={`min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-amber-50 to-amber-100 ${cx(
          sfPro.variable,
          inter.variable,
        )}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
