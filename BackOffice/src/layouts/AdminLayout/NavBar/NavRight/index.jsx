import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// react-bootstrap
import { ListGroup, Dropdown, Card } from 'react-bootstrap';

// third party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project import
import ChatList from './ChatList';
// assets
import avatar1 from '../../../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../../../assets/images/user/avatar-3.jpg';
import avatar4 from '../../../../assets/images/user/avatar-4.jpg';
import { useLogout } from 'hooks/useLogout';
import axios from 'axios';
import io from 'socket.io-client';
import { playSound } from '../../../../playSound';
import notificationSound from '../../../../Whatsapp Message Ringtone Download.mp3'


// ==============================|| NAV RIGHT ||============================== //

const NavRight = () => {
  const [listOpen, setListOpen] = useState(false);
  const [user, setUser]= useState({})
  const [notifications, setNotifications]=useState([])
  const socket = io('http://localhost:8070'); // adjust to your backend URL
  const audioPlayer = useRef(null);

/* 
  useEffect(() => {
    // Register user with backend

  }, []); */


  useEffect(()=>{
    const currentUser = JSON.parse(localStorage.getItem('user'))
    setUser( JSON.parse(localStorage.getItem('user')))
    console.log(JSON.parse(localStorage.getItem('user')))

    if(['HEAD_DEPARTEMENT', 'ADMIN_HR'].includes(currentUser.role)){
             // Register user with backend
      socket.emit('register_user', currentUser._id);

      axios.get(`http://localhost:8070/api/notifications/${currentUser._id}`)
      .then((res)=>{
        console.log("res notif:",res.data)
        setNotifications(res.data.reverse())
      })
      .catch((err)=>{
        console.log("err ", err)
      })

      // Listen for notifications
        socket.on('receive_notification', (data) => {
        console.log('receive_notification: ',data)
        if(data.recipientId===currentUser._id){
          setNotifications((prev) => [data, ...prev]);
          audioPlayer.current.play()
        }
      });
    }

               
      return () => {
        socket.disconnect();
      };


  },[])
  const nav = useNavigate()
    const logout = useLogout()
    

    const handleLogout =()=>{
        logout()
        nav('/auth/signin-1')
     }

  const notiData = [
    {
      name: 'Joseph William',
      image: avatar2,
      details: 'Purchase New Theme and make payment',
      activity: '30 min'
    },
    {
      name: 'Sara Soudein',
      image: avatar3,
      details: 'currently login',
      activity: '30 min'
    },
    {
      name: 'Suzen',
      image: avatar4,
      details: 'Purchase New Theme and make payment',
      activity: 'yesterday'
    }
  ];
  function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date; // difference in milliseconds
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
  
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHour < 24) return `${diffHour} h ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  
    return date.toLocaleDateString(); // fallback to date format
  }
  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto">
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="end">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <i className="feather icon-bell icon" />
              <span className="badge rounded-pill bg-danger">
                <span />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="notification notification-scroll">
              <div className="noti-head">
                <h6 className="d-inline-block m-b-0">Notifications</h6>
                <div className="float-end">
                  <Link to="#" style={{ textDecoration: 'none' }} className="m-r-10">
                    mark as read
                  </Link>
                  <Link style={{ textDecoration: 'none' }} to="#">
                    clear all
                  </Link>
                </div>
              </div>
              <PerfectScrollbar>
                <ListGroup as="ul" bsPrefix=" " variant="flush" className="noti-body">
                  <ListGroup.Item as="li" bsPrefix=" " className="n-title">
                    <p className="m-b-0">NEW</p>
                  </ListGroup.Item>
                  {notifications.map((data, index) => {
                    return (
                      <ListGroup.Item key={index} as="li" bsPrefix=" " className="notification">
                        <Card
                          className="d-flex align-items-center shadow-none mb-0 p-0"
                          style={{ flexDirection: 'row', backgroundColor: 'unset' }}
                        >
                          <img className="img-radius" src={data.senderId.image} alt="Generic placeholder" />
                          <Card.Body className="p-0">
                            <p>
                              <strong>{data.relatedOfferId.title}</strong>
                              <span className="n-time text-muted">
                                <i className="icon feather icon-clock me-2" />
                                {timeAgo(data.createdAt)}
                              </span>
                            </p>
                            <p>{data.message}</p>
                          </Card.Body>
                          <audio ref={audioPlayer} src={notificationSound} />

                        </Card>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </PerfectScrollbar>
              <div className="noti-footer">
                <Link to="#">show all</Link>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="end" className="drp-user">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <img src={user.image || "https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=600"} className="img-radius wid-40" alt="User Profile" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-notification">
              <div className="pro-head">
                <img src={user.image || "https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=600"} className="img-radius" alt="User Profile" />
                <span>{user.firstname + " "+user.lastname}</span>
                <div className="dud-logout" title="Logout" onClick={()=>handleLogout()}>
                  <i className="feather icon-log-out" />
                </div>
              </div>
              <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-settings" /> Settings
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="/app/dashboard/profile" className="dropdown-item">
                    <i className="feather icon-user" /> Profile
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-mail" /> My Messages
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-lock" /> Lock Screen
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <div className="dropdown-item" onClick={()=>handleLogout()}>
                    <i className="feather icon-log-out" /> Logout
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
      <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
    </React.Fragment>
  );
};

export default NavRight;
