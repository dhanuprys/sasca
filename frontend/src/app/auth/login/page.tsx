import IntuitiveBackground from "@/components/IntuitiveBackground";
import LoginCard from "@/layouts/LoginCard";
import CommonWrapper from "@/wrappers/CommonWrapper";

function LoginPage() {
    return (
        <>
            <IntuitiveBackground />
            <CommonWrapper>
                <LoginCard />
            </CommonWrapper>
        </>
    );
}

export default LoginPage;