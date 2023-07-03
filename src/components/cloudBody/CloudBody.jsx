import React from "react";
import UploadFileFrom from "../uploadFileForm/UploadFileForm";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";

const CloudBody = () => {
    const userFiles = useSelector((state) => state.user.userFiels);

    return (
        <div className="cloud-body">
            <div className="cloud-body-wrap">
                <div className="cloud-body-controls-wrap">
                   <UploadFileFrom />
                </div>
                <div className="cloud-body-title-wrap">
                    <h1>Files</h1>
                </div>
                <div className="cloud-body-files-wrap">
                    {userFiles.map((item) => {
                        return (
                            <div className="cloud-files-item-wrap" key={Math.random()}>
                                <div className="cloud-item-controls">
                                    <span className="cloud-item-share-btn"></span>
                                    <span className="cloud-item-download-btn"></span>
                                    <span className="cloud-item-rename-btn"></span>
                                    <span className="cloud-item-delete-btn"></span>
                                </div>
                                <div className="cloud-item-filename">FileName</div>
                                <div className="cloud-item-img">
                                    <img src="https://e.radikal.host/2023/07/01/nophoto.jpg" className="cloud-item-img" />
                                </div>
                                <div className="cloud-item-comment">Comment</div>
                                <div className="cloud-item-last-download">Last load 01 07 2023</div>
                                <div className="cloud-item-date-load">JUL 01 07 2023</div>
                            </div>
                        );
                    })};
                    
                </div>
            </div>
        </div>
    );
};

export default  CloudBody;