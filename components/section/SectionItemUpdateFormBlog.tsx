import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { IBlogSectionInfo, IBlogSectionInfoUpdateParams, ISectionInfo } from '../../contract/section'
import { deleteBlogSection, updateBlogSection } from '../../http/section'
import { onDeleteSuccess, onUpdateSuccess } from '../../utils/layout'
import ApplicationContext from '../ApplicationContext'
import { CoreTextInputType } from '../core/CoreInput'
import Delete from '../layout/Delete'
import FormLayout, { IFormLayoutInput } from '../layout/FormLayout'
import { SectionItemUpdateFormLayoutType } from './SectionItemUpdateForm'

export interface ISectionItemUpdateFormBlogProps {
  section: ISectionInfo
  blog: IBlogSectionInfo | null
  onSuccess: () => void
  layout: SectionItemUpdateFormLayoutType
}

const SectionItemUpdateFormBlog: React.FC<ISectionItemUpdateFormBlogProps> = props => {
  const { section, blog, onSuccess, layout } = props

  const applicationContext = useContext(ApplicationContext)
  const router = useRouter()

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: blog?.id,
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'blogId',
      value: blog?.blogInfo.id,
      title: 'Blog ID',
      placeholder: 'Blog ID',
      type: 'INPUT',
    },
    {
      key: 'position',
      value: blog?.position,
      title: 'Position',
      subTitle: 'Position in the section row',
      placeholder: 'Position',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
    },
    {
      key: 'isActive',
      value: blog?.isActive || false,
      title: 'Active',
      subTitle: 'Show in section row',
      placeholder: 'Active',
      type: 'CHECKBOX',
    },
  ]

  const onSubmit = inputMap => {
    const params: IBlogSectionInfoUpdateParams = {
      blogId: inputMap['blogId'],
      isActive: inputMap['isActive'],
      position: inputMap['position'],
    }

    updateBlogSection(section.id, blog?.id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess({}, applicationContext, router)
        onSuccess()
      }
    })
  }

  const onDelete = () => {
    deleteBlogSection(section.id, blog.id)
      .then(resp => {
        if (resp.success) {
          onDeleteSuccess({}, applicationContext, router)
          onSuccess()
        }
      })
      .catch(console.error)
  }

  return (
    <div>
      {blog?.id ? <Delete onDelete={onDelete} /> : null}
      <FormLayout
        inputs={formInputs}
        onSubmit={onSubmit}
        buttonClassName={layout === SectionItemUpdateFormLayoutType.MODAL ? 'lg:w-full mt-2' : ''}
      />
    </div>
  )
}

export default SectionItemUpdateFormBlog
