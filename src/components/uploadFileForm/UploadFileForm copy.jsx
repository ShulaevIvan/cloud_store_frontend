import React from "react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserFiles } from "../../redux/slices/userSlice";

const UploadFileFrom = () => {
    const user = useSelector((state) => state.user.userData.user);
    const dispatch = useDispatch();
    const initialState = {
        filesInput: useRef(null),
        userFiles: [],
    };
    const [uploadFormState, setUploadFormState] = useState(initialState);
    const [uploadBtnState, setUploadBtnState] = useState({ uploadBtnActive: false });

    const uploadStartHandler = () => {
        setUploadBtnState(prevState => ({
            uploadBtnActive: prevState.uploadBtnActive = true,
        }));
    };
    
    const uploadFileCancelBtn = () => {
        setUploadBtnState(prevState => ({
            uploadBtnActive: prevState.uploadBtnActive = false,
        }));
    };

    const getBase64 = async (data) => {
        const files = data[0]
        return new Promise((resolve, reject) => {
            let fileData = {};
            const reader = new FileReader();
            const url = URL.createObjectURL(files)
            reader.readAsDataURL(files);
            reader.onloadend = () => {
                fileData = {
                    id: Math.random(),
                    url: url,
                    lastModif: files.lastModified,
                    lastModifDate: files.lastModifiedDate,
                    type: files.type,
                    name: files.name,
                    file: reader.result,
                    date: new Date().getTime(),
                };
                resolve(fileData);
                uploadFormState.filesInput.current.value = '';
            };
            
        })
        .then((data) => {
            dispatch(addUserFiles(JSON.stringify(data)));
            const fetchFunc = async () => {
                const sendImageToUser = {
                    file_name: data.name,
                    file_type: data.type,
                    file_data: data.file,
                    file_url: data.url,
                    user: user.id,
                }
                await fetch('http://localhost:8000/api/users/user_files/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sendImageToUser),
                });
            };
            fetchFunc();
        })
    }

    const uploadFileHandler = async () => {
        const files = uploadFormState.filesInput.current.files;
        if (files.length > 1) {
            return;
        }
        await getBase64(files);
    }


    return (
        <React.Fragment>
            <div className="upload-btn-wrap">
                {!uploadBtnState.uploadBtnActive ?  <Link onClick={uploadStartHandler}>Upload</Link> : null}
                {uploadBtnState.uploadBtnActive ? 
                    <div className="upload-file-form-wrap">
                        <div className="upload-file-input-wrap">
                            <input type="file" ref={uploadFormState.filesInput} onChange={uploadFileHandler} />
                        </div>
                    <div className="comment-file-input-wrap">
                        <textarea placeholder="comment..."/>
                    </div>
                    <div className="upload-file-form-controls">
                        <div className="upload-file-form-btn-ok">
                            <button>OK</button>
                        </div>
                        <div className="upload-file-form-btn-cancel">
                            <button onClick={uploadFileCancelBtn}>Cancel</button>
                        </div>
                    </div>
                </div> : null}
            </div>
        </React.Fragment>
    );
};

export default UploadFileFrom;