import React from "react";
import UploadFileFrom from "../uploadFileForm/UploadFileForm";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { replaceUserFiles, removeUserFile, renameUserFile } from "../../redux/slices/userSlice";
import FileItem from "../fileItemView/FileItem";
import EditFileControls from "../editFileControls/EditFileControls";

const CloudBody = () => {
    const uFiles = useSelector((state) => state.user.userFiels);
    const userData = useSelector((state) => state.user.userData);
    const dispatch = useDispatch();
    const [userFilesState, setUserFilesState] = useState({
        files: uFiles
    });
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
            .then(() => {
                dispatch(removeUserFile(id));
            });
        }
        fetchFunc();
    }

    const renameFileHandler = (id) => {
        const fetchFunc = async () => {
            await fetch(`http://localhost:8000/api/users/user_files/${id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => response.json())
            .then(async (data) => {
                setRenameInput(prevState => ({
                    ...prevState,
                    inputActive: prevState.inputActive = true,
                    editId: prevState.editId = id
                }));
                
                setTimeout(() => {
                    renameInput.renameInputRef.current.value = data.file_name;
                    renameInput.commentInputRef.current.value = data.file_comment;
                }, 10)
                
            });
        }
        fetchFunc();
    }

    const editOkHandler = (id) => {
        // const fetchFunc = async () => {
        //     await fetch(`http://localhost:8000/api/users/user_files/${id}/`, {
        //         method: 'PATCH',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             user: userData.user.id, 
        //             id: id, 
        //             file_name: renameInput.renameInputRef.current.value,
        //             file_comment: renameInput.commentInputRef.current.value,
        //         })
        //     })
        //     .then((response) => response.json())
        //     .then((data) => {
        //         console.log(data)
        //         const newFileData = {
        //             ...data,
        //             file_name: renameInput.renameInputRef.current.value,
        //             file_comment: renameInput.commentInputRef.current.value,
        //         };
        //         dispatch(renameUserFile(JSON.stringify(newFileData)));
        //         setRenameInput(prevState => ({
        //             ...prevState,
        //             inputActive: prevState.inputActive = false,
        //         }));
        //     });
        // }
        // fetchFunc();
    };

    const editCancelHandler = (id) => {
        setRenameInput(prevState => ({
            ...prevState,
            inputActive: prevState.inputActive = false,
        }));
        renameInput.renameInputRef.current.value = '';
        renameInput.commentInputRef.current.value = '';
    }

    useEffect(() => {
        const getFiles = async () => {
            await fetch(`http://localhost:8000/api/users/user_files/?user=${userData.user.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
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
                <div className="cloud-body-title-wrap">
                    <h1>Files</h1>
                </div>
                <div className="cloud-body-files-wrap">
                    {userFilesState.files.map((item) => {
                        return (
                            <React.Fragment>
                                
                                <FileItem 
                                    {...item} 
                                    removeHandler = {rmFileHandler} 
                                    renameHandler = {renameFileHandler} 
                                    renameInput = {
                                        renameInput.inputActive  && Number(renameInput.editId) === (item.id) ?
                                            <EditFileControls 
                                                editHandlerRef = {renameInput.renameInputRef}
                                                editCommentRef = {renameInput.commentInputRef}
                                                editOkHandler = {editOkHandler} 
                                                editCancelHandler = {editCancelHandler}
                                                fileId = {item.id} 
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