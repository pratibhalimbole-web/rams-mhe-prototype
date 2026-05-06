import svgPaths from "./svg-tliwfme4jy";

function Input() {
  return (
    <div className="bg-white content-stretch flex h-[38px] items-center pl-[41px] pr-[13px] py-[9px] relative rounded-[16px] shrink-0 w-[320px]" data-name="INPUT">
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] left-[41px] not-italic text-[14px] text-[rgba(32,32,32,0.6)] top-[19px] translate-y-[-50%] w-[266px]">
        <p className="leading-[20px]">Search issues...</p>
      </div>
    </div>
  );
}

function MagnifyingGlass() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="magnifying-glass">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="magnifying-glass">
          <path d={svgPaths.p14ae4680} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Div2() {
  return (
    <div className="absolute content-stretch flex h-[38px] items-center left-0 pl-[12px] pr-0 py-0 top-0 w-[32px]" data-name="DIV-28">
      <MagnifyingGlass />
    </div>
  );
}

function Div1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[38px] items-start left-0 top-0 w-[320px]" data-name="DIV-26">
      <Input />
      <Div2 />
    </div>
  );
}

function Div6() {
  return (
    <div className="content-stretch flex flex-col h-[38px] items-start relative shrink-0 w-[384px]" data-name="DIV-86">
      <Div1 />
    </div>
  );
}

function Group() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9925 12.6667">
        <g id="Group">
          <g id="Vector">
            <path d={svgPaths.p21148f00} fill="#202020" />
            <path d={svgPaths.p21148f00} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p21148f00} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p21148f00} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p21148f00} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p21148f00} fill="black" fillOpacity="0.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute h-[16px] left-[0.01px] overflow-clip top-[4px] w-[16.656px]" data-name="Icon-110">
      <div className="absolute flex inset-[10.42%_14%] items-center justify-center">
        <div className="flex-none h-[12.667px] scale-y-[-100%] w-[11.993px]">
          <Group />
        </div>
      </div>
    </div>
  );
}

function I1() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-[16.672px]" data-name="I-109">
      <Icon1 />
    </div>
  );
}

function Div9() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[16px]" data-name="DIV-108">
      <I1 />
    </div>
  );
}

function MarginWrap() {
  return (
    <div className="content-stretch flex items-start pl-0 pr-[6px] py-0 relative shrink-0" data-name="margin-wrap">
      <Div9 />
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-white content-stretch flex h-[38px] items-center px-[16px] py-[11px] relative rounded-[8px] shrink-0" data-name="BUTTON-107">
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <MarginWrap />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center text-nowrap">
        <p className="leading-[20px]">{`Risk Assessment Chart `}</p>
      </div>
    </div>
  );
}

function MarginWrap1() {
  return (
    <div className="content-stretch flex h-[38px] items-start pl-[12px] pr-0 py-0 relative shrink-0" data-name="margin-wrap">
      <Button2 />
    </div>
  );
}

function Group1() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.3275 9.33333">
        <g id="Group">
          <path d={svgPaths.p1b7e4580} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, #E8E8E8)" />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute h-[16px] left-[0.01px] overflow-clip top-[4px] w-[16.656px]" data-name="Icon-104">
      <div className="absolute flex inset-[20.83%_22%] items-center justify-center">
        <div className="flex-none h-[9.333px] scale-y-[-100%] w-[9.328px]">
          <Group1 />
        </div>
      </div>
    </div>
  );
}

function I() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-[16.672px]" data-name="I-103">
      <Icon />
    </div>
  );
}

function Div8() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[16px]" data-name="DIV-102">
      <I />
    </div>
  );
}

function MarginWrap2() {
  return (
    <div className="content-stretch flex items-start pl-0 pr-[6px] py-0 relative shrink-0" data-name="margin-wrap">
      <Div8 />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#1b59f8] content-stretch flex h-[38px] items-center px-[16px] py-[10px] relative rounded-[8px] shrink-0" data-name="BUTTON-101">
      <MarginWrap2 />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white">
        <p className="leading-[20px]">{`Add New Element `}</p>
      </div>
    </div>
  );
}

function MarginWrap3() {
  return (
    <div className="content-stretch flex h-[38px] items-start pl-[12px] pr-0 py-0 relative shrink-0" data-name="margin-wrap">
      <Button1 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <MarginWrap1 />
      <MarginWrap3 />
    </div>
  );
}

function Div7() {
  return (
    <div className="content-stretch flex h-[38px] items-center justify-end relative shrink-0" data-name="DIV-92">
      <Frame1 />
    </div>
  );
}

function Div5() {
  return (
    <div className="content-center flex flex-wrap gap-[16px] h-[37px] items-center justify-between relative shrink-0 w-[1045px]" data-name="DIV-85">
      <Div6 />
      <Div7 />
    </div>
  );
}

function MarginWrap4() {
  return (
    <div className="content-stretch flex h-[38px] items-start pb-[24px] pt-0 px-0 relative shrink-0" data-name="margin-wrap">
      <Div5 />
    </div>
  );
}

function Div() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[70px] items-start left-[-1px] p-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] top-[-1px] w-[1077px]" data-name="DIV-24">
      <MarginWrap4 />
    </div>
  );
}

function Th() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start justify-center px-[24px] py-[12px] relative shrink-0 w-[189px]" data-name="TH-87">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] text-nowrap">
        <p className="leading-[20px]">Element ID</p>
      </div>
    </div>
  );
}

