import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import socket from '../../services/socket';
import Chats from '../Chats';
import './style.css'

export default function Home() {
    const [userName, setUsername] = useState("")
    const [room, setRoom] = useState("")
    const [showChats, setShowChats] = useState(false)

    const joinRoom = async () => {
        if(!userName && !room ) {
            toast.error('Type your name and a Room name.')
            return
        } else if (!userName) {
            toast.error('Type your name.')
            return
        } else if (!room) {
            toast.error('Type a room name.')
            return
        }
        await socket.emit("join_room", room)
        setShowChats(true)
    }

    const clearFields = () => {
        setUsername('')
        setRoom('')
        setShowChats(false)
    }

    return (
        <div>
            <ToastContainer autoClose={3000} position="top-right" />
            {!showChats ?
                <div className='home-container'>
                    <h3>Live Chat</h3>
                    <input 
                        type="text" 
                        placeholder='Your name'
                        maxLength={25}
                        onChange={e => {setUsername(e.target.value)}}
                    />
                    
                    <input 
                        type="text" 
                        placeholder='Room name'
                        maxLength={5}
                        onChange={e => {setRoom(e.target.value)}}
                    />

                    <button
                        type='button'
                        onClick={joinRoom}
                    >Join a Room</button>
                </div>
            :
                <Chats socket={socket} userName={userName} room={room} clearFields={clearFields}/>
            }
        </div>
    );
}