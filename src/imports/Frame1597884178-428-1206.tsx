function H() {
  return (
    <div className="content-stretch flex h-[28px] items-center relative shrink-0" data-name="H3-62">
      <div className="css-g0mm18 flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[12px]">
        <p className="css-ew64yg leading-[20px]">{`Element-Wise Observation Breakdown `}</p>
      </div>
    </div>
  );
}

function MarginWrap() {
  return (
    <div className="content-stretch flex h-[28px] items-start pb-[4px] relative shrink-0 w-full" data-name="margin-wrap">
      <H />
    </div>
  );
}

function P() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-full" data-name="P-65">
      <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)]">
        <p className="css-ew64yg leading-[20px]">Inspection results across all structural elements</p>
      </div>
    </div>
  );
}

function Div() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-start min-h-px min-w-px relative" data-name="DIV-61">
      <MarginWrap />
      <P />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex h-[68px] items-center left-[-1px] px-[16px] py-[12px] top-0 w-[345px]">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-b border-solid inset-0 pointer-events-none" />
      <Div />
    </div>
  );
}

function Text() {
  return (
    <div className="h-[16px] relative shrink-0 w-[48.453px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#202020] text-[12px]">Uprights</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text />
    </div>
  );
}

function Label() {
  return (
    <div className="h-[20px] relative shrink-0 w-[242px]" data-name="Label">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[10px] top-[0.11px]">Total</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[19px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[12px] text-[rgba(32,32,32,0.6)] top-[-0.89px]">{`10 `}</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] h-[47px] items-start min-h-px min-w-px relative" data-name="Container">
      <Label />
      <Paragraph />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[24px] items-center min-h-px min-w-px relative">
      <Container1 />
    </div>
  );
}

function Label1() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[10px] top-[0.11px]">Damage</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[19px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[12px] text-[rgba(32,32,32,0.6)] top-[-0.89px]">{`10 `}</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] h-[47px] items-start min-h-px min-w-px relative" data-name="Container">
      <Label1 />
      <Paragraph1 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-[109px]">
      <Container2 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative">
      <Frame3 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <Frame1 />
      <Frame11 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[2px] h-[17px] items-center relative shrink-0 w-full">
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
    </div>
  );
}

function Container3() {
  return <div className="bg-[#f32b2b] rounded-[33554400px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text1() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[14px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-0">45</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[14px] relative shrink-0 w-[22.5px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container3 />
        <Text1 />
      </div>
    </div>
  );
}

function Container5() {
  return <div className="bg-[#f59e0b] rounded-[33554400px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text2() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[14px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-0">20</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[14px] relative shrink-0 w-[22.313px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container5 />
        <Text2 />
      </div>
    </div>
  );
}

function Container7() {
  return <div className="bg-[#10b981] rounded-[33554400px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text3() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[14px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-0">25</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[14px] relative shrink-0 w-[22.141px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container7 />
        <Text3 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex gap-[86px] h-[14px] items-center relative shrink-0 w-full" data-name="Container">
      <Container4 />
      <Container6 />
      <Container8 />
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start px-[16px] py-[12px] relative w-full">
        <Container />
        <Frame12 />
        <Frame4 />
        <Container9 />
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[16px] relative shrink-0 w-[32px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#202020] text-[12px]">Beam</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text4 />
    </div>
  );
}

function Label2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[242px]" data-name="Label">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[10px] top-[0.11px]">Total</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[19px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[12px] text-[rgba(32,32,32,0.6)] top-[-0.89px]">{`10 `}</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] h-[47px] items-start min-h-px min-w-px relative" data-name="Container">
      <Label2 />
      <Paragraph2 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[24px] items-center min-h-px min-w-px relative">
      <Container12 />
    </div>
  );
}

function Label3() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[10px] top-[0.11px]">Damage</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[19px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[12px] text-[rgba(32,32,32,0.6)] top-[-0.89px]">{`10 `}</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] h-[47px] items-start min-h-px min-w-px relative" data-name="Container">
      <Label3 />
      <Paragraph3 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-[109px]">
      <Container13 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative">
      <Frame6 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <Frame5 />
      <Frame15 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[2px] h-[17px] items-center relative shrink-0 w-full">
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
    </div>
  );
}

function Container14() {
  return <div className="bg-[#f32b2b] rounded-[33554400px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text5() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[14px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-0">45</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[14px] relative shrink-0 w-[22.5px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container14 />
        <Text5 />
      </div>
    </div>
  );
}

function Container16() {
  return <div className="bg-[#f59e0b] rounded-[33554400px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text6() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[14px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-0">20</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[14px] relative shrink-0 w-[22.313px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container16 />
        <Text6 />
      </div>
    </div>
  );
}

function Container18() {
  return <div className="bg-[#10b981] rounded-[33554400px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text7() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[14px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-0">25</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[14px] relative shrink-0 w-[22.141px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container18 />
        <Text7 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex gap-[86px] h-[14px] items-center relative shrink-0 w-full" data-name="Container">
      <Container15 />
      <Container17 />
      <Container19 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame2 />
      <Container20 />
    </div>
  );
}

