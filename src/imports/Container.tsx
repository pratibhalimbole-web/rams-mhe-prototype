import svgPaths from "./svg-k6oan9xrq6";

function Heading() {
  return (
    <div className="h-[36.002px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[36px] left-0 not-italic text-[#202020] text-[24px] text-nowrap top-[-0.68px]">Project Planner</p>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[56.513px] relative shrink-0 w-[404.801px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.998px] items-start relative size-full">
        <Heading />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[11.99px] size-[15.993px] top-[9.99px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9933 15.9933">
        <g id="Icon">
          <path d="M3.33199 7.99667H12.6614" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
          <path d="M7.99667 3.33194V12.6614" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#1b59f8] h-[35.985px] relative rounded-[8px] shrink-0 w-[134.247px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[43.98px] not-italic text-[16px] text-nowrap text-white top-[5.22px]">Add Event</p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.1231 17.7912">
        <g id="Group">
          <path d={svgPaths.p12ca3c80} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon5() {
  return (
    <div className="h-[21.328px] relative shrink-0 w-[22.203px]" data-name="Icon-481">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute flex inset-[8.29%_11.44%] items-center justify-center">
          <div className="flex-none h-[17.791px] scale-y-[-100%] w-[17.123px]">
            <Group />
          </div>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white h-[37px] relative rounded-[6px] shrink-0 w-[38px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon5 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[35.985px] relative shrink-0 w-[297.261px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11.995px] items-center justify-end relative size-full">
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container />
      <Container1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col h-[57px] items-start left-[24px] pb-[1.108px] pt-0 px-0 top-[24px] w-[1069px]" data-name="Container">
      <Container2 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[15.993px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9933 15.9933">
        <g id="Icon">
          <path d={svgPaths.p33ebca80} id="Vector" stroke="var(--stroke-0, #202020)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-white h-[31.987px] relative rounded-[6px] shrink-0 w-[38.183px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[1.108px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[1.108px] relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="basis-0 grow h-[23.99px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[70.28px] not-italic text-[#202020] text-[16px] text-center text-nowrap top-[-0.78px] translate-x-[-50%]">May 2025</p>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[15.993px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9933 15.9933">
        <g id="Icon">
          <path d={svgPaths.p38345c80} id="Vector" stroke="var(--stroke-0, #202020)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33278" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-white h-[31.987px] relative rounded-[6px] shrink-0 w-[38.183px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[1.108px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[1.108px] relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[31.987px] relative shrink-0 w-[240.35px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11.995px] items-center relative size-full">
        <Button2 />
        <Text />
        <Button3 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="basis-0 grow h-[46.18px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Container4 />
      </div>
    </div>
  );
}

function PrimitiveSpan() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-[73.77px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-[rgba(32,32,32,0.6)] text-nowrap">All Events</p>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[15.993px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9933 15.9933">
        <g id="Icon" opacity="0.5">
          <path d={svgPaths.p8110fc0} id="Vector" stroke="var(--stroke-0, #202020)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.33278" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="bg-[#f0f0f0] h-[35.985px] relative rounded-[6px] shrink-0 w-[149.998px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border-[#f0f0f0] border-[1.108px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[13.103px] py-[1.108px] relative size-full">
        <PrimitiveSpan />
        <Icon3 />
      </div>
    </div>
  );
}

function PrimitiveSpan1() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-[73.77px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-[rgba(32,32,32,0.6)] text-nowrap">Month</p>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[15.993px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9933 15.9933">
        <g id="Icon" opacity="0.5">
          <path d={svgPaths.p8110fc0} id="Vector" stroke="var(--stroke-0, #202020)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.33278" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton1() {
  return (
    <div className="bg-[#f0f0f0] h-[35.985px] relative rounded-[6px] shrink-0" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border-[#f0f0f0] border-[1.108px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[34.029px] h-full items-center px-[13.103px] py-[1.108px] relative">
        <PrimitiveSpan1 />
        <Icon4 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[35.985px] relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[15.993px] h-full items-center relative">
        <PrimitiveButton />
        <PrimitiveButton1 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[46.18px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[133px] items-center relative size-full">
          <Container5 />
          <Container6 />
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute content-stretch flex flex-col h-[46px] items-start left-[24px] pb-[1.108px] pt-0 px-0 rounded-[8px] top-[101px] w-[1069px]" data-name="Container">
      <Container7 />
    </div>
  );
}

function Text1() {
  return (
    <div className="content-stretch flex h-[14.401px] items-start relative shrink-0 w-full" data-name="Text">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-center text-nowrap">Sunday</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex flex-col h-[55.977px] items-start left-0 pb-0 pl-[54.073px] pr-[55.18px] pt-[22.64px] top-0 w-[152.387px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Text1 />
    </div>
  );
}

function Text2() {
  return (
    <div className="content-stretch flex h-[14.401px] items-start relative shrink-0 w-full" data-name="Text">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-center text-nowrap">Monday</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex flex-col h-[55.977px] items-start left-[152.39px] pb-0 pl-[52.463px] pr-[53.571px] pt-[22.64px] top-0 w-[152.404px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Text2 />
    </div>
  );
}

function Text3() {
  return (
    <div className="content-stretch flex h-[14.401px] items-start relative shrink-0 w-full" data-name="Text">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-center text-nowrap">Tuesday</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex flex-col h-[55.977px] items-start left-[304.79px] pb-0 pl-[51.338px] pr-[52.446px] pt-[22.64px] top-0 w-[152.404px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Text3 />
    </div>
  );
}

function Text4() {
  return (
    <div className="content-stretch flex h-[14.401px] items-start relative shrink-0 w-full" data-name="Text">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-center text-nowrap">Wednesday</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute content-stretch flex flex-col h-[55.977px] items-start left-[457.19px] pb-0 pl-[41.853px] pr-[42.96px] pt-[22.64px] top-0 w-[152.387px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Text4 />
    </div>
  );
}

function Text5() {
  return (
    <div className="content-stretch flex h-[14.401px] items-start relative shrink-0 w-full" data-name="Text">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-center text-nowrap">Thursday</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute content-stretch flex flex-col h-[55.977px] items-start left-[609.58px] pb-0 pl-[48.482px] pr-[49.607px] pt-[22.64px] top-0 w-[152.404px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Text5 />
    </div>
  );
}

function Text6() {
  return (
    <div className="content-stretch flex h-[14.401px] items-start relative shrink-0 w-full" data-name="Text">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-center text-nowrap">Friday</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute content-stretch flex flex-col h-[55.977px] items-start left-[761.99px] pb-0 pl-[57.915px] pr-[59.023px] pt-[22.64px] top-0 w-[152.404px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Text6 />
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute content-stretch flex h-[14.401px] items-start left-[964.97px] top-[22.64px] w-[51.217px]" data-name="Text">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-center text-nowrap">Saturday</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute bg-[rgba(249,249,249,0.14)] border-[#e8e8e8] border-[0px_0px_1.108px] border-solid h-[57.084px] left-0 top-0 w-[1066.794px]" data-name="Container">
      <Container9 />
      <Container10 />
      <Container11 />
      <Container12 />
      <Container13 />
      <Container14 />
      <Text7 />
    </div>
  );
}

function Container16() {
  return <div className="absolute bg-[rgba(249,249,249,0.05)] border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid h-[139.994px] left-0 top-0 w-[152.387px]" data-name="Container" />;
}

function Container17() {
  return <div className="absolute bg-[rgba(249,249,249,0.05)] border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid h-[139.994px] left-[152.39px] top-0 w-[152.404px]" data-name="Container" />;
}

function Container18() {
  return <div className="absolute bg-[rgba(249,249,249,0.05)] border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid h-[139.994px] left-[304.79px] top-0 w-[152.404px]" data-name="Container" />;
}

function Container19() {
  return <div className="absolute bg-[rgba(249,249,249,0.05)] border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid h-[139.994px] left-[457.19px] top-0 w-[152.387px]" data-name="Container" />;
}

function Text8() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">1</p>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-[609.58px] pb-[1.108px] pl-[11.995px] pr-[132.966px] pt-[11.995px] top-0 w-[152.404px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text8 />
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">2</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-[761.99px] pb-[1.108px] pl-[11.995px] pr-[130.716px] pt-[11.995px] top-0 w-[152.404px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text9 />
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">3</p>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-[914.39px] pb-[1.108px] pl-[11.995px] pr-[130.197px] pt-[11.995px] top-0 w-[152.387px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text10 />
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">4</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-0 pb-[1.108px] pl-[11.995px] pr-[130.11px] pt-[11.995px] top-[139.99px] w-[152.387px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text11 />
    </div>
  );
}

function Text12() {
  return (
    <div className="absolute h-[23.99px] left-[11.99px] top-[11.99px] w-[9.728px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">5</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute bg-white border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid h-[139.994px] left-[152.39px] top-[139.99px] w-[152.404px]" data-name="Container">
      <Text12 />
    </div>
  );
}

function Text13() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">6</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-[304.79px] pb-[1.108px] pl-[11.995px] pr-[130.422px] pt-[11.995px] top-[139.99px] w-[152.404px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text13 />
    </div>
  );
}

function Text14() {
  return (
    <div className="absolute h-[23.99px] left-[11.99px] top-[11.99px] w-[9.139px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">7</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute bg-white border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid h-[139.994px] left-[457.19px] top-[139.99px] w-[152.387px]" data-name="Container">
      <Text14 />
    </div>
  );
}

function Text15() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">8</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-[609.58px] pb-[1.108px] pl-[11.995px] pr-[130.543px] pt-[11.995px] top-[139.99px] w-[152.404px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text15 />
    </div>
  );
}

function Text16() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">9</p>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-[761.99px] pb-[1.108px] pl-[11.995px] pr-[130.422px] pt-[11.995px] top-[139.99px] w-[152.404px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text16 />
    </div>
  );
}

function Text17() {
  return (
    <div className="absolute h-[23.99px] left-[11.99px] top-[11.99px] w-[17.43px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">10</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute bg-white border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid h-[139.994px] left-[914.39px] top-[139.99px] w-[152.387px]" data-name="Container">
      <Text17 />
    </div>
  );
}

function Text18() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">11</p>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-0 pb-[1.108px] pl-[11.995px] pr-[125.523px] pt-[11.995px] top-[279.99px] w-[152.387px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text18 />
    </div>
  );
}

function Text19() {
  return (
    <div className="absolute h-[23.99px] left-[11.99px] top-[11.99px] w-[17.118px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">12</p>
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute bg-white border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid h-[139.994px] left-[152.39px] top-[279.99px] w-[152.404px]" data-name="Container">
      <Text19 />
    </div>
  );
}

function Text20() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">13</p>
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-[304.79px] pb-[1.108px] pl-[11.995px] pr-[122.789px] pt-[11.995px] top-[279.99px] w-[152.404px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text20 />
    </div>
  );
}

function Text21() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">14</p>
    </div>
  );
}

