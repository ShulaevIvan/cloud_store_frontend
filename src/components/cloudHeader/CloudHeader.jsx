import React from "react";
import { useLocation } from 'react-router-dom';

const CloudHeader = () => {
    let location = useLocation();
    if (location.pathname !== '/') {
        return (
            <header className="cloud-header">
                <div className="cloud-header-wrap">
                    <div className="cloud-header-user-info">
                        username
                    </div>
                </div>

            </header>
        );
    }
};

export default CloudHeader;