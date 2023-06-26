import { CssBaseline } from '@mui/material';
import { appWithTranslation } from 'next-i18next';
import '../styles/leaflet.css';

import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <CssBaseline />
      <Component {...pageProps} />
    </>
  )
}

export default appWithTranslation(MyApp);