function Container21() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start pb-[12px] pt-[13px] px-[16px] relative w-full">
        <Container11 />
        <Frame21 />
        <Frame20 />
      </div>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[16px] relative shrink-0 w-[49.203px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#202020] text-[12px]">Bracings</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text8 />
    </div>
  );
}

function Label4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[242px]" data-name="Label">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[10px] top-[0.11px]">Total</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[19px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[12px] text-[rgba(32,32,32,0.6)] top-[-0.89px]">{`10 `}</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] h-[47px] items-start min-h-px min-w-px relative" data-name="Container">
      <Label4 />
      <Paragraph4 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[24px] items-center min-h-px min-w-px relative">
      <Container23 />
    </div>
  );
}

function Label5() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[10px] top-[0.11px]">Damage</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[19px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[12px] text-[rgba(32,32,32,0.6)] top-[-0.89px]">{`10 `}</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] h-[47px] items-start min-h-px min-w-px relative" data-name="Container">
      <Label5 />
      <Paragraph5 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-[109px]">
      <Container24 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative">
      <Frame8 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <Frame7 />
      <Frame16 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-[2px] h-[17px] items-center relative shrink-0 w-full">
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
    </div>
  );
}

function Container25() {
  return <div className="bg-[#f32b2b] rounded-[33554400px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text9() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[14px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-0">45</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[14px] relative shrink-0 w-[22.5px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container25 />
        <Text9 />
      </div>
    </div>
  );
}

function Container27() {
  return <div className="bg-[#f59e0b] rounded-[33554400px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text10() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[14px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-0">20</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[14px] relative shrink-0 w-[22.313px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container27 />
        <Text10 />
      </div>
    </div>
  );
}

function Container29() {
  return <div className="bg-[#10b981] rounded-[33554400px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text11() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[14px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-0">25</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="h-[14px] relative shrink-0 w-[22.141px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container29 />
        <Text11 />
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex gap-[86px] h-[14px] items-center relative shrink-0 w-full" data-name="Container">
      <Container26 />
      <Container28 />
      <Container30 />
    </div>
  );
}

function Container32() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start pb-[12px] pt-[13px] px-[16px] relative w-full">
        <Container22 />
        <Frame13 />
        <Frame14 />
        <Container31 />
      </div>
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[16px] relative shrink-0 w-[58px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#202020] text-[12px]">Baseplate</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text12 />
    </div>
  );
}

function Label6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[242px]" data-name="Label">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[10px] top-[0.11px]">Total</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[19px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[12px] text-[rgba(32,32,32,0.6)] top-[-0.89px]">{`10 `}</p>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] h-[47px] items-start min-h-px min-w-px relative" data-name="Container">
      <Label6 />
      <Paragraph6 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[24px] items-center min-h-px min-w-px relative">
      <Container34 />
    </div>
  );
}

function Label7() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[10px] top-[0.11px]">Damage</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[19px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[12px] text-[rgba(32,32,32,0.6)] top-[-0.89px]">{`10 `}</p>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] h-[47px] items-start min-h-px min-w-px relative" data-name="Container">
      <Label7 />
      <Paragraph7 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-[109px]">
      <Container35 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative">
      <Frame10 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <Frame9 />
      <Frame17 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[2px] h-[17px] items-center relative shrink-0 w-full">
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
      <div className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
    </div>
  );
}

function Container36() {
  return <div className="bg-[#f32b2b] rounded-[33554400px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text13() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[14px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-0">45</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[14px] relative shrink-0 w-[22.5px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container36 />
        <Text13 />
      </div>
    </div>
  );
}

function Container38() {
  return <div className="bg-[#f59e0b] rounded-[33554400px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text14() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[14px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-0">20</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[14px] relative shrink-0 w-[22.313px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container38 />
        <Text14 />
      </div>
    </div>
  );
}

function Container40() {
  return <div className="bg-[#10b981] rounded-[33554400px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text15() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[14px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-0">25</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="h-[14px] relative shrink-0 w-[22.141px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container40 />
        <Text15 />
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex gap-[86px] h-[14px] items-center relative shrink-0 w-full" data-name="Container">
      <Container37 />
      <Container39 />
      <Container41 />
    </div>
  );
}

function Container43() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start pb-[12px] pt-[13px] px-[16px] relative w-full">
        <Container33 />
        <Frame18 />
        <Frame19 />
        <Container42 />
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-start left-[15px] p-px rounded-[5px] top-[84px] w-[313px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[5px]" />
      <Container10 />
      <Container21 />
      <Container32 />
      {[...Array(4).keys()].map((_, i) => (
        <Container43 key={i} />
      ))}
    </div>
  );
}

export default function Frame22() {
  return (
    <div className="bg-white border border-[#e8e8e8] border-solid overflow-clip relative rounded-[6px] size-full">
      <Frame />
      <Container44 />
    </div>
  );
}