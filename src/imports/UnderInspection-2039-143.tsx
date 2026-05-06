import svgPaths from "./svg-ozo3n9rtus";

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_2039_156)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3e012060} id="Vector_2" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_2039_156">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-[rgba(59,130,246,0.1)] relative rounded-[4px] shrink-0 size-[38px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#0f172a] text-[16px] top-[-1px]">+38%</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pea6a680} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3155f180} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[63.422px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Text />
        <Icon1 />
      </div>
    </div>
  );
}

function UnderInspection1() {
  return (
    <div className="absolute content-stretch flex h-[38px] items-center justify-between left-[24px] top-[24px] w-[181px]" data-name="UnderInspection">
      <Container />
      <Container1 />
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[31.109px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[31.111px] left-0 not-italic text-[#0f172a] text-[20px] top-[-1px]">18 / 30</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] top-0">Racks Inspected</p>
    </div>
  );
}

function UnderInspection2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[55.109px] items-start left-[24px] top-[78px] w-[181px]" data-name="UnderInspection">
      <Container2 />
      <Container3 />
    </div>
  );
}

function Badge() {
  return (
    <div className="absolute bg-[rgba(37,99,235,0.1)] content-stretch flex h-[20px] items-center justify-center left-[24px] overflow-clip px-[8px] py-[2px] rounded-[6px] top-[153.11px] w-[93.031px]" data-name="Badge">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#2563eb] text-[12px]">Current cycle</p>
    </div>
  );
}

function CardContent() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[229px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <UnderInspection1 />
        <UnderInspection2 />
        <Badge />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white col-[1] content-stretch flex flex-col h-[199.109px] items-start justify-self-stretch p-px relative rounded-[12px] row-[1] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <CardContent />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_2039_147)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #2563EB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p240d7000} id="Vector_2" stroke="var(--stroke-0, #2563EB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p25499600} id="Vector_3" stroke="var(--stroke-0, #2563EB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_2039_147">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-[rgba(37,99,235,0.1)] relative rounded-[4px] shrink-0 size-[38px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#0f172a] text-[16px] top-[-1px]">+22%</p>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pea6a680} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3155f180} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[24px] relative shrink-0 w-[62.375px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Text1 />
        <Icon3 />
      </div>
    </div>
  );
}

function UnderInspection3() {
  return (
    <div className="absolute content-stretch flex h-[38px] items-center justify-between left-[24px] top-[24px] w-[181px]" data-name="UnderInspection">
      <Container4 />
      <Container5 />
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[31.109px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[31.111px] left-0 not-italic text-[#0f172a] text-[20px] top-[-1px]">60%</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] top-0">Schedule Completion</p>
    </div>
  );
}

function UnderInspection4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[55.109px] items-start left-[24px] top-[78px] w-[181px]" data-name="UnderInspection">
      <Container6 />
      <Container7 />
    </div>
  );
}

function Badge1() {
  return (
    <div className="absolute bg-[rgba(37,99,235,0.1)] content-stretch flex h-[20px] items-center justify-center left-[24px] overflow-clip px-[8px] py-[2px] rounded-[6px] top-[153.11px] w-[93.031px]" data-name="Badge">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#2563eb] text-[12px]">Current cycle</p>
    </div>
  );
}

function CardContent1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[229px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <UnderInspection3 />
        <UnderInspection4 />
        <Badge1 />
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-white col-[2] content-stretch flex flex-col h-[199.109px] items-start justify-self-stretch p-px relative rounded-[12px] row-[1] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <CardContent1 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_2039_152)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #A855F7)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 5V10L13.3333 11.6667" id="Vector_2" stroke="var(--stroke-0, #A855F7)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_2039_152">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-[rgba(168,85,247,0.1)] relative rounded-[4px] shrink-0 size-[38px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon4 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#0f172a] text-[16px] top-[-1px]">-16%</p>
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pa1bcac0} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2f7f3780} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[24px] relative shrink-0 w-[57.781px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Text2 />
        <Icon5 />
      </div>
    </div>
  );
}

function UnderInspection5() {
  return (
    <div className="absolute content-stretch flex h-[38px] items-center justify-between left-[24px] top-[24px] w-[181px]" data-name="UnderInspection">
      <Container8 />
      <Container9 />
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[31.109px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[31.111px] left-0 not-italic text-[#0f172a] text-[20px] top-[-1px]">4.2 min</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] top-0">Avg Inspection Speed</p>
    </div>
  );
}

function UnderInspection6() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[55.109px] items-start left-[24px] top-[78px] w-[181px]" data-name="UnderInspection">
      <Container10 />
      <Container11 />
    </div>
  );
}

