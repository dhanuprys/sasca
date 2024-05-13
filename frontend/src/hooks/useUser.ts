import { UserContext } from "@/providers/UserProvider";
import { useContext } from "react";

function useUser() {
    const userContext = useContext(UserContext);

    return userContext;
}

export default useUser;