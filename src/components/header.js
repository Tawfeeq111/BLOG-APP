import { Link } from "react-router-dom"
import { useContext, useEffect } from "react"
import {UserContext} from "../userContext"

export default function Header() {

  const { userInfo, setUserInfo } = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include"
    }).then((res) => {
      res.json().then((userInfo) => {
        setUserInfo(userInfo);
      })
    })
  }, [])

  const logout = async () => {
    await fetch("http://localhost:4000/logout", {
      method: "POST",
      credentials: "include"
    })
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo" >MyBlog</Link>
      <nav>
      {username && (
          <>
            <Link to="/create">Create new post</Link>
            <a className="logout" onClick={logout}>Logout ({username})</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

      </nav>
    </header>
  )
}