// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { AiOutlineMail, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLock } from 'react-icons/ai'; // Importing icons
import { FaSpinner } from 'react-icons/fa';

const LoginPage = () => {
    const router = useRouter();
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setLoginData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when the process starts

        // Simulate the login process here, including error handling and loading state management.
        // This example doesn't integrate with a real backend service.
        setTimeout(() => { // Just to simulate an async request
            setLoading(false); // Turn off the loading indication
            if (loginData.email === 'user@example.com' && loginData.password === 'password') {
                router.push('/');
            } else {
                setError('Invalid login credentials. Please try again.');
            }
        }, 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-emerald-50 py-12 px-4 sm:px-6 lg:px-8"> {/* using emerald theme */}
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {error}</span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                <svg className="fill-current h-6 w-6 text-red-500" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <title>Close</title>
                                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 0 1 1.697 0c.461.486.461 1.211 0 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                                </svg>
                            </span>
                        </div>
                    )}

                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4 relative">
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <AiOutlineMail className="absolute top-3 left-3 text-emerald-500" size="1.25em" /> {/* Email icon */}
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                placeholder="Email address"
                                value={loginData.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-4 relative">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <AiOutlineLock className="absolute top-3 left-3 text-emerald-500" size="1.25em" /> {/* Password icon */}
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"} // Toggle between "text" and "password"
                                autoComplete="current-password"
                                required
                                className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                placeholder="Password"
                                value={loginData.password}
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                onClick={handlePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                                {showPassword ? (
                                    <AiOutlineEyeInvisible className="text-emerald-500" size="1.25em" /> // Icon when the password is visible
                                ) : (
                                    <AiOutlineEye className="text-emerald-500" size="1.25em" /> // Icon when the password is hidden
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>
                        <div className="text-sm">
                            <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
                                Forgot your password?
                            </a>
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                {/* Display spinner during loading */}
                                {loading ? <FaSpinner className="h-5 w-5 text-white animate-spin" /> : null}
                            </span>
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
