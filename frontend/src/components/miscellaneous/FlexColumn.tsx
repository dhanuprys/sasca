import { ReactNode } from "react";

interface FlexColumnProps {
    children: ReactNode;
    className?: string;
}

function FlexColumn({ children, className }: FlexColumnProps) {
    return (
        <div className={`${className || ''} flex flex-col gap-4`}>
            {children}
        </div>
    );
}

export default FlexColumn;