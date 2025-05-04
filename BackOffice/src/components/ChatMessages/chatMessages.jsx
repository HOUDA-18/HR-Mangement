import React, { useState, useEffect, useRef } from 'react';
import './chatMessages.scss';
import io from 'socket.io-client';
import axios from 'axios';


const ChatMessages = ({chatId}) => {
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [filterText, setFilterText]=useState("")
  const messagesEndRef = useRef(null);
  const socket = io('http://localhost:8070'); // adjust to your backend URL

  

  const user = JSON.parse(localStorage.getItem("user"))
 



  const [messages, setMessages] = useState([]);

  const  formatDateBasedOnToday = (dateString)=> {
    const inputDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
  
    const isSameDay = (d1, d2) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();
  
    const formatTime = (date) =>
      date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  
    const time = formatTime(inputDate);
  
    if (isSameDay(inputDate, today)) {
      return `Today at ${time}`;
    } else if (isSameDay(inputDate, yesterday)) {
      return `Yesterday at ${time}`;
    } else {
      const datePart = inputDate.toLocaleDateString("en-GB"); // DD/MM/YYYY
      return `${datePart} at ${time}`;
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const messageData = {
      sender: user._id,
      text: message,
      timestamp: new Date().toISOString()
    };
    axios.post(`http://localhost:8070/api/messages/${chatId}`, messageData)
    .then((res)=>{
        console.log("res message:",res)
        setMessage('');

    })
    .catch((err)=>{
        console.log("res message:",res)
    })


   // socket.emit('send_message', messageData);
    setMessage('');
  };


  useEffect(() => {
    // Join room
    socket.emit('join_room', chatId);
    async function fetchData(){
        axios.get(`http://localhost:8070/api/conversation/${chatId}`)
        .then((res)=>{
            setActiveChat(res.data)
        })
        .catch((err)=>{
            console.log(err)
        })
        
        axios.get(`http://localhost:8070/api/messages/${chatId}`)
        .then((res)=>{
            console.log("res messages: ", res)
            setMessages(res.data)
        })
        .catch((err)=>{
            console.log("err messages: ", err)
        })
    }
   fetchData()

    // Receive messages
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    
    return () => {
        socket.disconnect();
      };
  }, [chatId]);

  return (   
    <> 
        {activeChat!=null ? (
          <>
            <div className="chat-header">
              <div className="chat-info">
                <div className={`avatar ${activeChat?.online ? 'online' : ''}`}>
                { activeChat.name !=="private chat" && (activeChat.avatar || '👥') }
                      {activeChat.name ==="private chat" && user.role === "ADMIN_HR" &&
                        <img src={ activeChat.chatParticipants[0]?.image || "https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=600" } 
                        alt="👤" srcset="" />
                       }
                       {activeChat.name ==="private chat" && user.role !== "ADMIN_HR" &&
                        <img src={ activeChat.chatParticipants[1]?.image || "https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=600" } 
                        alt="👤" srcset="" />
                       }
                  {activeChat?.online && <span className="online-dot"></span>}
                </div>
                <div className="chat-details">
                  <h2>{activeChat.name==="private chat" ? user.role === "ADMIN_HR" ? activeChat.chatParticipants[0].firstname + " "+ activeChat.chatParticipants[0].lastname: activeChat.chatParticipants[1].firstname + " "+ activeChat.chatParticipants[1].lastname: activeChat.name}</h2>
                  <p className="status">
                    {activeChat?.online ? 
                      activeChat?.status === 'active' ? 
                        'Online' : 'Away' : 
                      'Offline'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="messages-container">

              
              {messages?.map(msg => (
                <div key={msg._id} className={`message ${msg.sender._id === user._id? 'sent' : 'received'}`}>
                  {msg.sender._id !== user._id && (
                    <div className="sender-info">
                      <div className="sender-avatar">
                        <img src={msg.sender?.image || "https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=600" } alt="👤" srcset="" />
                        
                      </div>
                      <div className="sender-name">{msg.sender.firstname +" "+msg.sender.lastname}</div>
                    </div>
                  )}
                  <div className="message-content">
                    <p>{msg.text}</p>
                    <div className="message-footer">
                      <span className={`message-time ${msg.sender._id !== user._id ? "": "me"}`}>{formatDateBasedOnToday(msg.time)}</span>
                      {msg.sender._id === user._id && (
                        <span className={`message-status ${msg.status}`}>
                          {msg.status === 'read' ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="message-input-area">
              <div className="message-input">
                <textarea
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="1"
                />
              </div>
              <button 
                className="send-button" 
                onClick={sendMessage}
                disabled={!message.trim() || activeChat.archived==true}
              >
                {(message.trim() && !activeChat.archived) ? 'Send' : '🛑'}
              </button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="illustration">💬</div>
            <h2>Select a chat to start messaging</h2>
            <p>Or create a new conversation</p>
            <button className="new-chat-btn">Start New Chat</button>
          </div>
        )}
      
      </>   
  );
};

export default ChatMessages;