import IntuitiveBackground from "@/components/IntuitiveBackground";
import BottomSpacer from "@/components/miscellaneous/BottomSpacer";
import FlexColumn from "@/components/miscellaneous/FlexColumn";
import BottomNavButton from "@/layouts/counselor/BottomNavButton";
import CounselorClasses from "@/layouts/counselor/CounselorClasses";
import CounselorHeader from "@/layouts/counselor/CounselorHeader";
import CommonWrapper from "@/wrappers/CommonWrapper";

export default function Home({ params }: { params: any }) {
  console.log(params);
  return (
    <div>
      <IntuitiveBackground />
      <CounselorHeader />
      <CommonWrapper className="mt-5">
        <FlexColumn>
          <CounselorClasses />
        </FlexColumn>
      </CommonWrapper>
      <BottomSpacer />
      <BottomNavButton />
    </div>
  );
}
