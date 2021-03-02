import { Exclude } from "class-transformer";
import { IsEmail, Length } from "class-validator";
import { Entity as TOEntity, Column, Index, BeforeInsert } from "typeorm";
import Entity from "./Entity";

import argon2 from "argon2";

@TOEntity("users")
export class User extends Entity {
    constructor(user: Partial<User>) {
        super();
        Object.assign(this, user);
    }

    @Index()
    @IsEmail(undefined, { message: "Must be a valid email address" })
    @Length(1, 255, { message: "Email is empty" })
    @Column({ unique: true })
    email: string;

    @Index()
    @Column({ unique: true })
    @Length(3, 255, { message: "Must be at least 3 character" })
    username: string;

    @Exclude()
    @Column()
    @Length(6, 25, { message: "Must be at least 6 character" })
    password: string;

    @Index()
    @Column({ nullable: true })
    balance: number;

    @BeforeInsert()
    async hashPassword() {
        this.password = await argon2.hash(this.password);
    }
}
