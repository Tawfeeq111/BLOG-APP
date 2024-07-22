import { useState } from "react"

export default function Register() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handelSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("http://localhost:4000/register", {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type' : 'application/json'},
        })
        if(res.status !== 200){
            alert("Registration failed :(")
        } else {
            alert("Registrati successful :)")
            console.log(res);
        }
    }

    return (
        <form className="form" onSubmit={handelSubmit}>
        <p>Register</p>
        <input type="text" placeholder="username" value={username} 
            onChange={(e) => { setUsername(e.target.value) }}
        />
        <input type="text" placeholder="password" value={password}
            onChange={(e) => { setPassword(e.target.value) }}
        />
        <button>Register</button>
    </form>
    )
}