import React from "react";
import { useState, useEffect } from "react";
import UploadFileFrom from "../uploadFileForm/UploadFileForm";

const UserFilesAdminPopup = (props) => {
    const rmUserFuleHandler = (userId, fileId) => {
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
                console.log(data)
            });
        }
        fetchFunc();
    };


    return (
        <React.Fragment>
            <div className="admin-user-files-panel-popup-wrap">
                <span className="admin-user-files-popup-close" onClick={props.closePopupHandler}></span>
                {<UploadFileFrom targetUser = {props.targetUser ? props.targetUser : null} />}
                <div className="admin-user-files-panel-body">
                    {props.userFiles.map((fileObj) => {
                        return (
                            <div className="admin-user-files-item">
                                <div className="admin-user-files-control-item">
                                    <span className="admin-user-files-control-item-delete-btn" onClick={() => rmUserFuleHandler(fileObj.user_id, fileObj.file_uid)}></span>
                                    <span className="admin-user-files-control-item-rename-btn"></span>
                                    <span className="admin-user-files-control-item-download-btn"></span>
                                    <span className="admin-user-files-control-item-share-btn"></span>
                                </div>
                                <div className="file-info-wrap">
                                    <p>File Name: {fileObj.file_name}</p>
                                    <p>File Type: {fileObj.file_type}</p>
                                    <p>Comment: {fileObj.file_comment}</p>
                                    <p>Created Time: {fileObj.file_created_time}</p>
                                    <p>Last Download Time: {fileObj.file_last_download_time}</p>
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