'use client';

import SplashScreen from "@/components/SplashScreen";
import { swrFetcher } from "@/utils/swrFetcher";
import { useRouter } from "next/navigation";
import { ReactNode, createContext } from "react";
import useSWRImmutable from "swr/immutable";

interface UserAuthPayload {
    id: number;
    role: string;
}

interface IUserContext {
    loading: boolean;
    user?: UserAuthPayload;
    error?: any;
}

export const UserContext = createContext<IUserContext>({
    loading: true
});

interface UserProviderProps {
    children: ReactNode;
    allowedRoles?: string[];
    strict?: boolean;
    splash?: boolean;
}

function UserProvider({ children, strict = true, splash, allowedRoles }: UserProviderProps) {
    const router = useRouter();
    const { data: user, error, isLoading } = useSWRImmutable<UserAuthPayload>('/api/v1/me', swrFetcher);

    if (isLoading && !user && splash) {
        return <SplashScreen />;
    }

    if (error && strict) {
        router.push('/auth/login');
    }

    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
        return 'Access forbidden';
    }

    return (
        <UserContext.Provider value={{ loading: isLoading, user, error }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;