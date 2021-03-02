import { Request, Response, Router } from "express";
import { User } from "../entities/User";
import authMiddleware from "../middleware/authMiddleware";
import argon2 from "argon2";

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

const router = Router();
router.post("/addBalance", authMiddleware, addBalance);

export default router;
