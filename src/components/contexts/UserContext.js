import { createContext, useState } from 'react'

const UserContext = createContext()

function UserProvider({ children }){
    const [ user, setUser ] = useState()



    const handle = {
        user,
        setUser,
    }

    return (
        <UserContext.Provider value={handle}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }