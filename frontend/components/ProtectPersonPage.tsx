// frontend/components/ProtectPersonPage.tsx

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

  // ここで、userとpersonの関連性を確認し、不正なアクセスであればリダイレクト
  // 例: user.id と person.userId が一致するかを確認する

  return <>{children}</>;
};

export default ProtectPersonPage;
