import { Html, Head, Main, NextScript } from "next/document";
import AppContextProvider from '../context/AppContextProvider';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <link rel="icon" href="/favicon.ico" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Inter&family=Space+Grotesk&display=swap"
        rel="stylesheet" />

      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap"
        rel="stylesheet"
      />

      <body>
        <AppContextProvider>
          <Main />
          <NextScript />
        </AppContextProvider>
      </body>
    </Html>
  );
}
