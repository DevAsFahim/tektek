import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Contexts/AuthProvider/AuthProvider';

const Login = () => {
    const { loginWithGoogle, createUser, updateUserProfile, userLogIn } = useContext(AuthContext)
    const [isSignUp, setIsSignUp] = useState(false);
    const { register, handleSubmit } = useForm();
    const imageHostKey = process.env.REACT_APP_imgbb_key;
    const navigate = useNavigate()

    const handleLogin = (data) => {

        if (isSignUp) {
            const image = data.userImage[0]
            const formData = new FormData();
            formData.append('image', image)
            const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`
            fetch(url, {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(imgData => {
                    createUser(data.email, data.password)
                        .then((userCredential) => {
                            const createdUser = userCredential.user;
                            console.log(createdUser);
                            handleUpdateUserProfile(data.name, imgData.data.url);
                            // save users to the database
                            const user = {
                                name: data.name,
                                email: data.email,
                                img: imgData.data.url
                            }
                            fetch('http://localhost:5000/users', {
                                method: 'POST',
                                headers: {
                                    'content-type': 'application/json'
                                },
                                body: JSON.stringify(user)
                            })
                                .then(res => res.json())
                                .then(data => {
                                    if (data.acknowledged) {
                                        // setCreatedUserEmail(user.email)
                                        toast.success('Successfully account created')
                                        navigate('/')
                                        // setIsConnectLoading(false)
                                    }
                                })
                        })
                        .catch((error) => {
                            toast.error(error.message)
                        });
                })
        }
        else {
            userLogIn(data.email, data.password)
                .then((result) => {
                    const user = result.user;
                    console.log(user);
                    toast.success('Logged in successfully')
                    navigate('/')
                })
                .catch((error) => {
                    toast.error(error.message)
                });
        }

    }

    const handleUpdateUserProfile = (name, photoURL) => {
        const profile = {
            displayName: name,
            photoURL: photoURL
        }
        updateUserProfile(profile)
            .then(() => { })
            .catch(error => console.error(error))
    }

    const handleLoginWithGoogle = () => {
        loginWithGoogle()
            .then((result) => {
                const loggedUser = result.user;
                const user = {
                    name: loggedUser.displayName,
                    email: loggedUser.email,
                    img: loggedUser.photoURL
                }
                fetch('http://localhost:5000/users', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(user)
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.acknowledged) {
                            navigate("/")
                            toast.success('Successfully logged in with google')
                        }
                    })
            })
            .catch((err) => {
                console.error(err);
            })
    }

    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto my-10 lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                            {
                                isSignUp ? "Create an account" : "Log in to your account"
                            }
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(handleLogin)}>

                            {
                                isSignUp &&
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">Your name</label>
                                    <input {...register("name", { required: true })} type="text" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:border-blue-500" required="" />
                                </div>
                            }

                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Your email</label>
                                <input {...register("email", { required: true })} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:border-blue-500" placeholder="example@example.com" required="" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                                <input {...register("password", { required: true })} type="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:border-blue-500" required="" />
                            </div>

                            {
                                isSignUp &&
                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="signupImg" className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-slate-300">
                                        Upload your image
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                        </div>
                                        <input {...register("userImage", { required: true })} id="signupImg" type="file" className="hidden" />
                                    </label>
                                </div>
                            }

                            <button type="submit"
                                className="w-full bg-primary focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                {isSignUp ? "Sign Up" : "Log in"}
                            </button>
                            {
                                !isSignUp &&
                                <>
                                    <div className="divider">OR</div>


                                    <button onClick={handleLoginWithGoogle} type="button" className="text-white w-full text-center bg-[#4285F4] hover:bg-[#4285F4]/90 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2">
                                        <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                                        Sign in with Google
                                    </button>
                                </>
                            }

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Don't have an account yet? <Link onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;