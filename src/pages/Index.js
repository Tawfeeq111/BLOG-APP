import { useEffect, useState } from "react";
import Post from "../components/post";

export default function IndexPage() {

    const [posts, setPosts] = useState([]);
    useEffect(() => {
        fetch("http://localhost:4000/posts").then((res) => {
            res.json().then((data) => {
                setPosts(data);
            })
        })
    }, [])

    return (
        <>
            {//posts.length > 0 ? 
                posts.map((post, id) => {
                    return <Post key={id} 
                                title={post.title}
                                cover={post.cover}
                                createdAt={post.createdAt}
                                summary={post.summary}
                                content={post.content}
                                author={post.author.username}
                                _id={post._id}
                            />
                })
            // :<></>
            }
        </>
    )
}