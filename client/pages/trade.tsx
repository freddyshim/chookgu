import { ReactElement, useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import MainLayout from '@components/MainLayout'
import GridContainer from '@components/GridContainer'
import Layout from '@components/Layout'
import Scroll from '@components/Scroll'
import PlayerCard from '@components/PlayerCard'
import PlayerDetails from '@components/PlayerDetails'
import { GlobalProps, getGlobalProps } from '@context/GlobalContext'
import { Player } from '@util/Player'
import api from '@util/api'
import styles from '@styles/pages/Trade.module.scss'
import Search from '@components/Search'
import SortDropdown, { SortBy, SortOrder } from '@components/SortDropdown'
import PlayerCheckout from '@components/PlayerCheckout'
import { usePortfolio } from '@context/PortfolioContext'
import PlayerChart from '@components/PlayerChart'

interface SearchOptions {
  index: number
  term: string
  sortBy: SortBy
  sortOrder: SortOrder
}

const Trade = (props: GlobalProps) => {
  // redirect if user is not authenticated
  const router = useRouter()
  if (!props.loggedIn) {
    router.push('/')
  }

  const [portfolio, setPortfolio] = usePortfolio()
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    index: 0,
    term: '',
    sortBy: SortBy.Name,
    sortOrder: SortOrder.Asc,
  })
  const [players, setPlayers] = useState<Player[]>([])
  const [selected, setSelected] = useState<Player | undefined>(undefined)

  /**
   * Get a list of players from the server. Loads 10 at a time, starting from
   * given index. Generates a new list if a new search term is detected.
   * Otherwise, add the newly obtained list to the current list.
   */
  useEffect(() => {
    const fetchPlayers = async () => {
      const { index, term, sortBy, sortOrder } = searchOptions

      const result = await api.get<Player[]>(
        `/players?index=${
          20 * index
        }&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${term || ''}`
      )

      if (searchOptions.index === 0) {
        setPlayers(result.data)
      } else {
        setPlayers((p) => [...p, ...result.data])
      }
    }
    fetchPlayers()
  }, [searchOptions])

  /**
   * Player select event handler
   */
  const onPlayerSelected = (player?: Player) => {
    setSelected(player)
  }

  /**
   * Player deselect event handler
   */
  const onPlayerDeselected = () => {
    setSelected(undefined)
  }

  /**
   * Search term change event handler
   */
  const onSearchTermChange = useCallback((term: string) => {
    setSearchOptions((options) => {
      return { ...options, index: 0, term }
    })
  }, [])

  /**
   * Sort options change event handler
   */
  const onSortOptionsChange = (sortBy: SortBy, sortOrder: SortOrder) => {
    setSearchOptions({ ...searchOptions, index: 0, sortBy, sortOrder })
  }

  /**
   * Render the list of player cards.
   */
  const renderPlayers = () => {
    return players.map((player) => (
      <PlayerCard
        selected={(selected && selected._id === player._id) || undefined}
        onSelected={onPlayerSelected}
        key={player._id}
        player={player}
        size="small"
        format="default"
      />
    ))
  }

  /**
   * Page content
   */
  return (
    <Layout>
      <GridContainer className={styles.grid}>
        <div className={`${styles.widget} ${styles.grid__search}`}>
          <div className={styles.widget__header}>Player Market</div>
          <div className={styles.widget__search}>
            <Search
              hint="Search for players, teams, positions and more"
              onChange={onSearchTermChange}
            />
            <SortDropdown
              sortBy={searchOptions.sortBy}
              sortOrder={searchOptions.sortOrder}
              onSelected={onSortOptionsChange}
            />
          </div>
          <div className={styles.widget__list}>
            <Scroll
              id="buyPlayers"
              index={searchOptions.index}
              next={() => {
                setSearchOptions({
                  ...searchOptions,
                  index: searchOptions.index + 1,
                })
              }}
            >
              {renderPlayers()}
            </Scroll>
          </div>
        </div>
        <PlayerDetails className={styles.details} player={selected} />
        <PlayerCheckout
          player={selected}
          portfolio={portfolio}
          className={styles.details}
          onComplete={(p) => setPortfolio(p)}
        />
        <PlayerChart className={styles.grid__chart} player={selected} />
      </GridContainer>
    </Layout>
  )
}

/**
 * Page template
 */
Trade.getLayout = (page: ReactElement) => {
  const props: GlobalProps = page.props

  return (
    <div>
      <Head>
        <title>Chookgu</title>
        <meta name="description" content="Description of chookgu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout selected="Trade" {...props}>
        {page}
      </MainLayout>
    </div>
  )
}

export const getServerSideProps = getGlobalProps

export default Trade
