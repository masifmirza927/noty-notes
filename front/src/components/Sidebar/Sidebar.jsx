import React, { useContext } from 'react'
import { Link } from "react-router-dom";
import {House, PencilLine, Pin, LogOut, Archive, User} from "lucide-react";
import { AuthContext } from '../../context/AuthContext';

const Sidebar = () => {
  const ctx = useContext(AuthContext);
  return (
    <div className='sidebar'>
      <div className='sidebar-logo'>
        <span>Noty</span>
      </div>
      <ul>
        <li>
          <Link className='sidebar-link' to='/'>
            <House size={22} color='black' />
          </Link>
        </li>
        <li>
          <Link className='sidebar-link' to='/profile'>
            <User size={22} color='black' />
          </Link>
        </li>
        <li>
          <Link className='sidebar-link' to='/'>
            <PencilLine size={22} color='black' />
          </Link>
        </li>
        <li>
          <Link className='sidebar-link' to='/pines'>
            <Pin size={22} color='black' />
          </Link>
        </li>
        <li>
          <Link className='sidebar-link' to='/'>
            <Archive size={22} color='black' />
          </Link>
        </li>
        <li>
          <Link className='sidebar-link' to='/'>
            <LogOut size={22} color='black' onClick={ () => ctx.logout()} />
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar