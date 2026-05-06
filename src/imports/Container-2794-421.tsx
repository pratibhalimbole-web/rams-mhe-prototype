import svgPaths from "./svg-12tal93qwb";

function Heading() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[143.172px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[27px] left-0 not-italic text-[#09090b] text-[18px] top-px tracking-[-0.45px] whitespace-nowrap">CN-L1 — Rack 05</p>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[143.172px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] left-0 not-italic text-[#64748b] text-[11px] top-0 whitespace-nowrap">3D Rack View</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[43.5px] relative shrink-0 w-[143.172px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading />
        <Paragraph />
      </div>
    </div>
  );
}

function Text() {
  return <div className="bg-[#00bc7d] opacity-52 rounded-[33554400px] shrink-0 size-[8px]" data-name="Text" />;
}

function Text1() {
  return (
    <div className="flex-[1_0_0] h-[16.5px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16.5px] left-0 not-italic text-[#007a55] text-[11px] top-0 tracking-[0.55px] uppercase whitespace-nowrap">Live</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[#ecfdf5] h-[26.5px] relative rounded-[33554400px] shrink-0 w-[64.406px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#d0fae5] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[11px] py-px relative size-full">
        <Text />
        <Text1 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-white h-[84.5px] relative shrink-0 w-[381px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e4e4e7] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-px px-[24px] relative size-full">
        <Container2 />
        <Container3 />
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[8px] h-[25px] items-center justify-center py-[4px] relative shrink-0">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#1b59f8] text-[0px] whitespace-nowrap">
        <p className="[text-decoration-skip-ink:none] decoration-solid leading-[20px] text-[12px] underline">#Observation_Pin</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame />
      <div className="bg-[#fee2e2] content-stretch flex h-[21px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0" data-name="SPAN-112">
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#dc2626] text-[10px] text-center text-shadow-[0px_1px_2px_rgba(0,0,0,0.05)] whitespace-nowrap">
          <p className="leading-[20px]">Red</p>
        </div>
      </div>
    </div>
  );
}

function GameBoard() {
  return (
    <div className="h-[18px] relative shrink-0 w-[9px]" data-name="game-board">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 18">
        <g id="game-board">
          <path d={svgPaths.p61ebe00} fill="var(--fill-0, #1B59F8)" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Span() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[4px] h-[22px] items-center leading-[0] not-italic pr-[6px] relative shrink-0 text-[#202020]" data-name="SPAN-399">
      <div className="flex flex-col justify-center overflow-hidden relative shrink-0 text-[10px] text-ellipsis w-[59px] whitespace-nowrap">
        <p className="leading-[16px] overflow-hidden">#Rack_Name</p>
      </div>
      <div className="flex flex-col h-[22px] justify-center relative shrink-0 text-[11px] tracking-[-1.21px] w-[7px]">
        <p className="font-['Inter:Thin',sans-serif] font-thin">
          <span className="leading-[20px]">{` `}</span>
          <span className="leading-[20px] text-[rgba(32,32,32,0.6)] tracking-[-1.76px]">|</span>
          <span className="leading-[20px]">{` `}</span>
        </p>
      </div>
      <div className="flex flex-col justify-center overflow-hidden relative shrink-0 text-[10px] text-ellipsis w-[34px] whitespace-nowrap">
        <p className="leading-[16px] overflow-hidden">#BAY_3</p>
      </div>
      <div className="flex flex-col h-[22px] justify-center relative shrink-0 text-[11px] tracking-[-1.21px] w-[7px]">
        <p className="font-['Inter:Thin',sans-serif] font-thin">
          <span className="leading-[20px]">{` `}</span>
          <span className="leading-[20px] text-[rgba(32,32,32,0.6)] tracking-[-1.76px]">|</span>
          <span className="leading-[20px]">{` `}</span>
        </p>
      </div>
      <div className="flex flex-col h-[22px] justify-center overflow-hidden relative shrink-0 text-[10px] text-ellipsis w-[40px] whitespace-nowrap">
        <p className="leading-[16px] overflow-hidden">Level 03</p>
      </div>
      <div className="flex flex-col h-[22px] justify-center relative shrink-0 text-[11px] tracking-[-1.21px] w-[7px]">
        <p className="font-['Inter:Thin',sans-serif] font-thin">
          <span className="leading-[20px]">{` `}</span>
          <span className="leading-[20px] text-[rgba(32,32,32,0.6)] tracking-[-1.76px]">|</span>
          <span className="leading-[20px]">{` `}</span>
        </p>
      </div>
      <div className="flex flex-col justify-center overflow-hidden relative shrink-0 text-[10px] text-ellipsis w-[35px] whitespace-nowrap">
        <p className="leading-[16px] overflow-hidden">Upright</p>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[4px] h-[22px] items-center relative shrink-0">
      <GameBoard />
      <Span />
    </div>
  );
}

function Label() {
  return (
    <div className="font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[10px] w-full whitespace-nowrap" data-name="Label">
      <p className="absolute left-0 top-[0.11px]">{`Observation `}</p>
      <p className="absolute left-0 top-[0.11px]">{`Observation `}</p>
      <p className="absolute left-0 top-[0.11px]">{`Observation `}</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-[-0.89px] whitespace-nowrap">Dent</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[7.997px] h-[47px] items-start relative shrink-0 w-[83px]" data-name="Container">
      <Label />
      <Paragraph1 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
      <Container5 />
    </div>
  );
}

function Group() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.3945 8.39807">
        <g id="Group">
          <path d={svgPaths.p4f44a00} fill="var(--fill-0, #2563EB)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute h-[9.598px] left-0 overflow-clip top-[-1.2px] w-[9.991px]" data-name="Icon-29">
      <div className="absolute flex inset-[6.26%_17.98%_6.24%_18.02%] items-center justify-center">
        <div className="-scale-y-100 flex-none h-[8.398px] w-[6.394px]">
          <Group />
        </div>
      </div>
    </div>
  );
}

