import type { Page } from "@open-slide/core"
import type { ReactNode } from "react"
import {
  BusFront,
  UsersRound,
  UserRound,
  Wrench,
  ShieldCheck,
  Clock3,
  House,
  TramFront,
  Tickets,
  Search,
  Wind,
  ThermometerSun,
  Banknote,
  ChartNoAxesCombined,
  CalendarDays,
  OctagonX,
  Route,
  CircleCheck,
  CircleX,
} from "lucide-react"
import type { Deck, Slide, SymbolName, Visual } from "../content/decks"
import "./deck.css"
import { LimitationDiagram } from "./limitation"

const symbols = {
  bus: BusFront,
  people: UsersRound,
  person: UserRound,
  wrench: Wrench,
  check: ShieldCheck,
  clock: Clock3,
  home: House,
  train: TramFront,
  event: Tickets,
  search: Search,
  wind: Wind,
  heat: ThermometerSun,
  money: Banknote,
  chart: ChartNoAxesCombined,
  calendar: CalendarDays,
  stop: OctagonX,
  road: Route,
}
function Symbol({
  name,
  x,
  y,
  size = 150,
  concern = false,
}: {
  name: SymbolName
  x: number
  y: number
  size?: number
  concern?: boolean
}) {
  const Icon = symbols[name]
  return (
    <Icon
      x={x - size / 2}
      y={y - size / 2}
      width={size}
      height={size}
      strokeWidth={1.4}
      className={concern ? "text-destructive" : "text-foreground"}
      aria-hidden="true"
    />
  )
}
function Label({
  x,
  y,
  children,
  large = false,
  muted = false,
  concern = false,
  anchor = "middle",
}: {
  x: number
  y: number
  children: ReactNode
  large?: boolean
  muted?: boolean
  concern?: boolean
  anchor?: "start" | "middle" | "end"
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill="currentColor"
      fontSize={large ? 48 : 29}
      fontWeight={large ? 600 : 450}
      className={
        concern
          ? "text-destructive"
          : muted
            ? "text-muted-foreground"
            : "text-foreground"
      }
    >
      {children}
    </text>
  )
}
function Arrow({
  x1,
  x2,
  y,
  blocked = false,
}: {
  x1: number
  x2: number
  y: number
  blocked?: boolean
}) {
  return (
    <g className={blocked ? "text-destructive" : "text-muted-foreground"}>
      <path
        d={`M${x1} ${y} H${x2 - 16}`}
        stroke="currentColor"
        strokeWidth="4"
        strokeDasharray={blocked ? "10 12" : undefined}
        fill="none"
      />
      <path
        d={`M${x2 - 20} ${y - 12} L${x2} ${y} L${x2 - 20} ${y + 12}`}
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      {blocked && (
        <CircleX
          x={(x1 + x2) / 2 - 24}
          y={y - 24}
          width={48}
          height={48}
          className="fill-background"
          strokeWidth={1.7}
        />
      )}
    </g>
  )
}
function Diagram({ visual }: { visual: Visual }) {
  switch (visual.kind) {
    case "divider":
      return null
    case "calculation":
      return (
        <>
          {visual.terms.map((term, i) => (
            <g key={i}>
              {term.value && (
                <text
                  x={260 + i * 590}
                  y={260}
                  textAnchor="middle"
                  fontSize="86"
                  fontWeight="600"
                  fill="currentColor"
                  className={i === 2 ? "text-destructive" : "text-foreground"}
                >
                  {term.value}
                </text>
              )}
              {term.lines.map((line, j) => (
                <text
                  key={line}
                  x={260 + i * 590}
                  y={(term.value ? 350 : 250) + j * 58}
                  textAnchor="middle"
                  fontSize="38"
                  fill="currentColor"
                >
                  {line}
                </text>
              ))}
            </g>
          ))}
          <Label x={555} y={275} large>
            {visual.operator}
          </Label>
          <Label x={1145} y={275} large>
            =
          </Label>
          <Label x={850} y={535} muted>
            {visual.unit}
          </Label>
        </>
      )
    case "measures":
      return (
        <>
          {visual.items.map((item, i) => (
            <g key={item.label}>
              <text
                x={430 + i * 840}
                y={255}
                textAnchor="middle"
                fontSize="100"
                fontWeight="600"
                fill="currentColor"
              >
                {item.value}
              </text>
              <Label x={430 + i * 840} y={365} large>
                {item.label}
              </Label>
              <Label x={430 + i * 840} y={440} muted>
                {item.detail}
              </Label>
            </g>
          ))}
        </>
      )
    case "limitation":
      return <LimitationDiagram visual={visual} />
    case "journey": {
      const xs = visual.steps.map(
        (_, i) => 200 + (i * 1300) / (visual.steps.length - 1)
      )
      return (
        <>
          {visual.steps.slice(0, -1).map((_, i) =>
            visual.join === "plus" && i === 0 ? (
              <Label key={i} x={(xs[i]! + xs[i + 1]!) / 2} y={277} large>
                +
              </Label>
            ) : (
              <Arrow
                key={i}
                x1={xs[i]! + 115}
                x2={xs[i + 1]! - 115}
                y={260}
                blocked={visual.blocked === i}
              />
            )
          )}
          {visual.steps.map((s, i) => (
            <g key={s.label}>
              <Symbol name={s.icon} x={xs[i]!} y={260} concern={s.concern} />
              <Label x={xs[i]!} y={410} concern={s.concern}>
                {s.label}
              </Label>
            </g>
          ))}
        </>
      )
    }
    case "bars": {
      const max = Math.max(...visual.rows.map((r) => r.value), 1)
      const start = visual.rows.length === 2 ? 155 : 105
      return (
        <>
          <line
            x1="500"
            x2="500"
            y1={start - 35}
            y2={start + (visual.rows.length - 1) * 150 + 85}
            className="stroke-border"
            strokeWidth="2"
          />
          {visual.rows.map((r, i) => (
            <g key={r.label}>
              <Label x={450} y={start + i * 150 + 40} anchor="end">
                {r.label}
              </Label>
              <rect
                x="500"
                y={start + i * 150}
                width={860}
                height="68"
                rx="4"
                className="fill-muted"
              />
              <rect
                x="500"
                y={start + i * 150}
                width={(r.value / max) * 860}
                height="68"
                rx="4"
                className={r.concern ? "fill-destructive" : "fill-primary"}
              />
              <Label
                x={1680}
                y={start + i * 150 + 45}
                anchor="end"
                large
                concern={r.concern}
              >
                {r.display}
              </Label>
            </g>
          ))}
          <Label x={500} y={start + (visual.rows.length - 1) * 150 + 120} muted>
            0
          </Label>
          <Label x={980} y={555} muted>
            {visual.unit}
          </Label>
        </>
      )
    }
    case "workshop": {
      const x = (hour: number) => 470 + (hour - 9) * 145
      return (
        <>
          <Label x={850} y={58} large>
            {visual.sequential
              ? "One space · no overlap"
              : "One space · overlapping bookings"}
          </Label>
          {[9, 11, 13, 15, 17].map((hour) => (
            <g key={hour}>
              <line
                x1={x(hour)}
                x2={x(hour)}
                y1="155"
                y2="420"
                className="stroke-border"
                strokeWidth="2"
              />
              <Label
                x={x(hour)}
                y={130}
                muted
              >{`${String(hour).padStart(2, "0")}:00`}</Label>
            </g>
          ))}
          {!visual.sequential && (
            <rect
              x={x(9)}
              y="155"
              width={290}
              height="265"
              className="fill-destructive/10"
            />
          )}
          <Label x={390} y={237} anchor="end">
            Cooling diagnosis
          </Label>
          <Label x={390} y={362} anchor="end">
            Routine check
          </Label>
          <rect
            x={x(9)}
            y="190"
            width={580}
            height="70"
            rx="5"
            className={visual.sequential ? "fill-primary" : "fill-destructive"}
          />
          <rect
            x={x(visual.sequential ? 13 : 9)}
            y="315"
            width={290}
            height="70"
            rx="5"
            className={
              visual.sequential ? "fill-primary/60" : "fill-destructive"
            }
          />
          {visual.sequential ? (
            <>
              <Symbol name="bus" x={570} y={510} size={80} />
              <Arrow x1={650} x2={1500} y={510} />
              <Label x={1070} y={572}>
                Replacement bus covers the journeys
              </Label>
            </>
          ) : (
            <>
              <CircleX
                x={585}
                y={455}
                width={60}
                height={60}
                className="text-destructive"
              />
              <Label x={940} y={498} concern>
                Both jobs need the space at once
              </Label>
            </>
          )}
        </>
      )
    }
    case "comfort":
      return (
        <>
          <path
            d="M400 400 Q850 540 1300 400"
            className="stroke-border"
            strokeWidth="4"
            fill="none"
            strokeDasharray="10 12"
          />
          {[400, 1300].map((x, i) => (
            <g key={x}>
              <Label x={x} y={85} muted>
                {i === 0 ? "5 October" : "12 October"}
              </Label>
              <Symbol name="bus" x={x} y={280} size={220} />
              <Symbol name="heat" x={x + 145} y={190} size={100} concern />
              <Symbol name="wind" x={x - 150} y={210} size={80} concern />
              <Label x={x} y={470} concern>
                {i === 0 ? "Hot inside" : "Weak airflow"}
              </Label>
            </g>
          ))}
          <Label x={850} y={565} large>
            Same bus · repeated discomfort
          </Label>
        </>
      )
    case "queue": {
      const dots = Math.round(visual.waitingPercent)
      return (
        <>
          {Array.from({ length: 100 }, (_, i) => (
            <circle
              key={i}
              cx={170 + (i % 20) * 48}
              cy={155 + Math.floor(i / 20) * 58}
              r="16"
              className={i < dots ? "fill-destructive" : "fill-primary/20"}
            />
          ))}
          <Label x={620} y={515} muted>
            Each dot = 1% of recorded stops
          </Label>
          <Symbol name="bus" x={1390} y={190} size={150} />
          <Arrow x1={1320} x2={1540} y={310} />
          <Symbol name="people" x={1230} y={355} size={90} concern />
          <Label x={1390} y={450} large concern>{`About ${dots}%`}</Label>
          <Label x={1390} y={505}>
            leave a queue
          </Label>
        </>
      )
    }
    case "fleet":
      return (
        <>
          {Array.from({ length: visual.count }, (_, i) => (
            <g key={i}>
              <Symbol
                name="bus"
                x={210 + (i % 4) * 235}
                y={190 + Math.floor(i / 4) * 220}
                size={125}
              />
              <Symbol
                name="stop"
                x={275 + (i % 4) * 235}
                y={245 + Math.floor(i / 4) * 220}
                size={46}
                concern
              />
            </g>
          ))}
          <line
            x1="1110"
            x2="1110"
            y1="100"
            y2="510"
            className="stroke-destructive"
            strokeWidth="5"
          />
          <Symbol name="check" x={1410} y={220} size={150} />
          <Label x={1410} y={395} large concern>
            No sign-off
          </Label>
          <Label x={1410} y={455}>
            Availability unconfirmed
          </Label>
          <Label x={560} y={580} muted>
            Each symbol is one workshop bus
          </Label>
        </>
      )
    case "transfer": {
      const depart = visual.connected ? 1320 : 880
      return (
        <>
          <Label x={110} y={155} anchor="start">
            Shuttle
          </Label>
          <Label x={110} y={390} anchor="start">
            Connecting bus
          </Label>
          <Arrow x1={400} x2={1550} y={180} />
          <Arrow x1={400} x2={1550} y={410} />
          <Symbol name="event" x={460} y={125} size={70} />
          <Symbol name="bus" x={1120} y={120} size={100} />
          <Label x={1120} y={65}>
            Arrives 23:05
          </Label>
          <Symbol name="bus" x={depart} y={350} size={100} />
          <Label x={depart} y={480}>
            Leaves 22:45
          </Label>
          <path
            d={`M1120 205 Q1120 285 ${depart} 300`}
            className={
              visual.connected ? "stroke-primary" : "stroke-destructive"
            }
            strokeWidth="5"
            strokeDasharray="10 10"
            fill="none"
          />
          {visual.connected ? (
            <CircleCheck
              x={1155}
              y={258}
              width={58}
              height={58}
              className="fill-background text-foreground"
            />
          ) : (
            <CircleX
              x={975}
              y={253}
              width={58}
              height={58}
              className="fill-background text-destructive"
            />
          )}
          <Label x={850} y={565} large concern={!visual.connected}>
            {visual.connected
              ? "Time to change buses"
              : "Connection already gone"}
          </Label>
          <Label x={1580} y={450} muted>
            Later
          </Label>
        </>
      )
    }
    case "relief": {
      const people = visual.demand,
        seats = visual.seats,
        unit = 3.7
      return (
        <>
          <Symbol name="people" x={240} y={175} size={120} />
          <Label x={240} y={290}>
            Need a ride
          </Label>
          <Symbol name="bus" x={240} y={385} size={120} />
          <Label x={240} y={500}>
            Bus places
          </Label>
          <rect
            x="460"
            y="135"
            width={people * unit}
            height="95"
            rx="4"
            className="fill-primary"
          />
          <rect
            x="460"
            y="350"
            width={seats * unit}
            height="95"
            rx="4"
            className="fill-primary/40"
          />
          <rect
            x={460 + seats * unit}
            y="350"
            width={(people - seats) * unit}
            height="95"
            rx="4"
            className="fill-destructive"
          />
          <Label x={460 + (people * unit) / 2} y={110} large>
            {people} people
          </Label>
          <Label x={460 + (seats * unit) / 2} y={505}>
            {seats} places
          </Label>
          <Label
            x={460 + seats * unit + ((people - seats) * unit) / 2}
            y={505}
            concern
            large
          >
            {people - seats} waiting
          </Label>
          <path
            d={`M${460 + seats * unit} 245 V330`}
            className="stroke-border"
            strokeWidth="3"
            strokeDasharray="8 8"
          />
        </>
      )
    }
    case "columns": {
      const max =
        Math.max(...visual.rows.map((r) => r.value), visual.threshold ?? 0, 1) *
        1.15
      const width = 1440 / visual.rows.length
      const y = (value: number) => 440 - (value / max) * 340
      return (
        <>
          <line
            x1="130"
            x2="1570"
            y1="440"
            y2="440"
            className="stroke-border"
            strokeWidth="3"
          />
          <Label x={95} y={450} muted>
            0
          </Label>
          {visual.rows.map((r, i) => (
            <g key={r.label}>
              <rect
                x={140 + i * width + width * 0.15}
                y={y(r.value)}
                width={width * 0.6}
                height={440 - y(r.value)}
                rx="4"
                className={
                  visual.threshold ? "fill-primary" : "fill-destructive"
                }
              />
              <Label x={140 + i * width + width * 0.45} y={y(r.value) - 18}>
                {r.value}
              </Label>
              <Label x={140 + i * width + width * 0.45} y={495} muted>
                {r.label}
              </Label>
            </g>
          ))}
          {visual.threshold !== undefined && (
            <>
              <line
                x1="130"
                x2="1570"
                y1={y(visual.threshold)}
                y2={y(visual.threshold)}
                className="stroke-destructive"
                strokeDasharray="10 10"
                strokeWidth="3"
              />
              <Label x={1450} y={68} concern>
                {visual.thresholdLabel}
              </Label>
            </>
          )}
          <Label x={850} y={575} muted>
            {visual.unit}
          </Label>
        </>
      )
    }
    case "costmix": {
      const max = Math.max(
        ...visual.rows.map((r) => r.values.reduce((a, b) => a + b, 0))
      )
      const colors = ["fill-primary/40", "fill-primary", "fill-destructive"]
      return (
        <>
          {visual.rows.map((r, i) => (
            <g key={r.label}>
              <Label x={380} y={185 + i * 190} anchor="end">
                {r.label}
              </Label>
              {r.values.map((value, j) => (
                <rect
                  key={j}
                  x={
                    430 +
                    (r.values.slice(0, j).reduce((a, b) => a + b, 0) / max) *
                      940
                  }
                  y={130 + i * 190}
                  width={(value / max) * 940}
                  height="90"
                  className={colors[j]}
                />
              ))}
              <Label x={1680} y={190 + i * 190} large anchor="end">
                S${r.values.reduce((a, b) => a + b, 0).toLocaleString("en-SG")}
              </Label>
            </g>
          ))}
          {visual.labels.map((label, i) => (
            <g key={label}>
              <rect
                x={210 + i * 520}
                y="510"
                width="28"
                height="28"
                className={colors[i]}
              />
              <Label x={258 + i * 520} y={535} anchor="start">
                {label}
              </Label>
            </g>
          ))}
        </>
      )
    }
    case "quote": {
      const words = visual.text.split(" "),
        middle = Math.ceil(words.length / 2)
      return (
        <>
          <Symbol name="person" x={310} y={225} size={155} />
          <Symbol name="clock" x={310} y={435} size={95} concern />
          <text
            x="590"
            y="220"
            fontSize="62"
            fontWeight="500"
            fill="currentColor"
          >
            “{words.slice(0, middle).join(" ")}
          </text>
          <text
            x="590"
            y="315"
            fontSize="62"
            fontWeight="500"
            fill="currentColor"
          >
            {words.slice(middle).join(" ")}”
          </text>
          <Label x={1080} y={450} muted>
            {visual.attribution}
          </Label>
        </>
      )
    }
  }
}
export function SlideCanvas({
  deck,
  slide,
  index,
}: {
  deck: Deck
  slide: Slide
  index: number
}) {
  if (slide.visual.kind === "divider") {
    return (
      <section
        aria-label={`${deck.title} — ${slide.stage}`}
        className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
      >
        <header className="border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
          LIONLINK · {deck.title}
        </header>
        <div className="flex flex-1 items-center justify-between gap-24">
          <div className="max-w-[1200px]">
            <div className="mb-12 h-2 w-32 bg-destructive" />
            <h1 className="text-[120px] leading-[1.05] font-semibold tracking-[-0.035em]">
              {slide.title}
            </h1>
            <p className="mt-12 text-[36px] leading-snug text-muted-foreground">
              {slide.caption}
            </p>
          </div>
          <Search
            className="size-[260px] shrink-0 text-muted-foreground"
            strokeWidth={1}
            aria-hidden="true"
          />
        </div>
        <footer className="flex justify-between border-t border-border pt-5 text-[23px] text-muted-foreground">
          <span>Stakeholder discussion</span>
          <span className="tabular-nums">
            {index + 1} / {deck.slides.length}
          </span>
        </footer>
      </section>
    )
  }
  return (
    <section
      aria-label={`${deck.title} — ${slide.stage}`}
      className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
    >
      <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
        <span>LIONLINK · {deck.title}</span>
        <span>{slide.stage}</span>
      </header>
      <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
        {slide.title}
      </h1>
      <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
        {slide.caption}
      </p>
      <figure className="my-4 min-h-0 w-full flex-1" aria-label={slide.title}>
        <svg
          viewBox="0 0 1700 610"
          className="h-full w-full"
          role="img"
          aria-label={`${slide.title} ${slide.caption}`}
        >
          <title>{slide.title}</title>
          <desc>{slide.caption}</desc>
          <Diagram visual={slide.visual} />
        </svg>
      </figure>
      <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
        <span>
          Source: {slide.source}
          <br />
          Fictional exercise data · {deck.scope}
        </span>
        <span className="text-[23px] tabular-nums">
          {index + 1} / {deck.slides.length}
        </span>
      </footer>
    </section>
  )
}
export function createDeck(deck: Deck): Page[] {
  return deck.slides.map((slide, index) => {
    const Page: Page = () => (
      <SlideCanvas deck={deck} slide={slide} index={index} />
    )
    Page.displayName = `${deck.id}-${index + 1}`
    return Page
  })
}
export function speakerNotes(deck: Deck) {
  return deck.slides.map(
    (slide) =>
      `${slide.title}\n\n${slide.notes}\n\nSource: ${slide.source}.\nScope: ${deck.scope}. All figures are fictional exercise data, not live business results. These slides describe problems and evidence only; no remedy or financial uplift is asserted.`
  )
}
