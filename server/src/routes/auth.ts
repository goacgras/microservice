import { isEmpty, validate } from "class-validator";
import { Request, Response, Router } from "express";
import { User } from "../entities/User";

import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { Session, SessionData } from "express-session";
import authMiddleware from "../middleware/authMiddleware";

const mapErrors = (errors: Object[]) => {
    return errors.reduce((prev: any, err: any) => {
        prev[err.property] = Object.entries(err.constraints)[0][1];
        return prev;
    }, {});
};

const register = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    try {
        //validating data
        let errors: any = {};

        const userEmail = await User.findOne({ email });
        const userUsername = await User.findOne({ username });

        if (userEmail) errors.email = "email already taken";
        if (userUsername) errors.username = "username already taken";

        if (Object.keys(errors).length > 0) {
            return res.status(400).json(errors);
        }

        //create user
        const newUser = new User({ email, username, password, balance: 0 });

        errors = await validate(newUser);
        if (errors.length > 0) {
            return res.status(400).json(mapErrors(errors));
        }

        await newUser.save();

        return res.json(newUser);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const login = async (
    req: Request & {
        session: Session & Partial<SessionData> & { accessToken?: string };
    },
    res: Response
) => {
    const { username, password } = req.body;

    try {
        let errors: any = {};
        if (isEmpty(username)) errors.username = "Username must not be empty";
        if (isEmpty(password)) errors.password = "Password must not be empty";
        if (Object.keys(errors).length > 0) {
            return res.status(401).json(errors);
        }

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ username: "User not found" });

        const validPassword = await argon2.verify(user.password, password);
        if (!validPassword)
            return res.status(401).json({ password: "invalid password" });

        const token = jwt.sign({ username }, process.env.JWT_SECRET!);

        //store in session with redis
        req.session.accessToken = token;

        return res.json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "something went wrong" });
    }
};

const checkAccount = async (req: Request, res: Response) => {
    const username: string = req.params.username;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.json({ username: "User not found" });
        }

        return res.json({
            username: user.username,
            balance: user.balance,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const me = (_: Request, res: Response) => {
    return res.json(res.locals.user);
};

const logut = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false });
        }
        res.clearCookie("qid");
        return res.status(200).json({ success: true });
    });
};

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/checkAccount/:username", checkAccount);
router.get("/me", authMiddleware, me);
router.get("/logout", authMiddleware, logut);

export default router;
