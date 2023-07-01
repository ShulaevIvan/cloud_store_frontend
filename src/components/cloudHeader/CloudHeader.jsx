import React from "react";
import { useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";

const CloudHeader = () => {
    const user = useSelector((state) => state.user);
    let location = useLocation();
    if ((user.userAuthenticated && location !== '/') && location !== '/singup') {
        return (
            <div className="cloud-header">
                <div className="cloud-header-wrap">
                    <div className="cloud-header-search-wrap">
                        <span className="search-header-icon"></span>
                        <input type="text" placeholder="search" />
                    </div>
                    <div className="cloud-header-user-info">
                        <div className="user-avatar-wrap">
                            <img src="#" />
                        </div>
                        <div className="user-info-wrap">
                            <span>userName</span>
                        </div>
                        <div className="cloud-header-menu">
                            <span className="user-menu-btn"></span>
                            {/* <ul className="user-menu-header">
                                <li><a href="#">MyFiels</a></li>
                                <li><a href="#">Logout</a></li>
                            </ul> */}
                        </div>
                    </div>
                </div>

            </div>
        );
    }
};

export default CloudHeader;