function Container33() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-[457.19px] pb-[1.108px] pl-[11.995px] pr-[122.685px] pt-[11.995px] top-[279.99px] w-[152.387px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text21 />
    </div>
  );
}

function Text22() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">15</p>
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-[609.58px] pb-[1.108px] pl-[11.995px] pr-[123.239px] pt-[11.995px] top-[279.99px] w-[152.404px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text22 />
    </div>
  );
}

function Text23() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">16</p>
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-[761.99px] pb-[1.108px] pl-[11.995px] pr-[122.996px] pt-[11.995px] top-[279.99px] w-[152.404px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text23 />
    </div>
  );
}

function Text24() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">17</p>
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-[914.39px] pb-[1.108px] pl-[11.995px] pr-[123.827px] pt-[11.995px] top-[279.99px] w-[152.387px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text24 />
    </div>
  );
}

function Text25() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">18</p>
    </div>
  );
}

function Container37() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-0 pb-[1.108px] pl-[11.995px] pr-[123.1px] pt-[11.995px] top-[419.98px] w-[152.387px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text25 />
    </div>
  );
}

function Text26() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">19</p>
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-[152.39px] pb-[1.108px] pl-[11.995px] pr-[122.996px] pt-[11.995px] top-[419.98px] w-[152.404px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text26 />
    </div>
  );
}