function Th1() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start justify-center px-[24px] py-[12px] relative shrink-0 w-[255px]" data-name="TH-90">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] text-nowrap">
        <p className="leading-[20px]">Element Name</p>
      </div>
    </div>
  );
}

function Th2() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start justify-center px-[24px] py-[12px] relative shrink-0 w-[206px]" data-name="TH-90">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] text-nowrap">
        <p className="leading-[20px]">Category</p>
      </div>
    </div>
  );
}

function Th4() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start justify-center px-[24px] py-[12px] relative shrink-0 w-[228px]" data-name="TH-102">
      <div className="-webkit-box flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[12px] text-nowrap">
        <p className="leading-[20px]">Status</p>
      </div>
    </div>
  );
}

function Th3() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start justify-center px-[24px] py-[12px] relative shrink-0 w-[200px]" data-name="TH-93">
      <div className="-webkit-box flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[12px] text-nowrap">
        <p className="leading-[20px]">Action</p>
      </div>
    </div>
  );
}

function Tr() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex h-[40px] items-start relative shrink-0 w-full" data-name="TR-86">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Th />
      <Th1 />
      <Th2 />
      <Th4 />
      <Th3 />
    </div>
  );
}

function Thead() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start relative shrink-0" data-name="THEAD-85">
      <Tr />
    </div>
  );
}

function A() {
  return (
    <div className="content-center flex flex-wrap h-[43px] items-center relative shrink-0" data-name="A-148">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">BOQ-APR25</p>
      </div>
    </div>
  );
}

function Td() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[189px]" data-name="TD-147">
      <A />
    </div>
  );
}

function Td1() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[256px]" data-name="TD-151">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] w-[171px]">
        <p className="leading-[20px]">Baseplate</p>
      </div>
    </div>
  );
}

function Component() {
  return (
    <div className="bg-[#ede9fe] content-stretch flex h-[26px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0 w-[84.313px]" data-name="Component 4">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#7c3aed] text-[12px] text-center text-nowrap text-shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <p className="leading-[20px]">Structural</p>
      </div>
    </div>
  );
}

function Td2() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[206px]" data-name="TD-151">
      <Component />
    </div>
  );
}

function TimeToggle() {
  return <div className="opacity-0 shrink-0 size-0" data-name="time-toggle-206" />;
}

function Before() {
  return <div className="absolute bg-white left-[3px] rounded-[50px] size-[18px] top-[3px]" data-name="::before-208" />;
}

function Span() {
  return (
    <div className="absolute bg-[#f0f0f0] content-stretch flex flex-col h-[24px] items-start left-0 rounded-[24px] top-0 w-[44px]" data-name="SPAN-207">
      <Before />
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col h-[24px] items-start relative shrink-0 w-[44px]" data-name="LABEL-205">
      <TimeToggle />
      <Span />
    </div>
  );
}

function Span2() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0" data-name="SPAN-209">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Inactive</p>
      </div>
    </div>
  );
}

function Div10() {
  return (
    <div className="content-stretch flex gap-[12px] h-[24px] items-center relative shrink-0" data-name="DIV-201">
      <Label />
      <Span2 />
    </div>
  );
}

function Td4() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[227px]" data-name="TD-168">
      <Div10 />
    </div>
  );
}

function Group2() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.3325 10.5">
        <g id="Group">
          <g id="Vector">
            <path d={svgPaths.pc399900} fill="#202020" />
            <path d={svgPaths.pc399900} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.pc399900} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.pc399900} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.pc399900} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.pc399900} fill="black" fillOpacity="0.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute h-[14px] left-[0.01px] overflow-clip top-[3px] w-[14.578px]" data-name="Icon-233">
      <div className="absolute flex inset-[12.5%_42%] items-center justify-center">
        <div className="flex-none h-[10.5px] scale-y-[-100%] w-[2.332px]">
          <Group2 />
        </div>
      </div>
    </div>
  );
}

function I2() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-center relative shrink-0 w-[14.594px]" data-name="I-232">
      <Icon2 />
    </div>
  );
}

function Div21() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[20px]" data-name="DIV-231">
      <I2 />
    </div>
  );
}

function ActionBtn() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 size-[20px]" data-name="actionBtn1-230">
      <Div21 />
    </div>
  );
}

function Div19() {
  return (
    <div className="bg-[#f0f0f0] content-stretch flex items-center relative rounded-[2px] shrink-0 size-[20px]" data-name="DIV-229">
      <ActionBtn />
    </div>
  );
}

function Td3() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[200px]" data-name="TD-154">
      <Div19 />
    </div>
  );
}

function Tr1() {
  return (
    <div className="bg-white content-stretch flex h-[68px] items-start pb-0 pt-px px-0 relative shrink-0" data-name="TR-146">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Td />
      <Td1 />
      <Td2 />
      <Td4 />
      <Td3 />
    </div>
  );
}

function A1() {
  return (
    <div className="content-center flex flex-wrap h-[43px] items-center relative shrink-0" data-name="A-182">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">BOQ-APR25</p>
      </div>
    </div>
  );
}

function Td5() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[189px]" data-name="TD-181">
      <A1 />
    </div>
  );
}

function Td6() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[256px]" data-name="TD-185">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] w-[153px]">
        <p className="leading-[20px]">Upright</p>
      </div>
    </div>
  );
}

function Component1() {
  return (
    <div className="bg-[#ede9fe] content-stretch flex h-[26px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0 w-[84.313px]" data-name="Component 4">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#7c3aed] text-[12px] text-center text-nowrap text-shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <p className="leading-[20px]">Structural</p>
      </div>
    </div>
  );
}

