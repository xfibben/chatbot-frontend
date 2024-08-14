'use client'; import { useState, useEffect, useRef } from "react"; import "react-resizable/css/styles.css"; import "/src/app/globals.css"; import { BsMicFill } from "react-icons/bs"; import { FiSettings } from "react-icons/fi"; import { v4 as uuidv4 } from 'uuid';

export default function Chat() {
    const [inputText, setInputText] = useState(""), [messages, setMessages] = useState([]), [buttons, setButtons] = useState([]), [bgColor, setBgColor] = useState("#ffffff"), [logoImage, setLogoImage] = useState("/default-logo.png"), [isSettingsOpen, setIsSettingsOpen] = useState(false), [isDarkMode, setIsDarkMode] = useState(false), [isListening, setIsListening] = useState(false), [userBubbleColor, setUserBubbleColor] = useState("#3b82f6"), [botBubbleColor, setBotBubbleColor] = useState("#e5e7eb"), [fontSize, setFontSize] = useState(16), [shakeMessageId, setShakeMessageId] = useState(null), [conversations, setConversations] = useState([]), [currentConversationId, setCurrentConversationId] = useState(null); 
    const recognitionRef = useRef(null), messagesEndRef = useRef(null);

    useEffect(() => {
        const savedConversations = JSON.parse(localStorage.getItem('conversations')) || [], savedSettings = JSON.parse(localStorage.getItem('chatSettings')) || {}; 
        setConversations(savedConversations); 
        setBgColor(savedSettings.bgColor || "#ffffff"); 
        setLogoImage(savedSettings.logoImage || "/default-logo.png"); 
        setIsDarkMode(savedSettings.isDarkMode || false); 
        setUserBubbleColor(savedSettings.userBubbleColor || "#3b82f6"); 
        setBotBubbleColor(savedSettings.botBubbleColor || "#e5e7eb"); 
        setFontSize(savedSettings.fontSize || 16);
    }, []);

    useEffect(() => { if (conversations.length > 0) localStorage.setItem('conversations', JSON.stringify(conversations)); }, [conversations]);

    useEffect(() => {
        const settings = { bgColor, logoImage, isDarkMode, userBubbleColor, botBubbleColor, fontSize };
        localStorage.setItem('chatSettings', JSON.stringify(settings));
    }, [bgColor, logoImage, isDarkMode, userBubbleColor, botBubbleColor, fontSize]);

    useEffect(() => { if (shakeMessageId) { const timeout = setTimeout(() => setShakeMessageId(null), 500); return () => clearTimeout(timeout); } }, [shakeMessageId]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = 'es-ES'; recognition.continuous = false; recognition.interimResults = false;
            recognition.onstart = () => setIsListening(true); recognition.onresult = event => setInputText(event.results[0][0].transcript); recognition.onerror = event => console.error('Error en el reconocimiento de voz: ', event.error); recognition.onend = () => setIsListening(false);
            recognitionRef.current = recognition;
        } else {
            console.error("Este navegador no soporta la API de Web Speech para reconocimiento de voz.");
        }
    }, []);

    const handleInput = e => setInputText(e.target.value);

    const handleKeyPress = e => { if (e.key === "Enter" && inputText.trim()) sendMessage(inputText); };

    const sendMessage = async (payload, buttonTitle = null) => {
        const newMessage = { type: 'user', text: buttonTitle ? buttonTitle : inputText };
        setMessages(prevMessages => [...prevMessages, newMessage]);

        setConversations(prev => {
            const updatedConversations = prev.map(conv => {
                if (conv.id === currentConversationId) {
                    return { ...conv, messages: [...conv.messages, newMessage] };
                }
                return conv;
            });
            return updatedConversations;
        });

        setReseponsetoDb(newMessage.text); setInputText('');

        const response = await getResponse(payload);
        const botMessage = { type: 'bot', text: response.text };

        setMessages(prevMessages => [...prevMessages, botMessage]);
        setConversations(prev => {
            const updatedConversations = prev.map(conv => {
                if (conv.id === currentConversationId) {
                    return { ...conv, messages: [...conv.messages, botMessage] };
                }
                return conv;
            });
            return updatedConversations;
        });

        setButtons(response.buttons);
    };

    const getResponse = async text => {
        const response = await fetch("http://localhost:5005/webhooks/rest/webhook", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text }) });
        return (await response.json())[0];
    };

    const setReseponsetoDb = async message => {
        const response = await fetch("http://localhost:5060/chatbot/text", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) });
        return await response.json();
    };

    const handleBgColorChange = e => { setIsDarkMode(false); setBgColor(e.target.value); };

    const handleLogoImageChange = e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = event => setLogoImage(event.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleUserBubbleColorChange = e => setUserBubbleColor(e.target.value);

    const handleBotBubbleColorChange = e => setBotBubbleColor(e.target.value);

    const handleFontSizeChange = e => setFontSize(parseInt(e.target.value, 10));

    const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

    const toggleDarkMode = () => {
        setBgColor(isDarkMode ? "#ffffff" : "#1a202c");
        setIsDarkMode(!isDarkMode);
    };

    const startListening = () => { if (recognitionRef.current && !isListening) recognitionRef.current.start(); };

    const stopListening = () => { if (recognitionRef.current && isListening) recognitionRef.current.stop(); };

    const speakMessage = (message, id) => {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'es-ES';
        speechSynthesis.speak(utterance);
        setShakeMessageId(id);
    };

    const handleConversationClick = conversationId => {
        const conversation = conversations.find(conv => conv.id === conversationId);
        if (conversation) {
            setMessages(conversation.messages);
            setCurrentConversationId(conversationId);
        }
    };

    const handleNewConversation = () => {
        const newConversation = { id: uuidv4(), messages: [] };
        setConversations(prev => [...prev, newConversation]);
        setMessages([]);
        setCurrentConversationId(newConversation.id);
    };

    return (
        <div className={`chatbot h-screen w-screen flex`} style={{ backgroundColor: bgColor }}>
            <div className="w-1/4 h-full bg-gray-200 p-4 overflow-auto">
                <h2 className="text-lg font-bold mb-4">Conversaciones</h2>
                <button className="w-full mb-4 p-2 bg-blue-500 text-white rounded" onClick={handleNewConversation}>Nueva Conversación</button>
                <ul>
                    {conversations.map((conversation, index) => (
                        <li key={conversation.id} className="mb-2">
                            <button className="w-full text-left p-2 bg-gray-300 rounded" onClick={() => handleConversationClick(conversation.id)}>Conversación {index + 1}</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={`relative w-3/4 h-full flex flex-col`}>
                <div className="absolute top-4 left-4 flex items-center">
                    <img src={logoImage} alt="Logo" className="h-20 w-20 rounded-full border-4 border-orange-600 object-contain mr-4 shadow-lg" />
                    <button className="text-black bg-gray-300 rounded-full p-2" onClick={toggleSettings}><FiSettings size={24} /></button>
                    {isSettingsOpen && (
                        <div className={`absolute top-full left-0 mt-2 p-4 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"} shadow-lg rounded-lg z-10`}>
                            <div className="flex flex-col space-y-2">
                                <label className="flex items-center"><span className="mr-2">Color de fondo:</span><input type="color" value={bgColor} onChange={handleBgColorChange} /></label>
                                <label className="flex items-center"><span className="mr-2">Cambiar logo:</span><input type="file" accept="image/*" onChange={handleLogoImageChange} /></label>
                                <label className="flex items-center"><span className="mr-2">Color de burbuja de usuario:</span><input type="color" value={userBubbleColor} onChange={handleUserBubbleColorChange} /></label>
                                <label className="flex items-center"><span className="mr-2">Color de burbuja del bot:</span><input type="color" value={botBubbleColor} onChange={handleBotBubbleColorChange} /></label>
                                <label className="flex items-center"><span className="mr-2">Tamaño de letra:</span><input type="number" value={fontSize} onChange={handleFontSizeChange} min="10" max="30" /></label>
                                <label className="flex items-center"><span className="mr-2">Modo oscuro:</span><input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} /></label>
                            </div>
                        </div>
                    )}
                </div>
                <div className={`p-4 h-full flex flex-col rounded-xl shadow-md ${isDarkMode ? "bg-gray-900" : "bg-white"}`} style={{ backgroundColor: bgColor }}>
                    <div className="flex-1 overflow-auto w-full flex flex-col space-y-2 p-3">
                        {messages.map((message, index) => {
                            const isUserMessage = message.type === 'user', isLink = /^https?:\/\//.test(message.text);
                            return isLink ? (
                                <a key={index} href={message.text} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg ${isUserMessage ? 'self-end' : 'self-start'} ${shakeMessageId === index ? 'animate-shake' : ''}`} style={{ backgroundColor: isUserMessage ? userBubbleColor : botBubbleColor, color: isUserMessage ? 'white' : 'black', fontSize: `${fontSize}px` }} onClick={() => speakMessage(message.text, index)}>{message.text}</a>
                            ) : (
                                <div key={index} className={`p-2 rounded-lg ${isUserMessage ? 'self-end' : 'self-start'} ${shakeMessageId === index ? 'animate-shake' : ''}`} style={{ backgroundColor: isUserMessage ? userBubbleColor : botBubbleColor, color: isUserMessage ? 'white' : 'black', fontSize: `${fontSize}px` }} onClick={() => speakMessage(message.text, index)}>{message.text}</div>
                            );
                        })}
                        {buttons && buttons.map(button => (
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-5 self-center" key={button.title} onClick={() => sendMessage(button.payload, button.title)}>{button.title}</button>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="w-full flex items-center">
                        <button className={`px-4 py-2 rounded-lg ${isListening ? "bg-green-500 animate-breathing" : isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"}`} style={isListening ? { transform: 'scale(1.2)' } : { transform: 'scale(1)' }} onMouseDown={startListening} onMouseUp={stopListening}><BsMicFill /></button>
                        <input className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500 ml-2 ${isDarkMode ? "bg-gray-800 text-white border-gray-700" : "text-gray-700"}`} value={inputText} onChange={handleInput} onKeyPress={handleKeyPress} placeholder="Escribe un mensaje" />
                        <button className={`ml-2 px-4 py-2 rounded-lg ${isDarkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"}`} onClick={() => sendMessage(inputText)}>Enviar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
