import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Product } from "../entities/Product";

@InputType()
class ProductInput {
    @Field()
    name: string;
    @Field()
    price: number;
    @Field()
    quantity: number;
}

@Resolver()
export class ProductResolver {
    @Query(() => [Product], { nullable: true })
    async products(): Promise<Product[] | null> {
        try {
            const products = await Product.find({
                order: {
                    createdAt: "DESC",
                },
            });
            console.log("PRODUCTS: ", products);
            return products;
        } catch (err) {
            throw new Error(err);
        }
    }

    @Mutation(() => Product)
    async addProduct(@Arg("input") input: ProductInput): Promise<Product> {
        try {
            const newProduct = new Product(input);
            await newProduct.save();

            return newProduct;
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }
}
