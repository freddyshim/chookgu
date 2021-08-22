import { ReactElement } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import MainLayout from '@components/MainLayout'
import Layout from '@components/Layout'
import { GlobalProps, getGlobalProps } from '@utils/GlobalContext'

const Prizes = (props: GlobalProps) => {
  const router = useRouter()

  if (!props.loggedIn) {
    router.push('/')
  }

  return (
    <Layout>
      <div>Prizes</div>
    </Layout>
  )
}

Prizes.getLayout = (page: ReactElement) => {
  const props: GlobalProps = page.props

  return (
    <div>
      <Head>
        <title>Chookgu</title>
        <meta name="description" content="Description of chookgu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <MainLayout selected={3} {...props}>
          {page}
        </MainLayout>
      </main>
      <footer></footer>
    </div>
  )
}

export const getServerSideProps = getGlobalProps

export default Prizes
