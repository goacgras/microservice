import {
    BaseEntity,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { Field, ObjectType } from "type-graphql";
import { classToPlain } from "class-transformer";

@ObjectType()
export default abstract class Entity extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id?: number;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

    toJSON() {
        return classToPlain(this);
    }
}
