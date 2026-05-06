function Frame() {
  return (
    <div className="content-stretch flex gap-[7.2px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#db2777] text-[9px] text-nowrap">
        <p className="leading-[18px] overflow-ellipsis overflow-hidden">{`Testing  `}</p>
      </div>
    </div>
  );
}

export default function Div() {
  return (
    <div className="bg-[#fdf2f8] relative rounded-[4px] size-full" data-name="DIV-97">
      <div className="content-stretch flex items-center overflow-clip px-[8px] py-[4px] relative rounded-[inherit] size-full">
        <Frame />
      </div>
      <div aria-hidden="true" className="absolute border border-[#db2777] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}