import svgPaths from "./svg-g2h12i34cc";

function Heading() {
  return (
    <div className="h-[33.594px] relative shrink-0 w-[185.156px]" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[33.6px] left-0 not-italic text-[#0f172a] text-[24px] top-[-1px] tracking-[-0.6px]">Rules and Action</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[1266px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pr-[1080.844px] relative size-full">
        <Heading />
      </div>
    </div>
  );
}

function BreadcrumbLink() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="BreadcrumbLink">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] top-0">Rack</p>
      </div>
    </div>
  );
}

function BreadcrumbItem() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-center left-0 top-0 w-[32.281px]" data-name="BreadcrumbItem">
      <BreadcrumbLink />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-0 size-[14px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M5.25 10.5L8.75 7L5.25 3.5" id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function BreadcrumbSeparator() {
  return (
    <div className="absolute left-[42.28px] size-[14px] top-[3px]" data-name="BreadcrumbSeparator">
      <Icon />
    </div>
  );
}

function BreadcrumbLink1() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="BreadcrumbLink">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] top-0">Integrated Rack Diagnostic Suite</p>
      </div>
    </div>
  );
}

function BreadcrumbItem1() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-center left-[66.28px] top-0 w-[216.094px]" data-name="BreadcrumbItem">
      <BreadcrumbLink1 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-0 size-[14px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M5.25 10.5L8.75 7L5.25 3.5" id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function BreadcrumbSeparator1() {
  return (
    <div className="absolute left-[292.38px] size-[14px] top-[3px]" data-name="BreadcrumbSeparator">
      <Icon1 />
    </div>
  );
}

function BreadcrumbPage() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="BreadcrumbPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">Rules and Action</p>
      </div>
    </div>
  );
}

function BreadcrumbItem2() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-center left-[316.38px] top-0 w-[110.781px]" data-name="BreadcrumbItem">
      <BreadcrumbPage />
    </div>
  );
}

function BreadcrumbList() {
  return (
    <div className="h-[20px] relative shrink-0 w-[1266px]" data-name="BreadcrumbList">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <BreadcrumbItem />
        <BreadcrumbSeparator />
        <BreadcrumbItem1 />
        <BreadcrumbSeparator1 />
        <BreadcrumbItem2 />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="bg-white h-[94.594px] relative shrink-0 w-[1314px]" data-name="Header">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start pb-[17px] pl-[24px] pt-[16px] relative size-full">
        <Container1 />
        <BreadcrumbList />
      </div>
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="bg-white flex-[1_0_0] h-[27px] min-h-px min-w-px relative rounded-[3px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[3px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[17px] py-[9px] relative size-full">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#0f172a] text-[14px] text-center">Inspection</p>
        </div>
      </div>
    </div>
  );
}

function PrimitiveButton1() {
  return (
    <div className="bg-[rgba(255,255,255,0)] flex-[1_0_0] h-[27px] min-h-px min-w-px relative rounded-[3px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[3px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[17px] py-[9px] relative size-full">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#0f172a] text-[14px] text-center">Testing</p>
        </div>
      </div>
    </div>
  );
}

function PrimitiveDiv1() {
  return (
    <div className="bg-[#f1f5f9] h-[36px] relative rounded-[6px] shrink-0 w-[195.359px]" data-name="Primitive.div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <PrimitiveButton />
        <PrimitiveButton1 />
      </div>
    </div>
  );
}

function RulesAndAction1() {
  return (
    <div className="h-[36px] relative shrink-0 w-[1266px]" data-name="RulesAndAction">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pr-[1070.641px] relative size-full">
        <PrimitiveDiv1 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#2563eb] h-[36px] left-[1048.86px] rounded-[6px] top-0 w-[167.141px]" data-name="Button">
      <Icon2 />
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[96px] not-italic text-[14px] text-center text-white top-[8px]">Add New Element</p>
    </div>
  );
}

function Input() {
  return (
    <div className="absolute bg-white h-[36px] left-0 rounded-[6px] top-0 w-[350px]" data-name="Input">
      <div className="content-stretch flex items-center overflow-clip pl-[36px] pr-[12px] py-[4px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[14px]">Search inspections...</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p107a080} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14 14L11.1333 11.1333" id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[36px] left-0 top-0 w-[350px]" data-name="Container">
      <Input />
      <Icon3 />
    </div>
  );
}

