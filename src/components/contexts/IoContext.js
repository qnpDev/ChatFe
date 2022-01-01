import { createContext } from 'react'
import { io } from 'socket.io-client'

const IoContext = createContext()

function IoProvider({ children }){
    const socket = io(process.env.REACT_APP_API_ENDPOINT, { autoConnect: false })

    const handle = {
        socket,
    }

    return (
        <IoContext.Provider value={handle}>
            {children}
        </IoContext.Provider>
    )
}

export { IoContext, IoProvider }