import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/userSlice";

const HeaderMenu = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.g)
    const initialState = {
        menuActive: false,
    };
    
    const [menuState, setMenuState] = useState(initialState);

    const menuHandler = () => {
        if (!menuState.menuActive) {
            setMenuState(prevState => ({
                ...prevState,
                menuActive: prevState.menuActive = true,
            }));
            return;
        }
        setMenuState(prevState => ({
            ...prevState,
            menuActive:  prevState.menuActive = false,
        }));
    };

    const logoutHandler = () => {
        dispatch(logoutUser());
        setTimeout(() => {
            navigate('/');
        }, 10);
    };

    return (
        <div className='cloud-header-menu'>
            <span className="user-menu-btn" onClick={menuHandler}></span>
            <ul className={
                menuState.menuActive ? 'user-menu-header user-menu-active' : 'user-menu-header user-menu-hidden'
                }
            >
                <li><Link>MyFiels</Link></li>
                <li><Link onClick={logoutHandler}>Logout</Link></li>
            </ul>
    </div>
    );
};

export default HeaderMenu;