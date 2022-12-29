import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../../../Contexts/AuthProvider/AuthProvider';

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);

    const handleLogOut = () => {
        logOut()
            .then(() => { })
            .catch(err => console.error(err))
    }

    const menuItems = <>
        <li><Link to='/media'>Media</Link></li>
        <li><Link>Message</Link></li>
        <li><Link>About</Link></li>
        {
            user?.uid ?
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img src={user.photoURL} alt='' />
                        </div>
                    </label>
                    <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                        <div className='text-center mb-3 pb-3' style={{ borderBottom: "1px solid #e6e4e4" }}>
                            <h5 className='font-bold'>{user.displayName}</h5>
                            <span>{user.email}</span>
                        </div>
                        <li><Link onClick={handleLogOut}>Logout</Link></li>
                    </ul>
                </div>
                :
                <li><Link to='/login'>Login</Link></li>
        }
    </>

    return (
        <div className="custom_container pt-11">
            <nav className="navbar bg-slate-200 rounded-2xl ">
                <div className="navbar">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </label>
                        <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                            {menuItems}
                        </ul>
                    </div>
                    <Link className="normal-case text-xl font-bold"> <img className="mr-3 h-8" src="https://i.ibb.co/HP3kdcP/pngwing-com.png" alt="" /> Tek Tek</Link>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {menuItems}
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;