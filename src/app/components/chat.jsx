'use client';
import { useState, useEffect, useRef } from "react";

import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import "/src/app/globals.css";

export default function Chat (){
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState([]);
    const [buttons, setButtons] = useState([]);
    const messagesEndRef = useRef(null);
    const [isChatbotVisible, setChatbotVisible] = useState(false);

    const toggleChatbot = () => {
        setChatbotVisible(!isChatbotVisible);
    };

    const handleInput = (e) => {
        setInputText(e.target.value);
    };

    const sendMessage = async (payload, buttonTitle = null) => {
    if (buttonTitle) {
        setMessages([...messages, { type: 'user', text: buttonTitle }]);
    } else {
        setMessages([...messages, { type: 'user', text: inputText }]);
    }
    setReseponsetoDb(inputText);
    setInputText(payload);
    const response = await getResponse(inputText);
    const text = response.text;
    const buttons = response.buttons;
    setButtons(buttons);
    setMessages(prevMessages => [...prevMessages, { type: 'bot', text: text }]);
    setInputText('');
}

    const getResponse = async (text) => {
        const response = await fetch("http://206.189.182.72:5005/webhooks/rest/webhook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: text }),
        });
        const data = await response.json();
        return data[0];
    };

    async function setReseponsetoDb (message){
        const response = await fetch("http://206.189.182.72:5000/chatbot/text", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: message }),
        });
        const data = await response.json();
        return data;
    };

    useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

    
    return (
    <>
        {isChatbotVisible ? (
            <div className="chatbot">
                <ResizableBox className="resize-container" width={400} height={600} minConstraints={[300, 300]} maxConstraints={[Infinity, Infinity]}>
                    <button className="absolute top-2  px-4 right-2 bg-red-500 text-white rounded-full p-2" onClick={toggleChatbot}>X</button>
                    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-y-4 h-full">
                        <div className="flex-1 overflow-auto w-full flex flex-col space-y-2 p-3">
                            {messages.map((message, index) => (
                                <div key={index} className={`p-2 rounded-lg ${message.type === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-black self-start'}`}>
                                    {message.text}
                                </div>
                            ))}
                            {buttons && buttons.map((button) => (
                                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-5 self-center" key={button.title} onClick={() => sendMessage(button.payload, button.title)}>{button.title}</button>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="w-full">
                            <input className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-green-500" value={inputText} onChange={handleInput}/>
                            <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={() => sendMessage(inputText)}>Enviar</button>
                        </div>
                    </div>
                </ResizableBox>
            </div>
        ) : (
            <button className="chat-button fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-4" onClick={toggleChatbot}>Preguntame</button>
        )}
    </>
);
};