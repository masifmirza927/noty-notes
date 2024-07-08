import { useState } from 'react'
import './App.css'
import {Routes, Route} from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from './pages/login/Login';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Routes>
          <Route path='/' index element={<Home />} />
          <Route path='/login' element={<Login />} />
        </Routes>
    </>
  )
}

export default App
