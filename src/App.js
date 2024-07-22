import './App.css';
import Layout from './components/layout';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import IndexPage from './pages/Index';
import PostPage from './pages/postPage';
import {UserContextProvider, UserContext} from "./userContext"
import { useState } from 'react';
import { CreatePost } from './pages/createPost';
import EditPost from './pages/EditPost';

function App() {
  const [userInfo,setUserInfo] = useState({});
  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
