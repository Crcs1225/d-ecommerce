// app/components/SafeImage.tsx
"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: string;
  fallbackSrc: string;
  alt: string;
}

export default function SafeImage({ src, fallbackSrc, alt, ...rest }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}