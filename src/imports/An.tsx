import svgPaths from "./svg-ewmas0ye49";

function Icon() {
  return (
    <div className="absolute left-[11.99px] size-[15.993px] top-[9.99px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9933 15.9933">
        <g id="Icon">
          <path d="M3.33195 7.99667H12.6614" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d="M7.99667 3.33195V12.6614" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#2563eb] h-[35.985px] left-[890.68px] rounded-[6px] top-0 w-[127.254px]" data-name="Button">
      <Icon />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[75.98px] not-italic text-[14px] text-center text-nowrap text-white top-[8.1px] translate-x-[-50%]">Create BOQ</p>
    </div>
  );
}

function Yt() {
  return (
    <div className="absolute bg-white h-[35.985px] left-0 rounded-[6px] top-0 w-[349.984px]" data-name="Yt">
      <div className="content-stretch flex items-center overflow-clip pl-[36px] pr-[12px] py-[4px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[14px] text-nowrap">Search BOQ...</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[1.108px] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[9.99px] size-[15.993px] top-[9.99px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9933 15.9933">
        <g id="Icon">
          <path d={svgPaths.p14a64180} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d={svgPaths.p2811da40} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
        </g>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[35.985px] left-0 top-0 w-[349.984px]" data-name="Container">
      <Yt />
      <Icon1 />
    </div>
  );
}

function AQ() {
  return (
    <div className="absolute h-[35.985px] left-[23.99px] top-[23.99px] w-[1017.931px]" data-name="aQ">
      <Button />
      <Container />
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute h-[31.987px] left-[11.99px] rounded-[6px] top-[7.72px] w-[97.431px]" data-name="Button">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[33px] not-italic text-[#0f172a] text-[12px] text-center text-nowrap top-[8px] translate-x-[-50%] uppercase">BOQ ID</p>
    </div>
  );
}

function Lr() {
  return (
    <div className="absolute h-[47.997px] left-0 top-0 w-[173.954px]" data-name="lr">
      <Button1 />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute content-stretch flex h-[15.993px] items-start left-[23.99px] top-[15.72px] w-[152.041px]" data-name="header">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#64748b] text-[12px] text-nowrap uppercase">Date Range</p>
    </div>
  );
}

function Lr1() {
  return (
    <div className="absolute h-[47.997px] left-[173.95px] top-0 w-[200.021px]" data-name="lr">
      <Header />
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute h-[31.987px] left-[23.99px] rounded-[6px] top-[7.72px] w-[134.922px]" data-name="Button">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[51.49px] not-italic text-[#0f172a] text-[12px] text-center text-nowrap top-[8px] translate-x-[-50%] uppercase">Total Items</p>
    </div>
  );
}

function Lr2() {
  return (
    <div className="absolute h-[47.997px] left-[373.97px] top-0 w-[182.902px]" data-name="lr">
      <Button2 />
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute h-[31.987px] left-[23.99px] rounded-[6px] top-[7.72px] w-[130.249px]" data-name="Button">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[49.49px] not-italic text-[#0f172a] text-[12px] text-center text-nowrap top-[8px] translate-x-[-50%] uppercase">OEM Count</p>
    </div>
  );
}

function Lr3() {
  return (
    <div className="absolute h-[47.997px] left-[556.88px] top-0 w-[178.229px]" data-name="lr">
      <Button3 />
    </div>
  );
}

function Header1() {
  return (
    <div className="absolute content-stretch flex h-[15.993px] items-start left-[23.99px] top-[15.72px] w-[122.806px]" data-name="header">
      <p className="basis-0 font-['Inter:Semi_Bold',sans-serif] font-semibold grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[#64748b] text-[12px] uppercase">Created By</p>
    </div>
  );
}

function Lr4() {
  return (
    <div className="absolute h-[47.997px] left-[735.11px] top-0 w-[170.786px]" data-name="lr">
      <Header1 />
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute h-[31.987px] left-[11.99px] rounded-[6px] top-[7.72px] w-[132.689px]" data-name="Button">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[50.49px] not-italic text-[#0f172a] text-[12px] text-center text-nowrap top-[8px] translate-x-[-50%] uppercase">Created On</p>
    </div>
  );
}

function Lr5() {
  return (
    <div className="absolute h-[47.997px] left-[905.89px] top-0 w-[168.674px]" data-name="lr">
      <Button4 />
    </div>
  );
}

function Lr6() {
  return <div className="absolute h-[47.997px] left-[1074.57px] top-0 w-[79.967px]" data-name="lr" />;
}

function Et() {
  return (
    <div className="absolute border-[#e2e8f0] border-[0px_0px_1.108px] border-solid h-[47.997px] left-0 top-0 w-[1154.532px]" data-name="et">
      <Lr />
      <Lr1 />
      <Lr2 />
      <Lr3 />
      <Lr4 />
      <Lr5 />
      <Lr6 />
    </div>
  );
}

function Ic() {
  return (
    <div className="absolute h-[47.997px] left-0 top-0 w-[1154.532px]" data-name="Ic">
      <Et />
    </div>
  );
}

function Cell() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[125.973px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#2563eb] text-[14px] text-nowrap top-[0.11px]">BOQ-MAR25-1000</p>
    </div>
  );
}

function Ve() {
  return (
    <div className="absolute h-[49.088px] left-0 top-0 w-[173.954px]" data-name="Ve">
      <Cell />
    </div>
  );
}

function Cell1() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[152.041px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] text-nowrap top-[0.11px]">Mar 01 - Mar 15, 2025</p>
    </div>
  );
}

function Ve1() {
  return (
    <div className="absolute h-[49.088px] left-[173.95px] top-0 w-[200.021px]" data-name="Ve">
      <Cell1 />
    </div>
  );
}

function Cell2() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[134.922px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[67.83px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">47</p>
    </div>
  );
}

function Ve2() {
  return (
    <div className="absolute h-[49.088px] left-[373.97px] top-0 w-[182.902px]" data-name="Ve">
      <Cell2 />
    </div>
  );
}

