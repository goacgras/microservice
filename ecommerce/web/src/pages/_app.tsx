import "../styles/globals.css";
import type { AppProps /*, AppContext */ } from "next/app";

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
// import { client } from "../utils/withApollo";

const client = new ApolloClient({
    uri: "http://localhost:5001/graphql",
    cache: new InMemoryCache(),
    credentials: "include",
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ApolloProvider client={client}>
            <Component {...pageProps} />
        </ApolloProvider>
    );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default MyApp;
