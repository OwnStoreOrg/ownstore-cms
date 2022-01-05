import React, { CSSProperties, useRef, useState, useEffect } from 'react'
import classnames from 'classnames'

export enum ImageSourceType {
  ASSET = 'asset', // assets stored locally such as logo, icons, etc..
  CLOUD = 'cloud', // stored in cloud
  NONE = 'none', // for absolute urls
}

export interface ICoreImageProps {
  url: string
  alt: string
  className?: string
  style?: CSSProperties
  onError?: (param: any) => void
  onLoad?: () => void
}

const CoreImage: React.FC<ICoreImageProps> = props => {
  const { url, alt, className, style, onError, onLoad } = props

  const ref = useRef(null)

  const onImgLoad = () => {
    if (onLoad) {
      onLoad()
    }
  }

  const imgError = (image: any) => {
    image.onerror = null
    image.target.removeAttribute('src')
    image.target.removeAttribute('alt', '')
    onError && onError(image)
  }

  return (
    <img
      ref={ref}
      src={url}
      onLoad={onImgLoad}
      alt={alt || ''}
      style={style}
      className={classnames('img', className)}
      onError={imgError}
    />
  )
}

export default CoreImage
