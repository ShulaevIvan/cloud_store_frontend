import React from "react";
import UploadFileFrom from "../uploadFileForm/UploadFileForm";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { replaceUserFiles } from "../../redux/slices/userSlice";
import FileItem from "../fileItemView/FileItem";

const CloudBody = () => {
    const uFiles = useSelector((state) => state.user.userFiels);
    const userData = useSelector((state) => state.user.userData);
    const dispatch = useDispatch();
    const [userFilesState, setUserFilesState] = useState({
        files: uFiles
    });


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
    }, [uFiles])

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
                           <FileItem {...item}  />
                        );
                    })}
                    
                </div>
            </div>
        </div>
    );
};

export default  CloudBody;