function RulesAndAction2() {
  return (
    <div className="absolute h-[36px] left-[25px] top-[25px] w-[1216px]" data-name="RulesAndAction">
      <Button />
      <Container3 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-[99.11px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pcaa3f40} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M11.3333 13.3333V2.66667" id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p216cf1e0} id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4.66667 2.66667V13.3333" id="Vector_4" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute h-[32px] left-[12px] rounded-[6px] top-[7.75px] w-[127.109px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[17.143px] left-[48px] not-italic text-[#64748b] text-[12px] text-center top-[7.44px] uppercase">Element ID</p>
      <Icon4 />
    </div>
  );
}

function TableHead() {
  return (
    <div className="absolute h-[48px] left-0 top-0 w-[282.266px]" data-name="TableHead">
      <Button1 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute left-[122.58px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pcaa3f40} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M11.3333 13.3333V2.66667" id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p216cf1e0} id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4.66667 2.66667V13.3333" id="Vector_4" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute h-[32px] left-[12px] rounded-[6px] top-[7.75px] w-[150.578px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[17.143px] left-[59.5px] not-italic text-[#64748b] text-[12px] text-center top-[7.44px] uppercase">Element Name</p>
      <Icon5 />
    </div>
  );
}

function TableHead1() {
  return (
    <div className="absolute h-[48px] left-[282.27px] top-0 w-[322.875px]" data-name="TableHead">
      <Button2 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="absolute left-[93.03px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pcaa3f40} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M11.3333 13.3333V2.66667" id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p216cf1e0} id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4.66667 2.66667V13.3333" id="Vector_4" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute h-[32px] left-[12px] rounded-[6px] top-[7.75px] w-[121.031px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[17.143px] left-[45px] not-italic text-[#64748b] text-[12px] text-center top-[7.44px] uppercase">Category</p>
      <Icon6 />
    </div>
  );
}

function TableHead2() {
  return (
    <div className="absolute h-[48px] left-[605.14px] top-0 w-[271.734px]" data-name="TableHead">
      <Button3 />
    </div>
  );
}

function Header1() {
  return (
    <div className="absolute h-[17.141px] left-[24px] top-[15.17px] w-[200.656px]" data-name="header">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[17.143px] left-0 not-italic text-[#64748b] text-[12px] top-0 uppercase">Status</p>
    </div>
  );
}

function TableHead3() {
  return (
    <div className="absolute h-[48px] left-[876.88px] top-0 w-[248.656px]" data-name="TableHead">
      <Header1 />
    </div>
  );
}

function TableHead4() {
  return <div className="absolute h-[48px] left-[1125.53px] top-0 w-[138.469px]" data-name="TableHead" />;
}

function TableRow() {
  return (
    <div className="absolute border-[#e2e8f0] border-b border-solid h-[48px] left-0 top-0 w-[1264px]" data-name="TableRow">
      <TableHead />
      <TableHead1 />
      <TableHead2 />
      <TableHead3 />
      <TableHead4 />
    </div>
  );
}

function TableHeader() {
  return (
    <div className="absolute h-[48px] left-0 top-0 w-[1264px]" data-name="TableHeader">
      <TableRow />
    </div>
  );
}

function Cell() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[14.5px] w-[234.266px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">BOQ-APR25-100</p>
    </div>
  );
}

function TableCell() {
  return (
    <div className="absolute h-[49px] left-0 top-0 w-[282.266px]" data-name="TableCell">
      <Cell />
    </div>
  );
}

function Cell1() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[14.5px] w-[274.875px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">Baseplate</p>
    </div>
  );
}

function TableCell1() {
  return (
    <div className="absolute h-[49px] left-[282.27px] top-0 w-[322.875px]" data-name="TableCell">
      <Cell1 />
    </div>
  );
}

function Badge() {
  return (
    <div className="absolute bg-[rgba(168,85,247,0.15)] content-stretch flex h-[20px] items-center justify-center left-[24px] overflow-clip px-[8px] py-[2px] rounded-[6px] top-[15px] w-[72.719px]" data-name="Badge">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#a855f7] text-[12px]">Structural</p>
    </div>
  );
}

function TableCell2() {
  return (
    <div className="absolute h-[49px] left-[605.14px] top-0 w-[271.734px]" data-name="TableCell">
      <Badge />
    </div>
  );
}

function PrimitiveSpan() {
  return <div className="bg-white rounded-[33554400px] shrink-0 size-[16px]" data-name="Primitive.span" />;
}

function PrimitiveButton2() {
  return (
    <div className="bg-[#f1f5f9] h-[18.391px] relative rounded-[33554400px] shrink-0 w-[32px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center p-px relative size-full">
        <PrimitiveSpan />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[51.688px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] top-0">Inactive</p>
      </div>
    </div>
  );
}

function Cell2() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[20px] items-center left-[24px] top-[14.5px] w-[200.656px]" data-name="cell">
      <PrimitiveButton2 />
      <Text />
    </div>
  );
}

function TableCell3() {
  return (
    <div className="absolute h-[49px] left-[876.88px] top-0 w-[248.656px]" data-name="TableCell">
      <Cell2 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[8px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p36e45a00} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a14b300} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2295f880} id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute left-[24px] rounded-[6px] size-[32px] top-[8.5px]" data-name="Button">
      <Icon7 />
    </div>
  );
}

function TableCell4() {
  return (
    <div className="absolute h-[49px] left-[1125.53px] top-0 w-[138.469px]" data-name="TableCell">
      <Button4 />
    </div>
  );
}

function TableRow1() {
  return (
    <div className="absolute border-[#e2e8f0] border-b border-solid h-[49px] left-0 top-0 w-[1264px]" data-name="TableRow">
      <TableCell />
      <TableCell1 />
      <TableCell2 />
      <TableCell3 />
      <TableCell4 />
    </div>
  );
}

function Cell3() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[14.5px] w-[234.266px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">BOQ-APR25-101</p>
    </div>
  );
}

function TableCell5() {
  return (
    <div className="absolute h-[49px] left-0 top-0 w-[282.266px]" data-name="TableCell">
      <Cell3 />
    </div>
  );
}

function Cell4() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[14.5px] w-[274.875px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">Upright</p>
    </div>
  );
}

function TableCell6() {
  return (
    <div className="absolute h-[49px] left-[282.27px] top-0 w-[322.875px]" data-name="TableCell">
      <Cell4 />
    </div>
  );
}

function Badge1() {
  return (
    <div className="absolute bg-[rgba(34,197,94,0.15)] content-stretch flex h-[20px] items-center justify-center left-[24px] overflow-clip px-[8px] py-[2px] rounded-[6px] top-[15px] w-[60.625px]" data-name="Badge">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#22c55e] text-[12px]">General</p>
    </div>
  );
}

function TableCell7() {
  return (
    <div className="absolute h-[49px] left-[605.14px] top-0 w-[271.734px]" data-name="TableCell">
      <Badge1 />
    </div>
  );
}

function PrimitiveSpan1() {
  return <div className="bg-white rounded-[33554400px] shrink-0 size-[16px]" data-name="Primitive.span" />;
}

function PrimitiveButton3() {
  return (
    <div className="bg-[#2563eb] h-[18.391px] relative rounded-[33554400px] shrink-0 w-[32px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pl-[15px] pr-px py-px relative size-full">
        <PrimitiveSpan1 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[41.375px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">Active</p>
      </div>
    </div>
  );
}

function Cell5() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[20px] items-center left-[24px] top-[14.5px] w-[200.656px]" data-name="cell">
      <PrimitiveButton3 />
      <Text1 />
    </div>
  );
}

function TableCell8() {
  return (
    <div className="absolute h-[49px] left-[876.88px] top-0 w-[248.656px]" data-name="TableCell">
      <Cell5 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute left-[8px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p36e45a00} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a14b300} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2295f880} id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute left-[24px] rounded-[6px] size-[32px] top-[8.5px]" data-name="Button">
      <Icon8 />
    </div>
  );
}

function TableCell9() {
  return (
    <div className="absolute h-[49px] left-[1125.53px] top-0 w-[138.469px]" data-name="TableCell">
      <Button5 />
    </div>
  );
}

function TableRow2() {
  return (
    <div className="absolute border-[#e2e8f0] border-b border-solid h-[49px] left-0 top-[49px] w-[1264px]" data-name="TableRow">
      <TableCell5 />
      <TableCell6 />
      <TableCell7 />
      <TableCell8 />
      <TableCell9 />
    </div>
  );
}

