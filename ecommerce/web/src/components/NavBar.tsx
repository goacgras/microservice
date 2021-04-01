import React, { useState } from "react";
import Logo from "../images/shopping-bag.svg";
import Link from "next/link";
import {
    useMeQuery,
    useLogoutMutation,
    MeDocument,
    MeQuery,
    ProductInput,
    useAddProductMutation,
    ProductsQuery,
    ProductsDocument,
    OrderInput,
} from "../generated/graphql";
import Modal from "./Modal";
import InputGroup from "./InputGroup";
// import { useApolloClient } from "@apollo/client";
// import { useRouter } from "next/dist/client/router";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { emptyOrders } from "../store/orderReducer";
import ShoppingCart from "./ShoppingCart";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
    const orders = useAppSelector<OrderInput[]>(
        (state) => state.OrderReducer.orders
    );

    const dispatch = useAppDispatch();

    const [newProductName, setNewProductName] = useState("");
    const [newProductPrice, setNewProductPrice] = useState("");
    const [newProductQty, setNewProductQty] = useState("");

    const [modal, setModal] = useState(false);
    const { data, loading } = useMeQuery();
    const [logout] = useLogoutMutation({
        update: (cache) => {
            const meData = cache.readQuery<MeQuery>({
                query: MeDocument,
            });

            cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                    __typename: "Query",
                    me: null,
                },
            });
        },
    });

    const [addProduct] = useAddProductMutation();
    // const apolloClient = useApolloClient();
    // const router = useRouter();

    const logoutHandler = async () => {
        console.log("hitLogout");
        dispatch(emptyOrders());
        await logout();

        // router.reload();
    };

    const closeModal = () => {
        setNewProductName("");
        setNewProductPrice("");
        setNewProductQty("");
        setModal(false);
    };

    const addNewProduct = async () => {
        const newProduct: ProductInput = {
            name: newProductName,
            price: parseInt(newProductPrice),
            quantity: parseInt(newProductQty),
        };

        await addProduct({
            variables: {
                input: newProduct,
            },
            update: (cache, { data }) => {
                const { products } = cache.readQuery<ProductsQuery>({
                    query: ProductsDocument,
                });

                cache.writeQuery<ProductsQuery>({
                    query: ProductsDocument,
                    data: {
                        __typename: "Query",
                        products: [data.addProduct, ...products],
                    },
                });
            },
        });

        setModal(false);
    };

    let modalMakrkup = null;
    if (modal) {
        modalMakrkup = (
            <Modal
                confirmText='Add'
                title='Add New product'
                closeModal={closeModal}
                modalAction={addNewProduct}
            >
                <InputGroup
                    classname='mb-2'
                    placeholder='Name'
                    type='text'
                    value={newProductName}
                    setValue={setNewProductName}
                />
                <InputGroup
                    classname='mb-2'
                    placeholder='Price'
                    type='number'
                    value={newProductPrice}
                    setValue={setNewProductPrice}
                />
                <InputGroup
                    classname='mb-2'
                    placeholder='Quantity'
                    type='number'
                    value={newProductQty}
                    setValue={setNewProductQty}
                />
            </Modal>
        );
    }
    const openModal = () => {
        setModal(true);
    };

    return (
        <>
            {modalMakrkup}
            <div className='fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-5 bg-white'>
                {/* Logo & title */}
                <div className='flex items-center'>
                    <Link href='/'>
                        <a>
                            <Logo className='w-10 h-10 mr-2' />
                        </a>
                    </Link>
                    <span className='block text-lg font-semibold '>
                        <Link href='/'>Gras-Buy</Link>
                    </span>
                </div>

                {/* Cart */}
                {orders.length !== 0 ? <ShoppingCart orders={orders} /> : null}

                {/* Auth button */}
                <div className='flex mr-2'>
                    {!loading && data?.me ? (
                        <>
                            {data.me.username === "admin" && (
                                <button
                                    type='button'
                                    className='w-20 py-1 mr-3 leading-5 sm:block lg:w-32 blue button'
                                    onClick={openModal}
                                >
                                    Add New Product
                                </button>
                            )}
                            <div className='relative inline-block group'>
                                <div className='flex items-center justify-center w-8 h-8 bg-gray-400 rounded-full cursor-pointer '>
                                    {data.me.username.charAt(0).toUpperCase()}
                                </div>
                                <ul className='absolute hidden w-32 p-1 bg-gray-200 rounded group-hover:block right-1'>
                                    <li className='flex items-center justify-between px-2 cursor-pointer hover:bg-gray-400'>
                                        <a>Setting</a>
                                        <i className='text-gray-500 fas fa-cog'></i>
                                    </li>
                                    <li
                                        className='flex items-center justify-between px-2 cursor-pointer whitespace-nowrap hover:bg-gray-400'
                                        onClick={logoutHandler}
                                    >
                                        <a>Logout</a>
                                        <i className='text-gray-500 fas fa-sign-out-alt'></i>
                                    </li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href='/login'>
                                <a className='w-20 py-1 mr-4 leading-5 sm:block lg:w-32 hollow blue button'>
                                    Login
                                </a>
                            </Link>
                            <Link href='/register'>
                                <a className='w-20 py-1 leading-5 sm:block lg:w-32 blue button'>
                                    Signup
                                </a>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;
