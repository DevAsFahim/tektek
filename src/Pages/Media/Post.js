import React from 'react';
import { FaEllipsisV, FaRegEdit, FaRegHeart } from "react-icons/fa";

const Post = ({ post }) => {
    const { userImg, message, likeCount, postImage, userEmail, userName } = post;
    console.log(post);
    return (
        <div className='post'>
            <div className="post_top">
                <div className="flex items-center space-x-4">
                    <img className="w-10 h-10 rounded-full" src={userImg} alt="" />
                    <div className="font-medium">
                        <div>{userName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{userEmail}</div>
                    </div>
                </div>
                <div className='cursor-pointer h-[35px] w-[35px] rounded-full hover:bg-slate-100 p-2'>
                    <FaEllipsisV ></FaEllipsisV>
                </div>
            </div>
            <div className="post_body py-3">
                <div className="post_img">
                    <img src={postImage} alt="" />
                </div>
                <p className='pl-2 py-5'>{message}</p>
            </div>
            <div className="post_bottom flex justify-between items-center">
                <button className='btn btn-ghost flex items-center'>
                    <FaRegHeart className='mr-2'></FaRegHeart>
                    Like
                </button>
                <button className='btn btn-ghost flex items-center'>
                    <FaRegEdit className='mr-2'></FaRegEdit>
                    Edit
                </button>
            </div>
        </div>
    );
};

export default Post;