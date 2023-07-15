import React from "react";
import { useState, useEffect } from "react";

const AdminPanel = (props) => {
    const initialState = { users: []};
    const userData = props.userData
    const [otherUsers, setOtherUsers] = useState(initialState);


    useEffect(() => {
        const fetchFunc = async () => {
            fetch('http://localhost:8000/api/usersdetail/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => response.json())
            .then((data) => {
                setOtherUsers(prevState => ({
                    ...prevState,
                    users: [...data.users].filter((user) => user.id !== userData.user.id),
                }));
            })
        }
        fetchFunc()
    }, [])

    return (
        <React.Fragment>
            <div className="admin-panel-wrap">
                <div className="admin-panel-title">
                    <h2>Admin-Panel</h2>
                </div>
                {otherUsers.users.map((item) => {
                    return (
                        <div className="admin-other-users-wrap">
                            <div className="admin-other-users-item-wrap">
                                <div className="admin-other-users-item-name">{item.username}</div>
                                <div className="admin-other-users-item-email">{item.email}</div>
                                <div className="admin-other-users-item-access-level">{item.is_staff ? 'access admin': 'access user'}</div>
                                <div className="admin-other-users-item-files-count">9 files</div>
                                <div className="admin-other-users-item-memory-usage">Memory usage: 0mb</div>
                            <div className="admin-other-users-item-control-wrap">
                                <a href="#">To user panel</a>
                            </div>
                            </div>
                        </div>
                    );
                })}
                
            </div>
        </React.Fragment>
    );
};

export default AdminPanel;