'use client';

import SplashScreen from "@/components/SplashScreen";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { user, error, loading, signIn } = useUser();

  if (error && !loading) {
    signIn();
  }

  if (user && !loading) {
    router.replace(`/${user.role}/home`);
  }

  return (
    <SplashScreen />
  );
}
