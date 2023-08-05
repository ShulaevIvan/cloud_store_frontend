import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const ShareWindow = (props) => {

    const copyHandler = (link) => {
        navigator.clipboard.writeText(link);
    };

    return (
        <div className="share-file-window-wrap">
            <span className="share-file-window-close-btn" onClick={props.closeHandler}></span>
            <span className="share-file-window-copy-btn"></span>
            <div className="share-file-window-container">
                <div className="share-file-link-wrap">
                    <p>{props.fileLink} <Link onClick={() => copyHandler(props.fileLink)} className="share-copy-link">copy link</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShareWindow;