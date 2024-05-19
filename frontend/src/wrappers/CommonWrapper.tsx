import { ReactNode } from "react";

interface CommonWrapperProps {
    children: ReactNode;
    className?: string;
}

function CommonWrapper({ children, className }: CommonWrapperProps) {
    return (
        <div className={`${className} max-w-[28rem] md:max-w-[40rem] mx-auto px-4 md:p-0`}>
            {children}
        </div>
    );
}

export default CommonWrapper;