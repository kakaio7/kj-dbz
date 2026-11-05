import { useState } from 'react'

export default function SafeImage({
  src,
  alt,
  className = '',
  fallbackClassName = '',
  fallbackText = 'IMAGEM INDISPONÍVEL',
  ...props
}) {
  const [imageError, setImageError] = useState(null)
  const hasError = imageError === src

  if (!src || hasError) {
    return (
      <div className={`safe-image-fallback ${fallbackClassName}`} role="img" aria-label={alt || fallbackText}>
        <span>{fallbackText}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setImageError(src)}
      {...props}
    />
  )
}