function Cell3() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[130.249px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[65.36px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">5</p>
    </div>
  );
}

function Ve3() {
  return (
    <div className="absolute h-[49.088px] left-[556.88px] top-0 w-[178.229px]" data-name="Ve">
      <Cell3 />
    </div>
  );
}

function Text() {
  return (
    <div className="absolute h-[19.992px] left-[31.99px] top-[1.99px] w-[82.338px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] text-nowrap top-[0.11px]">Sarah Taylor</p>
    </div>
  );
}

function Text1() {
  return (
    <div className="basis-0 bg-[#f1f5f9] grow h-[23.99px] min-h-px min-w-px relative rounded-[3.71704e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[14.286px] not-italic relative shrink-0 text-[#64748b] text-[10px] text-nowrap">ST</p>
      </div>
    </div>
  );
}

function PrimitiveSpan() {
  return (
    <div className="absolute content-stretch flex items-start left-0 overflow-clip rounded-[3.71704e+07px] size-[23.99px] top-0" data-name="Primitive.span">
      <Text1 />
    </div>
  );
}

function Cell4() {
  return (
    <div className="absolute h-[23.99px] left-[23.99px] top-[12.55px] w-[122.806px]" data-name="cell">
      <Text />
      <PrimitiveSpan />
    </div>
  );
}

function Ve4() {
  return (
    <div className="absolute h-[49.088px] left-[735.11px] top-0 w-[170.786px]" data-name="Ve">
      <Cell4 />
    </div>
  );
}

function Cell5() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[120.694px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] text-nowrap top-[0.11px]">Mar 1, 2025</p>
    </div>
  );
}

function Ve5() {
  return (
    <div className="absolute h-[49.088px] left-[905.89px] top-0 w-[168.674px]" data-name="Ve">
      <Cell5 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[8px] size-[15.993px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9933 15.9933">
        <g id="Icon">
          <path d={svgPaths.p289fff00} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d={svgPaths.p278a9600} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d={svgPaths.p343387f0} id="Vector_3" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute left-[23.99px] rounded-[6px] size-[31.987px] top-[8.55px]" data-name="Button">
      <Icon2 />
    </div>
  );
}

function Ve6() {
  return (
    <div className="absolute h-[49.088px] left-[1074.57px] top-0 w-[79.967px]" data-name="Ve">
      <Button5 />
    </div>
  );
}

function Et1() {
  return (
    <div className="absolute border-[#e2e8f0] border-[0px_0px_1.108px] border-solid h-[49.088px] left-0 top-0 w-[1154.532px]" data-name="et">
      <Ve />
      <Ve1 />
      <Ve2 />
      <Ve3 />
      <Ve4 />
      <Ve5 />
      <Ve6 />
    </div>
  );
}

function Cell6() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[125.973px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#2563eb] text-[14px] text-nowrap top-[0.11px]">BOQ-APR25-1001</p>
    </div>
  );
}

function Ve7() {
  return (
    <div className="absolute h-[49.088px] left-0 top-0 w-[173.954px]" data-name="Ve">
      <Cell6 />
    </div>
  );
}

function Cell7() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[152.041px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] text-nowrap top-[0.11px]">Apr 01 - Apr 15, 2025</p>
    </div>
  );
}

function Ve8() {
  return (
    <div className="absolute h-[49.088px] left-[173.95px] top-0 w-[200.021px]" data-name="Ve">
      <Cell7 />
    </div>
  );
}

function Cell8() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[134.922px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[67.75px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">28</p>
    </div>
  );
}

function Ve9() {
  return (
    <div className="absolute h-[49.088px] left-[373.97px] top-0 w-[182.902px]" data-name="Ve">
      <Cell8 />
    </div>
  );
}

function Cell9() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[130.249px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[65.36px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">1</p>
    </div>
  );
}

function Ve10() {
  return (
    <div className="absolute h-[49.088px] left-[556.88px] top-0 w-[178.229px]" data-name="Ve">
      <Cell9 />
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute h-[19.992px] left-[31.99px] top-[1.99px] w-[90.819px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] text-nowrap top-[0.11px]">James Wilson</p>
    </div>
  );
}

function Text3() {
  return (
    <div className="basis-0 bg-[#f1f5f9] grow h-[23.99px] min-h-px min-w-px relative rounded-[3.71704e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[14.286px] not-italic relative shrink-0 text-[#64748b] text-[10px] text-nowrap">JW</p>
      </div>
    </div>
  );
}

function PrimitiveSpan1() {
  return (
    <div className="absolute content-stretch flex items-start left-0 overflow-clip rounded-[3.71704e+07px] size-[23.99px] top-0" data-name="Primitive.span">
      <Text3 />
    </div>
  );
}

function Cell10() {
  return (
    <div className="absolute h-[23.99px] left-[23.99px] top-[12.55px] w-[122.806px]" data-name="cell">
      <Text2 />
      <PrimitiveSpan1 />
    </div>
  );
}

function Ve11() {
  return (
    <div className="absolute h-[49.088px] left-[735.11px] top-0 w-[170.786px]" data-name="Ve">
      <Cell10 />
    </div>
  );
}

function Cell11() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[120.694px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] text-nowrap top-[0.11px]">Apr 2, 2025</p>
    </div>
  );
}

function Ve12() {
  return (
    <div className="absolute h-[49.088px] left-[905.89px] top-0 w-[168.674px]" data-name="Ve">
      <Cell11 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[8px] size-[15.993px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9933 15.9933">
        <g id="Icon">
          <path d={svgPaths.p289fff00} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d={svgPaths.p278a9600} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d={svgPaths.p343387f0} id="Vector_3" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute left-[23.99px] rounded-[6px] size-[31.987px] top-[8.55px]" data-name="Button">
      <Icon3 />
    </div>
  );
}

function Ve13() {
  return (
    <div className="absolute h-[49.088px] left-[1074.57px] top-0 w-[79.967px]" data-name="Ve">
      <Button6 />
    </div>
  );
}

function Et2() {
  return (
    <div className="absolute border-[#e2e8f0] border-[0px_0px_1.108px] border-solid h-[49.088px] left-0 top-[49.09px] w-[1154.532px]" data-name="et">
      <Ve7 />
      <Ve8 />
      <Ve9 />
      <Ve10 />
      <Ve11 />
      <Ve12 />
      <Ve13 />
    </div>
  );
}

function Cell12() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[125.973px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#2563eb] text-[14px] text-nowrap top-[0.11px]">BOQ-APR25-1002</p>
    </div>
  );
}

