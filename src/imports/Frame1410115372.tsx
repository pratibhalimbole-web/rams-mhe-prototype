import svgPaths from "./svg-ay0hdhz0z5";

function MarginWrap() {
  return (
    <div className="absolute content-stretch flex items-start left-[338px] top-[88px]" data-name="margin-wrap">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[20px] text-nowrap">
        <p className="leading-[24px]">Bill Of Quantity</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white content-stretch flex h-[38px] items-center pl-[41px] pr-[13px] py-[9px] relative rounded-[16px] shrink-0 w-[320px]" data-name="INPUT">
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] left-[41px] not-italic text-[14px] text-[rgba(32,32,32,0.6)] top-[19px] translate-y-[-50%] w-[266px]">
        <p className="leading-[20px]">Search BOQ...</p>
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

function Div3() {
  return (
    <div className="absolute content-stretch flex h-[38px] items-center left-0 pl-[12px] pr-0 py-0 top-0 w-[32px]" data-name="DIV-28">
      <MagnifyingGlass />
    </div>
  );
}

function Div2() {
  return (
    <div className="content-stretch flex flex-col h-[38px] items-start relative shrink-0 w-[320px]" data-name="DIV-26">
      <Input />
      <Div3 />
    </div>
  );
}

function DateRangePicker() {
  return (
    <div className="bg-white content-stretch flex h-[38px] items-center pl-[13px] pr-[41px] py-[9px] relative rounded-[8px] shrink-0 w-[220px]" data-name="dateRangePicker">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-[13px] not-italic text-[14px] text-[rgba(32,32,32,0.6)] text-nowrap top-[19.5px] translate-y-[-50%]">
        <p className="leading-[21px]">Apr 01 - Apr 15, 2025</p>
      </div>
    </div>
  );
}

function Plus() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="plus">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="plus">
          <path d={svgPaths.p92c2080} fill="var(--fill-0, white)" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function MarginWrap1() {
  return (
    <div className="content-stretch flex items-start pl-0 pr-[8px] py-0 relative shrink-0" data-name="margin-wrap">
      <Plus />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#1b59f8] content-stretch flex h-[38px] items-center justify-center px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="BUTTON-55">
      <MarginWrap1 />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white">
        <p className="leading-[20px]">Create BOQ</p>
      </div>
    </div>
  );
}

function Calendar() {
  return (
    <div className="absolute left-[188px] size-[20px] top-[9px]" data-name="calendar">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="calendar">
          <path d={svgPaths.p3d1d4e80} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Div6() {
  return (
    <div className="content-stretch flex gap-[16px] h-[38px] items-start relative shrink-0" data-name="DIV-63">
      <DateRangePicker />
      <Button1 />
      <Calendar />
    </div>
  );
}

function Div1() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="DIV-25">
      <Div2 />
      <Div6 />
    </div>
  );
}

function Div() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[70px] items-start p-[16px] relative shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 w-[1078px]" data-name="DIV-24">
      <Div1 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="absolute bg-[#f9f9f9] content-stretch flex flex-col items-start left-[-1px] top-[-1px]">
      <Div />
    </div>
  );
}

function Th() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start justify-center px-[24px] py-[12px] relative shrink-0 w-[122px]" data-name="TH-87">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] text-nowrap">
        <p className="leading-[20px]">BOQ PIN</p>
      </div>
    </div>
  );
}

function Th1() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start justify-center px-[24px] py-[12px] relative shrink-0 w-[182px]" data-name="TH-90">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] text-nowrap">
        <p className="leading-[20px]">Date Range</p>
      </div>
    </div>
  );
}

function Th2() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start justify-center px-[24px] py-[12px] relative shrink-0 w-[107px]" data-name="TH-93">
      <div className="-webkit-box flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[12px] text-nowrap">
        <p className="leading-[20px]">Total Items</p>
      </div>
    </div>
  );
}

function Th3() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start justify-center px-[24px] py-[12px] relative shrink-0 w-[103px]" data-name="TH-96">
      <div className="-webkit-box flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[12px] text-nowrap">
        <p className="leading-[20px]">OEM Count</p>
      </div>
    </div>
  );
}

function Th4() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start justify-center px-[24px] py-[12px] relative shrink-0 w-[181px]" data-name="TH-99">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] text-nowrap">
        <p className="leading-[20px]">Created By</p>
      </div>
    </div>
  );
}

function Th5() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start justify-center px-[24px] py-[12px] relative shrink-0 w-[121px]" data-name="TH-102">
      <div className="-webkit-box flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[12px] text-nowrap">
        <p className="leading-[20px]">Created On</p>
      </div>
    </div>
  );
}

function Th6() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start justify-center px-[24px] py-[12px] relative shrink-0 w-[160px]" data-name="TH-102">
      <div className="-webkit-box flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[12px] text-nowrap">
        <p className="leading-[20px]">Status</p>
      </div>
    </div>
  );
}

function Th7() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start justify-center px-[24px] py-[12px] relative shrink-0 w-[101px]" data-name="TH-108">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] text-nowrap">
        <p className="leading-[20px]">Actions</p>
      </div>
    </div>
  );
}

function Tr() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex h-[40px] items-start relative shrink-0" data-name="TR-86">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Th />
      <Th1 />
      <Th2 />
      <Th3 />
      <Th4 />
      <Th5 />
      <Th6 />
      <Th7 />
    </div>
  );
}

function Thead() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-start relative shrink-0 w-full" data-name="THEAD-85">
      <Tr />
    </div>
  );
}

function A() {
  return (
    <div className="content-center flex flex-wrap h-[43px] items-center relative shrink-0" data-name="A-114">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">BOQ-APR25</p>
      </div>
    </div>
  );
}

function Td() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[122px]" data-name="TD-113">
      <A />
    </div>
  );
}

function Td1() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[183px]" data-name="TD-117">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Apr 01 - Apr 15, 2025</p>
      </div>
    </div>
  );
}

function Td2() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[106px]" data-name="TD-120">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">12</p>
      </div>
    </div>
  );
}

function Td3() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[104px]" data-name="TD-123">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">3</p>
      </div>
    </div>
  );
}

function Div8() {
  return (
    <div className="bg-[#2563eb] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="DIV-128">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-white">
        <p className="leading-[20px]">ST</p>
      </div>
    </div>
  );
}

function MarginWrap2() {
  return (
    <div className="content-stretch flex items-start pl-0 pr-[8px] py-0 relative shrink-0" data-name="margin-wrap">
      <Div8 />
    </div>
  );
}

function Span4() {
  return (
    <div className="content-stretch flex h-[24px] items-center relative shrink-0 w-[87.703px]" data-name="SPAN-131">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Sarah Taylor</p>
      </div>
    </div>
  );
}

function Div7() {
  return (
    <div className="content-stretch flex h-[32px] items-center relative shrink-0 w-[135.984px]" data-name="DIV-127">
      <MarginWrap2 />
      <Span4 />
    </div>
  );
}

function Td4() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[180px]" data-name="TD-126">
      <Div7 />
    </div>
  );
}

function Td5() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[121px]" data-name="TD-134">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Apr 16, 2025</p>
      </div>
    </div>
  );
}

function Span() {
  return (
    <div className="bg-[#fef3c7] content-stretch flex h-[26px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0 w-[84.313px]" data-name="SPAN-112">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#d97706] text-[12px] text-center text-nowrap">
        <p className="leading-[20px]">Draft</p>
      </div>
    </div>
  );
}

function Td6() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[161px]" data-name="TD-134">
      <Span />
    </div>
  );
}

function Group() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.665 12">
        <g id="Group">
          <g id="Vector">
            <path d={svgPaths.p22222380} fill="#202020" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute h-[16px] left-[0.01px] overflow-clip top-[4px] w-[16.656px]" data-name="Icon-145">
      <div className="absolute flex inset-[12.5%_42%] items-center justify-center">
        <div className="flex-none h-[12px] scale-y-[-100%] w-[2.665px]">
          <Group />
        </div>
      </div>
    </div>
  );
}

function I() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-[16.672px]" data-name="I-144">
      <Icon />
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="BUTTON-143">
      <I />
    </div>
  );
}

function Dropdown() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start relative shrink-0 w-[54.922px]" data-name="dropdown1-142">
      <Button2 />
    </div>
  );
}

function Td7() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[100px]" data-name="TD-141">
      <Dropdown />
    </div>
  );
}

function Tr1() {
  return (
    <div className="content-stretch flex h-[68px] items-start relative shrink-0" data-name="TR-112">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Td />
      <Td1 />
      <Td2 />
      <Td3 />
      <Td4 />
      <Td5 />
      <Td6 />
      <Td7 />
    </div>
  );
}

function A1() {
  return (
    <div className="content-center flex flex-wrap h-[43px] items-center relative shrink-0" data-name="A-148">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">BOQ-APR25</p>
      </div>
    </div>
  );
}

