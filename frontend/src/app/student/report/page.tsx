import IntuitiveBackground from "@/components/IntuitiveBackground";
import BottomSpacer from "@/components/miscellaneous/BottomSpacer";
import FlexColumn from "@/components/miscellaneous/FlexColumn";
import BottomNavButton from "@/layouts/student/BottomNavButton";
import HolidayList from "@/layouts/student/HolidayList";
import StudentHeader from "@/layouts/student/StudentHeader";
import StudentReport from "@/layouts/student/StudentReport";
import CommonWrapper from "@/wrappers/CommonWrapper";

export default function Home() {
  return (
    <div>
      <IntuitiveBackground />
      <StudentHeader />
      <CommonWrapper className="mt-5">
        <FlexColumn>
          <StudentReport />
          <HolidayList />
        </FlexColumn>
      </CommonWrapper>
      <BottomSpacer />
      <BottomNavButton />
    </div>
  );
}