function I() {
  return (
    <div className="content-stretch flex h-[7.193px] items-center relative shrink-0 w-[9.998px]" data-name="I-28">
      <Icon />
    </div>
  );
}

function Div1() {
  return (
    <div className="bg-[rgba(37,99,235,0.1)] content-stretch flex items-center justify-center relative rounded-[17.25px] shrink-0 size-[18px]" data-name="DIV-27">
      <I />
    </div>
  );
}

function MarginWrap() {
  return (
    <div className="content-stretch flex items-start pr-[8px] relative shrink-0" data-name="margin-wrap">
      <Div1 />
    </div>
  );
}

function P() {
  return (
    <div className="content-stretch flex h-[18px] items-center relative shrink-0" data-name="P-34">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] whitespace-nowrap">
        <p className="leading-[20px]">John Martinez</p>
      </div>
    </div>
  );
}

function Div4() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-name="DIV-30">
      <P />
    </div>
  );
}

function Div() {
  return (
    <div className="content-stretch flex h-[25px] items-center relative shrink-0" data-name="DIV-26">
      <MarginWrap />
      <Div4 />
    </div>
  );
}

function P5() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0" data-name="P-269">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] whitespace-nowrap">
        <p className="leading-[20px]">5 min ago</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[6px] h-[25px] items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="clock">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[10.667px] top-1/2" data-name="Primary">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 10.6667">
            <path d={svgPaths.p3175a500} fill="var(--fill-0, black)" id="Primary" />
          </svg>
        </div>
      </div>
      <P5 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex h-[25px] items-center px-[8px] py-[6px] relative rounded-[14px] shrink-0">
      <Frame6 />
    </div>
  );
}

function BarDesc() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Bar Desc">
      <Div />
      <Frame5 />
    </div>
  );
}

function Chart() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Chart">
      <BarDesc />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame4 />
      <Frame17 />
      <Frame30 />
      <Chart />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[8px] h-[25px] items-center justify-center py-[4px] relative shrink-0">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#1b59f8] text-[0px] whitespace-nowrap">
        <p className="[text-decoration-skip-ink:none] decoration-solid leading-[20px] text-[12px] underline">#Observation_Pin</p>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame1 />
      <div className="bg-[#dcfce7] content-stretch flex h-[21px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0" data-name="SPAN-93">
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#15823b] text-[10px] text-center text-shadow-[0px_1px_2px_rgba(0,0,0,0.05)] whitespace-nowrap">
          <p className="leading-[20px]">Green</p>
        </div>
      </div>
    </div>
  );
}

