import { ArrowRight, Check, ShieldCheck } from "lucide-react"
import { useSlidePageNumber, type Page } from "@open-slide/core"
import "../../components/deck.css"
import "./theme.css"

export const meta = {
  title: "LionLink AI scheduling",
  createdAt: "2026-10-07T03:14:51Z",
}

export const notes = [
  "On 7 and 14 October, the driver for the 06:00 Service 235 bus was late. Control used the bus and driver assigned to 06:20 to cover the earlier trip. That bus could not finish the journey and prepare for another departure by 06:20.\n\nThe 06:20 departures left at 06:40:32 on 7 October and 06:39:53 on 14 October. Two passenger reports describe waiting for the expected bus. One passenger reported giving up. The records do not show lost fares.\n\nSources include trips, bus readiness, driver updates, control actions and passenger reports. The operating data covers ten weekdays from 5 to 16 October 2026, with morning departures and complete journeys. All business data in this deck is fictional exercise data, including dates after the deck's creation.",
  "All 6,900 trips in the extract finished. A trip counts as late when it arrives more than five minutes after its scheduled time. Of 100 late arrivals, Service 132 had 42, Service 159 had 48, Service 235 had eight, and other services had two. Services 132 and 159 account for 90%. Each had 280 trips, with late arrival rates of 15.0% and 17.1%.\n\nThere were 48 departures more than five minutes late. Of the 100 late arrivals, 52 left no more than five minutes late. This is why checking only departure times misses part of the problem. Some peak journeys on 132 and 159 took about 23 and 26 minutes longer than planned. The records do not explain every delay.\n\nSource is the complete supplied trip ledger, 5 to 16 October 2026. It covers morning departures, not a full month. All figures are fictional exercise data.",
  "The chart shows the same 07:15 Service 238 departure at Toa Payoh on all ten supplied dates. Eight departures boarded 85 people and left between 24 and 39 waiting. On the two Fridays, 18 and 26 people boarded, with no remaining queue. Across the ten departures, the records show 243 boarding deferrals. This does not identify 243 different people or lost fares.\n\nService 261 used 22.87% of its capacity on average after weighting each route segment by distance. On 131 of 280 trips, occupancy never exceeded 30% and no queue remained at any stop. These records support reviewing bus assignments. They do not establish that a bus can move to another route or that trips can be cut.\n\nA separate test moved the next 238 departure from 07:30 to 07:25. It kept 2,968 origin boardings and reduced total origin waiting by 721.05 person-minutes, or 12.02 passenger-hours, over ten dates. It helped eight days and made both Fridays worse. The smallest spare turnaround margin was 54 seconds. The test did not model changed boarding at later stops. Selecting busy days afterwards does not prove a demand forecast works.\n\nSources are stop records, origin arrivals and bus capacities, 5 to 16 October 2026. All records are fictional exercise data.",
  "For the same eight selected buses, time unavailable for corrective repairs rose from 151.03 hours in October 2024 to September 2025 to 265.26 hours in October 2025 to September 2026, an increase of 75.6%. Repair spending rose from S$13,625 to S$24,880, or 82.6%. Distance travelled rose 11.4%. These eight buses do not represent the whole fleet. Available operating hours are missing, so the figures cannot establish a fleet uptime percentage.\n\nThe 19 October workshop records contain two jobs requested for 09:00, one bay and two technicians. The proposed plan books the four-hour job from 09:00 to 13:00 and the two-hour job from 13:00 to 15:00. One listed cover bus runs the first bus's morning trips and the second bus's afternoon trips. All eight scheduled Service 132 trips retain their times, qualified drivers and required capacity, including two wheelchair positions.\n\nEngineering must sign each bus's release. A repair completion estimate is not permission to run the bus. The first bus needs release by 13:08 for its 13:15 departure. One gap between trips has only 20 seconds beyond the minimum time needed, so travel time buffers need checking. The proposal has not run in service.\n\nSources are the original monthly history and 19 October workshop planning supplement. All are fictional exercise data.",
  "The proposed assistant combines journey records with passenger demand, driver availability and repair updates. A prediction model estimates travel time, boarding time and demand. A scheduling program finds bus and driver assignments that follow the operating rules. A language model reads updates and explains the proposed changes.\n\nThe checks cover bus location and Engineering clearance, driver training, availability, rest and takeover time, passenger and wheelchair capacity, time between trips, workshop bays and technicians, and every scheduled trip affected by the change. Software checks these rules. The planner approves changes, and Engineering decides whether each bus can return to service.\n\nThe goal is less passenger waiting and less planning work. More historical data is needed to test the predictions. Ten dates cannot establish forecast accuracy. The pilot should compare the assistant with both current planning and simple scheduling rules to find out whether AI adds value.",
  "This test reruns the decisions on 7 and 14 October using the supplied records. On both dates, the original 06:00 bus was already cleared for service. A qualified relief driver was available from 05:45 until 10:00. The alternative assigns that driver at 05:50, allows five minutes for briefing and two minutes for boarding, then keeps the driver on the bus through the 09:00 departure. The last trip finishes around 09:33. The 06:20 bus keeps its original driver and scheduled trips.\n\nThe test checks driver availability, training, rest, takeover, maximum continuous duty and time between trips. It keeps the observed journey durations and other departure delays, while removing delays linked to the earlier cover decision on the 06:20 bus. All 44 trips keep their published departure times. Departures more than five minutes late fall from seven to zero.\n\nTotal positive bus departure delay falls from 137.95 to 20.18 minutes, a reduction of 117.77 minutes, rounded to 118 on the slide. These are bus departure minutes. They do not measure passenger time saved. The test cannot establish how a different bus would change journey times, boarding or actual execution. A live pilot must confirm the result.\n\nSources are the original operations desk records and the schedule test. All data is fictional exercise data.",
  "The value calculation assumes two planners each spend three hours a day on planning and corrections. The target is one hour a day, including review and rework. Over 250 working days, the saving is two planners times two hours times 250 days, or 1,000 hours. At a loaded staff cost of S$45 an hour, this time is worth S$45,000 a year.\n\nAssumed setup costs are S$50,000, with S$12,000 a year to run the system. Annual time value after running costs is S$33,000. The first year has net value of minus S$17,000 after setup. Payback takes about 18.2 months if the business uses all the saved time. These are assumptions, not supplier quotes or measured savings.\n\nSaving staff time reduces cash costs only if it avoids overtime, hiring or another expense. Passenger waiting time and possible repair benefits are excluded. A 30-minute planning target would value saved time at S$56,250 a year, but the slide uses the one-hour case. Measure actual planning effort before relying on the calculation.",
  "The proposed pilot starts with two weeks of schedule checks, then four weeks of changes approved by planners on Services 235 and 238. Compare the assistant with current planning and simple rules, using similar weekdays and a reference group where practical.\n\nMeasure planning time including review and corrections, passenger waiting at the origin and later stops, departure and arrival delays, workshop time, and any change in cash spending. Passenger complaints add context. The minimum targets are 50% less planning time, 20% less waiting on selected trips, all scheduled trips retained, and no operating rule violations. These are targets to test.\n\nThe earlier value case assumes a larger planning reduction, from three hours to one hour. At the pilot's minimum 50% reduction, annual staff time is worth S$33,750, or S$21,750 after running costs. Recalculate value using the result achieved.\n\nCheck forecast errors, changing demand and repair delays before expanding to Services 132 and 159 and workshop scheduling. The pilot must establish actual passenger benefits and whether saved work time can reduce expenses.",
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
    aria-label="Problem: a local fix can delay the next bus"
    className="lionlink-ai-slide flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LionLink"}</span>
      <span>{"Passenger delays"}</span>
    </header>
    <h1 className="mt-10 max-w-[1700px] text-[72px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"The 06:20 bus left about 20 minutes late"}
    </h1>
    <p className="mt-5 max-w-[1650px] text-[31px] leading-snug text-muted-foreground">
      {"The driver for the 06:00 trip was late."}
    </p>
    <figure
      aria-label="Service 235 cover decision and subsequent departure delays"
      className="relative my-7 min-h-0 w-full flex-1"
    >
      <p className="absolute top-[35px] left-0 text-[28px] text-muted-foreground">
        {"Service 235 at Toa Payoh, 7 and 14 October"}
      </p>
      <div className="absolute top-[110px] left-0 w-[440px]">
        <p className="text-[104px] leading-none font-semibold tracking-[-0.05em]">
          {"06:00"}
        </p>
        <p className="mt-6 text-[32px] leading-snug">
          {"Control used the bus and driver assigned to 06:20."}
        </p>
      </div>
      <ArrowRight
        aria-hidden="true"
        className="absolute top-[148px] left-[495px] size-[78px] text-muted-foreground"
      />
      <div className="absolute top-[110px] left-[640px] w-[485px]">
        <p className="text-[104px] leading-none font-semibold tracking-[-0.05em] text-destructive">
          {"06:20"}
        </p>
        <p className="mt-6 text-[32px] leading-snug">
          {"That bus was still finishing the earlier trip."}
        </p>
      </div>
      <div className="absolute top-[94px] right-0 w-[470px] border-l border-border pl-12">
        <p className="text-[25px] text-muted-foreground">{"Minutes late"}</p>
        <p className="mt-5 text-[72px] leading-none font-semibold text-destructive">
          {"20m 32s"}
        </p>
        <p className="mt-3 text-[27px] text-muted-foreground">{"7 October"}</p>
        <p className="mt-7 text-[72px] leading-none font-semibold text-destructive">
          {"19m 53s"}
        </p>
        <p className="mt-3 text-[27px] text-muted-foreground">{"14 October"}</p>
      </div>
      <p className="absolute bottom-[20px] left-0 max-w-[1120px] border-t border-border pt-7 text-[31px] leading-snug">
        {"Two passengers reported waiting for the 06:20 bus. One gave up."}
      </p>
    </figure>
    <footer className="flex items-end justify-between gap-12 border-t border-border pt-5 text-[20px] leading-snug text-muted-foreground">
      <p>
        {
          "Operations desk and passenger reports, 7 and 14 Oct 2026. Fictional exercise data."
        }
      </p>
      <span className="shrink-0">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page2: Page = () => (
  <section
    aria-label="Evidence: late terminal arrivals concentrate on two services"
    className="lionlink-ai-slide flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LionLink"}</span>
      <span>{"Late arrivals"}</span>
    </header>
    <h1 className="mt-10 max-w-[1700px] text-[72px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Services 132 and 159 had 90% of late arrivals"}
    </h1>
    <p className="mt-5 text-[31px] leading-snug text-muted-foreground">
      {"100 of 6,900 trips arrived more than 5 minutes late."}
    </p>
    <figure
      aria-label="Late arrival counts by service and departures within five minutes"
      className="relative my-7 min-h-0 w-full flex-1"
    >
      <p className="absolute top-[22px] left-0 text-[27px] text-muted-foreground">
        {"Trips arriving more than 5 minutes late"}
      </p>
      <p className="absolute top-[112px] left-0 w-[150px] text-[35px]">
        {"132"}
      </p>
      <div className="absolute top-[109px] left-[160px] h-[44px] w-[756px] bg-destructive" />
      <p className="absolute top-[106px] left-[940px] text-[40px] font-semibold">
        {"42"}
      </p>
      <p className="absolute top-[206px] left-0 w-[150px] text-[35px]">
        {"159"}
      </p>
      <div className="absolute top-[203px] left-[160px] h-[44px] w-[864px] bg-destructive" />
      <p className="absolute top-[200px] left-[1048px] text-[40px] font-semibold">
        {"48"}
      </p>
      <p className="absolute top-[300px] left-0 w-[150px] text-[35px]">
        {"235"}
      </p>
      <div className="absolute top-[297px] left-[160px] h-[44px] w-[144px] bg-chart-2" />
      <p className="absolute top-[294px] left-[328px] text-[40px] font-semibold">
        {"8"}
      </p>
      <p className="absolute top-[394px] left-0 w-[150px] text-[32px]">
        {"Other"}
      </p>
      <div className="absolute top-[391px] left-[160px] h-[44px] w-[36px] bg-chart-2" />
      <p className="absolute top-[388px] left-[220px] text-[40px] font-semibold">
        {"2"}
      </p>
      <div className="absolute top-[74px] right-0 w-[520px] border-l border-border pl-12">
        <p className="text-[116px] leading-none font-semibold tracking-[-0.045em]">
          {"52 / 100"}
        </p>
        <p className="mt-7 text-[34px] leading-snug">
          {"of these late trips left no more than 5 minutes late"}
        </p>
        <p className="mt-9 text-[29px] leading-snug text-muted-foreground">
          {"Checking departure times alone misses these late arrivals."}
        </p>
      </div>
      <p className="absolute bottom-[14px] left-0 text-[25px] text-muted-foreground">
        {
          "Late arrival rates were 15.0% for 132 and 17.1% for 159. Each had 280 trips."
        }
      </p>
    </figure>
    <footer className="flex items-end justify-between gap-12 border-t border-border pt-5 text-[20px] leading-snug text-muted-foreground">
      <p>
        {
          "Trip records, 5 to 16 Oct 2026. Morning departures with complete journeys. Fictional exercise data."
        }
      </p>
      <span className="shrink-0">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page3: Page = () => (
  <section
    aria-label="Evidence: demand changes by day while some duties have spare capacity"
    className="lionlink-ai-slide flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LionLink"}</span>
      <span>{"Passenger demand"}</span>
    </header>
    <h1 className="mt-10 max-w-[1700px] text-[72px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"The 07:15 bus left passengers waiting on 8 of 10 days"}
    </h1>
    <p className="mt-5 text-[31px] leading-snug text-muted-foreground">
      {
        "Service 238 at Toa Payoh was full on eight days. Both Fridays had spare places."
      }
    </p>
    <figure
      aria-label="Ten-date origin boardings and remaining queues, compared with Service 261 occupancy"
      className="relative my-7 min-h-0 w-full flex-1"
    >
      <div className="absolute top-[30px] left-0 h-[18px] w-[28px] bg-primary" />
      <p className="absolute top-[19px] left-[42px] text-[27px]">{"Boarded"}</p>
      <div className="absolute top-[30px] left-[222px] h-[18px] w-[28px] bg-destructive" />
      <p className="absolute top-[19px] left-[264px] text-[27px]">
        {"Still waiting"}
      </p>
      <div className="absolute top-[122px] left-0 h-[78px] w-[84px] bg-destructive" />
      <p className="absolute top-[85px] left-0 w-[84px] text-center text-[26px]">
        {"39"}
      </p>
      <div className="absolute top-[200px] left-0 h-[170px] w-[84px] bg-primary" />
      <p className="absolute top-[278px] left-0 w-[84px] text-center text-[26px] text-primary-foreground">
        {"85"}
      </p>
      <p className="absolute top-[391px] left-0 w-[84px] text-center text-[24px]">
        {"5 Oct"}
      </p>
      <div className="absolute top-[140px] left-[110px] h-[60px] w-[84px] bg-destructive" />
      <p className="absolute top-[103px] left-[110px] w-[84px] text-center text-[26px]">
        {"30"}
      </p>
      <div className="absolute top-[200px] left-[110px] h-[170px] w-[84px] bg-primary" />
      <p className="absolute top-[278px] left-[110px] w-[84px] text-center text-[26px] text-primary-foreground">
        {"85"}
      </p>
      <p className="absolute top-[391px] left-[110px] w-[84px] text-center text-[24px]">
        {"6"}
      </p>
      <div className="absolute top-[144px] left-[220px] h-[56px] w-[84px] bg-destructive" />
      <p className="absolute top-[107px] left-[220px] w-[84px] text-center text-[26px]">
        {"28"}
      </p>
      <div className="absolute top-[200px] left-[220px] h-[170px] w-[84px] bg-primary" />
      <p className="absolute top-[278px] left-[220px] w-[84px] text-center text-[26px] text-primary-foreground">
        {"85"}
      </p>
      <p className="absolute top-[391px] left-[220px] w-[84px] text-center text-[24px]">
        {"7"}
      </p>
      <div className="absolute top-[152px] left-[330px] h-[48px] w-[84px] bg-destructive" />
      <p className="absolute top-[115px] left-[330px] w-[84px] text-center text-[26px]">
        {"24"}
      </p>
      <div className="absolute top-[200px] left-[330px] h-[170px] w-[84px] bg-primary" />
      <p className="absolute top-[278px] left-[330px] w-[84px] text-center text-[26px] text-primary-foreground">
        {"85"}
      </p>
      <p className="absolute top-[391px] left-[330px] w-[84px] text-center text-[24px]">
        {"8"}
      </p>
      <div className="absolute top-[334px] left-[440px] h-[36px] w-[84px] bg-primary" />
      <p className="absolute top-[292px] left-[440px] w-[84px] text-center text-[26px]">
        {"18"}
      </p>
      <p className="absolute top-[391px] left-[440px] w-[84px] text-center text-[24px]">
        {"9 Fri"}
      </p>
      <div className="absolute top-[142px] left-[550px] h-[58px] w-[84px] bg-destructive" />
      <p className="absolute top-[105px] left-[550px] w-[84px] text-center text-[26px]">
        {"29"}
      </p>
      <div className="absolute top-[200px] left-[550px] h-[170px] w-[84px] bg-primary" />
      <p className="absolute top-[278px] left-[550px] w-[84px] text-center text-[26px] text-primary-foreground">
        {"85"}
      </p>
      <p className="absolute top-[391px] left-[550px] w-[84px] text-center text-[24px]">
        {"12"}
      </p>
      <div className="absolute top-[134px] left-[660px] h-[66px] w-[84px] bg-destructive" />
      <p className="absolute top-[97px] left-[660px] w-[84px] text-center text-[26px]">
        {"33"}
      </p>
      <div className="absolute top-[200px] left-[660px] h-[170px] w-[84px] bg-primary" />
      <p className="absolute top-[278px] left-[660px] w-[84px] text-center text-[26px] text-primary-foreground">
        {"85"}
      </p>
      <p className="absolute top-[391px] left-[660px] w-[84px] text-center text-[24px]">
        {"13"}
      </p>
      <div className="absolute top-[138px] left-[770px] h-[62px] w-[84px] bg-destructive" />
      <p className="absolute top-[101px] left-[770px] w-[84px] text-center text-[26px]">
        {"31"}
      </p>
      <div className="absolute top-[200px] left-[770px] h-[170px] w-[84px] bg-primary" />
      <p className="absolute top-[278px] left-[770px] w-[84px] text-center text-[26px] text-primary-foreground">
        {"85"}
      </p>
      <p className="absolute top-[391px] left-[770px] w-[84px] text-center text-[24px]">
        {"14"}
      </p>
      <div className="absolute top-[142px] left-[880px] h-[58px] w-[84px] bg-destructive" />
      <p className="absolute top-[105px] left-[880px] w-[84px] text-center text-[26px]">
        {"29"}
      </p>
      <div className="absolute top-[200px] left-[880px] h-[170px] w-[84px] bg-primary" />
      <p className="absolute top-[278px] left-[880px] w-[84px] text-center text-[26px] text-primary-foreground">
        {"85"}
      </p>
      <p className="absolute top-[391px] left-[880px] w-[84px] text-center text-[24px]">
        {"15"}
      </p>
      <div className="absolute top-[318px] left-[990px] h-[52px] w-[84px] bg-primary" />
      <p className="absolute top-[276px] left-[990px] w-[84px] text-center text-[26px]">
        {"26"}
      </p>
      <p className="absolute top-[391px] left-[990px] w-[84px] text-center text-[24px]">
        {"16 Fri"}
      </p>
      <div className="absolute top-[78px] right-0 w-[520px] border-l border-border pl-12">
        <p className="text-[27px] text-muted-foreground">{"Service 261"}</p>
        <p className="mt-5 text-[110px] leading-none font-semibold tracking-[-0.045em]">
          {"23%"}
        </p>
        <p className="mt-4 text-[29px] leading-snug">
          {"average use of bus capacity"}
        </p>
        <p className="mt-8 text-[29px] leading-snug text-muted-foreground">
          {"131 of 280 trips stayed at 30% capacity or less, with no queues."}
        </p>
      </div>
      <p className="absolute bottom-[14px] left-0 max-w-[1640px] text-[28px] leading-snug">
        {
          "Moving a bus to another trip needs checks on demand, drivers and timing."
        }
      </p>
    </figure>
    <footer className="flex items-end justify-between gap-12 border-t border-border pt-5 text-[20px] leading-snug text-muted-foreground">
      <p>
        {
          "Stop records, 5 to 16 Oct 2026. Occupancy weights usage by distance. Fictional exercise data."
        }
      </p>
      <span className="shrink-0">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page4: Page = () => (
  <section
    aria-label="Maintenance: plan workshop resources and service duties together"
    className="lionlink-ai-slide flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LionLink"}</span>
      <span>{"Repairs and scheduling"}</span>
    </header>
    <h1 className="mt-10 max-w-[1700px] text-[72px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Repairs reduce bus availability"}
    </h1>
    <figure
      aria-label="Corrective repair hold increase and a conditional staggered workshop plan"
      className="relative my-7 min-h-0 w-full flex-1"
    >
      <p className="absolute top-0 left-0 text-[27px] text-muted-foreground">
        {"Hours out of service for repairs, same eight buses"}
      </p>
      <div className="absolute top-[210px] left-[45px] h-[151px] w-[180px] bg-chart-2" />
      <p className="absolute top-[160px] left-[45px] w-[180px] text-center text-[36px] font-semibold">
        {"151 hours"}
      </p>
      <p className="absolute top-[380px] left-[30px] w-[210px] text-center text-[25px]">
        {"Oct 2024 to Sep 2025"}
      </p>
      <div className="absolute top-[96px] left-[325px] h-[265px] w-[180px] bg-destructive" />
      <p className="absolute top-[46px] left-[325px] w-[180px] text-center text-[36px] font-semibold">
        {"265 hours"}
      </p>
      <p className="absolute top-[380px] left-[310px] w-[210px] text-center text-[25px]">
        {"Oct 2025 to Sep 2026"}
      </p>
      <p className="absolute top-[490px] left-0 w-[600px] text-[29px] leading-snug">
        {"Repair costs rose 83%. Distance travelled rose 11%."}
      </p>
      <div className="absolute top-[18px] left-[735px] w-[1000px] border-l border-border pl-12">
        <p className="text-[27px] text-muted-foreground">
          {"Suggested plan for 19 October"}
        </p>
        <p className="mt-4 text-[44px] leading-tight font-semibold">
          {"Two jobs need one bay at 09:00"}
        </p>
        <p className="mt-7 text-[29px]">
          {"The plan books the jobs at different times and uses one cover bus."}
        </p>
      </div>
      <p className="absolute top-[211px] left-[790px] text-[26px] text-muted-foreground">
        {"09:00"}
      </p>
      <p className="absolute top-[211px] left-[1225px] text-[26px] text-muted-foreground">
        {"13:00"}
      </p>
      <p className="absolute top-[211px] left-[1455px] text-[26px] text-muted-foreground">
        {"15:00"}
      </p>
      <div className="absolute top-[259px] left-[790px] h-[72px] w-[440px] bg-primary" />
      <p className="absolute top-[275px] left-[820px] text-[28px] text-primary-foreground">
        {"4 hours, 2 technicians"}
      </p>
      <div className="absolute top-[259px] left-[1244px] h-[72px] w-[220px] bg-chart-2" />
      <p className="absolute top-[349px] left-[1244px] w-[310px] text-[27px] leading-snug">
        {"2 hours, 1 technician"}
      </p>
      <Check
        aria-hidden="true"
        className="absolute top-[490px] left-[790px] size-[45px]"
      />
      <p className="absolute top-[490px] left-[852px] w-[780px] text-[36px] font-semibold">
        {"All 8 trips keep their scheduled times"}
      </p>
      <p className="absolute bottom-[8px] left-0 max-w-[1700px] text-[26px] leading-snug text-muted-foreground">
        {
          "Engineering must clear the buses before service. Time between trips still needs checking."
        }
      </p>
    </figure>
    <footer className="flex items-end justify-between gap-12 border-t border-border pt-5 text-[20px] leading-snug text-muted-foreground">
      <p>
        {
          "Eight-bus repair history and the 19 Oct workshop plan. Fictional exercise data."
        }
      </p>
      <span className="shrink-0">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page5: Page = () => (
  <section
    aria-label="Proposed AI copilot: forecast, solve, explain and obtain planner approval"
    className="lionlink-ai-slide flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LionLink"}</span>
      <span>{"Proposed AI assistant"}</span>
    </header>
    <h1 className="mt-10 max-w-[1700px] text-[72px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"An AI assistant checks the full bus schedule"}
    </h1>
    <p className="mt-5 text-[31px] leading-snug text-muted-foreground">
      {
        "It suggests changes when a driver is late, a bus needs repairs or demand changes."
      }
    </p>
    <figure
      aria-label="Four-step planning workflow and hard constraints"
      className="relative my-7 min-h-0 w-full flex-1"
    >
      <p className="absolute top-[58px] left-0 text-[23px] text-muted-foreground">
        {"Journey data"}
      </p>
      <p className="absolute top-[110px] left-0 text-[54px] font-semibold">
        {"Predict"}
      </p>
      <p className="absolute top-[195px] left-0 w-[345px] text-[30px] leading-snug">
        {"Estimate travel time and passenger demand."}
      </p>
      <ArrowRight
        aria-hidden="true"
        className="absolute top-[127px] left-[362px] size-[58px] text-muted-foreground"
      />
      <p className="absolute top-[58px] left-[445px] text-[23px] text-muted-foreground">
        {"Scheduling rules"}
      </p>
      <p className="absolute top-[110px] left-[445px] text-[54px] font-semibold">
        {"Plan"}
      </p>
      <p className="absolute top-[195px] left-[445px] w-[345px] text-[30px] leading-snug">
        {"Find buses and drivers that can run each trip."}
      </p>
      <ArrowRight
        aria-hidden="true"
        className="absolute top-[127px] left-[807px] size-[58px] text-muted-foreground"
      />
      <p className="absolute top-[58px] left-[890px] text-[23px] text-muted-foreground">
        {"AI summaries"}
      </p>
      <p className="absolute top-[110px] left-[890px] text-[54px] font-semibold">
        {"Explain"}
      </p>
      <p className="absolute top-[195px] left-[890px] w-[345px] text-[30px] leading-snug">
        {"Explain each change and its reasons."}
      </p>
      <ArrowRight
        aria-hidden="true"
        className="absolute top-[127px] left-[1252px] size-[58px] text-muted-foreground"
      />
      <p className="absolute top-[58px] left-[1335px] text-[23px] text-muted-foreground">
        {"Planner review"}
      </p>
      <p className="absolute top-[110px] left-[1335px] text-[54px] font-semibold">
        {"Approve"}
      </p>
      <p className="absolute top-[195px] left-[1335px] w-[360px] text-[30px] leading-snug">
        {"The planner approves the schedule."}
      </p>
      <div className="absolute top-[365px] left-0 h-px w-full bg-border" />
      <ShieldCheck
        aria-hidden="true"
        className="absolute top-[407px] left-0 size-[56px]"
      />
      <p className="absolute top-[402px] left-[80px] text-[31px] font-semibold">
        {"Every plan must meet operating rules"}
      </p>
      <p className="absolute top-[460px] left-[80px] max-w-[1590px] text-[29px] leading-snug text-muted-foreground">
        {
          "Bus clearance, driver training and rest, passenger capacity, time between trips and workshop space."
        }
      </p>
      <p className="absolute bottom-[4px] left-0 text-[29px]">
        {"The aim is shorter waits and less planning work."}
      </p>
    </figure>
    <footer className="flex items-end justify-between gap-12 border-t border-border pt-5 text-[20px] leading-snug text-muted-foreground">
      <p>
        {
          "Proposed design. Engineering clears each bus before service. A pilot must measure the benefits."
        }
      </p>
      <span className="shrink-0">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page6: Page = () => (
  <section
    aria-label="Feasibility replay: relief driver protects all published Service 235 trips"
    className="lionlink-ai-slide flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LionLink"}</span>
      <span>{"Test using past records"}</span>
    </header>
    <h1 className="mt-10 max-w-[1700px] text-[72px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"The test removes seven late departures"}
    </h1>
    <p className="mt-5 text-[31px] leading-snug text-muted-foreground">
      {
        "A relief driver covers the 06:00 bus. All 44 trips remain on the schedule."
      }
    </p>
    <figure
      aria-label="Late departures before and after a bounded two-date replay"
      className="relative my-7 min-h-0 w-full flex-1"
    >
      <p className="absolute top-[30px] left-0 text-[27px] text-muted-foreground">
        {"Departures more than 5 minutes late"}
      </p>
      <p className="absolute top-[98px] left-0 text-[180px] leading-none font-semibold text-destructive">
        {"7"}
      </p>
      <ArrowRight
        aria-hidden="true"
        className="absolute top-[160px] left-[175px] size-[78px] text-muted-foreground"
      />
      <p className="absolute top-[98px] left-[305px] text-[180px] leading-none font-semibold">
        {"0"}
      </p>
      <p className="absolute top-[300px] left-0 text-[27px] text-muted-foreground">
        {"Recorded"}
      </p>
      <p className="absolute top-[300px] left-[305px] text-[27px] text-muted-foreground">
        {"Test result"}
      </p>
      <p className="absolute top-[392px] left-0 text-[72px] leading-none font-semibold">
        {"118 minutes"}
      </p>
      <p className="absolute top-[482px] left-0 w-[565px] text-[28px] leading-snug text-muted-foreground">
        {"less total bus departure delay across both days"}
      </p>
      <div className="absolute top-[32px] left-[730px] w-[1000px] border-l border-border pl-12">
        <p className="text-[32px] font-semibold">
          {"The desk listed the relief driver at 05:45"}
        </p>
        <p className="mt-8 text-[30px] leading-snug">
          {"The relief driver is available at 05:45."}
        </p>
        <p className="mt-7 text-[30px] leading-snug">
          {"The driver takes over the bus at 05:50."}
        </p>
        <p className="mt-7 text-[30px] leading-snug">
          {"The original bus leaves at 06:00."}
        </p>
        <p className="mt-7 text-[30px] leading-snug">
          {"The other bus and driver still run at 06:20."}
        </p>
        <p className="mt-10 border-t border-border pt-7 text-[29px] leading-snug text-muted-foreground">
          {
            "The test checks driver training, availability, rest and time between trips."
          }
        </p>
      </div>
    </figure>
    <footer className="flex items-end justify-between gap-12 border-t border-border pt-5 text-[20px] leading-snug text-muted-foreground">
      <p>
        {
          "Schedule test for 7 and 14 Oct using desk records and recorded journey times. Fictional exercise data."
        }
      </p>
      <span className="shrink-0">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page7: Page = () => (
  <section
    aria-label="Assumed value: annual planning hours released and capacity value"
    className="lionlink-ai-slide flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LionLink"}</span>
      <span>{"Value assumptions"}</span>
    </header>
    <h1 className="mt-10 max-w-[1700px] text-[72px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Assumed saving of 1,000 planner hours a year"}
    </h1>
    <p className="mt-5 text-[31px] leading-snug text-muted-foreground">
      {"Assume two planners save 2 hours a day, for 250 working days."}
    </p>
    <figure
      aria-label="Assumed planning time improvement, staff capacity value and cost illustration"
      className="relative my-7 min-h-0 w-full flex-1"
    >
      <p className="absolute top-[34px] left-0 text-[27px] text-muted-foreground">
        {"Planning time per person each day"}
      </p>
      <p className="absolute top-[109px] left-0 text-[36px]">{"Manual"}</p>
      <div className="absolute top-[111px] left-[160px] h-[52px] w-[675px] bg-chart-2" />
      <p className="absolute top-[107px] left-[864px] text-[40px] font-semibold">
        {"3 hours"}
      </p>
      <p className="absolute top-[221px] left-0 text-[36px]">{"Target"}</p>
      <div className="absolute top-[223px] left-[160px] h-[52px] w-[225px] bg-primary" />
      <p className="absolute top-[219px] left-[414px] text-[40px] font-semibold">
        {"1 hour"}
      </p>
      <div className="absolute top-[32px] right-0 w-[660px] border-l border-border pl-12">
        <p className="text-[115px] leading-none font-semibold tracking-[-0.045em]">
          {"S$45,000"}
        </p>
        <p className="mt-5 text-[32px] leading-snug">
          {"value of staff time per year"}
        </p>
        <p className="mt-4 text-[27px] text-muted-foreground">
          {"1,000 hours valued at S$45 per hour"}
        </p>
      </div>
      <div className="absolute top-[347px] left-0 h-px w-full bg-border" />
      <p className="absolute top-[382px] left-0 text-[28px] text-muted-foreground">
        {"Assumed costs"}
      </p>
      <p className="absolute top-[433px] left-0 text-[39px] font-semibold">
        {"S$50,000 to set up"}
      </p>
      <p className="absolute top-[490px] left-0 text-[26px] text-muted-foreground">
        {"S$12,000 a year to run"}
      </p>
      <p className="absolute top-[382px] left-[770px] text-[28px] text-muted-foreground">
        {"After annual running costs"}
      </p>
      <p className="absolute top-[433px] left-[770px] text-[39px] font-semibold">
        {"S$33,000 a year"}
      </p>
      <p className="absolute top-[490px] left-[770px] text-[26px] text-muted-foreground">
        {"First year net value is -S$17,000"}
      </p>
      <p className="absolute top-[382px] left-[1345px] text-[28px] text-muted-foreground">
        {"Payback estimate"}
      </p>
      <p className="absolute top-[433px] left-[1345px] text-[39px] font-semibold">
        {"About 18 months"}
      </p>
      <p className="absolute bottom-[2px] left-0 max-w-[1700px] text-[27px] leading-snug">
        {"Money savings depend on reducing overtime or avoiding a hire."}
      </p>
    </figure>
    <footer className="flex items-end justify-between gap-12 border-t border-border pt-5 text-[20px] leading-snug text-muted-foreground">
      <p>
        {
          "All figures are assumptions. Payback requires use of the saved time. Passenger and repair benefits are excluded."
        }
      </p>
      <span className="shrink-0">
        <PageNumber />
      </span>
    </footer>
  </section>
)

