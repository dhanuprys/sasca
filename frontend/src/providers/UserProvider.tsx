'use client';

import SplashScreen from "@/components/SplashScreen";
import { swrFetcher } from "@/utils/swrFetcher";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ReactNode, createContext, useCallback, useEffect, useState } from "react";
import useSWRImmutable from "swr/immutable";

interface UserAuthPayload {
    id: number;
    role: string;
    user: {
        id: number;
        name: string;
        avatar_path: string;

        // student only
        nis: string;
        nisn: string;
        class_name: string;

        // teacher only
        nip: string;
    }
}

interface IUserContext {
    loading: boolean;
    user?: UserAuthPayload;
    error?: any;
    // authenticated?: boolean;
    storeToken: (tokenId: number, tokenString: string) => void;
    getAllToken: () => { [key: string]: string };
    getToken: (tokenId: number) => string | null;
    deleteToken: (tokenId: number) => void;
    signIn: (force?: boolean) => void;
    signOut: () => void;
}

export const UserContext = createContext<IUserContext>({
    loading: true,
    storeToken: () => { },
    getAllToken: () => ({}),
    getToken: () => null,
    deleteToken: () => {},
    signIn: () => { },
    signOut: () => { }
});

interface UserProviderProps {
    children: ReactNode;
    allowedRoles?: string[];
    strict?: boolean;
    splash?: boolean;
    hitOnce?: boolean;
}

function UserProvider({ children, strict = true, splash, allowedRoles, hitOnce }: UserProviderProps) {
    const router = useRouter();
    const [isAllowOpen, setAllowOpen] = useState(false);

    const { data: user, error, isLoading } = useSWRImmutable<UserAuthPayload>(
        '/api/v1/me',
        swrFetcher,
        {
            shouldRetryOnError: !hitOnce
        }
    );

    const getAllToken = useCallback(() => {
        if (!window) return;

        const storageKey = 'stored_token';
        let storedTokens: any = localStorage.getItem(storageKey);

        try {
            storedTokens = JSON.parse(storedTokens) || {};
        } catch (error) {
            storedTokens = {};
        }

        return storedTokens;
    }, []);

    const storeToken = useCallback((tokenId: number, tokenString: string) => {
        if (!window) return;

        let storedTokens: any = getAllToken();

        delete storedTokens[tokenId];

        const keys = Object.keys(storedTokens);

        if (keys.length >= 3) {
            const keepedKeys = keys.slice(keys.length - 2);
            let reconstructedTokens: any = {};

            for (const activeKey of keepedKeys) {
                reconstructedTokens[activeKey] = storedTokens[activeKey];
            }

            storedTokens = reconstructedTokens;
        }

        storedTokens[tokenId] = tokenString;

        localStorage.setItem('stored_token', JSON.stringify(storedTokens));
    }, []);

    const getToken = useCallback((tokenId: number) => {
        if (!window) return;

        const storedTokens: any = getAllToken();

        return storedTokens[tokenId] || null;
    }, []);

    const deleteToken = useCallback((tokenId: number) => {
        if (!window) return;

        const storedTokens: any = getAllToken();

        delete storedTokens[tokenId];

        localStorage.setItem('stored_token', JSON.stringify(storedTokens));
    }, []);

    const signIn = useCallback((force: boolean = false) => {
        if (force) {
            window.location.href = '/auth/login';
            return;
        }

        router.replace('/auth/login');
    }, []);

    const signOut = useCallback(async () => {
        await axios.get('/api/v1/auth/logout');

        router.replace('/auth/login');
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setAllowOpen(true);
        }, 2500);
    }, []);

    if ((!user && splash) || !isAllowOpen) {
        return <SplashScreen />;
    }

    if ((error && error.response.status === 401) && strict) {
        router.push('/auth/login');

        return <>INVALID</>;
    }

    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
        return 'Access forbidden';
    }

    return (
        <UserContext.Provider value={{
            loading: isLoading,
            user,
            error,
            storeToken,
            getAllToken,
            getToken,
            deleteToken,
            signIn,
            signOut
        }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;