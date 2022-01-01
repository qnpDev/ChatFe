import React, { useContext, useEffect, useState } from 'react';
import { Avatar, 
    ConversationHeader, 
    MessageList, 
    Message, 
    MessageInput,
    VoiceCallButton,
    VideoCallButton,
    InfoButton,
    // TypingIndicator,
    // MessageSeparator,
    ChatContainer,
    Loader,
    // Status,
} from '@chatscope/chat-ui-kit-react';
import { IoContext } from '../../contexts/IoContext';
import { UserContext } from '../../contexts/UserContext';
import api from '../../axios'
import { toast } from 'react-toastify';

function Chat({ handleBackClick, chatContainerStyle, chatId, listIdActive }) {
    const [ listMessage, setListMessage ] = useState()
    const [ message, setMessage ] = useState('')
    const [ checkValid, setCheckValid ] = useState(true)
    const { socket } = useContext(IoContext)
    const { user } = useContext(UserContext)

    const handleSend = () => {
        socket.emit('privateMessage', {
            from: user.id,
            to: chatId.id,
            content: message,
        })
        setMessage('')
    }
    useEffect(() => {
        api.get('/chat/private', {
            params: {
                to: chatId.id,
            }
        }).then(res => {
            if(res.data.success){
                setCheckValid(true)
                setListMessage(res.data.data)
            }else{
                setCheckValid(false)
                toast.error(res.data.msg)
            }
        })
    }, [ chatId ])
    useEffect(() => {
        socket.on('privateMessage', data => {
            if(data.from === chatId.id)
                setListMessage(prev => [...prev, data])
            if(data.from === user.id)
                setListMessage(prev => [...prev, data])
        })
        return () => {
            socket.off('privateMessage')
        }
    }, [ socket, chatId, user ])

    return (
        <>
            <ChatContainer style={chatContainerStyle}>
                <ConversationHeader>
                    <ConversationHeader.Back onClick={handleBackClick}/>
                    {checkValid && (
                        <Avatar 
                            src={chatId.avatar} 
                            name={chatId.name} 
                            status={listIdActive.includes(chatId.id) ? 'available' : 'dnd'}
                        />
                    )}
                    {checkValid && (
                        <ConversationHeader.Content 
                            userName={chatId.name} 
                            info={listIdActive.includes(chatId.id) ? 'Online' : 'Offline'} 
                        />
                    )}
                    {checkValid && (
                        <ConversationHeader.Actions>
                            {!listMessage && ( <Loader /> )}
                            <VoiceCallButton />
                            <VideoCallButton />
                            <InfoButton />
                        </ConversationHeader.Actions>  
                    )}
                </ConversationHeader>
                <MessageList 
                    // typingIndicator={<TypingIndicator content="Zoe is typing" />}
                >
                    
                
                    {/* <MessageSeparator content="Saturday, 30 November 2019" /> */}
                    {checkValid && listMessage && listMessage.map((value, index) => 
                        value.from === user.id
                        ? (
                            <Message 
                                key={index}
                                model={{
                                    message: value.content,
                                    // sentTime: "15 mins ago",
                                    sender: user.name,
                                    direction: "outgoing",
                                    position: "first"
                                }} 
                            />
                        ) : (
                            <Message 
                                key={index}
                                model={{
                                    message: value.content,
                                    // sentTime: "15 mins ago",
                                    sender: chatId.name,
                                    direction: "incoming",
                                    position: "first"
                                }}
                                avatarSpacer={(listMessage[index + 1] && listMessage[index + 1].from === chatId.id)}
                            >   
                                {(!listMessage[index + 1] || listMessage[index + 1].from !== chatId.id) && (
                                    <Avatar src={chatId.avatar} name={chatId.name} />
                                )}
                            </Message>
                        )
                    )}
                </MessageList>
                {listMessage && checkValid && (
                    <MessageInput 
                        className='chat-input'
                        placeholder="Type message here" 
                        value={message} 
                        onChange={e => setMessage(e)} 
                        onSend={handleSend} 
                    />
                )}
                
            </ChatContainer>
        </>
    );
}

export default Chat;