interface IntuitiveBackgroundProps {
    className: string;
}

function IntuitiveBackground({ className }: IntuitiveBackgroundProps) {
    return (
        <div className={`${className} absolute w-full top-0 left-0 bg-sky-800 h-[150px] -z-10 rounded-b-lg`}></div>
    );
}

export default IntuitiveBackground;