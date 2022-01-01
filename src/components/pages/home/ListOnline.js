import React, { useContext, useEffect, useState } from 'react';
import { Avatar,
    Conversation, 
    ConversationList,
    Search,
} from '@chatscope/chat-ui-kit-react';
import { IoContext } from '../../contexts/IoContext';
import { UserContext } from '../../contexts/UserContext';

function ListOnline({ select, listUser, listActive, currentChat }) {
    const { socket } = useContext(IoContext)
    const { user } = useContext(UserContext)
    const [ listIdActive, setListIdActive ] = useState([])
    const [ listAll, setListAdll ] = useState(listUser)
    const [ search, setSearch ] = useState('')
    const [ newMessage, setNewMessage ] = useState([])

    const filterList = listAll && listAll.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleSelect = e => {
        setNewMessage(prev => prev.filter(v => v !== e.id))
        select(e)
    }

    useEffect(() => {
        socket.on('listOnline', data => {
            let active = []
            let idActive = []
            data.forEach(e => {
                active.push(e.data)
                idActive.push(e.data.id)
            })
            let listAllTemp = listAll.filter(e => !idActive.includes(e.id))

            setListAdll([...active, ...listAllTemp])
            setListIdActive(idActive)
            listActive(idActive)
        })
        return () => socket.off('listOnline')
    }, [ socket, listAll, listActive ])
    useEffect(() => {
        socket.on('privateMessageNotif', data => {
            if(currentChat && data.from !== currentChat.id)
                setNewMessage(prev => [...prev, data.from])
            if(!currentChat)
                setNewMessage(prev => [...prev, data.from])
        })
        return () => socket.off('privateMessageNotif')
    }, [ socket, currentChat])
    return (
        <>
            <Search 
                value={search}
                onChange={v => setSearch(v)}
                onClearClick={() => setSearch('')}
                placeholder='Search...'
                style={{display: 'flex'}}
            />
            <ConversationList>
                <Conversation
                    onClick={() => select()}
                    name={(<span className='fw-bold text-primary'>Public Chat</span>)}
                >
                    <Avatar
                        src={process.env.REACT_APP_DEFAULT_AVATAR} 
                        name='Public Chat'
                        status='available'
                    />
                </Conversation> 
                {filterList && user && filterList.map(value => {
                    if(value.id !== user.id)
                        return (
                            <Conversation
                                key={value.id}
                                onClick={() => handleSelect(value)}
                                name={value.name}
                                unreadDot={newMessage.includes(value.id)}
                            >
                                <Avatar
                                    src={value.avatar} 
                                    name={value.name}
                                    status={listIdActive.includes(value.id) ? 'available' : 'dnd'}
                                />
                            </Conversation> 
                        )
                    return null
                })}                                                 
                {/* <Conversation 
                    onClick={select} 
                    name="Lilly" 
                    lastSenderName="Lilly" 
                    info="Yes i can do it for you"
                >
                    <Avatar 
                        src='https://mondaycareer.com/wp-content/uploads/2020/11/background-%C4%91%E1%BA%B9p-3-1.jpg' 
                        name="Lilly" 
                        status="available" 
                        // style={conversationAvatarStyle}
                    />
                    <Conversation.Content 
                        name="Lilly" 
                        lastSenderName="Lilly" 
                        info="Yes i can do it for you" 
                        style={{display: 'flex'}}
                        // style={conversationContentStyle} 
                    />
                </Conversation>                                              */}
            </ConversationList>
        </>
    );
}

export default ListOnline;