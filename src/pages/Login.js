import { useState, useContext } from "react"
import { Navigate } from "react-router-dom"
import { UserContext } from "../userContext";

export default function Login(){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext)

    const login = async (e) => {
        try {
            console.log("Inside login")
            e.preventDefault();
            const res = await fetch("http://localhost:4000/login", {
                method: "POST",
                body: JSON.stringify({username, password}),
                headers: {'Content-Type' : 'application/json'},
                credentials: "include"
            })
            if(res.status === 300){
                res.json().then((data) => {
                    setUserInfo(data);
                    setRedirect(true);
                })
            } else {
                alert("Worng credentials");
            }
        } catch (error) {
            alert("Failed to login :(");
        }
    }
    if(redirect){
        return <Navigate to="/" />
    }
    return (
        <form className="form" onSubmit={login}>
            <p>Login</p>
            <input type="text" placeholder="username" value={username} onChange={ e => setUsername(e.target.value) } />
            <input type="text" placeholder="password" value={password} onChange={ e => setPassword(e.target.value) } />
            <button>Login</button>
        </form>
    )
}