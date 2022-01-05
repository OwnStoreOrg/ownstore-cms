import classNames from 'classnames'
import React from 'react'
import { IImageInfo } from '../../contract/image'
import { getImageUpdatePageUrl, prepareImageUrl } from '../../utils/image'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import CoreLink from '../core/CoreLink'

interface IImageInfoProps {
  image: IImageInfo
}

const ImageInfo: React.FC<IImageInfoProps> = props => {
  const { image } = props

  return (
    <CoreLink
      url={getImageUpdatePageUrl(image.id)}
      className={classNames('flex flex-col shadow rounded cursor-pointer hover:shadow-md', {})}>
      <CoreImage
        url={prepareImageUrl(image.url, ImageSourceType.CLOUD)}
        alt={image.name}
        className="w-full h-[220px] object-cover rounded-t"
      />
      <div className="px-2 py-2 text-sm relative">
        <div className="font-medium font-primary-medium">#{image.id}</div>
      </div>
    </CoreLink>
  )
}

export default ImageInfo
