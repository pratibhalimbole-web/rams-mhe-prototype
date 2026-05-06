function Container3() {
  return (
    <div className="h-[17.984px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[#202020] text-[12px] top-[0.11px]">Possible Reason</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[39px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.2px] left-0 not-italic text-[12px] text-[rgba(32,32,32,0.6)] top-[0.04px] w-[502px] whitespace-pre-wrap">Impact damage from forklift collision. The baseplate shows signs of significant deformation consistent with a high-force impact.</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[65px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[7.997px] items-start relative size-full">
        <Container3 />
        <Container4 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[17.984px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[#202020] text-[12px] top-[0.11px]">Risk</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[38.356px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.2px] left-0 not-italic text-[12px] text-[rgba(32,32,32,0.6)] top-[0.04px] w-[490px] whitespace-pre-wrap">The structural integrity of the rack is severely compromised. There is a significant risk of rack collapse under load.</p>
    </div>
  );
}

function PrimitiveDiv() {
  return <div className="h-[0.987px] shrink-0 w-full" data-name="Primitive.div" />;
}

function Container5() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[7.997px] items-start relative size-full">
        <Container6 />
        <Container7 />
        <PrimitiveDiv />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[17.984px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[#202020] text-[12px] top-[0.11px]">Corrective Action</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[19.178px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.2px] left-0 not-italic text-[12px] text-[rgba(32,32,32,0.6)] top-[0.22px]">Immediate unloading followed by replacement is necessary</p>
    </div>
  );
}

function PrimitiveDiv1() {
  return <div className="h-[0.987px] shrink-0 w-full" data-name="Primitive.div" />;
}

function Container8() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[7.997px] items-start relative size-full">
        <Container9 />
        <Container10 />
        <PrimitiveDiv1 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[17.984px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[#202020] text-[12px] top-[0.11px]">Remarks</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[19.178px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.2px] left-0 not-italic text-[12px] text-[rgba(32,32,32,0.6)] top-[0.22px]">Check all other possible reasons and then make a decision</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[45.159px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[7.997px] items-start relative size-full">
        <Container12 />
        <Container13 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <Container2 />
      <Container5 />
      <Container8 />
      <Container11 />
    </div>
  );
}

export default function Container() {
  return (
    <div className="content-stretch flex flex-col items-start relative rounded-[8px] size-full" data-name="Container">
      <Container1 />
    </div>
  );
}