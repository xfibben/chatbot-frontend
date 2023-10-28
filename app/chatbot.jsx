"use client";
import {useState} from 'react';

const Chatbot = () => {
  // Estado para controlar la visibilidad del chatbot
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [buttonVisible,setButtonVisible]=useState(true)

  const toggleChatbot = () => {
    setChatbotVisible(!chatbotVisible);
    setButtonVisible(buttonVisible)
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
        <div className="m-4 border-gray-900 bg-gray-200 h-full w-full">
          {/* Aquí puedes integrar la lógica de tu chatbot */}
          <p className='text-center'>Bienvenido al chatbot</p>
          {/* Añade la lógica de respuesta del chatbot aquí */}
          <div>
            <div>
              <h1>Netrada</h1>

            </div>
            <div>
              <h1 className='ml-auto mr-0 '>Salida</h1>

            </div>

            <div>
              <input></input>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default Chatbot;
