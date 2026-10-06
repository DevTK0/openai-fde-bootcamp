import type { OpenSlideConfig } from "@open-slide/core"

export default {
  base: "/slides/",
  port: 3001,
  build: { showSlideBrowser: true, showSlideUi: true, allowHtmlDownload: true },
} satisfies OpenSlideConfig