function Cell6() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[14.5px] w-[234.266px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">BOQ-APR25-102</p>
    </div>
  );
}

function TableCell10() {
  return (
    <div className="absolute h-[49px] left-0 top-0 w-[282.266px]" data-name="TableCell">
      <Cell6 />
    </div>
  );
}

function Cell7() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[14.5px] w-[274.875px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">Beam</p>
    </div>
  );
}

function TableCell11() {
  return (
    <div className="absolute h-[49px] left-[282.27px] top-0 w-[322.875px]" data-name="TableCell">
      <Cell7 />
    </div>
  );
}

function Badge2() {
  return (
    <div className="absolute bg-[rgba(168,85,247,0.15)] content-stretch flex h-[20px] items-center justify-center left-[24px] overflow-clip px-[8px] py-[2px] rounded-[6px] top-[15px] w-[72.719px]" data-name="Badge">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#a855f7] text-[12px]">Structural</p>
    </div>
  );
}

function TableCell12() {
  return (
    <div className="absolute h-[49px] left-[605.14px] top-0 w-[271.734px]" data-name="TableCell">
      <Badge2 />
    </div>
  );
}

function PrimitiveSpan2() {
  return <div className="bg-white rounded-[33554400px] shrink-0 size-[16px]" data-name="Primitive.span" />;
}

function PrimitiveButton4() {
  return (
    <div className="bg-[#2563eb] h-[18.391px] relative rounded-[33554400px] shrink-0 w-[32px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pl-[15px] pr-px py-px relative size-full">
        <PrimitiveSpan2 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[41.375px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">Active</p>
      </div>
    </div>
  );
}

function Cell8() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[20px] items-center left-[24px] top-[14.5px] w-[200.656px]" data-name="cell">
      <PrimitiveButton4 />
      <Text2 />
    </div>
  );
}

function TableCell13() {
  return (
    <div className="absolute h-[49px] left-[876.88px] top-0 w-[248.656px]" data-name="TableCell">
      <Cell8 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-[8px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p36e45a00} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a14b300} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2295f880} id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute left-[24px] rounded-[6px] size-[32px] top-[8.5px]" data-name="Button">
      <Icon9 />
    </div>
  );
}

function TableCell14() {
  return (
    <div className="absolute h-[49px] left-[1125.53px] top-0 w-[138.469px]" data-name="TableCell">
      <Button6 />
    </div>
  );
}

function TableRow3() {
  return (
    <div className="absolute border-[#e2e8f0] border-b border-solid h-[49px] left-0 top-[98px] w-[1264px]" data-name="TableRow">
      <TableCell10 />
      <TableCell11 />
      <TableCell12 />
      <TableCell13 />
      <TableCell14 />
    </div>
  );
}

function Cell9() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[14.5px] w-[234.266px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">BOQ-APR25-103</p>
    </div>
  );
}

function TableCell15() {
  return (
    <div className="absolute h-[49px] left-0 top-0 w-[282.266px]" data-name="TableCell">
      <Cell9 />
    </div>
  );
}

function Cell10() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[14.5px] w-[274.875px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">Bracing</p>
    </div>
  );
}

function TableCell16() {
  return (
    <div className="absolute h-[49px] left-[282.27px] top-0 w-[322.875px]" data-name="TableCell">
      <Cell10 />
    </div>
  );
}

function Badge3() {
  return (
    <div className="absolute bg-[rgba(34,197,94,0.15)] content-stretch flex h-[20px] items-center justify-center left-[24px] overflow-clip px-[8px] py-[2px] rounded-[6px] top-[15px] w-[60.625px]" data-name="Badge">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#22c55e] text-[12px]">General</p>
    </div>
  );
}

function TableCell17() {
  return (
    <div className="absolute h-[49px] left-[605.14px] top-0 w-[271.734px]" data-name="TableCell">
      <Badge3 />
    </div>
  );
}

function PrimitiveSpan3() {
  return <div className="bg-white rounded-[33554400px] shrink-0 size-[16px]" data-name="Primitive.span" />;
}

function PrimitiveButton5() {
  return (
    <div className="bg-[#2563eb] h-[18.391px] relative rounded-[33554400px] shrink-0 w-[32px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pl-[15px] pr-px py-px relative size-full">
        <PrimitiveSpan3 />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[41.375px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">Active</p>
      </div>
    </div>
  );
}

function Cell11() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[20px] items-center left-[24px] top-[14.5px] w-[200.656px]" data-name="cell">
      <PrimitiveButton5 />
      <Text3 />
    </div>
  );
}

function TableCell18() {
  return (
    <div className="absolute h-[49px] left-[876.88px] top-0 w-[248.656px]" data-name="TableCell">
      <Cell11 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute left-[8px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p36e45a00} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a14b300} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2295f880} id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute left-[24px] rounded-[6px] size-[32px] top-[8.5px]" data-name="Button">
      <Icon10 />
    </div>
  );
}

function TableCell19() {
  return (
    <div className="absolute h-[49px] left-[1125.53px] top-0 w-[138.469px]" data-name="TableCell">
      <Button7 />
    </div>
  );
}

function TableRow4() {
  return (
    <div className="absolute border-[#e2e8f0] border-b border-solid h-[49px] left-0 top-[147px] w-[1264px]" data-name="TableRow">
      <TableCell15 />
      <TableCell16 />
      <TableCell17 />
      <TableCell18 />
      <TableCell19 />
    </div>
  );
}

function Cell12() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[14.5px] w-[234.266px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">BOQ-APR25-104</p>
    </div>
  );
}

function TableCell20() {
  return (
    <div className="absolute h-[49px] left-0 top-0 w-[282.266px]" data-name="TableCell">
      <Cell12 />
    </div>
  );
}

function Cell13() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[14.5px] w-[274.875px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">Unitstopper</p>
    </div>
  );
}

function TableCell21() {
  return (
    <div className="absolute h-[49px] left-[282.27px] top-0 w-[322.875px]" data-name="TableCell">
      <Cell13 />
    </div>
  );
}

function Badge4() {
  return (
    <div className="absolute bg-[rgba(168,85,247,0.15)] content-stretch flex h-[20px] items-center justify-center left-[24px] overflow-clip px-[8px] py-[2px] rounded-[6px] top-[15px] w-[72.719px]" data-name="Badge">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#a855f7] text-[12px]">Structural</p>
    </div>
  );
}

