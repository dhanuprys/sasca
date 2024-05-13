import { CSSProperties } from "react";

interface SkeletonProps {
    type?: 'card' | 'text';
    style?: CSSProperties;
}

function Skeleton({ type = 'card', style }: SkeletonProps) {
    return (
        <div className="w-full bg-slate-300 animate-pulse rounded-xl" style={{ ...style }}></div>
    );
}

export default Skeleton;