const Page8: Page = () => (
  <section
    aria-label="Proposed pilot: measure planner time, passenger waiting and constraint compliance"
    className="lionlink-ai-slide flex h-full w-full flex-col overflow-hidden bg-background px-[88px] py-[58px] text-foreground"
  >
    <header className="flex items-center justify-between border-b border-border pb-6 text-[21px] tracking-wide text-muted-foreground">
      <span>{"LionLink"}</span>
      <span>{"Proposed pilot and minimum targets"}</span>
    </header>
    <h1 className="mt-10 max-w-[1700px] text-[72px] leading-[1.08] font-semibold tracking-[-0.035em]">
      {"Pilot on Services 235 and 238"}
    </h1>
    <figure
      aria-label="Shadow and supervised pilot timeline with proposed success targets"
      className="relative my-7 min-h-0 w-full flex-1"
    >
      <p className="absolute top-[38px] left-0 text-[28px] text-muted-foreground">
        {"2 weeks of schedule checks"}
      </p>
      <div className="absolute top-[97px] left-0 h-[12px] w-[560px] bg-chart-2" />
      <p className="absolute top-[132px] left-0 w-[560px] text-[29px] leading-snug">
        {"Compare AI plans with current plans and simple scheduling rules."}
      </p>
      <ArrowRight
        aria-hidden="true"
        className="absolute top-[74px] left-[606px] size-[58px] text-muted-foreground"
      />
      <p className="absolute top-[38px] left-[725px] text-[28px] text-muted-foreground">
        {"4 weeks of approved changes"}
      </p>
      <div className="absolute top-[97px] left-[725px] h-[12px] w-[1010px] bg-primary" />
      <p className="absolute top-[132px] left-[725px] w-[930px] text-[29px] leading-snug">
        {
          "Planners approve changes. Measure passenger waits and departure and arrival delays."
        }
      </p>
      <div className="absolute top-[275px] left-0 h-px w-full bg-border" />
      <p className="absolute top-[323px] left-0 text-[90px] leading-none font-semibold">
        {"50%"}
      </p>
      <p className="absolute top-[434px] left-0 w-[450px] text-[30px] leading-snug">
        {"less planning time"}
      </p>
      <p className="absolute top-[489px] left-0 w-[450px] text-[25px] leading-snug text-muted-foreground">
        {"Value depends on the time actually saved."}
      </p>
      <p className="absolute top-[323px] left-[610px] text-[90px] leading-none font-semibold">
        {"20%"}
      </p>
      <p className="absolute top-[434px] left-[610px] w-[450px] text-[30px] leading-snug">
        {"less passenger waiting on the selected trips"}
      </p>
      <p className="absolute top-[323px] left-[1220px] text-[90px] leading-none font-semibold">
        {"100%"}
      </p>
      <p className="absolute top-[434px] left-[1220px] w-[470px] text-[30px] leading-snug">
        {"of scheduled trips run. The plan meets all operating rules."}
      </p>
      <p className="absolute bottom-[0px] left-0 max-w-[1700px] text-[32px] font-semibold">
        {"Expand to 132 and 159 after the pilot meets these targets."}
      </p>
    </figure>
    <footer className="flex items-end justify-between gap-12 border-t border-border pt-5 text-[20px] leading-snug text-muted-foreground">
      <p>
        {
          "The duration and targets are proposals. Measure actual results before expanding."
        }
      </p>
      <span className="shrink-0">
        <PageNumber />
      </span>
    </footer>
  </section>
)

export default [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8]
