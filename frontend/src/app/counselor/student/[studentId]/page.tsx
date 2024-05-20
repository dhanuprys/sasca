import IntuitiveBackground from "@/components/IntuitiveBackground";
import SplashScreen from "@/components/SplashScreen";
import StudentDetail from "@/components/counselor/StudentDetail";
import StudentStats from "@/components/counselor/attendance/StudentStats";
import BottomSpacer from "@/components/miscellaneous/BottomSpacer";
import FlexColumn from "@/components/miscellaneous/FlexColumn";
import BottomNavButton from "@/layouts/counselor/BottomNavButton";
import CalendarReport from "@/layouts/counselor/CalendarReport";
import Classroom from "@/layouts/counselor/Classroom";
import CounselorClasses from "@/layouts/counselor/CounselorClasses";
import CounselorHeader from "@/layouts/counselor/CounselorHeader";
import StudentHeader from "@/layouts/student/StudentHeader";
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
        </FlexColumn>
      </CommonWrapper>
      <BottomNavButton />
    </div>
  );
}
