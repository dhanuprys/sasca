import IntuitiveBackground from "@/components/IntuitiveBackground";
import BottomSpacer from "@/components/miscellaneous/BottomSpacer";
import FlexColumn from "@/components/miscellaneous/FlexColumn";
import BottomNavButton from "@/layouts/admin/BottomNavButton";
import SchoolSchedule from "@/layouts/admin/SchoolSchedule";
import CommonWrapper from "@/wrappers/CommonWrapper";
import AdminHeader from "@/layouts/admin/AdminHeader";

export default function Home() {
  return (
    <div>
      <IntuitiveBackground />
      <AdminHeader />
      <CommonWrapper className="mt-5">
        <FlexColumn>
            <SchoolSchedule />
        </FlexColumn>
      </CommonWrapper>
      <BottomSpacer />
      <BottomNavButton />
    </div>
  );
}
