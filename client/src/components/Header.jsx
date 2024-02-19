import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className='bg-slate-200 shadow-md flex justify-between items-center'>
        <Link to='/'>
                <h1 className='font-bold text-sm sm:text-4xl flex flex-wrap mx-5'>
                    <span className='text-slate-500'>Penguin</span>
                    <span className='text-slate-700'>Estates</span>
                </h1>
            </Link>
        <div className='flex justify-between items-center max-w-6xl p-3 mx-5'>
            <form className='bg-slate-100 p-3 rounded-lg flex items-center mx-5'>
                <input type="text" placeholder="Search..." className='bg-transparent focus:outline-none w-24 sm:w-64'/>
                <FaSearch className='text-slate-600'/>
            </form>
            <ul className='flex gap-4 sm:text-xl'>
                <Link to='/'>
                <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
                </Link>
                <Link to='/about'>
                <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
                </Link>
                <Link to='sign-in'>
                <li className='text-slate-700 hover:underline'>Sign in</li>
                </Link>
            </ul>
        </div>
    </header>
  )
}

export default Header