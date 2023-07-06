import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeUserFile, renameUserFile } from "../../redux/slices/userSlice";


const FileItem = (props) => {
    const fileTypes = ['image/png', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
    const userData = useSelector((state) => state.user.userData);
    const dispatch = useDispatch();


    const rmFileHandler = () => {
        const fetchFunc = async () => {
            await fetch('http://localhost:8000/api/users/user_files/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({user: userData.user.id, id: props.id})
            })
            .then(() => {
                dispatch(removeUserFile(props.id));
            })
        }
        fetchFunc();
       
    }

    const renameFileHander = (id) => {
        const fetchFunc = async () => {
            await fetch(`http://localhost:8000/api/users/user_files/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({user: userData.user.id, id: id, file_name: 'test'})
            })
            .then((response) => response.json())
            .then((data) => {
                const newFileData = {
                    ...data,
                    file_name: 'test',
                };
                dispatch(renameUserFile(JSON.stringify(newFileData)));
            })
        }
        fetchFunc();
    }


    return (
        <React.Fragment>
            <div className="cloud-files-item-wrap" key={props.id}>
                <div className="cloud-item-controls">
                    <span className="cloud-item-share-btn"></span>
                    <span className="cloud-item-download-btn"></span>
                    <span className="cloud-item-rename-btn" onClick={() => renameFileHander(props.id)}></span>
                    <span className="cloud-item-delete-btn" onClick={rmFileHandler}></span>
                </div>
                <div className="cloud-item-filename">{props.file_name && props.file_name.length > 15 ? props.file_name.split('').splice(0, 15).join('')+'...' : props.file_name}</div>
                <div className="cloud-item-img">
                    <img src={fileTypes.includes(props.file_type) ? `${props.file_data}` : null} />
                </div>
                <div className="cloud-item-comment">Comment</div>
                <div className="cloud-item-last-download">Last load 01 07 2023</div>
                <div className="cloud-item-date-load">JUL 01 07 2023</div>
            </div>
        </React.Fragment>
    ); 
};

export default FileItem;