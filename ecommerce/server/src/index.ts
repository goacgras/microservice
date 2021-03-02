import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

// import { UserResolver } from "./resolvers/user";
import { HelloResolver } from "./resolvers/hello";
import { UserResolver } from "./resolvers/user";

const main = async () => {
    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, UserResolver],
            // validate: true
        }),
    });

    apolloServer.applyMiddleware({ app });

    app.listen(5001, () => {
        console.log("Server started at localhost:5001");
    });
};

main().catch((err) => {
    console.log(err);
});
