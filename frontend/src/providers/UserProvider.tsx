'use client';

import SplashScreen from "@/components/SplashScreen";
import { swrFetcher } from "@/utils/swrFetcher";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ReactNode, createContext, useCallback } from "react";
import useSWRImmutable from "swr/immutable";

interface UserAuthPayload {
    role: string;
    user: {
        id: number;
        name: string;
        avatar_path: string;
        nis: string;
        nisn: string;
        class_name: string;
    }
}

interface IUserContext {
    loading: boolean;
    user?: UserAuthPayload;
    error?: any;
    // authenticated?: boolean;
    signIn: () => void;
    signOut: () => void;
}

export const UserContext = createContext<IUserContext>({
    loading: true,
    signIn: () => {},
    signOut: () => {}
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
    const { data: user, error, isLoading } = useSWRImmutable<UserAuthPayload>(
        '/api/v1/me',
        swrFetcher,
        {
            shouldRetryOnError: !hitOnce
        }
    );

    const signIn = useCallback(() => {
        router.replace('/auth/login');
    }, []);

    const signOut = useCallback(async () => {
        await axios.get('/api/v1/auth/logout');

        router.replace('/auth/login');
    }, []);

    if (isLoading && !user && splash) {
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
        <UserContext.Provider value={{ loading: isLoading, user, error, signIn, signOut }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;