// import { validate } from "class-validator";
import {
    Arg,
    Ctx,
    Field,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    UseMiddleware,
} from "type-graphql";
import { User } from "../entities/User";
import { validateRegister } from "../utils/validate";
import { RegisterInputs } from "./inputs/registerInputs";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import { checkAccount } from "../utils/checkAccount";
import { UserAccount } from "./outputs/UserAccount";
// import axios from "axios";

//****************
//TODO
// add trim middleware and use validate from class validator extract errors
//****************

@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => User, { nullable: true })
    user?: User;

    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];
}

// @ObjectType()
// class UserAccount {
//     @Field(() => String, { nullable: true })
//     username?: string;

//     @Field(() => Number, { nullable: true })
//     balance?: number;
// }

@Resolver()
export class UserResolver {
    @Query(() => UserAccount, { nullable: true })
    async checkUserAccount(@Arg("accountName") accountName: string) {
        const data = checkAccount(accountName);
        return data;
    }

    @UseMiddleware(isAuth)
    @Query(() => User, { nullable: true })
    async me(@Ctx() { res }: MyContext) {
        if (!res.locals.user) {
            return null;
        }

        return res.locals.user;
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("username") username: string,
        @Arg("password") password: string,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        if (username.trim() === "") {
            return {
                errors: [
                    {
                        field: "username",
                        message: "username must not be empty",
                    },
                ],
            };
        }
        if (password.trim() === "") {
            return {
                errors: [
                    {
                        field: "password",
                        message: "password must not be empty",
                    },
                ],
            };
        }

        try {
            const user = await User.findOne({ username });
            if (!user) {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "username not found",
                        },
                    ],
                };
            }

            const validPassword = await argon2.verify(user.password, password);
            if (!validPassword) {
                return {
                    errors: [
                        {
                            field: "password",
                            message: "Invalid Password",
                        },
                    ],
                };
            }

            const token = jwt.sign({ username }, process.env.JWT_SECRET!);

            req.session.accessToken = token;

            return {
                user,
            };
        } catch (err) {
            console.log(err);
            return {
                errors: [
                    {
                        field: "general",
                        message: "something went wrong",
                    },
                ],
            };
        }
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("userData") userData: RegisterInputs
    ): Promise<UserResponse> {
        const errors = validateRegister(userData);
        if (errors) return { errors };

        try {
            const newUser = new User(userData);
            await newUser.save();
            return {
                user: newUser,
            };
        } catch (err) {
            if (err.code === "23505") {
                return {
                    errors: [
                        {
                            field: "username/email",
                            message: "Username/Email already exist",
                        },
                    ],
                };
            }

            return {
                errors: [
                    {
                        field: "general",
                        message: "Something went wrong",
                    },
                ],
            };
        }
    }
}
