import { Field, ObjectType } from "type-graphql";
import {
    Column,
    Entity as TOEntity,
    ManyToOne,
    JoinColumn,
    Index,
} from "typeorm";
import Entity from "./Entity";
import { Product } from "./Product";
import { User } from "./User";

@ObjectType()
@TOEntity("orders")
export class Order extends Entity {
    constructor(order: Partial<Order>) {
        super();
        Object.assign(this, order);
    }

    @Field()
    @Index()
    @Column({ unique: true })
    invoiceNumber: string;

    @Field()
    @Column()
    totalPrice!: number;

    @Field()
    @Column()
    quantity!: number;

    @Field()
    @Column()
    orderStatus!: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({ name: "buyer", referencedColumnName: "username" })
    buyer: User;

    @Field()
    @ManyToOne(() => Product, (product) => product.orders)
    @JoinColumn({ name: "productName", referencedColumnName: "name" })
    productName: Product;
}
