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
import Link from "next/link";

const IntuitiveMapContainer = dynamic(() => import('@/layouts/student/IntuitiveMapContainer'), { ssr: false });

export default function Home() {
  return (
    <div>
      <IntuitiveBackground />
      <StudentHeader />
      <CommonWrapper className="mt-5">
        <FlexColumn>
          <div className="bg-red-500 border-2 border-red-700 text-white px-4 py-2 rounded-xl">
            Untuk kedepannya, halaman web ini (<span className="underline">stemsi.my.id</span>) akan dipindah 
            secara permanen ke <Link className="underline" href="https://sasca.smkn3singaraja.sch.id">https://sasca.smkn3singaraja.sch.id</Link>
          </div>
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
