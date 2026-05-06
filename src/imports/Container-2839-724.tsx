function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[77.656px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0 whitespace-nowrap">420</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[15px] relative shrink-0 w-[77.656px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-0 not-italic text-[#e11d48] text-[10px] top-0 tracking-[0.25px] uppercase whitespace-nowrap">REd</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] items-start left-0 pl-[9px] pr-px py-[9px] rounded-[8px] top-[0.5px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Text />
      <Text1 />
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[77.656px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0 whitespace-nowrap">420</p>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[15px] relative shrink-0 w-[77.656px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-0 not-italic text-[#f59e0b] text-[10px] top-0 tracking-[0.25px] uppercase whitespace-nowrap">Amber</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] items-start left-[108px] pl-[9px] pr-px py-[9px] rounded-[8px] top-[0.5px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Text2 />
      <Text3 />
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[77.656px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0 whitespace-nowrap">420</p>
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[15px] relative shrink-0 w-[77.656px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-0 not-italic text-[#16a34a] text-[10px] top-0 tracking-[0.25px] uppercase whitespace-nowrap">Green</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] items-start left-[216px] pl-[9px] pr-px py-[9px] rounded-[8px] top-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Text4 />
      <Text5 />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[57px] relative shrink-0 w-[303px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container2 />
        <Container3 />
        <Container4 />
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[16px] relative shrink-0 w-[32px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#202020] text-[12px] whitespace-nowrap">Installation</p>
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="h-[20px] relative shrink-0 w-[36px]" data-name="Label">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[10px] top-0 w-[36px]">Total</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[20px] relative shrink-0 w-[15px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[19px] leading-[20px] left-0 not-italic text-[12px] text-[rgba(32,32,32,0.6)] top-px w-[14px]">{`10 `}</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex gap-[6px] items-start relative shrink-0" data-name="Container">
      <Label />
      <Paragraph />
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[16px] relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] h-full items-center relative">
        <Container7 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text6 />
      <Frame />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[2px] h-[25px] items-center relative shrink-0 w-full">
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
    </div>
  );
}

function Container10() {
  return <div className="bg-[#f32b2b] rounded-[33554400px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text7() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[14px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-0 whitespace-nowrap">45</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container10 />
        <Text7 />
      </div>
    </div>
  );
}

function Container12() {
  return <div className="bg-[#f59e0b] rounded-[33554400px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text8() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[14px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-0 whitespace-nowrap">20</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container12 />
        <Text8 />
      </div>
    </div>
  );
}

function Container14() {
  return <div className="bg-[#10b981] rounded-[33554400px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text9() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[14px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-0 whitespace-nowrap">25</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container14 />
        <Text9 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex gap-[86px] h-[14px] items-center relative shrink-0 w-full" data-name="Container">
      <Container9 />
      <Container11 />
      <Container13 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame1 />
      <Container8 />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start pb-[12px] pr-[16px] relative shrink-0 w-[303px]" data-name="Container">
      <Container6 />
      <Frame6 />
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[16px] relative shrink-0 w-[32px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#202020] text-[12px] whitespace-nowrap">Design Discrepancy</p>
      </div>
    </div>
  );
}

function Label1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[36px]" data-name="Label">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[10px] top-0 w-[36px]">Total</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[15px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[19px] leading-[20px] left-0 not-italic text-[12px] text-[rgba(32,32,32,0.6)] top-px w-[14px]">{`10 `}</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex gap-[6px] items-start relative shrink-0" data-name="Container">
      <Label1 />
      <Paragraph1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="h-[16px] relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] h-full items-center relative">
        <Container17 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text10 />
      <Frame2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[2px] h-[25px] items-center relative shrink-0 w-full">
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
    </div>
  );
}

function Container20() {
  return <div className="bg-[#f32b2b] rounded-[33554400px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text11() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[14px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-0 whitespace-nowrap">45</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container20 />
        <Text11 />
      </div>
    </div>
  );
}

function Container22() {
  return <div className="bg-[#f59e0b] rounded-[33554400px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text12() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[14px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-0 whitespace-nowrap">20</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container22 />
        <Text12 />
      </div>
    </div>
  );
}

function Container24() {
  return <div className="bg-[#10b981] rounded-[33554400px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text13() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[14px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-0 whitespace-nowrap">25</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container24 />
        <Text13 />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex gap-[86px] h-[14px] items-center relative shrink-0 w-full" data-name="Container">
      <Container19 />
      <Container21 />
      <Container23 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame3 />
      <Container18 />
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start pb-[12px] pr-[16px] pt-[13px] relative shrink-0 w-[303px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-solid border-t inset-0 pointer-events-none" />
      <Container16 />
      <Frame7 />
    </div>
  );
}

function Text14() {
  return (
    <div className="h-[16px] relative shrink-0 w-[32px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#202020] text-[12px] whitespace-nowrap">{`Operation & Maintenance`}</p>
      </div>
    </div>
  );
}

function Label2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[36px]" data-name="Label">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[10px] top-0 w-[36px]">Total</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[15px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[19px] leading-[20px] left-0 not-italic text-[12px] text-[rgba(32,32,32,0.6)] top-px w-[14px]">{`10 `}</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex gap-[6px] items-start relative shrink-0" data-name="Container">
      <Label2 />
      <Paragraph2 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="h-[16px] relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] h-full items-center relative">
        <Container27 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text14 />
      <Frame4 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[2px] h-[25px] items-center relative shrink-0 w-full">
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#e11d48] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#f59e0b] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
      <div className="bg-[#16a34a] flex-[1_0_0] h-[18px] min-h-px min-w-px" />
    </div>
  );
}

function Container30() {
  return <div className="bg-[#f32b2b] rounded-[33554400px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text15() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[14px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-0 whitespace-nowrap">45</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container30 />
        <Text15 />
      </div>
    </div>
  );
}

function Container32() {
  return <div className="bg-[#f59e0b] rounded-[33554400px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text16() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[14px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-0 whitespace-nowrap">20</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container32 />
        <Text16 />
      </div>
    </div>
  );
}

function Container34() {
  return <div className="bg-[#10b981] rounded-[33554400px] shrink-0 size-[6px]" data-name="Container" />;
}

function Text17() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[14px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] top-0 whitespace-nowrap">25</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="flex-[1_0_0] h-[14px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container34 />
        <Text17 />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex gap-[86px] h-[14px] items-center relative shrink-0 w-full" data-name="Container">
      <Container29 />
      <Container31 />
      <Container33 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame5 />
      <Container28 />
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start pb-[12px] pr-[16px] pt-[13px] relative shrink-0 w-[303px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-solid border-t inset-0 pointer-events-none" />
      <Container26 />
      <Frame8 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <Container5 />
        <Container15 />
        <Container25 />
      </div>
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start pl-[17px] pr-px py-[17px] relative rounded-[12px] size-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Container1 />
      <Frame9 />
    </div>
  );
}