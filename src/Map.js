import React from "react";
import map from './asset/map_img.png';

function Map() {
    return (
        <div style={{
            display: "flex",
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '10px',
            height: '85vh'
        }}>
            <img style={{maxWidth: '70vw', maxHeigth: '70vh'}} src={map}></img>
        </div>
    );
}

export default Map;