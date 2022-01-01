import React, { useContext, useEffect, useState } from 'react';
import { Avatar, 
    ConversationHeader, 
    MessageList, 
    Message, 
    MessageInput,
    VoiceCallButton,
    VideoCallButton,
    InfoButton,
    ChatContainer,
    Loader,
} from '@chatscope/chat-ui-kit-react';
import { IoContext } from '../../contexts/IoContext';
import { UserContext } from '../../contexts/UserContext';
import api from '../../axios'
import { toast } from 'react-toastify';
import Loading from '../../loading'

function ChatPublic({ handleBackClick, chatContainerStyle }) {
    const [ listMessage, setListMessage ] = useState()
    const [ message, setMessage ] = useState('')
    const [ checkValid, setCheckValid ] = useState(true)
    const { socket } = useContext(IoContext)
    const { user } = useContext(UserContext)

    const handleSend = () => {
        socket.emit('publicMessage', {
            from: {
                _id: user.id,
                name: user.name,
                avatar: user.avatar,
            },
            content: message,
        })
        setMessage('')
    }
    useEffect(() => {
        api.get('/chat/public').then(res => {
            if(res.data.success){
                setCheckValid(true)
                setListMessage(res.data.data)
            }else{
                setCheckValid(false)
                toast.error(res.data.msg)
            }
        })
    }, [ ])
    useEffect(() => {
        socket.on('publicMessage', data => {
            setListMessage(prev => [...prev, data])
        })
        return () => {
            socket.off('publicMessage')
        }
    }, [ socket ])

    if(!user)
        return <Loading/>
    return (
        <>
            <ChatContainer style={chatContainerStyle}>
                <ConversationHeader>
                    <ConversationHeader.Back onClick={handleBackClick}/>
                    <Avatar 
                        src={process.env.REACT_APP_DEFAULT_AVATAR} 
                        name='Public Chat'
                        status='available'
                    />
                    <ConversationHeader.Content 
                        userName='Public Chat'
                        info='Chat with everyone'
                    />
                    {checkValid && (
                        <ConversationHeader.Actions>
                            {!listMessage && ( <Loader /> )}
                            <VoiceCallButton />
                            <VideoCallButton />
                            <InfoButton />
                        </ConversationHeader.Actions>  
                    )}
                </ConversationHeader>
                <MessageList>
                    {checkValid && listMessage && listMessage.map((value, index) => 
                        value.from._id === user.id
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
                                    sender: value.from.name,
                                    direction: "incoming",
                                    position: "first"
                                }}
                                avatarSpacer={(listMessage[index + 1] && listMessage[index + 1].from._id === value.from._id)}
                            >   
                                {(!listMessage[index + 1] || listMessage[index + 1].from._id !== value.from._id) && (
                                    <Avatar src={value.from.avatar} name={value.from.name} />
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

export default ChatPublic;