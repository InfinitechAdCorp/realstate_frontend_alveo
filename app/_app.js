import Head from "next/head"; // ✅ Import Head from next/head
import RootLayout from "./RootLayout";
import { metadata } from "./metadata";

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </>
  );
}

export default App;
