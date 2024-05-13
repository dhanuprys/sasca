import IntuitiveBackground from "@/components/IntuitiveBackground";
import FlexColumn from "@/components/miscellaneous/FlexColumn";
import BottomNavButton from "@/layouts/student/BottomNavButton";
import Classroom from "@/layouts/student/Classroom";
import StudentHeader from "@/layouts/student/StudentHeader";
import CommonWrapper from "@/wrappers/CommonWrapper";

export default function NotificationPage() {
  return (
    <div>
      <IntuitiveBackground />
      <StudentHeader />
      <CommonWrapper className="mt-5">
        <FlexColumn>
          <Classroom />
        </FlexColumn>
      </CommonWrapper>
      <BottomNavButton />
    </div>
  );
}
