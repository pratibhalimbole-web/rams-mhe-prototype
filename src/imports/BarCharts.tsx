import svgPaths from "./svg-wa4es18mva";

function Text() {
  return (
    <div className="relative shrink-0 w-full" data-name="Text">
      <div className="content-stretch flex flex-col gap-[8px] items-start leading-[0] not-italic px-[24px] py-0 relative w-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[16px] justify-center relative shrink-0 text-[#09090b] text-[16px] w-full">
          <p className="css-4hzbpn leading-[24px]">Bar Chart - Horizontal</p>
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
    <div className="absolute inset-[0_114.17px_86.21%_0]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 178.444 26">
        <g id="Group">
          <path d={svgPaths.p411ae80} fill="var(--fill-0, #2A9D90)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[17.24%_0_68.97%_0]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 292.609 26">
        <g id="Group">
          <path d={svgPaths.p1a3cbf40} fill="var(--fill-0, #2A9D90)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[34.48%_65.24px_51.72%_0]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 227.372 26">
        <g id="Group">
          <path d={svgPaths.p379a9780} fill="var(--fill-0, #2A9D90)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[51.72%_222.57px_34.48%_0]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 70.0344 26">
        <g id="Group">
          <path d={svgPaths.p12205b00} fill="var(--fill-0, #2A9D90)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute inset-[68.97%_92.1px_17.24%_0]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 200.509 26">
        <g id="Group">
          <path d={svgPaths.p2a43c680} fill="var(--fill-0, #2A9D90)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute inset-[86.21%_87.3px_0_0]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 205.306 26">
        <g id="Group">
          <path d={svgPaths.p10bd8700} fill="var(--fill-0, #2A9D90)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents inset-0" data-name="Group">
      <Group />
      <Group1 />
      <Group2 />
      <Group3 />
      <Group4 />
      <Group5 />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents inset-[2.08%_7.39px_-0.26%_44px]" data-name="Group">
      <Group6 />
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents inset-[2.08%_7.39px_-0.26%_44px]" data-name="Group">
      <Group7 />
    </div>
  );
}

function Months() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal items-start justify-between leading-[16px] min-h-px min-w-px not-italic px-0 py-[8px] relative text-[#71717a] text-[12px] text-center" data-name="Months">
      <p className="css-4hzbpn relative shrink-0 w-full">Jan</p>
      <p className="css-4hzbpn relative shrink-0 w-full">Feb</p>
      <p className="css-4hzbpn relative shrink-0 w-full">Mar</p>
      <p className="css-4hzbpn relative shrink-0 w-full">Apr</p>
      <p className="css-4hzbpn relative shrink-0 w-full">May</p>
      <p className="css-4hzbpn relative shrink-0 w-full">Jun</p>
    </div>
  );
}

function Application() {
  return (
    <div className="h-[192px] relative shrink-0 w-full" data-name="Application">
      <div className="content-stretch flex flex-col items-start px-[8px] py-0 relative size-full">
        <Group8 />
        <Months />
      </div>
    </div>
  );
}

function Chart() {
  return (
    <div className="relative shrink-0 w-full" data-name="Chart">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center px-[24px] py-0 relative w-full">
          <Application />
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
          <path clipRule="evenodd" d={svgPaths.p34edf440} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Vector (Stroke)" />
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