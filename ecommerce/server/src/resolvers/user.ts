import { validate } from "class-validator";
import { Arg, Field, Mutation, ObjectType, Resolver } from "type-graphql";
import { User } from "../entities/User";

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

@Resolver(User)
export class UserResolver {
    @Mutation(() => UserResponse)
    async register(
        @Arg("email") email: string,
        @Arg("username") username: string,
        @Arg("password") password: string
    ): Promise<UserResponse | undefined> {
        try {
            const newUser = new User({ email, username, password });
            const errors = await validate(newUser);
            if (errors) {
                console.log(errors);
                return {
                    errors: [
                        {
                            field: "general",
                            message: "error dude",
                        },
                    ],
                };
            }
            return {
                user: newUser,
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
}