function GameBoard1() {
  return (
    <div className="h-[18px] relative shrink-0 w-[9px]" data-name="game-board">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 18">
        <g id="game-board">
          <path d={svgPaths.p61ebe00} fill="var(--fill-0, #1B59F8)" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Span1() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[4px] h-[22px] items-center leading-[0] not-italic pr-[6px] relative shrink-0 text-[#202020]" data-name="SPAN-399">
      <div className="flex flex-col justify-center overflow-hidden relative shrink-0 text-[10px] text-ellipsis w-[59px] whitespace-nowrap">
        <p className="leading-[16px] overflow-hidden">#Rack_Name</p>
      </div>
      <div className="flex flex-col h-[22px] justify-center relative shrink-0 text-[11px] tracking-[-1.21px] w-[7px]">
        <p className="font-['Inter:Thin',sans-serif] font-thin">
          <span className="leading-[20px]">{` `}</span>
          <span className="leading-[20px] text-[rgba(32,32,32,0.6)] tracking-[-1.76px]">|</span>
          <span className="leading-[20px]">{` `}</span>
        </p>
      </div>
      <div className="flex flex-col justify-center overflow-hidden relative shrink-0 text-[10px] text-ellipsis w-[34px] whitespace-nowrap">
        <p className="leading-[16px] overflow-hidden">#BAY_3</p>
      </div>
      <div className="flex flex-col h-[22px] justify-center relative shrink-0 text-[11px] tracking-[-1.21px] w-[7px]">
        <p className="font-['Inter:Thin',sans-serif] font-thin">
          <span className="leading-[20px]">{` `}</span>
          <span className="leading-[20px] text-[rgba(32,32,32,0.6)] tracking-[-1.76px]">|</span>
          <span className="leading-[20px]">{` `}</span>
        </p>
      </div>
      <div className="flex flex-col h-[22px] justify-center overflow-hidden relative shrink-0 text-[10px] text-ellipsis w-[40px] whitespace-nowrap">
        <p className="leading-[16px] overflow-hidden">Level 03</p>
      </div>
      <div className="flex flex-col h-[22px] justify-center relative shrink-0 text-[11px] tracking-[-1.21px] w-[7px]">
        <p className="font-['Inter:Thin',sans-serif] font-thin">
          <span className="leading-[20px]">{` `}</span>
          <span className="leading-[20px] text-[rgba(32,32,32,0.6)] tracking-[-1.76px]">|</span>
          <span className="leading-[20px]">{` `}</span>
        </p>
      </div>
      <div className="flex flex-col justify-center overflow-hidden relative shrink-0 text-[10px] text-ellipsis w-[35px] whitespace-nowrap">
        <p className="leading-[16px] overflow-hidden">Upright</p>
      </div>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[4px] h-[22px] items-center relative shrink-0">
      <GameBoard1 />
      <Span1 />
    </div>
  );
}

function Label1() {
  return (
    <div className="font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[10px] w-full whitespace-nowrap" data-name="Label">
      <p className="absolute left-0 top-[0.11px]">{`Observation `}</p>
      <p className="absolute left-0 top-[0.11px]">{`Observation `}</p>
      <p className="absolute left-0 top-[0.11px]">{`Observation `}</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-[-0.89px] whitespace-nowrap">Dent</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[7.997px] h-[47px] items-start relative shrink-0 w-[83px]" data-name="Container">
      <Label1 />
      <Paragraph2 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
      <Container6 />
    </div>
  );
}

function Group1() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.3945 8.39807">
        <g id="Group">
          <path d={svgPaths.p4f44a00} fill="var(--fill-0, #2563EB)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute h-[9.598px] left-0 overflow-clip top-[-1.2px] w-[9.991px]" data-name="Icon-29">
      <div className="absolute flex inset-[6.26%_17.98%_6.24%_18.02%] items-center justify-center">
        <div className="-scale-y-100 flex-none h-[8.398px] w-[6.394px]">
          <Group1 />
        </div>
      </div>
    </div>
  );
}

function I1() {
  return (
    <div className="content-stretch flex h-[7.193px] items-center relative shrink-0 w-[9.998px]" data-name="I-28">
      <Icon1 />
    </div>
  );
}

function Div3() {
  return (
    <div className="bg-[rgba(37,99,235,0.1)] content-stretch flex items-center justify-center relative rounded-[17.25px] shrink-0 size-[18px]" data-name="DIV-27">
      <I1 />
    </div>
  );
}

