import IntuitiveBackground from "@/components/IntuitiveBackground";
import BottomSpacer from "@/components/miscellaneous/BottomSpacer";
import FlexColumn from "@/components/miscellaneous/FlexColumn";
import BottomNavButton from "@/layouts/counselor/BottomNavButton";
import CounselorHeader from "@/layouts/counselor/CounselorHeader";
import SchoolSchedule from "@/layouts/counselor/SchoolSchedule";
import CommonWrapper from "@/wrappers/CommonWrapper";

export default function Home() {
  return (
    <div>
      <IntuitiveBackground />
      <CounselorHeader />
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