function TableCell22() {
  return (
    <div className="absolute h-[49px] left-[605.14px] top-0 w-[271.734px]" data-name="TableCell">
      <Badge4 />
    </div>
  );
}

function PrimitiveSpan4() {
  return <div className="bg-white rounded-[33554400px] shrink-0 size-[16px]" data-name="Primitive.span" />;
}

function PrimitiveButton6() {
  return (
    <div className="bg-[#2563eb] h-[18.391px] relative rounded-[33554400px] shrink-0 w-[32px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pl-[15px] pr-px py-px relative size-full">
        <PrimitiveSpan4 />
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[41.375px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">Active</p>
      </div>
    </div>
  );
}

function Cell14() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[20px] items-center left-[24px] top-[14.5px] w-[200.656px]" data-name="cell">
      <PrimitiveButton6 />
      <Text4 />
    </div>
  );
}

function TableCell23() {
  return (
    <div className="absolute h-[49px] left-[876.88px] top-0 w-[248.656px]" data-name="TableCell">
      <Cell14 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-[8px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p36e45a00} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a14b300} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2295f880} id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute left-[24px] rounded-[6px] size-[32px] top-[8.5px]" data-name="Button">
      <Icon11 />
    </div>
  );
}

function TableCell24() {
  return (
    <div className="absolute h-[49px] left-[1125.53px] top-0 w-[138.469px]" data-name="TableCell">
      <Button8 />
    </div>
  );
}

function TableRow5() {
  return (
    <div className="absolute border-[#e2e8f0] border-b border-solid h-[49px] left-0 top-[196px] w-[1264px]" data-name="TableRow">
      <TableCell20 />
      <TableCell21 />
      <TableCell22 />
      <TableCell23 />
      <TableCell24 />
    </div>
  );
}

function Cell15() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[14.5px] w-[234.266px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">BOQ-APR25-105</p>
    </div>
  );
}

function TableCell25() {
  return (
    <div className="absolute h-[49px] left-0 top-0 w-[282.266px]" data-name="TableCell">
      <Cell15 />
    </div>
  );
}

function Cell16() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[14.5px] w-[274.875px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">Runspacer</p>
    </div>
  );
}

function TableCell26() {
  return (
    <div className="absolute h-[49px] left-[282.27px] top-0 w-[322.875px]" data-name="TableCell">
      <Cell16 />
    </div>
  );
}

function Badge5() {
  return (
    <div className="absolute bg-[rgba(34,197,94,0.15)] content-stretch flex h-[20px] items-center justify-center left-[24px] overflow-clip px-[8px] py-[2px] rounded-[6px] top-[15px] w-[60.625px]" data-name="Badge">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#22c55e] text-[12px]">General</p>
    </div>
  );
}

function TableCell27() {
  return (
    <div className="absolute h-[49px] left-[605.14px] top-0 w-[271.734px]" data-name="TableCell">
      <Badge5 />
    </div>
  );
}

function PrimitiveSpan5() {
  return <div className="bg-white rounded-[33554400px] shrink-0 size-[16px]" data-name="Primitive.span" />;
}

function PrimitiveButton7() {
  return (
    <div className="bg-[#f1f5f9] h-[18.391px] relative rounded-[33554400px] shrink-0 w-[32px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center p-px relative size-full">
        <PrimitiveSpan5 />
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[51.688px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] top-0">Inactive</p>
      </div>
    </div>
  );
}

function Cell17() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[20px] items-center left-[24px] top-[14.5px] w-[200.656px]" data-name="cell">
      <PrimitiveButton7 />
      <Text5 />
    </div>
  );
}

function TableCell28() {
  return (
    <div className="absolute h-[49px] left-[876.88px] top-0 w-[248.656px]" data-name="TableCell">
      <Cell17 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="absolute left-[8px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p36e45a00} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a14b300} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2295f880} id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute left-[24px] rounded-[6px] size-[32px] top-[8.5px]" data-name="Button">
      <Icon12 />
    </div>
  );
}

function TableCell29() {
  return (
    <div className="absolute h-[49px] left-[1125.53px] top-0 w-[138.469px]" data-name="TableCell">
      <Button9 />
    </div>
  );
}

function TableRow6() {
  return (
    <div className="absolute border-[#e2e8f0] border-b border-solid h-[49px] left-0 top-[245px] w-[1264px]" data-name="TableRow">
      <TableCell25 />
      <TableCell26 />
      <TableCell27 />
      <TableCell28 />
      <TableCell29 />
    </div>
  );
}

function Cell18() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[14.5px] w-[234.266px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">BOQ-APR25-106</p>
    </div>
  );
}

function TableCell30() {
  return (
    <div className="absolute h-[49px] left-0 top-0 w-[282.266px]" data-name="TableCell">
      <Cell18 />
    </div>
  );
}

function Cell19() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[14.5px] w-[274.875px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">Tiebeam</p>
    </div>
  );
}

function TableCell31() {
  return (
    <div className="absolute h-[49px] left-[282.27px] top-0 w-[322.875px]" data-name="TableCell">
      <Cell19 />
    </div>
  );
}

function Badge6() {
  return (
    <div className="absolute bg-[rgba(168,85,247,0.15)] content-stretch flex h-[20px] items-center justify-center left-[24px] overflow-clip px-[8px] py-[2px] rounded-[6px] top-[15px] w-[72.719px]" data-name="Badge">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#a855f7] text-[12px]">Structural</p>
    </div>
  );
}

function TableCell32() {
  return (
    <div className="absolute h-[49px] left-[605.14px] top-0 w-[271.734px]" data-name="TableCell">
      <Badge6 />
    </div>
  );
}

function PrimitiveSpan6() {
  return <div className="bg-white rounded-[33554400px] shrink-0 size-[16px]" data-name="Primitive.span" />;
}

function PrimitiveButton8() {
  return (
    <div className="bg-[#2563eb] h-[18.391px] relative rounded-[33554400px] shrink-0 w-[32px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pl-[15px] pr-px py-px relative size-full">
        <PrimitiveSpan6 />
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[41.375px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">Active</p>
      </div>
    </div>
  );
}

function Cell20() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[20px] items-center left-[24px] top-[14.5px] w-[200.656px]" data-name="cell">
      <PrimitiveButton8 />
      <Text6 />
    </div>
  );
}

