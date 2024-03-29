import Head from "next/head";
import React, { FormEvent, useState } from "react";
import InputGroup from "../components/InputGroup";
import { useMeQuery, useRegisterMutation } from "../generated/graphql";
import Link from "next/link";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/dist/client/router";

interface loginProps {}

const Register: React.FC<loginProps> = ({}) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<any>({});

    const router = useRouter();

    const [register] = useRegisterMutation();
    const { data } = useMeQuery();
    if (data?.me) {
        router.push("/");
    }

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = await register({
                variables: { userData: { email, username, password } },
            });
            if (res.data?.register.errors) {
                setErrors(toErrorMap(res.data.register.errors));
            } else if (res.data.register.user) {
                router.push("/login");
            }
        } catch (err) {
            console.log(err);
        }

        // if (data) {
        //     console.log("DATA: ", data);
        // }
    };

    return (
        <div className='w-screen h-screen bg-gray-400'>
            <div className='container flex items-center justify-center w-screen h-screen mx-auto bg-gray-300'>
                <Head>
                    <title>Register</title>
                </Head>
                <div className='justify-center w-full h-screen max-w-md py-10 text-center'>
                    <h1 className='mb-10 text-3xl font-medium text-black'>
                        Login to Gras-Buy
                    </h1>
                    <form onSubmit={submit}>
                        <InputGroup
                            classname='mb-2'
                            placeholder='Email'
                            type='email'
                            value={email}
                            setValue={setEmail}
                            error={errors.email}
                        />
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
                            Register
                        </button>
                    </form>
                    <div className='flex justify-center w-full'>
                        <small className='mt-1'>
                            Already have an account?
                            <Link href='/login'>
                                <a className='ml-1 text-blue-500 '>Login</a>
                            </Link>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
