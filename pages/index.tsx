
// import {Inter} from "next/font/google";
import Head from "next/head";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Main from "../Components/Main";

// const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <>
            <Head>
                <title>Phoenix</title>
            </Head>
            <ToastContainer />
            {/*${inter.className}*/}
            <main className={`bg-[#f5f5f5] min-h-screen `}>
                <Main/>
            </main>
        </>
    );
}