function MarginWrap1() {
  return (
    <div className="content-stretch flex items-start pr-[8px] relative shrink-0" data-name="margin-wrap">
      <Div3 />
    </div>
  );
}

function P1() {
  return (
    <div className="content-stretch flex h-[18px] items-center relative shrink-0" data-name="P-34">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] whitespace-nowrap">
        <p className="leading-[20px]">John Martinez</p>
      </div>
    </div>
  );
}

function Div5() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-name="DIV-30">
      <P1 />
    </div>
  );
}

function Div2() {
  return (
    <div className="content-stretch flex h-[25px] items-center relative shrink-0" data-name="DIV-26">
      <MarginWrap1 />
      <Div5 />
    </div>
  );
}

function P6() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0" data-name="P-269">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] whitespace-nowrap">
        <p className="leading-[20px]">5 min ago</p>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[6px] h-[25px] items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="clock">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[10.667px] top-1/2" data-name="Primary">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 10.6667">
            <path d={svgPaths.p3175a500} fill="var(--fill-0, black)" id="Primary" />
          </svg>
        </div>
      </div>
      <P6 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex h-[25px] items-center px-[8px] py-[6px] relative rounded-[14px] shrink-0">
      <Frame9 />
    </div>
  );
}

function BarDesc1() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Bar Desc">
      <Div2 />
      <Frame8 />
    </div>
  );
}

function Chart1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Chart">
      <BarDesc1 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame7 />
      <Frame18 />
      <Frame31 />
      <Chart1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[8px] h-[25px] items-center justify-center py-[4px] relative shrink-0">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#1b59f8] text-[0px] whitespace-nowrap">
        <p className="[text-decoration-skip-ink:none] decoration-solid leading-[20px] text-[12px] underline">#Observation_Pin</p>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame2 />
      <div className="bg-[#fef3c7] content-stretch flex h-[21px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0" data-name="SPAN-131">
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#f59e0b] text-[10px] text-center text-shadow-[0px_1px_2px_rgba(0,0,0,0.05)] whitespace-nowrap">
          <p className="leading-[20px]">Amber</p>
        </div>
      </div>
    </div>
  );
}

function GameBoard2() {
  return (
    <div className="h-[18px] relative shrink-0 w-[9px]" data-name="game-board">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 18">
        <g id="game-board">
          <path d={svgPaths.p61ebe00} fill="var(--fill-0, #1B59F8)" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Span2() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[4px] h-[22px] items-center leading-[0] not-italic pr-[6px] relative shrink-0 text-[#202020]" data-name="SPAN-399">
      <div className="flex flex-col justify-center overflow-hidden relative shrink-0 text-[10px] text-ellipsis w-[59px] whitespace-nowrap">
        <p className="leading-[16px] overflow-hidden">#Rack_Name</p>
      </div>
      <div className="flex flex-col h-[22px] justify-center relative shrink-0 text-[11px] tracking-[-1.21px] w-[7px]">
        <p className="font-['Inter:Thin',sans-serif] font-thin">
          <span className="leading-[20px]">{` `}</span>
          <span className="leading-[20px] text-[rgba(32,32,32,0.6)] tracking-[-1.76px]">|</span>
          <span className="leading-[20px]">{` `}</span>
        </p>
      </div>
      <div className="flex flex-col justify-center overflow-hidden relative shrink-0 text-[10px] text-ellipsis w-[34px] whitespace-nowrap">
        <p className="leading-[16px] overflow-hidden">#BAY_3</p>
      </div>
      <div className="flex flex-col h-[22px] justify-center relative shrink-0 text-[11px] tracking-[-1.21px] w-[7px]">
        <p className="font-['Inter:Thin',sans-serif] font-thin">
          <span className="leading-[20px]">{` `}</span>
          <span className="leading-[20px] text-[rgba(32,32,32,0.6)] tracking-[-1.76px]">|</span>
          <span className="leading-[20px]">{` `}</span>
        </p>
      </div>
      <div className="flex flex-col h-[22px] justify-center overflow-hidden relative shrink-0 text-[10px] text-ellipsis w-[40px] whitespace-nowrap">
        <p className="leading-[16px] overflow-hidden">Level 03</p>
      </div>
      <div className="flex flex-col h-[22px] justify-center relative shrink-0 text-[11px] tracking-[-1.21px] w-[7px]">
        <p className="font-['Inter:Thin',sans-serif] font-thin">
          <span className="leading-[20px]">{` `}</span>
          <span className="leading-[20px] text-[rgba(32,32,32,0.6)] tracking-[-1.76px]">|</span>
          <span className="leading-[20px]">{` `}</span>
        </p>
      </div>
      <div className="flex flex-col justify-center overflow-hidden relative shrink-0 text-[10px] text-ellipsis w-[35px] whitespace-nowrap">
        <p className="leading-[16px] overflow-hidden">Upright</p>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[4px] h-[22px] items-center relative shrink-0">
      <GameBoard2 />
      <Span2 />
    </div>
  );
}

function Label2() {
  return (
    <div className="font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[10px] w-full whitespace-nowrap" data-name="Label">
      <p className="absolute left-0 top-[0.11px]">{`Observation `}</p>
      <p className="absolute left-0 top-[0.11px]">{`Observation `}</p>
      <p className="absolute left-0 top-[0.11px]">{`Observation `}</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-[-0.89px] whitespace-nowrap">Dent</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col gap-[7.997px] h-[47px] items-start relative shrink-0 w-[83px]" data-name="Container">
      <Label2 />
      <Paragraph3 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
      <Container7 />
    </div>
  );
}

function Group2() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.3945 8.39807">
        <g id="Group">
          <path d={svgPaths.p4f44a00} fill="var(--fill-0, #2563EB)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute h-[9.598px] left-0 overflow-clip top-[-1.2px] w-[9.991px]" data-name="Icon-29">
      <div className="absolute flex inset-[6.26%_17.98%_6.24%_18.02%] items-center justify-center">
        <div className="-scale-y-100 flex-none h-[8.398px] w-[6.394px]">
          <Group2 />
        </div>
      </div>
    </div>
  );
}

