import type { OpenSlideConfig } from "@open-slide/core"

export default {
  base: "/slides/",
  port: 3001,
  allowedHosts: [process.env.PORTLESS_URL, process.env.PORTLESS_TAILSCALE_URL]
    .filter((url): url is string => Boolean(url))
    .map((url) => new URL(url).hostname),
  build: { showSlideBrowser: true, showSlideUi: true, allowHtmlDownload: true },
} satisfies OpenSlideConfig
