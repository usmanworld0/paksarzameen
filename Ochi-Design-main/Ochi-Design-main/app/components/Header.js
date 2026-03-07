import React, { useContext } from 'react'
import Navigation from './Navigation'
import { MyContext } from '@/Helper/Context'
const Header = (props) => {
const user= useContext(MyContext)
  return (
    <div className="flex justify-evenly">
      This is the header
      {user}
    </div>
  )
}

export default Header
