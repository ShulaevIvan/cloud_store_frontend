import React from "react";
import { useState, useEffect, useRef } from "react";
import UploadFileFrom from "../uploadFileForm/UploadFileForm";

const UserFilesAdminPopup = (props) => {
    const initialState = {
        renameInputActive: false,
        renameInputRef: useRef(null),
        renameCommentRef: useRef(null),
        userFiles: [...props.userFiles],
    };

    const [userFilesAdmin, setUserFilesAdmin] = useState(initialState)

    const rmUserFileHandler = (userId, fileId) => {
        const fetchFunc = async () => {
            await fetch('http://localhost:8000/api/users/user_files/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({user: userId, id: fileId})
            })
            .then((response) => response.json())
            .then((data) => {
                setUserFilesAdmin(prevState => ({
                    ...prevState,
                    userFiles: prevState.userFiles = [...data]
                }));
            });
        }
        fetchFunc();
    };

    const renameFileHandler = () => {
        setUserFilesAdmin(prevState => ({
            ...prevState,
            renameInputActive: prevState.renameInputActive = true,
        }));
    };

    const renameFileCancelHandler = () => {
        setUserFilesAdmin(prevState => ({
            ...prevState,
            renameInputActive: prevState.renameInputActive = false,
        }));
        userFilesAdmin.renameCommentRef.current.value = '';
        userFilesAdmin.renameInputRef.current.value = '';
    };

    const renameFileOkHandler = (fileData) => {
        const fetchFunc = async () => {
            await fetch(`http://localhost:8000/api/users/user_files/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: fileData.user_id,
                    rename_id: fileData.file_uid,
                    file_name: userFilesAdmin.renameInputRef.current.value,
                    file_comment: userFilesAdmin.renameCommentRef.current.value,
                }),
            })
            .then((response) => response.json())
            .then((data) => {
                setUserFilesAdmin(prevState => ({
                    ...prevState,
                    renameInputActive: prevState.renameInputActive = false,
                    userFiles: prevState.userFiles = [...prevState.userFiles.filter((item) => item.file_uid !== fileData.file_uid), data]
                }));
                
                userFilesAdmin.renameInputRef.current.value = '';
                userFilesAdmin.renameCommentRef.current.value = '';
            })
        }
        fetchFunc()
        
    };

    const downloadFileHandler = (id) => {
        const fetchFunc = async () => {
            await fetch(`http://localhost:8000/api/users/user_files/?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        };
        fetchFunc();
    };

    useEffect(() => {
        console.log(userFilesAdmin.userFiles)

    }, []);


    return (
        <React.Fragment>
            <div className="admin-user-files-panel-popup-wrap">
                <span className="admin-user-files-popup-close" onClick={props.closePopupHandler}></span>
                {<UploadFileFrom targetUser = {props.targetUser ? props.targetUser : null} userAdminState = {userFilesAdmin.userFiles} setUserAdminState = {setUserFilesAdmin} />}
                <div className="admin-user-files-panel-body">
                    {userFilesAdmin.userFiles.map((fileObj) => {
                        return (
                            <div className="admin-user-files-item">
                                {userFilesAdmin.renameInputActive ? 
                                    <div className="rename-input-wrap">
                                        <input 
                                            type="text" 
                                            placeholder={`${fileObj.file_name}`} 
                                            ref={userFilesAdmin.renameInputRef}
                                        />
                                        <textarea 
                                            className="rename-comment-input" 
                                            placeholder={fileObj.file_comment}
                                            ref={userFilesAdmin.renameCommentRef} 
                                        />
                                        <button className="rename-input-ok-btn" onClick={() => renameFileOkHandler(fileObj)}>Ok</button>
                                        <button className="rename-input-cancel-btn" onClick={renameFileCancelHandler}>Cancel</button>
                                    </div> : 
                                null }
                                <div className="admin-user-files-control-item">
                                    <a 
                                        className="admin-user-files-control-item-download-btn" 
                                        onClick={() => downloadFileHandler(fileObj.file_uid)} 
                                        href={fileObj.file_url} 
                                        download={fileObj.file_name}  
                                        target="_blank" rel="noreferrer"
                                    ></a>
                                    <span className="admin-user-files-control-item-rename-btn" onClick={() => renameFileHandler()}></span>
                                    <span 
                                        className="admin-user-files-control-item-delete-btn" 
                                        onClick={() => rmUserFileHandler(fileObj.user_id, fileObj.file_uid)}>
                                    </span>
                                </div>
                                <div className="file-info-wrap">
                                    <p>File Name: {fileObj.file_name}</p>
                                    <p>File Type: {fileObj.file_type}</p>
                                    <p>Comment: {fileObj.file_comment}</p>
                                    <p>Created Time: {fileObj.file_created_time}</p>
                                    <p>Last Download Time: {fileObj.file_last_download_time}</p>
                                    <p>File Url: <a href={`${fileObj.file_url}`}>{fileObj.file_url}</a></p>
                                </div>
                            </div>
                        );
                    })}
                    
                </div>
            </div>
        </React.Fragment>
    );
};

export default UserFilesAdminPopup;