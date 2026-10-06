import { useSlidePageNumber, type Page } from "@open-slide/core"
import "../../components/deck.css"

export const meta = { title: "Maintenance" }
export const notes = [
  "Maintenance includes more than repairs.\n\nThese are distinct categories in the canonical monthly ledger. Annual summaries and selected job records overlap the same ledger and cannot be added as extra spending. Supplier quotes are not included because they are proposed purchases, not incurred costs.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Annual maintenance costs rose to S$81,835.\n\nTotal earlier spending is S$65,045; later spending is S$81,835. These include labour and parts recorded in the monthly source. They exclude fuel, wages outside the job charges, financing and unpriced replacement cover.\n\nInterpretation: Two annual totals do not establish a sustained trend; prices and the mix of work may have changed.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Repairs drove most of the cost increase.\n\nThe increase is S$16,790 overall. Regular service charges rose S$5,670, repair charges rose S$11,255, and extra preventive charges fell by S$135. A decline in preventive spending does not prove that it caused the rise in repairs.\n\nInterpretation: Changes in spending do not prove that fewer preventive checks caused more repairs.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Repair costs rose faster than bus use.\n\nEarlier year: October 2024 to September 2025. Later year: October 2025 to September 2026. Repair spend rose from S$13,625 to S$24,880, while distance rose from 131,600 to 146,570 km. These are incurred repair charges, not quotes.\n\nInterpretation: Two years show a difference, not a sustained trend; only eight selected buses are included.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Repair costs rose per kilometre.\n\nDividing repair charges by the distance recorded in the same period makes the comparison more informative than raw bills. The difference remains substantial after allowing for distance. It does not establish whether age, workload, specific faults or other conditions caused the increase.\n\nInterpretation: Distance is accounted for; bus age, workload, prices and one-off repairs are not.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Repair jobs rose from 31 to 55.\n\nThere were 31 corrective jobs in the earlier year and 55 in the later year. The increase is not just a comparison of one expensive invoice with many small ones. Jobs can follow faults found between duties; these counts must not be called cancelled trips or breakdowns.\n\nInterpretation: More jobs may reflect more inspections or changed recording, as well as more faults.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Two buses account for almost half the repair costs.\n\nThe highest two buses account for S$19,015 of S$38,505, or 49.4%. The group of six is combined, not an average bus. These raw totals differ in mileage and do not prove vehicle age or a particular component caused the difference.\n\nInterpretation: Two buses may cost more because of heavier use, age or one major job; totals alone cannot explain why.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "A repaired bus still needs safety approval.\n\nThe expected finish is an estimate. A recorded release is a confirmed approval. Missing release records create uncertainty about usable resources; they do not prove a bus remained held for every day after its estimated completion.\n\nSource: Workshop repair status records · October 2026.\nScope: Separate group of eight workshop buses. All figures are fictional exercise data, not live business results.",
  "None of the eight buses has a recorded safety approval.\n\nEach symbol represents one workshop bus. These eight buses are separate from the 172 buses in the operating timetable. Their absence from the available pool is not evidence of an equivalent number of cancelled services or a company-wide availability percentage.\n\nInterpretation: Missing releases in this extract do not prove the buses stayed unavailable; records may exist elsewhere.\n\nSource: Workshop repair status records · October 2026.\nScope: Separate group of eight workshop buses. All figures are fictional exercise data, not live business results.",
  "The buses are at different repair stages.\n\nThree buses are in repair, three await parts and two await inspection. The status categories describe the supplied records. They do not measure how long each stage lasted or how much time is recoverable.\n\nInterpretation: A status snapshot does not measure time spent waiting for parts, repair or inspection.\n\nSource: Workshop repair status records · October 2026.\nScope: Separate group of eight workshop buses. All figures are fictional exercise data, not live business results.",
  "A bus can run but still feel too hot.\n\nPassenger experience includes what happens inside the bus, not only whether it leaves or arrives. The supplied accounts report heat and weak air movement on two journeys. They describe an experience, not a diagnosis of a particular broken part.\n\nSource: Six supplied passenger accounts · October 2026.\nScope: Selected repair history and passenger accounts. All figures are fictional exercise data, not live business results.",
  "Passengers felt hot on the same bus twice.\n\nThe two accounts match departures using their stated stop and actual journey time. Both identify heat and weak airflow. These are selected accounts, not a complete complaint history; a wider complaint rate cannot be calculated from them.\n\nInterpretation: Two selected accounts on one bus cannot establish how common discomfort is.\n\nSource: Passenger accounts and matched departures · 5 and 12 Oct 2026.\nScope: Selected repair history and passenger accounts. All figures are fictional exercise data, not live business results.",
  "One bus needed three cooling repairs in 15 days.\n\nThe findings were a cooling-fluid hose leak, dirty filter and cooling surfaces, and an intermittent fan-control relay. Similar symptoms do not prove that one fault remained unfixed. The September charge is already included in monthly history and must not be added to it again.\n\nInterpretation: Different findings can produce similar symptoms; repeated visits do not prove unsuccessful repairs.\n\nSource: Selected cooling repair records · 28 Sep to 12 Oct 2026.\nScope: Selected repair history and passenger accounts. All figures are fictional exercise data, not live business results.",
  "Cooling repairs kept the bus out for 9.7 hours.\n\nDurations are calculated from each job's opening and confirmed release times. These selected jobs followed duties; no cancelled service is established by these records. Staff labour hours and workshop elapsed hours are also not the same quantity.\n\nInterpretation: Workshop hours are not cancelled trips, passenger delays or staff labour hours.\n\nSource: Selected cooling repair records · 28 Sep to 12 Oct 2026.\nScope: Selected repair history and passenger accounts. All figures are fictional exercise data, not live business results.",
  "Caveats\n\nThis section separates the observed problems from the limits of the supplied evidence. Each following slide explains one limitation and the existing business records that would help assess it.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Two years do not show a cost trend.\n\nTwo years do not show a cost trend. Share earlier monthly maintenance reports using the same cost categories.\n\nTwo annual totals do not establish a sustained trend; prices and the mix of work may have changed.\n\nRequest earlier monthly maintenance reports using the same cost categories, the equivalent records for the rest of the fleet, and underlying invoices and job sheets. Bus ages and mileage should come from the fleet register and existing operating records. These are extensions of routine records already supplied. Reconcile categories and overlapping job records before comparing years. The overall maintenance increase includes the repair increase, so the two impact figures must not be added.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Eight buses may not represent the fleet.\n\nEight buses may not represent the fleet. Share maintenance costs, mileage and ages for other buses doing similar work.\n\nChanges in spending do not prove that fewer preventive checks caused more repairs.\n\nRequest earlier monthly maintenance reports using the same cost categories, the equivalent records for the rest of the fleet, and underlying invoices and job sheets. Bus ages and mileage should come from the fleet register and existing operating records. These are extensions of routine records already supplied. Reconcile categories and overlapping job records before comparing years. The overall maintenance increase includes the repair increase, so the two impact figures must not be added.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Totals hide the cost of major one-off jobs.\n\nTotals hide the cost of major one-off jobs. Share invoices and job sheets to separate routine work, major jobs and price changes.\n\nTwo buses may cost more because of heavier use, age or one major job; totals alone cannot explain why.\n\nRequest earlier monthly maintenance reports using the same cost categories, the equivalent records for the rest of the fleet, and underlying invoices and job sheets. Bus ages and mileage should come from the fleet register and existing operating records. These are extensions of routine records already supplied. Reconcile categories and overlapping job records before comparing years. The overall maintenance increase includes the repair increase, so the two impact figures must not be added.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
  "Missing approval records do not prove buses are unavailable.\n\nMissing approval records do not prove buses are unavailable. Share signed release records and completed job sheets to confirm when buses could return to service.\n\nMissing releases in this extract do not prove the buses stayed unavailable; records may exist elsewhere.\n\nRequest completed job sheets and signed release records, the relevant parts orders and delivery receipts, and replacement-bus hire invoices. These are ordinary workshop, purchasing and accounting records that may sit outside the supplied extract. Do not assume a detailed electronic status history is maintained. The records should establish actual completion dates and billed cover costs before calculating downtime or financial impact.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Workshop repair status records · October 2026.\nScope: Separate group of eight workshop buses. All figures are fictional exercise data, not live business results.",
  "Repair status does not show time spent waiting.\n\nRepair status does not show time spent waiting. Share dated job sheets, parts orders and delivery receipts to separate repair time from waits for parts.\n\nA status snapshot does not measure time spent waiting for parts, repair or inspection.\n\nRequest completed job sheets and signed release records, the relevant parts orders and delivery receipts, and replacement-bus hire invoices. These are ordinary workshop, purchasing and accounting records that may sit outside the supplied extract. Do not assume a detailed electronic status history is maintained. The records should establish actual completion dates and billed cover costs before calculating downtime or financial impact.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Workshop repair status records · October 2026.\nScope: Separate group of eight workshop buses. All figures are fictional exercise data, not live business results.",
  "Replacement bus costs are not provided.\n\nReplacement bus costs are not provided. Share dated hire invoices and credits to check replacement bus costs.\n\nEstimated dates cannot substitute for actual release times or establish overdue downtime.\n\nRequest completed job sheets and signed release records, the relevant parts orders and delivery receipts, and replacement-bus hire invoices. These are ordinary workshop, purchasing and accounting records that may sit outside the supplied extract. Do not assume a detailed electronic status history is maintained. The records should establish actual completion dates and billed cover costs before calculating downtime or financial impact.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Workshop repair status records · October 2026.\nScope: Separate group of eight workshop buses. All figures are fictional exercise data, not live business results.\n\nRelated evidence and caveats:\nA replacement bus may not cost extra.\n\nA replacement bus may not cost extra. Share hire invoices to check whether covering the service added costs.\n\nThe supplied roster may omit other cover; eight scheduled trips are not eight cancellations.\n\nRequest prior workshop booking logs and completed job sheets, mechanic rosters or timesheets, and paid replacement-bus invoices. Use the dates and fields already maintained rather than requiring a new record of every planning decision. Compare requested and actual work where both are recorded. These routine records can show recurring conflicts and incurred overtime or hire charges; a single conflicting request is not proof of realised losses.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Requested workshop bookings and service schedule · 19 Oct 2026.\nScope: Future planning records · 19 October 2026. All figures are fictional exercise data, not live business results.",
  "One bus cannot show how common cooling faults are.\n\nOne bus cannot show how common cooling faults are. Share earlier cooling job sheets and repair records for other buses.\n\nTwo selected accounts on one bus cannot establish how common discomfort is.\n\nRequest the existing cooling-repair job cards, invoices and release records for earlier periods and other buses. If a complaint register is maintained, request the already-recorded cooling complaints over the same period. This extends supplied records rather than asking for cabin sensors, passenger follow-up or new customer research. Complaint counts need a service denominator and are not a representative measure of all passenger experiences.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Selected cooling repair records · 28 Sep to 12 Oct 2026.\nScope: Selected repair history and passenger accounts. All figures are fictional exercise data, not live business results.",
  "Two complaints cannot show how common discomfort is.\n\nTwo complaints cannot show how common discomfort is. Share the full cooling complaint register, including earlier months.\n\nDifferent findings can produce similar symptoms; repeated visits do not prove unsuccessful repairs.\n\nRequest the existing cooling-repair job cards, invoices and release records for earlier periods and other buses. If a complaint register is maintained, request the already-recorded cooling complaints over the same period. This extends supplied records rather than asking for cabin sensors, passenger follow-up or new customer research. Complaint counts need a service denominator and are not a representative measure of all passenger experiences.\n\nMissing records are absent from the supplied extract, not necessarily from the business. No unobserved data points or financial outcomes are estimated in this diagram.\n\nSource: Selected cooling repair records · 28 Sep to 12 Oct 2026.\nScope: Selected repair history and passenger accounts. All figures are fictional exercise data, not live business results.",
  "Annual maintenance costs rose by S$16,790.\n\nThe totals are S$81,835 and S$65,045, giving a difference of S$16,790. This includes the S$11,255 repair increase rather than being additional to it. Repair-job charges overlap these totals too. The difference is recorded expenditure, not a sustained trend, price-adjusted comparison or guaranteed avoidable cost. Fuel, financing and unpriced replacement cover are outside these maintenance categories.\n\nSource: Monthly maintenance and mileage records · Oct 2024 to Sep 2026.\nScope: Same eight selected buses · not the whole fleet. All figures are fictional exercise data, not live business results.",
]