function Ve14() {
  return (
    <div className="absolute h-[49.088px] left-0 top-0 w-[173.954px]" data-name="Ve">
      <Cell12 />
    </div>
  );
}

function Cell13() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[152.041px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] text-nowrap top-[0.11px]">Apr 01 - Apr 15, 2025</p>
    </div>
  );
}

function Ve15() {
  return (
    <div className="absolute h-[49.088px] left-[173.95px] top-0 w-[200.021px]" data-name="Ve">
      <Cell13 />
    </div>
  );
}

function Cell14() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[134.922px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[67.5px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">36</p>
    </div>
  );
}

function Ve16() {
  return (
    <div className="absolute h-[49.088px] left-[373.97px] top-0 w-[182.902px]" data-name="Ve">
      <Cell14 />
    </div>
  );
}

function Cell15() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[130.249px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[65.36px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">1</p>
    </div>
  );
}

function Ve17() {
  return (
    <div className="absolute h-[49.088px] left-[556.88px] top-0 w-[178.229px]" data-name="Ve">
      <Cell15 />
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute h-[19.992px] left-[31.99px] top-[1.99px] w-[82.338px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] text-nowrap top-[0.11px]">Sarah Taylor</p>
    </div>
  );
}

function Text5() {
  return (
    <div className="basis-0 bg-[#f1f5f9] grow h-[23.99px] min-h-px min-w-px relative rounded-[3.71704e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[14.286px] not-italic relative shrink-0 text-[#64748b] text-[10px] text-nowrap">ST</p>
      </div>
    </div>
  );
}

function PrimitiveSpan2() {
  return (
    <div className="absolute content-stretch flex items-start left-0 overflow-clip rounded-[3.71704e+07px] size-[23.99px] top-0" data-name="Primitive.span">
      <Text5 />
    </div>
  );
}

function Cell16() {
  return (
    <div className="absolute h-[23.99px] left-[23.99px] top-[12.55px] w-[122.806px]" data-name="cell">
      <Text4 />
      <PrimitiveSpan2 />
    </div>
  );
}

function Ve18() {
  return (
    <div className="absolute h-[49.088px] left-[735.11px] top-0 w-[170.786px]" data-name="Ve">
      <Cell16 />
    </div>
  );
}

function Cell17() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[120.694px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] text-nowrap top-[0.11px]">Apr 3, 2025</p>
    </div>
  );
}

function Ve19() {
  return (
    <div className="absolute h-[49.088px] left-[905.89px] top-0 w-[168.674px]" data-name="Ve">
      <Cell17 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-[8px] size-[15.993px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9933 15.9933">
        <g id="Icon">
          <path d={svgPaths.p289fff00} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d={svgPaths.p278a9600} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d={svgPaths.p343387f0} id="Vector_3" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute left-[23.99px] rounded-[6px] size-[31.987px] top-[8.55px]" data-name="Button">
      <Icon4 />
    </div>
  );
}

function Ve20() {
  return (
    <div className="absolute h-[49.088px] left-[1074.57px] top-0 w-[79.967px]" data-name="Ve">
      <Button7 />
    </div>
  );
}

function Et3() {
  return (
    <div className="absolute border-[#e2e8f0] border-[0px_0px_1.108px] border-solid h-[49.088px] left-0 top-[98.18px] w-[1154.532px]" data-name="et">
      <Ve14 />
      <Ve15 />
      <Ve16 />
      <Ve17 />
      <Ve18 />
      <Ve19 />
      <Ve20 />
    </div>
  );
}

function Cell18() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[125.973px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#2563eb] text-[14px] text-nowrap top-[0.11px]">BOQ-MAR25-1003</p>
    </div>
  );
}

function Ve21() {
  return (
    <div className="absolute h-[49.088px] left-0 top-0 w-[173.954px]" data-name="Ve">
      <Cell18 />
    </div>
  );
}

function Cell19() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[152.041px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] text-nowrap top-[0.11px]">Mar 01 - Mar 15, 2025</p>
    </div>
  );
}

function Ve22() {
  return (
    <div className="absolute h-[49.088px] left-[173.95px] top-0 w-[200.021px]" data-name="Ve">
      <Cell19 />
    </div>
  );
}

function Cell20() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[134.922px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[67.66px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">23</p>
    </div>
  );
}

function Ve23() {
  return (
    <div className="absolute h-[49.088px] left-[373.97px] top-0 w-[182.902px]" data-name="Ve">
      <Cell20 />
    </div>
  );
}

function Cell21() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[130.249px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[65.17px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">3</p>
    </div>
  );
}

function Ve24() {
  return (
    <div className="absolute h-[49.088px] left-[556.88px] top-0 w-[178.229px]" data-name="Ve">
      <Cell21 />
    </div>
  );
}

function Text6() {
  return (
    <div className="absolute h-[19.992px] left-[31.99px] top-[1.99px] w-[90.819px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] text-nowrap top-[0.11px]">James Wilson</p>
    </div>
  );
}

function Text7() {
  return (
    <div className="basis-0 bg-[#f1f5f9] grow h-[23.99px] min-h-px min-w-px relative rounded-[3.71704e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[14.286px] not-italic relative shrink-0 text-[#64748b] text-[10px] text-nowrap">JW</p>
      </div>
    </div>
  );
}

