import Head from 'next/head';
import Main from "../Components/Main";

export default function Home() {
    return (
        <>
            <Head>
                <title>Phoenix</title>
            </Head>
            <main className={`bg-[#f5f5f5] min-h-screen `}>
                <Main />
            </main>
        </>
    );
}
