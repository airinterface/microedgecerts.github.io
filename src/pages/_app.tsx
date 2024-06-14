import dynamic from 'next/dynamic';
import type { AppProps } from 'next/app'
import Layout from '@/layout'
import '@/styles/globals.scss';
import Loading from '@/components/Loading'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WalletWrapper = dynamic(() => import('@/context/WalletWrapper'), {
  ssr: false,
  loading: () => <Loading/>,
});

export default function MyApp({ Component, pageProps }: AppProps) {

  return  <WalletWrapper> 
            <ToastContainer/>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </WalletWrapper>

}
