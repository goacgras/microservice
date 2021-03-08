import { Request, Response, Router } from "express";
import { User } from "../entities/User";
import authMiddleware from "../middleware/authMiddleware";
import argon2 from "argon2";

interface payInput {
    username: string;
    password: string | Buffer;
    amount: number;
}

const addBalance = async (req: Request, res: Response) => {
    const amount: number = req.body.amount;
    const password: string = req.body.password;

    try {
        const user: User = res.locals.user;

        const updatedUser = await User.findOneOrFail({
            username: user.username,
        });

        updatedUser.balance = updatedUser.balance + amount;

        const validPassword = await argon2.verify(
            updatedUser.password,
            password
        );
        if (!validPassword) {
            return res.status(401).json({ password: "invalid password" });
        }
        updatedUser.save();

        return res.json(updatedUser);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const pay = async (req: Request, res: Response) => {
    try {
        const { username, password, amount }: payInput = req.body;
        const user = await User.findOne({ username });
        // console.log("REQUEST FROM: ", req.socket.remoteAddress);
        if (!user) {
            return res.json({ status: "User not found" });
        }

        const validPassword = await argon2.verify(user.password, password);
        if (!validPassword) {
            return res.json({ status: "Wrong Password" });
        }

        if (user.balance - amount < 0) {
            return res.json({ status: "insufficient balance" });
        }

        user.balance = user.balance - amount;
        await user.save();

        return res.json({
            username: user.username,
            balance: user.balance,
            status: "SUCCESS",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const router = Router();
router.post("/addBalance", authMiddleware, addBalance);
router.post("/pay", pay);

export default router;
