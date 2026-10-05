import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Social previews (LinkedIn, WhatsApp…) need absolute URLs. On Vercel the
// production domain is provided at build time; set SITE_URL to override
// (e.g. once you add a custom domain).
const siteUrl =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "");

const siteUrlPlugin = (): Plugin => ({
  name: "site-url",
  transformIndexHtml: (html) =>
    (siteUrl ? html : html.replace(/\s*<link rel="canonical"[^>]*>/, "").replace(/\s*<meta property="og:url"[^>]*>/, "")).replaceAll(
      "__SITE_URL__",
      siteUrl,
    ),
});

// Preload the two main (latin) font files so text doesn't re-flow when they arrive.
const preloadFonts = (): Plugin => ({
  name: "preload-fonts",
  transformIndexHtml: {
    order: "post",
    handler(html, ctx) {
      if (!ctx.bundle) return html;
      const fonts = Object.keys(ctx.bundle).filter((f) => /(plus-jakarta-sans|inter)-latin-wght-normal-[\w-]+\.woff2$/.test(f));
      return {
        html,
        tags: fonts.map((f) => ({
          tag: "link",
          attrs: { rel: "preload", as: "font", type: "font/woff2", href: `/${f}`, crossorigin: "" },
          injectTo: "head" as const,
        })),
      };
    },
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), siteUrlPlugin(), preloadFonts()],
});
