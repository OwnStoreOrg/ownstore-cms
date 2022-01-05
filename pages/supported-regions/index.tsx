import React, { useEffect, useState } from 'react'
import { IGlobalLayoutProps } from './../_app'
import { NextPage, GetStaticProps } from 'next'
import PageLayout from '../../components/layout/PageLayout'
import { IPageLink } from '../../components/layout/PageLinks'
import IndexViewLayout, { IIndexViewItem, IndexViewLayoutHeader } from '../../components/layout/IndexViewLayout'
import useLoginEffect from '../../hooks/useLoginEffect'
import { getSupportedRegions } from '../../http/supportedRegions'
import { getSupportedRegionsPageUrl, getSupportedRegionsUpdatePageUrl } from '../../utils/supportedRegions'
import { SupportedRegionType } from '../../contract/constants'
import PageLoader from '../../components/loader/PageLoader'
import { PAGE_SUMMARY } from '../../constants/constants'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const SupportedRegions: NextPage<IProps> = props => {
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [fetching, setFetching] = useState(false)

  useLoginEffect(() => {
    setFetching(true)

    getSupportedRegions()
      .then(resp => {
        const newCountriesList: IIndexViewItem[] = resp.countries.map(data => {
          return {
            id: data.id,
            label: data.name,
            description: data.shortName,
            editUrl: getSupportedRegionsUpdatePageUrl(SupportedRegionType.COUNTRY, data.id),
          }
        })

        setCountries(newCountriesList)

        const newCitiesList: IIndexViewItem[] = resp.cities.map(data => {
          return {
            id: data.id,
            label: data.name,
            description: data.shortName,
            editUrl: getSupportedRegionsUpdatePageUrl(SupportedRegionType.CITY, data.id),
          }
        })

        setCities(newCitiesList)
      })
      .finally(() => {
        setFetching(false)
      })
  }, [])

  const links: IPageLink[] = [
    {
      label: 'View',
      url: getSupportedRegionsPageUrl(),
    },
    {
      label: 'Add Country',
      url: getSupportedRegionsUpdatePageUrl(SupportedRegionType.COUNTRY),
    },
    {
      label: 'Add City',
      url: getSupportedRegionsUpdatePageUrl(SupportedRegionType.CITY),
    },
  ]

  return (
    <div className="">
      <PageLayout links={links} summary={PAGE_SUMMARY.SUPPORTED_REGIONS}>
        {fetching ? (
          <PageLoader message="Loading detail..." />
        ) : (
          <div>
            <IndexViewLayoutHeader title="Countries" />
            <IndexViewLayout items={countries} />

            <IndexViewLayoutHeader title="Cities" />
            <IndexViewLayout items={cities} />
          </div>
        )}
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
          title: 'Supported Regions - CMS',
        },
        headerTitle: 'Supported Regions',
      },
    },
  }
}

export default SupportedRegions
