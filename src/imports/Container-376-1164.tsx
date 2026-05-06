import svgPaths from "./svg-ip9gdqrkca";

function Svg() {
  return (
    <div className="relative shrink-0 size-[19px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 19">
        <g id="SVG">
          <path d={svgPaths.p3deba500} id="Vector" stroke="var(--stroke-0, #3981F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.58333" />
          <path d={svgPaths.p753fac0} id="Vector_2" stroke="var(--stroke-0, #3981F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.58333" />
        </g>
      </svg>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(57,129,246,0.1)] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[38px]" data-name="Overlay">
      <Svg />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex items-start overflow-clip relative rounded-[4px] shrink-0 size-[38px]" data-name="Container">
      <Overlay />
    </div>
  );
}

function Svg1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d="M12 10L8 6L4 10" id="Vector" stroke="var(--stroke-0, #333333)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[4.01px] items-center relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#333] text-[16px]">
        <p className="css-ew64yg leading-[24px]">+38%</p>
      </div>
      <Svg1 />
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0 w-[167.33px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pl-[24px] pr-[24.01px] py-0 relative w-full">
        <Container />
        <Container1 />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#333] text-[18px] w-full">
        <p className="css-4hzbpn leading-[28px]">$13.4k</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#6c727e] text-[14px] w-full">
        <p className="css-4hzbpn leading-[20px]">Total Sales</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Container">
      <Container3 />
      <Container4 />
    </div>
  );
}

function OverlayBorder() {
  return (
    <div className="bg-[rgba(57,129,246,0.1)] relative rounded-[33554400px] shrink-0" data-name="Overlay+Border">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit]">
        <div className="css-g0mm18 flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#3981f6] text-[12px] text-center">
          <p className="css-ew64yg leading-[16px]">Last 6 months</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
    </div>
  );
}

function Container6() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[167.33px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-between px-[24px] py-0 relative size-full">
        <Container5 />
        <OverlayBorder />
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] h-[194px] items-start px-px py-[25px] relative rounded-[10px] shrink-0 w-[169.33px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#e4e8ef] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container2 />
      <Container6 />
    </div>
  );
}

function Svg2() {
  return (
    <div className="relative shrink-0 size-[19px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 19">
        <g id="SVG">
          <path d={svgPaths.p2994a300} id="Vector" stroke="var(--stroke-0, #2463EF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.58333" />
          <path d={svgPaths.p33f7d200} id="Vector_2" stroke="var(--stroke-0, #2463EF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.58333" />
          <path d={svgPaths.pb745480} id="Vector_3" stroke="var(--stroke-0, #2463EF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.58333" />
        </g>
      </svg>
    </div>
  );
}

function Overlay1() {
  return (
    <div className="bg-[rgba(36,99,239,0.1)] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[38px]" data-name="Overlay">
      <Svg2 />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex items-start overflow-clip relative rounded-[4px] shrink-0 size-[38px]" data-name="Container">
      <Overlay1 />
    </div>
  );
}

function Svg3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d="M12 10L8 6L4 10" id="Vector" stroke="var(--stroke-0, #333333)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#333] text-[16px]">
        <p className="css-ew64yg leading-[24px]">+22%</p>
      </div>
      <Svg3 />
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 w-[167.33px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[24px] py-0 relative w-full">
        <Container7 />
        <Container8 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#333] text-[18px] w-full">
        <p className="css-4hzbpn leading-[28px]">155K</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#6c727e] text-[14px] w-full">
        <p className="css-4hzbpn leading-[20px]">Total Orders</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Container">
      <Container10 />
      <Container11 />
    </div>
  );
}

function OverlayBorder1() {
  return (
    <div className="bg-[rgba(57,129,246,0.1)] relative rounded-[33554400px] shrink-0" data-name="Overlay+Border">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit]">
        <div className="css-g0mm18 flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#3981f6] text-[12px] text-center">
          <p className="css-ew64yg leading-[16px]">Last 4 months</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
    </div>
  );
}

function Container13() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[167.33px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-between px-[24px] py-0 relative size-full">
        <Container12 />
        <OverlayBorder1 />
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] h-[194px] items-start px-px py-[25px] relative rounded-[10px] shrink-0 w-[169.33px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#e4e8ef] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container9 />
      <Container13 />
    </div>
  );
}

