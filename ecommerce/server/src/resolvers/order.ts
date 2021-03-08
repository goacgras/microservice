import axios from "axios";
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
import { Order } from "../entities/Order";
import { Product } from "../entities/Product";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@ObjectType()
export class PayResponse {
    @Field(() => String, { nullable: true })
    username?: string;

    @Field(() => String, { nullable: true })
    status?: string;

    @Field(() => Number, { nullable: true })
    balance?: number;
}

@Resolver()
export class OrderResolver {
    @Query(() => [Order], { nullable: true })
    async orders(): Promise<Order[] | null> {
        try {
            const orders = await Order.find({
                order: {
                    createdAt: "DESC",
                },
                relations: ["buyer", "productName"],
            });

            return orders;
        } catch (err) {
            console.log(err);
            throw new Error("something went wrong");
        }
    }

    //TODO CREATE FUNCTION TO CHECK ACCOUNT AND RETURN USER BALANCE AND ACCOUNT
    //ADD PAY METHOD IN BANK BACKEND {account and pin and amount}
    @Mutation(() => PayResponse!)
    async payOrder(
        @Arg("orderId") orderId: number,
        @Arg("accountName") accountName: string,
        @Arg("password") password: string
    ) {
        const order = await Order.findOne({ where: { id: orderId } });
        if (!order) {
            throw new Error("Order not found");
        }

        if (order.orderStatus === "PAID") {
            throw new Error("Order already been paid");
        }

        const res = await axios.post(
            `http://localhost:5000/api/transaction/pay`,
            {
                username: accountName,
                password,
                amount: order.totalPrice,
            }
        );

        if (res.data.status !== "SUCCESS") {
            return res.data;
        }

        order.orderStatus = "PAID";
        order.save();

        return res.data;
    }

    @UseMiddleware(isAuth)
    @Mutation(() => Order)
    async placeOrder(
        @Arg("productName") productName: string,
        @Arg("quantity") quantity: number,
        @Ctx() { res }: MyContext
    ) {
        // try {
        const product = await Product.findOne({
            where: { name: productName },
        });
        if (!product) {
            throw new Error("Product not found");
        }

        if (product.quantity <= 0 || product.quantity - quantity < 0) {
            throw new Error("Insuficcient product quantity");
        }

        const totalPrice: number = product.price * quantity;
        product.quantity = product.quantity - quantity;

        const newOrder = new Order({
            buyer: res.locals.user,
            productName: product,
            totalPrice,
            quantity,
            orderStatus: "RESERVED",
        });

        await newOrder.save();
        await product.save();

        return newOrder;
        // } catch (err) {
        //     console.log(err);
        //     throw new Error("Something went wrong");
        // }
    }
}
