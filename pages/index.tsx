import Main from "@/components/Main";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={`bg-[#f5f5f5] min-h-screen ${inter.className}`}>
      <Main />
    </main>
  );
}
