import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Main from '../components/Main';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

export default function Home() {
  return (
    <>
      <Head>
        <title>Phoenix</title>
      </Head>
      <ToastContainer />
      <main className={`bg-[#f5f5f5] min-h-screen `}>
        <Main />
      </main>
    </>
  );
}