function TableCell33() {
  return (
    <div className="absolute h-[49px] left-[876.88px] top-0 w-[248.656px]" data-name="TableCell">
      <Cell20 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="absolute left-[8px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p36e45a00} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a14b300} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2295f880} id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute left-[24px] rounded-[6px] size-[32px] top-[8.5px]" data-name="Button">
      <Icon13 />
    </div>
  );
}

function TableCell34() {
  return (
    <div className="absolute h-[49px] left-[1125.53px] top-0 w-[138.469px]" data-name="TableCell">
      <Button10 />
    </div>
  );
}

function TableRow7() {
  return (
    <div className="absolute border-[#e2e8f0] border-b border-solid h-[49px] left-0 top-[294px] w-[1264px]" data-name="TableRow">
      <TableCell30 />
      <TableCell31 />
      <TableCell32 />
      <TableCell33 />
      <TableCell34 />
    </div>
  );
}

function Cell21() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[14.5px] w-[234.266px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">BOQ-APR25-107</p>
    </div>
  );
}

function TableCell35() {
  return (
    <div className="absolute h-[49px] left-0 top-0 w-[282.266px]" data-name="TableCell">
      <Cell21 />
    </div>
  );
}

function Cell22() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[14.5px] w-[274.875px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">Pallet</p>
    </div>
  );
}

function TableCell36() {
  return (
    <div className="absolute h-[49px] left-[282.27px] top-0 w-[322.875px]" data-name="TableCell">
      <Cell22 />
    </div>
  );
}

function Badge7() {
  return (
    <div className="absolute bg-[rgba(34,197,94,0.15)] content-stretch flex h-[20px] items-center justify-center left-[24px] overflow-clip px-[8px] py-[2px] rounded-[6px] top-[15px] w-[60.625px]" data-name="Badge">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#22c55e] text-[12px]">General</p>
    </div>
  );
}

function TableCell37() {
  return (
    <div className="absolute h-[49px] left-[605.14px] top-0 w-[271.734px]" data-name="TableCell">
      <Badge7 />
    </div>
  );
}

function PrimitiveSpan7() {
  return <div className="bg-white rounded-[33554400px] shrink-0 size-[16px]" data-name="Primitive.span" />;
}

function PrimitiveButton9() {
  return (
    <div className="bg-[#2563eb] h-[18.391px] relative rounded-[33554400px] shrink-0 w-[32px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pl-[15px] pr-px py-px relative size-full">
        <PrimitiveSpan7 />
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[20px] relative shrink-0 w-[41.375px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">Active</p>
      </div>
    </div>
  );
}

function Cell23() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[20px] items-center left-[24px] top-[14.5px] w-[200.656px]" data-name="cell">
      <PrimitiveButton9 />
      <Text7 />
    </div>
  );
}

function TableCell38() {
  return (
    <div className="absolute h-[49px] left-[876.88px] top-0 w-[248.656px]" data-name="TableCell">
      <Cell23 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="absolute left-[8px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p36e45a00} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a14b300} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2295f880} id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute left-[24px] rounded-[6px] size-[32px] top-[8.5px]" data-name="Button">
      <Icon14 />
    </div>
  );
}

function TableCell39() {
  return (
    <div className="absolute h-[49px] left-[1125.53px] top-0 w-[138.469px]" data-name="TableCell">
      <Button11 />
    </div>
  );
}

function TableRow8() {
  return (
    <div className="absolute border-[#e2e8f0] border-b border-solid h-[49px] left-0 top-[343px] w-[1264px]" data-name="TableRow">
      <TableCell35 />
      <TableCell36 />
      <TableCell37 />
      <TableCell38 />
      <TableCell39 />
    </div>
  );
}

function Cell24() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[14.5px] w-[234.266px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">BOQ-APR25-108</p>
    </div>
  );
}

function TableCell40() {
  return (
    <div className="absolute h-[49px] left-0 top-0 w-[282.266px]" data-name="TableCell">
      <Cell24 />
    </div>
  );
}

function Cell25() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[14.5px] w-[274.875px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">Safety Accessory</p>
    </div>
  );
}

function TableCell41() {
  return (
    <div className="absolute h-[49px] left-[282.27px] top-0 w-[322.875px]" data-name="TableCell">
      <Cell25 />
    </div>
  );
}

function Badge8() {
  return (
    <div className="absolute bg-[rgba(168,85,247,0.15)] content-stretch flex h-[20px] items-center justify-center left-[24px] overflow-clip px-[8px] py-[2px] rounded-[6px] top-[15px] w-[72.719px]" data-name="Badge">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#a855f7] text-[12px]">Structural</p>
    </div>
  );
}

function TableCell42() {
  return (
    <div className="absolute h-[49px] left-[605.14px] top-0 w-[271.734px]" data-name="TableCell">
      <Badge8 />
    </div>
  );
}

function PrimitiveSpan8() {
  return <div className="bg-white rounded-[33554400px] shrink-0 size-[16px]" data-name="Primitive.span" />;
}

function PrimitiveButton10() {
  return (
    <div className="bg-[#2563eb] h-[18.391px] relative rounded-[33554400px] shrink-0 w-[32px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pl-[15px] pr-px py-px relative size-full">
        <PrimitiveSpan8 />
      </div>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[20px] relative shrink-0 w-[41.375px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">Active</p>
      </div>
    </div>
  );
}

function Cell26() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[20px] items-center left-[24px] top-[14.5px] w-[200.656px]" data-name="cell">
      <PrimitiveButton10 />
      <Text8 />
    </div>
  );
}

function TableCell43() {
  return (
    <div className="absolute h-[49px] left-[876.88px] top-0 w-[248.656px]" data-name="TableCell">
      <Cell26 />
    </div>
  );
}

function Icon15() {
  return (
    <div className="absolute left-[8px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p36e45a00} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a14b300} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2295f880} id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute left-[24px] rounded-[6px] size-[32px] top-[8.5px]" data-name="Button">
      <Icon15 />
    </div>
  );
}

function TableCell44() {
  return (
    <div className="absolute h-[49px] left-[1125.53px] top-0 w-[138.469px]" data-name="TableCell">
      <Button12 />
    </div>
  );
}

function TableRow9() {
  return (
    <div className="absolute border-[#e2e8f0] border-b border-solid h-[49px] left-0 top-[392px] w-[1264px]" data-name="TableRow">
      <TableCell40 />
      <TableCell41 />
      <TableCell42 />
      <TableCell43 />
      <TableCell44 />
    </div>
  );
}

