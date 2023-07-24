import "../styles/globals.css";

import "bootstrap/dist/css/bootstrap.min.css";
import { config } from "@fortawesome/fontawesome-svg-core";

import { PrimeReactProvider } from "primereact/api";

config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  return (
    <>
      <PrimeReactProvider>
        <Component {...pageProps} />
      </PrimeReactProvider>
    </>
  );
}

export default MyApp;
