import BottomSpacer from "@/components/miscellaneous/BottomSpacer";
import FlexColumn from "@/components/miscellaneous/FlexColumn";
import ApplicationTestingBanner from "@/layouts/common/ApplicationTestingBanner";
import AttendanceButton from "@/layouts/student/AttendanceButton";
import BottomNavButton from "@/layouts/student/BottomNavButton";
import StudentHeader from "@/layouts/student/StudentHeader";
import CommonWrapper from "@/wrappers/CommonWrapper";

export default function Home() {
  return (
    <div>
      <StudentHeader />
      <CommonWrapper>
        <FlexColumn>
          <AttendanceButton />
          <ApplicationTestingBanner />
        </FlexColumn>
      </CommonWrapper>
      <BottomSpacer />
      <BottomNavButton />
    </div>
  );
}
