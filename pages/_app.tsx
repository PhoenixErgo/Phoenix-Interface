import '../styles/globals.css';
import '../styles/style.css';
import { AdvancedSettingsProvider } from '../context/AdvansedSettings';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <AdvancedSettingsProvider>
        <Component {...pageProps} />
      </AdvancedSettingsProvider>
    </div>
  );
}