function Cell27() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[14.5px] w-[234.266px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">BOQ-APR25-109</p>
    </div>
  );
}

function TableCell45() {
  return (
    <div className="absolute h-[48.5px] left-0 top-0 w-[282.266px]" data-name="TableCell">
      <Cell27 />
    </div>
  );
}

function Cell28() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[14.5px] w-[274.875px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">Baseplate</p>
    </div>
  );
}

function TableCell46() {
  return (
    <div className="absolute h-[48.5px] left-[282.27px] top-0 w-[322.875px]" data-name="TableCell">
      <Cell28 />
    </div>
  );
}

function Badge9() {
  return (
    <div className="absolute bg-[rgba(34,197,94,0.15)] content-stretch flex h-[20px] items-center justify-center left-[24px] overflow-clip px-[8px] py-[2px] rounded-[6px] top-[15px] w-[60.625px]" data-name="Badge">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#22c55e] text-[12px]">General</p>
    </div>
  );
}

function TableCell47() {
  return (
    <div className="absolute h-[48.5px] left-[605.14px] top-0 w-[271.734px]" data-name="TableCell">
      <Badge9 />
    </div>
  );
}

function PrimitiveSpan9() {
  return <div className="bg-white rounded-[33554400px] shrink-0 size-[16px]" data-name="Primitive.span" />;
}

function PrimitiveButton11() {
  return (
    <div className="bg-[#2563eb] h-[18.391px] relative rounded-[33554400px] shrink-0 w-[32px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pl-[15px] pr-px py-px relative size-full">
        <PrimitiveSpan9 />
      </div>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[20px] relative shrink-0 w-[41.375px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">Active</p>
      </div>
    </div>
  );
}

function Cell29() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[20px] items-center left-[24px] top-[14.5px] w-[200.656px]" data-name="cell">
      <PrimitiveButton11 />
      <Text9 />
    </div>
  );
}

function TableCell48() {
  return (
    <div className="absolute h-[48.5px] left-[876.88px] top-0 w-[248.656px]" data-name="TableCell">
      <Cell29 />
    </div>
  );
}

function Icon16() {
  return (
    <div className="absolute left-[8px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p36e45a00} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a14b300} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2295f880} id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute left-[24px] rounded-[6px] size-[32px] top-[8.5px]" data-name="Button">
      <Icon16 />
    </div>
  );
}

function TableCell49() {
  return (
    <div className="absolute h-[48.5px] left-[1125.53px] top-0 w-[138.469px]" data-name="TableCell">
      <Button13 />
    </div>
  );
}

function TableRow10() {
  return (
    <div className="absolute h-[48.5px] left-0 top-[441px] w-[1264px]" data-name="TableRow">
      <TableCell45 />
      <TableCell46 />
      <TableCell47 />
      <TableCell48 />
      <TableCell49 />
    </div>
  );
}

function TableBody() {
  return (
    <div className="absolute h-[489.5px] left-0 top-[48px] w-[1264px]" data-name="TableBody">
      <TableRow1 />
      <TableRow2 />
      <TableRow3 />
      <TableRow4 />
      <TableRow5 />
      <TableRow6 />
      <TableRow7 />
      <TableRow8 />
      <TableRow9 />
      <TableRow10 />
    </div>
  );
}

function Table() {
  return (
    <div className="h-[537.5px] overflow-clip relative shrink-0 w-full" data-name="Table">
      <TableHeader />
      <TableBody />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col h-[582.406px] items-start left-px overflow-clip top-[85px] w-[1264px]" data-name="Container">
      <Table />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">Rows per page:</p>
      </div>
    </div>
  );
}

function PrimitiveSpan10() {
  return (
    <div className="h-[20px] relative shrink-0 w-[15.266px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[8px] not-italic text-[#0f172a] text-[14px] text-center top-0">10</p>
      </div>
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.5">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton12() {
  return (
    <div className="bg-white h-[32px] relative rounded-[6px] shrink-0 w-[70px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[13px] py-px relative size-full">
        <PrimitiveSpan10 />
        <Icon17 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[32px] relative shrink-0 w-[180.406px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Paragraph />
        <PrimitiveButton12 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0 w-[75px] whitespace-pre-wrap">Page 1 of 3</p>
      </div>
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M10 12L6 8L10 4" id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button14() {
  return (
    <div className="bg-white opacity-50 relative rounded-[6px] shrink-0 size-[32px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Icon18 />
      </div>
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button15() {
  return (
    <div className="bg-white flex-[1_0_0] h-[32px] min-h-px min-w-px relative rounded-[6px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Icon19 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[32px] relative shrink-0 w-[68px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Button14 />
        <Button15 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[32px] relative shrink-0 w-[150.125px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container8 />
        <Container9 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex gap-[24px] h-[49px] items-center justify-end left-px pr-[24px] pt-px top-[667.41px] w-[1264px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-solid border-t inset-0 pointer-events-none" />
      <Container6 />
      <Container7 />
    </div>
  );
}

function DashboardTable() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[6px] w-[1266px]" data-name="DashboardTable">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <RulesAndAction2 />
        <Container4 />
        <Container5 />
      </div>
    </div>
  );
}

function TabPanel() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[1266px]" data-name="Tab Panel">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <DashboardTable />
      </div>
    </div>
  );
}

function PrimitiveDiv() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[1266px]" data-name="Primitive.div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start relative size-full">
        <RulesAndAction1 />
        <TabPanel />
      </div>
    </div>
  );
}

function RulesAndAction() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative w-[1266px]" data-name="RulesAndAction">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <PrimitiveDiv />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[1314px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pl-[24px] py-[24px] relative rounded-[inherit] size-full">
        <RulesAndAction />
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[944px] items-start left-[260px] overflow-clip top-0 w-[1314px]" data-name="Main Content">
      <Header />
      <Container2 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[36.344px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#0f172a] text-[16px] top-[-1px] tracking-[-0.4px]">Rack</p>
      </div>
    </div>
  );
}

function Icon20() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p6153ec0} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" strokeWidth="1.33333" />
          <path d={svgPaths.p29881d00} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button16() {
  return (
    <div className="relative rounded-[6px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon20 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[56px] relative shrink-0 w-[259px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(226,232,240,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-px px-[16px] relative size-full">
        <Heading1 />
        <Button16 />
      </div>
    </div>
  );
}

