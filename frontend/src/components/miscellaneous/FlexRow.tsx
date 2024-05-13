import { ReactNode } from "react";

interface FlexRowProps {
    children: ReactNode;
}

function FlexRow({ children }: FlexRowProps) {
    return (
        <div className="flex gap-2 md:gap-4">
            {children}
        </div>
    );
}

export default FlexRow;