import React from "react";
import analysis from './asset/face_img.jpg';

function FaceRecog() {
    return (
    <div style={{
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        height: '85vh'
    }}>
        <img src={analysis} style={{maxWidth: '80vw', maxHeigth: '80vh'}}></img>
    </div>
    );//
}

export default FaceRecog;//