function Text27() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">20</p>
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-[304.79px] pb-[1.108px] pl-[11.995px] pr-[120.729px] pt-[11.995px] top-[419.98px] w-[152.404px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text27 />
    </div>
  );
}

function Text28() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">21</p>
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-[457.19px] pb-[1.108px] pl-[11.995px] pr-[123.273px] pt-[11.995px] top-[419.98px] w-[152.387px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text28 />
    </div>
  );
}

function Text29() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">22</p>
    </div>
  );
}

function Container41() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-[609.58px] pb-[1.108px] pl-[11.995px] pr-[121.04px] pt-[11.995px] top-[419.98px] w-[152.404px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text29 />
    </div>
  );
}

function Text30() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">23</p>
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-[761.99px] pb-[1.108px] pl-[11.995px] pr-[120.539px] pt-[11.995px] top-[419.98px] w-[152.404px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text30 />
    </div>
  );
}

function Text31() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">24</p>
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-[914.39px] pb-[1.108px] pl-[11.995px] pr-[120.677px] pt-[11.995px] top-[419.98px] w-[152.387px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text31 />
    </div>
  );
}

function Text32() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">25</p>
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-0 pb-[1.108px] pl-[11.995px] pr-[120.971px] pt-[11.995px] top-[559.97px] w-[152.387px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text32 />
    </div>
  );
}