function I2() {
  return (
    <div className="content-stretch flex h-[7.193px] items-center relative shrink-0 w-[9.998px]" data-name="I-28">
      <Icon2 />
    </div>
  );
}

function Div7() {
  return (
    <div className="bg-[rgba(37,99,235,0.1)] content-stretch flex items-center justify-center relative rounded-[17.25px] shrink-0 size-[18px]" data-name="DIV-27">
      <I2 />
    </div>
  );
}

function MarginWrap2() {
  return (
    <div className="content-stretch flex items-start pr-[8px] relative shrink-0" data-name="margin-wrap">
      <Div7 />
    </div>
  );
}

function P2() {
  return (
    <div className="content-stretch flex h-[18px] items-center relative shrink-0" data-name="P-34">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] whitespace-nowrap">
        <p className="leading-[20px]">John Martinez</p>
      </div>
    </div>
  );
}

function Div8() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-name="DIV-30">
      <P2 />
    </div>
  );
}

function Div6() {
  return (
    <div className="content-stretch flex h-[25px] items-center relative shrink-0" data-name="DIV-26">
      <MarginWrap2 />
      <Div8 />
    </div>
  );
}

function P7() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0" data-name="P-269">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] whitespace-nowrap">
        <p className="leading-[20px]">5 min ago</p>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[6px] h-[25px] items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="clock">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[10.667px] top-1/2" data-name="Primary">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 10.6667">
            <path d={svgPaths.p3175a500} fill="var(--fill-0, black)" id="Primary" />
          </svg>
        </div>
      </div>
      <P7 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex h-[25px] items-center px-[8px] py-[6px] relative rounded-[14px] shrink-0">
      <Frame12 />
    </div>
  );
}

function BarDesc2() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Bar Desc">
      <Div6 />
      <Frame11 />
    </div>
  );
}

function Chart2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Chart">
      <BarDesc2 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame10 />
      <Frame19 />
      <Frame32 />
      <Chart2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[8px] h-[25px] items-center justify-center py-[4px] relative shrink-0">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#1b59f8] text-[0px] whitespace-nowrap">
        <p className="[text-decoration-skip-ink:none] decoration-solid leading-[20px] text-[12px] underline">#Observation_Pin</p>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame3 />
      <div className="bg-[#fef3c7] content-stretch flex h-[21px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0" data-name="SPAN-131">
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#f59e0b] text-[10px] text-center text-shadow-[0px_1px_2px_rgba(0,0,0,0.05)] whitespace-nowrap">
          <p className="leading-[20px]">Amber</p>
        </div>
      </div>
    </div>
  );
}

