import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from './pages/login/Login';
import  {AuthProvider}  from './context/AuthContext';
import Profile from './pages/Profile/Profile';
import Pinned from './pages/Pinned/Pinned';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path='/' index element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/pines' element={<Pinned />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </AuthProvider>

    </>
  )
}

export default App
