import svgPaths from "./svg-ffqhnrnefa";

function Container() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#333] text-[18px]">
        <p className="css-ew64yg leading-[28px]">Conversion rate</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#6c727e] text-[14px]">
        <p className="css-ew64yg leading-[20px]">Compared to last month</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Container">
      <Container />
      <Container1 />
    </div>
  );
}

function Svg() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d={svgPaths.p36e45a00} id="Vector" stroke="var(--stroke-0, #6C727E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p150f5b00} id="Vector_2" stroke="var(--stroke-0, #6C727E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2d6e5280} id="Vector_3" stroke="var(--stroke-0, #6C727E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function ButtonMenu() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[33554400px] shrink-0 size-[24px]" data-name="Button menu">
      <Svg />
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 w-[553.98px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between px-[24px] py-0 relative w-full">
        <Container2 />
        <ButtonMenu />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#333] text-[30px]">
        <p className="css-ew64yg leading-[36px]">92.8%</p>
      </div>
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

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#333] text-[14px]">
        <p className="css-ew64yg leading-[20px]">6.3%</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <Svg1 />
      <Container5 />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Container">
      <Container4 />
      <Container6 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[4.81%_2.39%_1.18%_1.18%]" data-name="Group">
      <div className="absolute inset-[-1.3%_-0.2%_0_-0.01%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 317.423 75.846">
          <g id="Group">
            <path d={svgPaths.p38954780} fill="url(#paint0_linear_375_1025)" fillOpacity="0.6" id="Vector" />
            <path d={svgPaths.pd97be80} id="Vector_2" stroke="var(--stroke-0, #2463EF)" strokeWidth="1.95266" />
          </g>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_375_1025" x1="0.0412701" x2="0.0412701" y1="0.976721" y2="75.846">
              <stop offset="0.1" stopColor="#2463EF" stopOpacity="0.3" />
              <stop offset="0.9" stopColor="#2463EF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[4.81%_2.39%_1.18%_1.18%]" data-name="Group">
      <Group />
    </div>
  );
}

function Svg2() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="SVG">
      <Group1 />
    </div>
  );
}

function Container8() {
  return (
    <div className="aspect-[337.5/80] flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center pl-0 pr-[7.5px] py-0 relative size-full">
          <Svg2 />
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Container">
      <Container7 />
      <Container8 />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#333] text-[16px] w-full">
        <p className="css-4hzbpn leading-[24px]">Impressions</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#6c727e] text-[14px] w-full">
        <p className="css-4hzbpn leading-[20px]">12.2K Visits</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative self-stretch shrink-0 w-[403.19px]" data-name="Container">
      <Container10 />
      <Container11 />
    </div>
  );
}

function Svg3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d={svgPaths.p82fb540} id="Vector" stroke="var(--stroke-0, #333333)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 12.6667V3.33333" id="Vector_2" stroke="var(--stroke-0, #333333)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#333] text-[14px]">
        <p className="css-ew64yg leading-[20px]">20.3%</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex items-center justify-between pl-0 pr-[0.01px] py-0 relative self-stretch shrink-0 w-[94.8px]" data-name="Container">
      <Svg3 />
      <Container13 />
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex gap-[8px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container12 />
      <Container14 />
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#333] text-[16px] w-full">
        <p className="css-4hzbpn leading-[24px]">Added to cart</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#6c727e] text-[14px] w-full">
        <p className="css-4hzbpn leading-[20px]">32 product in cart</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative self-stretch shrink-0 w-[403.19px]" data-name="Container">
      <Container16 />
      <Container17 />
    </div>
  );
}

function Svg4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d={svgPaths.p82fb540} id="Vector" stroke="var(--stroke-0, #333333)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 12.6667V3.33333" id="Vector_2" stroke="var(--stroke-0, #333333)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#333] text-[14px]">
        <p className="css-ew64yg leading-[20px]">6.3%</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex items-center justify-between relative self-stretch shrink-0 w-[94.8px]" data-name="Container">
      <Svg4 />
      <Container19 />
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex gap-[8px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container18 />
      <Container20 />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#333] text-[16px] w-full">
        <p className="css-4hzbpn leading-[24px]">Checkout</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#6c727e] text-[14px] w-full">
        <p className="css-4hzbpn leading-[20px]">15 Product checkout</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative self-stretch shrink-0 w-[403.19px]" data-name="Container">
      <Container22 />
      <Container23 />
    </div>
  );
}

function Svg5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d="M8 3.33333V12.6667" id="Vector" stroke="var(--stroke-0, #333333)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pc0e6f00} id="Vector_2" stroke="var(--stroke-0, #333333)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#333] text-[14px]">
        <p className="css-ew64yg leading-[20px]">9.56%</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex items-center justify-between relative self-stretch shrink-0 w-[94.8px]" data-name="Container">
      <Svg5 />
      <Container25 />
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex gap-[8px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container24 />
      <Container26 />
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#333] text-[16px] w-full">
        <p className="css-4hzbpn leading-[24px]">Purchased</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#6c727e] text-[14px] w-full">
        <p className="css-4hzbpn leading-[20px]">12 orders</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative self-stretch shrink-0 w-[403.19px]" data-name="Container">
      <Container28 />
      <Container29 />
    </div>
  );
}

function Svg6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d={svgPaths.p82fb540} id="Vector" stroke="var(--stroke-0, #333333)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 12.6667V3.33333" id="Vector_2" stroke="var(--stroke-0, #333333)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#333] text-[14px]">
        <p className="css-ew64yg leading-[20px]">2.62%</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex items-center justify-between pl-0 pr-[0.01px] py-0 relative self-stretch shrink-0 w-[94.8px]" data-name="Container">
      <Svg6 />
      <Container31 />
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex gap-[8px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container30 />
      <Container32 />
    </div>
  );
}

function Container34() {
  return (
    <div className="relative shrink-0 w-[553.98px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start px-[24px] py-0 relative w-full">
        <Container9 />
        <Container15 />
        <Container21 />
        <Container27 />
        <Container33 />
      </div>
    </div>
  );
}

export default function BackgroundBorderShadow() {
  return (
    <div className="bg-white relative rounded-[10px] size-full" data-name="Background+Border+Shadow">
      <div className="content-stretch flex flex-col gap-[16px] items-start overflow-clip px-px py-[25px] relative rounded-[inherit] size-full">
        <Container3 />
        <Container34 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e4e8ef] border-solid inset-0 pointer-events-none rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}