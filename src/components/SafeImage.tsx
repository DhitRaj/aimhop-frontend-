"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface SafeImageProps extends ImageProps {
  fallbackSrc?: string;
}

/**
 * Enhanced Image component with error handling and fallback support.
 * Prevents "Broken Image" icons on high-end B2B sites.
 */
export default function SafeImage({ src, alt, fallbackSrc, ...props }: SafeImageProps) {
  // Use a reliable placeholder image asset or logo
  const defaultFallback = "/placeholder.png"; 
  const [imgSrc, setImgSrc] = useState(src || defaultFallback);
  const [hasError, setHasError] = useState(!src);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc || defaultFallback);
      setHasError(true);
    }
  };

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={`${props.className || ''} ${hasError ? 'grayscale opacity-70 animate-pulse' : ''}`}
    />
  );
}
