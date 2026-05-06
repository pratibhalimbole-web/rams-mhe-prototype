import svgPaths from "./svg-nuv5vcdjzk";

function ChartArea() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="chart-area">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="chart-area">
          <path clipRule="evenodd" d={svgPaths.p24518700} fill="var(--fill-0, #71717A)" fillRule="evenodd" id="Vector (Stroke)" />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[16px]" data-name="Icon">
      <ChartArea />
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex gap-[4px] items-center px-[24px] relative shrink-0" data-name="Text">
      <Icon />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Line Chart</p>
      </div>
    </div>
  );
}

function Separator() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Separator">
      <div className="absolute bottom-full left-0 right-0 top-0" data-name="Separator">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 392 1">
            <path d="M392 0.5H0" id="Separator" stroke="var(--stroke-0, #E4E4E7)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Header1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Header">
      <Text />
      <Separator />
    </div>
  );
}

function Text1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Text">
      <div className="content-stretch flex flex-col gap-[8px] items-start leading-[0] not-italic pt-[8px] px-[24px] relative w-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[16px] justify-center relative shrink-0 text-[#09090b] text-[16px] w-full">
          <p className="leading-[24px] whitespace-pre-wrap">Line Chart - Custom Label</p>
        </div>
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center relative shrink-0 text-[#71717a] text-[14px] w-full">
          <p className="leading-[20px] whitespace-pre-wrap">January - June 2024</p>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="header">
      <Header1 />
      <Text1 />
    </div>
  );
}

function Group1() {
  return (
    <div className="col-1 h-[171px] ml-0 mt-0 relative row-1 w-[328px]" data-name="Group">
      <div className="absolute inset-[-0.29%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 328 172">
          <g id="Group">
            <path d="M0 128.75H328" id="Vector" stroke="var(--stroke-0, #E4E4E7)" />
            <path d="M0 86H328" id="Vector_2" stroke="var(--stroke-0, #E4E4E7)" />
            <path d="M0 43.25H328" id="Vector_3" stroke="var(--stroke-0, #E4E4E7)" />
            <path d="M0 0.5H328" id="Vector_4" stroke="var(--stroke-0, #E4E4E7)" />
            <path d="M0 171.5H328" id="Vector_5" stroke="var(--stroke-0, #E4E4E7)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0 w-full" data-name="Group">
      <Group1 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[-1.75%_10.33%_32.17%_11.86%]" data-name="Group">
      <div className="absolute inset-[-0.84%_-0.33%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 307 120.983">
          <g id="Group">
            <path d={svgPaths.p1e531d00} fill="var(--fill-0, #E76E50)" id="Vector" stroke="var(--stroke-0, #E76E50)" strokeWidth="2" />
            <path d={svgPaths.p21bdc300} fill="var(--fill-0, #E76E50)" id="Vector_2" stroke="var(--stroke-0, #E76E50)" strokeWidth="2" />
            <path d={svgPaths.p2c9698f0} fill="var(--fill-0, #E76E50)" id="Vector_3" stroke="var(--stroke-0, #E76E50)" strokeWidth="2" />
            <path d={svgPaths.p1d2c0100} fill="var(--fill-0, #E76E50)" id="Vector_4" stroke="var(--stroke-0, #E76E50)" strokeWidth="2" />
            <path d={svgPaths.pd5a80} fill="var(--fill-0, #E76E50)" id="Vector_5" stroke="var(--stroke-0, #E76E50)" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents font-['Inter:Regular',sans-serif] font-normal inset-[-14.04%_6.89%_38.61%_6.89%] leading-[16px] not-italic text-[#09090b] text-[12px] text-center" data-name="Group">
      <p className="absolute inset-0">Chrome</p>
      <p className="absolute inset-[45.8px_0_0_80.75px]">Safari</p>
      <p className="absolute inset-[53.74px_0_0_152.5px]">Firefox</p>
      <p className="absolute inset-[62.29px_0_0_232.25px]">Edge</p>
      <p className="absolute inset-[112.98px_0_0_305px]">Other</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[-14.04%_6.89%_32.17%_6.89%]" data-name="Group">
      <div className="absolute inset-[0_11.1%_33.93%_12.63%]" data-name="Vector">
        <div className="absolute inset-[-0.71%_-0.21%_-0.68%_-0.2%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 300.228 114.56">
            <path d={svgPaths.p2e6a31c0} id="Vector" stroke="var(--stroke-0, #E76E50)" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <Group3 />
      <Group4 />
    </div>
  );
}

function Application() {
  return (
    <div className="relative shrink-0 w-full" data-name="Application">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center px-[32px] relative w-full">
          <Group />
          <Group2 />
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full" data-name="Container">
      <Header />
      <Application />
    </div>
  );
}

function TrendingUp() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="trending-up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="trending-up">
          <path clipRule="evenodd" d={svgPaths.p1c2fdf70} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Vector (Stroke)" />
        </g>
      </svg>
    </div>
  );
}

function Icon1() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[16px]" data-name="Icon">
      <TrendingUp />
    </div>
  );
}

function Text2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Text">
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] max-w-[212px] min-h-px min-w-[100px] not-italic relative text-[#09090b] text-[14px]">
        <p className="leading-[20px] whitespace-pre-wrap">Trending up by 5.2% this month</p>
      </div>
      <Icon1 />
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start px-[24px] relative w-full">
        <Text2 />
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[14px] justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[14px] w-full">
          <p className="leading-[20px] whitespace-pre-wrap">Showing total visitors for the last 6 months</p>
        </div>
      </div>
    </div>
  );
}

export default function LineChart() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-center pb-[24px] pt-[16px] relative rounded-[16px] size-full" data-name="Line Chart">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.06)]" />
      <Container />
      <Container1 />
    </div>
  );
}