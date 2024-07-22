import { useEffect, useState, useContext } from "react";
import { useParams, Navigate } from "react-router-dom";
import { UserContext } from "../userContext";
import ReactQuill from "react-quill";

export default function EditPost() {
    const { id } = useParams();
    const [postInfo, setPostInfo] = useState(null);
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { userInfo } = useContext(UserContext);

    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
            .then((res) => {
                res.json().then((data) => {
                    setPostInfo(data)
                    setTitle(data.title);
                    setContent(data.content)
                    setSummary(data.summary);
                }
                );
            })
    }, []);

    const handelEdit = async (e) => {
        try {
            e.preventDefault();
            const data = new FormData();
            data.set('title', title);
            data.set('summary', summary);
            data.set('content', content);
            if (files?.[0]) {
                data.set('file', files[0]);
            }
            const res = await fetch(`http://localhost:4000/post/${id}`, {
                method: "PUT",
                body: data,
                credentials: "include"
            })
            if (res.status === 200) {
                setRedirect(true);
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    if (redirect) {
        return <Navigate to="/" />
    }

    return (
        <>
            <form className='createForm' onSubmit={handelEdit}>
                <input type="title" value={title} onChange={e => setTitle(e.target.value)} />
                <input type="summary" value={summary} onChange={e => setSummary(e.target.value)} />
                <input type="file" onChange={e => setFiles(e.target.files)} />
                <ReactQuill theme="snow" value={content} onChange={setContent} />
                <button style={{ marginTop: "7px" }}>Edit post</button>
            </form>
        </>
    );
}