function Td7() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[206px]" data-name="TD-185">
      <Component1 />
    </div>
  );
}

function TimeToggle1() {
  return <div className="opacity-0 shrink-0 size-0" data-name="time-toggle-206" />;
}

function Before1() {
  return <div className="absolute bg-white left-[3px] rounded-[50px] size-[18px] top-[3px]" data-name="::before-208" />;
}

function Span1() {
  return (
    <div className="absolute bg-[#1b59f8] content-stretch flex flex-col h-[24px] items-start left-0 rounded-[24px] top-0 w-[44px]" data-name="SPAN-207">
      <Before1 />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-col h-[24px] items-start relative shrink-0 w-[44px]" data-name="LABEL-205">
      <TimeToggle1 />
      <Span1 />
    </div>
  );
}

function Span3() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0" data-name="SPAN-209">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Active</p>
      </div>
    </div>
  );
}

function Div11() {
  return (
    <div className="content-stretch flex gap-[12px] h-[24px] items-center relative shrink-0" data-name="DIV-201">
      <Label1 />
      <Span3 />
    </div>
  );
}

function Td9() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[227px]" data-name="TD-202">
      <Div11 />
    </div>
  );
}

function Group3() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.3325 10.5">
        <g id="Group">
          <path d={svgPaths.pc399900} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute h-[14px] left-[0.01px] overflow-clip top-[3px] w-[14.578px]" data-name="Icon-233">
      <div className="absolute flex inset-[12.5%_42%] items-center justify-center">
        <div className="flex-none h-[10.5px] scale-y-[-100%] w-[2.332px]">
          <Group3 />
        </div>
      </div>
    </div>
  );
}

function I3() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-center relative shrink-0 w-[14.594px]" data-name="I-232">
      <Icon3 />
    </div>
  );
}

function Div22() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[20px]" data-name="DIV-231">
      <I3 />
    </div>
  );
}

function ActionBtn1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 size-[20px]" data-name="actionBtn1-230">
      <Div22 />
    </div>
  );
}

function Div20() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 size-[20px]" data-name="DIV-229">
      <ActionBtn1 />
    </div>
  );
}

function Td8() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[200px]" data-name="TD-188">
      <Div20 />
    </div>
  );
}

function Tr2() {
  return (
    <div className="content-stretch flex h-[68px] items-start pb-0 pt-px px-0 relative shrink-0" data-name="TR-180">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Td5 />
      <Td6 />
      <Td7 />
      <Td9 />
      <Td8 />
    </div>
  );
}

function A2() {
  return (
    <div className="content-center flex flex-wrap h-[43px] items-center relative shrink-0" data-name="A-216">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">BOQ-MAR25</p>
      </div>
    </div>
  );
}

function Td10() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[189px]" data-name="TD-215">
      <A2 />
    </div>
  );
}

function Td14() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[256px]" data-name="TD-219">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] w-[143px]">
        <p className="leading-[20px]">Beam</p>
      </div>
    </div>
  );
}

function Component2() {
  return (
    <div className="bg-[#ede9fe] content-stretch flex h-[26px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0 w-[84.313px]" data-name="Component 4">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#7c3aed] text-[12px] text-center text-nowrap text-shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <p className="leading-[20px]">Structural</p>
      </div>
    </div>
  );
}

function Td15() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[206px]" data-name="TD-219">
      <Component2 />
    </div>
  );
}

function TimeToggle2() {
  return <div className="opacity-0 shrink-0 size-0" data-name="time-toggle-206" />;
}

function Before2() {
  return <div className="absolute bg-white left-[3px] rounded-[50px] size-[18px] top-[3px]" data-name="::before-208" />;
}

function Span4() {
  return (
    <div className="absolute bg-[#1b59f8] content-stretch flex flex-col h-[24px] items-start left-0 rounded-[24px] top-0 w-[44px]" data-name="SPAN-207">
      <Before2 />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex flex-col h-[24px] items-start relative shrink-0 w-[44px]" data-name="LABEL-205">
      <TimeToggle2 />
      <Span4 />
    </div>
  );
}

function Span5() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0" data-name="SPAN-209">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Active</p>
      </div>
    </div>
  );
}

function Div12() {
  return (
    <div className="content-stretch flex gap-[12px] h-[24px] items-center relative shrink-0" data-name="DIV-201">
      <Label2 />
      <Span5 />
    </div>
  );
}

function Td26() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[227px]" data-name="TD-236">
      <Div12 />
    </div>
  );
}

function Group4() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.3325 10.5">
        <g id="Group">
          <path d={svgPaths.pc399900} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute h-[14px] left-[0.01px] overflow-clip top-[3px] w-[14.578px]" data-name="Icon-233">
      <div className="absolute flex inset-[12.5%_42%] items-center justify-center">
        <div className="flex-none h-[10.5px] scale-y-[-100%] w-[2.332px]">
          <Group4 />
        </div>
      </div>
    </div>
  );
}

function I4() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-center relative shrink-0 w-[14.594px]" data-name="I-232">
      <Icon4 />
    </div>
  );
}

function Div23() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[20px]" data-name="DIV-231">
      <I4 />
    </div>
  );
}

function ActionBtn2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 size-[20px]" data-name="actionBtn1-230">
      <Div23 />
    </div>
  );
}

function Div24() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 size-[20px]" data-name="DIV-229">
      <ActionBtn2 />
    </div>
  );
}

