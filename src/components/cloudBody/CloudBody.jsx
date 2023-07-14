import React from "react";
import UploadFileFrom from "../uploadFileForm/UploadFileForm";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { replaceUserFiles, removeUserFile, renameUserFile, updateDownloadFile } from "../../redux/slices/userSlice";
import FileItem from "../fileItemView/FileItem";
import EditFileControls from "../editFileControls/EditFileControls";
import ShareWindow from "../shareWindow/ShareWindow";
import AdminPanel from "../adminPanel/AdminPanel";

const CloudBody = () => {
    const uFiles = useSelector((state) => state.user.userFiels);
    const userData = useSelector((state) => state.user.userData);
    const dispatch = useDispatch();
    const [userFilesState, setUserFilesState] = useState({ files: uFiles });
    const [loadBlobState, setLoadBlob] = useState({ blobFiles: [] });
    const [shareWindow, setShareWindow] = useState({ windowActive: false })
    const [renameInput, setRenameInput] = useState({
        inputActive: false,
        editId: undefined,
        renameInputRef: useRef(),
        commentInputRef: useRef(),
    });


    const rmFileHandler = (id) => {
        const fetchFunc = async () => {
            await fetch('http://localhost:8000/api/users/user_files/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({user: userData.user.id, id: id})
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(replaceUserFiles(JSON.stringify(data)));
            });
        }
        fetchFunc();
    };

    const renameFileHandler = (id) => {
        const fetchFunc = async () => {
            await fetch(`http://localhost:8000/api/users/user_files/?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => response.json())
            .then((data) => {
                setRenameInput(prevState => ({
                    ...prevState,
                    inputActive: prevState.inputActive = true,
                    editId: prevState.editId = id
                }));

                setTimeout(() => {
                    renameInput.renameInputRef.current.value = data.file_name;
                    renameInput.commentInputRef.current.value = data.file_comment;
                }, 100);
            });
        }
        fetchFunc();
    };

    const downloadHandler = (id) => {
        const fetchFunc = async () => {
            await fetch(`http://localhost:8000/api/users/user_files/?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(updateDownloadFile(JSON.stringify(data)));
            });
        }
        fetchFunc();
    }

    const shareFileHandler = (id) => {
        const fetchFunc = async () => {
            await fetch(`http://localhost:8000/api/users/user_files/?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => response.json())
            .then((data) => {
                setShareWindow(prevState => ({
                    ...prevState,
                    windowActive: prevState.windowActive = true,
                }));
            });
        }
        fetchFunc();
    }

    const shareFileCloseHandler = () => {
        setShareWindow(prevState => ({
            ...prevState,
            windowActive: prevState.windowActive = false,
        }));
    };

    const editOkHandler = (id) => {
        const fetchFunc = async () => {
            await fetch(`http://localhost:8000/api/users/user_files/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: userData.user.id,
                    rename_id: id,
                    file_name: renameInput.renameInputRef.current.value,
                    file_comment: renameInput.commentInputRef.current.value,
                })
            })
            .then((response) => response.json())
            .then((data) => {
                const newFileData = {
                    ...data,
                    file_name: data.file_name,
                    file_comment: data.file_comment,
                };
                dispatch(renameUserFile(JSON.stringify(newFileData)));
                setRenameInput(prevState => ({
                    ...prevState,
                    inputActive: prevState.inputActive = false,
                }));
                renameInput.renameInputRef.current.value = ''
                renameInput.commentInputRef.current.value = ''
            });
        }
        fetchFunc();
    };

    const editCancelHandler = (id) => {
        setRenameInput(prevState => ({
            ...prevState,
            inputActive: prevState.inputActive = false,
        }));
        renameInput.renameInputRef.current.value = '';
        renameInput.commentInputRef.current.value = '';
    };

    useEffect(() => {
        const getFiles = async () => {
            await fetch(`http://localhost:8000/api/user/files/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({user: userData.user.id})
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(replaceUserFiles(JSON.stringify(data)));
                setUserFilesState(prevState => ({
                    ...prevState,
                    files: prevState.files = data,
                }));
            });
        }
        getFiles();
        
    }, []);

    useEffect(() => {
        if (JSON.stringify(userFilesState.files) !== JSON.stringify(uFiles)) {
            uFiles.map((item) => {
                const fetchBlob = async () => {
                    await fetch(`${item.file_url}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    .then((response) => response.blob())
                    .then((data) => {
                        const resultBlob = {fileId: item.file_uid, fileBlob: URL.createObjectURL(new Blob([data], {type: item.file_type}))}
                        
                        setLoadBlob(prevState => ({
                            ...prevState,
                            blobFiles: [...prevState.blobFiles, resultBlob]
                        }))
                    })
                }
                fetchBlob();
            });
            setUserFilesState(prevState => ({
                ...prevState,
                files: uFiles
            })); 
        }

    }, [uFiles]);

    return (
        <div className="cloud-body">
            <div className="cloud-body-wrap">
                <div className="cloud-body-controls-wrap">
                   <UploadFileFrom />
                </div>
                {userData.is_admin ? <AdminPanel /> : null}
                <div className="cloud-body-title-wrap">
                    <h1>Files</h1>
                </div>
                <div className="cloud-body-files-wrap">
                   
                    {userFilesState.files.map((item) => {
                        return (
                            <React.Fragment>
                                {shareWindow.windowActive ? 
                                    <ShareWindow
                                        key= {Math.random()}
                                        fileLink={item.file_url} 
                                        fileName = {item.file_name}
                                        closeHandler = {shareFileCloseHandler}
                                    /> : null}
                                
                                <FileItem
                                    key= {item.file_uid}
                                    {...item} 
                                    removeHandler = {rmFileHandler} 
                                    renameHandler = {renameFileHandler} 
                                    shareHandler  = {shareFileHandler}
                                    downloadHandler = {downloadHandler}
                                    blobFiles = {loadBlobState.blobFiles}
                                    renameInput = {
                                        renameInput.inputActive && renameInput.editId == item.file_uid ?
                                            <EditFileControls 
                                                editHandlerRef = {renameInput.renameInputRef}
                                                editCommentRef = {renameInput.commentInputRef}
                                                editOkHandler = {editOkHandler} 
                                                editCancelHandler = {editCancelHandler}
                                                fileId = {item.file_uid}
                                            /> : null
                                    }
                                />
                            </React.Fragment>
                        );
                    })}
                    
                </div>
            </div>
        </div>
    );
};

export default  CloudBody;