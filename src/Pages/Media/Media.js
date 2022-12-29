import { useQuery } from '@tanstack/react-query';
import React from 'react';
import Post from './Post';

const Media = () => {
    const { data: posts = [], refetch } = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            const res = await fetch('http://localhost:5000/posts');
            const data = await res.json();
            return data;
        }
    })


    return (
        <div className='media_container py-10'>
            {
                posts && posts.reverse().map(post => <Post
                    post={post}
                    key={post._id}
                ></Post>)
            }
        </div>
    );
};

export default Media;