function Td17() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[200px]" data-name="TD-222">
      <Div24 />
    </div>
  );
}

function Tr3() {
  return (
    <div className="bg-white content-stretch flex h-[68px] items-start pb-0 pt-px px-0 relative shrink-0" data-name="TR-214">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Td10 />
      <Td14 />
      <Td15 />
      <Td26 />
      <Td17 />
    </div>
  );
}

function A6() {
  return (
    <div className="content-center flex flex-wrap h-[43px] items-center relative shrink-0" data-name="A-250">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">BOQ-MAR25</p>
      </div>
    </div>
  );
}

function Td30() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[189px]" data-name="TD-249">
      <A6 />
    </div>
  );
}

function Td31() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[256px]" data-name="TD-253">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] w-[155px]">
        <p className="leading-[20px]">Bracing</p>
      </div>
    </div>
  );
}

function Component3() {
  return (
    <div className="bg-[#ede9fe] content-stretch flex h-[26px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0 w-[84.313px]" data-name="Component 4">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#7c3aed] text-[12px] text-center text-nowrap text-shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <p className="leading-[20px]">Structural</p>
      </div>
    </div>
  );
}

function Td32() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[206px]" data-name="TD-253">
      <Component3 />
    </div>
  );
}

function TimeToggle3() {
  return <div className="opacity-0 shrink-0 size-0" data-name="time-toggle-206" />;
}

function Before3() {
  return <div className="absolute bg-white left-[3px] rounded-[50px] size-[18px] top-[3px]" data-name="::before-208" />;
}

function Span6() {
  return (
    <div className="absolute bg-[#1b59f8] content-stretch flex flex-col h-[24px] items-start left-0 rounded-[24px] top-0 w-[44px]" data-name="SPAN-207">
      <Before3 />
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex flex-col h-[24px] items-start relative shrink-0 w-[44px]" data-name="LABEL-205">
      <TimeToggle3 />
      <Span6 />
    </div>
  );
}

function Span7() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0" data-name="SPAN-209">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Active</p>
      </div>
    </div>
  );
}

function Div13() {
  return (
    <div className="content-stretch flex gap-[12px] h-[24px] items-center relative shrink-0" data-name="DIV-201">
      <Label3 />
      <Span7 />
    </div>
  );
}

function Td34() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[227px]" data-name="TD-270">
      <Div13 />
    </div>
  );
}

function Group5() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.3325 10.5">
        <g id="Group">
          <path d={svgPaths.pc399900} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute h-[14px] left-[0.01px] overflow-clip top-[3px] w-[14.578px]" data-name="Icon-233">
      <div className="absolute flex inset-[12.5%_42%] items-center justify-center">
        <div className="flex-none h-[10.5px] scale-y-[-100%] w-[2.332px]">
          <Group5 />
        </div>
      </div>
    </div>
  );
}

function I5() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-center relative shrink-0 w-[14.594px]" data-name="I-232">
      <Icon5 />
    </div>
  );
}

function Div25() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[20px]" data-name="DIV-231">
      <I5 />
    </div>
  );
}

function ActionBtn3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 size-[20px]" data-name="actionBtn1-230">
      <Div25 />
    </div>
  );
}

function Div26() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 size-[20px]" data-name="DIV-229">
      <ActionBtn3 />
    </div>
  );
}

function Td33() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[200px]" data-name="TD-256">
      <Div26 />
    </div>
  );
}

function Tr7() {
  return (
    <div className="content-stretch flex h-[68px] items-start pb-0 pt-px px-0 relative shrink-0" data-name="TR-248">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Td30 />
      <Td31 />
      <Td32 />
      <Td34 />
      <Td33 />
    </div>
  );
}

function A3() {
  return (
    <div className="content-center flex flex-wrap h-[43px] items-center relative shrink-0" data-name="A-216">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">BOQ-MAR25</p>
      </div>
    </div>
  );
}

function Td11() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[189px]" data-name="TD-215">
      <A3 />
    </div>
  );
}

function Td16() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[256px]" data-name="TD-219">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] w-[181px]">
        <p className="leading-[20px]">Unitstopper</p>
      </div>
    </div>
  );
}

function Component4() {
  return (
    <div className="bg-[#ede9fe] content-stretch flex h-[26px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0 w-[84.313px]" data-name="Component 4">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#7c3aed] text-[12px] text-center text-nowrap text-shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <p className="leading-[20px]">Structural</p>
      </div>
    </div>
  );
}

function Td18() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[206px]" data-name="TD-219">
      <Component4 />
    </div>
  );
}

function TimeToggle4() {
  return <div className="opacity-0 shrink-0 size-0" data-name="time-toggle-206" />;
}

function Before4() {
  return <div className="absolute bg-white left-[3px] rounded-[50px] size-[18px] top-[3px]" data-name="::before-208" />;
}

function Span8() {
  return (
    <div className="absolute bg-[#1b59f8] content-stretch flex flex-col h-[24px] items-start left-0 rounded-[24px] top-0 w-[44px]" data-name="SPAN-207">
      <Before4 />
    </div>
  );
}

function Label4() {
  return (
    <div className="content-stretch flex flex-col h-[24px] items-start relative shrink-0 w-[44px]" data-name="LABEL-205">
      <TimeToggle4 />
      <Span8 />
    </div>
  );
}

function Span9() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0" data-name="SPAN-209">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Active</p>
      </div>
    </div>
  );
}

