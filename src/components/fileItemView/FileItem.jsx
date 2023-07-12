import React from "react";


const FileItem = (props) => {
    const imageTypes = ['image/png', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
    const videoTypes = ['video/mp4', 'video/ogg', 'video/webm'];
    const audioTypes = ['audio/ogg', 'audio/wav', 'audio/mp3', 'audio/mpeg'];
    
    return (
        <React.Fragment>
            <div className="cloud-files-item-wrap" key={props.id}>
            {props.renameInput}
                <div className="cloud-item-controls">
                    <span className="cloud-item-share-btn"></span>
                    <a className="cloud-item-download-btn" href={props.file_data} download={props.file_name}></a>
                    <span className="cloud-item-rename-btn" onClick={() => props.renameHandler(props.file_uid)}></span>
                    <span className="cloud-item-delete-btn" onClick={() => props.removeHandler(props.file_uid)}></span>
                </div>

                <div className="cloud-item-filename">{
                props.file_name && props.file_name.length > 15 ? 
                    props.file_name.split('').splice(0, 15).join('')+'...' : props.file_name
                    }
                </div>
                <div className="cloud-item-img">
                    {imageTypes.includes(props.file_type) ?  <img src={`${props.file_data}`} /> : null }
                    {audioTypes.includes(props.file_type) ? <audio controls src={props.file_data}></audio> : null }
                    {videoTypes.includes(props.file_type) ? 
                    <video width="300" height="300" controls >
                        <source src={props.file_data} type={props.file_type}/>
                    </video> : null}
                    {!imageTypes.includes(props.file_type) && 
                        !audioTypes.includes(props.file_type) && 
                            !videoTypes.includes(props.file_type) ?
                                <img src="https://dummyimage.com/150x150/000/fff&text=FILE" /> : null}
                </div>
                <div className="cloud-item-file-type">{props.file_type}</div>
                <div className="cloud-item-comment">Comment: {props.file_comment}</div>
                <div className="cloud-item-last-download">Last load 01 07 2023</div>
                <div className="cloud-item-date-load">JUL 01 07 2023</div>
            </div>
        </React.Fragment>
    ); 
};

export default FileItem;