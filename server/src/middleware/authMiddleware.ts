import { NextFunction, Request, Response } from "express";
import { Session, SessionData } from "express-session";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";

export default async (
    req: Request & {
        session: Session &
            Partial<SessionData> & { username?: string; accessToken?: string };
    },
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.session.accessToken) throw new Error("You are not welcome");

        const token = req.session.accessToken;
        if (!token) throw new Error("No Token found");

        const { username }: any = jwt.verify(token, process.env.JWT_SECRET!);
        const user = await User.findOne({ username });
        if (!user) throw new Error("No User found");

        //save user in locals
        res.locals.user = user;
        return next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ error: "Unauthenticated" });
    }
};
