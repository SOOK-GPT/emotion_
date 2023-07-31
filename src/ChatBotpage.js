import React, { useState, useEffect } from "react";
import ChatBot from 'react-simple-chatbot';
import {ThemeProvider} from 'styled-components';
import { Configuration, OpenAIApi } from "openai"; // Import the required OpenAI classes

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

const theme = {
    background: '#f5f8fb',
    fontFamily: 'Helvetica Neue',
    headerBgColor: '#71a894',
    headerFontColor: '#fff',
    headerFontSize: '15px',
    botBubbleColor: '#71a894',
    botFontColor: '#fff',
    userBubbleColor: '#fff',
    userFontColor: '#4a4a4a',
};
    
const steps = [
    {
        id: '1',
        message: '안녕하세요? 사회복지 전문 챗봇입니다. 당신의 이름은 무엇인가요?',
        trigger: '2',
        },
        {
            id: '2',
            user: true,
            trigger: '3',
        },
        {
            id: '3',
            message: '안녕하세요 {previousValue}님, 만나서 반갑습니다!',
            trigger: '4'
        },
        {
            id: '4',
            message: '제가 어떤 부분을 도와드릴까요?',
            trigger: '5'
        },
        {
            id: '5',
            user: true,
            trigger: '6',
        },
        {
            id: '6',
            message: ({ previousValue }) => {
                //console.log(previousValue);
                const value = apiCall(previousValue);
                return `${previousValue}가 궁금하신거군요. 잠시만 기다리세요...`;
            },
            trigger: '7',
        },
        {
            id: '7',
            message: '안녕안녕',
            trigger: '8',
        },
        {
            id: '8',
            message: '우엥',
            end: true,
        },
];



function ChatBotpage() {
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
    //apiCall('감자');
    return (
    <div style={{
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '10px'
    }}>
        <ThemeProvider theme={theme}>
            <ChatBot
                margin="auto"
                width="85vw"
                height="85vh"
                steps={steps}
                handleUserMessage={handleUserMessage} 
                />
        </ThemeProvider>
        
    </div>
    );
}

export default ChatBotpage;