import svgPaths from "./svg-8wzb2eeadr";

function Heading() {
  return (
    <div className="h-[22.391px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22.4px] left-0 not-italic text-[#0f172a] text-[16px] top-[-1px]">Element Test Distribution</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#0f172a] text-[14px] top-0">January – June 2024</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 w-[286.656px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative w-full">
        <Heading />
        <Container4 />
      </div>
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="bg-white h-[27px] relative rounded-[3px] shrink-0 w-[141px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[3px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[17px] py-[9px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#0f172a] text-[14px] text-center">By Test Type</p>
      </div>
    </div>
  );
}

function PrimitiveButton1() {
  return (
    <div className="bg-[rgba(255,255,255,0)] h-[27px] relative rounded-[3px] shrink-0 w-[127px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[3px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[17px] py-[9px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#0f172a] text-[14px] text-center">By Element</p>
      </div>
    </div>
  );
}

function TabList() {
  return (
    <div className="bg-[#f1f5f9] h-[38px] relative rounded-[6px] shrink-0 w-full" data-name="Tab List">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[7px] relative size-full">
          <PrimitiveButton />
          <PrimitiveButton1 />
        </div>
      </div>
    </div>
  );
}

function PrimitiveDiv() {
  return (
    <div className="h-[32px] relative shrink-0 w-[287px]" data-name="Primitive.div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <TabList />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] items-start left-[24px] top-[16px] w-[286.656px]" data-name="Container">
      <Container3 />
      <PrimitiveDiv />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[121.391px] relative shrink-0 w-[334.656px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container2 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[134.61px] not-italic text-[#0f172a] text-[14px] text-center top-0">Trending up by 5.2% this month</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[134.5px] not-italic text-[#0f172a] text-[14px] text-center top-0">Showing total tests for the last 6 months</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[46px] items-start left-[33.03px] top-[244px] w-[268.594px]" data-name="Container">
      <Container7 />
      <Container8 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute bottom-1/2 left-[48.87%] right-[15.96%] top-[15.92%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 77.3636 74.9837">
        <g id="Group">
          <path d={svgPaths.p74e5200} fill="var(--fill-0, #3B82F6)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[16.24%_51.93%_60.04%_20.44%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60.7896 52.1707">
        <g id="Group">
          <path d={svgPaths.p3307a8f0} fill="var(--fill-0, #22C55E)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[36.47%_65.29%_26.89%_15.91%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41.3638 80.5891">
        <g id="Group">
          <path d={svgPaths.p27dbf480} fill="var(--fill-0, #FBBF24)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute inset-[65.78%_29.78%_15.91%_27.75%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 93.4321 40.2917">
        <g id="Group">
          <path d={svgPaths.p31ad7200} fill="var(--fill-0, #EF4444)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute inset-[51.16%_16.1%_25.06%_64.12%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 43.5223 52.3246">
        <g id="Group">
          <path d={svgPaths.p3d316100} fill="var(--fill-0, #A855F7)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[15.92%_15.96%_15.91%_15.91%]" data-name="Group">
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
    <div className="absolute bottom-1/2 left-[57.12%] right-[6.84%] top-[7.82%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 79.2797 92.8069">
        <g id="Group">
          <path d={svgPaths.pbb0a800} fill="var(--fill-0, #3B82F6)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute inset-[6.82%_43.69%_87.01%_48.05%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.1713 13.5709">
        <g id="Group">
          <path d={svgPaths.p849f850} fill="var(--fill-0, #3B82F6)" fillOpacity="0.35" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute inset-[7.09%_53.14%_74.5%_17.5%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64.609 40.5011">
        <g id="Group">
          <path d={svgPaths.p8a06200} fill="var(--fill-0, #22C55E)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute inset-[23.98%_79.9%_67.18%_11.9%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.0379 19.4416">
        <g id="Group">
          <path d={svgPaths.p1c1fca40} fill="var(--fill-0, #22C55E)" fillOpacity="0.35" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute inset-[32.43%_79.58%_23.51%_6.82%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.9178 96.9273">
        <g id="Group">
          <path d={svgPaths.p24558800} fill="var(--fill-0, #FBBF24)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute inset-[74.9%_76.75%_19.87%_17.89%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.7965 11.5103">
        <g id="Group">
          <path d={svgPaths.p2939df00} fill="var(--fill-0, #FBBF24)" fillOpacity="0.35" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute inset-[77.95%_31.99%_6.82%_21.31%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 102.745 33.5045">
        <g id="Group">
          <path d={svgPaths.p4dd0480} fill="var(--fill-0, #EF4444)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute inset-[79.64%_23.59%_12.13%_67.58%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.4377 18.1068">
        <g id="Group">
          <path d={svgPaths.p24020080} fill="var(--fill-0, #EF4444)" fillOpacity="0.35" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute inset-[55.71%_7.51%_17.82%_74.83%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 38.8561 58.2195">
        <g id="Group">
          <path d={svgPaths.p336afb00} fill="var(--fill-0, #A855F7)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute inset-[51.35%_6.91%_45.24%_87.15%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.0536 7.51901">
        <g id="Group">
          <path d={svgPaths.p265371a0} fill="var(--fill-0, #A855F7)" fillOpacity="0.35" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents inset-[6.82%_6.84%_6.82%_6.82%]" data-name="Group">
      <Group7 />
      <Group8 />
      <Group9 />
      <Group10 />
      <Group11 />
      <Group12 />
      <Group13 />
      <Group14 />
      <Group15 />
      <Group16 />
    </div>
  );
}

function Surface() {
  return (
    <div className="absolute left-0 overflow-clip size-[220px] top-0" data-name="Surface">
      <Group />
      <Group6 />
    </div>
  );
}

function PieChart() {
  return (
    <div className="absolute left-0 size-[220px] top-0" data-name="PieChart">
      <Surface />
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-[31.03px] not-italic text-[#0f172a] text-[24px] text-center top-[-1px]">150</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[31px] not-italic text-[#0f172a] text-[12px] text-center top-0">Total Tests</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[46px] relative shrink-0 w-[61.797px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Container12 />
        <Container13 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 pr-[0.016px] size-[220px] top-0" data-name="Container">
      <Container11 />
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute left-[57.33px] size-[220px] top-[8px]" data-name="Container">
      <PieChart />
      <Container10 />
    </div>
  );
}

function Container5() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[334.656px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container6 />
        <Container9 />
      </div>
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-start p-px relative rounded-[8px] size-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container1 />
      <Container5 />
    </div>
  );
}