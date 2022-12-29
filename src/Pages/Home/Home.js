import React, { useContext } from 'react';
import './style.css';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { AuthContext } from '../../Contexts/AuthProvider/AuthProvider';
import { useQuery } from '@tanstack/react-query';

const Home = () => {
    const { register, handleSubmit, reset } = useForm();
    const imageHostKey = process.env.REACT_APP_imgbb_key;
    const { user } = useContext(AuthContext)

    // const { data: posts = [], refetch } = useQuery({
    //     queryKey: ['posts'],
    //     queryFn: async () => {
    //         const res = await fetch('http://localhost:5000/posts');
    //         const data = await res.json();
    //         return data;
    //     }
    // })

    const handleCreatePost = (data) => {
        const image = data.image[0]
        const formData = new FormData();
        formData.append('image', image)
        const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`
        fetch(url, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(imgData => {
                const post = {
                    message: data.message,
                    postImage: imgData.data.url,
                    userImg: user.photoURL,
                    userEmail: user.email,
                    userName: user.displayName,
                    likeCount: 0
                }
                fetch("http://localhost:5000/posts", {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(post)
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.acknowledged) {
                            toast.success("Post added successfully")
                            console.log(data);
                            reset();
                        } else {
                            toast.error("Something went wrong")
                        }
                    })
            })
    }

    return (
        <main className='custom_container py-10'>
            <div className="main_container">
                <aside className='post_form bg-slate-200 rounded-2xl'>
                    <form onSubmit={handleSubmit(handleCreatePost)}>

                        <textarea {...register("message", { required: true })} className="textarea textarea-bordered w-full h-28" placeholder="Write your post"></textarea>

                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-slate-300">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input {...register("image", { required: true })} id="dropzone-file" type="file" className="hidden" />
                            </label>
                        </div>

                        <button className="btn btn-primary w-full mt-6">Submit</button>

                    </form>
                </aside>
                <section className='posts'>
                    posts
                </section>
            </div>
        </main>
    );
};

export default Home;