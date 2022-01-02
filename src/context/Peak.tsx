import React, { createContext, useState, useContext, useEffect, SetStateAction, Dispatch } from 'react';
import { PeakInterface } from '../interface/PeakInterface';
import { AuthedUser } from '../interface/UserInterface';
import { peakService } from "../service/peakService"
import { useAuth } from './Auth';


type PeakContextData = {
    // TODO: get one peak, delete a peak, update a peak
    currentPeak?: PeakInterface;
    setCurrentPeak: Dispatch<SetStateAction<PeakInterface | undefined>>;
    allPeaks?: PeakInterface[];
    setAllPeaks: Dispatch<SetStateAction<PeakInterface[] | undefined>>;
    getAllPeaks(): Promise<PeakInterface[] | undefined>;
    createPeak(user: AuthedUser, peak: PeakInterface): Promise<PeakInterface | undefined>;
    loading: boolean;
}

// Create the Peak Context with the data type specified
// and a empty object
const PeakContext = createContext<PeakContextData>({} as PeakContextData);

const PeakProvider: React.FC = ({ children }) => {
    // const [authedUser, setAuthedUser] = useState<AuthedUser>();
    const auth = useAuth();
    const [currentPeak, setCurrentPeak] = useState<PeakInterface>();
    const [allPeaks, setAllPeaks] = useState<PeakInterface[]>();

    // the AuthContext start with loading equals true
    // and stay like this, until the data is loaded from Local Storage
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPeakData();
    }, [])

    async function loadPeakData(): Promise<void> {
        try {
            const _allPeaks = await getAllPeaks()
            setAllPeaks(_allPeaks)
        } catch (error) {
            console.log("Error getting peaks", error)
        } finally {
            setLoading(false)
        }
    }

    const getAllPeaks = async (): Promise<PeakInterface[] | undefined> => {
        try {
            const _allPeaks = await peakService.getAllPeaks()

            if (_allPeaks) {
                // setAllPeaks(_allPeaks)
                return _allPeaks
            } else {
                return undefined
            }

        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    const createPeak = async (user: AuthedUser, peak: PeakInterface): Promise<PeakInterface | undefined> => {
        try {
            const _createPeak = await peakService.postPeak(peak, user.user.id)

            if (_createPeak) {
                setAllPeaks((prevState: PeakInterface[] | undefined) => (prevState ? [
                    ...prevState,
                    _createPeak
                  ] : [_createPeak]))
                return _createPeak
            } else {
                return undefined
            }
        } catch (e) {
            console.log(e)
        }
    }


    return (
        // This component will be used to encapsulate the whole App,
        // so all components will have access to the Context
        <PeakContext.Provider value={{ loading, setCurrentPeak, currentPeak, setAllPeaks, allPeaks, getAllPeaks, createPeak }}>
            {children}
        </PeakContext.Provider>
    );
}

// A simple hook to facilitate the access to the AuthContext
// and permit components to subscribe to AuthContext updates
function usePeak(): PeakContextData {
    const context = useContext(PeakContext);

    if (!context) {
        throw new Error('usePeak must be used within an PeakProvider');
    }

    return context;
}

export { PeakContext, PeakProvider, usePeak }