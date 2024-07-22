import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import { UserContext } from "../userContext";

export default function PostPage() {
    const id = useParams().id;
    const [postInfo, setPostInfo] = useState(null);
    const { userInfo } = useContext(UserContext);

    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
            .then((res) => {
                res.json().then((data) => { setPostInfo(data) });
            })
    }, []);

    if (!postInfo) return '';
    return (
        <>
            <h1 className="postPage-h1">{postInfo.title}</h1>
            <div className="info">
                <time>{formatISO9075(new Date(postInfo.createdAt))}</time><br />
                <Link to="#" className="author">by @{postInfo?.author?.username} </Link>
            </div>
            {userInfo._id == postInfo.author._id &&
                <Link className="edit" to={`/edit/${postInfo._id}`}>
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        Edit
                    </button>
                </Link>
            }
            <div className="postPage-img">
                <img src={`http://localhost:4000/${postInfo.cover}`} alt="img" />
            </div>
            <div className="postPage-p" dangerouslySetInnerHTML={{ __html: postInfo.content }} />
        </>
    );
}