import React, { useContext } from 'react'
import NoteCard from '../NoteCard/NoteCard'
import { AuthContext } from '../../context/AuthContext'
import NotesLength from '../NotesLength/NotesLength';

const Notes = () => {
    const ctx = useContext(AuthContext);

    return (
        <div className='notes'>
            <NotesLength />
            <div className='notes-cards'>
                {
                    ctx.notes.length > 0 && ctx.notes.map((note, index) => {
                        return <NoteCard note={note} />
                    })
                }
            </div>

        </div>
    )
}

export default Notes