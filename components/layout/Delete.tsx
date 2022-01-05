import { TrashIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import Alert from '../modal/Alert'

interface IDeleteProps {
  onDelete: () => void
  label?: string
  icon?: React.FC
}

const Delete: React.FC<IDeleteProps> = props => {
  const [showAlert, toggleAlert] = useState(false)

  const Icon = props.icon || TrashIcon

  return (
    <div>
      <div className="flex justify-end mb-4">
        <CoreButton
          label={
            <React.Fragment>
              <Icon className="w-5 mr-1" />
              <span>{props.label || 'Delete'}</span>
            </React.Fragment>
          }
          size={CoreButtonSize.MEDIUM}
          type={CoreButtonType.SOLID_SECONDARY}
          onClick={() => toggleAlert(true)}
        />
      </div>

      {showAlert ? (
        <Alert
          title={props.label || 'Delete'}
          subTitle="Are you sure about this?"
          cta={{
            primary: {
              show: true,
              label: props.label || 'Delete',
              onClick: () => {
                props.onDelete()
              },
            },
            secondary: {
              show: true,
              label: 'Cancel',
              onClick: () => toggleAlert(false),
            },
          }}
          dismissModal={() => toggleAlert(false)}
        />
      ) : null}
    </div>
  )
}

export default Delete
