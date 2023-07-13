import React from "react";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserFiles } from "../../redux/slices/userSlice";

const UploadFileFrom = () => {
    const user = useSelector((state) => state.user.userData.user);
    const userFiles = useSelector((state) => state.user.userFiels);
    const dispatch = useDispatch();

    const initialState = {
        filesInput: useRef(null),
        commentInputRef: useRef(null),
        userFiles: userFiles,
        preloadData: undefined,
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
                let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
                if ((encoded.length % 4) > 0) {
                    encoded += '='.repeat(4 - (encoded.length % 4));
                }
                fileData = {
                    id: Math.random(),
                    url: url,
                    lastModif: files.lastModified,
                    lastModifDate: files.lastModifiedDate,
                    type: files.type,
                    name: files.name,
                    file: encoded,
                    date: new Date().getTime(),
                };
                resolve(fileData);
                
            };
            
        })
        .then(async (data) => {
            return new Promise((resolve, reject) => {
                const sendImageToDb = {
                    file_name: data.name,
                    file_type: data.type,
                    file_url: data.url,
                    user: user.id,
                    file_data: data.file,
                };
                resolve(sendImageToDb)
            })
            .then((data) => {
                setUploadFormState(prevState => ({
                    ...prevState,
                    preloadData: prevState.preloadData = data
                }));
            });
        });
    }

    const uploadFileHandler = async () => {
        const files = uploadFormState.filesInput.current.files;
        if (files.length > 1) {
            return;
        }
        await getBase64(files);
    };

    const uploadOkFileHandler = async () => {
            return new Promise((resolve, reject) => {
                setUploadFormState(prevState => ({
                    ...prevState,
                    preloadData: {
                        ...prevState.preloadData, 
                        file_comment: prevState.preloadData.file_comment = uploadFormState.commentInputRef.current.value,
                    },
                }));
                resolve();
            })
            .then(() => {
                const fetchFunc = async () => {
                    await fetch('http://localhost:8000/api/users/user_files/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(uploadFormState.preloadData),
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        
                        console.log(data)
                        dispatch(addUserFiles(JSON.stringify(data)));
                        uploadFormState.filesInput.current.value = '';
                        setUploadBtnState(prevState => ({
                            uploadBtnActive: prevState.uploadBtnActive = false,
                        }));
                        setUploadFormState(prevState => ({
                            ...prevState,
                            preloadData: {},
                        }));
                    })
                };
                fetchFunc();
               
            });
    };



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
                        <textarea ref={uploadFormState.commentInputRef} placeholder="comment..."/>
                    </div>
                    <div className="upload-file-form-controls">
                        <div className="upload-file-form-btn-ok">
                            <button onClick={uploadOkFileHandler}>OK</button>
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