'use client';
import { useState, useEffect } from "react";

export default function Chat (){
    const [inputText, setInputText] = useState("");
    const [responseText, setResponseText] = useState(null);

    const handleInput = (e) => {
        setInputText(e.target.value);
    };

    const sendMessage = async () => {
        console.log('enviado');
        const response = await getResponse();
        setResponseText(response);
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
        console.log(data);
        return data[0].text;
    };

    return(
        <div>
            <input onChange={handleInput}/>
            <button onClick={sendMessage}>Enviar</button>
            {responseText && <p>{responseText}</p>}
        </div>
    );
};