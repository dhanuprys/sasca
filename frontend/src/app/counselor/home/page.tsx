import IntuitiveBackground from "@/components/IntuitiveBackground";
import BottomSpacer from "@/components/miscellaneous/BottomSpacer";
import FlexColumn from "@/components/miscellaneous/FlexColumn";
import ApplicationTestingBanner from "@/layouts/common/ApplicationTestingBanner";
import BottomNavButton from "@/layouts/counselor/BottomNavButton";
import CounselorHeader from "@/layouts/counselor/CounselorHeader";
import CommonWrapper from "@/wrappers/CommonWrapper";

export default function Home() {
  return (
    <div>
      <IntuitiveBackground />
      <CounselorHeader />
      <CommonWrapper className="mt-5">
        <FlexColumn>
          {/* <hr /> */}
          <ApplicationTestingBanner />
        </FlexColumn>
      </CommonWrapper>
      <BottomSpacer />
      <BottomNavButton />
    </div>
  );
}
