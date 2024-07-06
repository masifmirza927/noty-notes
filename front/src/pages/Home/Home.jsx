import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'        
import Topbar from '../../components/Topbar/Topbar'
import Main from '../../components/Main/Main'
import NewNote from '../../components/NewNote/NewNote'
const Home = () => {
  return (
    <div className='home'>
      <Sidebar />
      <Main />
      <NewNote />
    </div>
  )
}

export default Home