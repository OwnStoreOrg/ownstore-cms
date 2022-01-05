import React from 'react'

export const AppContextScript = () => (
  <>
    <script
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `
          window.APP = window.APP || {};
        `,
      }}
    />
  </>
)
