'use client';
import { useState, useEffect } from "react";

export default function Chat (){
    const [inputText, setInputText] = useState("");
    const [responseText, setResponseText] = useState(null);
    const [buttons, setButtons] = useState([]);

    const handleInput = (e) => {
        setInputText(e.target.value);
    };

    const sendMessage = async (payload) => {
        setInputText(payload);
        console.log('enviado');
        const response = await getResponse();
        const text = response.text;
        const buttons = response.buttons;
        setButtons(buttons);
        setResponseText(text);
        setInputText('');
    }

    const getResponse = async () => {
        const response = await fetch("http://localhost:5005/webhooks/rest/webhook/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: inputText }),
        });
        const data = await response.json();
        return data[0];
    };

    return(
        <div>
            <input onChange={handleInput} value={inputText}/>
            <button onClick={() => sendMessage(inputText)}>Enviar</button>
            {responseText && <p>{responseText}</p>}
            {buttons && buttons.map((button) => (
                <button className="bg-red-500 m-5" key={button.title} onClick={() => sendMessage(button.payload)}>{button.title}</button>
            ))}
        </div>
    );
};