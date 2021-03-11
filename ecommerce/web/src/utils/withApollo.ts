import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
    uri: "https://localhost/5001/graphql",
    cache: new InMemoryCache(),
    credentials: "include",
});
