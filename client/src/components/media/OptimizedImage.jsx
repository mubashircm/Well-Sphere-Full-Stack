import { useState } from "react";

/**
 * High-performance responsive image component supporting lazy loading,
 * async decoding, aspect ratio reservation, and fallback placeholder.
 */
export function OptimizedImage({
  src,
  alt = "",
  webpSrc,
  avifSrc,
  className = "",
  width,
  height,
  priority = false,
  aspectRatio,
  style = {},
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const containerStyle = {
    position: "relative",
    overflow: "hidden",
    ...(aspectRatio ? { aspectRatio } : {}),
    ...style,
  };

  return (
    <div className={`opt-image-container ${className}`} style={containerStyle}>
      {!loaded && !error && (
        <div className="skeleton-block" aria-hidden="true" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />
      )}

      {error ? (
        <div className="opt-image-fallback" aria-hidden="true">
          <span>{alt || "Image unavailable"}</span>
        </div>
      ) : (
        <picture>
          {avifSrc && <source srcSet={avifSrc} type="image/avif" />}
          {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.25s ease-in-out",
            }}
            {...props}
          />
        </picture>
      )}
    </div>
  );
}

export default OptimizedImage;
