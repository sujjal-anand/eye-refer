import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const App:React.FC = () => {
  return (
    <div>
        <Navbar/>
        <Sidebar/>
        <Outlet/>
    </div>
  )
}

export default App