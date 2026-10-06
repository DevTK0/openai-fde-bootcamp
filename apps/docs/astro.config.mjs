import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import starlight from "@astrojs/starlight";

export default defineConfig({
  base: "/docs",
  trailingSlash: "always",
  output: "static",
  vite: { plugins: [tailwindcss()] },
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
            { label: "Read a maintenance comparison", slug: "getting-started" },
          ],
        },
        {
          label: "How-to guides",
          items: [
            { label: "Compare report periods", slug: "compare-reports" },
            {
              label: "Trace a finding to its records",
              slug: "explore-records",
            },
          ],
        },
        {
          label: "Reference",
          items: [
            { label: "Evidence sources", slug: "applications" },
            { label: "Measures and coverage", slug: "measures" },
          ],
        },
        {
          label: "Explanation",
          items: [
            {
              label: "Problems and solutions",
              items: [
                { autogenerate: { directory: "explanations/opportunities" } },
              ],
            },
            {
              label: "Repair spending and distance",
              slug: "maintenance-findings",
            },
            { label: "Journey reliability", slug: "reliability-findings" },
            { label: "Queues and bus capacity", slug: "crowding-findings" },
            { label: "Workshop capacity", slug: "workshop-findings" },
            { label: "Passenger accounts", slug: "passenger-findings" },
            { label: "Comparing proposed costs", slug: "cost-findings" },
          ],
        },
      ],
    }),
  ],
});
