import { validate } from "class-validator";
import { Request, Response, Router } from "express";
import { User } from "../entities/User";

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

const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const username = await User.findOneOrFail({});
    } catch (err) {}
};

const router = Router();
router.post("/register", register);

export default router;
