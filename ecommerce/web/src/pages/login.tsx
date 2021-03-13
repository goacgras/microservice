import Head from "next/head";
import React, { FormEvent, useState } from "react";
import InputGroup from "../components/InputGroup";
import {
    MeDocument,
    MeQuery,
    useLoginMutation,
    useMeQuery,
} from "../generated/graphql";
import Link from "next/link";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/dist/client/router";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<any>({});

    const router = useRouter();

    const [login] = useLoginMutation();
    const { data } = useMeQuery();

    if (data?.me) {
        router.push("/");
    }

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = await login({
                variables: {
                    username,
                    password,
                },
                update: (cache, { data }) => {
                    cache.writeQuery<MeQuery>({
                        query: MeDocument,
                        data: {
                            __typename: "Query",
                            me: data?.login.user,
                        },
                    });
                },
            });
            if (res.data?.login.errors) {
                setErrors(toErrorMap(res.data.login.errors));
            } else if (res.data.login.user) {
                router.push("/");
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='w-screen h-screen bg-gray-400'>
            <div className='container flex items-center justify-center w-screen h-screen mx-auto bg-gray-300'>
                <Head>
                    <title>Login</title>
                </Head>
                <div className='justify-center w-full h-screen max-w-md py-10 text-center'>
                    <h1 className='mb-10 text-3xl font-medium text-black'>
                        Login to Gras-Buy
                    </h1>
                    <form onSubmit={submit}>
                        <InputGroup
                            classname='mb-2'
                            placeholder='Username'
                            type='text'
                            value={username}
                            setValue={setUsername}
                            error={errors.username}
                        />
                        <InputGroup
                            classname='mb-4'
                            placeholder='password'
                            type='password'
                            value={password}
                            setValue={setPassword}
                            error={errors.password}
                        />
                        <button
                            className='w-full uppercase bg-blue-300 border border-blue-500 rounded-lg'
                            type='submit'
                        >
                            Login
                        </button>
                    </form>
                    <div className='flex justify-center w-full'>
                        <small className='mt-1'>
                            Don't have account?
                            <Link href='/register'>
                                <a className='ml-1 text-blue-500 '>Signup</a>
                            </Link>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
