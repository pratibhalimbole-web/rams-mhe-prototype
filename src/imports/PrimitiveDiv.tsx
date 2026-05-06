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

export default function PrimitiveDiv() {
  return (
    <div className="bg-[#f1f5f9] content-stretch flex items-center justify-center relative rounded-[6px] size-full" data-name="Primitive.div">
      <PrimitiveButton />
      <PrimitiveButton1 />
    </div>
  );
}