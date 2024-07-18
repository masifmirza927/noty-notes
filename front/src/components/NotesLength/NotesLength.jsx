import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const NotesLength = () => {
    const ctx = useContext(AuthContext);
  return (
    <h5>My Notes ( {ctx.notes.length} notes )</h5>
  )
}

export default NotesLength