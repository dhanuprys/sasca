import { useState } from "react";

function useWait() {
    const [waiting, setWaiting] = useState(false);

    return {
        waiting,
        setWaiting
    }
}

export default useWait;