function Div14() {
  return (
    <div className="content-stretch flex gap-[12px] h-[24px] items-center relative shrink-0" data-name="DIV-201">
      <Label4 />
      <Span9 />
    </div>
  );
}

function Td27() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[227px]" data-name="TD-236">
      <Div14 />
    </div>
  );
}

function Group6() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.3325 10.5">
        <g id="Group">
          <path d={svgPaths.pc399900} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon6() {
  return (
    <div className="absolute h-[14px] left-[0.01px] overflow-clip top-[3px] w-[14.578px]" data-name="Icon-233">
      <div className="absolute flex inset-[12.5%_42%] items-center justify-center">
        <div className="flex-none h-[10.5px] scale-y-[-100%] w-[2.332px]">
          <Group6 />
        </div>
      </div>
    </div>
  );
}

function I6() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-center relative shrink-0 w-[14.594px]" data-name="I-232">
      <Icon6 />
    </div>
  );
}

function Div27() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[20px]" data-name="DIV-231">
      <I6 />
    </div>
  );
}

function ActionBtn4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 size-[20px]" data-name="actionBtn1-230">
      <Div27 />
    </div>
  );
}

function Div28() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 size-[20px]" data-name="DIV-229">
      <ActionBtn4 />
    </div>
  );
}

function Td19() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[200px]" data-name="TD-222">
      <Div28 />
    </div>
  );
}

function Tr4() {
  return (
    <div className="bg-white content-stretch flex h-[68px] items-start pb-0 pt-px px-0 relative shrink-0" data-name="TR-214">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Td11 />
      <Td16 />
      <Td18 />
      <Td27 />
      <Td19 />
    </div>
  );
}

function A8() {
  return (
    <div className="content-center flex flex-wrap h-[43px] items-center relative shrink-0" data-name="A-318">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">BOQ-MAR25</p>
      </div>
    </div>
  );
}

function Td40() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[189px]" data-name="TD-317">
      <A8 />
    </div>
  );
}

function Td41() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[256px]" data-name="TD-321">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] w-[172px]">
        <p className="leading-[20px]">Runspacer</p>
      </div>
    </div>
  );
}

function Component5() {
  return (
    <div className="bg-[#ede9fe] content-stretch flex h-[26px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0 w-[84.313px]" data-name="Component 4">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#7c3aed] text-[12px] text-center text-nowrap text-shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <p className="leading-[20px]">Structural</p>
      </div>
    </div>
  );
}

function Td42() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[206px]" data-name="TD-321">
      <Component5 />
    </div>
  );
}

function TimeToggle5() {
  return <div className="opacity-0 shrink-0 size-0" data-name="time-toggle-206" />;
}

function Before5() {
  return <div className="absolute bg-white left-[3px] rounded-[50px] size-[18px] top-[3px]" data-name="::before-208" />;
}

function Span10() {
  return (
    <div className="absolute bg-[#1b59f8] content-stretch flex flex-col h-[24px] items-start left-0 rounded-[24px] top-0 w-[44px]" data-name="SPAN-207">
      <Before5 />
    </div>
  );
}

function Label5() {
  return (
    <div className="content-stretch flex flex-col h-[24px] items-start relative shrink-0 w-[44px]" data-name="LABEL-205">
      <TimeToggle5 />
      <Span10 />
    </div>
  );
}

function Span11() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0" data-name="SPAN-209">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Active</p>
      </div>
    </div>
  );
}

function Div15() {
  return (
    <div className="content-stretch flex gap-[12px] h-[24px] items-center relative shrink-0" data-name="DIV-201">
      <Label5 />
      <Span11 />
    </div>
  );
}

function Td44() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[227px]" data-name="TD-338">
      <Div15 />
    </div>
  );
}

function Group7() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.3325 10.5">
        <g id="Group">
          <path d={svgPaths.pc399900} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute h-[14px] left-[0.01px] overflow-clip top-[3px] w-[14.578px]" data-name="Icon-233">
      <div className="absolute flex inset-[12.5%_42%] items-center justify-center">
        <div className="flex-none h-[10.5px] scale-y-[-100%] w-[2.332px]">
          <Group7 />
        </div>
      </div>
    </div>
  );
}

function I7() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-center relative shrink-0 w-[14.594px]" data-name="I-232">
      <Icon7 />
    </div>
  );
}

function Div31() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[20px]" data-name="DIV-231">
      <I7 />
    </div>
  );
}

function ActionBtn5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 size-[20px]" data-name="actionBtn1-230">
      <Div31 />
    </div>
  );
}

function Div32() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 size-[20px]" data-name="DIV-229">
      <ActionBtn5 />
    </div>
  );
}

function Td43() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[200px]" data-name="TD-324">
      <Div32 />
    </div>
  );
}

function Tr9() {
  return (
    <div className="content-stretch flex h-[68px] items-start pb-0 pt-px px-0 relative shrink-0" data-name="TR-316">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Td40 />
      <Td41 />
      <Td42 />
      <Td44 />
      <Td43 />
    </div>
  );
}

function A4() {
  return (
    <div className="content-center flex flex-wrap h-[43px] items-center relative shrink-0" data-name="A-216">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">BOQ-MAR25</p>
      </div>
    </div>
  );
}

function Td12() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[189px]" data-name="TD-215">
      <A4 />
    </div>
  );
}

function Td20() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[256px]" data-name="TD-219">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] w-[159px]">
        <p className="leading-[20px]">Tiebeam</p>
      </div>
    </div>
  );
}

function Component6() {
  return (
    <div className="bg-[#ede9fe] content-stretch flex h-[26px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0 w-[84.313px]" data-name="Component 4">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#7c3aed] text-[12px] text-center text-nowrap text-shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <p className="leading-[20px]">Structural</p>
      </div>
    </div>
  );
}

function Td21() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[206px]" data-name="TD-219">
      <Component6 />
    </div>
  );
}

function TimeToggle6() {
  return <div className="opacity-0 shrink-0 size-0" data-name="time-toggle-206" />;
}

function Before6() {
  return <div className="absolute bg-white left-[3px] rounded-[50px] size-[18px] top-[3px]" data-name="::before-208" />;
}

function Span12() {
  return (
    <div className="absolute bg-[#f0f0f0] content-stretch flex flex-col h-[24px] items-start left-0 rounded-[24px] top-0 w-[44px]" data-name="SPAN-207">
      <Before6 />
    </div>
  );
}

function Label6() {
  return (
    <div className="content-stretch flex flex-col h-[24px] items-start relative shrink-0 w-[44px]" data-name="LABEL-205">
      <TimeToggle6 />
      <Span12 />
    </div>
  );
}

function Span13() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0" data-name="SPAN-209">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Inactive</p>
      </div>
    </div>
  );
}

function Div16() {
  return (
    <div className="content-stretch flex gap-[12px] h-[24px] items-center relative shrink-0" data-name="DIV-201">
      <Label6 />
      <Span13 />
    </div>
  );
}

function Td28() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[227px]" data-name="TD-236">
      <Div16 />
    </div>
  );
}

function Group8() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.3325 10.5">
        <g id="Group">
          <path d={svgPaths.pc399900} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute h-[14px] left-[0.01px] overflow-clip top-[3px] w-[14.578px]" data-name="Icon-233">
      <div className="absolute flex inset-[12.5%_42%] items-center justify-center">
        <div className="flex-none h-[10.5px] scale-y-[-100%] w-[2.332px]">
          <Group8 />
        </div>
      </div>
    </div>
  );
}

function I8() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-center relative shrink-0 w-[14.594px]" data-name="I-232">
      <Icon8 />
    </div>
  );
}

function Div33() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[20px]" data-name="DIV-231">
      <I8 />
    </div>
  );
}

function ActionBtn6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 size-[20px]" data-name="actionBtn1-230">
      <Div33 />
    </div>
  );
}

function Div34() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 size-[20px]" data-name="DIV-229">
      <ActionBtn6 />
    </div>
  );
}

function Td22() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[200px]" data-name="TD-222">
      <Div34 />
    </div>
  );
}

function Tr5() {
  return (
    <div className="bg-white content-stretch flex h-[68px] items-start pb-0 pt-px px-0 relative shrink-0" data-name="TR-214">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Td12 />
      <Td20 />
      <Td21 />
      <Td28 />
      <Td22 />
    </div>
  );
}

function A5() {
  return (
    <div className="content-center flex flex-wrap h-[43px] items-center relative shrink-0" data-name="A-216">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">BOQ-MAR25</p>
      </div>
    </div>
  );
}

function Td13() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[189px]" data-name="TD-215">
      <A5 />
    </div>
  );
}

function Td23() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[256px]" data-name="TD-219">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] w-[142px]">
        <p className="leading-[20px]">Pallet</p>
      </div>
    </div>
  );
}

function Component7() {
  return (
    <div className="bg-[#ede9fe] content-stretch flex h-[26px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0 w-[84.313px]" data-name="Component 4">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#7c3aed] text-[12px] text-center text-nowrap text-shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <p className="leading-[20px]">Structural</p>
      </div>
    </div>
  );
}

function Td24() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[206px]" data-name="TD-219">
      <Component7 />
    </div>
  );
}

function TimeToggle7() {
  return <div className="opacity-0 shrink-0 size-0" data-name="time-toggle-206" />;
}

function Before7() {
  return <div className="absolute bg-white left-[3px] rounded-[50px] size-[18px] top-[3px]" data-name="::before-208" />;
}

function Span14() {
  return (
    <div className="absolute bg-[#f0f0f0] content-stretch flex flex-col h-[24px] items-start left-0 rounded-[24px] top-0 w-[44px]" data-name="SPAN-207">
      <Before7 />
    </div>
  );
}

function Label7() {
  return (
    <div className="content-stretch flex flex-col h-[24px] items-start relative shrink-0 w-[44px]" data-name="LABEL-205">
      <TimeToggle7 />
      <Span14 />
    </div>
  );
}

function Span15() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0" data-name="SPAN-209">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Inactive</p>
      </div>
    </div>
  );
}

function Div17() {
  return (
    <div className="content-stretch flex gap-[12px] h-[24px] items-center relative shrink-0" data-name="DIV-201">
      <Label7 />
      <Span15 />
    </div>
  );
}

function Td29() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[227px]" data-name="TD-236">
      <Div17 />
    </div>
  );
}

function Group9() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.3325 10.5">
        <g id="Group">
          <path d={svgPaths.pc399900} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute h-[14px] left-[0.01px] overflow-clip top-[3px] w-[14.578px]" data-name="Icon-233">
      <div className="absolute flex inset-[12.5%_42%] items-center justify-center">
        <div className="flex-none h-[10.5px] scale-y-[-100%] w-[2.332px]">
          <Group9 />
        </div>
      </div>
    </div>
  );
}

function I9() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-center relative shrink-0 w-[14.594px]" data-name="I-232">
      <Icon9 />
    </div>
  );
}

