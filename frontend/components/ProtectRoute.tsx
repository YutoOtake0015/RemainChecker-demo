// React & Next.js
import React, { ReactNode } from "react";
import { useRouter } from "next/router";

type userType = null | {
  id: number;
  username: string;
  email: string;
  sex: string;
  birthDate: string;
};

const ProtectRoute: React.FC<{ user: userType; children: ReactNode }> = ({
  user,
  children,
}) => {
  const router = useRouter();

  // userが存在しない場合、ログイン画面にリダイレクト
  if (!user) {
    router.push("/auth/signin");
    return;
  }

  return <>{children}</>;
};

export default ProtectRoute;