function Svg4() {
  return (
    <div className="relative shrink-0 size-[19px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 19">
        <g id="SVG">
          <path d="M9.5 1.58333V17.4167" id="Vector" stroke="var(--stroke-0, #1D4EDA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.58333" />
          <path d={svgPaths.p3e73ec98} id="Vector_2" stroke="var(--stroke-0, #1D4EDA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.58333" />
        </g>
      </svg>
    </div>
  );
}

function Overlay2() {
  return (
    <div className="bg-[rgba(29,78,218,0.1)] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[38px]" data-name="Overlay">
      <Svg4 />
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex items-start overflow-clip relative rounded-[4px] shrink-0 size-[38px]" data-name="Container">
      <Overlay2 />
    </div>
  );
}

function Svg5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #333333)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex gap-[3.99px] items-center relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#333] text-[16px]">
        <p className="css-ew64yg leading-[24px]">-16%</p>
      </div>
      <Svg5 />
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0 w-[167.33px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[24px] py-0 relative w-full">
        <Container14 />
        <Container15 />
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#333] text-[18px] w-full">
        <p className="css-4hzbpn leading-[28px]">$89.34k</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#6c727e] text-[14px] w-full">
        <p className="css-4hzbpn leading-[20px]">Total Profit</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Container">
      <Container17 />
      <Container18 />
    </div>
  );
}

function OverlayBorder2() {
  return (
    <div className="bg-[rgba(57,129,246,0.1)] relative rounded-[33554400px] shrink-0" data-name="Overlay+Border">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit]">
        <div className="css-g0mm18 flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#3981f6] text-[12px] text-center">
          <p className="css-ew64yg leading-[16px]">Last One year</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
    </div>
  );
}

function Container20() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[167.33px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-between px-[24px] py-0 relative size-full">
        <Container19 />
        <OverlayBorder2 />
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] h-[194px] items-start px-px py-[25px] relative rounded-[10px] shrink-0 w-[169.33px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#e4e8ef] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container16 />
      <Container20 />
    </div>
  );
}

function Svg6() {
  return (
    <div className="relative shrink-0 size-[19px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 19">
        <g id="SVG">
          <path d={svgPaths.p39921500} id="Vector" stroke="var(--stroke-0, #1D3FAD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.58333" />
          <path d={svgPaths.p31444e80} id="Vector_2" stroke="var(--stroke-0, #1D3FAD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.58333" />
        </g>
      </svg>
    </div>
  );
}

function Overlay3() {
  return (
    <div className="bg-[rgba(29,63,173,0.1)] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[38px]" data-name="Overlay">
      <Svg6 />
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex items-start overflow-clip relative rounded-[4px] shrink-0 size-[38px]" data-name="Container">
      <Overlay3 />
    </div>
  );
}

function Svg7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d="M12 10L8 6L4 10" id="Vector" stroke="var(--stroke-0, #333333)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex gap-[4.01px] items-center relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#333] text-[16px]">
        <p className="css-ew64yg leading-[24px]">+38%</p>
      </div>
      <Svg7 />
    </div>
  );
}

function Container23() {
  return (
    <div className="relative shrink-0 w-[167.34px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[24px] py-0 relative w-full">
        <Container21 />
        <Container22 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#333] text-[18px] w-full">
        <p className="css-4hzbpn leading-[28px]">$1,200</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#6c727e] text-[14px] w-full">
        <p className="css-4hzbpn leading-[20px]">Bookmarks</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Container">
      <Container24 />
      <Container25 />
    </div>
  );
}

function OverlayBorder3() {
  return (
    <div className="bg-[rgba(57,129,246,0.1)] relative rounded-[33554400px] shrink-0" data-name="Overlay+Border">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit]">
        <div className="css-g0mm18 flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#3981f6] text-[12px] text-center">
          <p className="css-ew64yg leading-[16px]">Last 6 months</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
    </div>
  );
}

function Container27() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[167.34px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-between px-[24px] py-0 relative size-full">
        <Container26 />
        <OverlayBorder3 />
      </div>
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] h-[194px] items-start px-px py-[25px] relative rounded-[10px] shrink-0 w-[169.34px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#e4e8ef] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container23 />
      <Container27 />
    </div>
  );
}

export default function Container28() {
  return (
    <div className="content-stretch flex gap-[24px] items-start justify-center relative size-full" data-name="Container">
      <BackgroundBorder />
      <BackgroundBorder1 />
      {[...Array(2).keys()].map((_, i) => (
        <BackgroundBorder2 key={i} />
      ))}
      <BackgroundBorder3 />
    </div>
  );
}