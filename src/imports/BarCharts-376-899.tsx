import svgPaths from "./svg-oqlocqxrdf";

function Text() {
  return (
    <div className="relative shrink-0 w-full" data-name="Text">
      <div className="content-stretch flex flex-col gap-[8px] items-start leading-[0] not-italic px-[24px] py-0 relative w-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[16px] justify-center relative shrink-0 text-[#09090b] text-[16px] w-full">
          <p className="css-4hzbpn leading-[24px]">{`Bar Chart `}</p>
        </div>
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center relative shrink-0 text-[#71717a] text-[14px] w-full">
          <p className="css-4hzbpn leading-[20px]">January - June 2024</p>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="header">
      <Text />
    </div>
  );
}

function Group() {
  return (
    <div className="col-1 h-[165px] ml-0 mt-0 relative row-1 w-[328px]" data-name="Group">
      <div className="absolute inset-[-0.3%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 328 166">
          <g id="Group">
            <path d="M0 165.5H328" id="Vector" stroke="var(--stroke-0, #E4E4E7)" />
            <path d="M0 124.25H328" id="Vector_2" stroke="var(--stroke-0, #E4E4E7)" />
            <path d="M0 83H328" id="Vector_3" stroke="var(--stroke-0, #E4E4E7)" />
            <path d="M0 41.75H328" id="Vector_4" stroke="var(--stroke-0, #E4E4E7)" />
            <path d="M0 0.5H328" id="Vector_5" stroke="var(--stroke-0, #E4E4E7)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0 w-full" data-name="Group">
      <Group />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[39.02%_86.45%_0_0]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 90.0938">
        <g id="Group">
          <path d={svgPaths.p2712e4c0} fill="var(--fill-0, #2A9D90)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[0_69.16%_0_17.29%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 147.734">
        <g id="Group">
          <path d={svgPaths.p3cd3100} fill="var(--fill-0, #2A9D90)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute inset-[22.3%_51.87%_0_34.58%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 114.797">
        <g id="Group">
          <path d={svgPaths.p15b47800} fill="var(--fill-0, #2A9D90)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute inset-[76.07%_34.58%_0_51.87%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 35.3594">
        <g id="Group">
          <path d={svgPaths.p24654680} fill="var(--fill-0, #2A9D90)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute inset-[31.48%_17.29%_0_69.16%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 101.234">
        <g id="Group">
          <path d={svgPaths.p255ae080} fill="var(--fill-0, #2A9D90)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute inset-[29.84%_0_0_86.45%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 103.656">
        <g id="Group">
          <path d={svgPaths.p3c981c00} fill="var(--fill-0, #2A9D90)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents inset-0" data-name="Group">
      <Group2 />
      <Group3 />
      <Group4 />
      <Group5 />
      <Group6 />
      <Group7 />
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents inset-[10.3%_3.25%_0.16%_2.33%]" data-name="Group">
      <Group8 />
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents inset-[10.3%_3.25%_0.16%_2.33%]" data-name="Group">
      <Group9 />
    </div>
  );
}

function Application() {
  return (
    <div className="relative shrink-0 w-full" data-name="Application">
      <div className="content-stretch flex flex-col items-start px-[8px] py-0 relative w-full">
        <Group1 />
        <Group10 />
      </div>
    </div>
  );
}

function Months() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[40px] h-[16px] items-center leading-[16px] not-italic relative shrink-0 text-[#71717a] text-[12px] text-center w-full" data-name="Months">
      <p className="css-4hzbpn flex-[1_0_0] min-h-px min-w-px relative">Jan</p>
      <p className="css-4hzbpn flex-[1_0_0] min-h-px min-w-px relative">Feb</p>
      <p className="css-4hzbpn flex-[1_0_0] min-h-px min-w-px relative">Mar</p>
      <p className="css-4hzbpn flex-[1_0_0] min-h-px min-w-px relative">Apr</p>
      <p className="css-4hzbpn flex-[1_0_0] min-h-px min-w-px relative">May</p>
      <p className="css-4hzbpn flex-[1_0_0] min-h-px min-w-px relative">Jun</p>
    </div>
  );
}

function Chart() {
  return (
    <div className="relative shrink-0 w-full" data-name="Chart">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-center justify-center px-[24px] py-0 relative w-full">
          <Application />
          <Months />
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <Header />
      <Chart />
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

function Icon() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[16px]" data-name="Icon">
      <TrendingUp />
    </div>
  );
}

function Text1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Text">
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] max-w-[212px] min-h-px min-w-[100px] not-italic relative text-[#09090b] text-[14px]">
        <p className="css-4hzbpn leading-[20px]">Trending up by 5.2% this month</p>
      </div>
      <Icon />
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[16px] items-start px-[24px] py-0 relative w-full">
        <Text1 />
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[14px] justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[14px] w-full">
          <p className="css-4hzbpn leading-[20px]">Showing total visitors for the last 6 months</p>
        </div>
      </div>
    </div>
  );
}

export default function BarCharts() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-center px-0 py-[24px] relative rounded-[16px] size-full" data-name="Bar Charts">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.06)]" />
      <Container />
      <Container1 />
    </div>
  );
}