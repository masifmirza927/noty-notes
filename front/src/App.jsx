import { useState } from 'react'
import './App.css'
import {Routes, Route} from "react-router-dom";

import Home from "./pages/Home/Home";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Routes>
          <Route path='/' index element={<Home />} />
        </Routes>
    </>
  )
}

export default App
