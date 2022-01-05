import React from 'react'
import { ISectionInfo } from '../../contract/section'
import { prepareImageUrl } from '../../utils/image'
import CoreImage, { ImageSourceType } from '../core/CoreImage'

interface IErrorProps {}

const Error: React.FC<IErrorProps> = props => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-20">
        <CoreImage
          url={prepareImageUrl('/images/empty/empty-glass.svg', ImageSourceType.ASSET)}
          alt="Page not found"
          className="w-52 lg:w-60"
        />
        <div className="text-center text-lg lg:text-xl mt-5 w-[320px] md:w-auto font-medium font-primary-medium text-primaryTextBold">
          Site under maintenance.
        </div>
        <div className="text-center mt-1 w-[320px] md:w-auto">{`We're working on a few fixes and updates. Sorry for the Inconvenience.`}</div>
      </div>
    </div>
  )
}

export default Error