function SecondarySidebar1() {
  return (
    <div className="h-[17.141px] relative shrink-0 w-[187.438px]" data-name="SecondarySidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[17.143px] left-0 not-italic text-[#0f172a] text-[12px] top-0">Integrated Rack Diagnostic Suite</p>
      </div>
    </div>
  );
}

function Icon21() {
  return (
    <div className="relative size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton13() {
  return (
    <div className="bg-[rgba(241,245,249,0.5)] flex-[1_0_0] h-[33.141px] min-h-px min-w-px relative rounded-[6px]" data-name="Primitive.button">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[8px] relative size-full">
          <SecondarySidebar1 />
          <div className="flex items-center justify-center relative shrink-0">
            <div className="flex-none rotate-180">
              <Icon21 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimitiveH() {
  return (
    <div className="content-stretch flex h-[33.141px] items-start relative shrink-0 w-full" data-name="Primitive.h3">
      <PrimitiveButton13 />
    </div>
  );
}

function SecondarySidebar3() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="SecondarySidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(15,23,42,0.7)] top-0">Dashboard</p>
      </div>
    </div>
  );
}

function Button17() {
  return (
    <div className="h-[32px] relative rounded-[6px] shrink-0 w-[226px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[8px] relative size-full">
        <SecondarySidebar3 />
      </div>
    </div>
  );
}

function SecondarySidebar4() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="SecondarySidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(15,23,42,0.7)] top-0">Project Planner</p>
      </div>
    </div>
  );
}

function Button18() {
  return (
    <div className="h-[32px] relative rounded-[6px] shrink-0 w-[226px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[8px] relative size-full">
        <SecondarySidebar4 />
      </div>
    </div>
  );
}

function SecondarySidebar5() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="SecondarySidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(15,23,42,0.7)] top-0">Inspection</p>
      </div>
    </div>
  );
}

function Button19() {
  return (
    <div className="h-[32px] relative rounded-[6px] shrink-0 w-[226px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[8px] relative size-full">
        <SecondarySidebar5 />
      </div>
    </div>
  );
}

function SecondarySidebar6() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="SecondarySidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(15,23,42,0.7)] top-0">Inspection Cycle Insights</p>
      </div>
    </div>
  );
}

function Button20() {
  return (
    <div className="h-[32px] relative rounded-[6px] shrink-0 w-[226px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[8px] relative size-full">
        <SecondarySidebar6 />
      </div>
    </div>
  );
}

function SecondarySidebar7() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="SecondarySidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(15,23,42,0.7)] top-0">Inspection Findings</p>
      </div>
    </div>
  );
}

function Button21() {
  return (
    <div className="h-[32px] relative rounded-[6px] shrink-0 w-[226px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[8px] relative size-full">
        <SecondarySidebar7 />
      </div>
    </div>
  );
}

function SecondarySidebar8() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="SecondarySidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(15,23,42,0.7)] top-0">TPI Findings</p>
      </div>
    </div>
  );
}

function Button22() {
  return (
    <div className="h-[32px] relative rounded-[6px] shrink-0 w-[226px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[8px] relative size-full">
        <SecondarySidebar8 />
      </div>
    </div>
  );
}

function SecondarySidebar9() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="SecondarySidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(15,23,42,0.7)] top-0">Integrity Test</p>
      </div>
    </div>
  );
}

function Button23() {
  return (
    <div className="h-[32px] relative rounded-[6px] shrink-0 w-[226px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[8px] relative size-full">
        <SecondarySidebar9 />
      </div>
    </div>
  );
}

function SecondarySidebar10() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="SecondarySidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(15,23,42,0.7)] top-0">Rack Health Analytics</p>
      </div>
    </div>
  );
}

function Button24() {
  return (
    <div className="h-[32px] relative rounded-[6px] shrink-0 w-[226px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[8px] relative size-full">
        <SecondarySidebar10 />
      </div>
    </div>
  );
}

function SecondarySidebar11() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="SecondarySidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(15,23,42,0.7)] top-0">Call To Action</p>
      </div>
    </div>
  );
}

function Button25() {
  return (
    <div className="h-[32px] relative rounded-[6px] shrink-0 w-[226px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[8px] relative size-full">
        <SecondarySidebar11 />
      </div>
    </div>
  );
}

function SecondarySidebar12() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="SecondarySidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(15,23,42,0.7)] top-0">Bill Of Quantity</p>
      </div>
    </div>
  );
}

function Button26() {
  return (
    <div className="h-[32px] relative rounded-[6px] shrink-0 w-[226px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[8px] relative size-full">
        <SecondarySidebar12 />
      </div>
    </div>
  );
}

function SecondarySidebar13() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="SecondarySidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(15,23,42,0.7)] top-0">Element Stock Management</p>
      </div>
    </div>
  );
}

function Button27() {
  return (
    <div className="h-[32px] relative rounded-[6px] shrink-0 w-[226px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[8px] relative size-full">
        <SecondarySidebar13 />
      </div>
    </div>
  );
}

function SecondarySidebar14() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="SecondarySidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(15,23,42,0.7)] top-0">{`Purchase Request & Specs`}</p>
      </div>
    </div>
  );
}

function Button28() {
  return (
    <div className="h-[32px] relative rounded-[6px] shrink-0 w-[226px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[8px] relative size-full">
        <SecondarySidebar14 />
      </div>
    </div>
  );
}

function SecondarySidebar15() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="SecondarySidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(15,23,42,0.7)] top-0">Maintenance</p>
      </div>
    </div>
  );
}

function Button29() {
  return (
    <div className="h-[32px] relative rounded-[6px] shrink-0 w-[226px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[8px] relative size-full">
        <SecondarySidebar15 />
      </div>
    </div>
  );
}

function SecondarySidebar16() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="SecondarySidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(15,23,42,0.7)] top-0">Compliance</p>
      </div>
    </div>
  );
}

function Button30() {
  return (
    <div className="h-[32px] relative rounded-[6px] shrink-0 w-[226px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[8px] relative size-full">
        <SecondarySidebar16 />
      </div>
    </div>
  );
}

function SecondarySidebar17() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="SecondarySidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0">Rules and Action</p>
      </div>
    </div>
  );
}

function Button31() {
  return (
    <div className="bg-[#f1f5f9] h-[32px] relative rounded-[6px] shrink-0 w-[226px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[8px] relative size-full">
        <SecondarySidebar17 />
      </div>
    </div>
  );
}

