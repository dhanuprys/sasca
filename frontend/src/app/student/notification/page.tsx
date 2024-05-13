import IntuitiveBackground from "@/components/IntuitiveBackground";
import FlexColumn from "@/components/miscellaneous/FlexColumn";
import BottomNavButton from "@/layouts/student/BottomNavButton";
import StudentHeader from "@/layouts/student/StudentHeader";
import CommonWrapper from "@/wrappers/CommonWrapper";

export default function NotificationPage() {
  return (
    <div>
      <IntuitiveBackground />
      <StudentHeader />
      <CommonWrapper className="mt-5">
        <FlexColumn>
          REPORT
        </FlexColumn>
      </CommonWrapper>
      <BottomNavButton />
    </div>
  );
}
