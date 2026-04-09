import {createContext, useContext, useState, ReactNode} from 'react';

interface User {
    name: string
    email: string
}

interface AuthContextType {
    user : User | null
    token: string | null
    isAuthenticated : boolean
    login: (token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)


export function AuthProvider ({ children }: {children:ReactNode}) {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem('token')
    )

    const [user, setUser] = useState<User | null>(null)

    function login(token: string) {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setToken(token)
        setUser({name: payload.name, email: payload.email})
        localStorage.setItem('token', token)
    }

    function logout () {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
    }

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!token,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )

}

export function useAuth() {
        const context = useContext(AuthContext)
        if(!context) {
            throw new Error('useAuth deve ser usado dentro do AuthProvider')
        }
        return context
}