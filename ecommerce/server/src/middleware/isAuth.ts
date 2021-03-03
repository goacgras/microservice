import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
    try {
        if (!context.req.session.accessToken) throw new Error("Unauthorize");

        const { username }: any = jwt.verify(
            context.req.session.accessToken,
            process.env.JWT_SECRET!
        );
        if (!username) throw new Error("No token found");

        const user = await User.findOne({ username });
        if (!user) throw new Error("User not found");

        context.res.locals.user = user;

        return next();
    } catch (err) {
        console.log(err);
        throw new Error("Unauthorize");
    }
};
