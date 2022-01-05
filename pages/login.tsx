import React, { useContext, useRef, useState } from 'react'
import { IGlobalLayoutProps } from './_app'
import { NextPage, GetStaticProps } from 'next'
import CoreTextInput, { CoreTextInputType } from '../components/core/CoreInput'
import classNames from 'classnames'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../components/core/CoreButton'
import { REGEX_MAP } from '../constants/constants'
import { toastError } from '../components/Toaster'
import useOnEnter from '../hooks/useOnEnter'
import { verifyAdmin } from '../http/auth'
import ApiError from '../error/ApiError'
import ApplicationContext, { LoginStateType } from '../components/ApplicationContext'
import { setAdminAuthToken } from '../utils/admin'
import { getHomePageUrl } from '../utils/home'
import { useRouter } from 'next/router'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const Login: NextPage<IProps> = props => {
  const [adminKey, setAdminKey] = useState('')
  const [loading, toggleLoading] = useState(false)
  const [fieldsWithError, setFieldsWithError] = useState({
    ADMIN_KEY: false,
  })

  const applicationContext = useContext(ApplicationContext)
  const {
    updaters: { updateLoginState },
    isLoggedIn,
  } = applicationContext

  const router = useRouter()

  const formRef = useRef(null)

  const FIELD_VALIDATION_MAPPING = {
    EMAIL: {
      regex: REGEX_MAP.NOT_EMPTY,
      error: 'Invalid admin key',
      value: adminKey,
      key: 'ADMIN_KEY',
    },
  }

  const handleSubmit = () => {
    if (loading || isLoggedIn) {
      return null
    }

    const validatedFields = Object.values(FIELD_VALIDATION_MAPPING).map(field => {
      return {
        ...field,
        valid: field.regex.test(field.value),
      }
    })

    const updatedFieldsWithError = validatedFields.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.key]: !cur.valid,
      }
    }, fieldsWithError)

    setFieldsWithError(updatedFieldsWithError)

    const invalidFields = validatedFields.filter(field => !field.valid)

    if (invalidFields.length) {
      toastError(invalidFields[0].error)
    } else {
      toggleLoading(true)

      verifyAdmin({
        key: adminKey,
      })
        .then(resp => {
          if (resp.success) {
            setAdminAuthToken(resp.token)
            updateLoginState(LoginStateType.LOGGED_IN)

            // next route messes up when there are query params for backUrl
            const backUrl = window.location.search.split('?backUrl=')[1]

            if (backUrl) {
              window.location.href = backUrl
            } else {
              window.location.href = getHomePageUrl()
            }
          }
        })
        .catch(err => {
          if (err instanceof ApiError && err.response.code !== 'UNKNOWN') {
            toastError(err.response.message || 'Failed to login')
          } else {
            toastError('Failed to login')
          }
        })
        .finally(() => {
          toggleLoading(false)
        })
    }
  }

  useOnEnter(formRef, handleSubmit)

  return (
    <div>
      <div className="w-full px-4 md:w-[400px] mx-auto mt-10 md:mt-20">
        <div className="text-primaryTextBold font-medium font-primary-medium text-xl text-center mb-8 md:mb-10">
          Login to continue
        </div>

        <div ref={formRef}>
          <div className="user-input-group">
            <div className="user-input-label">Admin Key</div>
            <CoreTextInput
              type={CoreTextInputType.PASSWORD}
              placeholder="Key"
              value={adminKey}
              setValue={setAdminKey}
              autoComplete="off"
              showClearIcon
              onClearClick={() => setAdminKey('')}
              autoFocus
              inputClassName={classNames('user-input', {
                'user-input-error': fieldsWithError.ADMIN_KEY,
              })}
            />
          </div>

          <div className="user-input-group">
            <CoreButton
              label={isLoggedIn ? 'Logged In' : 'Verify'}
              size={CoreButtonSize.LARGE}
              type={CoreButtonType.SOLID_PRIMARY}
              className="w-full"
              onClick={() => handleSubmit()}
              disabled={isLoggedIn}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  return {
    props: {
      pageData: null,
      layoutData: {
        seo: {
          title: 'Login - CMS',
        },
        headerTitle: 'Login',
      },
    },
  }
}

export default Login
