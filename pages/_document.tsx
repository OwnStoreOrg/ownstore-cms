import React from 'react'
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import MetaTags from '../scriptTemplates/meta'
import { AppContextScript } from '../scriptTemplates/AppContext'
import MediaScripts from '../scriptTemplates/media'
import { AnalyticsScripts } from '../scriptTemplates/analytics'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <AppContextScript />
          <AnalyticsScripts />
          <MetaTags />
          <MediaScripts />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
