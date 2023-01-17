import React, { useEffect, useState, useRef  } from 'react';
import { FiLogOut } from "react-icons/fi";
import { AiOutlineSend } from "react-icons/ai";

import './style.css'

export default function Chats({socket, userName, room, clearFields}) {
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState([])
  const element = useRef(null);

  useEffect(() => {
    socket.on("receive_message", receiveMessage)
  }, [socket])

  const sendMessage = async() => {
    if (!newMessage) return

    const messageObj = {
      room,
      author: userName,
      message: newMessage,
      time: new Date().getHours() + ':' + new Date().getMinutes()
    }

    await socket.emit("send_message", messageObj)
    setMessages((list) => [...list, messageObj])
    setNewMessage("")
    element.current?.scrollIntoView();
  }

  const receiveMessage = (data) => {
    setMessages((list) => [...list, data])
  }

  const getOut = async() => {
    const messageObj = {
      room,
      author: null,
      message: `${userName} left the chat.`,
      time: new Date().getHours() + ':' + new Date().getMinutes()
    }

    await socket.emit("send_message", messageObj)

    await socket.disconnect()
    clearFields()
    await socket.connect()
  }

  return (
    <div className='chat-window'>
        <div className="chat-header">
          <p className='room'>Room: {room}</p>
          <p className='live-chat'>Live Chat</p>
          <button
            type='button'
            title='Leave'
            className='leave'
            onClick={getOut}>
              <FiLogOut size={22} color="#f7f7f7" />
            </button>
        </div>

        <div className="chat-body">
          <div className='message-container'>
            {messages?.map((msg) => (
              <div 
                key={`${Math.random() * 10}-${msg.message}`} 
                className={`message ${!msg.author ? "leave" : msg.author === userName ? "you" : "other"}`}
              >
                <div>
                  <div className={msg.author ? 'message-content' : 'leave-content'}>
                    <p>{msg.message}</p>
                  </div>
                  <div className="message-meta">
                    <p className='time'>{msg.time}</p>
                    <p className='author'>{msg.author}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={element} className='teste'></div>
          </div>
        </div>

        <div className="chat-footer">
          <input 
            type="text" 
            value={newMessage}
            placeholder='Message' 
            onChange={e => {setNewMessage(e.target.value)}}
            onKeyDown={e => {e.key === "Enter" && sendMessage()}}
          />
          
          <button
            type='button'
            onClick={sendMessage}
            title='Send'
          >
            <AiOutlineSend size={22} color="#49BF9D" />
          </button>
        </div>
    </div>
  );
}