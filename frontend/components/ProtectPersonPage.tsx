import { useRouter } from "next/router";
import { ReactNode } from "react";

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
    router.push("/signin");
    return null;
  }

  return <>{children}</>;
};

export default ProtectPersonPage;
