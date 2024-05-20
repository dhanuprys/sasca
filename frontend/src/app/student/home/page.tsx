import IntuitiveBackground from "@/components/IntuitiveBackground";
import BottomSpacer from "@/components/miscellaneous/BottomSpacer";
import FlexColumn from "@/components/miscellaneous/FlexColumn";
import ApplicationTestingBanner from "@/layouts/common/ApplicationTestingBanner";
import ApplyForAbsent from "@/layouts/student/ApplyForAbsent";
import AttendanceButton from "@/layouts/student/AttendanceButton";
import BottomNavButton from "@/layouts/student/BottomNavButton";
import Feedback from "@/layouts/student/Feedback";
import StudentHeader from "@/layouts/student/StudentHeader";
import CommonWrapper from "@/wrappers/CommonWrapper";
import dynamic from "next/dynamic";

const IntuitiveMapContainer = dynamic(() => import('@/layouts/student/IntuitiveMapContainer'), { ssr: false });

export default function Home() {
  return (
    <div>
      <IntuitiveBackground />
      <StudentHeader />
      <CommonWrapper className="mt-5">
        <FlexColumn>
          <Feedback />
          <AttendanceButton />
          <ApplyForAbsent />
          <hr />
          <IntuitiveMapContainer />
          <ApplicationTestingBanner />
        </FlexColumn>
      </CommonWrapper>
      <BottomSpacer />
      <BottomNavButton />
    </div>
  );
}