function Badge2() {
  return (
    <div className="absolute bg-[rgba(37,99,235,0.1)] content-stretch flex h-[20px] items-center justify-center left-[24px] overflow-clip px-[8px] py-[2px] rounded-[6px] top-[153.11px] w-[55.391px]" data-name="Badge">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#2563eb] text-[12px]">Per QR</p>
    </div>
  );
}

function CardContent2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[229px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <UnderInspection5 />
        <UnderInspection6 />
        <Badge2 />
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div className="bg-white col-[3] content-stretch flex flex-col h-[199.109px] items-start justify-self-stretch p-px relative rounded-[12px] row-[1] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <CardContent2 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p26ddc800} id="Vector" stroke="var(--stroke-0, #22C55E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p35ba4680} id="Vector_2" stroke="var(--stroke-0, #22C55E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-[rgba(34,197,94,0.1)] relative rounded-[4px] shrink-0 size-[38px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon6 />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#0f172a] text-[16px] top-[-1px]">+38%</p>
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pea6a680} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3155f180} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[24px] relative shrink-0 w-[63.422px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Text3 />
        <Icon7 />
      </div>
    </div>
  );
}

function UnderInspection7() {
  return (
    <div className="absolute content-stretch flex h-[38px] items-center justify-between left-[24px] top-[24px] w-[181px]" data-name="UnderInspection">
      <Container12 />
      <Container13 />
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[31.109px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[31.111px] left-0 not-italic text-[#0f172a] text-[20px] top-[-1px]">142</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] top-0">Bays Inspected</p>
    </div>
  );
}

function UnderInspection8() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[55.109px] items-start left-[24px] top-[78px] w-[181px]" data-name="UnderInspection">
      <Container14 />
      <Container15 />
    </div>
  );
}

function Badge3() {
  return (
    <div className="absolute bg-[rgba(37,99,235,0.1)] content-stretch flex h-[20px] items-center justify-center left-[24px] overflow-clip px-[8px] py-[2px] rounded-[6px] top-[153.11px] w-[93.031px]" data-name="Badge">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#2563eb] text-[12px]">Current cycle</p>
    </div>
  );
}

function CardContent3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[229px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <UnderInspection7 />
        <UnderInspection8 />
        <Badge3 />
      </div>
    </div>
  );
}

function Card3() {
  return (
    <div className="bg-white col-[4] content-stretch flex flex-col h-[199.109px] items-start justify-self-stretch p-px relative rounded-[12px] row-[1] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <CardContent3 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1911e200} id="Vector" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 7.5V10.8333" id="Vector_2" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 14.1667H10.0083" id="Vector_3" stroke="var(--stroke-0, #EF4444)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container16() {
  return (
    <div className="bg-[rgba(239,68,68,0.1)] relative rounded-[4px] shrink-0 size-[38px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon8 />
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#0f172a] text-[16px] top-[-1px]">-12%</p>
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pa1bcac0} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2f7f3780} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[24px] relative shrink-0 w-[57.484px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Text4 />
        <Icon9 />
      </div>
    </div>
  );
}

function UnderInspection9() {
  return (
    <div className="absolute content-stretch flex h-[38px] items-center justify-between left-[24px] top-[24px] w-[181px]" data-name="UnderInspection">
      <Container16 />
      <Container17 />
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[31.109px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[31.111px] left-0 not-italic text-[#0f172a] text-[20px] top-[-1px]">26</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] top-0">Observations Logged</p>
    </div>
  );
}

function UnderInspection10() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[55.109px] items-start left-[24px] top-[78px] w-[181px]" data-name="UnderInspection">
      <Container18 />
      <Container19 />
    </div>
  );
}

function Badge4() {
  return (
    <div className="absolute bg-[rgba(37,99,235,0.1)] content-stretch flex h-[20px] items-center justify-center left-[24px] overflow-clip px-[8px] py-[2px] rounded-[6px] top-[153.11px] w-[93.031px]" data-name="Badge">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#2563eb] text-[12px]">Current cycle</p>
    </div>
  );
}

function CardContent4() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[229px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <UnderInspection9 />
        <UnderInspection10 />
        <Badge4 />
      </div>
    </div>
  );
}

function Card4() {
  return (
    <div className="bg-white col-[5] content-stretch flex flex-col h-[199.109px] items-start justify-self-stretch p-px relative rounded-[12px] row-[1] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <CardContent4 />
    </div>
  );
}

export default function UnderInspection() {
  return (
    <div className="gap-[24px] grid grid-cols-[repeat(5,_minmax(0,_1fr))] grid-rows-[repeat(1,_minmax(0,_1fr))] relative size-full" data-name="UnderInspection">
      <Card />
      <Card1 />
      <Card2 />
      <Card3 />
      <Card4 />
    </div>
  );
}