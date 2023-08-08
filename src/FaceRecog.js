import React, { useState } from 'react';
import * as faceapi from 'face-api.js';
import "./css/homescreen.css";
import "./css/facerecog.css";

//얼굴인식
function FaceRecog() {
    const [modelsLoaded, setModelsLoaded] = React.useState(false);
    const [captureVideo, setCaptureVideo] = React.useState(false);

    const videoRef = React.useRef();
    const videoHeight = 490;
    const videoWidth = 630;
    const canvasRef = React.useRef();

    React.useEffect(() => {
        const loadModels = async () => {
        const MODEL_URL = process.env.PUBLIC_URL + '/models';

        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]).then(setModelsLoaded(true));
        }
        loadModels();
    }, []);



    
    //웹캠 열기
    const startVideo = () => {
        setCaptureVideo(true);
        navigator.mediaDevices
        .getUserMedia({ video: { width: 300 } })
        .then(stream => {
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
        })
        .catch(err => {
            console.error("error:", err);
        });
    }

    const handleVideoOnPlay = () => {
        setInterval(async () => {
        if (canvasRef && canvasRef.current) {
            canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
            const displaySize = {
            width: videoWidth,
            height: videoHeight
            }

            faceapi.matchDimensions(canvasRef.current, displaySize);

            const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

            const resizedDetections = faceapi.resizeResults(detections, displaySize);

            canvasRef && canvasRef.current && canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
            canvasRef && canvasRef.current && faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
            canvasRef && canvasRef.current && faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
            canvasRef && canvasRef.current && faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
        }
        }, 100)
    }

    //웹캠닫기
    const closeWebcam = () => {
        videoRef.current.pause();
        videoRef.current.srcObject.getTracks()[0].stop();
        setCaptureVideo(false);
    }

    
    //버튼(기쁠때,슬플때...) 클릭시 나오는 리스트 달라지게 하기
    const [showSurprised, setShowSurprised] = useState(false);
    const [showAngry, setShowAngry] = useState(false);
    const [showSad, setShowSad] = useState(false);
    const [showList, setShowList] = useState(false);

    //기쁠때 버튼 눌렀을때
    const toggleList = () => {
        setShowList(!showList);
        setShowSurprised(false);
        setShowAngry(false);
        setShowSad(false);
    };

    //놀랐을때 버튼 눌렀을때
    const toggleSurprised = () => {
        setShowList(false);
        setShowSurprised(!showSurprised);
        setShowAngry(false);
        setShowSad(false);
    };

    //화났을때
    const toggleAngry = () => {
        setShowList(false);
        setShowSurprised(false);
        setShowAngry(!showAngry);
        setShowSad(false);
    };

    //슬플때
    const toggleSad = () => {
        setShowList(false);
        setShowSurprised(false);
        setShowAngry(false);
        setShowSad(!showSad);
    };

    
    return (
    <div>

        <div style={{ textAlign: 'center', padding: '10px' }}>
        {
            captureVideo && modelsLoaded ?
                <button onClick={closeWebcam} style={{ cursor: 'pointer', backgroundColor: 'green', color: 'white', padding: '15px', fontSize: '25px', border: 'none', borderRadius: '10px' }}>
                Close Webcam
                </button>
                :
                <button onClick={startVideo} style={{ cursor: 'pointer', backgroundColor: 'green', color: 'white', padding: '15px', fontSize: '25px', border: 'none', borderRadius: '10px' }}>
                Open Webcam
                </button>
            }
        </div>
        {
            captureVideo ?
            modelsLoaded ?
                <div>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                    <video ref={videoRef} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} style={{ borderRadius: '10px' }} />
                    <canvas ref={canvasRef} style={{ position: 'absolute' }} />
                </div>
                </div>
                :
                <div>loading...</div>
            :
            <>
            </>
        }

        <div class="emotions">
            <div class="bbuutt">
                <button id="btn1_1" onClick={toggleList}>기쁠 때 누르기</button> 
                <button id="btn_surprised" onClick={toggleSurprised}>놀랐을 때 누르기</button>
                <button id="btn_angry" onClick={toggleAngry}>화났을 때 누르기</button>
                <button id="btn_sad" onClick={toggleSad}>슬플 때 누르기</button>
            </div>
                    {showList && (
                        <div className="happyBtns" id="hBtns">
                        <ul>
                            <li>
                            <a
                                href="https://www.youtube.com/watch?v=9dWcn089MdU&list=PLsXEeBXKKEFWCTvcRIahOs_OQ5ludB2TH&index=16"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                사랑할 수 있는 한 사랑하라 / 리스트 "사랑의 꿈"
                            </a>
                            </li>
                            <li>
                            <a
                                href="https://www.youtube.com/watch?v=g7DnE1x_B7o&list=PLsXEeBXKKEFWCTvcRIahOs_OQ5ludB2TH&index=20"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                슈베르트가 사랑에 빠져 단숨에 작곡한 곡 / 슈베르트 "실잣는 그레첸"
                            </a>
                            </li>
                            <li>
                            <a
                                href="https://www.youtube.com/watch?v=XTJ-gEXeO40&list=PLsXEeBXKKEFWCTvcRIahOs_OQ5ludB2TH&index=24"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                달콤한 셋잇단음표의 일렁임은 사랑의 감정에 휘말리고~ / 베토벤 "월광"
                            </a>
                            </li>
                            <li>
                            <a
                                href="https://www.youtube.com/watch?v=_RdYtGH6cKk&list=PLsXEeBXKKEFWCTvcRIahOs_OQ5ludB2TH&index=92"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                천재 모차르트, 다시 사랑하다 / 모자르트 "아이네 클라이네 나흐트 뮤지크"
                            </a>
                            </li>
                        </ul>
                        </div>
                    )}

                
                    {showSurprised && (
                        <div className="surprisedBtns" id="sBtns">
                        <ul>
                        <li>
                            <a target="_blank" href="mailto:kyeji02@sookmyung.ac.kr?subject=[긴급] ☆☆☆어르신께 도움이 필요합니다.&body=○○구 □□동 △△호 ☆☆☆어르신께 도움이 필요합니다." rel="noreferrer">
                            복지관 연결 단추</a> 
                            </li>
                            <li>  
                            <a href="https://www.youtube.com/watch?v=AHv3XC9tXcs" target="_blank" rel="noopener noreferrer">
                            마음에 안정이 필요할 때 / 클래스 e-김주환 </a>
                            </li>
                            <li>
                            <a href="https://www.youtube.com/watch?v=mj85a7Ic0TE" target="_blank" rel="noopener noreferrer">
                            중요한 일을 앞두고 결과에 상관없는 마음 만들기 / 내면의 목소리</a>                     
                            </li>
                            <li>
                            <a href="https://www.youtube.com/watch?v=dFfhohEk90s" target="_blank" rel="noopener noreferrer">
                            불안을 다스리는 법, 8분 명상 / 마보 데일리 명상</a>
                            </li>
                            <li>
                            <a href="https://www.youtube.com/watch?v=cvPS_25gRPs" target="_blank" rel="noopener noreferrer">
                            부정적인 생각을 없애는 명상 / 에일린 mind yoga</a>
                            </li>
                        </ul>
                        </div>
                    )}

                    
                    {showAngry && (
                        <div className="angryBtns" id="aBtns">
                        <ul>
                        <li>
                            <a href="https://www.youtube.com/watch?v=ppxzwfKp78A&list=PLsXEeBXKKEFWCTvcRIahOs_OQ5ludB2TH&index=62" target="_blank" rel="noopener noreferrer">
                            리스트가 건네는 위안 / 리스트 "위로"</a></li>
                            <li>
                            <a href="https://www.youtube.com/watch?v=-bWT2jjlY20&list=PLsXEeBXKKEFWCTvcRIahOs_OQ5ludB2TH&index=84" target="_blank" rel="noopener noreferrer">
                                고난에서 환희로, 백만인이여 서로 포옹하라 / 베토벤 "교향곡 7번" 외</a>
                            </li>
                            <li>
                            <a href="https://www.youtube.com/watch?v=_RdYtGH6cKk&list=PLsXEeBXKKEFWCTvcRIahOs_OQ5ludB2TH&index=92" target="_blank" rel="noopener noreferrer">
                                불굴의의지로 죽음을 뛰어넘는 마음으로 ... / 베토벤 "피아노협주곡 3번" </a>
                            </li>
                            <li>
                            <a href="https://www.youtube.com/watch?v=5A4XVeJej0g&list=PLsXEeBXKKEFWCTvcRIahOs_OQ5ludB2TH&index=12" target="_blank" rel="noopener noreferrer">
                                천천히 노래하듯이, 차이코프스키 "안단테 칸타빌레"</a>                  
                            </li>
                        </ul>
                        </div>
                    )}

                    
                    {showSad && (
                        <div className="sadBtns" id="uBtns">
                        <ul>
                        <li>
                                <a target="_blank" href="mailto:kyeji02@sookmyung.ac.kr?subject=[긴급]☆☆☆어르신께 도움이 필요합니다.&body=○○구 □□동 △△호 ☆☆☆어르신께 도움이 필요합니다." rel="noreferrer">
                                복지관 연결 단추</a>
                            <li>  
                                <a href="https://www.youtube.com/watch?v=t3aamgizG9I" target="_blank" rel="noopener noreferrer">
                                못 다한 슬픔해소 명상 ㅣ 오래된 슬픔 떠나보내기 / 명상하는 그녀_내안의별</a>
                            </li>
                            <li>
                                <a href="https://www.youtube.com/watch?v=mj85a7Ic0TE" target="_blank" rel="noopener noreferrer">
                                마음이 지칠때 사는게 힘들때 위로가 되는 명상  / 명상하는 그녀_내안의별</a>                     
                            </li>
                            <li>
                                <a href="https://www.youtube.com/watch?v=weKWcpG2KdA" target="_blank" rel="noopener noreferrer">
                                마음이 힘들 때, 나를 안아주는 너그러움 명상 / 숨쉬는 고래</a>
                            </li>
                            <li>
                                <a href="https://www.youtube.com/watch?v=DB9JEy7s2oY" target="_blank" rel="noopener noreferrer">
                                마음이 힘든 날 위로가 필요할때 / 에일린 mind yoga</a>
                            </li>
                        </li>
                        </ul>
                        </div>
                    )}
                </div>
            </div>
    );
}

export default FaceRecog;