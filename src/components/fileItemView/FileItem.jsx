import React from "react";


const FileItem = (props) => {
    const fileTypes = ['image/png', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
    console.log(props)
    return (
        <React.Fragment>
            <div className="cloud-files-item-wrap" key={props.id}>
            {props.renameInput}
                <div className="cloud-item-controls">
                    <span className="cloud-item-share-btn"></span>
                    <span className="cloud-item-download-btn"></span>
                    <span className="cloud-item-rename-btn" onClick={() => props.renameHandler(props.id)}></span>
                    <span className="cloud-item-delete-btn" onClick={() => props.removeHandler(props.id)}></span>
                </div>

                <div className="cloud-item-filename">{props.file_name && props.file_name.length > 15 ? props.file_name.split('').splice(0, 15).join('')+'...' : props.file_name}</div>
                <div className="cloud-item-img">
                    <img src={fileTypes.includes(props.file_type) ? `${props.file_data}` : null} />
                </div>
                <div className="cloud-item-comment">Comment: {props.file_comment}</div>
                <div className="cloud-item-last-download">Last load 01 07 2023</div>
                <div className="cloud-item-date-load">JUL 01 07 2023</div>
            </div>
        </React.Fragment>
    ); 
};

export default FileItem;