function Div35() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[20px]" data-name="DIV-231">
      <I9 />
    </div>
  );
}

function ActionBtn7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 size-[20px]" data-name="actionBtn1-230">
      <Div35 />
    </div>
  );
}

function Div36() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 size-[20px]" data-name="DIV-229">
      <ActionBtn7 />
    </div>
  );
}

function Td25() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[200px]" data-name="TD-222">
      <Div36 />
    </div>
  );
}

function Tr6() {
  return (
    <div className="bg-white content-stretch flex h-[68px] items-start pb-0 pt-px px-0 relative shrink-0" data-name="TR-214">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Td13 />
      <Td23 />
      <Td24 />
      <Td29 />
      <Td25 />
    </div>
  );
}

function A7() {
  return (
    <div className="content-stretch flex h-[19px] items-start relative shrink-0 w-[126.5px]" data-name="A-284">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] w-[127px]">
        <p className="leading-[20px]">BOQ-MAR25</p>
      </div>
    </div>
  );
}

function Td35() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[189px]" data-name="TD-283">
      <A7 />
    </div>
  );
}

function Td36() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[256px]" data-name="TD-287">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] w-[214px]">
        <p className="leading-[20px]">Safety Accessory</p>
      </div>
    </div>
  );
}

function Component8() {
  return (
    <div className="bg-[#ecfccb] content-stretch flex h-[26px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0 w-[85.297px]" data-name="Component 4">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#65a30d] text-[12px] text-center text-nowrap text-shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <p className="leading-[20px]">General</p>
      </div>
    </div>
  );
}

function Td37() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[206px]" data-name="TD-287">
      <Component8 />
    </div>
  );
}

function TimeToggle8() {
  return <div className="opacity-0 shrink-0 size-0" data-name="time-toggle-206" />;
}

function Before8() {
  return <div className="absolute bg-white left-[3px] rounded-[50px] size-[18px] top-[3px]" data-name="::before-208" />;
}

function Span16() {
  return (
    <div className="absolute bg-[#f0f0f0] content-stretch flex flex-col h-[24px] items-start left-0 rounded-[24px] top-0 w-[44px]" data-name="SPAN-207">
      <Before8 />
    </div>
  );
}

function Label8() {
  return (
    <div className="content-stretch flex flex-col h-[24px] items-start relative shrink-0 w-[44px]" data-name="LABEL-205">
      <TimeToggle8 />
      <Span16 />
    </div>
  );
}

function Span17() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0" data-name="SPAN-209">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Inactive</p>
      </div>
    </div>
  );
}

function Div18() {
  return (
    <div className="content-stretch flex gap-[12px] h-[24px] items-center relative shrink-0" data-name="DIV-201">
      <Label8 />
      <Span17 />
    </div>
  );
}

function Td39() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[227px]" data-name="TD-304">
      <Div18 />
    </div>
  );
}

function Group10() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.3325 10.5">
        <g id="Group">
          <path d={svgPaths.pc399900} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute h-[14px] left-[0.01px] overflow-clip top-[3px] w-[14.578px]" data-name="Icon-233">
      <div className="absolute flex inset-[12.5%_42%] items-center justify-center">
        <div className="flex-none h-[10.5px] scale-y-[-100%] w-[2.332px]">
          <Group10 />
        </div>
      </div>
    </div>
  );
}

function I10() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-center relative shrink-0 w-[14.594px]" data-name="I-232">
      <Icon10 />
    </div>
  );
}

function Div38() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[20px]" data-name="DIV-231">
      <I10 />
    </div>
  );
}

function ActionBtn8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 size-[20px]" data-name="actionBtn1-230">
      <Div38 />
    </div>
  );
}

function Div39() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 size-[20px]" data-name="DIV-229">
      <ActionBtn8 />
    </div>
  );
}

function Td38() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center overflow-clip px-[24px] py-[16px] relative shrink-0 w-[200px]" data-name="TD-290">
      <Div39 />
    </div>
  );
}

function Tr8() {
  return (
    <div className="bg-white content-stretch flex h-[68px] items-start pb-0 pt-px px-0 relative shrink-0" data-name="TR-282">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Td35 />
      <Td36 />
      <Td37 />
      <Td39 />
      <Td38 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <Tr1 />
      <Tr2 />
      <Tr3 />
      <Tr7 />
      <Tr4 />
      <Tr9 />
      <Tr5 />
      <Tr6 />
      <Tr8 />
    </div>
  );
}

function Tbody() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative shrink-0" data-name="TBODY-111">
      <Frame3 />
    </div>
  );
}

function Tbody1() {
  return (
    <div className="basis-0 bg-white content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0 w-full" data-name="TBODY-111">
      <Tbody />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col h-[716px] items-start relative shrink-0 w-full">
      <Thead />
      <Tbody1 />
    </div>
  );
}

function Label9() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[95.422px]" data-name="LABEL-241">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Rows per page:</p>
      </div>
    </div>
  );
}

function CaretDown() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="caret-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="caret-down">
          <path d={svgPaths.p376fe680} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Div3() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[20px]" data-name="DIV-34">
      <CaretDown />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center text-nowrap">
        <p className="leading-[20px]">10</p>
      </div>
      <Div3 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex h-[32px] items-center px-[12px] py-[9px] relative rounded-[8px] shrink-0" data-name="BUTTON-33">
      <Frame />
    </div>
  );
}

function Div30() {
  return (
    <div className="content-stretch flex gap-[12px] h-[32px] items-center relative shrink-0 w-[179px]" data-name="DIV-240">
      <Label9 />
      <Button />
    </div>
  );
}