function PrimitiveSpan3() {
  return (
    <div className="absolute content-stretch flex items-start left-0 overflow-clip rounded-[3.71704e+07px] size-[23.99px] top-0" data-name="Primitive.span">
      <Text7 />
    </div>
  );
}

function Cell22() {
  return (
    <div className="absolute h-[23.99px] left-[23.99px] top-[12.55px] w-[122.806px]" data-name="cell">
      <Text6 />
      <PrimitiveSpan3 />
    </div>
  );
}

function Ve25() {
  return (
    <div className="absolute h-[49.088px] left-[735.11px] top-0 w-[170.786px]" data-name="Ve">
      <Cell22 />
    </div>
  );
}

function Cell23() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[120.694px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] text-nowrap top-[0.11px]">Mar 4, 2025</p>
    </div>
  );
}

function Ve26() {
  return (
    <div className="absolute h-[49.088px] left-[905.89px] top-0 w-[168.674px]" data-name="Ve">
      <Cell23 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute left-[8px] size-[15.993px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9933 15.9933">
        <g id="Icon">
          <path d={svgPaths.p289fff00} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d={svgPaths.p278a9600} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d={svgPaths.p343387f0} id="Vector_3" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute left-[23.99px] rounded-[6px] size-[31.987px] top-[8.55px]" data-name="Button">
      <Icon5 />
    </div>
  );
}

function Ve27() {
  return (
    <div className="absolute h-[49.088px] left-[1074.57px] top-0 w-[79.967px]" data-name="Ve">
      <Button8 />
    </div>
  );
}

function Et4() {
  return (
    <div className="absolute border-[#e2e8f0] border-[0px_0px_1.108px] border-solid h-[49.088px] left-0 top-[147.26px] w-[1154.532px]" data-name="et">
      <Ve21 />
      <Ve22 />
      <Ve23 />
      <Ve24 />
      <Ve25 />
      <Ve26 />
      <Ve27 />
    </div>
  );
}

function Cell24() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[125.973px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#2563eb] text-[14px] text-nowrap top-[0.11px]">BOQ-APR25-1004</p>
    </div>
  );
}

function Ve28() {
  return (
    <div className="absolute h-[49.088px] left-0 top-0 w-[173.954px]" data-name="Ve">
      <Cell24 />
    </div>
  );
}

function Cell25() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[152.041px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] text-nowrap top-[0.11px]">Apr 01 - Apr 15, 2025</p>
    </div>
  );
}

function Ve29() {
  return (
    <div className="absolute h-[49.088px] left-[173.95px] top-0 w-[200.021px]" data-name="Ve">
      <Cell25 />
    </div>
  );
}

function Cell26() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[134.922px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[67.5px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">36</p>
    </div>
  );
}

function Ve30() {
  return (
    <div className="absolute h-[49.088px] left-[373.97px] top-0 w-[182.902px]" data-name="Ve">
      <Cell26 />
    </div>
  );
}

function Cell27() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[130.249px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[65.17px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">3</p>
    </div>
  );
}

function Ve31() {
  return (
    <div className="absolute h-[49.088px] left-[556.88px] top-0 w-[178.229px]" data-name="Ve">
      <Cell27 />
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute h-[19.992px] left-[31.99px] top-[1.99px] w-[82.338px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] text-nowrap top-[0.11px]">Sarah Taylor</p>
    </div>
  );
}

function Text9() {
  return (
    <div className="basis-0 bg-[#f1f5f9] grow h-[23.99px] min-h-px min-w-px relative rounded-[3.71704e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[14.286px] not-italic relative shrink-0 text-[#64748b] text-[10px] text-nowrap">ST</p>
      </div>
    </div>
  );
}

function PrimitiveSpan4() {
  return (
    <div className="absolute content-stretch flex items-start left-0 overflow-clip rounded-[3.71704e+07px] size-[23.99px] top-0" data-name="Primitive.span">
      <Text9 />
    </div>
  );
}

function Cell28() {
  return (
    <div className="absolute h-[23.99px] left-[23.99px] top-[12.55px] w-[122.806px]" data-name="cell">
      <Text8 />
      <PrimitiveSpan4 />
    </div>
  );
}

function Ve32() {
  return (
    <div className="absolute h-[49.088px] left-[735.11px] top-0 w-[170.786px]" data-name="Ve">
      <Cell28 />
    </div>
  );
}

function Cell29() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[120.694px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] text-nowrap top-[0.11px]">Apr 5, 2025</p>
    </div>
  );
}

function Ve33() {
  return (
    <div className="absolute h-[49.088px] left-[905.89px] top-0 w-[168.674px]" data-name="Ve">
      <Cell29 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="absolute left-[8px] size-[15.993px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9933 15.9933">
        <g id="Icon">
          <path d={svgPaths.p289fff00} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d={svgPaths.p278a9600} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d={svgPaths.p343387f0} id="Vector_3" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute left-[23.99px] rounded-[6px] size-[31.987px] top-[8.55px]" data-name="Button">
      <Icon6 />
    </div>
  );
}

function Ve34() {
  return (
    <div className="absolute h-[49.088px] left-[1074.57px] top-0 w-[79.967px]" data-name="Ve">
      <Button9 />
    </div>
  );
}

function Et5() {
  return (
    <div className="absolute border-[#e2e8f0] border-[0px_0px_1.108px] border-solid h-[49.088px] left-0 top-[196.35px] w-[1154.532px]" data-name="et">
      <Ve28 />
      <Ve29 />
      <Ve30 />
      <Ve31 />
      <Ve32 />
      <Ve33 />
      <Ve34 />
    </div>
  );
}

function Cell30() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[125.973px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#2563eb] text-[14px] text-nowrap top-[0.11px]">BOQ-APR25-1005</p>
    </div>
  );
}

function Ve35() {
  return (
    <div className="absolute h-[49.088px] left-0 top-0 w-[173.954px]" data-name="Ve">
      <Cell30 />
    </div>
  );
}

function Cell31() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[152.041px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] text-nowrap top-[0.11px]">Apr 01 - Apr 15, 2025</p>
    </div>
  );
}

