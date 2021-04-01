import { useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import {
    OrderInput,
    Product,
    useMeQuery,
    useProductsQuery,
} from "../generated/graphql";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { placeOrder, getInitialCartItems } from "../store/orderReducer";

export default function Home() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getInitialCartItems());
    }, []);

    const orders = useAppSelector<OrderInput[]>(
        (state) => state.OrderReducer.orders
    );

    const { data, loading, error } = useProductsQuery();
    const { data: meData, loading: meLoading } = useMeQuery();
    const router = useRouter();

    if (loading) return <div>Loading...</div>;

    if (!data?.products) {
        return <div>Loading...</div>;
    }

    if (!loading && !data) {
        <div>
            <div>Something went wrong on your query</div>
            <div>{error?.message}</div>
        </div>;
    }

    const addToCart = (product: Product) => {
        if (!meData?.me) {
            router.push("/login");
            return;
        }
        const foundProd = orders.find((o) => o.name === product.name);
        if (foundProd) {
            return;
        }

        const newOrder: OrderInput = {
            name: product.name,
            quantity: 1,
        };

        console.log("buy");
        dispatch(placeOrder(newOrder));
    };

    return (
        <>
            <Head>
                <title>Home page</title>
            </Head>

            <div className='container'>
                <div className='grid grid-cols-3 gap-4 p-2'>
                    {data.products.map((product) => (
                        <div className='py-6' key={product.id}>
                            <div className='flex max-w-md overflow-hidden bg-white rounded-lg shadow-lg'>
                                <div className='w-1/3 bg-cover'>
                                    {/* Images */}
                                </div>
                                <div className='w-2/3 p-4'>
                                    <h1 className='text-2xl font-bold text-gray-900'>
                                        {product.name}
                                    </h1>
                                    <p className='mt-2 text-sm text-gray-600'>
                                        Lorem ipsum dolor sit amet consectetur
                                        adipisicing elit In odit exercitationem
                                        fuga id nam quia
                                    </p>
                                    {/* <div className='flex mt-2 item-center'>
                                        THIS II WHERE IMAGE
                                    </div> */}
                                    <div className='flex justify-between mt-3 item-center'>
                                        <h1 className='text-xl font-bold text-gray-700'>
                                            ${product.price}
                                        </h1>
                                        {meData?.me?.username !== "admin" ? (
                                            <button
                                                className='px-3 py-2 text-xs font-bold text-white uppercase bg-gray-800 rounded'
                                                onClick={() =>
                                                    addToCart(product)
                                                }
                                            >
                                                Add to Card
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
