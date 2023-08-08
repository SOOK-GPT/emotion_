import React, { useState, useEffect } from "react";
//import ChatBot from 'react-simple-chatbot';
//import {ThemeProvider} from 'styled-components';
import { Configuration, OpenAIApi } from "openai"; // Import the required OpenAI classes
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from "@chatscope/chat-ui-kit-react";
//import styled from "styled-components";
import styled from "styled-components";
import pagination from "./pagination.css";
import './css/global.css'


const API_KEY = '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';

const openAIConfig = new Configuration({
    apiKey: "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",
});

const openai = new OpenAIApi(openAIConfig);

async function apiCall(userInput) {
    const chatCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userInput }],
        });
    console.log(chatCompletion.data.choices[0].message.content);
    return chatCompletion.data.choices[0].message.content;
}


function ChatBotpage() {
    //simple react chatbot 
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        // Initial welcome message
        setChatMessages((prevMessages) => [
        ...prevMessages,
        { role: "chatbot", content: "안녕하세요? 사회복지 전문 챗봇입니다. 당신의 이름은 무엇인가요?" },
        ]);
    }, []);

    const handleUserMessage = async (userInput) => {
        // Add user message to chat history
        setChatMessages((prevMessages) => [...prevMessages, { role: "user", content: userInput }]);

        // Get chatbot response
        const chatbotResponse = await apiCall(userInput);
        setChatMessages((prevMessages) => [...prevMessages, { role: "chatbot", content: chatbotResponse }]);

        // Additional logic to handle specific user inputs and customize chatbot responses
        // ...

        // Example: End chat after a few responses
        if (chatMessages.length >= 5) {
        setChatMessages((prevMessages) => [
            ...prevMessages,
            { role: "chatbot", content: "대화가 끝났습니다. 감사합니다!" },
        ]);
        }
    };


    //chatGPT 모델 챗봇
    const [typing, setTyping] = useState(false);
    const [messages, setMessages] = useState([
        {
            message: "안녕하세요! 무엇을 도와드릴까요? \n\n1. '챗봇에게 메시지 보내기'란에 직접 질의어를 입력하거나 \n2. 아래 메뉴에서 선택해주세요.",
            sender: "ChatGPT"
        }
    ]);

    const handleSend = async (message) => {
        const newMessage = {
            message: message,
            sender: "user",
            direction: "outgoing"
        };
        const newMessages = [...messages, newMessage];

        setMessages(newMessages);
        setTyping(true);
        await processingMessageToChatGPT(newMessages);
    }

    const handleSendNotSendGPT = async (message) => {
        const newMessage = {
            message: message,
            sender: "user",
            direction: "outgoing"
        };
        const newMessages = [...messages, newMessage];

        setMessages(newMessages);
        //setTyping(true);
        //await processingMessageToChatGPT(newMessages);
    }

    //gpt가 말하는것처럼 보이게 하기
    const handleSendNotSendGPT2 = async (message) => {
        const newMessage = {
            message: message,
            sender: "user",
            direction: "incoming"
        };
        const newMessages = [...messages, newMessage];

        setMessages(newMessages);
        //setTyping(true);
        //await processingMessageToChatGPT(newMessages);
    }

    

    async function processingMessageToChatGPT(chatMessages){
        let apiMessages = chatMessages.map((messageObject) => {
            let role = "";
            if(messageObject.sender ==="ChatGPT"){
                role="assistant"
            }else {
                role="user"
            }
            return {role: role, content: messageObject.message}
        });

        const systemMessage = {
            role: "system",
            content: "Explain simple and short"//내가 열살인것 처럼 설명해라
        }

        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                systemMessage,
                ...apiMessages
            ]
        }

        await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer "+API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        }).then((data)=> {
            return data.json();
        }).then((data)=> {
            console.log(data);
            console.log(data.choices[0].message.content);
            setMessages(
                [...chatMessages, {
                    message: data.choices[0].message.content,
                    sender: "ChatGPT"
                }]
            );
            setTyping(false);
        });

        
    }

    function doNext(text){
        handleSendNotSendGPT(text); //gpt 응답 사용안함
    }

    
    const [isVisible, setIsVisible] = useState(true);
    const [isAdditionalButtonsVisible, setAdditionalButtonsVisible] = useState(false);
    const [isAdditionalButtonsVisible2, setAdditionalButtonsVisible2] = useState(false);
    const [isAdditionalButtonsVisible3, setAdditionalButtonsVisible3] = useState(false);
    const [isAdditionalButtonsVisible4, setAdditionalButtonsVisible4] = useState(false);
    const [isAdditionalButtonsVisible5, setAdditionalButtonsVisible5] = useState(false);
    const [isSubButtonsVisible, setSubButtonsVisible] = useState(false);

    const handleButtonClick = (text) => {
        //handleSendNotSendGPT(text);
        //doNext(text);
        if(text === '복지서비스'){
            //console.log(messages);
            
            setIsVisible(false);
            setAdditionalButtonsVisible(true); //버튼 안보이게 하기
            handleSendNotSendGPT2(`<strong>${text}</strong>를 선택하셨습니다.\n\n 복지서비스는 나와 우리 가족의 생애주기, 가구상황과 관심주제 등을 입력하여 다양한 복지 혜택을 찾을 수 있습니다.\n\n 아래에서 원하시는 내용을 선택해 주세요.`);
            
        }else if(text === '복지도움'){
            setIsVisible(false);
            setAdditionalButtonsVisible2(true); //버튼 안보이게 하기
            handleSendNotSendGPT2(`<strong>${text}요청</strong>은 도움이 필요한 분이나 그 주변의 이웃이 온라인으로 도움을 요청하면,` + 
            `가까운 주민센터나 보건복지상담센터(129)를 통해 도움을 받을 수 있는 서비스입니다.\n\n`+
            `도움이 필요한 분이나 그 이웃 누구나 요청할 수 있으며, 도움요청 정보는 보건복지상담센터나 주민센터 복지담당자에게 전달되어 처리됩니다.\n\n`+
            `※보건복지상담센터(129), 정신건강상담전화(1577-0199), 자살예방상담센터(1393), 생명의 전화(1588-9191), 청소년전화(1388)\n`
            );
        }else if(text === '서비스 이용 문의'){
            setIsVisible(false);
            setAdditionalButtonsVisible5(true);
            handleSendNotSendGPT2('어떤 서비스를 이용하려고 하세요?');
        }else if(text === '대화가 필요할 때'){
            setIsVisible(false);
            handleSendNotSendGPT2('안녕하세요! 어떤 대화가 필요하신가요?\n\n "챗봇에게 메세지 보내기"란을 통해 대화를 시작해 보세요.');
        }else if(text === '홈'){
            setIsVisible(true);
            setAdditionalButtonsVisible(false); // Hide all additional buttons
            setSubButtonsVisible(false);
        }else{
            alert(text);
            setIsVisible(false);
            setAdditionalButtonsVisible(true); //버튼 안보이게 하기
            handleSendNotSendGPT(text);
        }
        
        //handleSendNotSendGPT(text); 왜 안될까??
    };

    const handleAdditionalButtonClick = (text) => {
        setAdditionalButtonsVisible(false); // 중장년 교육과 중장년 정보 버튼 안보이게 하기
        setSubButtonsVisible(true); // 하위 버튼 보이게 하기
        if (text === '처음으로'){
            handleSendNotSendGPT(text);
            setIsVisible(true);
            //setAdditionalButtonsVisible5(true);
        }else if(text === '주거급여'){
            setIsVisible(false);
            setAdditionalButtonsVisible4(true); //버튼 안보이게 하기
            handleSendNotSendGPT2(`<strong>${text}</strong>에 대한 안내입니다.\n\n` + 
            `주거 안정과 주거생활 향상을 위하여 일정 소득 이하 국민에게 주거안정에 필요한 실제임차, 선유지비 등을 포함하여 주거급여를 지원합니다.\n\n`+
            `■지원대상\n`+
            `-소득인정액 기준 이하의 가구(*소득인정액 기준은 홈페이지에서 확인)\n`+
            `-주거급여가 불필요하거나, 타 법령 등에 의하여 주거를 제공받고 있는 수급자에 대해서는 주거급여를 지급하지 않습니다.\n\n`+
            `■처리절차\n`+
            `-대상자 통합조사 및 심사 → 대상자 확정 → 이의 신청 접수\n\n`+
            `■문의처\n`+
            `-마이홈(1600-0777)\n\n`+
            `■관련 웹사이트\n`+
            `-마이홈(https://www.myhome.go.kr)\n\n`+
            `■법령근거\n`+
            `-국민기초생활 보장법\n`+
            `-주거급여법`);
        }else if(text === '기초연금'){
            setIsVisible(false);
            setAdditionalButtonsVisible4(true); //버튼 안보이게 하기
            handleSendNotSendGPT2(`<strong>${text}</strong>에 대한 안내입니다.\n\n` + 
            `생활이 어려운 어르신에게 안정적인 소득기반을 제공하여 생활안정을 지원합니다.\n\n`+
            `■지원대상\n`+
            `-만 65세 이상인 어르신으로서 소득인정액이 매년 보건복지부장관이 정하여 고시하는 금액 이하인 사람)\n\n`+
            `■신청방법\n`+
            `-거주지 관할 읍면동 주민센터 또는 전국 국민연금공단 지사 직접 방문\n`+
            `-복지로 온라인신청\n\n`+
            `■처리절차\n`+
            `-초기 상담 및 서비스 신청 → 대상자 통합 조사 및 심사 → 대상자 확정 → 이의 신청 접수 → 서비스 지원 → 서비스 사후관리\n\n`+
            `■문의처\n`+
            `-국민연금공단(1355)\n`+
            `-보건복지상담센터(129)\n\n`+
            `■관련 웹사이트\n`+
            `-국민연금공단(https://www.nps.or.kr)\n`+
            `-보건복지부 콜센터(https://www.129.go.kr)\n\n`+
            `■법령근거\n`+
            `-기초연금법`);
        }else if(text === '생계급여'){
            setIsVisible(false);
            setAdditionalButtonsVisible4(true); //버튼 안보이게 하기
            handleSendNotSendGPT2(`<strong>${text}</strong>에 대한 안내입니다.\n\n` + 
            `생활이 어려운 사람에게 필요한 급여를 실시하여 최저생활을 보장하고 자활을 돕는 서비스입니다\n\n`+
            `■지원대상\n`+
            `-가구의 소득인정액이 생계급여 선정기준 이하로서 생계급여 수급자로 결정된 수급자\n\n`+
            `■신청방법\n`+
            `-주민등록상 주소지 관할 시군구 및 읍면동에서 연중 신청 가능\n\n`+
            `■처리절차\n`+
            `-초기 상담 및 서비스 신청 → 대상자 통합 조사 및 심사 → 대상자 확정 → 이의신청 접수 → 서비스 지원 → 서비스 사후 관리\n\n`+
            `■문의처\n`+
            `-보건복지상담센터(129)\n\n`+
            `■관련 웹사이트\n`+
            `-보건복지부 콜센터(https://www.129.go.kr)\n\n`+
            `■법령근거\n`+
            `-국민기초생활 보장법`);
        }else if(text === '가정양육수당'){
            setIsVisible(false);
            setAdditionalButtonsVisible4(true); //버튼 안보이게 하기
            handleSendNotSendGPT2(`<strong>${text}</strong>에 대한 안내입니다.\n\n` + 
            `가정에서 아이를 돌보는 가정 양육시, 부모의 자녀 양육에 대한 부담을 줄이고 보육 서비스에 대한 선택권을 보장합니다.\n\n`+
            `■지원대상\n`+
            `-어린이집, 유치원(특수학교 포함), 종일제 아이돌봄 서비스를 이용하지 않고 가정에서 영유아를 돌보는 경우\n\n`+
            `■신청방법\n`+
            `-읍면동 사무소로 방문\n`+
            `-복지로 온라인신청\n\n`+
            `■처리절차\n`+
            `-초기 상담 및 서비스 신청 → 대상자 통합 조사 및 심사 → 대상자 확정 → 이의신청 접수 → 서비스 지원\n\n`+
            `■문의처\n`+
            `-복지로\n`+
            `-보건복지상담센터(129)\n`+
            `-보건복지부\n\n`+
            `■관련 웹사이트\n`+
            `-복지로\n`+
            `-보건복지부 콜센터(https://www.129.go.kr)\n`+
            `-보건복지부(https://www.mohw.go.kr)\n\n`+
            `■법령근거\n`+
            `-영유아보육법`);
        }else if(text === '아동수당'){
            setIsVisible(false);
            setAdditionalButtonsVisible4(true); //버튼 안보이게 하기
            handleSendNotSendGPT2(`<strong>${text}</strong>에 대한 안내입니다.\n\n` + 
            `만 8세 미만 아동의 양육 부담을 덜고 아동의 기본적인 권리와 복지 증진을 돕습니다.\n\n`+
            `■지원대상\n`+
            `-만 8세미만 아동(0~95개월)\n\n`+
            `■신청방법\n`+
            `-거주지 관할 읍면동 주민센터로 방문\n`+
            `-복지로 온라인신청\n\n`+
            `■처리절차\n`+
            `-초기 상담 및 서비스 신청 → 대상자 통합 조사 및 심사 → 대상자 확정 → 이의신청 접수 → 서비스 지원\n\n`+
            `■문의처\n`+
            `-보건복지상담센터(129)\n`+
            `-\n\n`+
            `■관련 웹사이트\n`+
            `-보건복지부 콜센터(https://www.129.go.kr)\n\n`+
            `■법령근거\n`+
            `-아동수당법`);
        }else if(text === '의료급여'){
            setIsVisible(false);
            setAdditionalButtonsVisible4(true); //버튼 안보이게 하기
            handleSendNotSendGPT2(`<strong>${text}</strong>에 대한 안내입니다.\n\n` + 
            `의료급여수급권자에게 의료비를 지원하여 국민보건 및 사회복지 증진에 기여합니다.\n\n`+
            `■지원대상\n`+
            `-생계·의료·주거·교육급여 수급자, 의료급여법에 의한 수급권자 타법에 의한 수급권자\n`+
            `-의료급여 수급권자 중에서 급여대상의 본인부담금 기준액을 초과한 자\n`+
            `-국민기초생활보장법에 의한 의료급여 수급권자는 1종 수급권자와 2종 수급권자로 구분하여 지원\n\n`+
            `■처리절차\n`+
            `-대상자 통합 조사 및 심사 → 대상자 확정 → 이의신청 접수\n\n`+
            `■문의처\n`+
            `-보건복지상담센터(129)\n`+
            `-보건복지부\n\n`+
            `■관련 웹사이트\n`+
            `-보건복지부(https://www.mohw.go.kr)\n`+
            `-보건복지부 콜센터(https://www.129.go.kr)\n\n`+
            `■법령근거\n`+
            `-의료급여법\n` + 
            `-의료급여법 시행령\n` +
            `-의료급여법 시행규칙`);
        }else if(text === '교육급여'){
            setIsVisible(false);
            setAdditionalButtonsVisible4(true); //버튼 안보이게 하기
            handleSendNotSendGPT2(`<strong>${text}</strong>에 대한 안내입니다.\n\n` + 
            `생계유지 능력이 없거나 생활이 어려운 자에게 필요한 교육급여를 지급하여 빈곤층 교육비 부담을 경감하고 실질적인 교육기회 보장을 위한 기초생활보장제도입니다.\n\n`+
            `■지원대상\n`+
            `-학교 또는 시설(초등학교, 중학교, 고등학교, 특수학교 등)에 입학 또는 재학하는 생계·의료·주거·교육급여 수급자와 의사상자의 자녀\n\n`+
            `■처리절차\n`+
            `-대상자 통합 조사 및 심사 → 대상자 확정 → 이의신청 접수 → 서비스 지원 → 서비스 사후 관리\n\n`+
            `■문의처\n`+
            `-보건복지상담센터(129)\n`+
            `-복지로\n\n`+
            `■관련 웹사이트\n`+
            `-보건복지부(https://www.mohw.go.kr)\n`+
            `-복지로(https://www.bokjiro.go.kr)\n\n`+
            `■법령근거\n`+
            `-국민기초생활 보장법`);
        }else if(text === '유아학비'){
            setIsVisible(false);
            setAdditionalButtonsVisible4(true); //버튼 안보이게 하기
            handleSendNotSendGPT2(`<strong>${text}</strong>에 대한 안내입니다.\n\n` + 
            `유치원 및 어린이집에 다니는 만 3세~5세의 모든 유아에게 유아학비와 보육료를 지원합니다.\n\n`+
            `■지원대상\n`+
            `-학교 또는 시설(초등학교, 중학교, 고등학교, 특수학교 등)에 입학 또는 재학하는 생계·의료·주거·교육급여 수급자와 의사상자의 자녀\n\n`+
            `■처리절차\n`+
            `-초기 상담 및 서비스 신청 → 대상자 통합 조사 및 심사 → 대상자 확정 → 이의신청 접수 → 서비스 지원 → 서비스 사후 관리\n\n`+
            `■문의처\n`+
            `-교육부(02-6222-6060\n`+
            `-복지로\n`+
            `-e-유치원\n\n`+
            `■관련 웹사이트\n`+
            `-교육부(https://www.moe.go.kr)\n`+
            `-e-유치원(https://www.childschool.go.kr)\n`+
            `-복지로(https://www.bokjiro.go.kr)\n\n`+
            `■법령근거\n`+
            `-유아교육법 시행규칙\n` +
            `-유아교육법 시행령\n` +
            `-유아교육법`);
        }else if(text === '이동통신요금감면'){
            setIsVisible(false);
            setAdditionalButtonsVisible4(true); //버튼 안보이게 하기
            handleSendNotSendGPT2(`<strong>${text}</strong>에 대한 안내입니다.\n\n` + 
            `사회적 취약계층을 대상으로 가계통신비 부담완화를 위해 통신요금을 지원합니다.\n\n`+
            `■지원대상\n`+
            `-기초생활수급자, 차상위계층, 기초연금수급자, 장애인, 국가유공자, 단체 및 시설\n\n`+
            `■처리절차\n`+
            `-대상자 통합 조사 및 심사 → 대상자 확정 → 이의신청 접수\n\n`+
            `■문의처\n`+
            `-과학기술정보통신부 민원상담센터(1335)\n`+
            `-개별통신사 전용 ARS\n\n`+
            `■관련 웹사이트\n`+
            `-과학기술정보통신부 민원상담센터\n`+
            `-개별통신사 전용 ARS\n\n`+
            `■법령근거\n`+
            `-전기통신사업법\n` + 
            `-전기통신사업법 시행령\n` +
            `-보편적역무손실보전금 산정방법 등에 관한 기준`);
        }else if(text === '청년희망키움통장'){
            setIsVisible(false);
            setAdditionalButtonsVisible4(true); //버튼 안보이게 하기
            handleSendNotSendGPT2(`<strong>${text}</strong>에 대한 안내입니다.\n\n` + 
            `일하는 생계급여수급 청년의 탈수급과 자립을 향한 꿈을 키워나갈 수 있도록 돕습니다.\n\n`+
            `■지원대상\n`+
            `-소득인정액이 기준중위소득 30% 이하인 가구의 청년(만 15세 이상 39세 이하)\n\n`+
            `■처리절차\n`+
            `-초기 상담 및 서비스 신청 → 대상자 통합 조사 및 심사 → 대상자 확정 → 이의신청 접수 → 서비스 지원 → 서비스 사후 관리\n\n`+
            `■문의처\n`+
            `-보건복지상담센터(129)\n`+
            `-보건복지부\n\n`+
            `■관련 웹사이트\n`+
            `-보건복지부 콜센터(https://www.129.go.kr)\n`+
            `-보건복지부(https://www.mohw.go.kr)\n\n`+
            `■법령근거\n`+
            `-국민기초생활 보장법`);
        }else if(text === '장애수당'){
            setIsVisible(false);
            setAdditionalButtonsVisible4(true); //버튼 안보이게 하기
            handleSendNotSendGPT2(`<strong>${text}</strong>에 대한 안내입니다.\n\n` + 
            `생활이 어려운 장애인에게 장애수당을 지급하여 생활의 안정을 돕습니다.\n\n`+
            `■지원대상\n`+
            `-생계·의료·주거·교육급여 수급자 및 차상위계층 중 만 18세 이상의 장애인연금법상 중증장애인에 해당하지 않는 장애인\n\n`+
            `■처리절차\n`+
            `-대상자 통합 조사 및 심사 → 대상자 확정 → 이의신청 접수\n\n`+
            `■문의처\n`+
            `-보건복지상담센터(129)\n`+
            `-보건복지부\n\n`+
            `■관련 웹사이트\n`+
            `-보건복지부 콜센터(https://www.129.go.kr)\n`+
            `-보건복지부(https://www.mohw.go.kr)\n\n`+
            `■법령근거\n`+
            `-장애인복지법`);
        }else{
            setAdditionalButtonsVisible(false);
            handleSend(text); //gpt 응답 사용
        }
        //handleSend(text); //gpt 응답 사용
    };

    const handleButtonClick2 = (text) => {
        //handleSendNotSendGPT(text);
        //doNext(text);
        setAdditionalButtonsVisible5(false);
        if(text === '챗봇'){
            setIsVisible(false);
            //setAdditionalButtonsVisible5(true);
            handleSendNotSendGPT2(`<strong>챗봇 서비스</strong>에 대해서 이용 안내드릴게요.\n\n 다양한 사회복지 제도와 지원대상, 신청방법을 안내합니다.\n그리고 간단한 대화를 통해 외로움을 해소할 수 있습니다.`
            );
        }else if(text === '지도'){
            setIsVisible(false);
            //setAdditionalButtonsVisible5(true);
            handleSendNotSendGPT2(`<strong>지도 서비스</strong>에 대해서 이용 안내드릴게요.\n\n 전국에 있는 사회복지센터의 위치를 손쉽게 알 수 있습니다. 현재 위치에 기반하여 근처에 있는 사회복지기관과 전국적으로 분포하는 사회복지기관을 다양하게 볼 수 있습니다.`
            );
        }else if(text === '얼굴 인식'){
            setIsVisible(false);
            //setAdditionalButtonsVisible5(true);
            handleSendNotSendGPT2(`<strong>얼굴 인식 서비스</strong>에 대해서 이용 안내드릴게요.\n\n 카메라를 통해 현재 느끼는 감정상태를 파악할 수 있습니다.\n현재 느끼는 감정에 따라 적절한 해결방안도 적용할 수 있습니다.`
            );
            //moretalk('안녕');
        }else{
            alert(text);
            setIsVisible(false);
            //setAdditionalButtonsVisible(true); //버튼 안보이게 하기
            handleSendNotSendGPT(text);
        }
        
    };
    const [isHovered, setIsHovered] = useState(false);

    let custombutton = {
        padding: "5px 10px",
        fontSize: "14px", 
        fontWeight: "bold",
        width: "135px",
        height: "40px",
        alignSelf: "center",
        marginLeft: "10px",
        marginTop: "15px",
        background: isHovered ? "gray" : "white",
        border: isHovered ? "2px solid gray" : "1px solid #b7b7b7",
        color: isHovered ? "white" : "black",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "background-color 0.3s ease, border 0.3s ease, color 0.3s ease",
    }

    const buttonhover = {
        ...custombutton, // 기존 custombutton 스타일을 모두 포함
        background: "#b7b7b7",
        border: "1px solid #b7b7b7",
        color: "white",
    };


    const [hoveredButton, setHoveredButton] = useState(null);

    const handleButtonHover = (buttonName) => {
        setHoveredButton(buttonName);
    };

    const backcolor = {
        background: "gray"
    }

    const ButtonGroup = ({ children }) => (
        <div style={{ marginBottom: '15px' }}>
            {children}
        </div>
    );
    

    return (
        
    <div>


        <div className={pagination.body} style={{position: "relative", height: '500px', width: "800px"}}>
            <MainContainer>
                <ChatContainer>
                    <MessageList 
                        scrollBehavior="smooth"
                        typingIndicator = {typing ? <TypingIndicator content="입력중입니다..." /> : null}
                    >

                        
                        
                        {messages.map((message, i) => {
                            console.log(i, message);
                            return <Message key= {i} model = {message} />
                        })}

                        
                        
{isVisible && (
    <>
        <button
            style={hoveredButton === '복지서비스' ? buttonhover : custombutton}
            onClick={() => handleButtonClick('복지서비스')}
            onMouseEnter={() => handleButtonHover('복지서비스')}
            onMouseLeave={() => handleButtonHover(null)}
        >
            복지서비스
        </button>
        <button
            style={hoveredButton === '복지도움' ? buttonhover : custombutton}
            onClick={() => handleButtonClick('복지도움')}
            onMouseEnter={() => handleButtonHover('복지도움')}
            onMouseLeave={() => handleButtonHover(null)}
        >
            복지도움
        </button>
        <button
            style={hoveredButton === '서비스 이용 문의' ? buttonhover : custombutton}
            onClick={() => handleButtonClick('서비스 이용 문의')}
            onMouseEnter={() => handleButtonHover('서비스 이용 문의')}
            onMouseLeave={() => handleButtonHover(null)}
        >
            서비스 이용 문의
        </button>
        <button
            style={hoveredButton === '대화가 필요할 때' ? buttonhover : custombutton}
            onClick={() => handleButtonClick('대화가 필요할 때')}
            onMouseEnter={() => handleButtonHover('대화가 필요할 때')}
            onMouseLeave={() => handleButtonHover(null)}
        >
            대화가 필요할 때
        </button>
    </>
)}
                        {isAdditionalButtonsVisible && (
                                <>
                                <ButtonGroup>
                                    <button
                                        style={hoveredButton === '주거급여' ? buttonhover : custombutton}
                                        onClick={() => handleAdditionalButtonClick('주거급여')}
                                        onMouseEnter={() => handleButtonHover('주거급여')}
                                        onMouseLeave={() => handleButtonHover(null)}
                                    >주거급여</button>
                                                            <button
                                        style={hoveredButton === '기초연금' ? buttonhover : custombutton}
                                        onClick={() => handleAdditionalButtonClick('기초연금')}
                                        onMouseEnter={() => handleButtonHover('기초연금')}
                                        onMouseLeave={() => handleButtonHover(null)}
                                    >기초연금</button>
                                                            <button
                                        style={hoveredButton === '생계급여' ? buttonhover : custombutton}
                                        onClick={() => handleAdditionalButtonClick('생계급여')}
                                        onMouseEnter={() => handleButtonHover('생계급여')}
                                        onMouseLeave={() => handleButtonHover(null)}
                                    >생계급여</button>
                                                            <button
                                        style={hoveredButton === '가정양육수당' ? buttonhover : custombutton}
                                        onClick={() => handleAdditionalButtonClick('가정양육수당')}
                                        onMouseEnter={() => handleButtonHover('가정양육수당')}
                                        onMouseLeave={() => handleButtonHover(null)}
                                    >가정양육수당</button>
                                </ButtonGroup>

                                <ButtonGroup>
                                                        <button
                                    style={hoveredButton === '아동수당' ? buttonhover : custombutton}
                                    onClick={() => handleAdditionalButtonClick('아동수당')}
                                    onMouseEnter={() => handleButtonHover('아동수당')}
                                    onMouseLeave={() => handleButtonHover(null)}
                                >아동수당</button>
                                                        <button
                                    style={hoveredButton === '의료급여' ? buttonhover : custombutton}
                                    onClick={() => handleAdditionalButtonClick('의료급여')}
                                    onMouseEnter={() => handleButtonHover('의료급여')}
                                    onMouseLeave={() => handleButtonHover(null)}
                                >의료급여</button>
                                                        <button
                                    style={hoveredButton === '교육급여' ? buttonhover : custombutton}
                                    onClick={() => handleAdditionalButtonClick('교육급여')}
                                    onMouseEnter={() => handleButtonHover('교육급여')}
                                    onMouseLeave={() => handleButtonHover(null)}
                                >교육급여</button>
                                                        <button
                                    style={hoveredButton === '유아학비' ? buttonhover : custombutton}
                                    onClick={() => handleAdditionalButtonClick('유아학비')}
                                    onMouseEnter={() => handleButtonHover('유아학비')}
                                    onMouseLeave={() => handleButtonHover(null)}
                                >유아학비</button>

                                </ButtonGroup>

                                <ButtonGroup>
                                                        <button
                                    style={hoveredButton === '이동통신요금감면' ? buttonhover : custombutton}
                                    onClick={() => handleAdditionalButtonClick('이동통신요금감면')}
                                    onMouseEnter={() => handleButtonHover('이동통신요금감면')}
                                    onMouseLeave={() => handleButtonHover(null)}
                                >이동통신요금감면</button>
                                                        <button
                                    style={hoveredButton === '청년희망키움통장' ? buttonhover : custombutton}
                                    onClick={() => handleAdditionalButtonClick('청년희망키움통장')}
                                    onMouseEnter={() => handleButtonHover('청년희망키움통장')}
                                    onMouseLeave={() => handleButtonHover(null)}
                                >청년희망키움통장</button>
                                                        <button
                                    style={hoveredButton === '장애수당' ? buttonhover : custombutton}
                                    onClick={() => handleAdditionalButtonClick('장애수당')}
                                    onMouseEnter={() => handleButtonHover('장애수당')}
                                    onMouseLeave={() => handleButtonHover(null)}
                                >장애수당</button>
                                </ButtonGroup>
                                </>
                        )}

                        {isAdditionalButtonsVisible5 && (
                                                    <>
                                                        <button
                                    style={hoveredButton === '챗봇' ? buttonhover : custombutton}
                                    onClick={() => handleButtonClick2('챗봇')}
                                    onMouseEnter={() => handleButtonHover('챗봇')}
                                    onMouseLeave={() => handleButtonHover(null)}
                                >챗봇</button>
                                                        <button
                                    style={hoveredButton === '지도' ? buttonhover : custombutton}
                                    onClick={() => handleButtonClick2('지도')}
                                    onMouseEnter={() => handleButtonHover('지도')}
                                    onMouseLeave={() => handleButtonHover(null)}
                                >지도</button>
                                                        <button
                                    style={hoveredButton === '얼굴 인식' ? buttonhover : custombutton}
                                    onClick={() => handleButtonClick2('얼굴 인식')}
                                    onMouseEnter={() => handleButtonHover('얼굴 인식')}
                                    onMouseLeave={() => handleButtonHover(null)}
                                >얼굴 인식</button>
                                                    </>
                                                )}

                        <button style = {{...custombutton, background:"#b7b7b7", color:"white"}} onClick={() => handleAdditionalButtonClick('처음으로')}>처음으로</button>
                    
                        
                    </MessageList>
                    <MessageInput placeholder="챗봇에게 메시지 보내기" onSend={handleSend} />
                </ChatContainer>
            </MainContainer>
        </div>

    </div>

    
    );
}