function Ve36() {
  return (
    <div className="absolute h-[49.088px] left-[173.95px] top-0 w-[200.021px]" data-name="Ve">
      <Cell31 />
    </div>
  );
}

function Cell32() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[134.922px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[67.68px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">59</p>
    </div>
  );
}

function Ve37() {
  return (
    <div className="absolute h-[49.088px] left-[373.97px] top-0 w-[182.902px]" data-name="Ve">
      <Cell32 />
    </div>
  );
}

function Cell33() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[130.249px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[65.36px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">1</p>
    </div>
  );
}

function Ve38() {
  return (
    <div className="absolute h-[49.088px] left-[556.88px] top-0 w-[178.229px]" data-name="Ve">
      <Cell33 />
    </div>
  );
}

function Text10() {
  return (
    <div className="absolute h-[19.992px] left-[31.99px] top-[1.99px] w-[90.819px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] text-nowrap top-[0.11px]">James Wilson</p>
    </div>
  );
}

function Text11() {
  return (
    <div className="basis-0 bg-[#f1f5f9] grow h-[23.99px] min-h-px min-w-px relative rounded-[3.71704e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[14.286px] not-italic relative shrink-0 text-[#64748b] text-[10px] text-nowrap">JW</p>
      </div>
    </div>
  );
}

function PrimitiveSpan5() {
  return (
    <div className="absolute content-stretch flex items-start left-0 overflow-clip rounded-[3.71704e+07px] size-[23.99px] top-0" data-name="Primitive.span">
      <Text11 />
    </div>
  );
}

function Cell34() {
  return (
    <div className="absolute h-[23.99px] left-[23.99px] top-[12.55px] w-[122.806px]" data-name="cell">
      <Text10 />
      <PrimitiveSpan5 />
    </div>
  );
}

function Ve39() {
  return (
    <div className="absolute h-[49.088px] left-[735.11px] top-0 w-[170.786px]" data-name="Ve">
      <Cell34 />
    </div>
  );
}

function Cell35() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[120.694px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] text-nowrap top-[0.11px]">Apr 6, 2025</p>
    </div>
  );
}

function Ve40() {
  return (
    <div className="absolute h-[49.088px] left-[905.89px] top-0 w-[168.674px]" data-name="Ve">
      <Cell35 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[8px] size-[15.993px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9933 15.9933">
        <g id="Icon">
          <path d={svgPaths.p289fff00} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d={svgPaths.p278a9600} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d={svgPaths.p343387f0} id="Vector_3" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute left-[23.99px] rounded-[6px] size-[31.987px] top-[8.55px]" data-name="Button">
      <Icon7 />
    </div>
  );
}

function Ve41() {
  return (
    <div className="absolute h-[49.088px] left-[1074.57px] top-0 w-[79.967px]" data-name="Ve">
      <Button10 />
    </div>
  );
}

function Et6() {
  return (
    <div className="absolute border-[#e2e8f0] border-[0px_0px_1.108px] border-solid h-[49.088px] left-0 top-[245.44px] w-[1154.532px]" data-name="et">
      <Ve35 />
      <Ve36 />
      <Ve37 />
      <Ve38 />
      <Ve39 />
      <Ve40 />
      <Ve41 />
    </div>
  );
}

function Cell36() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[125.973px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#2563eb] text-[14px] text-nowrap top-[0.11px]">BOQ-MAR25-1006</p>
    </div>
  );
}

function Ve42() {
  return (
    <div className="absolute h-[49.088px] left-0 top-0 w-[173.954px]" data-name="Ve">
      <Cell36 />
    </div>
  );
}

function Cell37() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[152.041px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] text-nowrap top-[0.11px]">Mar 01 - Mar 15, 2025</p>
    </div>
  );
}

function Ve43() {
  return (
    <div className="absolute h-[49.088px] left-[173.95px] top-0 w-[200.021px]" data-name="Ve">
      <Cell37 />
    </div>
  );
}

function Cell38() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[134.922px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[67.61px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">35</p>
    </div>
  );
}

function Ve44() {
  return (
    <div className="absolute h-[49.088px] left-[373.97px] top-0 w-[182.902px]" data-name="Ve">
      <Cell38 />
    </div>
  );
}

function Cell39() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[130.249px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[65.17px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">3</p>
    </div>
  );
}

function Ve45() {
  return (
    <div className="absolute h-[49.088px] left-[556.88px] top-0 w-[178.229px]" data-name="Ve">
      <Cell39 />
    </div>
  );
}

function Text12() {
  return (
    <div className="absolute h-[19.992px] left-[31.99px] top-[1.99px] w-[82.338px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] text-nowrap top-[0.11px]">Sarah Taylor</p>
    </div>
  );
}

function Text13() {
  return (
    <div className="basis-0 bg-[#f1f5f9] grow h-[23.99px] min-h-px min-w-px relative rounded-[3.71704e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[14.286px] not-italic relative shrink-0 text-[#64748b] text-[10px] text-nowrap">ST</p>
      </div>
    </div>
  );
}

function PrimitiveSpan6() {
  return (
    <div className="absolute content-stretch flex items-start left-0 overflow-clip rounded-[3.71704e+07px] size-[23.99px] top-0" data-name="Primitive.span">
      <Text13 />
    </div>
  );
}

function Cell40() {
  return (
    <div className="absolute h-[23.99px] left-[23.99px] top-[12.55px] w-[122.806px]" data-name="cell">
      <Text12 />
      <PrimitiveSpan6 />
    </div>
  );
}

function Ve46() {
  return (
    <div className="absolute h-[49.088px] left-[735.11px] top-0 w-[170.786px]" data-name="Ve">
      <Cell40 />
    </div>
  );
}

function Cell41() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[120.694px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] text-nowrap top-[0.11px]">Mar 7, 2025</p>
    </div>
  );
}

