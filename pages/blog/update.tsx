import React, { useContext, useEffect, useState } from 'react'
import { IGlobalLayoutProps } from '../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import FormLayout, { IFormLayoutInput } from '../../components/layout/FormLayout'
import { useRouter } from 'next/router'
import Delete from '../../components/layout/Delete'
import useLoginEffect from '../../hooks/useLoginEffect'
import { onDeleteSuccess, onUpdateSuccess } from '../../utils/layout'
import ApplicationContext from '../../components/ApplicationContext'
import { IBlogInfo, IBlogInfoUpdateParams } from '../../contract/blog'
import { deleteBlog, getBlogById, updateBlog } from '../../http/blog'
import { getBlogPageUrl, getBlogSearchPageUrl, getBlogUpdatePageUrl } from '../../utils/blog'
import { CoreTextInputType } from '../../components/core/CoreInput'
import CoreImage from '../../components/core/CoreImage'
import CoreLink from '../../components/core/CoreLink'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const UpdateBlog: NextPage<IProps> = props => {
  const [blog, setBlog] = useState<IBlogInfo | null>(null)

  const router = useRouter()
  const applicationContext = useContext(ApplicationContext)

  const updateQueryId = router.query.id as any
  const id = blog?.id

  useLoginEffect(() => {
    if (updateQueryId) {
      getBlogById(updateQueryId).then(resp => {
        setBlog(resp)
      })
    } else {
      setBlog(null)
    }
  }, [updateQueryId])

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getBlogPageUrl(),
    },
    {
      label: 'Search',
      url: getBlogSearchPageUrl(),
    },
    {
      label: 'Add',
      url: getBlogUpdatePageUrl(),
    },
  ]

  const formInputs: IFormLayoutInput[] = [
    {
      key: 'id',
      value: blog?.id.toString(),
      disabled: true,
      title: 'ID',
      placeholder: '#ID',
      type: 'INPUT',
    },
    {
      key: 'title',
      value: blog?.title,
      subTitle: 'Title of the blog',
      title: 'Title',
      placeholder: 'Title',
      type: 'INPUT',
    },
    {
      key: 'description',
      value: blog?.description,
      title: 'Description',
      subTitle: 'Description of the blog',
      placeholder: 'Description',
      type: 'TEXTAREA',
      textAreaProps: {
        className: 'h-[200px]',
      },
    },
    {
      key: 'url',
      value: blog?.url,
      title: 'URL',
      subTitle: 'URL associated with the blog',
      placeholder: 'URL',
      type: 'INPUT',
    },
    {
      key: 'imageId',
      value: blog?.image?.id,
      title: 'Image ID',
      subTitle: blog?.image ? (
        <CoreLink url={blog.image.url} isExternal className="underline">
          {blog.image.url}
        </CoreLink>
      ) : null,
      placeholder: 'Image ID',
      type: 'INPUT',
      inputProps: {
        type: CoreTextInputType.NUMBER,
      },
      optional: true,
    },
    {
      key: 'position',
      value: blog?.position,
      title: 'Position',
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
      placeholder: 'Active',
      type: 'CHECKBOX',
    },
  ]

  const onSubmit = inputMap => {
    const params: IBlogInfoUpdateParams = {
      title: inputMap['title'],
      description: inputMap['description'],
      url: inputMap['url'],
      imageId: inputMap['imageId'] || null,
      position: inputMap['position'],
      isActive: inputMap['isActive'],
    }

    updateBlog(id || null, params).then(resp => {
      if (resp.success) {
        onUpdateSuccess(
          {
            url: getBlogPageUrl(),
          },
          applicationContext,
          router
        )
      }
    })
  }

  const onDelete = () => {
    deleteBlog(id)
      .then(resp => {
        if (resp.success) {
          onDeleteSuccess(
            {
              url: getBlogPageUrl(),
            },
            applicationContext,
            router
          )
        }
      })
      .catch(console.error)
  }

  return (
    <div className="" key={id}>
      <PageLayout links={links}>
        {/* {id ? <Delete onDelete={onDelete} /> : null} */}
        <FormLayout inputs={formInputs} onSubmit={onSubmit} />
      </PageLayout>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  return {
    props: {
      pageData: null,
      layoutData: {
        seo: {
          title: 'Blog - Update - CMS',
        },
        headerTitle: 'Blog - Update',
      },
    },
  }
}

export default UpdateBlog
