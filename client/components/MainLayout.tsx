import Link from 'next/link'
import Header, { HeaderNavigationProps } from '@components/Header'
import Button from '@components/Button'
import UserMenu from '@components/UserMenu'
import Landing from '@components/Landing'
import { GlobalContext, GlobalProps } from '@utils/GlobalContext'

interface MainLayoutProps extends GlobalProps {
  selected: number
  children?: JSX.Element
}

const MainLayout = (props: MainLayoutProps) => {
  // if user is logged in return props children
  if (props.loggedIn) {
    const navigation: HeaderNavigationProps[] = [
      { text: 'Dashboard', link: '/' },
      { text: 'Trade', link: '/trade' },
      { text: 'Tournaments', link: '/tournaments' },
      { text: 'Prizes', link: '/prizes' },
    ]

    navigation[props.selected].selected = true

    return (
      <GlobalContext.Provider value={props}>
        <Header navigation={navigation}>
          <UserMenu />
        </Header>
        {props.children}
      </GlobalContext.Provider>
    )
  }
  // if user is not logged in return landing page
  return (
    <>
      <Header
        navigation={[
          { text: 'Overview', link: '#overview' },
          { text: 'Tournaments', link: '#tournaments' },
          { text: 'Prizes', link: '#prizes' },
          { text: 'Contact', link: '#contact' },
        ]}
      >
        <>
          <Link href="/account/login">
            <a>Sign in</a>
          </Link>
          <Link href="/account/register" passHref>
            <Button text="Get started" />
          </Link>
        </>
      </Header>
      <Landing />
    </>
  )
}

export default MainLayout
