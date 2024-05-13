import ApplicationVersionBadge from "@/components/ApplicationVersionBadge";
import FlexColumn from "@/components/miscellaneous/FlexColumn";
import ProfileHero from "@/components/students/profile/ProfileHero";
import ProfileMenu from "@/components/students/profile/ProfileMenu";
import BottomNavButton from "@/layouts/student/BottomNavButton";
import CommonWrapper from "@/wrappers/CommonWrapper";

export default function Home() {
  return (
    <div>
      <ProfileHero />
      <CommonWrapper>
        <ProfileMenu />
        <div className="text-center">
          <ApplicationVersionBadge />
        </div>
      </CommonWrapper>
      <BottomNavButton />
    </div>
  );
}