function Text33() {
  return (
    <div className="absolute h-[23.99px] left-[11.99px] top-[11.99px] w-[19.663px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">26</p>
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute bg-white border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid h-[139.994px] left-[152.39px] top-[559.97px] w-[152.404px]" data-name="Container">
      <Text33 />
    </div>
  );
}

function Text34() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">27</p>
    </div>
  );
}

function Container46() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-[304.79px] pb-[1.108px] pl-[11.995px] pr-[121.594px] pt-[11.995px] top-[559.97px] w-[152.404px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text34 />
    </div>
  );
}

function Text35() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">28</p>
    </div>
  );
}

function Container47() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-[457.19px] pb-[1.108px] pl-[11.995px] pr-[120.85px] pt-[11.995px] top-[559.97px] w-[152.387px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text35 />
    </div>
  );
}

function Text36() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">29</p>
    </div>
  );
}

function Container48() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-[609.58px] pb-[1.108px] pl-[11.995px] pr-[120.746px] pt-[11.995px] top-[559.97px] w-[152.404px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text36 />
    </div>
  );
}

function Text37() {
  return (
    <div className="h-[23.99px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#202020] text-[16px] text-nowrap top-[-0.78px]">30</p>
    </div>
  );
}

function Container49() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.994px] items-start left-[761.99px] pb-[1.108px] pl-[11.995px] pr-[120.227px] pt-[11.995px] top-[559.97px] w-[152.404px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1.108px_1.108px_0px] border-solid inset-0 pointer-events-none" />
      <Text37 />
    </div>
  );
}

