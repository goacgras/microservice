import axios from 'axios';
import { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import InputGroup from '../Components/InputGroup';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<any>({});

    const history = useHistory();

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await axios.post('/auth/register', {
                username,
                password,
                email
            });
            setErrors({});
            setEmail('');
            setUsername('');
            setPassword('');

            history.push('/login');
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
                        placeholder="Email"
                        type="email"
                        value={email}
                        setValue={setEmail}
                        error={errors.email}
                    />
                    <InputGroup
                        classname="mb-2"
                        placeholder="Username"
                        type="text"
                        value={username}
                        setValue={setUsername}
                        error={errors.username}
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
                            Already have an account?
                            <Link to="/login">
                                <p className="ml-1 text-blue-500 ">Login</p>
                            </Link>
                        </small>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
