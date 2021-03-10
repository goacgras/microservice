import axios from 'axios';
import { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import InputGroup from '../Components/InputGroup';
import { useAuthDispatch } from '../context/auth';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<any>({});

    const dispatch = useAuthDispatch();
    const history = useHistory();

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const res = await axios.post('/auth/login', {
                username,
                password
            });
            setErrors({});
            setUsername('');
            setPassword('');

            dispatch('LOGIN', res.data);

            history.push('/');
        } catch (err) {
            // console.log(err.response.data);
            setErrors(err.response.data);
        }
    };

    return (
        <div className="container flex items-center justify-center mx-auto">
            <div className="justify-center w-full h-screen max-w-md text-center my-14">
                <h1 className="mb-10 text-3xl font-medium">Login</h1>
                <form onSubmit={submitForm}>
                    <InputGroup
                        classname="mb-2"
                        placeholder="Username"
                        type="text"
                        value={username}
                        setValue={setUsername}
                        error={errors.username || errors.user}
                    />
                    <InputGroup
                        classname="mb-4"
                        placeholder="password"
                        type="password"
                        value={password}
                        setValue={setPassword}
                        error={errors.password}
                    />
                    <button
                        type="submit"
                        className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded hover:bg-blue-700"
                    >
                        Login
                    </button>
                    <div className="flex justify-center w-full">
                        <small>
                            Don't have account?
                            <Link to="/register">
                                <p className="ml-1 text-blue-500 ">Signup</p>
                            </Link>
                        </small>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
