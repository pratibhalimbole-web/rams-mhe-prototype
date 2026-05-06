import svgPaths from "./svg-5hkrzf31pd";

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

function RulesAndAction() {
  return (
    <div className="h-[36px] relative shrink-0 w-[1266px]" data-name="RulesAndAction">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pr-[1070.641px] relative size-full">
        <PrimitiveDiv1 />
      </div>
    </div>
  );
}

function Icon() {
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
      <Icon />
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

function Icon1() {
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

function Container() {
  return (
    <div className="absolute h-[36px] left-0 top-0 w-[350px]" data-name="Container">
      <Input />
      <Icon1 />
    </div>
  );
}

function RulesAndAction1() {
  return (
    <div className="absolute h-[36px] left-[25px] top-[25px] w-[1216px]" data-name="RulesAndAction">
      <Button />
      <Container />
    </div>
  );
}

function Icon2() {
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
      <Icon2 />
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

function Icon3() {
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
      <Icon3 />
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

function Icon4() {
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
      <Icon4 />
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

function Header() {
  return (
    <div className="absolute h-[17.141px] left-[24px] top-[15.17px] w-[200.656px]" data-name="header">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[17.143px] left-0 not-italic text-[#64748b] text-[12px] top-0 uppercase">Status</p>
    </div>
  );
}

function TableHead3() {
  return (
    <div className="absolute h-[48px] left-[876.88px] top-0 w-[248.656px]" data-name="TableHead">
      <Header />
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

function Icon5() {
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
      <Icon5 />
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

function Icon6() {
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
      <Icon6 />
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

function Button6() {
  return (
    <div className="absolute left-[24px] rounded-[6px] size-[32px] top-[8.5px]" data-name="Button">
      <Icon7 />
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

function Button7() {
  return (
    <div className="absolute left-[24px] rounded-[6px] size-[32px] top-[8.5px]" data-name="Button">
      <Icon8 />
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

function Button8() {
  return (
    <div className="absolute left-[24px] rounded-[6px] size-[32px] top-[8.5px]" data-name="Button">
      <Icon9 />
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

function Button9() {
  return (
    <div className="absolute left-[24px] rounded-[6px] size-[32px] top-[8.5px]" data-name="Button">
      <Icon10 />
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

function Button10() {
  return (
    <div className="absolute left-[24px] rounded-[6px] size-[32px] top-[8.5px]" data-name="Button">
      <Icon11 />
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

function Button11() {
  return (
    <div className="absolute left-[24px] rounded-[6px] size-[32px] top-[8.5px]" data-name="Button">
      <Icon12 />
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

function Button12() {
  return (
    <div className="absolute left-[24px] rounded-[6px] size-[32px] top-[8.5px]" data-name="Button">
      <Icon13 />
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

function Button13() {
  return (
    <div className="absolute left-[24px] rounded-[6px] size-[32px] top-[8.5px]" data-name="Button">
      <Icon14 />
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

function Container1() {
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

function Icon15() {
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
        <Icon15 />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[32px] relative shrink-0 w-[180.406px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Paragraph />
        <PrimitiveButton12 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-0 w-[75px] whitespace-pre-wrap">Page 1 of 3</p>
      </div>
    </div>
  );
}

function Icon16() {
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
        <Icon16 />
      </div>
    </div>
  );
}

function Icon17() {
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
        <Icon17 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[32px] relative shrink-0 w-[68px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Button14 />
        <Button15 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[32px] relative shrink-0 w-[150.125px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container5 />
        <Container6 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex gap-[24px] h-[49px] items-center justify-end left-px pr-[24px] pt-px top-[667.41px] w-[1264px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-solid border-t inset-0 pointer-events-none" />
      <Container3 />
      <Container4 />
    </div>
  );
}

function DashboardTable() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[6px] w-[1266px]" data-name="DashboardTable">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <RulesAndAction1 />
        <Container1 />
        <Container2 />
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

export default function PrimitiveDiv() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative size-full" data-name="Primitive.div">
      <RulesAndAction />
      <TabPanel />
    </div>
  );
}