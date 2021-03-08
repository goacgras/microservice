import { Entity as TOEntity, Column, ManyToOne, JoinColumn } from "typeorm";
import Entity from "./Entity";

import { User } from "./User";

@TOEntity("logs")
export class Log extends Entity {
    constructor(log: Partial<Log>) {
        super();
        Object.assign(this, log);
    }

    @Column()
    transaction: number;

    @Column()
    balance: number;

    @Column()
    status: string;

    @ManyToOne(() => User, (user) => user.logs)
    @JoinColumn({ name: "username", referencedColumnName: "username" })
    user: User;
}
