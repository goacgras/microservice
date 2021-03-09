import BankLogo from '../images/Bank.svg';
import { Link, useHistory } from 'react-router-dom';
import { useAuthDispatch, useAuthState } from '../context/auth';
import axios from 'axios';

// interface HomeProps {}

export const Home: React.FC = () => {
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

    return (
        <>
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
                                Current Balance: 5000
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded hover:bg-blue-700"
                    >
                        add balance
                    </button>
                </div>

                {/* RightSide => Logs */}
                <div className="block ml-2 w-160">
                    <div className="bg-gray-400 rounded">
                        <div className="p-4 border-b-2">
                            <p className="text-lg font-semibold text-center">
                                Logs
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
