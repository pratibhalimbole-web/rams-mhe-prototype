import svgPaths from "./svg-9kzsunvgkq";

function Check() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="check">
          <path d={svgPaths.p159fba80} id="Vector" stroke="var(--stroke-0, #F8FAFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

export default function Checkbox() {
  return (
    <div className="bg-[#155dfc] content-stretch flex flex-col items-center justify-center relative rounded-[4px] size-full" data-name="Checkbox">
      <Check />
    </div>
  );
}