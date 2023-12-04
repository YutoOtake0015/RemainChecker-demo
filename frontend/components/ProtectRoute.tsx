import { useRouter } from "next/router";
import { ReactNode } from "react";

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
    router.push("/signin");
    return;
  }

  return <>{children}</>;
};

export default ProtectRoute;
