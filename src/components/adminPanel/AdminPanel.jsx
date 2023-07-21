import React from "react";
import { useState, useEffect } from "react";
import UserFilesAdminPopup from "../userFilesAdminPopup/UserFilesAdminPopup";

const AdminPanel = (props) => {
    const initialState = { users: []};
    const userData = props.userData
    const [otherUsers, setOtherUsers] = useState(initialState);
    const [userFilesPanel, setUserFilesPanel] = useState({
        activePanel: false,
        targetUserId: undefined,
        targetUserFiles: [],
    });

    const removeUserHandler = (targetUserId) => {
        const fetchFunc = async () => {
            await fetch('http://localhost:8000/api/user/control/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({user: userData.user.id, target_user: targetUserId, action: 'DELETE'}),
            })
            .then((response) => response.json())
            .then((data) => {
                setOtherUsers(prevState => ({
                    ...prevState,
                    users: prevState.users = prevState.users.filter((item) => item.name !== data.username && item.id !== data.user_id)
                }));
            })
        }
        fetchFunc();
    };

    const addAdminHandler = (targetUserId) => {
        const fetchFunc = async () => {
            await fetch('http://localhost:8000/api/user/control/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({user: userData.user.id, target_user: targetUserId, action: 'TOADMIN'}),
            })
        }
        fetchFunc();
    };

    const removeAdminHandler = (targetUserId) => {
        const fetchFunc = async () => {
            await fetch ('http://localhost:8000/api/user/control/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({user: userData.user.id, target_user:  targetUserId, action: 'TOUSER'}),
            });
        }
        fetchFunc();
    };

    const userFilesAdminPopupHandler = (targetUserId) => {
        const fetchFunc = async () => {
            await fetch(`http://localhost:8000/api/users/files/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({user: targetUserId})
            })
            .then((response) => response.json())
            .then((data) => {
                setUserFilesPanel(prevState => ({
                    ...prevState,
                    targetUserId: prevState.targetUserId = targetUserId,
                    targetUserFiles: prevState.targetUserFiles = data,
                    activePanel: prevState.activePanel = true
                }));
            });
        }
        fetchFunc();
    };

    const userFilesAdminPopupCloseHandler = () => {
        setUserFilesPanel(prevState => ({
            ...prevState,
            activePanel: prevState.activePanel = false
        }));
    }




    // useEffect(() => {
    //     const fetchFunc = async () => {
    //         fetch('http://localhost:8000/api/usersdetail/', {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         })
    //         .then((response) => response.json())
    //         .then((data) => {
    //             setOtherUsers(prevState => ({
    //                 ...prevState,
    //                 users: [...data.users].filter((user) => user.id !== userData.user.id),
    //             }));
    //         })
    //     }
    //     fetchFunc()
    // }, []);

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
    }, [userFilesPanel.activePanel])



    return (
        <React.Fragment>
            <div className="admin-panel-wrap">
                <div className="admin-panel-title">
                    <h2>Admin-Panel</h2>
                </div>
                <div className="admin-other-users-wrap">
                {userFilesPanel.activePanel ? 
                    <UserFilesAdminPopup
                        targetUser = {userFilesPanel.targetUserId} 
                        closePopupHandler = {userFilesAdminPopupCloseHandler} 
                        userFiles = {userFilesPanel.targetUserFiles} /> : null}
                {otherUsers.users.map((item) => {
                    return (
                        <React.Fragment key={Math.random()}>
                            <div className="admin-other-users-item-wrap">
                                <div className="admin-other-users-item-controls-wrap">
                                    <div className="admin-other-users-item-controls-addadmin-btn-wrap">
                                        <span 
                                            className={item.is_staff ? 'admin-users-deactive-admin-btn' : 'admin-users-active-admin-btn'}
                                            onClick={() => item.is_staff ? removeAdminHandler(item.id) : addAdminHandler(item.id)}
                                        ></span>
                                    </div>
                                    <div className="admin-other-users-item-controls-remove-btn-wrap">
                                        <span className="admin-users-remove-btn" onClick={() => removeUserHandler(item.id)}></span>
                                    </div>
                            </div>
                                <div className="admin-other-users-item-name">{item.username}</div>
                                <div className="admin-other-users-item-email">{item.email}</div>
                                <div className="admin-other-users-item-access-level">{item.is_staff ? 'role: admin': 'role: user'}</div>
                                <div className="admin-other-users-item-files-count">{item.files_count} files</div>
                                <div className="admin-other-users-item-memory-usage">Memory usage: {(Number(item.files_size) / 1024 / 1024).toFixed()}mb</div>
                                <div className="admin-other-users-item-control-wrap">
                                    <button onClick={() => userFilesAdminPopupHandler(item.id)}>Manage user files</button>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
                </div>
                
            </div>
        </React.Fragment>
    );
};

export default AdminPanel;