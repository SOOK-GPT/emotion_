import React from "react";
import background from './asset/background_img.png';
import './css/homescreen.css'
import { BrowserRouter as Router, Switch, Route, Link, useLocation } from "react-router-dom";

function HomeScreen() {
    return (
        <div className="flex-container">
        <div className="flex-item">
            <div className="centered-content">
                <div className="Title">
                    실시간 반응형 표정분류 서비스
                </div>
                <div className="Description">
                    타인과의 소통이 단절된 사회적 약자를 위한 플랫폼<br></br>
                    컴퓨터 비전으로 사용자의 표정을 분류하여 네 가지<br></br>
                    감정에 따른 반응을 출력하는 인공지능 프로그램입니다.
                </div>
            </div>
        </div>

        <div className="flex-item">
            <img className="background-image centered-content" src={background}></img>
            <Link to="/Face-recognition" className="face-button centered-content">
                얼굴 인식 시작하기
            </Link>
        </div>
    </div>
    );
}

export default HomeScreen;