const PageNumber = () => {
  const { current, total } = useSlidePageNumber()
  return (
    <>
      {current} / {total}
    </>
  )
}

const Page1: Page = () => (
  <section
    aria-label="Maintenance. How it works"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance"}</span>
      <span>{"How it works"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Maintenance includes more than repairs."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"The records separate regular servicing, extra checks and repairs."}
    </p>
    <figure
      aria-label="Maintenance includes more than repairs."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Maintenance includes more than repairs. The records separate regular servicing, extra checks and repairs."
        className="relative h-full w-full"
      >
        <div className="absolute top-[256.391px] left-[319.969px] h-[16px] w-[426.82px] text-muted-foreground">
          <svg
            viewBox="307.1327993148442 252.1327993148442 419.7344013703116 15.734401370311593"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M315 260 H719"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[244.188px] left-[726.721px] h-[40.406px] w-[36.338px] text-muted-foreground">
          <svg
            viewBox="707.1327993148442 240.1327993148442 35.734401370311595 39.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M715 248 L735 260 L715 272"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[256.391px] left-[980.941px] h-[16px] w-[426.82px] text-muted-foreground">
          <svg
            viewBox="957.1327993148442 252.1327993148442 419.7344013703116 15.734401370311593"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M965 260 H1369"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[244.188px] left-[1387.693px] h-[40.406px] w-[36.338px] text-muted-foreground">
          <svg
            viewBox="1357.1327993148443 240.1327993148442 35.734401370311595 39.734401370311595"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M1365 248 L1385 260 L1365 272"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[192.836px] left-[145.828px] h-[136.75px] w-[130.399px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="1.7412478903750725 0.7412478903750725 20.517504219249854 21.517504219249854"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M8 2v3"></path>
            <path d="M16 2v3"></path>
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <path d="M3 9h18"></path>
            <path d="M8 13h.01"></path>
            <path d="M12 13h.01"></path>
            <path d="M16 13h.01"></path>
            <path d="M8 17h.01"></path>
            <path d="M12 17h.01"></path>
            <path d="M16 17h.01"></path>
          </svg>
        </div>
        <p className="absolute top-[387.728px] left-[98.801px] m-0 h-[35.387px] w-[224.453px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Regular servicing"}
        </p>
        <div className="absolute top-[192.813px] left-[800.442px] h-[143.141px] w-[143.136px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.7407809475879021 0.7375578860263177 22.521662239269386 22.522161964611183"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"></path>
          </svg>
        </div>
        <p className="absolute top-[387.728px] left-[788.563px] m-0 h-[35.387px] w-[166.875px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Extra checks"}
        </p>
        <div className="absolute top-[218.258px] left-[1461.417px] h-[92.266px] w-[143.11px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.7412478903750725 4.741247890375073 22.517504219249854 14.517504219249854"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <rect width="20" height="12" x="2" y="6" rx="2"></rect>
            <circle cx="12" cy="12" r="2"></circle>
            <path d="M6 12h.01M18 12h.01"></path>
          </svg>
        </div>
        <p className="absolute top-[387.728px] left-[1461.402px] m-0 h-[35.387px] w-[143.141px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Repair bills"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Monthly maintenance and mileage records · Oct 2024 to Sep 2026"
        }
        <br />
        {
          "Fictional exercise data · Same eight selected buses · not the whole fleet"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page2: Page = () => (
  <section
    aria-label="Maintenance. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Annual maintenance costs rose to S$81,835."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"The same eight buses, compared across two full years."}
    </p>
    <figure
      aria-label="Annual maintenance costs rose to S$81,835."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Annual maintenance costs rose to S$81,835. The same eight buses, compared across two full years."
        className="relative h-full w-full"
      >
        <p className="absolute top-[137.874px] left-[332.635px] m-0 h-[30.705px] w-[126.672px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Earlier year"}
        </p>
        <div className="absolute top-[114.703px] left-[501.423px] h-[79.406px] w-[479.48px] [background-color:oklab(0.922_0_0_/_0.4)]"></div>
        <div className="absolute top-[114.703px] left-[980.903px] h-[79.406px] w-[41.654px] bg-primary"></div>
        <div className="absolute top-[114.703px] left-[1022.558px] h-[79.406px] w-[138.088px] bg-destructive"></div>
        <p className="absolute top-[126.23px] left-[1405.815px] m-0 h-[50.822px] w-[200.516px] text-center text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"S$65,045"}
        </p>
        <p className="absolute top-[305.523px] left-[345.229px] m-0 h-[30.705px] w-[114.078px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Later year"}
        </p>
        <div className="absolute top-[282.344px] left-[501.423px] h-[79.406px] w-[536.945px] [background-color:oklab(0.922_0_0_/_0.4)]"></div>
        <div className="absolute top-[282.344px] left-[1038.368px] h-[79.406px] w-[40.286px] bg-primary"></div>
        <div className="absolute top-[282.344px] left-[1078.654px] h-[79.406px] w-[252.155px] bg-destructive"></div>
        <p className="absolute top-[293.87px] left-[1412.862px] m-0 h-[50.822px] w-[193.469px] text-center text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"S$81,835"}
        </p>
        <div className="absolute top-[449.984px] left-[307.311px] h-[24.703px] w-[24.705px] [background-color:oklab(0.922_0_0_/_0.4)]"></div>
        <p className="absolute top-[446.694px] left-[347.663px] m-0 h-[30.705px] w-[195.297px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Regular servicing"}
        </p>
        <div className="absolute top-[449.984px] left-[766.121px] h-[24.703px] w-[24.705px] bg-primary"></div>
        <p className="absolute top-[446.694px] left-[806.473px] m-0 h-[30.705px] w-[145.328px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Extra checks"}
        </p>
        <div className="absolute top-[449.984px] left-[1224.93px] h-[24.703px] w-[24.705px] bg-destructive"></div>
        <p className="absolute top-[446.694px] left-[1265.282px] m-0 h-[30.705px] w-[87.609px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Repairs"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Monthly maintenance and mileage records · Oct 2024 to Sep 2026"
        }
        <br />
        {
          "Fictional exercise data · Same eight selected buses · not the whole fleet"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page3: Page = () => (
  <section
    aria-label="Maintenance. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Repairs drove most of the cost increase."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"The change in each maintenance cost between the two years."}
    </p>
    <figure
      aria-label="Repairs drove most of the cost increase."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Repairs drove most of the cost increase. The change in each maintenance cost between the two years."
        className="relative h-full w-full"
      >
        <div className="absolute top-[114.023px] left-[508.092px] h-[290.563px] w-[16px] text-foreground">
          <svg
            viewBox="492.1327993148442 112.1327993148442 15.734401370311593 285.7344013703116"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <line
              x1="500"
              x2="500"
              y1="120"
              y2="390"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></line>
          </svg>
        </div>
        <p className="absolute top-[169.095px] left-[242.795px] m-0 h-[35.387px] w-[224.453px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Regular servicing"}
        </p>
        <div className="absolute top-[157.617px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[157.617px] left-[516.092px] h-[69.148px] w-[440.561px] [border-radius:4.068px] bg-primary"></div>
        <p className="absolute top-[155.589px] left-[1521.87px] m-0 h-[58.572px] w-[196.141px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"S$5,670"}
        </p>
        <p className="absolute top-[321.627px] left-[366.889px] m-0 h-[35.387px] w-[100.359px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Repairs"}
        </p>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[308.12px] left-[1505.964px] m-0 h-[58.572px] w-[212.047px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"S$11,255"}
        </p>
        <p className="absolute top-[402.978px] left-[504.873px] m-0 h-[35.387px] w-[22.438px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[535.173px] left-[589.687px] m-0 h-[35.387px] w-[829.016px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {
            "Increase in Singapore dollars · preventive spending fell separately"
          }
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Monthly maintenance and mileage records · Oct 2024 to Sep 2026"
        }
        <br />
        {
          "Fictional exercise data · Same eight selected buses · not the whole fleet"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page4: Page = () => (
  <section
    aria-label="Maintenance. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Repair costs rose faster than bus use."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"The same eight buses, compared across two full years."}
    </p>
    <figure
      aria-label="Repair costs rose faster than bus use."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Repair costs rose faster than bus use. The same eight buses, compared across two full years."
        className="relative h-full w-full"
      >
        <div className="absolute top-[97.879px] left-[555.186px] h-[254.228px] w-[16px] text-foreground">
          <svg
            viewBox="490.9330546362422 110.93305463624223 18.13389072751553 288.1338907275155"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <line
              x1="500"
              x2="500"
              y1="120"
              y2="390"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></line>
          </svg>
        </div>
        <p className="absolute top-[146.701px] left-[318.695px] m-0 h-[30.705px] w-[202.375px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Distance travelled"}
        </p>
        <div className="absolute top-[136.76px] left-[563.186px] h-[59.998px] w-[758.8px] [border-radius:3.529px] bg-muted"></div>
        <div className="absolute top-[136.76px] left-[563.186px] h-[59.998px] w-[104.492px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[135.054px] left-[1488.737px] m-0 h-[50.822px] w-[117.594px] text-center text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"11.4%"}
        </p>
        <p className="absolute top-[279.05px] left-[337.163px] m-0 h-[30.705px] w-[183.906px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Repair spending"}
        </p>
        <div className="absolute top-[269.109px] left-[563.186px] h-[59.998px] w-[758.8px] [border-radius:3.529px] bg-muted"></div>
        <div className="absolute top-[269.109px] left-[563.186px] h-[59.998px] w-[758.8px] [border-radius:3.529px] bg-destructive"></div>
        <p className="absolute top-[267.403px] left-[1476.284px] m-0 h-[50.822px] w-[130.047px] text-center text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"82.6%"}
        </p>
        <p className="absolute top-[349.636px] left-[553.186px] m-0 h-[30.705px] w-[20px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[464.338px] left-[780.171px] m-0 h-[30.705px] w-[413.063px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Percentage increase from earlier year"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Monthly maintenance and mileage records · Oct 2024 to Sep 2026"
        }
        <br />
        {
          "Fictional exercise data · Same eight selected buses · not the whole fleet"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page5: Page = () => (
  <section
    aria-label="Maintenance. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Repair costs rose per kilometre."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"Costs per 1,000 kilometres account for the increase in bus use."}
    </p>
    <figure
      aria-label="Repair costs rose per kilometre."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Repair costs rose per kilometre. Costs per 1,000 kilometres account for the increase in bus use."
        className="relative h-full w-full"
      >
        <div className="absolute top-[97.879px] left-[555.186px] h-[254.228px] w-[16px] text-foreground">
          <svg
            viewBox="490.9330546362422 110.93305463624223 18.13389072751553 288.1338907275155"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <line
              x1="500"
              x2="500"
              y1="120"
              y2="390"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></line>
          </svg>
        </div>
        <p className="absolute top-[146.701px] left-[394.398px] m-0 h-[30.705px] w-[126.672px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Earlier year"}
        </p>
        <div className="absolute top-[136.76px] left-[563.186px] h-[59.998px] w-[758.8px] [border-radius:3.529px] bg-muted"></div>
        <div className="absolute top-[136.76px] left-[563.186px] h-[59.998px] w-[462.81px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[135.054px] left-[1474.424px] m-0 h-[50.822px] w-[131.906px] text-center text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"S$104"}
        </p>
        <p className="absolute top-[279.05px] left-[406.992px] m-0 h-[30.705px] w-[114.078px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Later year"}
        </p>
        <div className="absolute top-[269.109px] left-[563.186px] h-[59.998px] w-[758.8px] [border-radius:3.529px] bg-muted"></div>
        <div className="absolute top-[269.109px] left-[563.186px] h-[59.998px] w-[758.8px] [border-radius:3.529px] bg-destructive"></div>
        <p className="absolute top-[267.403px] left-[1477.721px] m-0 h-[50.822px] w-[128.609px] text-center text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"S$170"}
        </p>
        <p className="absolute top-[349.636px] left-[553.186px] m-0 h-[30.705px] w-[20px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[464.338px] left-[812.491px] m-0 h-[30.705px] w-[348.422px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Singapore dollars per 1,000 km"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Monthly maintenance and mileage records · Oct 2024 to Sep 2026"
        }
        <br />
        {
          "Fictional exercise data · Same eight selected buses · not the whole fleet"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page6: Page = () => (
  <section
    aria-label="Maintenance. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Repair jobs rose from 31 to 55."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Each repair visit counts as one job. A job does not always mean a breakdown."
      }
    </p>
    <figure
      aria-label="Repair jobs rose from 31 to 55."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Repair jobs rose from 31 to 55. Each repair visit counts as one job. A job does not always mean a breakdown."
        className="relative h-full w-full"
      >
        <div className="absolute top-[114.026px] left-[508.092px] h-[290.558px] w-[16px] text-foreground">
          <svg
            viewBox="492.1327993148442 112.1327993148442 15.734401370311593 285.7344013703116"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <line
              x1="500"
              x2="500"
              y1="120"
              y2="390"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></line>
          </svg>
        </div>
        <p className="absolute top-[169.098px] left-[321.873px] m-0 h-[35.387px] w-[145.375px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Earlier year"}
        </p>
        <div className="absolute top-[157.616px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[157.616px] left-[516.092px] h-[69.148px] w-[492.909px] [border-radius:4.068px] bg-primary"></div>
        <p className="absolute top-[155.59px] left-[1660.495px] m-0 h-[58.572px] w-[57.516px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"31"}
        </p>
        <p className="absolute top-[321.63px] left-[336.389px] m-0 h-[35.387px] w-[130.859px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Later year"}
        </p>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[310.148px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[308.122px] left-[1653.729px] m-0 h-[58.572px] w-[64.281px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"55"}
        </p>
        <p className="absolute top-[402.98px] left-[504.873px] m-0 h-[35.387px] w-[22.438px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[535.175px] left-[861.734px] m-0 h-[35.387px] w-[284.922px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Completed repair jobs"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Monthly maintenance and mileage records · Oct 2024 to Sep 2026"
        }
        <br />
        {
          "Fictional exercise data · Same eight selected buses · not the whole fleet"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page7: Page = () => (
  <section
    aria-label="Maintenance. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Two buses account for almost half the repair costs."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"Two years of repair bills for eight buses, ranked by cost."}
    </p>
    <figure
      aria-label="Two buses account for almost half the repair costs."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Two buses account for almost half the repair costs. Two years of repair bills for eight buses, ranked by cost."
        className="relative h-full w-full"
      >
        <div className="absolute top-[53.766px] left-[555.186px] h-[386.57px] w-[16px] text-foreground">
          <svg
            viewBox="490.9330546362422 60.93305463624223 18.13389072751553 438.1338907275155"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <line
              x1="500"
              x2="500"
              y1="70"
              y2="490"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></line>
          </svg>
        </div>
        <p className="absolute top-[102.585px] left-[324.554px] m-0 h-[30.705px] w-[196.516px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Highest-cost bus"}
        </p>
        <div className="absolute top-[92.641px] left-[563.186px] h-[60px] w-[758.8px] [border-radius:3.529px] bg-muted"></div>
        <div className="absolute top-[92.641px] left-[563.186px] h-[60px] w-[400.229px] [border-radius:3.529px] bg-destructive"></div>
        <p className="absolute top-[90.941px] left-[1412.877px] m-0 h-[50.822px] w-[193.453px] text-center text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"S$10,280"}
        </p>
        <p className="absolute top-[234.937px] left-[337.882px] m-0 h-[30.705px] w-[183.188px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Second-highest"}
        </p>
        <div className="absolute top-[224.992px] left-[563.186px] h-[60px] w-[758.8px] [border-radius:3.529px] bg-muted"></div>
        <div className="absolute top-[224.992px] left-[563.186px] h-[60px] w-[340.078px] [border-radius:3.529px] bg-destructive"></div>
        <p className="absolute top-[223.284px] left-[1436.518px] m-0 h-[50.822px] w-[169.813px] text-center text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"S$8,735"}
        </p>
        <p className="absolute top-[367.28px] left-[301.195px] m-0 h-[30.705px] w-[219.875px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Other six combined"}
        </p>
        <div className="absolute top-[357.344px] left-[563.186px] h-[60px] w-[758.8px] [border-radius:3.529px] bg-muted"></div>
        <div className="absolute top-[357.344px] left-[563.186px] h-[60px] w-[758.8px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[355.636px] left-[1413.987px] m-0 h-[50.822px] w-[192.344px] text-center text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"S$19,490"}
        </p>
        <p className="absolute top-[437.866px] left-[553.186px] m-0 h-[30.705px] w-[20px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[464.335px] left-[772.343px] m-0 h-[30.705px] w-[428.719px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Singapore dollars · full two-year period"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Monthly maintenance and mileage records · Oct 2024 to Sep 2026"
        }
        <br />
        {
          "Fictional exercise data · Same eight selected buses · not the whole fleet"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page8: Page = () => (
  <section
    aria-label="Maintenance. How it works"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance"}</span>
      <span>{"How it works"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"A repaired bus still needs safety approval."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"It must pass the required checks before carrying passengers again."}
    </p>
    <figure
      aria-label="A repaired bus still needs safety approval."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="A repaired bus still needs safety approval. It must pass the required checks before carrying passengers again."
        className="relative h-full w-full"
      >
        <div className="absolute top-[221.406px] left-[391.956px] h-[16px] w-[372.46px] text-muted-foreground">
          <svg
            viewBox="305.9330546362422 250.93305463624225 422.1338907275155 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M315 260 H719"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[210.816px] left-[744.886px] h-[37.176px] w-[33.647px] text-muted-foreground">
          <svg
            viewBox="705.9330546362422 238.93305463624225 38.133890727515535 42.133890727515535"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M715 248 L735 260 L715 272"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[221.406px] left-[965.468px] h-[16px] w-[372.46px] text-muted-foreground">
          <svg
            viewBox="955.9330546362422 250.93305463624225 422.1338907275155 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M965 260 H1369"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[210.816px] left-[1318.398px] h-[37.176px] w-[33.646px] text-muted-foreground">
          <svg
            viewBox="1355.9330546362423 238.93305463624225 38.133890727515535 42.133890727515535"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M1365 248 L1385 260 L1365 272"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[166.238px] left-[235.34px] h-[126.316px] w-[126.314px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.5488217990115871 0.5455987374500026 22.905580536422015 22.90608026176381"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"></path>
          </svg>
        </div>
        <p className="absolute top-[336.401px] left-[231.043px] m-0 h-[30.705px] w-[134.891px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Repair work"}
        </p>
        <div className="absolute top-[166.258px] left-[808.855px] h-[126.293px] w-[126.291px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.5492887417987575 0.5492887417987575 22.901422516402484 22.901422516402484"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6h4"></path>
          </svg>
        </div>
        <p className="absolute top-[336.401px] left-[784.937px] m-0 h-[30.705px] w-[174.125px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Expected finish"}
        </p>
        <div className="absolute top-[166.258px] left-[1393.396px] h-[126.309px] w-[104.233px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="2.5492887417987573 0.5488395611957302 18.901422516402484 22.904771820601702"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
        </div>
        <p className="absolute top-[336.401px] left-[1357.84px] m-0 h-[30.705px] w-[175.344px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Safety approval"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Workshop repair status records · October 2026"}
        <br />
        {"Fictional exercise data · Separate group of eight workshop buses"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page9: Page = () => (
  <section
    aria-label="Maintenance. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"None of the eight buses has a recorded safety approval."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"The workshop extract has no confirmed release records."}
    </p>
    <figure
      aria-label="None of the eight buses has a recorded safety approval."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="None of the eight buses has a recorded safety approval. The workshop extract has no confirmed release records."
        className="relative h-full w-full"
      >
        <div className="absolute top-[118.281px] left-[253.357px] h-[98.719px] w-[107.909px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.2591464901585092 1.2591464901585092 23.481707019682982 21.481707019682982"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M4 6 2 7"></path>
            <path d="M10 6h4"></path>
            <path d="m22 7-2-1"></path>
            <rect width="16" height="16" x="4" y="3" rx="2"></rect>
            <path d="M4 11h16"></path>
            <path d="M8 15h.01"></path>
            <path d="M16 15h.01"></path>
            <path d="M6 19v2"></path>
            <path d="M18 21v-2"></path>
          </svg>
        </div>
        <div className="absolute top-[191.258px] left-[339.751px] h-[49.824px] w-[49.822px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-2.73058018978666 -2.73058018978666 29.46116037957332 29.46116037957332"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="m15 9-6 6"></path>
            <path d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z"></path>
            <path d="m9 9 6 6"></path>
          </svg>
        </div>
        <div className="absolute top-[118.281px] left-[460.704px] h-[98.719px] w-[107.909px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.2591464901585092 1.2591464901585092 23.481707019682982 21.481707019682982"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M4 6 2 7"></path>
            <path d="M10 6h4"></path>
            <path d="m22 7-2-1"></path>
            <rect width="16" height="16" x="4" y="3" rx="2"></rect>
            <path d="M4 11h16"></path>
            <path d="M8 15h.01"></path>
            <path d="M16 15h.01"></path>
            <path d="M6 19v2"></path>
            <path d="M18 21v-2"></path>
          </svg>
        </div>
        <div className="absolute top-[191.258px] left-[547.098px] h-[49.824px] w-[49.823px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-2.73058018978666 -2.73058018978666 29.46116037957332 29.46116037957332"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="m15 9-6 6"></path>
            <path d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z"></path>
            <path d="m9 9 6 6"></path>
          </svg>
        </div>
        <div className="absolute top-[118.281px] left-[668.05px] h-[98.719px] w-[107.909px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.2591464901585092 1.2591464901585092 23.481707019682982 21.481707019682982"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M4 6 2 7"></path>
            <path d="M10 6h4"></path>
            <path d="m22 7-2-1"></path>
            <rect width="16" height="16" x="4" y="3" rx="2"></rect>
            <path d="M4 11h16"></path>
            <path d="M8 15h.01"></path>
            <path d="M16 15h.01"></path>
            <path d="M6 19v2"></path>
            <path d="M18 21v-2"></path>
          </svg>
        </div>
        <div className="absolute top-[191.258px] left-[754.445px] h-[49.824px] w-[49.823px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-2.73058018978666 -2.73058018978666 29.46116037957332 29.46116037957332"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="m15 9-6 6"></path>
            <path d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z"></path>
            <path d="m9 9 6 6"></path>
          </svg>
        </div>
        <div className="absolute top-[118.281px] left-[875.397px] h-[98.719px] w-[107.909px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.2591464901585092 1.2591464901585092 23.481707019682982 21.481707019682982"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M4 6 2 7"></path>
            <path d="M10 6h4"></path>
            <path d="m22 7-2-1"></path>
            <rect width="16" height="16" x="4" y="3" rx="2"></rect>
            <path d="M4 11h16"></path>
            <path d="M8 15h.01"></path>
            <path d="M16 15h.01"></path>
            <path d="M6 19v2"></path>
            <path d="M18 21v-2"></path>
          </svg>
        </div>
        <div className="absolute top-[191.258px] left-[961.791px] h-[49.824px] w-[49.823px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-2.73058018978666 -2.73058018978666 29.46116037957332 29.46116037957332"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="m15 9-6 6"></path>
            <path d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z"></path>
            <path d="m9 9 6 6"></path>
          </svg>
        </div>
        <div className="absolute top-[312.395px] left-[253.357px] h-[98.719px] w-[107.909px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.2591464901585092 1.2591464901585092 23.481707019682982 21.481707019682982"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M4 6 2 7"></path>
            <path d="M10 6h4"></path>
            <path d="m22 7-2-1"></path>
            <rect width="16" height="16" x="4" y="3" rx="2"></rect>
            <path d="M4 11h16"></path>
            <path d="M8 15h.01"></path>
            <path d="M16 15h.01"></path>
            <path d="M6 19v2"></path>
            <path d="M18 21v-2"></path>
          </svg>
        </div>
        <div className="absolute top-[385.371px] left-[339.751px] h-[49.82px] w-[49.822px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-2.73058018978666 -2.73058018978666 29.46116037957332 29.46116037957332"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="m15 9-6 6"></path>
            <path d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z"></path>
            <path d="m9 9 6 6"></path>
          </svg>
        </div>
        <div className="absolute top-[312.395px] left-[460.704px] h-[98.719px] w-[107.909px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.2591464901585092 1.2591464901585092 23.481707019682982 21.481707019682982"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M4 6 2 7"></path>
            <path d="M10 6h4"></path>
            <path d="m22 7-2-1"></path>
            <rect width="16" height="16" x="4" y="3" rx="2"></rect>
            <path d="M4 11h16"></path>
            <path d="M8 15h.01"></path>
            <path d="M16 15h.01"></path>
            <path d="M6 19v2"></path>
            <path d="M18 21v-2"></path>
          </svg>
        </div>
        <div className="absolute top-[385.371px] left-[547.098px] h-[49.82px] w-[49.823px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-2.73058018978666 -2.73058018978666 29.46116037957332 29.46116037957332"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="m15 9-6 6"></path>
            <path d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z"></path>
            <path d="m9 9 6 6"></path>
          </svg>
        </div>
        <div className="absolute top-[312.395px] left-[668.05px] h-[98.719px] w-[107.909px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.2591464901585092 1.2591464901585092 23.481707019682982 21.481707019682982"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M4 6 2 7"></path>
            <path d="M10 6h4"></path>
            <path d="m22 7-2-1"></path>
            <rect width="16" height="16" x="4" y="3" rx="2"></rect>
            <path d="M4 11h16"></path>
            <path d="M8 15h.01"></path>
            <path d="M16 15h.01"></path>
            <path d="M6 19v2"></path>
            <path d="M18 21v-2"></path>
          </svg>
        </div>
        <div className="absolute top-[385.371px] left-[754.445px] h-[49.82px] w-[49.823px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-2.73058018978666 -2.73058018978666 29.46116037957332 29.46116037957332"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="m15 9-6 6"></path>
            <path d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z"></path>
            <path d="m9 9 6 6"></path>
          </svg>
        </div>
        <div className="absolute top-[312.395px] left-[875.397px] h-[98.719px] w-[107.909px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.2591464901585092 1.2591464901585092 23.481707019682982 21.481707019682982"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M4 6 2 7"></path>
            <path d="M10 6h4"></path>
            <path d="m22 7-2-1"></path>
            <rect width="16" height="16" x="4" y="3" rx="2"></rect>
            <path d="M4 11h16"></path>
            <path d="M8 15h.01"></path>
            <path d="M16 15h.01"></path>
            <path d="M6 19v2"></path>
            <path d="M18 21v-2"></path>
          </svg>
        </div>
        <div className="absolute top-[385.371px] left-[961.791px] h-[49.82px] w-[49.823px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-2.73058018978666 -2.73058018978666 29.46116037957332 29.46116037957332"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="m15 9-6 6"></path>
            <path d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z"></path>
            <path d="m9 9 6 6"></path>
          </svg>
        </div>
        <div className="absolute top-[80.234px] left-[1093.405px] h-[377.75px] w-[16px] text-foreground">
          <svg
            viewBox="1100.9330546362423 90.93305463624223 18.13389072751553 428.1338907275155"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <line
              x1="1110"
              x2="1110"
              y1="100"
              y2="510"
              strokeWidth="5px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(0.704 0.191 22.216)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-destructive"
            ></line>
          </svg>
        </div>
        <div className="absolute top-[130.965px] left-[1313.986px] h-[126.309px] w-[104.233px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="2.5492887417987573 0.5488395611957302 18.901422516402484 22.904771820601702"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
        </div>
        <p className="absolute top-[307.109px] left-[1256.79px] m-0 h-[50.822px] w-[218.625px] text-center text-[length:42.352px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"No sign-off"}
        </p>
        <p className="absolute top-[376.105px] left-[1231.438px] m-0 h-[30.705px] w-[269.328px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Availability unconfirmed"}
        </p>
        <p className="absolute top-[486.398px] left-[427.641px] m-0 h-[30.705px] w-[376.969px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Each symbol is one workshop bus"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Workshop repair status records · October 2026"}
        <br />
        {"Fictional exercise data · Separate group of eight workshop buses"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page10: Page = () => (
  <section
    aria-label="Maintenance. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"The buses are at different repair stages."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"The records show repairs, waits for parts and pending inspections."}
    </p>
    <figure
      aria-label="The buses are at different repair stages."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="The buses are at different repair stages. The records show repairs, waits for parts and pending inspections."
        className="relative h-full w-full"
      >
        <div className="absolute top-[63.18px] left-[508.092px] h-[443.09px] w-[16px] text-foreground">
          <svg
            viewBox="492.1327993148442 62.132799314844206 15.734401370311593 435.7344013703116"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <line
              x1="500"
              x2="500"
              y1="70"
              y2="490"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></line>
          </svg>
        </div>
        <p className="absolute top-[118.256px] left-[360.779px] m-0 h-[35.387px] w-[106.469px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"In repair"}
        </p>
        <div className="absolute top-[106.773px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[106.773px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-primary"></div>
        <p className="absolute top-[104.745px] left-[1683.604px] m-0 h-[58.572px] w-[34.406px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"3"}
        </p>
        <p className="absolute top-[270.787px] left-[280.357px] m-0 h-[35.387px] w-[186.891px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Awaiting parts"}
        </p>
        <div className="absolute top-[259.305px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[259.305px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-primary"></div>
        <p className="absolute top-[257.276px] left-[1683.604px] m-0 h-[58.572px] w-[34.406px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"3"}
        </p>
        <p className="absolute top-[423.318px] left-[218.826px] m-0 h-[35.387px] w-[248.422px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Inspection pending"}
        </p>
        <div className="absolute top-[411.836px] left-[516.092px] h-[69.148px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[411.836px] left-[516.092px] h-[69.148px] w-[583.011px] [border-radius:4.068px] bg-primary"></div>
        <p className="absolute top-[409.812px] left-[1684.885px] m-0 h-[58.572px] w-[33.125px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"2"}
        </p>
        <p className="absolute top-[504.67px] left-[504.873px] m-0 h-[35.387px] w-[22.438px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[535.173px] left-[776.413px] m-0 h-[35.387px] w-[455.563px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Workshop buses by supplied status"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Workshop repair status records · October 2026"}
        <br />
        {"Fictional exercise data · Separate group of eight workshop buses"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page11: Page = () => (
  <section
    aria-label="Maintenance. How it works"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance"}</span>
      <span>{"How it works"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"A bus can run but still feel too hot."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"Passengers reported heat and weak airflow during their journeys."}
    </p>
    <figure
      aria-label="A bus can run but still feel too hot."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="A bus can run but still feel too hot. Passengers reported heat and weak airflow during their journeys."
        className="relative h-full w-full"
      >
        <div className="absolute top-[221.404px] left-[391.956px] h-[16px] w-[372.46px] text-muted-foreground">
          <svg
            viewBox="305.9330546362422 250.93305463624225 422.1338907275155 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M315 260 H719"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[210.816px] left-[744.886px] h-[37.176px] w-[33.647px] text-muted-foreground">
          <svg
            viewBox="705.9330546362422 238.93305463624225 38.133890727515535 42.133890727515535"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M715 248 L735 260 L715 272"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[221.404px] left-[965.468px] h-[16px] w-[372.46px] text-muted-foreground">
          <svg
            viewBox="955.9330546362422 250.93305463624225 422.1338907275155 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M965 260 H1369"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[210.816px] left-[1318.398px] h-[37.176px] w-[33.646px] text-muted-foreground">
          <svg
            viewBox="1355.9330546362423 238.93305463624225 38.133890727515535 42.133890727515535"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M1365 248 L1385 260 L1365 272"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[171.773px] left-[235.343px] h-[115.262px] w-[126.291px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.5492887417987575 1.5492887417987575 22.901422516402484 20.901422516402484"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M4 6 2 7"></path>
            <path d="M10 6h4"></path>
            <path d="m22 7-2-1"></path>
            <rect width="16" height="16" x="4" y="3" rx="2"></rect>
            <path d="M4 11h16"></path>
            <path d="M8 15h.01"></path>
            <path d="M16 15h.01"></path>
            <path d="M6 19v2"></path>
            <path d="M18 21v-2"></path>
          </svg>
        </div>
        <p className="absolute top-[336.401px] left-[224.613px] m-0 h-[30.705px] w-[147.75px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"Journey runs"}
        </p>
        <div className="absolute top-[166.26px] left-[808.855px] h-[126.313px] w-[126.291px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.5492887417987575 0.5492887417987575 22.901422516402484 22.905521408614398"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M12 2v2"></path>
            <path d="M12 8a4 4 0 0 0-1.645 7.647"></path>
            <path d="M2 12h2"></path>
            <path d="M20 14.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z"></path>
            <path d="m4.93 4.93 1.41 1.41"></path>
            <path d="m6.34 17.66-1.41 1.41"></path>
          </svg>
        </div>
        <p className="absolute top-[336.401px] left-[814.039px] m-0 h-[30.705px] w-[115.922px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-destructive">
          {"Hot inside"}
        </p>
        <div className="absolute top-[171.773px] left-[1382.366px] h-[115.262px] w-[126.291px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.5492887417987575 1.5492887417987575 22.901422516402484 20.901422516402484"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M18 21a8 8 0 0 0-16 0"></path>
            <circle cx="10" cy="8" r="5"></circle>
            <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"></path>
          </svg>
        </div>
        <p className="absolute top-[336.401px] left-[1336.793px] m-0 h-[30.705px] w-[217.438px] text-center text-[length:25.587px] leading-[1.2] font-[450] whitespace-pre text-destructive">
          {"Uncomfortable ride"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Six supplied passenger accounts · October 2026"}
        <br />
        {
          "Fictional exercise data · Selected repair history and passenger accounts"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page12: Page = () => (
  <section
    aria-label="Maintenance. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Passengers felt hot on the same bus twice."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"Two passenger reports, one week apart, match the same bus."}
    </p>
    <figure
      aria-label="Passengers felt hot on the same bus twice."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Passengers felt hot on the same bus twice. Two passenger reports, one week apart, match the same bus."
        className="relative h-full w-full"
      >
        <div className="absolute top-[398.752px] left-[406.404px] h-[87.182px] w-[931.192px] text-foreground">
          <svg
            viewBox="392.1327993148442 392.1327993148442 915.7344013703116 85.73440137031159"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M400 400 Q850 540 1300 400"
              strokeWidth="4px"
              fill="none"
              strokeDasharray="10px, 12px"
              stroke="oklch(1 0 0 / 0.1)"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></path>
          </svg>
        </div>
        <p className="absolute top-[57.241px] left-[348.029px] m-0 h-[35.387px] w-[132.75px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"5 October"}
        </p>
        <div className="absolute top-[192.834px] left-[313.19px] h-[183.785px] w-[202.428px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="1.1417599252557311 2.141759925255731 21.71648014948854 19.71648014948854"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M4 6 2 7"></path>
            <path d="M10 6h4"></path>
            <path d="m22 7-2-1"></path>
            <rect width="16" height="16" x="4" y="3" rx="2"></rect>
            <path d="M4 11h16"></path>
            <path d="M8 15h.01"></path>
            <path d="M16 15h.01"></path>
            <path d="M6 19v2"></path>
            <path d="M18 21v-2"></path>
          </svg>
        </div>
        <div className="absolute top-[142.837px] left-[511.482px] h-[100.758px] w-[100.74px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.11187183556260893 0.11187183556260893 23.776256328874783 23.780355221086698"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M12 2v2"></path>
            <path d="M12 8a4 4 0 0 0-1.645 7.647"></path>
            <path d="M2 12h2"></path>
            <path d="M20 14.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z"></path>
            <path d="m4.93 4.93 1.41 1.41"></path>
            <path d="m6.34 17.66-1.41 1.41"></path>
          </svg>
        </div>
        <div className="absolute top-[178.428px] left-[219.976px] h-[70.234px] w-[83.792px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-0.3601602055467388 1.6398397944532612 24.72032041109348 20.720318503744846"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M12.8 19.6A2 2 0 1 0 14 16H2"></path>
            <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"></path>
            <path d="M9.8 4.4A2 2 0 1 1 11 8H2"></path>
          </svg>
        </div>
        <p className="absolute top-[448.74px] left-[347.912px] m-0 h-[35.387px] w-[132.984px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-destructive">
          {"Hot inside"}
        </p>
        <p className="absolute top-[57.241px] left-[1256.729px] m-0 h-[35.387px] w-[145.734px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"12 October"}
        </p>
        <div className="absolute top-[192.834px] left-[1228.382px] h-[183.785px] w-[202.428px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="1.1417599252557311 2.141759925255731 21.71648014948854 19.71648014948854"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M4 6 2 7"></path>
            <path d="M10 6h4"></path>
            <path d="m22 7-2-1"></path>
            <rect width="16" height="16" x="4" y="3" rx="2"></rect>
            <path d="M4 11h16"></path>
            <path d="M8 15h.01"></path>
            <path d="M16 15h.01"></path>
            <path d="M6 19v2"></path>
            <path d="M18 21v-2"></path>
          </svg>
        </div>
        <div className="absolute top-[142.837px] left-[1426.674px] h-[100.758px] w-[100.74px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.11187183556260893 0.11187183556260893 23.776256328874783 23.780355221086698"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M12 2v2"></path>
            <path d="M12 8a4 4 0 0 0-1.645 7.647"></path>
            <path d="M2 12h2"></path>
            <path d="M20 14.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z"></path>
            <path d="m4.93 4.93 1.41 1.41"></path>
            <path d="m6.34 17.66-1.41 1.41"></path>
          </svg>
        </div>
        <div className="absolute top-[178.428px] left-[1135.168px] h-[70.234px] w-[83.792px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-0.3601602055467388 1.6398397944532612 24.72032041109348 20.720318503744846"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M12.8 19.6A2 2 0 1 0 14 16H2"></path>
            <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"></path>
            <path d="M9.8 4.4A2 2 0 1 1 11 8H2"></path>
          </svg>
        </div>
        <p className="absolute top-[448.74px] left-[1245.674px] m-0 h-[35.387px] w-[167.844px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-destructive">
          {"Weak airflow"}
        </p>
        <p className="absolute top-[526.751px] left-[524.781px] m-0 h-[58.572px] w-[694.438px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"Same bus · repeated discomfort"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Passenger accounts and matched departures · 5 and 12 Oct 2026"
        }
        <br />
        {
          "Fictional exercise data · Selected repair history and passenger accounts"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page13: Page = () => (
  <section
    aria-label="Maintenance. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"One bus needed three cooling repairs in 15 days."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"The jobs found different faults despite similar symptoms."}
    </p>
    <figure
      aria-label="One bus needed three cooling repairs in 15 days."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="One bus needed three cooling repairs in 15 days. The jobs found different faults despite similar symptoms."
        className="relative h-full w-full"
      >
        <div className="absolute top-[63.182px] left-[508.092px] h-[443.09px] w-[16px] text-foreground">
          <svg
            viewBox="492.1327993148442 62.132799314844206 15.734401370311593 435.7344013703116"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <line
              x1="500"
              x2="500"
              y1="70"
              y2="490"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></line>
          </svg>
        </div>
        <p className="absolute top-[118.254px] left-[371.139px] m-0 h-[35.387px] w-[96.109px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"28 Sep"}
        </p>
        <div className="absolute top-[106.772px] left-[516.092px] h-[69.147px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[106.772px] left-[516.092px] h-[69.147px] w-[874.517px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[104.746px] left-[1559.573px] m-0 h-[58.572px] w-[158.438px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"S$450"}
        </p>
        <p className="absolute top-[270.786px] left-[392.42px] m-0 h-[35.387px] w-[74.828px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"5 Oct"}
        </p>
        <div className="absolute top-[259.305px] left-[516.092px] h-[69.147px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[259.305px] left-[516.092px] h-[69.147px] w-[544.144px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[257.278px] left-[1560.714px] m-0 h-[58.572px] w-[157.297px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"S$280"}
        </p>
        <p className="absolute top-[423.318px] left-[379.435px] m-0 h-[35.387px] w-[87.813px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"12 Oct"}
        </p>
        <div className="absolute top-[411.837px] left-[516.092px] h-[69.147px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[411.837px] left-[516.092px] h-[69.147px] w-[757.914px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[409.81px] left-[1559.87px] m-0 h-[58.572px] w-[158.141px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"S$390"}
        </p>
        <p className="absolute top-[504.669px] left-[504.873px] m-0 h-[35.387px] w-[22.438px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[535.174px] left-[732.812px] m-0 h-[35.387px] w-[542.766px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Recorded repair charge · Singapore dollars"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Selected cooling repair records · 28 Sep to 12 Oct 2026"}
        <br />
        {
          "Fictional exercise data · Selected repair history and passenger accounts"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page14: Page = () => (
  <section
    aria-label="Maintenance. Recorded evidence"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance"}</span>
      <span>{"Recorded evidence"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Cooling repairs kept the bus out for 9.7 hours."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"This measures time in repair, not passenger delays."}
    </p>
    <figure
      aria-label="Cooling repairs kept the bus out for 9.7 hours."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Cooling repairs kept the bus out for 9.7 hours. This measures time in repair, not passenger delays."
        className="relative h-full w-full"
      >
        <div className="absolute top-[63.182px] left-[508.092px] h-[443.09px] w-[16px] text-foreground">
          <svg
            viewBox="492.1327993148442 62.132799314844206 15.734401370311593 435.7344013703116"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <line
              x1="500"
              x2="500"
              y1="70"
              y2="490"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></line>
          </svg>
        </div>
        <p className="absolute top-[118.254px] left-[371.139px] m-0 h-[35.387px] w-[96.109px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"28 Sep"}
        </p>
        <div className="absolute top-[106.772px] left-[516.092px] h-[69.147px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[106.772px] left-[516.092px] h-[69.147px] w-[646.382px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[104.746px] left-[1604.042px] m-0 h-[58.572px] w-[113.969px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"2.8 h"}
        </p>
        <p className="absolute top-[270.786px] left-[392.42px] m-0 h-[35.387px] w-[74.828px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"5 Oct"}
        </p>
        <div className="absolute top-[259.305px] left-[516.092px] h-[69.147px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[259.305px] left-[516.092px] h-[69.147px] w-[684.404px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[257.278px] left-[1645.495px] m-0 h-[58.572px] w-[72.516px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"3 h"}
        </p>
        <p className="absolute top-[423.318px] left-[379.435px] m-0 h-[35.387px] w-[87.813px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-foreground">
          {"12 Oct"}
        </p>
        <div className="absolute top-[411.837px] left-[516.092px] h-[69.147px] w-[874.517px] [border-radius:4.068px] bg-muted"></div>
        <div className="absolute top-[411.837px] left-[516.092px] h-[69.147px] w-[874.517px] [border-radius:4.068px] bg-destructive"></div>
        <p className="absolute top-[409.81px] left-[1603.229px] m-0 h-[58.572px] w-[114.781px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"3.8 h"}
        </p>
        <p className="absolute top-[504.669px] left-[504.873px] m-0 h-[35.387px] w-[22.438px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"0"}
        </p>
        <p className="absolute top-[535.174px] left-[724.976px] m-0 h-[35.387px] w-[558.438px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Hours from repair opening to signed release"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Selected cooling repair records · 28 Sep to 12 Oct 2026"}
        <br />
        {
          "Fictional exercise data · Selected repair history and passenger accounts"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page15: Page = () => (
  <section
    aria-label="Maintenance. Section divider"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      {"LIONLINK · Maintenance"}
    </header>
    <div className="flex flex-1 items-center justify-between gap-24">
      <div className="max-w-[1200px]">
        <div className="mb-12 h-2 w-32 bg-destructive"></div>
        <h1 className="text-[120px] leading-[1.05] font-semibold tracking-[-0.035em]">
          {"Caveats"}
        </h1>
        <p className="mt-12 text-[36px] leading-snug text-muted-foreground">
          {"What the data does not tell us."}
        </p>
      </div>
      <div
        aria-label="Diagram"
        className="lucide lucide-search relative size-[260px] shrink-0 text-muted-foreground"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="pointer-events-none h-full w-full"
        >
          <path d="m21 21-4.34-4.34"></path>
          <circle cx="11" cy="11" r="8"></circle>
        </svg>
      </div>
    </div>
    <footer className="flex justify-between border-t border-border pt-5 text-[23px] text-muted-foreground">
      <span>{"Stakeholder discussion"}</span>
      <span className="tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page16: Page = () => (
  <section
    aria-label="Maintenance. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance"}</span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Two years do not show a cost trend."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share earlier monthly maintenance reports using the same cost categories."
      }
    </p>
    <figure
      aria-label="Two years do not show a cost trend."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Two years do not show a cost trend. Share earlier monthly maintenance reports using the same cost categories."
        className="relative h-full w-full"
      >
        <p className="absolute top-[57.965px] left-[527.717px] m-0 h-[42.352px] w-[185.641px] text-center text-[length:35.293px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Earlier years"}
        </p>
        <p className="absolute top-[61.582px] left-[1134.565px] m-0 h-[38.116px] w-[286.609px] text-center text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Oct 2024 to Sep 2026"}
        </p>
        <div className="absolute top-[247.875px] left-[246.372px] h-[16px] w-[801.27px] text-muted-foreground">
          <svg
            viewBox="140.93305463624225 280.9330546362422 908.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M150 290H1040"
              fill="none"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              strokeDasharray="12px, 14px"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="text-muted-foreground"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[186.109px] left-[1066.935px] h-[135.117px] w-[421.87px] text-foreground">
          <svg
            viewBox="1070.9330546362423 210.93305463624225 478.1338907275155 153.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M1080 220V355 M1540 220V355"
              strokeWidth="5px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(0.922 0 0)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-primary"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[216.172px] left-[1074.935px] h-[79.406px] w-[405.87px] [border-radius:3.529px] bg-primary"></div>
        <p className="absolute top-[227.698px] left-[1210.964px] m-0 h-[50.822px] w-[133.813px] text-center text-[length:42.352px] leading-[1.2] font-[400] whitespace-pre [color:oklch(0.205_0_0)]">
          {"2 years"}
        </p>
        <p className="absolute top-[129.759px] left-[593.381px] m-0 h-[116.467px] w-[54.313px] text-center text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[343.137px] left-[466.287px] m-0 h-[33.881px] w-[308.5px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"No earlier records"}
        </p>
        <p className="absolute top-[378.427px] left-[551.998px] m-0 h-[33.881px] w-[137.078px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"were provided."}
        </p>
        <p className="absolute top-[343.137px] left-[1172.815px] m-0 h-[33.881px] w-[210.109px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"Dates provided"}
        </p>
        <p className="absolute top-[470.305px] left-[525.594px] m-0 h-[40.234px] w-[692.813px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"We need more years to check the trend."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Monthly maintenance and mileage records · Oct 2024 to Sep 2026"
        }
        <br />
        {
          "Fictional exercise data · Same eight selected buses · not the whole fleet"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page17: Page = () => (
  <section
    aria-label="Maintenance. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance"}</span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Eight buses may not represent the fleet."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share maintenance costs, mileage and ages for other buses doing similar work."
      }
    </p>
    <figure
      aria-label="Eight buses may not represent the fleet."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Eight buses may not represent the fleet. Share maintenance costs, mileage and ages for other buses doing similar work."
        className="relative h-full w-full"
      >
        <p className="absolute top-[57.965px] left-[372.431px] m-0 h-[42.352px] w-[257.984px] text-center text-[length:35.293px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"8 selected buses"}
        </p>
        <p className="absolute top-[57.965px] left-[1047.598px] m-0 h-[42.352px] w-[425.25px] text-center text-[length:35.293px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Other buses and their usage"}
        </p>
        <div className="absolute top-[169.57px] left-[301.517px] h-[75.555px] w-[82.174px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-0.4178520970020707 0.5821479029979293 24.83570419400414 22.83570419400414"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M4 6 2 7"></path>
            <path d="M10 6h4"></path>
            <path d="m22 7-2-1"></path>
            <rect width="16" height="16" x="4" y="3" rx="2"></rect>
            <path d="M4 11h16"></path>
            <path d="M8 15h.01"></path>
            <path d="M16 15h.01"></path>
            <path d="M6 19v2"></path>
            <path d="M18 21v-2"></path>
          </svg>
        </div>
        <div className="absolute top-[169.57px] left-[411.808px] h-[75.555px] w-[82.174px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-0.4178520970020707 0.5821479029979293 24.83570419400414 22.83570419400414"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M4 6 2 7"></path>
            <path d="M10 6h4"></path>
            <path d="m22 7-2-1"></path>
            <rect width="16" height="16" x="4" y="3" rx="2"></rect>
            <path d="M4 11h16"></path>
            <path d="M8 15h.01"></path>
            <path d="M16 15h.01"></path>
            <path d="M6 19v2"></path>
            <path d="M18 21v-2"></path>
          </svg>
        </div>
        <div className="absolute top-[169.57px] left-[522.099px] h-[75.555px] w-[82.174px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-0.4178520970020707 0.5821479029979293 24.83570419400414 22.83570419400414"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M4 6 2 7"></path>
            <path d="M10 6h4"></path>
            <path d="m22 7-2-1"></path>
            <rect width="16" height="16" x="4" y="3" rx="2"></rect>
            <path d="M4 11h16"></path>
            <path d="M8 15h.01"></path>
            <path d="M16 15h.01"></path>
            <path d="M6 19v2"></path>
            <path d="M18 21v-2"></path>
          </svg>
        </div>
        <div className="absolute top-[169.57px] left-[632.389px] h-[75.555px] w-[82.174px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-0.4178520970020707 0.5821479029979293 24.83570419400414 22.83570419400414"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M4 6 2 7"></path>
            <path d="M10 6h4"></path>
            <path d="m22 7-2-1"></path>
            <rect width="16" height="16" x="4" y="3" rx="2"></rect>
            <path d="M4 11h16"></path>
            <path d="M8 15h.01"></path>
            <path d="M16 15h.01"></path>
            <path d="M6 19v2"></path>
            <path d="M18 21v-2"></path>
          </svg>
        </div>
        <div className="absolute top-[301.914px] left-[301.517px] h-[75.563px] w-[82.174px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-0.4178520970020707 0.5821479029979293 24.83570419400414 22.83570419400414"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M4 6 2 7"></path>
            <path d="M10 6h4"></path>
            <path d="m22 7-2-1"></path>
            <rect width="16" height="16" x="4" y="3" rx="2"></rect>
            <path d="M4 11h16"></path>
            <path d="M8 15h.01"></path>
            <path d="M16 15h.01"></path>
            <path d="M6 19v2"></path>
            <path d="M18 21v-2"></path>
          </svg>
        </div>
        <div className="absolute top-[301.914px] left-[411.808px] h-[75.563px] w-[82.174px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-0.4178520970020707 0.5821479029979293 24.83570419400414 22.83570419400414"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M4 6 2 7"></path>
            <path d="M10 6h4"></path>
            <path d="m22 7-2-1"></path>
            <rect width="16" height="16" x="4" y="3" rx="2"></rect>
            <path d="M4 11h16"></path>
            <path d="M8 15h.01"></path>
            <path d="M16 15h.01"></path>
            <path d="M6 19v2"></path>
            <path d="M18 21v-2"></path>
          </svg>
        </div>
        <div className="absolute top-[301.914px] left-[522.099px] h-[75.563px] w-[82.174px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-0.4178520970020707 0.5821479029979293 24.83570419400414 22.83570419400414"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M4 6 2 7"></path>
            <path d="M10 6h4"></path>
            <path d="m22 7-2-1"></path>
            <rect width="16" height="16" x="4" y="3" rx="2"></rect>
            <path d="M4 11h16"></path>
            <path d="M8 15h.01"></path>
            <path d="M16 15h.01"></path>
            <path d="M6 19v2"></path>
            <path d="M18 21v-2"></path>
          </svg>
        </div>
        <div className="absolute top-[301.914px] left-[632.389px] h-[75.563px] w-[82.174px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-0.4178520970020707 0.5821479029979293 24.83570419400414 22.83570419400414"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M4 6 2 7"></path>
            <path d="M10 6h4"></path>
            <path d="m22 7-2-1"></path>
            <rect width="16" height="16" x="4" y="3" rx="2"></rect>
            <path d="M4 11h16"></path>
            <path d="M8 15h.01"></path>
            <path d="M16 15h.01"></path>
            <path d="M6 19v2"></path>
            <path d="M18 21v-2"></path>
          </svg>
        </div>
        <div className="absolute top-[247.875px] left-[802.237px] h-[16px] w-[174.819px] text-muted-foreground">
          <svg
            viewBox="770.9330546362422 280.9330546362422 198.13389072751553 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M780 290H960"
              fill="none"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              strokeDasharray="12px, 14px"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="text-muted-foreground"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[222.141px] left-[855.912px] h-[67.469px] w-[67.469px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-1.108666981859805 -1.108666981859805 26.21733396371961 26.21733396371961"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="m15 9-6 6"></path>
            <path d="m9 9 6 6"></path>
          </svg>
        </div>
        <div className="absolute top-[154.406px] left-[1066.112px] h-[229.406px] w-[388.223px] [border-radius:5.294px] [border-width:2.647px] [border-style:solid] border-muted-foreground"></div>
        <p className="absolute top-[200.345px] left-[1233.067px] m-0 h-[116.467px] w-[54.313px] text-center text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[391.661px] left-[385.783px] m-0 h-[33.881px] w-[231.281px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"Selected examples"}
        </p>
        <p className="absolute top-[391.661px] left-[1090.411px] m-0 h-[33.881px] w-[339.625px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"The wider pattern"}
        </p>
        <p className="absolute top-[426.958px] left-[1231.575px] m-0 h-[33.881px] w-[57.297px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"is unknown."}
        </p>
        <p className="absolute top-[470.305px] left-[531.641px] m-0 h-[40.234px] w-[680.719px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Total fleet maintenance costs are unknown."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Monthly maintenance and mileage records · Oct 2024 to Sep 2026"
        }
        <br />
        {
          "Fictional exercise data · Same eight selected buses · not the whole fleet"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page18: Page = () => (
  <section
    aria-label="Maintenance. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance"}</span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Totals hide the cost of major one-off jobs."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share invoices and job sheets to separate routine work, major jobs and price changes."
      }
    </p>
    <figure
      aria-label="Totals hide the cost of major one-off jobs."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Totals hide the cost of major one-off jobs. Share invoices and job sheets to separate routine work, major jobs and price changes."
        className="relative h-full w-full"
      >
        <div className="absolute top-[170.672px] left-[380.927px] h-[82.172px] w-[126.291px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.5492887417987575 4.549288741798757 22.901422516402484 14.901422516402485"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <rect width="20" height="12" x="2" y="6" rx="2"></rect>
            <circle cx="12" cy="12" r="2"></circle>
            <path d="M6 12h.01M18 12h.01"></path>
          </svg>
        </div>
        <p className="absolute top-[326.286px] left-[253.205px] m-0 h-[38.116px] w-[381.734px] text-center text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Maintenance totals supplied"}
        </p>
        <div className="absolute top-[225.813px] left-[652.242px] h-[16px] w-[223.347px] text-muted-foreground">
          <svg
            viewBox="600.9330546362422 255.93305463624225 253.13389072751553 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M610 265H845"
              fill="none"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              strokeDasharray="12px, 14px"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="text-muted-foreground"
            ></path>
          </svg>
        </div>
        <p className="absolute top-[27.852px] left-[1029.62px] m-0 h-[35.999px] w-[355.328px] text-center text-[length:29.999px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Invoices and job"}
        </p>
        <p className="absolute top-[65.352px] left-[1162.542px] m-0 h-[35.999px] w-[89.484px] text-center text-[length:29.999px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"sheets"}
        </p>
        <p className="absolute top-[127.762px] left-[1042.271px] m-0 h-[38.116px] w-[180.031px] text-center text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Regular work"}
        </p>
        <p className="absolute top-[114.318px] left-[1456.528px] m-0 h-[65.645px] w-[30.906px] text-center text-[length:54.704px] leading-[1.2] font-[400] whitespace-pre text-destructive">
          {"?"}
        </p>
        <div className="absolute top-[181.703px] left-[934.586px] h-[16px] w-[571.865px] text-foreground">
          <svg
            viewBox="920.9330546362422 205.93305463624225 648.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M930 215H1560"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></path>
          </svg>
        </div>
        <p className="absolute top-[242.465px] left-[976.489px] m-0 h-[38.116px] w-[311.594px] text-center text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Parts and labour prices"}
        </p>
        <p className="absolute top-[229.021px] left-[1456.528px] m-0 h-[65.645px] w-[30.906px] text-center text-[length:54.704px] leading-[1.2] font-[400] whitespace-pre text-destructive">
          {"?"}
        </p>
        <div className="absolute top-[296.406px] left-[934.586px] h-[16px] w-[571.865px] text-foreground">
          <svg
            viewBox="920.9330546362422 335.9330546362422 648.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M930 345H1560"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></path>
          </svg>
        </div>
        <p className="absolute top-[357.168px] left-[978.864px] m-0 h-[38.116px] w-[306.844px] text-center text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Major one-off jobs"}
        </p>
        <p className="absolute top-[343.724px] left-[1456.528px] m-0 h-[65.645px] w-[30.906px] text-center text-[length:54.704px] leading-[1.2] font-[400] whitespace-pre text-destructive">
          {"?"}
        </p>
        <div className="absolute top-[411.102px] left-[934.586px] h-[16px] w-[571.865px] text-foreground">
          <svg
            viewBox="920.9330546362422 465.9330546362422 648.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M930 475H1560"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></path>
          </svg>
        </div>
        <p className="absolute top-[470.305px] left-[550.719px] m-0 h-[40.234px] w-[642.563px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Routine costs are not separated."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Monthly maintenance and mileage records · Oct 2024 to Sep 2026"
        }
        <br />
        {
          "Fictional exercise data · Same eight selected buses · not the whole fleet"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page19: Page = () => (
  <section
    aria-label="Maintenance. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance"}</span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Missing approval records do not prove buses are unavailable."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share signed release records and completed job sheets to confirm when buses could return to service."
      }
    </p>
    <figure
      aria-label="Missing approval records do not prove buses are unavailable."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Missing approval records do not prove buses are unavailable. Share signed release records and completed job sheets to confirm when buses could return to service."
        className="relative h-full w-full"
      >
        <p className="absolute top-[30.703px] left-[287.725px] m-0 h-[38.116px] w-[409.75px] text-center text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"8 release records are missing"}
        </p>
        <div className="absolute top-[177.289px] left-[211.079px] h-[16px] w-[549.807px] text-foreground">
          <svg
            viewBox="100.93305463624223 200.93305463624225 623.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M110 210H715"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></path>
          </svg>
        </div>
        <p className="absolute top-[135.79px] left-[363.561px] m-0 h-[33.881px] w-[258.078px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Expected completion"}
        </p>
        <div className="absolute top-[278.758px] left-[211.079px] h-[16px] w-[549.807px] text-foreground">
          <svg
            viewBox="100.93305463624223 315.9330546362422 623.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M110 325H715"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></path>
          </svg>
        </div>
        <p className="absolute top-[237.259px] left-[368.584px] m-0 h-[33.881px] w-[248.031px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Actual completion: ?"}
        </p>
        <div className="absolute top-[380.223px] left-[211.079px] h-[16px] w-[549.807px] text-foreground">
          <svg
            viewBox="100.93305463624223 430.9330546362422 623.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M110 440H715"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></path>
          </svg>
        </div>
        <p className="absolute top-[338.723px] left-[388.686px] m-0 h-[33.881px] w-[207.828px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Signed release: ?"}
        </p>
        <div className="absolute top-[243.461px] left-[819.884px] h-[16px] w-[135.114px] text-muted-foreground">
          <svg
            viewBox="790.9330546362422 275.9330546362422 153.13389072751553 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M800 285H935"
              fill="none"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              strokeDasharray="12px, 14px"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="text-muted-foreground"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[152.289px] left-[1166.932px] h-[163.055px] w-[133.644px] text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="2.911966556349068 0.9119634569075399 18.17607070199913 22.17607070199913"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
            <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
            <path d="M10 9H8"></path>
            <path d="M16 13H8"></path>
            <path d="M16 17H8"></path>
          </svg>
        </div>
        <div className="absolute top-[216.168px] left-[1176.402px] h-[127.938px] w-[132.349px] [background-color:oklch(0.145_0_0)]"></div>
        <p className="absolute top-[217.993px] left-[1215.421px] m-0 h-[116.467px] w-[54.313px] text-center text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[367.547px] left-[1042.381px] m-0 h-[35.999px] w-[400.391px] text-center text-[length:29.999px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Signed release dates and times"}
        </p>
        <p className="absolute top-[470.309px] left-[589.391px] m-0 h-[40.234px] w-[565.219px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Bus availability is unconfirmed."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Workshop repair status records · October 2026"}
        <br />
        {"Fictional exercise data · Separate group of eight workshop buses"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page20: Page = () => (
  <section
    aria-label="Maintenance. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance"}</span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Repair status does not show time spent waiting."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "Share dated job sheets, parts orders and delivery receipts to separate repair time from waits for parts."
      }
    </p>
    <figure
      aria-label="Repair status does not show time spent waiting."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Repair status does not show time spent waiting. Share dated job sheets, parts orders and delivery receipts to separate repair time from waits for parts."
        className="relative h-full w-full"
      >
        <p className="absolute top-[30.703px] left-[331.428px] m-0 h-[38.116px] w-[322.344px] text-center text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Current status recorded"}
        </p>
        <div className="absolute top-[177.289px] left-[211.079px] h-[16px] w-[549.807px] text-foreground">
          <svg
            viewBox="100.93305463624223 200.93305463624225 623.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M110 210H715"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></path>
          </svg>
        </div>
        <p className="absolute top-[135.79px] left-[403.553px] m-0 h-[33.881px] w-[178.094px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Part ordered: ?"}
        </p>
        <div className="absolute top-[278.758px] left-[211.079px] h-[16px] w-[549.807px] text-foreground">
          <svg
            viewBox="100.93305463624223 315.9330546362422 623.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M110 325H715"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></path>
          </svg>
        </div>
        <p className="absolute top-[237.259px] left-[398.975px] m-0 h-[33.881px] w-[187.25px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Part received: ?"}
        </p>
        <div className="absolute top-[380.223px] left-[211.079px] h-[16px] w-[549.807px] text-foreground">
          <svg
            viewBox="100.93305463624223 430.9330546362422 623.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M110 440H715"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></path>
          </svg>
        </div>
        <p className="absolute top-[338.723px] left-[371.498px] m-0 h-[33.881px] w-[242.203px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Repair completed: ?"}
        </p>
        <div className="absolute top-[243.461px] left-[819.884px] h-[16px] w-[135.114px] text-muted-foreground">
          <svg
            viewBox="790.9330546362422 275.9330546362422 153.13389072751553 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M800 285H935"
              fill="none"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              strokeDasharray="12px, 14px"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="text-muted-foreground"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[152.289px] left-[1166.932px] h-[163.055px] w-[133.644px] text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="2.911966556349068 0.9119634569075399 18.17607070199913 22.17607070199913"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
            <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
            <path d="M10 9H8"></path>
            <path d="M16 13H8"></path>
            <path d="M16 17H8"></path>
          </svg>
        </div>
        <div className="absolute top-[216.168px] left-[1176.402px] h-[127.938px] w-[132.349px] [background-color:oklch(0.145_0_0)]"></div>
        <p className="absolute top-[217.993px] left-[1215.421px] m-0 h-[116.467px] w-[54.313px] text-center text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[367.547px] left-[1080.007px] m-0 h-[35.999px] w-[325.141px] text-center text-[length:29.999px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Dates on jobs, orders and"}
        </p>
        <p className="absolute top-[405.047px] left-[1189.53px] m-0 h-[35.999px] w-[106.094px] text-center text-[length:29.999px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"receipts"}
        </p>
        <p className="absolute top-[470.309px] left-[585.141px] m-0 h-[40.234px] w-[573.719px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Time waiting for parts is unknown."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Workshop repair status records · October 2026"}
        <br />
        {"Fictional exercise data · Separate group of eight workshop buses"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page21: Page = () => (
  <section
    aria-label="Maintenance. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance"}</span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Replacement bus costs are not provided."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"Share dated hire invoices and credits to check replacement bus costs."}
    </p>
    <figure
      aria-label="Replacement bus costs are not provided."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Replacement bus costs are not provided. Share dated hire invoices and credits to check replacement bus costs."
        className="relative h-full w-full"
      >
        <div className="absolute top-[136.848px] left-[271.371px] h-[140.996px] w-[115.997px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="2.7199606545283155 0.7199575550867872 18.560082505640636 22.560082505640636"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
            <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
            <path d="M10 9H8"></path>
            <path d="M16 13H8"></path>
            <path d="M16 17H8"></path>
          </svg>
        </div>
        <div className="absolute top-[203.758px] left-[489.012px] h-[16px] w-[210.112px] text-muted-foreground">
          <svg
            viewBox="415.9330546362422 230.93305463624225 238.13389072751553 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M425 240H645"
              fill="none"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              strokeDasharray="12px, 14px"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="text-muted-foreground"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[110.289px] left-[735.24px] h-[194.113px] w-[229.405px] [border-width:2.647px] [border-style:solid] border-muted-foreground"></div>
        <p className="absolute top-[151.817px] left-[822.786px] m-0 h-[116.467px] w-[54.313px] text-center text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <div className="absolute top-[203.758px] left-[1005.172px] h-[16px] w-[218.935px] text-muted-foreground">
          <svg
            viewBox="1000.9330546362422 230.93305463624225 248.13389072751553 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M1010 240H1240"
              fill="none"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              strokeDasharray="12px, 14px"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="text-muted-foreground"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[139.789px] left-[1273.546px] h-[64.527px] w-[96.88px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0.021757375180123883 4.021757375180124 23.95648524963975 15.956485249639751"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <rect width="20" height="12" x="2" y="6" rx="2"></rect>
            <circle cx="12" cy="12" r="2"></circle>
            <path d="M6 12h.01M18 12h.01"></path>
          </svg>
        </div>
        <p className="absolute top-[142.993px] left-[1427.179px] m-0 h-[116.467px] w-[54.313px] text-center text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[329.903px] left-[186.32px] m-0 h-[33.881px] w-[294.922px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"8 workshop buses listed"}
        </p>
        <p className="absolute top-[329.903px] left-[705.301px] m-0 h-[33.881px] w-[289.281px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Dated bus-hire invoices"}
        </p>
        <p className="absolute top-[329.903px] left-[1213.944px] m-0 h-[33.881px] w-[339.609px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"The cost is unknown."}
        </p>
        <p className="absolute top-[470.309px] left-[628.188px] m-0 h-[40.234px] w-[487.625px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Replacement bus costs are unknown."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Workshop repair status records · October 2026"}
        <br />
        {"Fictional exercise data · Separate group of eight workshop buses"}
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page22: Page = () => (
  <section
    aria-label="Maintenance. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance"}</span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"One bus cannot show how common cooling faults are."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"Share earlier cooling job sheets and repair records for other buses."}
    </p>
    <figure
      aria-label="One bus cannot show how common cooling faults are."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="One bus cannot show how common cooling faults are. Share earlier cooling job sheets and repair records for other buses."
        className="relative h-full w-full"
      >
        <p className="absolute top-[30.704px] left-[371.866px] m-0 h-[38.116px] w-[241.469px] text-center text-[length:31.764px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"3 jobs on one bus"}
        </p>
        <div className="absolute top-[177.288px] left-[211.079px] h-[16px] w-[549.807px] text-foreground">
          <svg
            viewBox="100.93305463624223 200.93305463624225 623.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M110 210H715"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></path>
          </svg>
        </div>
        <p className="absolute top-[135.79px] left-[406.623px] m-0 h-[33.881px] w-[171.953px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"28 Sep: repair"}
        </p>
        <div className="absolute top-[278.756px] left-[211.079px] h-[16px] w-[549.807px] text-foreground">
          <svg
            viewBox="100.93305463624223 315.9330546362422 623.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M110 325H715"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></path>
          </svg>
        </div>
        <p className="absolute top-[237.257px] left-[416.67px] m-0 h-[33.881px] w-[151.859px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"5 Oct: repair"}
        </p>
        <div className="absolute top-[380.224px] left-[211.079px] h-[16px] w-[549.807px] text-foreground">
          <svg
            viewBox="100.93305463624223 430.9330546362422 623.1338907275156 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M110 440H715"
              strokeWidth="2px"
              fill="rgb(0, 0, 0)"
              stroke="oklch(1 0 0 / 0.1)"
              strokeDasharray="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="stroke-border"
            ></path>
          </svg>
        </div>
        <p className="absolute top-[338.724px] left-[410.537px] m-0 h-[33.881px] w-[164.125px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"12 Oct: repair"}
        </p>
        <div className="absolute top-[243.463px] left-[819.884px] h-[16px] w-[135.114px] text-muted-foreground">
          <svg
            viewBox="790.9330546362422 275.9330546362422 153.13389072751553 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M800 285H935"
              fill="none"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              strokeDasharray="12px, 14px"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="text-muted-foreground"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[152.289px] left-[1166.932px] h-[163.055px] w-[133.644px] text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="2.911966556349068 0.9119634569075399 18.17607070199913 22.17607070199913"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
            <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
            <path d="M10 9H8"></path>
            <path d="M16 13H8"></path>
            <path d="M16 17H8"></path>
          </svg>
        </div>
        <div className="absolute top-[216.17px] left-[1176.402px] h-[127.938px] w-[132.349px] [background-color:oklch(0.145_0_0)]"></div>
        <p className="absolute top-[217.992px] left-[1215.421px] m-0 h-[116.467px] w-[54.313px] text-center text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[367.547px] left-[1064.819px] m-0 h-[35.999px] w-[355.516px] text-center text-[length:29.999px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Earlier jobs and other buses"}
        </p>
        <p className="absolute top-[470.309px] left-[595.109px] m-0 h-[40.234px] w-[553.781px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"We do not know how common faults are."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Selected cooling repair records · 28 Sep to 12 Oct 2026"}
        <br />
        {
          "Fictional exercise data · Selected repair history and passenger accounts"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page23: Page = () => (
  <section
    aria-label="Maintenance. Caveat"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance"}</span>
      <span>{"Caveat"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Two complaints cannot show how common discomfort is."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {"Share the full cooling complaint register, including earlier months."}
    </p>
    <figure
      aria-label="Two complaints cannot show how common discomfort is."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Two complaints cannot show how common discomfort is. Share the full cooling complaint register, including earlier months."
        className="relative h-full w-full"
      >
        <p className="absolute top-[57.969px] left-[349.142px] m-0 h-[42.352px] w-[304.563px] text-center text-[length:35.293px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"2 selected accounts"}
        </p>
        <p className="absolute top-[57.969px] left-[1094.333px] m-0 h-[42.352px] w-[331.781px] text-center text-[length:35.293px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Full complaint register"}
        </p>
        <div className="absolute top-[209.273px] left-[391.956px] h-[75.557px] w-[68.94px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="1.5821479029979293 0.5821479029979293 20.83570419400414 22.83570419400414"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle cx="12" cy="8" r="5"></circle>
            <path d="M20 21a8 8 0 0 0-16 0"></path>
          </svg>
        </div>
        <div className="absolute top-[209.273px] left-[533.128px] h-[75.557px] w-[68.94px] text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="1.5821479029979293 0.5821479029979293 20.83570419400414 22.83570419400414"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle cx="12" cy="8" r="5"></circle>
            <path d="M20 21a8 8 0 0 0-16 0"></path>
          </svg>
        </div>
        <div className="absolute top-[247.875px] left-[802.237px] h-[16px] w-[174.819px] text-muted-foreground">
          <svg
            viewBox="770.9330546362422 280.9330546362422 198.13389072751553 18.13389072751553"
            width="100%"
            height="100%"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <path
              d="M780 290H960"
              fill="none"
              stroke="oklch(0.708 0 0)"
              strokeWidth="4px"
              strokeDasharray="12px, 14px"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              className="text-muted-foreground"
            ></path>
          </svg>
        </div>
        <div className="absolute top-[222.141px] left-[855.912px] h-[67.469px] w-[67.469px] text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="-1.108666981859805 -1.108666981859805 26.21733396371961 26.21733396371961"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="m15 9-6 6"></path>
            <path d="m9 9 6 6"></path>
          </svg>
        </div>
        <div className="absolute top-[154.406px] left-[1066.112px] h-[229.406px] w-[388.223px] [border-radius:5.294px] [border-width:2.647px] [border-style:solid] border-muted-foreground"></div>
        <p className="absolute top-[200.347px] left-[1233.067px] m-0 h-[116.467px] w-[54.313px] text-center text-[length:97.056px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"?"}
        </p>
        <p className="absolute top-[391.665px] left-[385.783px] m-0 h-[33.881px] w-[231.281px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"Selected examples"}
        </p>
        <p className="absolute top-[391.665px] left-[1090.411px] m-0 h-[33.881px] w-[339.625px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"The wider pattern"}
        </p>
        <p className="absolute top-[426.958px] left-[1231.575px] m-0 h-[33.881px] w-[57.297px] text-center text-[length:28.234px] leading-[1.2] font-[400] whitespace-pre text-muted-foreground">
          {"is unknown."}
        </p>
        <p className="absolute top-[470.309px] left-[544.414px] m-0 h-[40.234px] w-[655.172px] text-center text-[length:33.528px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Two accounts do not show how common this is."}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {"Source: Selected cooling repair records · 28 Sep to 12 Oct 2026"}
        <br />
        {
          "Fictional exercise data · Selected repair history and passenger accounts"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page24: Page = () => (
  <section
    aria-label="Maintenance. Impact"
    className="flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LIONLINK · Maintenance"}</span>
      <span>{"Impact"}</span>
    </header>
    <h1 className="mt-10 max-w-[1680px] text-[76px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Annual maintenance costs rose by S$16,790."}
    </h1>
    <p className="mt-5 text-[29px] leading-snug text-muted-foreground">
      {
        "This covers eight buses and includes the S$11,255 repair increase. It is not a measure of possible savings."
      }
    </p>
    <figure
      aria-label="Annual maintenance costs rose by S$16,790."
      className="my-4 min-h-0 w-full flex-1"
    >
      <div
        aria-label="Annual maintenance costs rose by S$16,790. This covers eight buses and includes the S$11,255 repair increase. It is not a measure of possible savings."
        className="relative h-full w-full"
      >
        <p className="absolute top-[178.42px] left-[131.361px] m-0 h-[104.942px] w-[281.359px] text-center text-[length:87.452px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"81,835"}
        </p>
        <p className="absolute top-[318.221px] left-[188.814px] m-0 h-[46.37px] w-[166.453px] text-center text-[length:38.641px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Later year"}
        </p>
        <p className="absolute top-[178.42px] left-[724.055px] m-0 h-[104.942px] w-[295.891px] text-center text-[length:87.452px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"65,045"}
        </p>
        <p className="absolute top-[318.221px] left-[779.602px] m-0 h-[46.37px] w-[184.797px] text-center text-[length:38.641px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Earlier year"}
        </p>
        <p className="absolute top-[178.42px] left-[1333.647px] m-0 h-[104.942px] w-[276.625px] text-center text-[length:87.452px] leading-[1.2] font-[600] whitespace-pre text-destructive">
          {"16,790"}
        </p>
        <p className="absolute top-[318.221px] left-[1262.811px] m-0 h-[46.37px] w-[418.297px] text-center text-[length:38.641px] leading-[1.2] font-[400] whitespace-pre text-foreground">
          {"Extra maintenance spend"}
        </p>
        <p className="absolute top-[231.854px] left-[554.434px] m-0 h-[58.572px] w-[35.172px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"−"}
        </p>
        <p className="absolute top-[231.854px] left-[1154.394px] m-0 h-[58.572px] w-[35.172px] text-center text-[length:48.81px] leading-[1.2] font-[600] whitespace-pre text-foreground">
          {"="}
        </p>
        <p className="absolute top-[514.838px] left-[537.023px] m-0 h-[35.387px] w-[669.953px] text-center text-[length:29.49px] leading-[1.2] font-[450] whitespace-pre text-muted-foreground">
          {"Singapore dollars · servicing + extra checks + repairs"}
        </p>
      </div>
    </figure>
    <footer className="flex shrink-0 items-center justify-between gap-8 border-t border-border pt-5 text-[19px] leading-snug text-muted-foreground">
      <span>
        {
          "Source: Monthly maintenance and mileage records · Oct 2024 to Sep 2026"
        }
        <br />
        {
          "Fictional exercise data · Same eight selected buses · not the whole fleet"
        }
      </span>
      <span className="text-[23px] tabular-nums">
        <PageNumber />
      </span>
    </footer>
  </section>
)

export default [
  Page1,
  Page2,
  Page3,
  Page4,
  Page5,
  Page6,
  Page7,
  Page8,
  Page9,
  Page10,
  Page11,
  Page12,
  Page13,
  Page14,
  Page15,
  Page16,
  Page17,
  Page18,
  Page19,
  Page20,
  Page21,
  Page22,
  Page23,
  Page24,
] satisfies Page[]
