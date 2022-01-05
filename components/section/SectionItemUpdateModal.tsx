import React from 'react'
import { ISectionInfo, SectionInfoItem } from '../../contract/section'
import Modal from '../modal/Modal'
import SectionItemUpdateForm, { SectionItemUpdateFormLayoutType } from './SectionItemUpdateForm'

interface ISectionItemUpdateModalProps {
  dismissModal: () => void
  sectionItem: SectionInfoItem
  section: ISectionInfo
}

const SectionItemUpdateModal: React.FC<ISectionItemUpdateModalProps> = props => {
  const { dismissModal, sectionItem, section } = props

  return (
    <Modal
      dismissModal={dismissModal}
      title={'Update Section item'}
      disableOutsideClick
      className="sectionItemUpdateModalOverrides">
      <div className="content pt-4">
        <SectionItemUpdateForm
          layout={SectionItemUpdateFormLayoutType.MODAL}
          sectionItem={sectionItem}
          section={section}
        />
      </div>
    </Modal>
  )
}

export default SectionItemUpdateModal
