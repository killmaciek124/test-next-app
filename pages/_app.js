import "../styles/globals.css";
import Layout from "@/components/layout/Layout";

function MyApp({ Component, pageProps }) {
  // kinda root component
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
