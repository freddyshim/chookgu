import { ReactElement, useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import LineChart, { ChartValue } from '@components/LineChart'
import Layout from '@components/Layout'
import MainLayout from '@components/MainLayout'
import PlayerCard from '@components/PlayerCard'
import GridContainer from '@components/GridContainer'
import { GlobalProps, getGlobalProps } from '@context/GlobalContext'
import styles from '@styles/pages/Home.module.scss'
import api from '@util/api'
import { Player } from '@util/Player'

const Home = (props: GlobalProps) => {
  // redirect if user is not authenticated
  const router = useRouter()
  if (!props.loggedIn) {
    router.push('/')
  }

  const [portfolioValue, setPortfolioValue] = useState<ChartValue[]>([])
  const [gainLossValue, setGainLossValue] = useState<ChartValue[]>([])
  const [topMargins, setTopMargins] = useState<Player[]>([])
  const [bottomMargins, setBottomMargins] = useState<Player[]>([])

  const getDashboardStatistics = async () => {
    const getTopMargins = await api.get<Player[]>('/players/top-margins')
    setTopMargins(getTopMargins.data)
    const getBottomMargins = await api.get<Player[]>('/players/bottom-margins')
    setBottomMargins(getBottomMargins.data)
  }

  useEffect(() => {
    getPortfolioValue()
    getGainLossValue()
    getDashboardStatistics()
  }, [])

  const getPortfolioValue = async () => {
    const res = await api.get<ChartValue[]>('/portfolio/value?season=standard')
    setPortfolioValue(res.data)
  }

  const getGainLossValue = async () => {
    const res = await api.get<ChartValue[]>(
      '/portfolio/gain-loss?season=standard'
    )
    setGainLossValue(res.data)
  }

  const renderPlayers = (players: Player[]) => {
    return players.map((player, index) => (
      <div key={index} className={styles.numberedItem}>
        <div className={styles.numberedItem__number}>{`#${index + 1}`}</div>
        <PlayerCard player={player} format="margin" size="small" />
      </div>
    ))
  }

  return (
    <Layout>
      <GridContainer className={styles.grid}>
        <div className={`${styles.widget} ${styles.grid__value}`}>
          <div className={styles.widget__header}>Portfolio Value</div>
          <div className={styles.widget__chart}>
            <LineChart data={portfolioValue} />
          </div>
        </div>
        <div className={styles.widget}>
          <div className={styles.widget__header}>Top Gains</div>
          <div className={styles.widget__list}>{renderPlayers(topMargins)}</div>
        </div>
        <div className={`${styles.widget} ${styles.grid__gain}`}>
          <div className={styles.widget__header}>My Gain/Loss</div>
          <div className={styles.widget__chart}>
            <LineChart data={gainLossValue} type="pos-neg" />
          </div>
        </div>
        <div className={styles.widget}>
          <div className={styles.widget__header}>Top Losses</div>
          <div className={styles.widget__list}>
            {renderPlayers(bottomMargins)}
          </div>
        </div>
      </GridContainer>
    </Layout>
  )
}

Home.getLayout = (page: ReactElement) => {
  const props: GlobalProps = page.props

  return (
    <div>
      <Head>
        <title>Chookgu</title>
        <meta name="description" content="Description of chookgu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout selected="Home" {...props}>
        {page}
      </MainLayout>
    </div>
  )
}

export const getServerSideProps = getGlobalProps

export default Home
