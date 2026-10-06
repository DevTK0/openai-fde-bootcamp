import { BusFront, UserRound, FileText, Banknote, CircleX } from "lucide-react"
import type { LimitationVisual } from "../content/limitations"

function Words({
  x,
  y,
  text,
  size = 32,
  muted = false,
  width = 30,
}: {
  x: number
  y: number
  text: string
  size?: number
  muted?: boolean
  width?: number
}) {
  const lines: string[] = []
  for (const word of text.split(" ")) {
    const last = lines.at(-1)
    if (!last || last.length + word.length + 1 > width) lines.push(word)
    else lines[lines.length - 1] = `${last} ${word}`
  }
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize={size}
      fill="currentColor"
      className={muted ? "text-muted-foreground" : "text-foreground"}
    >
      {lines.map((line, index) => (
        <tspan key={index} x={x} dy={index ? size * 1.25 : 0}>
          {line}
        </tspan>
      ))}
    </text>
  )
}
function Unknown({ x, y }: { x: number; y: number }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize="110"
      fontWeight="600"
      className="text-destructive"
      fill="currentColor"
    >
      ?
    </text>
  )
}
function Gap({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <path
      d={`M${x1} ${y}H${x2}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeDasharray="12 14"
      className="text-muted-foreground"
    />
  )
}

export function LimitationDiagram({ visual: v }: { visual: LimitationVisual }) {
  let drawing
  switch (v.layout) {
    case "history":
      drawing = (
        <>
          <Words x={565} y={105} text={v.missing} size={40} />
          <Words x={1310} y={105} text={v.observed} size={36} />
          <Gap x1={150} x2={1040} y={290} />
          <path
            d="M1080 220V355 M1540 220V355"
            className="stroke-primary"
            strokeWidth="5"
          />
          <rect
            x="1080"
            y="245"
            width="460"
            height="90"
            className="fill-primary"
            rx="4"
          />
          <text
            x="1310"
            y="305"
            textAnchor="middle"
            fontSize="48"
            className="fill-primary-foreground"
          >
            {v.value}
          </text>
          <Unknown x={565} y={255} />
          <Words
            x={565}
            y={420}
            text="No earlier observations in this extract"
            muted
          />
          <Words x={1310} y={420} text="Supplied window" muted />
        </>
      )
      break
    case "sample": {
      const count = v.count ?? 0
      const Icon = count === 2 ? UserRound : BusFront
      drawing = (
        <>
          <Words x={430} y={105} text={v.observed} size={40} />
          <Words x={1290} y={105} text={v.missing} size={40} />
          {Array.from({ length: count }, (_, i) => (
            <Icon
              key={i}
              x={count === 2 ? 300 + i * 160 : 205 + (i % 4) * 125}
              y={count === 2 ? 235 : 190 + Math.floor(i / 4) * 150}
              width="90"
              height="90"
              strokeWidth="1.4"
            />
          ))}
          <Gap x1={780} x2={960} y={290} />
          <CircleX
            x={835}
            y={255}
            width={70}
            height={70}
            className="fill-background text-destructive"
          />
          <rect
            x="1070"
            y="175"
            width="440"
            height="260"
            rx="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="12 14"
            className="text-muted-foreground"
          />
          <Unknown x={1290} y={335} />
          <Words x={430} y={475} text="Selected examples" muted />
          <Words
            x={1290}
            y={475}
            text="Wider pattern not measured here"
            muted
          />
        </>
      )
      break
    }
    case "plan":
      drawing = (
        <>
          <Words x={420} y={65} text={v.observed} size={36} />
          <Words x={1290} y={65} text={v.missing} size={36} />
          {["09:00", "11:00", "13:00"].map((label, i) => (
            <Words key={label} x={180 + i * 240} y={155} text={label} muted />
          ))}
          <rect
            x="180"
            y="190"
            width="240"
            height="240"
            className="fill-destructive/10"
          />
          <rect
            x="180"
            y="210"
            width="480"
            height="60"
            className="fill-destructive"
          />
          <rect
            x="180"
            y="335"
            width="240"
            height="60"
            className="fill-destructive"
          />
          <Words x={420} y={485} text="Two jobs overlap in this plan" />
          <path
            d="M1040 175V405H1560"
            fill="none"
            className="stroke-border"
            strokeWidth="4"
          />
          <Unknown x={1300} y={315} />
          <Words x={1300} y={465} text="How often did actual jobs clash?" />
        </>
      )
      break
    case "money":
      drawing = (
        <>
          <FileText
            x={150}
            y={150}
            width={170}
            height={170}
            strokeWidth={1.3}
          />
          <Gap x1={425} x2={645} y={240} />
          <rect
            x="695"
            y="125"
            width="260"
            height="220"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="12 12"
            className="text-muted-foreground"
          />
          <Unknown x={825} y={280} />
          <Gap x1={1010} x2={1240} y={240} />
          <Banknote
            x={1270}
            y={140}
            width={180}
            height={110}
            strokeWidth={1.3}
          />
          <Unknown x={1510} y={270} />
          <Words x={240} y={405} text={v.observed} />
          <Words x={825} y={405} text={v.missing} />
          <Words x={1430} y={405} text="Dollar effect not established" />
        </>
      )
      break
    case "breakdown":
      drawing = (
        <>
          <Banknote
            x={240}
            y={165}
            width={250}
            height={150}
            strokeWidth={1.3}
          />
          <Words x={365} y={405} text={v.observed} size={36} />
          <Gap x1={610} x2={845} y={265} />
          <Words x={1230} y={65} text={v.missing} size={34} />
          {v.rows?.map((row, i) => (
            <g key={row}>
              <Words x={1145} y={180 + i * 130} text={row} size={36} />
              <text
                x="1530"
                y={190 + i * 130}
                textAnchor="middle"
                fontSize="62"
                className="fill-destructive"
              >
                ?
              </text>
              <path
                d={`M930 ${215 + i * 130}H1560`}
                className="stroke-border"
                strokeWidth="2"
              />
            </g>
          ))}
        </>
      )
      break
    case "records":
      drawing = (
        <>
          <Words x={420} y={70} text={v.observed} size={36} />
          {v.rows?.map((row, i) => (
            <g key={row}>
              <path
                d={`M110 ${210 + i * 115}H715`}
                className="stroke-border"
                strokeWidth="2"
              />
              <Words x={420} y={185 + i * 115} text={row} />
            </g>
          ))}
          <Gap x1={800} x2={935} y={285} />
          <FileText
            x={1160}
            y={145}
            width={200}
            height={240}
            strokeWidth={1.2}
            className="text-muted-foreground"
          />
          <rect
            x="1195"
            y="245"
            width="150"
            height="145"
            className="fill-background"
          />
          <Unknown x={1270} y={355} />
          <Words x={1270} y={450} text={v.missing} size={34} />
        </>
      )
      break
    case "allocation":
      drawing = (
        <>
          <Words x={850} y={90} text={v.observed} size={42} />
          <rect
            x="180"
            y="200"
            width={(1340 * 340) / 596}
            height="150"
            className="fill-primary"
          />
          <rect
            x={180 + (1340 * 340) / 596}
            y="200"
            width={(1340 * 256) / 596}
            height="150"
            fill="none"
            className="stroke-destructive"
            strokeWidth="5"
            strokeDasharray="15 15"
          />
          <text
            x="550"
            y="295"
            textAnchor="middle"
            fontSize="64"
            className="fill-primary-foreground"
          >
            340
          </text>
          <text
            x="1240"
            y="295"
            textAnchor="middle"
            fontSize="64"
            className="fill-destructive"
          >
            256 ?
          </text>
          <Words x={550} y={420} text="Regular places" size={38} />
          <Words x={1240} y={420} text="Provisional places" size={38} />
        </>
      )
      break
  }
  return (
    <>
      {drawing}
      <Words x={850} y={570} text={v.conclusion} width={70} size={38} />
    </>
  )
}
