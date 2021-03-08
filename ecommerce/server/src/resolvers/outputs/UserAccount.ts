import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class UserAccount {
    @Field(() => String, { nullable: true })
    username?: string;

    @Field(() => Number, { nullable: true })
    balance?: number;
}
