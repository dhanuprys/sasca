import ApplicationVersionBadge from "@/components/ApplicationVersionBadge";
import BottomSpacer from "@/components/miscellaneous/BottomSpacer";
import ProfileHero from "@/components/counselor/profile/ProfileHero";
import ProfileMenu from "@/components/counselor/profile/ProfileMenu";
import BottomNavButton from "@/layouts/counselor/BottomNavButton";
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
      <BottomSpacer />
      <BottomNavButton />
    </div>
  );
}