function Td8() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[122px]" data-name="TD-147">
      <A1 />
    </div>
  );
}

function Td9() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[183px]" data-name="TD-151">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Apr 01 - Apr 15, 2025</p>
      </div>
    </div>
  );
}

function Td10() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[106px]" data-name="TD-154">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">8</p>
      </div>
    </div>
  );
}

function Td11() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[104px]" data-name="TD-157">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">2</p>
      </div>
    </div>
  );
}

function Div10() {
  return (
    <div className="bg-[#8b5cf6] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="DIV-162">
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[24px]">JW</p>
      </div>
    </div>
  );
}

function MarginWrap3() {
  return (
    <div className="content-stretch flex items-start pl-0 pr-[8px] py-0 relative shrink-0" data-name="margin-wrap">
      <Div10 />
    </div>
  );
}

function Span5() {
  return (
    <div className="content-center flex flex-wrap h-[48px] items-center relative shrink-0 w-[97.047px]" data-name="SPAN-165">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">James Wilson</p>
      </div>
    </div>
  );
}

function Div9() {
  return (
    <div className="content-stretch flex h-[48px] items-center relative shrink-0 w-[135.984px]" data-name="DIV-161">
      <MarginWrap3 />
      <Span5 />
    </div>
  );
}

function Td12() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[180px]" data-name="TD-160">
      <Div9 />
    </div>
  );
}

function Td13() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[121px]" data-name="TD-168">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Apr 15, 2025</p>
      </div>
    </div>
  );
}

function Span1() {
  return (
    <div className="bg-[#fef3c7] content-stretch flex h-[26px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0 w-[84.313px]" data-name="SPAN-112">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#d97706] text-[12px] text-center text-nowrap">
        <p className="leading-[20px]">Draft</p>
      </div>
    </div>
  );
}

function Td14() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[161px]" data-name="TD-168">
      <Span1 />
    </div>
  );
}

function Group1() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.665 12">
        <g id="Group">
          <g id="Vector">
            <path d={svgPaths.p22222380} fill="#202020" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute h-[16px] left-[0.01px] overflow-clip top-[4px] w-[16.656px]" data-name="Icon-179">
      <div className="absolute flex inset-[12.5%_42%] items-center justify-center">
        <div className="flex-none h-[12px] scale-y-[-100%] w-[2.665px]">
          <Group1 />
        </div>
      </div>
    </div>
  );
}

function I1() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-[16.672px]" data-name="I-178">
      <Icon1 />
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="BUTTON-177">
      <I1 />
    </div>
  );
}

function Dropdown1() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start relative shrink-0 w-[54.922px]" data-name="dropdown2-176">
      <Button3 />
    </div>
  );
}

function Td15() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[100px]" data-name="TD-175">
      <Dropdown1 />
    </div>
  );
}

function Tr2() {
  return (
    <div className="bg-white content-stretch flex h-[68px] items-start pb-0 pt-px px-0 relative shrink-0" data-name="TR-146">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Td8 />
      <Td9 />
      <Td10 />
      <Td11 />
      <Td12 />
      <Td13 />
      <Td14 />
      <Td15 />
    </div>
  );
}

function A2() {
  return (
    <div className="content-center flex flex-wrap h-[43px] items-center relative shrink-0" data-name="A-182">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">BOQ-APR25</p>
      </div>
    </div>
  );
}

function Td16() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[122px]" data-name="TD-181">
      <A2 />
    </div>
  );
}

function Td17() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[183px]" data-name="TD-185">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Apr 01 - Apr 15, 2025</p>
      </div>
    </div>
  );
}

function Td18() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[106px]" data-name="TD-188">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">15</p>
      </div>
    </div>
  );
}

function Td19() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[104px]" data-name="TD-191">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">4</p>
      </div>
    </div>
  );
}

function Div12() {
  return (
    <div className="bg-[#15823b] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="DIV-196">
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[24px]">EJ</p>
      </div>
    </div>
  );
}

function MarginWrap4() {
  return (
    <div className="content-stretch flex items-start pl-0 pr-[8px] py-0 relative shrink-0" data-name="margin-wrap">
      <Div12 />
    </div>
  );
}

function Span10() {
  return (
    <div className="content-center flex flex-wrap h-[48px] items-center relative shrink-0 w-[99.469px]" data-name="SPAN-199">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Emma Johnson</p>
      </div>
    </div>
  );
}

function Div11() {
  return (
    <div className="content-stretch flex h-[48px] items-center relative shrink-0 w-[135.984px]" data-name="DIV-195">
      <MarginWrap4 />
      <Span10 />
    </div>
  );
}

function Td20() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[180px]" data-name="TD-194">
      <Div11 />
    </div>
  );
}

function Td21() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[121px]" data-name="TD-202">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Apr 14, 2025</p>
      </div>
    </div>
  );
}

function Span6() {
  return (
    <div className="bg-[#e0e7ff] content-stretch flex h-[26px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0" data-name="SPAN-169">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#4f46e5] text-[12px] text-center text-nowrap">
        <p className="leading-[39px]">Sent to PR</p>
      </div>
    </div>
  );
}

function Td22() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[161px]" data-name="TD-202">
      <Span6 />
    </div>
  );
}

function Group2() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.665 12">
        <g id="Group">
          <g id="Vector">
            <path d={svgPaths.p22222380} fill="#202020" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute h-[16px] left-[0.01px] overflow-clip top-[4px] w-[16.656px]" data-name="Icon-213">
      <div className="absolute flex inset-[12.5%_42%] items-center justify-center">
        <div className="flex-none h-[12px] scale-y-[-100%] w-[2.665px]">
          <Group2 />
        </div>
      </div>
    </div>
  );
}

function I2() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-[16.672px]" data-name="I-212">
      <Icon2 />
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="BUTTON-211">
      <I2 />
    </div>
  );
}

function Dropdown2() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start relative shrink-0 w-[54.922px]" data-name="dropdown3-210">
      <Button4 />
    </div>
  );
}

function Td23() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[100px]" data-name="TD-209">
      <Dropdown2 />
    </div>
  );
}

function Tr3() {
  return (
    <div className="content-stretch flex h-[68px] items-start pb-0 pt-px px-0 relative shrink-0" data-name="TR-180">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Td16 />
      <Td17 />
      <Td18 />
      <Td19 />
      <Td20 />
      <Td21 />
      <Td22 />
      <Td23 />
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

function Td24() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[122px]" data-name="TD-215">
      <A3 />
    </div>
  );
}

function Td26() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[183px]" data-name="TD-219">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Mar 15 - Mar 31, 2025</p>
      </div>
    </div>
  );
}

function Td28() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[106px]" data-name="TD-222">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">10</p>
      </div>
    </div>
  );
}

function Td30() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[104px]" data-name="TD-225">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">2</p>
      </div>
    </div>
  );
}

function Div14() {
  return (
    <div className="bg-[#2563eb] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="DIV-230">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-white">
        <p className="leading-[20px]">ST</p>
      </div>
    </div>
  );
}

function MarginWrap5() {
  return (
    <div className="content-stretch flex items-start pl-0 pr-[8px] py-0 relative shrink-0" data-name="margin-wrap">
      <Div14 />
    </div>
  );
}

function Span11() {
  return (
    <div className="content-stretch flex h-[24px] items-center relative shrink-0 w-[87.703px]" data-name="SPAN-233">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Sarah Taylor</p>
      </div>
    </div>
  );
}

function Div13() {
  return (
    <div className="content-stretch flex h-[32px] items-center relative shrink-0 w-[135.984px]" data-name="DIV-229">
      <MarginWrap5 />
      <Span11 />
    </div>
  );
}

function Td32() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[180px]" data-name="TD-228">
      <Div13 />
    </div>
  );
}

function Td34() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[121px]" data-name="TD-236">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Apr 02, 2025</p>
      </div>
    </div>
  );
}

function Span2() {
  return (
    <div className="bg-[#fef3c7] content-stretch flex h-[26px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0 w-[84.313px]" data-name="SPAN-112">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#d97706] text-[12px] text-center text-nowrap">
        <p className="leading-[20px]">Draft</p>
      </div>
    </div>
  );
}

function Td35() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[161px]" data-name="TD-236">
      <Span2 />
    </div>
  );
}

function Group3() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.665 12">
        <g id="Group">
          <g id="Vector">
            <path d={svgPaths.p22222380} fill="#202020" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute h-[16px] left-[0.01px] overflow-clip top-[4px] w-[16.656px]" data-name="Icon-247">
      <div className="absolute flex inset-[12.5%_42%] items-center justify-center">
        <div className="flex-none h-[12px] scale-y-[-100%] w-[2.665px]">
          <Group3 />
        </div>
      </div>
    </div>
  );
}

