import React, { useState, useEffect, useRef } from 'react';
import './chatRooms.scss';
import ChatMessages from 'components/ChatMessages/chatMessages';
import axios from 'axios';

const Chatroom = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [filterText, setFilterText]=useState("")
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user")) 
  const [conversations, setConversations] = useState([])


  const handleCreateChat = ()=>{
    axios.post(`http://localhost:8070/api/conversations/`)
    .then((res)=>{
      setConversations(...conversations, res.data)
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  
/*   const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Team Collaboration',
      lastMessage: 'Hey team, how is the project going?',
      time: '10:30 AM',
      unread: 2,
      avatar: '👥',
      online: true,
      status: 'active'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      lastMessage: 'Can we meet tomorrow?',
      time: 'Yesterday',
      unread: 0,
      avatar: '👩',
      online: true,
      status: 'away'
    },
    {
      id: 3,
      name: 'Design Group',
      lastMessage: 'New mockups are ready!',
      time: 'Yesterday',
      unread: 5,
      avatar: '🎨',
      online: false,
      status: 'offline'
    },
    {
      id: 4,
      name: 'Mom',
      lastMessage: 'Call me when you get home',
      time: 'Tuesday',
      unread: 0,
      avatar: '👵',
      online: false,
      status: 'offline'
    },
    {
        id: 5,
        name: 'Mom',
        lastMessage: 'Call me when you get home',
        time: 'Tuesday',
        unread: 0,
        avatar: '👵',
        online: false,
        status: 'offline'
      },
      {
        id: 6,
        name: 'Mom',
        lastMessage: 'Call me when you get home',
        time: 'Tuesday',
        unread: 0,
        avatar: '👵',
        online: false,
        status: 'offline'
      },
      {
        id: 8,
        name: 'Mom',
        lastMessage: 'Call me when you get home',
        time: 'Tuesday',
        unread: 0,
        avatar: '👵',
        online: false,
        status: 'offline'
      },
    {
      id: 9,
      name: 'Tech Support',
      lastMessage: 'Your issue has been resolved',
      time: 'Monday',
      unread: 0,
      avatar: '🛠️',
      online: true,
      status: 'active'
    }
  ]); */

  const [filteredConversations, setFilteredConversations]=useState(conversations)

  const filterConversation = (text)=>{
    if(text.trim()!=""){
      setFilterText(text)
      setFilteredConversations(conversations.filter(c=>c.name.toLowerCase().includes(text.toLowerCase())))
    }else{
      setFilterText('')
      setFilteredConversations(conversations)  

    }
 }


  useEffect( ()=>{
    axios.get(`http://localhost:8070/api/conversations/${user._id}`)
    .then((res)=>{
      if(res.data){
        setConversations(res.data)
        setFilteredConversations(res.data)
        setActiveChat(res.data[0]._id)
      }
      
    })
    .catch((err)=>{
      console.log(err)
    })

  },[])


  return (
    <div className={`chatroom-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="user-profile">
            <div className="avatar">
              <img src={ user?.image || "https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=600" } 
                        alt="👤" srcset="" />
            </div>
            <div className="user-info">
              <h3>{user.firstname + " " + user.lastname}</h3>
              <p className="status">Online</p>
            </div>
          </div>

        </div>
        
        <div className="search-bar">
          <input 
          type="text" 
          placeholder="Search conversations..." 
          value={filterText}
          onChange={(e) => filterConversation(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="conversation-list">
          {conversations.length >0 ?  (
                filteredConversations.length > 0 ? (
                  filteredConversations.map(chat => (
                    <div 
                      key={chat._id}
                      className={`conversation ${activeChat === chat._id ? 'active' : ''}`}
                      onClick={() => setActiveChat(chat._id)}
                    >
                      <div className={`avatar ${chat.online ? 'online' : ''} ${chat.status}`}>
                      { chat.name !=="private chat" && (chat.avatar || '👥') }
                      {chat.name ==="private chat" && user.role === "ADMIN_HR" &&
                        <img src={ chat.chatParticipants[0]?.image || "https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=600" } 
                        alt="👤" srcset="" />
                       }
                       {chat.name ==="private chat" && user.role !== "ADMIN_HR" &&
                        <img src={ chat.chatParticipants[1]?.image || "https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=600" } 
                        alt="👤" srcset="" />
                       }
                        {chat.online && <span className="online-dot"></span>}
                      </div>
                      <div className="conversation-info">
                        <div className="conversation-header">
                          <h3>{chat.name==="private chat" ? user.role === "ADMIN_HR" ? chat.chatParticipants[0].firstname + " "+ chat.chatParticipants[0].lastname: chat.chatParticipants[1].firstname + " "+ chat.chatParticipants[1].lastname: chat.name}</h3>
                          <span className="time">{chat.time}</span>
                        </div>
                        <p className="last-message">{chat.lastMessage}</p>
                        {chat.unread > 0 && <span className="unread-badge">{chat.unread}</span>}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-chats">
                    <p>No conversations match your search.</p>
                    <span className="no-chats-icon">🔍</span>
                    <small>Try a different name or keyword</small>
                  </div>
                )
             ) 
          :
              <div className="no-chats">
                <p>No conversations yet</p>
                <span className="no-chats-icon">💬</span>
                <small>Start a new chat to see it here</small>
              </div>
          }
        </div>
      </div>
      
      <div className="chat-area">
        {activeChat!=null ? 
                <ChatMessages chatId={activeChat}/>
                :
                <div className="no-chat-selected">
                  <div className="illustration">💬</div>
                  <h2>Select a chat to start messaging</h2>
                  <p>Or create a new conversation</p>
                  <button className="new-chat-btn" onClick={handleCreateChat}>Start New Chat</button>
                </div>
        }
      </div>
      
      
    </div>
  );
};

export default Chatroom;