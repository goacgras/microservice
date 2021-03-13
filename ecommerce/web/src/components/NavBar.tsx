import React from "react";
import Logo from "../images/shopping-bag.svg";
import Link from "next/link";
import {
    useMeQuery,
    useLogoutMutation,
    MeDocument,
    MeQuery,
} from "../generated/graphql";
import { useApolloClient } from "@apollo/client";
import { useRouter } from "next/dist/client/router";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
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
    const apolloClient = useApolloClient();
    const router = useRouter();

    const logoutHandler = async () => {
        await logout();
        // router.reload();
    };

    return (
        <div className='fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-5 bg-white'>
            {/* Logo & title */}
            <div className='flex items-center'>
                <Link href='/'>
                    <a>
                        <Logo className='w-10 h-10 mr-2' />
                    </a>
                </Link>
                <span className='hidden text-lg font-semibold lg:block'>
                    <Link href='/'>Gras-Buy</Link>
                </span>
            </div>

            {/* Auth button */}
            <div className='flex'>
                {!loading && data?.me ? (
                    <>
                        <h1 className='mr-4'>Welcome {data.me?.username}</h1>
                        <button
                            type='button'
                            className='hidden w-20 py-1 mr-4 leading-5 sm:block lg:w-32 hollow blue button'
                            onClick={logoutHandler}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link href='/login'>
                            <a className='hidden w-20 py-1 mr-4 leading-5 sm:block lg:w-32 hollow blue button'>
                                Login
                            </a>
                        </Link>
                        <Link href='/register'>
                            <a className='hidden w-20 py-1 leading-5 sm:block lg:w-32 blue button'>
                                Signup
                            </a>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
