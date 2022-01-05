import React from 'react'

interface IProps {}

const MetaTags: React.FC<IProps> = props => (
  <>
    <meta
      key="viewport"
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
    />
    <link rel="icon" href="/images/favicon.ico" />
  </>
)

export default MetaTags
