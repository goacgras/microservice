import "reflect-metadata";
import express from "express";

import dotenv from "dotenv";
dotenv.config();

import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

//redis
import Redis from "ioredis";
import connectRedis from "connect-redis";
import session from "express-session";

// import { UserResolver } from "./resolvers/user";
import { HelloResolver } from "./resolvers/hello";
import { UserResolver } from "./resolvers/user";
import { ProductResolver } from "./resolvers/product";
import { createConnection } from "typeorm";
import { MyContext } from "./types";

const main = async () => {
    const app = express();

    const RedisStore = connectRedis(session);
    const redis = new Redis();

    app.use(
        session({
            name: "qid",
            store: new RedisStore({
                client: redis as any,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true, //cant access cookie in front end
                sameSite: "lax", // csrf
                secure: process.env.NODE_ENV === "production",
            },
            saveUninitialized: false,
            secret: "goacgrasisthebest",
            resave: false,
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, UserResolver, ProductResolver],
            validate: false,
        }),
        context: ({ req, res }): MyContext => ({
            req,
            res,
        }),
    });

    apolloServer.applyMiddleware({ app });

    app.listen(5001, async () => {
        console.log("Server started at localhost:5001");
        try {
            await createConnection();
            console.log("database connected");
        } catch (err) {
            console.log(err);
        }
    });
};

main().catch((err) => {
    console.log(err);
});
