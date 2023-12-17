// React & Next.js
import React, { ReactNode } from "react";
import { useRouter } from "next/router";

type UserType = null | {
  id: number;
  username: string;
  email: string;
  sex: string;
  birthDate: string;
};

type ProtectPersonPageProps = {
  user: UserType;
  children: ReactNode;
};

const ProtectPersonPage: React.FC<ProtectPersonPageProps> = ({
  user,
  children,
}) => {
  const router = useRouter();

  // userが存在しない場合、ログイン画面にリダイレクト
  if (!user) {
    router.push("/auth/signin");
    return null;
  }

  return <>{children}</>;
};

export default ProtectPersonPage;