function Ve47() {
  return (
    <div className="absolute h-[49.088px] left-[905.89px] top-0 w-[168.674px]" data-name="Ve">
      <Cell41 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute left-[8px] size-[15.993px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9933 15.9933">
        <g id="Icon">
          <path d={svgPaths.p289fff00} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d={svgPaths.p278a9600} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d={svgPaths.p343387f0} id="Vector_3" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
        </g>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute left-[23.99px] rounded-[6px] size-[31.987px] top-[8.55px]" data-name="Button">
      <Icon8 />
    </div>
  );
}

function Ve48() {
  return (
    <div className="absolute h-[49.088px] left-[1074.57px] top-0 w-[79.967px]" data-name="Ve">
      <Button11 />
    </div>
  );
}

function Et7() {
  return (
    <div className="absolute border-[#e2e8f0] border-[0px_0px_1.108px] border-solid h-[49.088px] left-0 top-[294.53px] w-[1154.532px]" data-name="et">
      <Ve42 />
      <Ve43 />
      <Ve44 />
      <Ve45 />
      <Ve46 />
      <Ve47 />
      <Ve48 />
    </div>
  );
}

function Cell42() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[125.973px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#2563eb] text-[14px] text-nowrap top-[0.11px]">BOQ-APR25-1007</p>
    </div>
  );
}

function Ve49() {
  return (
    <div className="absolute h-[49.088px] left-0 top-0 w-[173.954px]" data-name="Ve">
      <Cell42 />
    </div>
  );
}

function Cell43() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[152.041px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] text-nowrap top-[0.11px]">Apr 01 - Apr 15, 2025</p>
    </div>
  );
}

function Ve50() {
  return (
    <div className="absolute h-[49.088px] left-[173.95px] top-0 w-[200.021px]" data-name="Ve">
      <Cell43 />
    </div>
  );
}

function Cell44() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[134.922px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[67.83px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">47</p>
    </div>
  );
}

function Ve51() {
  return (
    <div className="absolute h-[49.088px] left-[373.97px] top-0 w-[182.902px]" data-name="Ve">
      <Cell44 />
    </div>
  );
}

function Cell45() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[130.249px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[65.38px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">2</p>
    </div>
  );
}

function Ve52() {
  return (
    <div className="absolute h-[49.088px] left-[556.88px] top-0 w-[178.229px]" data-name="Ve">
      <Cell45 />
    </div>
  );
}

function Text14() {
  return (
    <div className="absolute h-[19.992px] left-[31.99px] top-[1.99px] w-[90.819px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] text-nowrap top-[0.11px]">James Wilson</p>
    </div>
  );
}

function Text15() {
  return (
    <div className="basis-0 bg-[#f1f5f9] grow h-[23.99px] min-h-px min-w-px relative rounded-[3.71704e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[14.286px] not-italic relative shrink-0 text-[#64748b] text-[10px] text-nowrap">JW</p>
      </div>
    </div>
  );
}

function PrimitiveSpan7() {
  return (
    <div className="absolute content-stretch flex items-start left-0 overflow-clip rounded-[3.71704e+07px] size-[23.99px] top-0" data-name="Primitive.span">
      <Text15 />
    </div>
  );
}

function Cell46() {
  return (
    <div className="absolute h-[23.99px] left-[23.99px] top-[12.55px] w-[122.806px]" data-name="cell">
      <Text14 />
      <PrimitiveSpan7 />
    </div>
  );
}

function Ve53() {
  return (
    <div className="absolute h-[49.088px] left-[735.11px] top-0 w-[170.786px]" data-name="Ve">
      <Cell46 />
    </div>
  );
}

function Cell47() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[120.694px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] text-nowrap top-[0.11px]">Apr 8, 2025</p>
    </div>
  );
}

function Ve54() {
  return (
    <div className="absolute h-[49.088px] left-[905.89px] top-0 w-[168.674px]" data-name="Ve">
      <Cell47 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-[8px] size-[15.993px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9933 15.9933">
        <g id="Icon">
          <path d={svgPaths.p289fff00} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d={svgPaths.p278a9600} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d={svgPaths.p343387f0} id="Vector_3" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
        </g>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute left-[23.99px] rounded-[6px] size-[31.987px] top-[8.55px]" data-name="Button">
      <Icon9 />
    </div>
  );
}

function Ve55() {
  return (
    <div className="absolute h-[49.088px] left-[1074.57px] top-0 w-[79.967px]" data-name="Ve">
      <Button12 />
    </div>
  );
}

function Et8() {
  return (
    <div className="absolute border-[#e2e8f0] border-[0px_0px_1.108px] border-solid h-[49.088px] left-0 top-[343.61px] w-[1154.532px]" data-name="et">
      <Ve49 />
      <Ve50 />
      <Ve51 />
      <Ve52 />
      <Ve53 />
      <Ve54 />
      <Ve55 />
    </div>
  );
}

function Cell48() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[125.973px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#2563eb] text-[14px] text-nowrap top-[0.11px]">BOQ-APR25-1008</p>
    </div>
  );
}

function Ve56() {
  return (
    <div className="absolute h-[49.088px] left-0 top-0 w-[173.954px]" data-name="Ve">
      <Cell48 />
    </div>
  );
}

function Cell49() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[152.041px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] text-nowrap top-[0.11px]">Apr 01 - Apr 15, 2025</p>
    </div>
  );
}

function Ve57() {
  return (
    <div className="absolute h-[49.088px] left-[173.95px] top-0 w-[200.021px]" data-name="Ve">
      <Cell49 />
    </div>
  );
}

function Cell50() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[134.922px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[67.56px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">57</p>
    </div>
  );
}

function Ve58() {
  return (
    <div className="absolute h-[49.088px] left-[373.97px] top-0 w-[182.902px]" data-name="Ve">
      <Cell50 />
    </div>
  );
}

function Cell51() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[130.249px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[65.36px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">1</p>
    </div>
  );
}

function Ve59() {
  return (
    <div className="absolute h-[49.088px] left-[556.88px] top-0 w-[178.229px]" data-name="Ve">
      <Cell51 />
    </div>
  );
}

