import React, { useState, useCallback, useContext, useEffect } from 'react';
import { Avatar, 
    MainContainer,
    Sidebar, 
    Conversation, 
} from '@chatscope/chat-ui-kit-react';
import { Menu, MenuItem } from '@szhsin/react-menu';
import { AiOutlineUser } from 'react-icons/ai'
import { BiLogOutCircle } from 'react-icons/bi'
import { BsKey } from 'react-icons/bs'
import { SiAboutdotme } from 'react-icons/si'
import { UserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import api from '../../axios'
import { IoContext } from '../../contexts/IoContext';
import { toast, ToastContainer } from 'react-toastify'
import ListOnline from './ListOnline';
import Chat from './Chat';
import ChatPublic from './ChatPublic';
import { confirmAlert } from 'react-confirm-alert'
import ChangePass from './ChangePass';
import ChangeProfile from './ChangeProfile';

function Home() {
    document.title = 'qnp | Chat Home'
    const navigate = useNavigate()
    const { user, setUser } = useContext(UserContext)
    const [ listUser, setListUser ] = useState()
    const [ sidebarVisible, setSidebarVisible ] = useState(window.innerWidth < 768)
    const [ sidebarStyle, setSidebarStyle ] = useState({})
    const [ chatContainerStyle, setChatContainerStyle ] = useState({})
    const [ chatId, setChatid ] = useState()
    const [ listIdActive, setListIdActive ] = useState([])
    const { socket } = useContext(IoContext)

    const handleLogout = ()=>{
        api.post('/auth/logout', {
            refreshToken: localStorage.getItem('refreshToken')
        })
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        setUser()
        socket.disconnect()
        navigate('/login', {replace: true})
    }
    const handleBackClick = () => setSidebarVisible(!sidebarVisible)
    const handleConversationClick = useCallback( e => {
        if (sidebarVisible) {
          setSidebarVisible(false);
        }
        setChatid(e)
    }, [ sidebarVisible ])

    const handleProfile = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <ChangeProfile close={onClose} data={user} setData={setUser}/>
                )
            }
        })
    }
    const handlePass = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <ChangePass close={onClose} logout={handleLogout}/>
                )
            }
        })
    }

    useEffect(() => {
        if (sidebarVisible) {
          setSidebarStyle({
            display: "flex",
            flexBasis: "auto",
            width: "100%",
            maxWidth: "100%"
          });
          setChatContainerStyle({
            display: "none"
          });
        } else {
          setSidebarStyle({});
          setChatContainerStyle({});
        }
    }, [ sidebarVisible ]);
    useEffect(() => {
        if (!localStorage.getItem('token') || !localStorage.getItem('refreshToken')){
            navigate('/login', {replace: true})
        }
    }, [ navigate ])
    useEffect(() => {
        if (localStorage.getItem('token') && localStorage.getItem('refreshToken') && !user){
            api.get('/user/id').then(res=> {
                if(res.data.success)
                    setUser({ id: res.data.id, avatar: res.data.avatar, per: res.data.per, name: res.data.name, socket: false})
                else
                    navigate('/login', {replace: true})
            })
        }
    }, [ navigate, setUser, user ])
    useEffect(() => {
        if(user && user.socket === false){
            socket.auth = { 
                id: user.id, 
                name: user.name, 
                avatar: user.avatar, 
            }
            socket.connect()
            setUser(prev => ({...prev, socket: true}))
        }
    }, [ socket, user, setUser ])
    useEffect(() => {
        if(user && !user.socket){
            socket.on('connect_error', err => {
                if (err.message === 'Auth false'){
                    setUser()
                    api.post('/auth/logout', {
                        refreshToken: localStorage.getItem('refreshToken')
                    })
                    localStorage.removeItem('token')
                    localStorage.removeItem('refreshToken')
                    navigate('/login', {replace: true})
                }
            })
        }
    }, [ socket, navigate, setUser, user ])
    useEffect(() => {
        if(!listUser){
            api.get('/user/all').then(res => {
                if(res.data.success){
                    setListUser(res.data.data)
                }else{
                    toast.error('Somethings wrong!')
                }
            })
        }
    }, [ listUser ])
    useEffect(() => {
        function handleResize() {
            setSidebarVisible(window.innerWidth < 768);
        }
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='colored'
            />
            <div className='header'>
                <div className='header-title'>qnp | Chat App</div>
                <div className='d-flex justify-content-end'>
                    {user && (
                    <Menu 
                        menuButton={<div className='header-img cursor-pointer'><img 
                            src={user.avatar}
                            alt='avatar'
                        /></div>}
                    >
                        <MenuItem onClick={handleProfile}>
                            <div><AiOutlineUser/> Edit Profile</div>
                        </MenuItem>
                        <MenuItem onClick={handlePass}>
                            <div><BsKey/> Change Password</div>
                        </MenuItem>
                        <MenuItem onClick={() => navigate('/about')}>
                            <div><SiAboutdotme/> About</div>
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <div><BiLogOutCircle/> Logout</div>
                        </MenuItem>
                    </Menu>
                    )}
                </div>
            </div>
            <div className='home-container'>
                <div className='max-height'>
                    <MainContainer responsive>                                   
                        <Sidebar position="left" scrollable={false} style={sidebarStyle}>
                            {user && (
                                <Conversation
                                    name={user.name}
                                    className='cursor-default card card-body home-me'
                                >
                                    <Avatar
                                        src={user.avatar} 
                                        name={user.name}
                                        status="available"
                                        className='home-me-avatar'
                                    />
                                </Conversation> 
                            )}
                            {listUser && (
                                <ListOnline
                                    select={handleConversationClick} 
                                    listUser={listUser}
                                    listActive={setListIdActive}
                                    currentChat={chatId}
                                />
                            )}
                        </Sidebar>

                        {!chatId && (
                            <ChatPublic 
                                handleBackClick={handleBackClick} 
                                chatContainerStyle={chatContainerStyle} 
                            />
                        )}

                        {chatId && (
                            <Chat 
                                chatId={chatId}
                                listIdActive={listIdActive}
                                handleBackClick={handleBackClick} 
                                chatContainerStyle={chatContainerStyle} 
                            />

                        )}
                        
                        {/* <Sidebar position="right">
                            <ExpansionPanel open title="INFO">
                            <p>Lorem ipsum</p>
                            <p>Lorem ipsum</p>
                            <p>Lorem ipsum</p>
                            <p>Lorem ipsum</p>
                            </ExpansionPanel>
                        </Sidebar>             */}
                    </MainContainer>
                </div>
            </div>
        </>
    );
}

export default Home;