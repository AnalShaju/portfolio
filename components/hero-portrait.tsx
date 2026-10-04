import Image from "next/image";

import { site } from "@/lib/content";

export function HeroPortrait() {
  return (
    <div className="hero-portrait size-[56px] shrink-0 overflow-hidden rounded-[14px] sm:size-16 sm:rounded-[16px]">
      <Image
        src="/img.jpeg"
        alt=""
        width={136}
        height={136}
        className="size-full object-cover object-center"
        priority
      />
      <span className="sr-only">{site.name}</span>
    </div>
  );
}
