import "../styles/globals.css";
import type { AppProps /*, AppContext */ } from "next/app";

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

import { useRouter } from "next/dist/client/router";
import Navbar from "../components/NavBar";
// import { client } from "../utils/withApollo";

//REDUX
import { Provider } from "react-redux";
import store from "../store";

const client = new ApolloClient({
    uri: "http://localhost:5001/graphql",
    cache: new InMemoryCache(),
    credentials: "include",
});

function MyApp({ Component, pageProps }: AppProps) {
    const { pathname } = useRouter();
    const authRoutes = ["/login", "/register"];
    const authRoute = authRoutes.includes(pathname);

    return (
        <Provider store={store}>
            <ApolloProvider client={client}>
                {!authRoute && <Navbar />}
                <div className={authRoute ? "" : "pt-12"}>
                    <Component {...pageProps} />
                </div>
            </ApolloProvider>
        </Provider>
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
