import IntuitiveBackground from "@/components/IntuitiveBackground";
import SplashScreen from "@/components/SplashScreen";
import StudentDetail from "@/components/counselor/StudentDetail";
import StudentStats from "@/components/counselor/attendance/StudentStats";
import BottomSpacer from "@/components/miscellaneous/BottomSpacer";
import FlexColumn from "@/components/miscellaneous/FlexColumn";
import BottomNavButton from "@/layouts/counselor/BottomNavButton";
import CalendarReport from "@/layouts/counselor/CalendarReport";
import CounselorHeader from "@/layouts/counselor/CounselorHeader";
import FaceSample from "@/layouts/counselor/FaceSample";
import CommonWrapper from "@/wrappers/CommonWrapper";

export default function Home({ params }: { params: { studentId: number } }) {
  return (
    <div>
      <IntuitiveBackground />
      <CounselorHeader />
      <CommonWrapper className="mt-5">
        <FlexColumn>
          <StudentDetail studentId={params.studentId} />
          <StudentStats studentId={params.studentId} />
          <CalendarReport studentId={params.studentId} />
          <FaceSample studentId={params.studentId} />
        </FlexColumn>
      </CommonWrapper>
      <BottomSpacer />
      <BottomNavButton />
    </div>
  );
}