function Span18() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[70.813px]" data-name="SPAN-248">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">1-10 of 103</p>
      </div>
    </div>
  );
}

function Group11() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.32875 8">
        <g id="Group">
          <path d={svgPaths.p39828e00} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute h-[16px] left-[0.01px] overflow-clip top-[4px] w-[16.656px]" data-name="Icon-254">
      <div className="absolute bottom-1/4 flex items-center justify-center left-[28%] right-[28%] top-1/4">
        <div className="flex-none h-[8px] scale-y-[-100%] w-[7.329px]">
          <Group11 />
        </div>
      </div>
    </div>
  );
}

function I11() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-[16.672px]" data-name="I-253">
      <Icon11 />
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex items-center justify-center opacity-50 relative rounded-[8px] shrink-0 size-[32px]" data-name="BUTTON-252">
      <I11 />
    </div>
  );
}

function Group12() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.1701 8.48">
        <g id="Group">
          <path d={svgPaths.p2934def0} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon12() {
  return (
    <div className="absolute h-[16px] left-[0.01px] overflow-clip top-[4px] w-[16.656px]" data-name="Icon-257">
      <div className="absolute flex inset-[23.5%_34.48%] items-center justify-center">
        <div className="flex-none h-[8.48px] scale-y-[-100%] w-[5.17px]">
          <Group12 />
        </div>
      </div>
    </div>
  );
}

function I12() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-[16.672px]" data-name="I-256">
      <Icon12 />
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex items-center justify-center opacity-50 relative rounded-[8px] shrink-0 size-[32px]" data-name="BUTTON-255">
      <I12 />
    </div>
  );
}

function Group13() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.1701 8.48">
        <g id="Group">
          <g id="Vector">
            <path d={svgPaths.p335ac200} fill="var(--fill-0, #202020)" />
            <path d={svgPaths.p335ac200} fill="var(--fill-1, black)" fillOpacity="0.2" />
            <path d={svgPaths.p335ac200} fill="var(--fill-2, black)" fillOpacity="0.2" />
            <path d={svgPaths.p335ac200} fill="var(--fill-3, black)" fillOpacity="0.2" />
            <path d={svgPaths.p335ac200} fill="var(--fill-4, black)" fillOpacity="0.2" />
            <path d={svgPaths.p335ac200} fill="var(--fill-5, black)" fillOpacity="0.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Icon13() {
  return (
    <div className="absolute h-[16px] left-[0.01px] overflow-clip top-[4px] w-[16.656px]" data-name="Icon-260">
      <div className="absolute flex inset-[23.5%_34.48%] items-center justify-center">
        <div className="flex-none h-[8.48px] scale-y-[-100%] w-[5.17px]">
          <Group13 />
        </div>
      </div>
    </div>
  );
}

function I13() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-[16.672px]" data-name="I-259">
      <Icon13 />
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="BUTTON-258">
      <I13 />
    </div>
  );
}

function Group14() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.32875 8">
        <g id="Group">
          <g id="Vector">
            <path d={svgPaths.p14141880} fill="var(--fill-0, #202020)" />
            <path d={svgPaths.p14141880} fill="var(--fill-1, black)" fillOpacity="0.2" />
            <path d={svgPaths.p14141880} fill="var(--fill-2, black)" fillOpacity="0.2" />
            <path d={svgPaths.p14141880} fill="var(--fill-3, black)" fillOpacity="0.2" />
            <path d={svgPaths.p14141880} fill="var(--fill-4, black)" fillOpacity="0.2" />
            <path d={svgPaths.p14141880} fill="var(--fill-5, black)" fillOpacity="0.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Icon14() {
  return (
    <div className="absolute h-[16px] left-[0.01px] overflow-clip top-[4px] w-[16.656px]" data-name="Icon-263">
      <div className="absolute bottom-1/4 flex items-center justify-center left-[28%] right-[28%] top-1/4">
        <div className="flex-none h-[8px] scale-y-[-100%] w-[7.329px]">
          <Group14 />
        </div>
      </div>
    </div>
  );
}

function I14() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-[16.672px]" data-name="I-262">
      <Icon14 />
    </div>
  );
}

function Button6() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="BUTTON-261">
      <I14 />
    </div>
  );
}

function Div40() {
  return (
    <div className="content-stretch flex gap-[4px] h-[32px] items-center relative shrink-0 w-[140px]" data-name="DIV-251">
      <Button3 />
      <Button4 />
      <Button5 />
      <Button6 />
    </div>
  );
}

function Div37() {
  return (
    <div className="content-stretch flex gap-[24px] h-[32px] items-center relative shrink-0 w-[234.813px]" data-name="DIV-247">
      <Span18 />
      <Div40 />
    </div>
  );
}

function Div29() {
  return (
    <div className="absolute bg-white content-stretch flex h-[65px] items-center justify-between left-px pb-[16px] pt-[17px] px-[24px] top-[651px] w-[1077px]" data-name="DIV-239">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Div30 />
      <Div37 />
    </div>
  );
}

function Div4() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-start left-[-1px] overflow-clip shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] top-[70px] w-[1077px]" data-name="DIV-49">
      <Frame2 />
      <Div29 />
    </div>
  );
}

export default function Frame4() {
  return (
    <div className="bg-white border border-[#e8e8e8] border-solid overflow-clip relative rounded-[6px] size-full">
      <Div />
      <Div4 />
    </div>
  );
}