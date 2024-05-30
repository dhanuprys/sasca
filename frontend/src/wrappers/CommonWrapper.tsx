import { CSSProperties, ReactNode } from "react";

interface CommonWrapperProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
}

function CommonWrapper({ children, className, style }: CommonWrapperProps) {
    return (
        <div style={style} className={`${className} max-w-[28rem] md:max-w-[40rem] mx-auto px-2 md:p-0`}>
            {children}
        </div>
    );
}

export default CommonWrapper;