function GameBoard3() {
  return (
    <div className="h-[18px] relative shrink-0 w-[9px]" data-name="game-board">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 18">
        <g id="game-board">
          <path d={svgPaths.p61ebe00} fill="var(--fill-0, #1B59F8)" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Span3() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[4px] h-[22px] items-center leading-[0] not-italic pr-[6px] relative shrink-0 text-[#202020]" data-name="SPAN-399">
      <div className="flex flex-col justify-center overflow-hidden relative shrink-0 text-[10px] text-ellipsis w-[59px] whitespace-nowrap">
        <p className="leading-[16px] overflow-hidden">#Rack_Name</p>
      </div>
      <div className="flex flex-col h-[22px] justify-center relative shrink-0 text-[11px] tracking-[-1.21px] w-[7px]">
        <p className="font-['Inter:Thin',sans-serif] font-thin">
          <span className="leading-[20px]">{` `}</span>
          <span className="leading-[20px] text-[rgba(32,32,32,0.6)] tracking-[-1.76px]">|</span>
          <span className="leading-[20px]">{` `}</span>
        </p>
      </div>
      <div className="flex flex-col justify-center overflow-hidden relative shrink-0 text-[10px] text-ellipsis w-[34px] whitespace-nowrap">
        <p className="leading-[16px] overflow-hidden">#BAY_3</p>
      </div>
      <div className="flex flex-col h-[22px] justify-center relative shrink-0 text-[11px] tracking-[-1.21px] w-[7px]">
        <p className="font-['Inter:Thin',sans-serif] font-thin">
          <span className="leading-[20px]">{` `}</span>
          <span className="leading-[20px] text-[rgba(32,32,32,0.6)] tracking-[-1.76px]">|</span>
          <span className="leading-[20px]">{` `}</span>
        </p>
      </div>
      <div className="flex flex-col h-[22px] justify-center overflow-hidden relative shrink-0 text-[10px] text-ellipsis w-[40px] whitespace-nowrap">
        <p className="leading-[16px] overflow-hidden">Level 03</p>
      </div>
      <div className="flex flex-col h-[22px] justify-center relative shrink-0 text-[11px] tracking-[-1.21px] w-[7px]">
        <p className="font-['Inter:Thin',sans-serif] font-thin">
          <span className="leading-[20px]">{` `}</span>
          <span className="leading-[20px] text-[rgba(32,32,32,0.6)] tracking-[-1.76px]">|</span>
          <span className="leading-[20px]">{` `}</span>
        </p>
      </div>
      <div className="flex flex-col justify-center overflow-hidden relative shrink-0 text-[10px] text-ellipsis w-[35px] whitespace-nowrap">
        <p className="leading-[16px] overflow-hidden">Upright</p>
      </div>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex gap-[4px] h-[22px] items-center relative shrink-0">
      <GameBoard3 />
      <Span3 />
    </div>
  );
}

function Label3() {
  return (
    <div className="font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[10px] w-full whitespace-nowrap" data-name="Label">
      <p className="absolute left-0 top-[0.11px]">{`Observation `}</p>
      <p className="absolute left-0 top-[0.11px]">{`Observation `}</p>
      <p className="absolute left-0 top-[0.11px]">{`Observation `}</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-[-0.89px] whitespace-nowrap">Dent</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col gap-[7.997px] h-[47px] items-start relative shrink-0 w-[83px]" data-name="Container">
      <Label3 />
      <Paragraph4 />
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
      <Container8 />
    </div>
  );
}

function Group3() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.3945 8.39807">
        <g id="Group">
          <path d={svgPaths.p4f44a00} fill="var(--fill-0, #2563EB)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute h-[9.598px] left-0 overflow-clip top-[-1.2px] w-[9.991px]" data-name="Icon-29">
      <div className="absolute flex inset-[6.26%_17.98%_6.24%_18.02%] items-center justify-center">
        <div className="-scale-y-100 flex-none h-[8.398px] w-[6.394px]">
          <Group3 />
        </div>
      </div>
    </div>
  );
}

