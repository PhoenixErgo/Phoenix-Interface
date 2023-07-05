import Main from "@/components/Main";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Phoenix</title>
      </Head>
      <main className={`bg-[#f5f5f5] min-h-screen ${inter.className}`}>
        <Main />
      </main>
    </>
  );
}