function SecondarySidebar18() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="SecondarySidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(15,23,42,0.7)] top-0">Escalation Logs</p>
      </div>
    </div>
  );
}

function Button32() {
  return (
    <div className="h-[32px] relative rounded-[6px] shrink-0 w-[226px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[8px] relative size-full">
        <SecondarySidebar18 />
      </div>
    </div>
  );
}

function SecondarySidebar19() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="SecondarySidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(15,23,42,0.7)] top-0">LARC Drawings</p>
      </div>
    </div>
  );
}

function Button33() {
  return (
    <div className="h-[32px] relative rounded-[6px] shrink-0 w-[226px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[8px] relative size-full">
        <SecondarySidebar19 />
      </div>
    </div>
  );
}

function SecondarySidebar20() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="SecondarySidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(15,23,42,0.7)] top-0">Report</p>
      </div>
    </div>
  );
}

function Button34() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[6px] w-[226px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[8px] relative size-full">
        <SecondarySidebar20 />
      </div>
    </div>
  );
}

function SecondarySidebar2() {
  return (
    <div className="h-[610px] relative shrink-0 w-full" data-name="SecondarySidebar">
      <div aria-hidden="true" className="absolute border-[rgba(226,232,240,0.5)] border-l border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[2px] items-start pl-[9px] relative size-full">
        <Button17 />
        <Button18 />
        <Button19 />
        <Button20 />
        <Button21 />
        <Button22 />
        <Button23 />
        <Button24 />
        <Button25 />
        <Button26 />
        <Button27 />
        <Button28 />
        <Button29 />
        <Button30 />
        <Button31 />
        <Button32 />
        <Button33 />
        <Button34 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[618px] relative shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pl-[8px] pt-[4px] relative size-full">
          <SecondarySidebar2 />
        </div>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col h-[651.141px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveH />
      <Container13 />
    </div>
  );
}

function PrimitiveDiv2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[259px]" data-name="Primitive.div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pt-[8px] px-[8px] relative rounded-[inherit] size-full">
        <Container12 />
      </div>
    </div>
  );
}

function SecondarySidebar() {
  return (
    <div className="content-stretch flex flex-col h-[944px] items-start relative shrink-0 w-full" data-name="SecondarySidebar">
      <Container11 />
      <PrimitiveDiv2 />
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[944px] items-start left-0 pr-px top-0 w-[260px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-r border-solid inset-0 pointer-events-none" />
      <SecondarySidebar />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[944px] left-[64px] overflow-clip top-0 w-[1574px]" data-name="Container">
      <MainContent />
      <Container10 />
    </div>
  );
}

function Icon22() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pff0fc00} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1d76d410} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2f091200} id="Vector_3" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p39897300} id="Vector_4" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button35() {
  return (
    <div className="relative rounded-[6px] shrink-0 size-[40px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon22 />
      </div>
    </div>
  );
}

function Icon23() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2004_1753)" id="Icon">
          <path d={svgPaths.p15f82200} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p375323f0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4 4H4.00667" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4 12H4.00667" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2004_1753">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button36() {
  return (
    <div className="bg-[#2563eb] relative rounded-[6px] shrink-0 size-[40px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon23 />
      </div>
    </div>
  );
}

function Icon24() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p264a0480} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10 12H6" id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p37bb0d00} id="Vector_3" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1c171d80} id="Vector_4" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p48c6d00} id="Vector_5" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button37() {
  return (
    <div className="relative rounded-[6px] shrink-0 size-[40px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon24 />
      </div>
    </div>
  );
}

function Icon25() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2bb95e00} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 14.6667V8" id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p14df0fc0} id="Vector_3" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M5 2.84667L11 6.28" id="Vector_4" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button38() {
  return (
    <div className="relative rounded-[6px] shrink-0 size-[40px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon25 />
      </div>
    </div>
  );
}

function Icon26() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 13.3333V6.66667" id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12 13.3333V2.66667" id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4 13.3333V10.6667" id="Vector_3" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button39() {
  return (
    <div className="relative rounded-[6px] shrink-0 size-[40px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon26 />
      </div>
    </div>
  );
}

function Icon27() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 13.3333H8.00667" id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3978c100} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3aa7f280} id="Vector_3" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3c5e1580} id="Vector_4" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button40() {
  return (
    <div className="relative rounded-[6px] shrink-0 size-[40px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon27 />
      </div>
    </div>
  );
}

function Icon28() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M10.6667 4L13.3333 13.3333" id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 4V13.3333" id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M5.33333 5.33333V13.3333" id="Vector_3" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.66667 2.66667V13.3333" id="Vector_4" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button41() {
  return (
    <div className="relative rounded-[6px] shrink-0 size-[40px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon28 />
      </div>
    </div>
  );
}

function Icon29() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3e1b7280} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button42() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[6px] w-[40px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon29 />
      </div>
    </div>
  );
}

function PrimarySidebar1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[376px] items-start relative shrink-0 w-full" data-name="PrimarySidebar">
      <Button35 />
      <Button36 />
      <Button37 />
      <Button38 />
      <Button39 />
      <Button40 />
      <Button41 />
      <Button42 />
    </div>
  );
}

function PrimitiveDiv3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[47px]" data-name="Primitive.div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <PrimarySidebar1 />
      </div>
    </div>
  );
}

function ModeToggle() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="ModeToggle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2004_1744)" id="ModeToggle">
          <path d={svgPaths.p1bbeeb00} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </g>
        <defs>
          <clipPath id="clip0_2004_1744">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button43() {
  return (
    <div className="relative rounded-[6px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <ModeToggle />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[52px] relative shrink-0 w-[36px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pt-[16px] relative size-full">
        <Button43 />
      </div>
    </div>
  );
}

function PrimarySidebar() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[944px] items-center left-0 pr-px py-[16px] top-0 w-[64px]" data-name="PrimarySidebar">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-r border-solid inset-0 pointer-events-none" />
      <PrimitiveDiv3 />
      <Container14 />
    </div>
  );
}

function SidebarLayout() {
  return (
    <div className="absolute bg-white h-[944px] left-0 overflow-clip top-0 w-[1638px]" data-name="SidebarLayout">
      <Container />
      <PrimarySidebar />
    </div>
  );
}

export default function FigmaMakeRamsSecondHalfIrdsCopy() {
  return (
    <div className="bg-white relative size-full" data-name="Figma Make RAMS Second Half (IRDS) (Copy)">
      <SidebarLayout />
    </div>
  );
}