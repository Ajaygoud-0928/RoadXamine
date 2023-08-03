import React from 'react'
import { Link } from 'react-router-dom'
import './nav.css';
export default function header() {
    return (
        <div>
            <div className="nav">
                <div className="containers">
                    <nav>
                        <img src="" alt="#" className='logo' />
                        <div className='links'>
                            <Link to="/">Home</Link>
                            <Link to='/view'>View</Link>
                            <Link to="/login">Login</Link>
                            <Link to="/about">About</Link>                            
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    )
}
