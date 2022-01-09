import React, { createContext, useState, useContext, useEffect, SetStateAction, Dispatch } from 'react';
import { PeakInterface } from '../interface/PeakInterface';
import { AuthedUser } from '../interface/UserInterface';
import { authService } from '../service/authService';


type AuthContextData = {
    authedUser?: AuthedUser;
    currentPeak?: PeakInterface | undefined;
    setCurrentPeak: Dispatch<SetStateAction<PeakInterface | undefined>>;
    loading: boolean;
    login(email: string, password: string): Promise<boolean>;
    logout(): Promise<void>;
    register(email: string, username: string, password: string): Promise<boolean>;
}

// Create the Auth Context with the data type specified
// and a empty object
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
    const [authedUser, setAuthedUser] = useState<AuthedUser>();
    const [currentPeak, setCurrentPeak] = useState<PeakInterface>();

    // the AuthContext start with loading equals true
    // and stay like this, until the data is loaded from Local Storage
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStorageData();
    }, [])

    async function loadStorageData(): Promise<void> {
        try {
            const authDataSerialized = localStorage.getItem('@user')

            if (authDataSerialized) {
                const _authedUser: AuthedUser = JSON.parse(authDataSerialized)
                setAuthedUser(_authedUser);
            }

        } catch (error) {
            console.log("MY ERROR", error)
        } finally {
            setLoading(false)
        }
    }

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            // call the service passing credential (email and password).
            const _authedUser = await authService.login(email, password)

            // if (typeof (_authedUser) === 'object') {
            //     //Set the data in the context, so the App can be notified
            //     //and send the user to the AuthStack
            //     console.log('worked on login')
            //     setAuthedUser(_authedUser);
            //     return _authedUser
            // }
            return false

        } catch (e) {
            return false
        }
    }

    const register = async (email: string, username: string, password: string): Promise<boolean> => {
        try {
            const _authedUser = await authService.register(email, username, password)

            // if (typeof (_authedUser) === 'object') {
            //     //Set the data in the context, so the App can be notified
            //     //and send the user to the AuthStack
            //     setAuthedUser(_authedUser);
            //     return _authedUser
            // }

            // setAuthedUser(undefined)
            // return _authedUser
            return false
        } catch (e) {
            return false
        } 
    }

    const logout = async () => {
        try {
            setAuthedUser(undefined)

            await authService.logout()

        } catch (e) {
            console.warn(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        // This component will be used to encapsulate the whole App,
        // so all components will have access to the Context
        <AuthContext.Provider value={{ authedUser, setCurrentPeak, currentPeak, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

// A simple hook to facilitate the access to the AuthContext
// and permit components to subscribe to AuthContext updates
function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

export { AuthContext, AuthProvider, useAuth }