function Text38() {
  return (
    <div className="absolute bg-white h-[139.994px] left-[914.39px] top-[559.97px] w-[152.387px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[11.99px] not-italic text-[#202020] text-[16px] text-nowrap top-[11.21px]">31</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[7.2px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#7c3aed] text-[10px] text-nowrap">
        <p className="leading-[16px] overflow-ellipsis overflow-hidden">{`Rapid  Inspection`}</p>
      </div>
    </div>
  );
}

function Div() {
  return (
    <div className="bg-[#f5f3ff] h-[29px] relative rounded-[4px] shrink-0 w-full" data-name="DIV-97">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[8px] py-[4px] relative size-full">
          <Frame />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#7c3aed] border-[0px_0px_0px_1px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[7.2px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#2563eb] text-[10px] text-nowrap">
        <p className="leading-[16px] overflow-ellipsis overflow-hidden">{`Detailed  Inspection`}</p>
      </div>
    </div>
  );
}

function Div1() {
  return (
    <div className="bg-[#eff6ff] h-[29px] relative rounded-[4px] shrink-0 w-full" data-name="DIV-97">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[8px] py-[4px] relative size-full">
          <Frame1 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#2563eb] border-[0px_0px_0px_1px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[7.2px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#e11d48] text-[9px] text-nowrap">
        <p className="leading-[18px] overflow-ellipsis overflow-hidden">+2 Events</p>
      </div>
    </div>
  );
}

function Div2() {
  return (
    <div className="content-stretch flex h-[18px] items-center overflow-clip p-[4px] relative rounded-[4px] shrink-0 w-[52.5px]" data-name="DIV-97">
      <Frame2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[7.2px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#e11d48] text-[9px] text-nowrap">
        <p className="leading-[18px] overflow-ellipsis overflow-hidden">+2 Events</p>
      </div>
    </div>
  );
}

function Div3() {
  return (
    <div className="content-stretch flex h-[18px] items-center justify-between overflow-clip p-[4px] relative rounded-[4px] shrink-0 w-[52.5px]" data-name="DIV-97">
      <Frame3 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex gap-[100px] items-center relative shrink-0">
      <Div2 />
      {[...Array(5).keys()].map((_, i) => (
        <Div3 key={i} />
      ))}
    </div>
  );
}

function Frame22() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] items-start left-[609.89px] top-[40.81px] w-[1067px]">
      <Div />
      <Div1 />
      <Frame21 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[7.2px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#7c3aed] text-[10px] text-nowrap">
        <p className="leading-[16px] overflow-ellipsis overflow-hidden">{`Rapid  Inspection`}</p>
      </div>
    </div>
  );
}

function Div4() {
  return (
    <div className="bg-[#f5f3ff] h-[29px] relative rounded-[4px] shrink-0 w-full" data-name="DIV-97">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[8px] py-[4px] relative size-full">
          <Frame4 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#7c3aed] border-[0px_0px_0px_1px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[7.2px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#2563eb] text-[10px] text-nowrap">
        <p className="leading-[16px] overflow-ellipsis overflow-hidden">{`Detailed  Inspection`}</p>
      </div>
    </div>
  );
}

function Div5() {
  return (
    <div className="bg-[#eff6ff] h-[29px] relative rounded-[4px] shrink-0 w-full" data-name="DIV-97">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[8px] py-[4px] relative size-full">
          <Frame5 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#2563eb] border-[0px_0px_0px_1px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[7.2px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#e11d48] text-[9px] text-nowrap">
        <p className="leading-[18px] overflow-ellipsis overflow-hidden">+2 Events</p>
      </div>
    </div>
  );
}

function Div6() {
  return (
    <div className="content-stretch flex h-[18px] items-center overflow-clip p-[4px] relative rounded-[4px] shrink-0 w-[52.5px]" data-name="DIV-97">
      <Frame6 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[7.2px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#e11d48] text-[9px] text-nowrap">
        <p className="leading-[18px] overflow-ellipsis overflow-hidden">+2 Events</p>
      </div>
    </div>
  );
}

function Div7() {
  return (
    <div className="content-stretch flex h-[18px] items-center justify-between overflow-clip p-[4px] relative rounded-[4px] shrink-0 w-[52.5px]" data-name="DIV-97">
      <Frame7 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex gap-[100px] items-center relative shrink-0">
      <Div6 />
      {[...Array(5).keys()].map((_, i) => (
        <Div7 key={i} />
      ))}
    </div>
  );
}

function Frame24() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] items-start left-[-0.11px] top-[321.81px] w-[1067px]">
      <Div4 />
      <Div5 />
      <Frame26 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[7.2px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#7c3aed] text-[10px] text-nowrap">
        <p className="leading-[16px] overflow-ellipsis overflow-hidden">{`Rapid  Inspection`}</p>
      </div>
    </div>
  );
}

function Div8() {
  return (
    <div className="bg-[#f5f3ff] h-[29px] relative rounded-[4px] shrink-0 w-full" data-name="DIV-97">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[8px] py-[4px] relative size-full">
          <Frame8 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#7c3aed] border-[0px_0px_0px_1px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[7.2px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#2563eb] text-[10px] text-nowrap">
        <p className="leading-[16px] overflow-ellipsis overflow-hidden">{`Detailed  Inspection`}</p>
      </div>
    </div>
  );
}

function Div9() {
  return (
    <div className="bg-[#eff6ff] h-[29px] relative rounded-[4px] shrink-0 w-full" data-name="DIV-97">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[8px] py-[4px] relative size-full">
          <Frame9 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#2563eb] border-[0px_0px_0px_1px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[7.2px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#e11d48] text-[9px] text-nowrap">
        <p className="leading-[18px] overflow-ellipsis overflow-hidden">+2 Events</p>
      </div>
    </div>
  );
}

function Div10() {
  return (
    <div className="content-stretch flex h-[18px] items-center overflow-clip p-[4px] relative rounded-[4px] shrink-0 w-[52.5px]" data-name="DIV-97">
      <Frame10 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[7.2px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#e11d48] text-[9px] text-nowrap">
        <p className="leading-[18px] overflow-ellipsis overflow-hidden">+2 Events</p>
      </div>
    </div>
  );
}

function Div11() {
  return (
    <div className="content-stretch flex h-[18px] items-center justify-between overflow-clip p-[4px] relative rounded-[4px] shrink-0 w-[52.5px]" data-name="DIV-97">
      <Frame11 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex gap-[100px] items-center relative shrink-0">
      <Div10 />
      {[...Array(5).keys()].map((_, i) => (
        <Div11 key={i} />
      ))}
    </div>
  );
}

function Frame28() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] items-start left-0 top-[9px] w-[1067px]">
      <Div8 />
      <Div9 />
      <Frame27 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="absolute h-[98px] left-[-0.11px] top-[181.81px] w-[1067px]">
      <Frame28 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[7.2px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#7c3aed] text-[10px] text-nowrap">
        <p className="leading-[16px] overflow-ellipsis overflow-hidden">{`Rapid  Inspection`}</p>
      </div>
    </div>
  );
}

function Div12() {
  return (
    <div className="bg-[#f5f3ff] h-[29px] relative rounded-[4px] shrink-0 w-full" data-name="DIV-97">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[8px] py-[4px] relative size-full">
          <Frame12 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#7c3aed] border-[0px_0px_0px_1px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[7.2px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#2563eb] text-[10px] text-nowrap">
        <p className="leading-[16px] overflow-ellipsis overflow-hidden">{`Detailed  Inspection`}</p>
      </div>
    </div>
  );
}

function Div13() {
  return (
    <div className="bg-[#eff6ff] h-[29px] relative rounded-[4px] shrink-0 w-full" data-name="DIV-97">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[8px] py-[4px] relative size-full">
          <Frame13 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#2563eb] border-[0px_0px_0px_1px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-[7.2px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#e11d48] text-[9px] text-nowrap">
        <p className="leading-[18px] overflow-ellipsis overflow-hidden">+2 Events</p>
      </div>
    </div>
  );
}

function Div14() {
  return (
    <div className="content-stretch flex h-[18px] items-center overflow-clip p-[4px] relative rounded-[4px] shrink-0 w-[52.5px]" data-name="DIV-97">
      <Frame14 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-[7.2px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#e11d48] text-[9px] text-nowrap">
        <p className="leading-[18px] overflow-ellipsis overflow-hidden">+2 Events</p>
      </div>
    </div>
  );
}

function Div15() {
  return (
    <div className="content-stretch flex h-[18px] items-center justify-between overflow-clip p-[4px] relative rounded-[4px] shrink-0 w-[52.5px]" data-name="DIV-97">
      <Frame15 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex gap-[100px] items-center relative shrink-0">
      <Div14 />
      {[...Array(5).keys()].map((_, i) => (
        <Div15 key={i} />
      ))}
    </div>
  );
}

function Frame23() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] items-start left-[-0.11px] top-[461.81px] w-[1067px]">
      <Div12 />
      <Div13 />
      <Frame29 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[7.2px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#7c3aed] text-[10px] text-nowrap">
        <p className="leading-[16px] overflow-ellipsis overflow-hidden">{`Rapid  Inspection`}</p>
      </div>
    </div>
  );
}

