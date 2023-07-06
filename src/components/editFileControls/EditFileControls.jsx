import React from "react";

const EditFileControls = (props) => {
    return (
        <div className="editInput">
            <input ref={props.editHandlerRef} type="text" />
                <div className="edit-input-wrap">
                    <div className="edit-inpit-ok-btn" onClick={() => props.editOkHandler(props.fileId)}><button>ok</button></div>
                    <div className="edit-inpit-cancel-btn" onClick={() => props.editCancelHandler(props.fileId)}><button>cancel</button></div>
                </div>                         
        </div>
    );
};

export default EditFileControls;