function I3() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-[16.672px]" data-name="I-246">
      <Icon3 />
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="BUTTON-245">
      <I3 />
    </div>
  );
}

function Dropdown3() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start relative shrink-0 w-[54.922px]" data-name="dropdown4-244">
      <Button5 />
    </div>
  );
}

function Td38() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[100px]" data-name="TD-243">
      <Dropdown3 />
    </div>
  );
}

function Tr4() {
  return (
    <div className="bg-white content-stretch flex h-[68px] items-start pb-0 pt-px px-0 relative shrink-0" data-name="TR-214">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Td24 />
      <Td26 />
      <Td28 />
      <Td30 />
      <Td32 />
      <Td34 />
      <Td35 />
      <Td38 />
    </div>
  );
}

function A5() {
  return (
    <div className="content-center flex flex-wrap h-[43px] items-center relative shrink-0" data-name="A-250">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">BOQ-MAR25</p>
      </div>
    </div>
  );
}

function Td40() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[122px]" data-name="TD-249">
      <A5 />
    </div>
  );
}

function Td41() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[183px]" data-name="TD-253">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Mar 15 - Mar 31, 2025</p>
      </div>
    </div>
  );
}

function Td42() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[106px]" data-name="TD-256">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">7</p>
      </div>
    </div>
  );
}

function Td43() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[104px]" data-name="TD-259">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">2</p>
      </div>
    </div>
  );
}

function Div22() {
  return (
    <div className="bg-[#d97706] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="DIV-264">
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[24px]">RB</p>
      </div>
    </div>
  );
}

function MarginWrap6() {
  return (
    <div className="content-stretch flex items-start pl-0 pr-[8px] py-0 relative shrink-0" data-name="margin-wrap">
      <Div22 />
    </div>
  );
}

function Span14() {
  return (
    <div className="content-center flex flex-wrap h-[48px] items-center relative shrink-0 w-[96.141px]" data-name="SPAN-267">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Robert Brown</p>
      </div>
    </div>
  );
}

function Div21() {
  return (
    <div className="content-stretch flex h-[48px] items-center relative shrink-0 w-[135.984px]" data-name="DIV-263">
      <MarginWrap6 />
      <Span14 />
    </div>
  );
}

function Td44() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[180px]" data-name="TD-262">
      <Div21 />
    </div>
  );
}

function Td45() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[121px]" data-name="TD-270">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Apr 01, 2025</p>
      </div>
    </div>
  );
}

function Span7() {
  return (
    <div className="bg-[#e0e7ff] content-stretch flex h-[26px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0" data-name="SPAN-169">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#4f46e5] text-[12px] text-center text-nowrap">
        <p className="leading-[39px]">Sent to PR</p>
      </div>
    </div>
  );
}

function Td46() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[161px]" data-name="TD-270">
      <Span7 />
    </div>
  );
}

function Group4() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.665 12">
        <g id="Group">
          <g id="Vector">
            <path d={svgPaths.p22222380} fill="#202020" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute h-[16px] left-[0.01px] overflow-clip top-[4px] w-[16.656px]" data-name="Icon-281">
      <div className="absolute flex inset-[12.5%_42%] items-center justify-center">
        <div className="flex-none h-[12px] scale-y-[-100%] w-[2.665px]">
          <Group4 />
        </div>
      </div>
    </div>
  );
}

function I9() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-[16.672px]" data-name="I-280">
      <Icon9 />
    </div>
  );
}

function Button11() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="BUTTON-279">
      <I9 />
    </div>
  );
}

function Dropdown5() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start relative shrink-0 w-[54.922px]" data-name="dropdown5-278">
      <Button11 />
    </div>
  );
}

function Td47() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[100px]" data-name="TD-277">
      <Dropdown5 />
    </div>
  );
}

function Tr6() {
  return (
    <div className="content-stretch flex h-[68px] items-start pb-0 pt-px px-0 relative shrink-0" data-name="TR-248">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Td40 />
      <Td41 />
      <Td42 />
      <Td43 />
      <Td44 />
      <Td45 />
      <Td46 />
      <Td47 />
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

function Td25() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[122px]" data-name="TD-215">
      <A4 />
    </div>
  );
}

function Td27() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[183px]" data-name="TD-219">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Mar 15 - Mar 31, 2025</p>
      </div>
    </div>
  );
}

function Td29() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[106px]" data-name="TD-222">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">10</p>
      </div>
    </div>
  );
}

function Td31() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[104px]" data-name="TD-225">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">2</p>
      </div>
    </div>
  );
}

function Div15() {
  return (
    <div className="bg-[#2563eb] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="DIV-230">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-white">
        <p className="leading-[20px]">ST</p>
      </div>
    </div>
  );
}

function MarginWrap7() {
  return (
    <div className="content-stretch flex items-start pl-0 pr-[8px] py-0 relative shrink-0" data-name="margin-wrap">
      <Div15 />
    </div>
  );
}

function Span12() {
  return (
    <div className="content-stretch flex h-[24px] items-center relative shrink-0 w-[87.703px]" data-name="SPAN-233">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Sarah Taylor</p>
      </div>
    </div>
  );
}

function Div16() {
  return (
    <div className="content-stretch flex h-[32px] items-center relative shrink-0 w-[135.984px]" data-name="DIV-229">
      <MarginWrap7 />
      <Span12 />
    </div>
  );
}

function Td33() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[180px]" data-name="TD-228">
      <Div16 />
    </div>
  );
}

function Td36() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[121px]" data-name="TD-236">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Apr 02, 2025</p>
      </div>
    </div>
  );
}

function Span8() {
  return (
    <div className="bg-[#e0e7ff] content-stretch flex h-[26px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0" data-name="SPAN-169">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#4f46e5] text-[12px] text-center text-nowrap">
        <p className="leading-[39px]">Sent to PR</p>
      </div>
    </div>
  );
}

function Td37() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[161px]" data-name="TD-236">
      <Span8 />
    </div>
  );
}

function Group5() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.665 12">
        <g id="Group">
          <g id="Vector">
            <path d={svgPaths.p22222380} fill="#202020" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute h-[16px] left-[0.01px] overflow-clip top-[4px] w-[16.656px]" data-name="Icon-247">
      <div className="absolute flex inset-[12.5%_42%] items-center justify-center">
        <div className="flex-none h-[12px] scale-y-[-100%] w-[2.665px]">
          <Group5 />
        </div>
      </div>
    </div>
  );
}

function I4() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-[16.672px]" data-name="I-246">
      <Icon4 />
    </div>
  );
}

function Button6() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="BUTTON-245">
      <I4 />
    </div>
  );
}

function Dropdown4() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start relative shrink-0 w-[54.922px]" data-name="dropdown4-244">
      <Button6 />
    </div>
  );
}

function Td39() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[100px]" data-name="TD-243">
      <Dropdown4 />
    </div>
  );
}

function Tr5() {
  return (
    <div className="bg-white content-stretch flex h-[68px] items-start pb-0 pt-px px-0 relative shrink-0" data-name="TR-214">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Td25 />
      <Td27 />
      <Td29 />
      <Td31 />
      <Td33 />
      <Td36 />
      <Td37 />
      <Td39 />
    </div>
  );
}

function A7() {
  return (
    <div className="content-center flex flex-wrap h-[43px] items-center relative shrink-0" data-name="A-318">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">BOQ-MAR25</p>
      </div>
    </div>
  );
}

function Td56() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[122px]" data-name="TD-317">
      <A7 />
    </div>
  );
}

function Td57() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[183px]" data-name="TD-321">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Mar 01 - Mar 15, 2025</p>
      </div>
    </div>
  );
}

function Td58() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[106px]" data-name="TD-324">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">11</p>
      </div>
    </div>
  );
}

function Td59() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[104px]" data-name="TD-327">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">3</p>
      </div>
    </div>
  );
}

function Div26() {
  return (
    <div className="bg-[#dc2626] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="DIV-332">
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[24px]">MP</p>
      </div>
    </div>
  );
}

function MarginWrap8() {
  return (
    <div className="content-stretch flex items-start pl-0 pr-[8px] py-0 relative shrink-0" data-name="margin-wrap">
      <Div26 />
    </div>
  );
}

function Span16() {
  return (
    <div className="content-center flex flex-wrap h-[48px] items-center relative shrink-0 w-[101.703px]" data-name="SPAN-335">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Michael Peterson</p>
      </div>
    </div>
  );
}

function Div25() {
  return (
    <div className="content-stretch flex h-[48px] items-center relative shrink-0 w-[135.984px]" data-name="DIV-331">
      <MarginWrap8 />
      <Span16 />
    </div>
  );
}

function Td60() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[180px]" data-name="TD-330">
      <Div25 />
    </div>
  );
}

function Td61() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[121px]" data-name="TD-338">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Mar 16, 2025</p>
      </div>
    </div>
  );
}

function Span9() {
  return (
    <div className="bg-[#e0e7ff] content-stretch flex h-[26px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0" data-name="SPAN-169">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#4f46e5] text-[12px] text-center text-nowrap">
        <p className="leading-[39px]">Sent to PR</p>
      </div>
    </div>
  );
}

function Td62() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[161px]" data-name="TD-338">
      <Span9 />
    </div>
  );
}

function Group6() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.665 12">
        <g id="Group">
          <g id="Vector">
            <path d={svgPaths.p22222380} fill="#202020" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute h-[16px] left-[0.01px] overflow-clip top-[4px] w-[16.656px]" data-name="Icon-349">
      <div className="absolute flex inset-[12.5%_42%] items-center justify-center">
        <div className="flex-none h-[12px] scale-y-[-100%] w-[2.665px]">
          <Group6 />
        </div>
      </div>
    </div>
  );
}

function I11() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-[16.672px]" data-name="I-348">
      <Icon11 />
    </div>
  );
}

function Button13() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="BUTTON-347">
      <I11 />
    </div>
  );
}

function Dropdown7() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start relative shrink-0 w-[54.922px]" data-name="dropdown7-346">
      <Button13 />
    </div>
  );
}

function Td63() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[100px]" data-name="TD-345">
      <Dropdown7 />
    </div>
  );
}

function Tr8() {
  return (
    <div className="content-stretch flex h-[68px] items-start pb-0 pt-px px-0 relative shrink-0" data-name="TR-316">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Td56 />
      <Td57 />
      <Td58 />
      <Td59 />
      <Td60 />
      <Td61 />
      <Td62 />
      <Td63 />
    </div>
  );
}

function A6() {
  return (
    <div className="content-stretch flex h-[19px] items-start relative shrink-0 w-[126.5px]" data-name="A-284">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] w-[127px]">
        <p className="leading-[20px]">BOQ-MAR25</p>
      </div>
    </div>
  );
}

function Td48() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[122px]" data-name="TD-283">
      <A6 />
    </div>
  );
}

function Td49() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[183px]" data-name="TD-287">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Mar 15 - Mar 31, 2025</p>
      </div>
    </div>
  );
}

function Td50() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[106px]" data-name="TD-290">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">9</p>
      </div>
    </div>
  );
}

function Td51() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[104px]" data-name="TD-293">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">1</p>
      </div>
    </div>
  );
}

function Div24() {
  return (
    <div className="bg-[#8b5cf6] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="DIV-298">
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[24px]">JW</p>
      </div>
    </div>
  );
}

function MarginWrap9() {
  return (
    <div className="content-stretch flex items-start pl-0 pr-[8px] py-0 relative shrink-0" data-name="margin-wrap">
      <Div24 />
    </div>
  );
}

function Span15() {
  return (
    <div className="content-center flex flex-wrap h-[48px] items-center relative shrink-0 w-[97.047px]" data-name="SPAN-301">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">James Wilson</p>
      </div>
    </div>
  );
}

function Div23() {
  return (
    <div className="content-stretch flex h-[48px] items-center relative shrink-0 w-[135.984px]" data-name="DIV-297">
      <MarginWrap9 />
      <Span15 />
    </div>
  );
}

function Td52() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[180px]" data-name="TD-296">
      <Div23 />
    </div>
  );
}

function Td53() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[121px]" data-name="TD-304">
      <div className="-webkit-box flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">Mar 31, 2025</p>
      </div>
    </div>
  );
}

function Span3() {
  return (
    <div className="bg-[#fef3c7] content-stretch flex h-[26px] items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0 w-[84.313px]" data-name="SPAN-112">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#d97706] text-[12px] text-center text-nowrap">
        <p className="leading-[20px]">Draft</p>
      </div>
    </div>
  );
}

function Td54() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[161px]" data-name="TD-304">
      <Span3 />
    </div>
  );
}

function Group7() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.665 12">
        <g id="Group">
          <g id="Vector">
            <path d={svgPaths.p22222380} fill="#202020" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
            <path d={svgPaths.p22222380} fill="black" fillOpacity="0.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute h-[16px] left-[0.01px] overflow-clip top-[4px] w-[16.656px]" data-name="Icon-315">
      <div className="absolute flex inset-[12.5%_42%] items-center justify-center">
        <div className="flex-none h-[12px] scale-y-[-100%] w-[2.665px]">
          <Group7 />
        </div>
      </div>
    </div>
  );
}

function I10() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-[16.672px]" data-name="I-314">
      <Icon10 />
    </div>
  );
}

function Button12() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="BUTTON-313">
      <I10 />
    </div>
  );
}

function Dropdown6() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start relative shrink-0 w-[54.922px]" data-name="dropdown6-312">
      <Button12 />
    </div>
  );
}

function Td55() {
  return (
    <div className="content-stretch flex flex-col h-[68px] items-start justify-center px-[24px] py-[16px] relative shrink-0 w-[100px]" data-name="TD-311">
      <Dropdown6 />
    </div>
  );
}

function Tr7() {
  return (
    <div className="bg-white content-stretch flex h-[68px] items-start pb-0 pt-px px-0 relative shrink-0" data-name="TR-282">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Td48 />
      <Td49 />
      <Td50 />
      <Td51 />
      <Td52 />
      <Td53 />
      <Td54 />
      <Td55 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <Tr1 />
      <Tr2 />
      <Tr3 />
      <Tr4 />
      <Tr6 />
      <Tr5 />
      <Tr8 />
      <Tr5 />
      <Tr4 />
      <Tr7 />
    </div>
  );
}

function Tbody() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative shrink-0" data-name="TBODY-111">
      <Frame19 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0 w-full">
      <Thead />
      <Tbody />
    </div>
  );
}

function Label() {
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

function Div4() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[20px]" data-name="DIV-34">
      <CaretDown />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center text-nowrap">
        <p className="leading-[20px]">10</p>
      </div>
      <Div4 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex h-[32px] items-center px-[12px] py-[9px] relative rounded-[8px] shrink-0" data-name="BUTTON-33">
      <Frame14 />
    </div>
  );
}

function Div18() {
  return (
    <div className="content-stretch flex gap-[12px] h-[32px] items-center relative shrink-0 w-[179px]" data-name="DIV-240">
      <Label />
      <Button />
    </div>
  );
}

function Span13() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[70.813px]" data-name="SPAN-248">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">1-10 of 103</p>
      </div>
    </div>
  );
}

function Group8() {
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

function Icon5() {
  return (
    <div className="absolute h-[16px] left-[0.01px] overflow-clip top-[4px] w-[16.656px]" data-name="Icon-254">
      <div className="absolute bottom-1/4 flex items-center justify-center left-[28%] right-[28%] top-1/4">
        <div className="flex-none h-[8px] scale-y-[-100%] w-[7.329px]">
          <Group8 />
        </div>
      </div>
    </div>
  );
}

function I5() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-[16.672px]" data-name="I-253">
      <Icon5 />
    </div>
  );
}

function Button7() {
  return (
    <div className="content-stretch flex items-center justify-center opacity-50 relative rounded-[8px] shrink-0 size-[32px]" data-name="BUTTON-252">
      <I5 />
    </div>
  );
}

function Group9() {
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

function Icon6() {
  return (
    <div className="absolute h-[16px] left-[0.01px] overflow-clip top-[4px] w-[16.656px]" data-name="Icon-257">
      <div className="absolute flex inset-[23.5%_34.48%] items-center justify-center">
        <div className="flex-none h-[8.48px] scale-y-[-100%] w-[5.17px]">
          <Group9 />
        </div>
      </div>
    </div>
  );
}

function I6() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-[16.672px]" data-name="I-256">
      <Icon6 />
    </div>
  );
}

function Button8() {
  return (
    <div className="content-stretch flex items-center justify-center opacity-50 relative rounded-[8px] shrink-0 size-[32px]" data-name="BUTTON-255">
      <I6 />
    </div>
  );
}

function Group10() {
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

function Icon7() {
  return (
    <div className="absolute h-[16px] left-[0.01px] overflow-clip top-[4px] w-[16.656px]" data-name="Icon-260">
      <div className="absolute flex inset-[23.5%_34.48%] items-center justify-center">
        <div className="flex-none h-[8.48px] scale-y-[-100%] w-[5.17px]">
          <Group10 />
        </div>
      </div>
    </div>
  );
}

function I7() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-[16.672px]" data-name="I-259">
      <Icon7 />
    </div>
  );
}

function Button9() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="BUTTON-258">
      <I7 />
    </div>
  );
}

function Group11() {
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

function Icon8() {
  return (
    <div className="absolute h-[16px] left-[0.01px] overflow-clip top-[4px] w-[16.656px]" data-name="Icon-263">
      <div className="absolute bottom-1/4 flex items-center justify-center left-[28%] right-[28%] top-1/4">
        <div className="flex-none h-[8px] scale-y-[-100%] w-[7.329px]">
          <Group11 />
        </div>
      </div>
    </div>
  );
}

function I8() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-[16.672px]" data-name="I-262">
      <Icon8 />
    </div>
  );
}