export default ChatBotpage;
/*<ThemeProvider theme={theme}>
            <ChatBot
                headerTitle="사회복지 chatbot"
                steps={steps}
                handleUserMessage={handleUserMessage} 
                />
        </ThemeProvider>
*/

/*
const API_KEY = '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';

function ChatBotpage() {
    const [typing, setTyping] = useState(false);
    const [messages, setMessages] = useState([
        {
            message: "안녕하세요! 무엇을 도와드릴까요?",
            sender: "ChatGPT"
        }
    ]);

    const handleSend = async (message) => {
        const newMessage = {
            message: message,
            sender: "user",
            direction: "outgoing"
        };
        const newMessages = [...messages, newMessage];

        setMessages(newMessages);
        setTyping(true);
        await processingMessageToChatGPT(newMessages);
    }

    async function processingMessageToChatGPT(chatMessages){
        let apiMessages = chatMessages.map((messageObject) => {
            let role = "";
            if(messageObject.sender ==="ChatGPT"){
                role="assistant"
            }else {
                role="user"
            }
            return {role: role, content: messageObject.message}
        });

        const systemMessage = {
            role: "system",
            content: "Explain all concepts like i am 70 years old."//내가 열살인것 처럼 설명해라
        }

        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                systemMessage,
                ...apiMessages
            ]
        }

        await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer "+API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        }).then((data)=> {
            return data.json();
        }).then((data)=> {
            console.log(data);
            console.log(data.choices[0].message.content);
            setMessages(
                [...chatMessages, {
                    message: data.choices[0].message.content,
                    sender: "ChatGPT"
                }]
            );
            setTyping(false);
        });
    }


    return (
        <div style={{position: "relative", height: '500px', width: "800px"}}>
            <MainContainer>
                <ChatContainer>
                    <MessageList 
                        scrollBehavior="smooth"
                        typingIndicator = {typing ? <TypingIndicator content="입력중입니다..." /> : null}
                    >
                        {messages.map((message, i) => {
                            return <Message key= {i} model = {message} />
                        })}

        

                    </MessageList>
                    <MessageInput placeholder="여기에 입력해주세요." onSend={handleSend} />
                </ChatContainer>
            </MainContainer>
        </div>
        );
}

export default ChatBotpage;


*/
