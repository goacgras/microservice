import { Field, ObjectType } from "type-graphql";
import {
    BeforeInsert,
    Column,
    Entity as TOEntity,
    Index,
    OneToMany,
} from "typeorm";
import Entity from "./Entity";

import argon2 from "argon2";
import { Order } from "./Order";
// import { IsEmail, Length } from "class-validator";

@ObjectType()
@TOEntity("users")
export class User extends Entity {
    constructor(user: Partial<User>) {
        super();
        Object.assign(this, user);
    }

    @Field()
    @Index()
    // @IsEmail(undefined, { message: "Must Be a valid Email address" })
    // @Length(1, 255, { message: "Email is empty" })
    @Column({ unique: true })
    email: string;

    @Field()
    @Index()
    // @Length(3, 255, { message: "Must be at least 3 character" })
    @Column({ unique: true })
    username: string;

    // @Length(6, 255, { message: "Must be at least 6 character" })
    @Column()
    password: string;

    @OneToMany(() => Order, (order) => order.buyer)
    orders: Order[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await argon2.hash(this.password);
    }
}
