import { InputType, Field } from "type-graphql";

@InputType()
export class RegisterInputs {
    @Field()
    username: string;
    @Field()
    password: string;
    @Field()
    email: string;
}

@InputType()
export class OrderInput {
    @Field()
    name: string;
    @Field()
    quantity: number;
}