function I3() {
  return (
    <div className="content-stretch flex h-[7.193px] items-center relative shrink-0 w-[9.998px]" data-name="I-28">
      <Icon3 />
    </div>
  );
}

function Div10() {
  return (
    <div className="bg-[rgba(37,99,235,0.1)] content-stretch flex items-center justify-center relative rounded-[17.25px] shrink-0 size-[18px]" data-name="DIV-27">
      <I3 />
    </div>
  );
}

function MarginWrap3() {
  return (
    <div className="content-stretch flex items-start pr-[8px] relative shrink-0" data-name="margin-wrap">
      <Div10 />
    </div>
  );
}

function P3() {
  return (
    <div className="content-stretch flex h-[18px] items-center relative shrink-0" data-name="P-34">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] whitespace-nowrap">
        <p className="leading-[20px]">John Martinez</p>
      </div>
    </div>
  );
}

function Div11() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-name="DIV-30">
      <P3 />
    </div>
  );
}

function Div9() {
  return (
    <div className="content-stretch flex h-[25px] items-center relative shrink-0" data-name="DIV-26">
      <MarginWrap3 />
      <Div11 />
    </div>
  );
}

function P8() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0" data-name="P-269">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] whitespace-nowrap">
        <p className="leading-[20px]">5 min ago</p>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-[6px] h-[25px] items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="clock">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[10.667px] top-1/2" data-name="Primary">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 10.6667">
            <path d={svgPaths.p3175a500} fill="var(--fill-0, black)" id="Primary" />
          </svg>
        </div>
      </div>
      <P8 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex h-[25px] items-center px-[8px] py-[6px] relative rounded-[14px] shrink-0">
      <Frame15 />
    </div>
  );
}

function BarDesc3() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Bar Desc">
      <Div9 />
      <Frame14 />
    </div>
  );
}

function Chart3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Chart">
      <BarDesc3 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame13 />
      <Frame20 />
      <Frame33 />
      <Chart3 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[638px] items-start overflow-clip relative shrink-0 w-full">
      <div className="bg-white relative rounded-[6px] shrink-0 w-full" data-name="Component 76">
        <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <div className="content-stretch flex flex-col items-start px-[16px] py-[12px] relative w-full">
          <Frame22 />
        </div>
      </div>
      <div className="bg-white relative rounded-[6px] shrink-0 w-full" data-name="Component 77">
        <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <div className="content-stretch flex flex-col items-start px-[16px] py-[12px] relative w-full">
          <Frame24 />
        </div>
      </div>
      <div className="bg-white relative rounded-[6px] shrink-0 w-full" data-name="Component 75">
        <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <div className="content-stretch flex flex-col items-start px-[16px] py-[12px] relative w-full">
          <Frame25 />
        </div>
      </div>
      <div className="bg-white relative rounded-[6px] shrink-0 w-full" data-name="Component 78">
        <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <div className="content-stretch flex flex-col items-start px-[16px] py-[12px] relative w-full">
          <Frame26 />
        </div>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col h-[680.5px] items-start left-0 overflow-clip pt-[24px] px-[20px] top-0 w-[383px]" data-name="Container">
      <Frame23 />
    </div>
  );
}

function P4() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-full" data-name="P-89">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] whitespace-nowrap">
        <p className="leading-[20px]">Showing 3 of 12 alerts</p>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-[127px]">
      <P4 />
    </div>
  );
}

function Span4() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0" data-name="SPAN-399">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
        <p className="leading-[20px]">{`View All `}</p>
      </div>
    </div>
  );
}

function Frame29() {
  return (
    <div className="bg-[#1b59f8] content-stretch flex h-[26px] items-center justify-end px-[8px] relative rounded-[6px] shrink-0">
      <Span4 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0">
      <Frame29 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center justify-between min-h-px min-w-px relative">
      <Frame21 />
      <Frame28 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="absolute bg-white content-stretch flex h-[65px] items-center left-0 px-[16px] py-[8px] top-[680.5px] w-[382px]">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-solid border-t inset-0 pointer-events-none" />
      <Frame16 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="h-[745.5px] relative shrink-0 w-[383px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container4 />
        <Frame27 />
      </div>
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-[#f1f5f9] relative rounded-[12px] size-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container1 />
        <Frame34 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}