import React, { useContext, useState } from 'react'

import { Search } from "lucide-react";
import { AuthContext } from '../../context/AuthContext';
import { httpClient } from '../../lib/httpClient';


const Topbar = () => {
  const ctx = useContext(AuthContext);
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  const currentPageName = location.pathname;

  // search function
  const handleSearch = (e) => {

    let qUrl = `q=${query}`;
    if (currentPageName == '/pines') {
      qUrl += `&isPinned=true`
    }
    if (query.length <= 0) {
      httpClient.get(`/notes/search?${qUrl}`).then((res) => {
        if (res.data.errors == false) {
          ctx.setNotes(res.data.notes);
        } else {
          console.log(res.data.message)
        }
      }).catch(err => console.log(err.message))
        .finally(() => { setLoading(false) })
    }

    if (e.key == "Enter") {
      setLoading(true);
      httpClient.get(`/notes/search?${qUrl}`).then((res) => {
        if (res.data.errors == false) {
          ctx.setNotes(res.data.notes);
        } else {
          console.log(res.data.message)
        }
      }).catch(err => console.log(err.message))
        .finally(() => { setLoading(false) })
    }
  }

  return (
    <div className='topbar'>
      <div className='user-info'>
        <div className='photo'>
          {/* <img src='https://i.pravatar.cc/300' /> */}
          {
            ctx.user?.photo && <img src={ctx.user.photo} width='60px' />
          }

        </div>
        <div className='info'>
          <h5>{ctx.user?.name}</h5>
          <p>{ctx.user?.email}</p>
        </div>
      </div>
      <div className='search-input'>
        <Search color='#707070' className='searchIcon' />
        <input type='search' className='search' onChange={e => setQuery(e.target.value)} onKeyUp={(e) => handleSearch(e)} />
      </div>
    </div>
  )
}

export default Topbar