function Button10() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="BUTTON-261">
      <I8 />
    </div>
  );
}

function Div20() {
  return (
    <div className="content-stretch flex gap-[4px] h-[32px] items-center relative shrink-0 w-[140px]" data-name="DIV-251">
      <Button7 />
      <Button8 />
      <Button9 />
      <Button10 />
    </div>
  );
}

function Div19() {
  return (
    <div className="content-stretch flex gap-[24px] h-[32px] items-center relative shrink-0 w-[234.813px]" data-name="DIV-247">
      <Span13 />
      <Div20 />
    </div>
  );
}

function Div17() {
  return (
    <div className="absolute bg-white content-stretch flex h-[65px] items-center justify-between left-px pb-[16px] pt-[17px] px-[24px] top-[719px] w-[1077px]" data-name="DIV-239">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Div18 />
      <Div19 />
    </div>
  );
}

function Div5() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[785px] items-start left-[-1px] overflow-clip shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] top-[70px] w-[1077px]" data-name="DIV-49">
      <Frame18 />
      <Div17 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="absolute bg-white border border-[#e8e8e8] border-solid h-[855px] left-[338px] overflow-clip rounded-[6px] top-[128px] w-[1078px]">
      <Frame12 />
      <Div5 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[157px] items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[20px] text-nowrap">
        <p className="leading-[24px]">Rack</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col h-[64px] items-start justify-center relative shrink-0 w-[212px]">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Frame4 />
    </div>
  );
}

function Div34() {
  return (
    <div className="content-stretch flex h-[64px] items-center px-[16px] py-[8px] relative shrink-0 w-[239px]" data-name="DIV-388">
      <Frame6 />
    </div>
  );
}

function CaretDown1() {
  return (
    <div className="relative size-[15px]" data-name="caret-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="caret-down">
          <path d={svgPaths.p376fe680} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap">
        <p className="leading-[20px]">IRDS</p>
      </div>
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg]">
          <CaretDown1 />
        </div>
      </div>
    </div>
  );
}

function Span18() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0" data-name="SPAN-392">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] text-nowrap">
        <p className="leading-[20px]">Integrated Rack Diagnostic Suite</p>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <Span18 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0 w-[212px]">
      <Frame9 />
      <Frame5 />
    </div>
  );
}

function Div35() {
  return (
    <div className="bg-[rgba(27,89,248,0.05)] content-stretch flex h-[59px] items-center px-[16px] py-[8px] relative shrink-0 w-[239px]" data-name="DIV-388">
      <Frame10 />
    </div>
  );
}

function Grid() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="grid-2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="grid-2">
          <path d={svgPaths.p2c3dd400} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Span20() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[125.688px]" data-name="SPAN-399">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">
        <p className="leading-[20px]">Dashboard</p>
      </div>
    </div>
  );
}

function MarginWrap10() {
  return (
    <div className="content-stretch flex items-start pl-[12px] pr-0 py-0 relative shrink-0" data-name="margin-wrap">
      <Span20 />
    </div>
  );
}

function Div37() {
  return (
    <div className="content-stretch flex h-[36px] items-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[212px]" data-name="DIV-395">
      <Grid />
      <MarginWrap10 />
    </div>
  );
}

function CalendarCirclePlus() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="calendar-circle-plus">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="calendar-circle-plus">
          <path d={svgPaths.p3381b8f0} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Span21() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[125.688px]" data-name="SPAN-399">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">
        <p className="leading-[20px]">Inspection Cycle Planner</p>
      </div>
    </div>
  );
}

function MarginWrap11() {
  return (
    <div className="content-stretch flex items-start pl-[12px] pr-0 py-0 relative shrink-0" data-name="margin-wrap">
      <Span21 />
    </div>
  );
}

function Div38() {
  return (
    <div className="content-stretch flex h-[36px] items-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[212px]" data-name="DIV-395">
      <CalendarCirclePlus />
      <MarginWrap11 />
    </div>
  );
}

function MagnifyingGlass1() {
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

function Span22() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[125.688px]" data-name="SPAN-399">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">
        <p className="leading-[20px]">{`Inspection `}</p>
      </div>
    </div>
  );
}

function MarginWrap12() {
  return (
    <div className="content-stretch flex items-start pl-[12px] pr-0 py-0 relative shrink-0" data-name="margin-wrap">
      <Span22 />
    </div>
  );
}

function Div39() {
  return (
    <div className="content-stretch flex h-[36px] items-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[212px]" data-name="DIV-395">
      <MagnifyingGlass1 />
      <MarginWrap12 />
    </div>
  );
}

function DisplayChartUp() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="display-chart-up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="display-chart-up">
          <path d={svgPaths.p86c6a80} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Span23() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[143.172px]" data-name="SPAN-413">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">
        <p className="leading-[20px]">{`Inspection Cycle Insights  `}</p>
      </div>
    </div>
  );
}

function MarginWrap13() {
  return (
    <div className="content-stretch flex items-start pl-[12px] pr-0 py-0 relative shrink-0" data-name="margin-wrap">
      <Span23 />
    </div>
  );
}

function Div40() {
  return (
    <div className="content-stretch flex h-[36px] items-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[212px]" data-name="DIV-409">
      <DisplayChartUp />
      <MarginWrap13 />
    </div>
  );
}

function FileMagnifyingGlass() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="file-magnifying-glass">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="file-magnifying-glass">
          <path d={svgPaths.p150d7b00} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Span24() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[143.172px]" data-name="SPAN-413">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">
        <p className="leading-[20px]">Inspection Findings</p>
      </div>
    </div>
  );
}

function MarginWrap14() {
  return (
    <div className="content-stretch flex items-start pl-[12px] pr-0 py-0 relative shrink-0" data-name="margin-wrap">
      <Span24 />
    </div>
  );
}

function Div41() {
  return (
    <div className="content-stretch flex h-[36px] items-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[212px]" data-name="DIV-409">
      <FileMagnifyingGlass />
      <MarginWrap14 />
    </div>
  );
}

function UserMagnifyingGlass() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="user-magnifying-glass">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="user-magnifying-glass">
          <path d={svgPaths.p10095700} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Span25() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[143.172px]" data-name="SPAN-413">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">
        <p className="leading-[20px]">TPI Findings</p>
      </div>
    </div>
  );
}

function MarginWrap15() {
  return (
    <div className="content-stretch flex items-start pl-[12px] pr-0 py-0 relative shrink-0" data-name="margin-wrap">
      <Span25 />
    </div>
  );
}

function Div42() {
  return (
    <div className="content-stretch flex h-[36px] items-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[212px]" data-name="DIV-409">
      <UserMagnifyingGlass />
      <MarginWrap15 />
    </div>
  );
}

function MemoCircleCheck() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="memo-circle-check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="memo-circle-check">
          <path d={svgPaths.p24413c00} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Span26() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[143.172px]" data-name="SPAN-413">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">
        <p className="leading-[20px]">Integrity Test</p>
      </div>
    </div>
  );
}

function MarginWrap16() {
  return (
    <div className="content-stretch flex items-start pl-[12px] pr-0 py-0 relative shrink-0" data-name="margin-wrap">
      <Span26 />
    </div>
  );
}

function Div43() {
  return (
    <div className="content-stretch flex h-[36px] items-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[212px]" data-name="DIV-409">
      <MemoCircleCheck />
      <MarginWrap16 />
    </div>
  );
}

function FileWaveform() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="file-waveform">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="file-waveform">
          <path d={svgPaths.p3cb1bd80} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Span19() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[74.828px]" data-name="SPAN-392">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">
        <p className="leading-[20px]">Rack Health Analytics</p>
      </div>
    </div>
  );
}

function MarginWrap17() {
  return (
    <div className="content-stretch flex items-start pl-[12px] pr-0 py-0 relative shrink-0" data-name="margin-wrap">
      <Span19 />
    </div>
  );
}

function Div36() {
  return (
    <div className="content-stretch flex h-[36px] items-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[212px]" data-name="DIV-388">
      <FileWaveform />
      <MarginWrap17 />
    </div>
  );
}

function CircleExclamationCheck() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="circle-exclamation-check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="circle-exclamation-check">
          <path d={svgPaths.p1f206400} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Span27() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[143.172px]" data-name="SPAN-413">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">
        <p className="leading-[20px]">Call To Action</p>
      </div>
    </div>
  );
}

function MarginWrap18() {
  return (
    <div className="content-stretch flex items-start pl-[12px] pr-0 py-0 relative shrink-0" data-name="margin-wrap">
      <Span27 />
    </div>
  );
}

