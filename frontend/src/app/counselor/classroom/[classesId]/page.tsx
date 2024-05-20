import IntuitiveBackground from "@/components/IntuitiveBackground";
import SplashScreen from "@/components/SplashScreen";
import BottomSpacer from "@/components/miscellaneous/BottomSpacer";
import FlexColumn from "@/components/miscellaneous/FlexColumn";
import BottomNavButton from "@/layouts/counselor/BottomNavButton";
import Classroom from "@/layouts/counselor/Classroom";
import CounselorClasses from "@/layouts/counselor/CounselorClasses";
import StudentHeader from "@/layouts/student/StudentHeader";
import CommonWrapper from "@/wrappers/CommonWrapper";

export default function Home({ params }: { params: { classesId: number } }) {
  return (
    <div>
      <IntuitiveBackground />
      <StudentHeader />
      <CommonWrapper className="mt-5 !p-0">
        <FlexColumn>
          <Classroom classesId={params.classesId} />
        </FlexColumn>
      </CommonWrapper>
      <BottomSpacer />
      <BottomNavButton />
    </div>
  );
}
