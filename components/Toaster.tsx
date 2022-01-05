import React, { useContext, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import ApplicationContext from './ApplicationContext'

export const toastSuccess = (message: string) => {
  toast.success(message)
}

export const toastError = (message: string) => {
  toast.error(message)
}

export const toastDismiss = () => {
  toast.dismiss()
}

interface IToasterProps {}

const AppToaster: React.FC<IToasterProps> = props => {
  const applicationContext = useContext(ApplicationContext)
  const {
    device: { isSm },
  } = applicationContext

  return (
    <Toaster
      position={isSm ? 'bottom-center' : 'bottom-left'}
      toastOptions={{
        style: {
          borderRadius: '8px',
          background: '#333',
          color: '#fff',
          padding: '16px 16px',
          maxWidth: 'none',
        },
        success: {
          duration: 4000,
        },
        error: {
          duration: 3000,
        },
      }}
    />
  )

  return null
}

export default AppToaster