function Div44() {
  return (
    <div className="content-stretch flex h-[36px] items-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[212px]" data-name="DIV-409">
      <CircleExclamationCheck />
      <MarginWrap18 />
    </div>
  );
}

function FileInvoiceDollar() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="file-invoice-dollar">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="file-invoice-dollar">
          <g id="Primary">
            <path d={svgPaths.p3bd18d80} fill="var(--fill-0, #202020)" />
            <path d={svgPaths.p3bd18d80} fill="var(--fill-1, black)" fillOpacity="0.2" />
            <path d={svgPaths.p3bd18d80} fill="var(--fill-2, black)" fillOpacity="0.2" />
            <path d={svgPaths.p3bd18d80} fill="var(--fill-3, black)" fillOpacity="0.2" />
            <path d={svgPaths.p3bd18d80} fill="var(--fill-4, black)" fillOpacity="0.2" />
            <path d={svgPaths.p3bd18d80} fill="var(--fill-5, black)" fillOpacity="0.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Span28() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[143.172px]" data-name="SPAN-413">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] text-nowrap">
        <p className="leading-[20px]">Bill Of Quantity</p>
      </div>
    </div>
  );
}

function MarginWrap19() {
  return (
    <div className="content-stretch flex items-start pl-[12px] pr-0 py-0 relative shrink-0" data-name="margin-wrap">
      <Span28 />
    </div>
  );
}

function Div45() {
  return (
    <div className="bg-[rgba(27,89,248,0.05)] content-stretch flex h-[36px] items-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[212px]" data-name="DIV-409">
      <FileInvoiceDollar />
      <MarginWrap19 />
    </div>
  );
}

function Note() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="note">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="note">
          <path d={svgPaths.pda0fc0} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Span29() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[143.172px]" data-name="SPAN-413">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap w-[169px]">
        <p className="leading-[20px] overflow-ellipsis overflow-hidden">Element Stock Management</p>
      </div>
    </div>
  );
}

function MarginWrap20() {
  return (
    <div className="content-stretch flex items-start pl-[12px] pr-0 py-0 relative shrink-0" data-name="margin-wrap">
      <Span29 />
    </div>
  );
}

function Div46() {
  return (
    <div className="content-stretch flex h-[36px] items-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[212px]" data-name="DIV-409">
      <Note />
      <MarginWrap20 />
    </div>
  );
}

function MoneyCheckDollar() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="money-check-dollar">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="money-check-dollar">
          <path d={svgPaths.p1bc9bf80} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Span30() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[143.172px]" data-name="SPAN-413">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap w-[169px]">
        <p className="leading-[20px] overflow-ellipsis overflow-hidden">{`Purchase Request & Specs`}</p>
      </div>
    </div>
  );
}

function MarginWrap21() {
  return (
    <div className="content-stretch flex items-start pl-[12px] pr-0 py-0 relative shrink-0" data-name="margin-wrap">
      <Span30 />
    </div>
  );
}

function Div47() {
  return (
    <div className="content-stretch flex h-[36px] items-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[212px]" data-name="DIV-409">
      <MoneyCheckDollar />
      <MarginWrap21 />
    </div>
  );
}

function ScrewdriverWrench() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="screwdriver-wrench">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="screwdriver-wrench">
          <path d={svgPaths.p2d73780} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Span31() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[143.172px]" data-name="SPAN-413">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">
        <p className="leading-[20px]">Maintenance</p>
      </div>
    </div>
  );
}

function MarginWrap22() {
  return (
    <div className="content-stretch flex items-start pl-[12px] pr-0 py-0 relative shrink-0" data-name="margin-wrap">
      <Span31 />
    </div>
  );
}

function Div48() {
  return (
    <div className="content-stretch flex h-[36px] items-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[212px]" data-name="DIV-409">
      <ScrewdriverWrench />
      <MarginWrap22 />
    </div>
  );
}

function BadgeCheck() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="badge-check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="badge-check">
          <path d={svgPaths.p3ac20b00} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Span32() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[143.172px]" data-name="SPAN-413">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">
        <p className="leading-[20px]">Compliance</p>
      </div>
    </div>
  );
}

function MarginWrap23() {
  return (
    <div className="content-stretch flex items-start pl-[12px] pr-0 py-0 relative shrink-0" data-name="margin-wrap">
      <Span32 />
    </div>
  );
}

function Div49() {
  return (
    <div className="content-stretch flex h-[36px] items-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[212px]" data-name="DIV-409">
      <BadgeCheck />
      <MarginWrap23 />
    </div>
  );
}

function FileContract() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="file-contract">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="file-contract">
          <path d={svgPaths.p3f1b1100} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Span33() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[143.172px]" data-name="SPAN-413">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">
        <p className="leading-[20px]">Rules and Action</p>
      </div>
    </div>
  );
}

function MarginWrap24() {
  return (
    <div className="content-stretch flex items-start pl-[12px] pr-0 py-0 relative shrink-0" data-name="margin-wrap">
      <Span33 />
    </div>
  );
}

function Div50() {
  return (
    <div className="content-stretch flex h-[36px] items-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[212px]" data-name="DIV-409">
      <FileContract />
      <MarginWrap24 />
    </div>
  );
}

function FileCircleExclamation() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="file-circle-exclamation">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="file-circle-exclamation">
          <path d={svgPaths.p10765c00} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Span34() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[143.172px]" data-name="SPAN-413">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">
        <p className="leading-[20px]">Escalation Logs</p>
      </div>
    </div>
  );
}

function MarginWrap25() {
  return (
    <div className="content-stretch flex items-start pl-[12px] pr-0 py-0 relative shrink-0" data-name="margin-wrap">
      <Span34 />
    </div>
  );
}

function Div51() {
  return (
    <div className="content-stretch flex h-[36px] items-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[212px]" data-name="DIV-409">
      <FileCircleExclamation />
      <MarginWrap25 />
    </div>
  );
}

function CompassDrafting() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="compass-drafting">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="compass-drafting">
          <path d={svgPaths.p8bb4980} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Span35() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[143.172px]" data-name="SPAN-413">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">
        <p className="leading-[20px]">LARC Drawings</p>
      </div>
    </div>
  );
}

function MarginWrap26() {
  return (
    <div className="content-stretch flex items-start pl-[12px] pr-0 py-0 relative shrink-0" data-name="margin-wrap">
      <Span35 />
    </div>
  );
}

function Div52() {
  return (
    <div className="content-stretch flex h-[36px] items-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[212px]" data-name="DIV-409">
      <CompassDrafting />
      <MarginWrap26 />
    </div>
  );
}

function FileChartColumn() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="file-chart-column">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="file-chart-column">
          <path d={svgPaths.p3c126200} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Span36() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[143.172px]" data-name="SPAN-413">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">
        <p className="leading-[20px]">Report</p>
      </div>
    </div>
  );
}

function MarginWrap27() {
  return (
    <div className="content-stretch flex items-start pl-[12px] pr-0 py-0 relative shrink-0" data-name="margin-wrap">
      <Span36 />
    </div>
  );
}

function Div53() {
  return (
    <div className="content-stretch flex h-[36px] items-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[212px]" data-name="DIV-409">
      <FileChartColumn />
      <MarginWrap27 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0">
      <Div37 />
      <Div38 />
      <Div39 />
      <Div40 />
      <Div41 />
      <Div42 />
      <Div43 />
      <Div36 />
      <Div44 />
      <Div45 />
      <Div46 />
      <Div47 />
      <Div48 />
      <Div49 />
      <Div50 />
      <Div51 />
      <Div52 />
      <Div53 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[239px]">
      <Div35 />
      <Frame7 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <Frame8 />
    </div>
  );
}

function Racks() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] h-[1519px] items-start relative shrink-0 w-[239px]" data-name="racks-383">
      <Div34 />
      <Frame11 />
    </div>
  );
}

function Div33() {
  return (
    <div className="content-stretch flex flex-col h-[1519px] items-start pb-[8px] pt-0 px-0 relative shrink-0 w-[239px]" data-name="DIV-382">
      <Racks />
    </div>
  );
}

function SecondarySidebar() {
  return (
    <div className="bg-white h-[1024px] relative shrink-0 w-[240px]" data-name="secondary-sidebar-368">
      <div className="content-stretch flex flex-col items-start overflow-clip pl-0 pr-px py-0 relative rounded-[inherit] size-full">
        <Div33 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame15() {
  return (
    <div className="absolute content-stretch flex h-[1181px] items-start left-[75px] top-0">
      <SecondarySidebar />
    </div>
  );
}

function Frame16() {
  return (
    <div className="relative shrink-0 size-[48px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
        <g id="Frame 1410114905">
          <rect fill="var(--fill-0, white)" fillOpacity="0.09" height="48" rx="24" width="48" />
          <path d={svgPaths.p19098580} fill="var(--fill-0, white)" id="Subtract" />
        </g>
      </svg>
    </div>
  );
}

function Div54() {
  return (
    <div className="bg-[#172b4d] content-stretch flex h-[63px] items-center justify-center relative shrink-0 w-[75px]" data-name="DIV-424">
      <Frame16 />
    </div>
  );
}

function WindowRestore() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="window-restore">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="window-restore">
          <path d={svgPaths.p3bb47af0} fill="var(--fill-0, #D1D5DB)" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Div57() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[40px]" data-name="DIV-430">
      <WindowRestore />
    </div>
  );
}

