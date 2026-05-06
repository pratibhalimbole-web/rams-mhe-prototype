import svgPaths from "./svg-mutf7ayklx";
import { imgGroup } from "./svg-l97ii";

function Text() {
  return (
    <div className="relative shrink-0 w-full" data-name="Text">
      <div className="content-stretch flex flex-col gap-[8px] items-start leading-[0] not-italic px-[24px] py-0 relative w-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[16px] justify-center relative shrink-0 text-[#09090b] text-[16px] w-full">
          <p className="css-4hzbpn leading-[24px]">Area Chart</p>
        </div>
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center relative shrink-0 text-[#71717a] text-[14px] w-full">
          <p className="css-4hzbpn leading-[20px]">Showing total visitors for the last 6 months</p>
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
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0%_-3.35%] mask-size-[100%_103.98%]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <div className="absolute inset-[-0.31%_-0.06%_0_-0.12%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 328.578 160.147">
          <g id="Group">
            <path d={svgPaths.p28297700} fill="var(--fill-0, #2A9D90)" id="Vector" />
            <path d={svgPaths.p1e7dd780} id="Vector_2" stroke="var(--stroke-0, #2A9D90)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents inset-[5.35px_0_1px_0]" data-name="Group">
      <Group2 />
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group3 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[0_8px_-1px_8px]" data-name="Group">
      <ClipPathGroup />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[0_8px_-1px_8px]" data-name="Group">
      <Group4 />
    </div>
  );
}

function Application() {
  return (
    <div className="relative shrink-0 w-full" data-name="Application">
      <div className="content-stretch flex flex-col items-start px-[8px] py-0 relative w-full">
        <Group1 />
        <Group5 />
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
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] max-w-[212px] min-h-px min-w-px not-italic relative text-[#09090b] text-[14px]">
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
          <p className="css-4hzbpn leading-[20px]">January - June 2024</p>
        </div>
      </div>
    </div>
  );
}

function AreaChartType() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[16px] items-center left-[420px] px-0 py-[24px] rounded-[16px] top-0 w-[392px]" data-name="Area Chart/Type11">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.06)]" />
      <Container />
      <Container1 />
    </div>
  );
}

function Text2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Text">
      <div className="content-stretch flex flex-col gap-[8px] items-start leading-[0] not-italic pb-0 pt-[8px] px-[24px] relative w-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[16px] justify-center relative shrink-0 text-[#09090b] text-[16px] w-full">
          <p className="css-4hzbpn leading-[24px]">Line Chart</p>
        </div>
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center relative shrink-0 text-[#71717a] text-[14px] w-full">
          <p className="css-4hzbpn leading-[20px]">January - June 2024</p>
        </div>
      </div>
    </div>
  );
}

function Header1() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="header">
      <Text2 />
    </div>
  );
}

function Group6() {
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

function Group7() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0 w-full" data-name="Group">
      <Group6 />
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute inset-[4.24%_3.78%_21.81%_2.33%]" data-name="Group">
      <div className="absolute inset-[-0.82%_-0.12%_-0.82%_-0.24%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 324.166 124.017">
          <g id="Group">
            <path d={svgPaths.p15a8a880} id="Vector" stroke="var(--stroke-0, #2A9D90)" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Application1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Application">
      <div className="content-stretch flex flex-col items-start px-[8px] py-0 relative w-full">
        <Group7 />
        <Group8 />
      </div>
    </div>
  );
}

function Months1() {
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

function Chart1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Chart">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-center justify-center px-[24px] py-0 relative w-full">
          <Application1 />
          <Months1 />
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <Header1 />
      <Chart1 />
    </div>
  );
}

function TrendingUp1() {
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
      <TrendingUp1 />
    </div>
  );
}

function Text3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Text">
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] max-w-[212px] min-h-px min-w-[100px] not-italic relative text-[#09090b] text-[14px]">
        <p className="css-4hzbpn leading-[20px]">Trending up by 5.2% this month</p>
      </div>
      <Icon1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start px-[24px] py-0 relative w-full">
        <Text3 />
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[14px] justify-center leading-[0] not-italic relative shrink-0 text-[#71717a] text-[14px] w-full">
          <p className="css-4hzbpn leading-[20px]">Showing total visitors for the last 6 months</p>
        </div>
      </div>
    </div>
  );
}

function LineChartType() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[16px] items-center left-0 px-0 py-[24px] rounded-[16px] top-0 w-[392px]" data-name="Line Chart/Type10">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.06)]" />
      <Container2 />
      <Container3 />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="relative size-full">
      <AreaChartType />
      <LineChartType />
    </div>
  );
}