function Div16() {
  return (
    <div className="bg-[#f5f3ff] h-[29px] relative rounded-[4px] shrink-0 w-full" data-name="DIV-97">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[8px] py-[4px] relative size-full">
          <Frame16 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#7c3aed] border-[0px_0px_0px_1px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[7.2px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#2563eb] text-[10px] text-nowrap">
        <p className="leading-[16px] overflow-ellipsis overflow-hidden">{`Detailed  Inspection`}</p>
      </div>
    </div>
  );
}

function Div17() {
  return (
    <div className="bg-[#eff6ff] h-[29px] relative rounded-[4px] shrink-0 w-full" data-name="DIV-97">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[8px] py-[4px] relative size-full">
          <Frame17 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#2563eb] border-[0px_0px_0px_1px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[7.2px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#e11d48] text-[9px] text-nowrap">
        <p className="leading-[18px] overflow-ellipsis overflow-hidden">+2 Events</p>
      </div>
    </div>
  );
}

function Div18() {
  return (
    <div className="content-stretch flex h-[18px] items-center overflow-clip p-[4px] relative rounded-[4px] shrink-0 w-[52.5px]" data-name="DIV-97">
      <Frame18 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[7.2px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#e11d48] text-[9px] text-nowrap">
        <p className="leading-[18px] overflow-ellipsis overflow-hidden">+2 Events</p>
      </div>
    </div>
  );
}

function Div19() {
  return (
    <div className="content-stretch flex h-[18px] items-center justify-between overflow-clip p-[4px] relative rounded-[4px] shrink-0 w-[52.5px]" data-name="DIV-97">
      <Frame19 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex gap-[100px] items-center relative shrink-0">
      <Div18 />
      {[...Array(5).keys()].map((_, i) => (
        <Div19 key={i} />
      ))}
    </div>
  );
}

function Frame25() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] items-start left-[-0.11px] top-[601.81px] w-[1067px]">
      <Div16 />
      <Div17 />
      <Frame30 />
    </div>
  );
}

function Container50() {
  return (
    <div className="absolute h-[699.968px] left-0 top-[57.08px] w-[1066.794px]" data-name="Container">
      <Container16 />
      <Container17 />
      <Container18 />
      <Container19 />
      <Container20 />
      <Container21 />
      <Container22 />
      <Container23 />
      <Container24 />
      <Container25 />
      <Container26 />
      <Container27 />
      <Container28 />
      <Container29 />
      <Container30 />
      <Container31 />
      <Container32 />
      <Container33 />
      <Container34 />
      <Container35 />
      <Container36 />
      <Container37 />
      <Container38 />
      <Container39 />
      <Container40 />
      <Container41 />
      <Container42 />
      <Container43 />
      <Container44 />
      <Container45 />
      <Container46 />
      <Container47 />
      <Container48 />
      <Container49 />
      <Text38 />
      <Frame22 />
      <Frame24 />
      <Frame20 />
      <Frame23 />
      <Frame25 />
    </div>
  );
}

function Container51() {
  return (
    <div className="absolute bg-white border-[#e8e8e8] border-[1.108px] border-solid h-[759px] left-[24px] overflow-clip rounded-[8px] top-[167px] w-[1069px]" data-name="Container">
      <Container15 />
      <Container50 />
    </div>
  );
}

export default function Container52() {
  return (
    <div className="relative size-full" data-name="Container">
      <Container3 />
      <Container8 />
      <Container51 />
    </div>
  );
}