function Text16() {
  return (
    <div className="absolute h-[19.992px] left-[31.99px] top-[1.99px] w-[82.338px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] text-nowrap top-[0.11px]">Sarah Taylor</p>
    </div>
  );
}

function Text17() {
  return (
    <div className="basis-0 bg-[#f1f5f9] grow h-[23.99px] min-h-px min-w-px relative rounded-[3.71704e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[14.286px] not-italic relative shrink-0 text-[#64748b] text-[10px] text-nowrap">ST</p>
      </div>
    </div>
  );
}

function PrimitiveSpan8() {
  return (
    <div className="absolute content-stretch flex items-start left-0 overflow-clip rounded-[3.71704e+07px] size-[23.99px] top-0" data-name="Primitive.span">
      <Text17 />
    </div>
  );
}

function Cell52() {
  return (
    <div className="absolute h-[23.99px] left-[23.99px] top-[12.55px] w-[122.806px]" data-name="cell">
      <Text16 />
      <PrimitiveSpan8 />
    </div>
  );
}

function Ve60() {
  return (
    <div className="absolute h-[49.088px] left-[735.11px] top-0 w-[170.786px]" data-name="Ve">
      <Cell52 />
    </div>
  );
}

function Cell53() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[120.694px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] text-nowrap top-[0.11px]">Apr 9, 2025</p>
    </div>
  );
}

function Ve61() {
  return (
    <div className="absolute h-[49.088px] left-[905.89px] top-0 w-[168.674px]" data-name="Ve">
      <Cell53 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute left-[8px] size-[15.993px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9933 15.9933">
        <g id="Icon">
          <path d={svgPaths.p289fff00} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d={svgPaths.p278a9600} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d={svgPaths.p343387f0} id="Vector_3" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
        </g>
      </svg>
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute left-[23.99px] rounded-[6px] size-[31.987px] top-[8.55px]" data-name="Button">
      <Icon10 />
    </div>
  );
}

function Ve62() {
  return (
    <div className="absolute h-[49.088px] left-[1074.57px] top-0 w-[79.967px]" data-name="Ve">
      <Button13 />
    </div>
  );
}

function Et9() {
  return (
    <div className="absolute border-[#e2e8f0] border-[0px_0px_1.108px] border-solid h-[49.088px] left-0 top-[392.7px] w-[1154.532px]" data-name="et">
      <Ve56 />
      <Ve57 />
      <Ve58 />
      <Ve59 />
      <Ve60 />
      <Ve61 />
      <Ve62 />
    </div>
  );
}

function Cell54() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[125.973px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#2563eb] text-[14px] text-nowrap top-[0.11px]">BOQ-MAR25-1009</p>
    </div>
  );
}

function Ve63() {
  return (
    <div className="absolute h-[48.534px] left-0 top-0 w-[173.954px]" data-name="Ve">
      <Cell54 />
    </div>
  );
}

function Cell55() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[152.041px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] text-nowrap top-[0.11px]">Mar 01 - Mar 15, 2025</p>
    </div>
  );
}

function Ve64() {
  return (
    <div className="absolute h-[48.534px] left-[173.95px] top-0 w-[200.021px]" data-name="Ve">
      <Cell55 />
    </div>
  );
}

function Cell56() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[134.922px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[67.8px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">51</p>
    </div>
  );
}

function Ve65() {
  return (
    <div className="absolute h-[48.534px] left-[373.97px] top-0 w-[182.902px]" data-name="Ve">
      <Cell56 />
    </div>
  );
}

function Cell57() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[130.249px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[65.38px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">2</p>
    </div>
  );
}

function Ve66() {
  return (
    <div className="absolute h-[48.534px] left-[556.88px] top-0 w-[178.229px]" data-name="Ve">
      <Cell57 />
    </div>
  );
}

function Text18() {
  return (
    <div className="absolute h-[19.992px] left-[31.99px] top-[1.99px] w-[90.819px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] text-nowrap top-[0.11px]">James Wilson</p>
    </div>
  );
}

function Text19() {
  return (
    <div className="basis-0 bg-[#f1f5f9] grow h-[23.99px] min-h-px min-w-px relative rounded-[3.71704e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[14.286px] not-italic relative shrink-0 text-[#64748b] text-[10px] text-nowrap">JW</p>
      </div>
    </div>
  );
}

function PrimitiveSpan9() {
  return (
    <div className="absolute content-stretch flex items-start left-0 overflow-clip rounded-[3.71704e+07px] size-[23.99px] top-0" data-name="Primitive.span">
      <Text19 />
    </div>
  );
}

function Cell58() {
  return (
    <div className="absolute h-[23.99px] left-[23.99px] top-[12.55px] w-[122.806px]" data-name="cell">
      <Text18 />
      <PrimitiveSpan9 />
    </div>
  );
}

function Ve67() {
  return (
    <div className="absolute h-[48.534px] left-[735.11px] top-0 w-[170.786px]" data-name="Ve">
      <Cell58 />
    </div>
  );
}

function Cell59() {
  return (
    <div className="absolute h-[19.992px] left-[23.99px] top-[14.54px] w-[120.694px]" data-name="cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#64748b] text-[14px] text-nowrap top-[0.11px]">Mar 10, 2025</p>
    </div>
  );
}

