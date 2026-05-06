function Heading() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[16px] text-nowrap top-0">Event Overview</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[21px] relative shrink-0 w-[128.906px]" data-name="Container">
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
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #202020)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function IrdsCreateEventScreen() {
  return (
    <div className="h-[21px] relative shrink-0 w-[301px]" data-name="IRDSCreateEventScreen">
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
    <div className="absolute content-stretch flex h-[15px] items-start left-0 top-[6px] w-[63.922px]" data-name="Label">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">Event Type</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[18px] left-0 top-[26px] w-[301px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[12px] text-nowrap top-0">Inspection</p>
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
    <div className="absolute content-stretch flex h-[15px] items-start left-0 top-[6px] w-[71.859px]" data-name="Label">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">Event Scope</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[18px] left-0 top-[26px] w-[301px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[12px] text-nowrap top-0">Warehouse</p>
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
    <div className="absolute content-stretch flex h-[15px] items-start left-0 top-[6px] w-[84.313px]" data-name="Label">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">Event Duration</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[18px] left-0 top-[26px] w-[301px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[12px] text-nowrap top-0">Oct 07 – Oct 30, 2025 (23 days)</p>
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

function Label3() {
  return (
    <div className="absolute content-stretch flex h-[15px] items-start left-0 top-[6px] w-[104.078px]" data-name="Label">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">Repeat Frequency</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute h-[18px] left-0 top-[26px] w-[301px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[12px] text-nowrap top-0">Does not repeat</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="Container">
      <Label3 />
      <Paragraph3 />
    </div>
  );
}

function Label4() {
  return (
    <div className="absolute content-stretch flex h-[15px] items-start left-0 top-[6px] w-[66.953px]" data-name="Label">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">Repeat End Date</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute h-[18px] left-0 top-[26px] w-[301px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[12px] text-nowrap top-0">Oct 30, 2025</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="Container">
      <Label4 />
      <Paragraph4 />
    </div>
  );
}

function Label5() {
  return (
    <div className="absolute content-stretch flex h-[15px] items-start left-0 top-[6px] w-[64.156px]" data-name="Label">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">Cycle Type</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="absolute h-[18px] left-0 top-[26px] w-[301px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[12px] text-nowrap top-0">Rapid Inspection</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="Container">
      <Label5 />
      <Paragraph5 />
    </div>
  );
}

function Label6() {
  return (
    <div className="absolute content-stretch flex h-[15px] items-start left-0 top-[6px] w-[64.156px]" data-name="Label">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">Rack Assigned</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="absolute h-[18px] left-0 top-[26px] w-[301px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[12px] text-nowrap top-0">12</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="Container">
      <Label6 />
      <Paragraph6 />
    </div>
  );
}

function Label7() {
  return (
    <div className="absolute content-stretch flex h-[15px] items-start left-0 top-[6px] w-[64.156px]" data-name="Label">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[12px] text-[rgba(32,32,32,0.6)] text-nowrap">Rack Remaining</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="absolute h-[18px] left-0 top-[26px] w-[301px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0a0a0a] text-[12px] text-nowrap top-0">10</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="Container">
      <Label7 />
      <Paragraph7 />
    </div>
  );
}

function IrdsCreateEventScreen1() {
  return (
    <div className="relative shrink-0 w-[301px]" data-name="IRDSCreateEventScreen">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative w-full">
        <Container1 />
        <Container2 />
        <Container3 />
        <Container4 />
        <Container5 />
        <Container6 />
        <Container7 />
        <Container8 />
      </div>
    </div>
  );
}

export default function Card() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-start pl-[21px] pr-px py-[21px] relative rounded-[8px] size-full" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <IrdsCreateEventScreen />
      <IrdsCreateEventScreen1 />
    </div>
  );
}