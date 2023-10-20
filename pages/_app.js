import "../styles/globals.css";

import "bootstrap/dist/css/bootstrap.min.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import Router from "next/router";
import { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import Loader from "../components/loader";

config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Router.events.on("routeChangeStart", (url) => {
      setLoading(true);
    });
    Router.events.on("routeChangeComplete", (url) => {
      setLoading(false);
    });
    Router.events.on("routeChangeError", (url) => {
      setLoading(false);
    });
  }, [Router]);

  return (
    <>
      <PrimeReactProvider>
        {loading && <Loader />}
        <Component {...pageProps} />
      </PrimeReactProvider>
    </>
  );
}

export default MyApp;
