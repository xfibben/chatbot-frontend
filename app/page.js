import Image from 'next/image'
import Chatbot from './chatbot'
import Message from './components/messages'
export default function Home() {
  return (
    
    <main>
      <h1>CHatbot</h1>
      <Chatbot/>
      <Message/>
    </main>
  )
}