function Ve68() {
  return (
    <div className="absolute h-[48.534px] left-[905.89px] top-0 w-[168.674px]" data-name="Ve">
      <Cell59 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-[8px] size-[15.993px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9933 15.9933">
        <g id="Icon">
          <path d={svgPaths.p289fff00} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d={svgPaths.p278a9600} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d={svgPaths.p343387f0} id="Vector_3" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
        </g>
      </svg>
    </div>
  );
}

function Button14() {
  return (
    <div className="absolute left-[23.99px] rounded-[6px] size-[31.987px] top-[8.55px]" data-name="Button">
      <Icon11 />
    </div>
  );
}

function Ve69() {
  return (
    <div className="absolute h-[48.534px] left-[1074.57px] top-0 w-[79.967px]" data-name="Ve">
      <Button14 />
    </div>
  );
}

function Et10() {
  return (
    <div className="absolute h-[48.534px] left-0 top-[441.79px] w-[1154.532px]" data-name="et">
      <Ve63 />
      <Ve64 />
      <Ve65 />
      <Ve66 />
      <Ve67 />
      <Ve68 />
      <Ve69 />
    </div>
  );
}

function C() {
  return (
    <div className="absolute h-[490.324px] left-0 top-[48px] w-[1154.532px]" data-name="$c">
      <Et1 />
      <Et2 />
      <Et3 />
      <Et4 />
      <Et5 />
      <Et6 />
      <Et7 />
      <Et8 />
      <Et9 />
      <Et10 />
    </div>
  );
}

function Table() {
  return (
    <div className="absolute h-[538.321px] left-0 top-0 w-[1154.532px]" data-name="Table">
      <Ic />
      <C />
    </div>
  );
}

function Cell60() {
  return (
    <div className="absolute left-[1114.05px] overflow-clip size-[0.987px] top-[72.04px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[38.5px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">Open menu</p>
    </div>
  );
}

function Cell61() {
  return (
    <div className="absolute left-[1114.05px] overflow-clip size-[0.987px] top-[121.13px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[38.5px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">Open menu</p>
    </div>
  );
}

function Cell62() {
  return (
    <div className="absolute left-[1114.05px] overflow-clip size-[0.987px] top-[170.21px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[38.5px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">Open menu</p>
    </div>
  );
}

function Cell63() {
  return (
    <div className="absolute left-[1114.05px] overflow-clip size-[0.987px] top-[219.3px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[38.5px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">Open menu</p>
    </div>
  );
}

function Cell64() {
  return (
    <div className="absolute left-[1114.05px] overflow-clip size-[0.987px] top-[268.39px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[38.5px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">Open menu</p>
    </div>
  );
}

function Cell65() {
  return (
    <div className="absolute left-[1114.05px] overflow-clip size-[0.987px] top-[317.48px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[38.5px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">Open menu</p>
    </div>
  );
}

function Cell66() {
  return (
    <div className="absolute left-[1114.05px] overflow-clip size-[0.987px] top-[366.57px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[38.5px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">Open menu</p>
    </div>
  );
}

function Cell67() {
  return (
    <div className="absolute left-[1114.05px] overflow-clip size-[0.987px] top-[415.65px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[38.5px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">Open menu</p>
    </div>
  );
}

function Cell68() {
  return (
    <div className="absolute left-[1114.05px] overflow-clip size-[0.987px] top-[464.74px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[38.5px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">Open menu</p>
    </div>
  );
}

function Cell69() {
  return (
    <div className="absolute left-[1114.05px] overflow-clip size-[0.987px] top-[513.83px]" data-name="cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[38.5px] not-italic text-[#0f172a] text-[14px] text-center text-nowrap top-[0.11px] translate-x-[-50%]">Open menu</p>
    </div>
  );
}

function VN() {
  return (
    <div className="h-[554.938px] overflow-clip relative shrink-0 w-full" data-name="vN">
      <Table />
      <Cell60 />
      <Cell61 />
      <Cell62 />
      <Cell63 />
      <Cell64 />
      <Cell65 />
      <Cell66 />
      <Cell67 />
      <Cell68 />
      <Cell69 />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[687.748px] items-start left-0 overflow-clip top-[83.96px] w-[1065.911px]" data-name="Container">
      <VN />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[19.992px] relative shrink-0 w-[102.33px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] text-nowrap top-[0.11px]">Rows per page:</p>
      </div>
    </div>
  );
}

function PrimitiveSpan10() {
  return (
    <div className="h-[19.992px] relative shrink-0 w-[15.249px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#0f172a] text-[14px] text-center text-nowrap">10</p>
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[15.993px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9933 15.9933">
        <g id="Icon" opacity="0.5">
          <path d={svgPaths.p8110fc0} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="bg-white h-[35.985px] relative rounded-[6px] shrink-0 w-[69.997px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[1.108px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[13.103px] py-[1.108px] relative size-full">
        <PrimitiveSpan10 />
        <Icon12 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[35.985px] relative shrink-0 w-[180.323px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.997px] items-center relative size-full">
        <Paragraph />
        <PrimitiveButton />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[19.992px] relative shrink-0 w-[74.099px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0f172a] text-[14px] top-[0.11px] w-[75px]">Page 1 of 3</p>
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[15.993px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9933 15.9933">
        <g id="Icon">
          <path d={svgPaths.p33ebca80} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
        </g>
      </svg>
    </div>
  );
}

function Button15() {
  return (
    <div className="bg-white opacity-50 relative rounded-[6px] shrink-0 size-[31.987px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[1.108px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[1.108px] relative size-full">
        <Icon13 />
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[15.993px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9933 15.9933">
        <g id="Icon">
          <path d={svgPaths.p38345c80} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
        </g>
      </svg>
    </div>
  );
}

function Button16() {
  return (
    <div className="bg-white relative rounded-[6px] shrink-0 size-[31.987px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[1.108px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[1.108px] relative size-full">
        <Icon14 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[31.987px] relative shrink-0 w-[67.972px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[3.998px] items-center relative size-full">
        <Button15 />
        <Button16 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[31.987px] relative shrink-0 w-[150.067px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.997px] items-center relative size-full">
        <Container3 />
        <Container4 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex gap-[23.99px] h-[78px] items-center justify-end left-0 pb-0 pl-0 pr-[23.99px] pt-[1.108px] top-[771.71px] w-[1066px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[1.108px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Container2 />
      <Container5 />
    </div>
  );
}

export default function An() {
  return (
    <div className="bg-white border-[#e2e8f0] border-[1.108px] border-solid relative rounded-[6px] size-full" data-name="AN">
      <AQ />
      <Container1 />
      <Container6 />
    </div>
  );
}