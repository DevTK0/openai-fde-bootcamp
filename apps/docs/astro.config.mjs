import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import starlight from "@astrojs/starlight";

export default defineConfig({
  base: "/docs",
  trailingSlash: "always",
  output: "static",
  vite: {
    plugins: [tailwindcss()],
    server: { strictPort: true },
  },
  server: {
    allowedHosts: [process.env.PORTLESS_URL, process.env.PORTLESS_TAILSCALE_URL]
      .filter(Boolean)
      .map((url) => new URL(url).hostname),
  },
  integrations: [
    react(),
    starlight({
      title: "LionLink Web",
      customCss: ["./src/styles/figures.css"],
      sidebar: [
        { label: "Overview", slug: "" },
        {
          label: "Tutorials",
          items: [
            { label: "LionLink Web", items: [] },
            {
              label: "Fieldnotes",
              items: [
                {
                  label: "Create a product brief",
                  slug: "fieldnotes-tutorial",
                },
              ],
            },
          ],
        },
        {
          label: "How-to guides",
          items: [],
        },
        {
          label: "Reference",
          items: [],
        },
        {
          label: "Explanation",
          items: [
            {
              label: "Operations planning with AI",
              slug: "operations-planning",
            },
          ],
        },
      ],
    }),
  ],
});
