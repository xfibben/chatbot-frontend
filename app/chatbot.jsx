"use client";
import {useState} from 'react';

const Chatbot = () => {
  // Estado para controlar la visibilidad del chatbot
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [buttonVisible,setButtonVisible]=useState(true)

  const toggleChatbot = () => {
    setChatbotVisible(!chatbotVisible);
    setButtonVisible(!buttonVisible)
  };

  return (
    <div className="chatbot-container">
      {buttonVisible && (<img
        src="ruta-de-tu-imagen-pequena.png"
        alt="Activar Chatbot"
        onClick={toggleChatbot}
      />
      )}

      {chatbotVisible && (
        <div className="chatbot">
          {/* Aquí puedes integrar la lógica de tu chatbot */}
          <p>Bienvenido al chatbot</p>
          {/* Añade la lógica de respuesta del chatbot aquí */}
        </div>
      )}

      
    </div>
  );
};

export default Chatbot;
