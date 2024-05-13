import IntuitiveBackground from "@/components/IntuitiveBackground";
import ChangePasswordCard from "@/layouts/ChangePasswordCard";
import CommonWrapper from "@/wrappers/CommonWrapper";

function LoginPage() {
    return (
        <>
            <IntuitiveBackground />
            <CommonWrapper>
                <ChangePasswordCard />
            </CommonWrapper>
        </>
    );
}

export default LoginPage;