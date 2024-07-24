
import React from 'react'
import NewNote from '../NewNote/NewNote'
import Sidebar from '../Sidebar/Sidebar'

const MainLahout = ({ children }) => {
    return (
        <>
            <Sidebar />
            {children}
            <NewNote />
        </>
    )
}

export default MainLahout