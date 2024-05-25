import IntuitiveBackground from "@/components/IntuitiveBackground";
import BottomSpacer from "@/components/miscellaneous/BottomSpacer";
import FlexColumn from "@/components/miscellaneous/FlexColumn";
import ApplicationTestingBanner from "@/layouts/common/ApplicationTestingBanner";
import BottomNavButton from "@/layouts/admin/BottomNavButton";
import CounselorHeader from "@/layouts/counselor/CounselorHeader";
import CommonWrapper from "@/wrappers/CommonWrapper";
import AdminHeader from "@/layouts/admin/AdminHeader";
import HomeMenu from "@/layouts/admin/HomeMenu";

export default function Home() {
  return (
    <div>
      <IntuitiveBackground />
      <AdminHeader />
      <CommonWrapper className="mt-5">
        <FlexColumn>
          <HomeMenu />
        </FlexColumn>
      </CommonWrapper>
      <BottomSpacer />
      <BottomNavButton />
    </div>
  );
}
