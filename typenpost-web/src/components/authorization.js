// import React, { useState, useContext, createContext } from "react"

// const authContext = createContext()

// function userAuthentication() {
//     const [authToken, aetAuthToken] = useState(null) 
//     const [username, setUsername] = useState(null)
// }
// export function AuthProvider({children}) {
//     const auth = userAuthentication()

//     return (
//         <authContext.Provider value={auth}>
//             {children}
//         </authContext.Provider>
//     )
// }

// export function useAuthentication() {
//     return useContext(authContext)
// }