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
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { makeId } from "../utils/helpers";
import { validateOrder } from "../utils/validate";
// import { validateOrder } from "../utils/validate";
import { OrderInput } from "./inputs/registerInputs";

@ObjectType()
export class PayResponse {
    @Field(() => String, { nullable: true })
    username?: string;

    @Field(() => String, { nullable: true })
    status?: string;

    @Field(() => Number, { nullable: true })
    balance?: number;
}

@ObjectType()
class OrderError {
    @Field()
    field?: string;

    @Field()
    message?: string;
}

@ObjectType()
class OrderResponse {
    @Field(() => [Order], { nullable: true })
    order?: Order[];

    @Field(() => [OrderError], { nullable: true })
    errors?: OrderError[];
}

const ordering = async (
    product: { name: string; quantity: number },
    user: User,
    invoiceNumber: string
) => {
    const prod = await Product.findOne({
        where: {
            name: product.name,
        },
    });

    if (!prod) {
        throw new Error(`${product.name} not found`);
    }

    const totalPrice: number = prod.price * product.quantity;
    prod.quantity = prod.quantity - product.quantity;

    const newOrder = new Order({
        invoiceNumber,
        buyer: user,
        productName: prod,
        totalPrice,
        quantity: product.quantity,
        orderStatus: "RESERVED",
    });

    await newOrder.save();
    await prod.save();

    return newOrder;
};

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

    @UseMiddleware(isAuth)
    @Mutation(() => PayResponse!)
    async payOrder(
        @Arg("invoiceNumber") invoiceNumber: string,
        @Arg("accountName") accountName: string,
        @Arg("password") password: string
    ): Promise<PayResponse> {
        const orders = await Order.find({
            where: {
                invoiceNumber: invoiceNumber,
            },
        });

        if (orders.length <= 0) {
            throw new Error("Orders not found");
        }

        orders.forEach((o) => {
            if (o.orderStatus === "PAID") {
                throw new Error("Orders already been paid");
            }
        });

        const totalPrice = orders.reduce(
            (prev, curr) => prev + curr.totalPrice,
            0
        );

        const res = await axios.post(
            `http://localhost:5000/api/transaction/pay`,
            {
                username: accountName,
                password,
                amount: totalPrice,
            }
        );

        if (res.data.status !== "SUCCESS") {
            return res.data;
        }
        Promise.all(
            orders.map(async (o) => {
                o.orderStatus = "PAID";
                await o.save();
            })
        );

        return res.data;
    }

    // @UseMiddleware(isAuth)
    // @Mutation(() => PayResponse!)
    // async payOrder(
    //     @Arg("orderId") orderId: number,
    //     @Arg("accountName") accountName: string,
    //     @Arg("password") password: string
    // ) {
    //     const order = await Order.findOne({ where: { id: orderId } });
    //     if (!order) {
    //         throw new Error("Order not found");
    //     }

    //     if (order.orderStatus === "PAID") {
    //         throw new Error("Order already been paid");
    //     }

    //     const res = await axios.post(
    //         `http://localhost:5000/api/transaction/pay`,
    //         {
    //             username: accountName,
    //             password,
    //             amount: order.totalPrice,
    //         }
    //     );

    //     if (res.data.status !== "SUCCESS") {
    //         return res.data;
    //     }

    //     order.orderStatus = "PAID";
    //     order.save();

    //     return res.data;
    // }

    @UseMiddleware(isAuth)
    @Mutation(() => OrderResponse)
    async placeOrder(
        @Arg("ordersData", () => [OrderInput]) ordersData: OrderInput[],
        @Ctx() { res }: MyContext
    ): Promise<OrderResponse> {
        const err: [] = await validateOrder(ordersData);
        if (err.length > 0) {
            return {
                errors: err,
            };
        }

        const invoiceNumber = makeId(8);

        const newOrders = await Promise.all(
            ordersData.map(
                async (p) => await ordering(p, res.locals.user, invoiceNumber)
            )
        );

        return {
            order: newOrders,
        };
    }

    // @UseMiddleware(isAuth)
    // @Mutation(() => Order)
    // async placeOrder(
    //     @Arg("productName") productName: string,
    //     @Arg("quantity") quantity: number,
    //     @Ctx() { res }: MyContext
    // ) {
    //     // try {
    //     const product = await Product.findOne({
    //         where: { name: productName },
    //     });
    //     if (!product) {
    //         throw new Error("Product not found");
    //     }

    //     if (product.quantity <= 0 || product.quantity - quantity < 0) {
    //         throw new Error("Insuficcient product quantity");
    //     }

    //     const totalPrice: number = product.price * quantity;
    //     product.quantity = product.quantity - quantity;

    //     const newOrder = new Order({
    //         buyer: res.locals.user,
    //         productName: product,
    //         totalPrice,
    //         quantity,
    //         orderStatus: "RESERVED",
    //     });

    //     await newOrder.save();
    //     await product.save();

    //     return newOrder;
    //     // } catch (err) {
    //     //     console.log(err);
    //     //     throw new Error("Something went wrong");
    //     // }
    // }
}
