import React from "react";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUserFiles } from "../../redux/slices/userSlice";
import { logoutUser } from "../../redux/slices/userSlice";
import fileTypes from "./fileTypes";
import { signatures } from "./fileTypes";

const UploadFileFrom = (props) => {
    const storageUserData = JSON.parse(localStorage.getItem('userData'));
    const userData = useSelector((state) => state.user.userData);
    const userFiles = useSelector((state) => state.user.userFiels);
    const isAdmin = userData ? userData.is_admin : storageUserData.is_admin;
    const targetUserId = props.targetUser;
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const initialState = {
        filesInput: useRef(null),
        commentInputRef: useRef(null),
        userFiles: userFiles,
        preloadData: undefined,
        fileType: undefined,
        uploadOkBtnActive: false,
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
                let secondFileType = undefined;
                let secondExt = undefined;
                if ((encoded.length % 4) > 0) {
                    encoded += '='.repeat(4 - (encoded.length % 4));
                }
                if (files.type === '') {
                    const getMimeType = (base64)=>{
                        for(const sign in signatures) {
                            if(base64.startsWith(sign)) return signatures[sign];
                        };
                    };
                    secondFileType = getMimeType(encoded);
                }

                if (secondFileType) {
                    Object.keys(fileTypes).forEach((type) => {
                        if (type === secondFileType) {
                            secondExt = `.${fileTypes[type]}`
                        }
                    });
                }
                if (!secondExt) secondExt =  '.file';
                
                fileData = {
                    id: Math.random(),
                    url: url,
                    lastModif: files.lastModified,
                    lastModifDate: files.lastModifiedDate,
                    type: files.type ? files.type : secondExt,
                    name: files.type ? files.name : files.name + secondExt,
                    file: encoded,
                    date: new Date().getTime(),
                };

                setUploadBtnState(prevState => ({
                    ...prevState,
                    uploadOkBtnActive: prevState.uploadOkBtnActive = true,
                }));

                resolve(fileData);
            };
        })
        .then(async (data) => {
            return new Promise((resolve, reject) => {
                if (!data.name) data.name = ''
                const sendImageToDb = {
                    file_name: data.type ? data.name : data.name + '.file',
                    file_type: data.type ? data.type : '.file',
                    file_url: data.url,
                    user: targetUserId && isAdmin ? targetUserId : userData ? userData.user.id : storageUserData.user.id,
                    file_data: data.file,
                };
                console.log(sendImageToDb)
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
        let files = uploadFormState.filesInput.current.files;
        if (files.length > 1) {
            uploadFormState.filesInput.current.value = ''
            
            setUploadBtnState(prevState => ({
                uploadBtnActive: prevState.uploadBtnActive = false,
            }));
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
                await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/user_files/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${userData ? userData.token : storageUserData.token}`,
                    },
                    body: JSON.stringify(uploadFormState.preloadData),
                })
                .then((response) => {
                    if (response.status === 401) {
                        dispatch(logoutUser())
                        navigate('/');
                        return;   
                    }
                    return response.json();
                })
                .then((data) => {
                    if (!targetUserId && !isAdmin) {
                        dispatch(addUserFiles(JSON.stringify(data)));
                        uploadFormState.filesInput.current.value = '';
                        setUploadBtnState(prevState => ({
                            uploadBtnActive: prevState.uploadBtnActive = false,
                        }));
                        setUploadFormState(prevState => ({
                            ...prevState,
                            preloadData: {}
                        }));
                        return;
                    }
                    else if (!targetUserId && isAdmin) {
                        uploadFormState.filesInput.current.value = '';
                        setUploadBtnState(prevState => ({
                            uploadBtnActive: prevState.uploadBtnActive = false,
                        }));
                        setUploadFormState(prevState => ({
                            ...prevState,
                            preloadData: {}
                        }));
                        dispatch(addUserFiles(JSON.stringify(data)));
                        return;
                    }
                    uploadFormState.filesInput.current.value = '';
                    setUploadBtnState(prevState => ({
                        uploadBtnActive: prevState.uploadBtnActive = false,
                    }));
                    setUploadFormState(prevState => ({
                        ...prevState,
                        preloadData: {}
                    }));

                    props.setUserAdminState(prevState => ({
                        ...prevState,
                        userFiles: prevState.userFiles = [...props.userAdminState, data]
                            .sort((a, b) => new Date(a.file_created_time) - new Date(b.file_created_time)).reverse()
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
                            <button onClick={uploadOkFileHandler} disabled={!uploadBtnState.uploadOkBtnActive ? true : false}>OK</button>
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