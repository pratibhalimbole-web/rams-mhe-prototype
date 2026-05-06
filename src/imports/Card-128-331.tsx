function Heading() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#111827] text-[16px] text-nowrap top-0">Assignment Summary</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[21px] relative shrink-0 w-[171.125px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Heading />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function AssignmentSummaryDemo() {
  return (
    <div className="h-[21px] relative shrink-0 w-[301px]" data-name="AssignmentSummaryDemo">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Container />
        <div className="flex items-center justify-center relative shrink-0">
          <div className="flex-none rotate-[180deg]">
            <Icon />
          </div>
        </div>
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="absolute content-stretch flex h-[15px] items-start left-0 top-[6px] w-[117.406px]" data-name="Label">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">Inspectors Assigned</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[18px] left-0 top-[26px] w-[301px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[12px] text-nowrap top-0">{`4 `}</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="Container">
      <Label />
      <Paragraph />
    </div>
  );
}

function Label1() {
  return (
    <div className="absolute content-stretch flex h-[15px] items-start left-0 top-[6px] w-[98.438px]" data-name="Label">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">Layouts Selected</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[18px] left-0 top-[26px] w-[301px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[12px] text-nowrap top-0">3 layouts selected</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="Container">
      <Label1 />
      <Paragraph1 />
    </div>
  );
}

function Label2() {
  return (
    <div className="absolute content-stretch flex h-[15px] items-start left-0 top-[6px] w-[88.063px]" data-name="Label">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">Racks Selected</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[18px] left-0 top-[26px] w-[301px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[12px] text-nowrap top-0">100 racks selected (total)</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="Container">
      <Label2 />
      <Paragraph2 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Container1 />
      <Container2 />
      <Container3 />
    </div>
  );
}

function Container5() {
  return <div className="bg-[#e5e7eb] h-px opacity-60 shrink-0 w-full" data-name="Container" />;
}

function Text() {
  return (
    <div className="h-[15px] relative shrink-0 w-[12.219px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[0.11px] not-italic text-[#1b59f8] text-[10px] text-nowrap top-[-2.45px]">JS</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-[#eef5ff] relative rounded-[12px] shrink-0 size-[24px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Text />
      </div>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="content-stretch flex h-[15.594px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="basis-0 font-['Inter:Medium',sans-serif] font-medium grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[#0a0a0a] text-[12px]">Jack Smith</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[14.297px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[0px] text-[10px] text-[rgba(32,32,32,0.6)] text-nowrap top-0">
        <span>{`2 layouts · 50 racks · 150 bays `}</span>
        <span>{`· `}</span>8h/day
      </p>
    </div>
  );
}

function Container7() {
  return (
    <div className="basis-0 grow h-[31.891px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Paragraph3 />
        <Paragraph4 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex gap-[12px] h-[31.891px] items-center relative shrink-0 w-full" data-name="Container">
      <Container6 />
      <Container7 />
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-white h-[53.891px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start pb-px pt-[11px] px-[11px] relative size-full">
        <Container8 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[15px] relative shrink-0 w-[15.781px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[-0.11px] not-italic text-[#1b59f8] text-[10px] text-nowrap top-[-2.34px]">JW</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-[#eef5ff] relative rounded-[12px] shrink-0 size-[24px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Text1 />
      </div>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="content-stretch flex h-[15.594px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="basis-0 font-['Inter:Medium',sans-serif] font-medium grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[#0a0a0a] text-[12px]">James Wilson</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[14.297px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] text-nowrap top-0">2 layouts · 50 racks · 150 bays · 8h/day</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="basis-0 grow h-[31.891px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Paragraph5 />
        <Paragraph6 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex gap-[12px] h-[31.891px] items-center relative shrink-0 w-full" data-name="Container">
      <Container10 />
      <Container11 />
    </div>
  );
}

function Container13() {
  return (
    <div className="bg-white h-[53.891px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start pb-px pt-[11px] px-[11px] relative size-full">
        <Container12 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[15px] relative shrink-0 w-[14.891px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[-0.55px] not-italic text-[#1b59f8] text-[10px] text-nowrap top-[-3.23px]">JM</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="bg-[#eef5ff] relative rounded-[12px] shrink-0 size-[24px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pl-0 pr-[0.016px] py-0 relative size-full">
        <Text2 />
      </div>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="content-stretch flex h-[15.594px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="basis-0 font-['Inter:Medium',sans-serif] font-medium grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[#0a0a0a] text-[12px]">Josh Martinez</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[14.297px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] text-nowrap top-0">2 layouts · 50 racks · 150 bays · 8h/day</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="basis-0 grow h-[31.891px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Paragraph7 />
        <Paragraph8 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex gap-[12px] h-[31.891px] items-center relative shrink-0 w-full" data-name="Container">
      <Container14 />
      <Container15 />
    </div>
  );
}

function Container17() {
  return (
    <div className="bg-white h-[53.891px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start pb-px pt-[11px] px-[11px] relative size-full">
        <Container16 />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[15px] relative shrink-0 w-[13.094px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[-0.45px] not-italic text-[#1b59f8] text-[10px] text-nowrap top-[-3.12px]">JC</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="bg-[#eef5ff] relative rounded-[12px] shrink-0 size-[24px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Text3 />
      </div>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="content-stretch flex h-[15.594px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="basis-0 font-['Inter:Medium',sans-serif] font-medium grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[#0a0a0a] text-[12px]">Joseph Chen</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[14.297px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[10px] text-[rgba(32,32,32,0.6)] text-nowrap top-0">2 layouts · 50 racks · 150 bays · 8h/day</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="basis-0 grow h-[31.891px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Paragraph9 />
        <Paragraph10 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex gap-[12px] h-[31.891px] items-center relative shrink-0 w-full" data-name="Container">
      <Container18 />
      <Container19 />
    </div>
  );
}

function Container21() {
  return (
    <div className="bg-white h-[53.891px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start pb-px pt-[11px] px-[11px] relative size-full">
        <Container20 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[251.563px] items-start relative shrink-0 w-full" data-name="Container">
      <Container9 />
      <Container13 />
      <Container17 />
      <Container21 />
    </div>
  );
}

function AssignmentSummaryDemo1() {
  return (
    <div className="relative shrink-0 w-[301px]" data-name="AssignmentSummaryDemo">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative w-full">
        <Container4 />
        <Container5 />
        <Container22 />
      </div>
    </div>
  );
}

function Scrollbar() {
  return <div className="absolute bg-[#e2e8f0] h-[457px] left-[330px] rounded-[9999px] top-[72px] w-[6px]" data-name="Scrollbar" />;
}

export default function Card() {
  return (
    <div className="bg-white relative rounded-[8px] size-full" data-name="Card">
      <div className="content-stretch flex flex-col gap-[24px] items-start overflow-clip pl-[21px] pr-px py-[21px] relative rounded-[inherit] size-full">
        <AssignmentSummaryDemo />
        <AssignmentSummaryDemo1 />
        <Scrollbar />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}