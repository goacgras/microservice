import { FormEvent, useState } from 'react';
import BankLogo from '../images/Bank.svg';
import { Link, useHistory } from 'react-router-dom';
import { useAuthDispatch, useAuthState } from '../context/auth';
import axios from 'axios';

import { LogSideBar } from '../Components/LogBar/LogSideBar';
import InputGroup from '../Components/InputGroup';

// interface HomeProps {}

const Home: React.FC = () => {
    const [amount, setAmount] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<any>({});

    const { authenticated, loading, user } = useAuthState();

    const dispatch = useAuthDispatch();
    const history = useHistory();

    const logout = async () => {
        try {
            await axios.get('/auth/logout');
            dispatch('LOGOUT');
            history.push('/login');
        } catch (err) {
            console.log(err);
        }
    };

    const addBalance = () => {
        if (amount.trim() === '') {
            setErrors({ amount: 'Please put the amount' });
            return;
        }
        setErrors({});
        setShowModal(true);
    };

    const deposit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('/transaction/addBalance', {
                amount: parseInt(amount),
                password
            });

            setAmount('');
            setPassword('');
            setShowModal(false);
            dispatch('LOGIN', res.data);
            // window.location.reload();
        } catch (err) {
            setErrors(err.response.data);
        }
    };

    const cancelDeposit = () => {
        setAmount('');
        setPassword('');
        setShowModal(false);
    };

    let modal = null;
    if (showModal) {
        modal = (
            <>
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <div className="relative w-auto max-w-sm mx-auto my-6 ">
                        {/*content*/}
                        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                            {/*header*/}
                            <div className="flex items-center justify-center p-5 border-b border-gray-300 border-solid rounded-t">
                                <h3 className="text-3xl font-semibold">
                                    Enter Pin
                                </h3>
                            </div>
                            {/*body*/}
                            <div className="relative flex-auto p-2">
                                <InputGroup
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                    setValue={setPassword}
                                    error={errors.password}
                                />
                            </div>
                            {/*footer*/}
                            <div className="flex items-center justify-end p-6 border-t border-gray-300 border-solid rounded-b">
                                <button
                                    className="px-6 py-2 mb-1 mr-1 text-sm font-bold text-red-500 uppercase outline-none background-transparent focus:outline-none"
                                    type="button"
                                    style={{ transition: 'all .15s ease' }}
                                    onClick={cancelDeposit}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase bg-green-500 rounded shadow outline-none active:bg-green-600 hover:shadow-lg focus:outline-none"
                                    type="submit"
                                    style={{ transition: 'all .15s ease' }}
                                    onClick={deposit}
                                >
                                    Deposit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
            </>
        );
    }

    return (
        <>
            {modal}
            {/*  Navbar */}
            <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-5 bg-gray-300">
                {/* Logo & title */}
                <div className="flex items-center">
                    <Link to="/">
                        <img
                            className="w-10 h-10 mr-2"
                            src={BankLogo}
                            alt="Bank Logo"
                        />
                    </Link>
                    <span className="hidden text-lg font-semibold lg:block">
                        <Link to="/">Gras-Pay</Link>
                    </span>
                </div>

                {/* Auth Button */}
                <div className="flex">
                    {!loading &&
                        (authenticated ? (
                            <>
                                <h1 className="mr-4">
                                    Welcome {user?.username}
                                </h1>
                                <button
                                    type="button"
                                    className="hidden w-20 py-1 mr-4 leading-5 sm:block lg:w-32 hollow blue button"
                                    onClick={logout}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="hidden w-20 py-1 mr-4 leading-5 sm:block lg:w-32 hollow blue button"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="hidden w-20 py-1 leading-5 sm:block lg:w-32 blue button"
                                >
                                    Signup
                                </Link>
                            </>
                        ))}
                </div>
            </div>
            {/*  Content */}
            <div className="container flex justify-between pt-20">
                {/* leftSide => Balance & add Balance */}
                <div className="block w-80">
                    <div className="bg-gray-400 rounded">
                        <div className="p-4 border-b-2">
                            <p className="text-lg font-semibold text-center">
                                Current Balance: {user?.balance}
                            </p>
                        </div>
                    </div>
                    <InputGroup
                        classname="mb-1"
                        placeholder="Amount"
                        type="number"
                        value={amount}
                        setValue={setAmount}
                        error={errors.amount}
                    />
                    <button
                        type="button"
                        className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded hover:bg-blue-700"
                        onClick={addBalance}
                    >
                        add balance
                    </button>
                </div>

                {/* RightSide => Logs */}
                <LogSideBar />
            </div>
        </>
    );
};
export default Home;