function Div56() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 size-[40px]" data-name="DIV-429">
      <Div57 />
    </div>
  );
}

function Span37() {
  return (
    <div className="content-stretch flex h-[16px] items-center relative shrink-0 w-[61.906px]" data-name="SPAN-434">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#d1d5db] text-[12px] text-nowrap">
        <p className="leading-[20px]">Digital Twin</p>
      </div>
    </div>
  );
}

function MarginWrap28() {
  return (
    <div className="content-stretch flex items-start pb-0 pt-[4px] px-0 relative shrink-0 w-[65px]" data-name="margin-wrap">
      <Span37 />
    </div>
  );
}

function Div58() {
  return (
    <div className="content-stretch flex flex-col h-[60px] items-center relative shrink-0 w-full" data-name="DIV-430">
      <Div56 />
      <MarginWrap28 />
    </div>
  );
}

function Div59() {
  return (
    <div className="content-stretch flex flex-col h-[60px] items-start relative shrink-0 w-[67px]" data-name="DIV-429">
      <Div58 />
    </div>
  );
}

function Shelves() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="shelves">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="shelves">
          <path d={svgPaths.p102caa50} fill="var(--fill-0, #172B4D)" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Div63() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center relative rounded-[6px] shrink-0 size-[40px]" data-name="DIV-438">
      <Shelves />
    </div>
  );
}

function Span39() {
  return (
    <div className="content-stretch flex h-[16px] items-center relative shrink-0" data-name="SPAN-450">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#d1d5db] text-[12px] text-nowrap">
        <p className="leading-[20px]">Rack</p>
      </div>
    </div>
  );
}

function MarginWrap29() {
  return (
    <div className="content-stretch flex items-start pb-0 pt-[4px] px-0 relative shrink-0" data-name="margin-wrap">
      <Span39 />
    </div>
  );
}

function Div66() {
  return (
    <div className="content-stretch flex flex-col h-[60px] items-center relative shrink-0 w-[40px]" data-name="DIV-446">
      <Div63 />
      <MarginWrap29 />
    </div>
  );
}

function Div65() {
  return (
    <div className="content-stretch flex flex-col h-[60px] items-start relative shrink-0 w-[40px]" data-name="DIV-445">
      <Div66 />
    </div>
  );
}

function MarginWrap30() {
  return (
    <div className="content-stretch flex items-start pb-0 pt-[24px] px-0 relative shrink-0" data-name="margin-wrap">
      <Div65 />
    </div>
  );
}

function Forklift() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="forklift">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="forklift">
          <path d={svgPaths.p3cd51900} fill="var(--fill-0, #D1D5DB)" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Div61() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[6px] shrink-0 size-[40px]" data-name="DIV-434">
      <Forklift />
    </div>
  );
}

function Div60() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 size-[40px]" data-name="DIV-433">
      <Div61 />
    </div>
  );
}

function Span38() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-center relative shrink-0 w-[32.469px]" data-name="SPAN-442">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap text-white">
        <p className="leading-[20px]">MHE</p>
      </div>
    </div>
  );
}

function MarginWrap31() {
  return (
    <div className="content-stretch flex items-start pb-0 pt-[4px] px-0 relative shrink-0" data-name="margin-wrap">
      <Span38 />
    </div>
  );
}

function Div64() {
  return (
    <div className="content-stretch flex flex-col h-[60px] items-center relative shrink-0 w-[40px]" data-name="DIV-438">
      <Div60 />
      <MarginWrap31 />
    </div>
  );
}

function Div62() {
  return (
    <div className="content-stretch flex flex-col h-[60px] items-start relative shrink-0 w-[40px]" data-name="DIV-437">
      <Div64 />
    </div>
  );
}

function MarginWrap32() {
  return (
    <div className="content-stretch flex items-start pb-0 pt-[24px] px-0 relative shrink-0" data-name="margin-wrap">
      <Div62 />
    </div>
  );
}

function PalletBox() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="pallet-box">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="pallet-box">
          <path d={svgPaths.p93fa000} fill="var(--fill-0, #D1D5DB)" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Span40() {
  return (
    <div className="content-stretch flex h-[16px] items-center relative shrink-0 w-[33.641px]" data-name="SPAN-458">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#d1d5db] text-[12px] text-nowrap">
        <p className="leading-[20px]">Pallet</p>
      </div>
    </div>
  );
}

function MarginWrap33() {
  return (
    <div className="content-stretch flex items-start pb-0 pt-[4px] px-0 relative shrink-0" data-name="margin-wrap">
      <Span40 />
    </div>
  );
}

function Div68() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-[40px]" data-name="DIV-454">
      <PalletBox />
      <MarginWrap33 />
    </div>
  );
}

function Div67() {
  return (
    <div className="content-stretch flex flex-col h-[60px] items-start relative shrink-0 w-[40px]" data-name="DIV-453">
      <Div68 />
    </div>
  );
}

function MarginWrap34() {
  return (
    <div className="content-stretch flex items-start pb-0 pt-[24px] px-0 relative shrink-0" data-name="margin-wrap">
      <Div67 />
    </div>
  );
}

function Group12() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6257 15.9961">
        <g id="Group">
          <path d={svgPaths.p3febe040} fill="var(--fill-0, #D1D5DB)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon14() {
  return (
    <div className="absolute h-[21.328px] left-0 overflow-clip top-[-2.67px] w-[22.203px]" data-name="Icon-465">
      <div className="absolute flex inset-[12.5%_12.56%] items-center justify-center">
        <div className="flex-none h-[15.996px] scale-y-[-100%] w-[16.626px]">
          <Group12 />
        </div>
      </div>
    </div>
  );
}

function I14() {
  return (
    <div className="content-stretch flex h-[15.984px] items-center relative shrink-0 w-[22.219px]" data-name="I-464">
      <Icon14 />
    </div>
  );
}

function Div72() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[40px]" data-name="DIV-463">
      <I14 />
    </div>
  );
}

function Span41() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-center relative shrink-0 w-[49px]" data-name="SPAN-466">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#d1d5db] text-[12px] text-nowrap">
        <p className="leading-[20px]">Analytics</p>
      </div>
    </div>
  );
}

function MarginWrap35() {
  return (
    <div className="content-stretch flex items-start pb-0 pt-[4px] px-0 relative shrink-0" data-name="margin-wrap">
      <Span41 />
    </div>
  );
}

function Div71() {
  return (
    <div className="content-stretch flex flex-col h-[60px] items-center relative shrink-0 w-[68.016px]" data-name="DIV-462">
      <Div72 />
      <MarginWrap35 />
    </div>
  );
}

function Div70() {
  return (
    <div className="content-stretch flex flex-col h-[60px] items-start relative shrink-0 w-[68.016px]" data-name="DIV-461">
      <Div71 />
    </div>
  );
}

function MarginWrap36() {
  return (
    <div className="content-stretch flex items-start pb-0 pt-[24px] px-0 relative shrink-0" data-name="margin-wrap">
      <Div70 />
    </div>
  );
}

function Microchip() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="microchip">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="microchip">
          <path d={svgPaths.p9350a80} fill="var(--fill-0, #D1D5DB)" id="Primary" />
        </g>
      </svg>
    </div>
  );
}

function Div73() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[40px]" data-name="DIV-463">
      <Microchip />
    </div>
  );
}

function Span42() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-center relative shrink-0 w-[49px]" data-name="SPAN-466">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#d1d5db] text-[12px] text-nowrap">
        <p className="leading-[20px]">IOT</p>
      </div>
    </div>
  );
}

function MarginWrap37() {
  return (
    <div className="content-stretch flex items-start pb-0 pt-[4px] px-0 relative shrink-0" data-name="margin-wrap">
      <Span42 />
    </div>
  );
}

function Div74() {
  return (
    <div className="content-stretch flex flex-col h-[60px] items-center relative shrink-0 w-[68.016px]" data-name="DIV-462">
      <Div73 />
      <MarginWrap37 />
    </div>
  );
}

function Div75() {
  return (
    <div className="content-stretch flex flex-col h-[60px] items-start relative shrink-0 w-[68.016px]" data-name="DIV-461">
      <Div74 />
    </div>
  );
}

function MarginWrap38() {
  return (
    <div className="content-stretch flex items-start pb-0 pt-[24px] px-0 relative shrink-0" data-name="margin-wrap">
      <Div75 />
    </div>
  );
}

