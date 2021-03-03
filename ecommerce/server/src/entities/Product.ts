import { Field, ObjectType } from "type-graphql";
import { Column, Entity as TOEntity, Index, OneToMany } from "typeorm";
import Entity from "./Entity";
import { Order } from "./Order";

@ObjectType()
@TOEntity("products")
export class Product extends Entity {
    constructor(product: Partial<Product>) {
        super();
        Object.assign(this, product);
    }

    @Field()
    @Index()
    @Column({ unique: true })
    name: string;

    @Field()
    @Column()
    price: number;

    @Field()
    @Column()
    quantity: number;

    @OneToMany(() => Order, (order) => order.productName)
    orders: Order[];
}