function Group13() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9863 17.7734">
        <g id="Group">
          <path d={svgPaths.p1e4edc00} fill="var(--fill-0, #D1D5DB)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon15() {
  return (
    <div className="absolute h-[21.328px] left-0 overflow-clip top-[-2.67px] w-[22.203px]" data-name="Icon-473">
      <div className="absolute flex inset-[8.33%_14%] items-center justify-center">
        <div className="flex-none h-[17.773px] scale-y-[-100%] w-[15.986px]">
          <Group13 />
        </div>
      </div>
    </div>
  );
}

function I15() {
  return (
    <div className="content-stretch flex h-[15.984px] items-center relative shrink-0 w-[22.219px]" data-name="I-472">
      <Icon15 />
    </div>
  );
}

function Div78() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[40px]" data-name="DIV-471">
      <I15 />
    </div>
  );
}

function Span43() {
  return (
    <div className="content-stretch flex h-[16px] items-center relative shrink-0 w-[36.313px]" data-name="SPAN-474">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#d1d5db] text-[12px] text-nowrap">
        <p className="leading-[20px]">Library</p>
      </div>
    </div>
  );
}

function MarginWrap39() {
  return (
    <div className="content-stretch flex items-start pb-0 pt-[4px] px-0 relative shrink-0" data-name="margin-wrap">
      <Span43 />
    </div>
  );
}

function Div77() {
  return (
    <div className="content-stretch flex flex-col h-[60px] items-center relative shrink-0 w-[40px]" data-name="DIV-470">
      <Div78 />
      <MarginWrap39 />
    </div>
  );
}

function Div76() {
  return (
    <div className="content-stretch flex flex-col h-[60px] items-start relative shrink-0 w-[40px]" data-name="DIV-469">
      <Div77 />
    </div>
  );
}

function MarginWrap40() {
  return (
    <div className="content-stretch flex items-start pb-0 pt-[24px] px-0 relative shrink-0" data-name="margin-wrap">
      <Div76 />
    </div>
  );
}

function Group14() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.1231 17.7912">
        <g id="Group">
          <path d={svgPaths.p12ca3c80} fill="var(--fill-0, #D1D5DB)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon16() {
  return (
    <div className="absolute h-[21.328px] left-0 overflow-clip top-[-2.67px] w-[22.203px]" data-name="Icon-481">
      <div className="absolute flex inset-[8.29%_11.44%] items-center justify-center">
        <div className="flex-none h-[17.791px] scale-y-[-100%] w-[17.123px]">
          <Group14 />
        </div>
      </div>
    </div>
  );
}

function I16() {
  return (
    <div className="content-stretch flex h-[15.984px] items-center relative shrink-0 w-[22.219px]" data-name="I-480">
      <Icon16 />
    </div>
  );
}

function Div81() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[40px]" data-name="DIV-479">
      <I16 />
    </div>
  );
}

function Span44() {
  return (
    <div className="content-stretch flex h-[16px] items-center relative shrink-0 w-[34.656px]" data-name="SPAN-482">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#d1d5db] text-[12px] text-nowrap">
        <p className="leading-[20px]">Admin</p>
      </div>
    </div>
  );
}

function MarginWrap41() {
  return (
    <div className="content-stretch flex items-start pb-0 pt-[4px] px-0 relative shrink-0" data-name="margin-wrap">
      <Span44 />
    </div>
  );
}

function Div80() {
  return (
    <div className="content-stretch flex flex-col h-[60px] items-center relative shrink-0 w-[40px]" data-name="DIV-478">
      <Div81 />
      <MarginWrap41 />
    </div>
  );
}

function Div79() {
  return (
    <div className="content-stretch flex flex-col h-[60px] items-start relative shrink-0 w-[40px]" data-name="DIV-477">
      <Div80 />
    </div>
  );
}

function MarginWrap42() {
  return (
    <div className="content-stretch flex items-start pb-0 pt-[24px] px-0 relative shrink-0" data-name="margin-wrap">
      <Div79 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <Div59 />
      <MarginWrap30 />
      <MarginWrap32 />
      <MarginWrap34 />
      <MarginWrap36 />
      <MarginWrap38 />
      <MarginWrap40 />
      <MarginWrap42 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0">
      <Div54 />
      <Frame17 />
    </div>
  );
}

function Div55() {
  return (
    <div className="absolute bg-[#172b4d] content-stretch flex flex-col h-[1532px] items-center left-0 top-0 w-[75px]" data-name="DIV-428">
      <Frame3 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="absolute h-[1532px] left-0 top-0 w-[315px]">
      <Frame15 />
      <Div55 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="absolute bg-white h-[1024px] left-0 top-0 w-[315px]">
      <Frame20 />
    </div>
  );
}

function Group15() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.7625 18.6621">
        <g id="Group">
          <path d={svgPaths.p115d0c00} fill="var(--fill-0, #202020)" fillOpacity="0.6" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon13() {
  return (
    <div className="absolute h-[21.328px] left-0 overflow-clip top-[-2.67px] w-[22.203px]" data-name="Icon-460">
      <div className="absolute flex inset-[6.25%_10.01%_6.25%_9.99%] items-center justify-center">
        <div className="flex-none h-[18.662px] scale-y-[-100%] w-[17.763px]">
          <Group15 />
        </div>
      </div>
    </div>
  );
}

function I13() {
  return (
    <div className="content-stretch flex h-[15.984px] items-center relative shrink-0 w-[22.219px]" data-name="I-459">
      <Icon13 />
    </div>
  );
}

function Div69() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[40px]" data-name="DIV-458">
      <I13 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Div69 />
    </div>
  );
}

function Group16() {
  return (
    <div className="relative size-full" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.21 18.6621">
        <g id="Group">
          <path d={svgPaths.p36577bf0} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon12() {
  return (
    <div className="absolute h-[21.328px] left-0 overflow-clip top-[-2.67px] w-[22.203px]" data-name="Icon-373">
      <div className="absolute flex inset-[6.25%_17.98%_6.25%_18.02%] items-center justify-center">
        <div className="flex-none h-[18.662px] scale-y-[-100%] w-[14.21px]">
          <Group16 />
        </div>
      </div>
    </div>
  );
}

function I12() {
  return (
    <div className="content-stretch flex h-[15.984px] items-center relative shrink-0 w-[22.219px]" data-name="I-372">
      <Icon12 />
    </div>
  );
}

function Div29() {
  return (
    <div className="bg-[#1b59f8] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[40px]" data-name="DIV-371">
      <I12 />
    </div>
  );
}

function Div31() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[122.453px]" data-name="DIV-375">
      <div className="flex flex-col font-['Roboto:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px]">Sarah Johnson</p>
      </div>
    </div>
  );
}

function Span17() {
  return <div className="bg-[#05a4b6] rounded-[9999px] shrink-0 size-[8px]" data-name="SPAN-379" />;
}

function MarginWrap43() {
  return (
    <div className="content-stretch flex items-start pl-0 pr-[6px] py-0 relative shrink-0" data-name="margin-wrap">
      <Span17 />
    </div>
  );
}

function Div32() {
  return (
    <div className="content-stretch flex h-[16px] items-center relative shrink-0 w-[122.453px]" data-name="DIV-378">
      <MarginWrap43 />
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[16px]">{`PRSES `}</p>
      </div>
    </div>
  );
}

function Div30() {
  return (
    <div className="content-stretch flex flex-col h-[36px] items-start relative shrink-0 w-[122.453px]" data-name="DIV-374">
      <Div31 />
      <Div32 />
    </div>
  );
}

function MarginWrap44() {
  return (
    <div className="content-stretch flex items-start pl-[12px] pr-0 py-0 relative shrink-0" data-name="margin-wrap">
      <Div30 />
    </div>
  );
}

function Div28() {
  return (
    <div className="content-stretch flex h-[40px] items-center relative shrink-0 w-[178px]" data-name="DIV-370">
      <Div29 />
      <MarginWrap44 />
    </div>
  );
}

function Div27() {
  return (
    <div className="content-stretch flex flex-col h-[64px] items-start justify-center pb-[17px] pl-[16px] pr-[20px] pt-[16px] relative shrink-0 w-[215px]" data-name="DIV-369">
      <Div28 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[5px] items-center relative shrink-0">
      <Frame1 />
      <Div27 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0 w-[1126px]">
      <Frame2 />
    </div>
  );
}

function MarginWrap45() {
  return (
    <div className="absolute bg-white content-stretch flex h-[64px] items-start left-[315px] top-0 w-[1125px]" data-name="margin-wrap">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Frame />
    </div>
  );
}

export default function Frame22() {
  return (
    <div className="bg-[#f9f9f9] relative size-full">
      <Frame21 />
      <MarginWrap45 />
      <MarginWrap />
      <Frame13 />
    </div>
  );
}