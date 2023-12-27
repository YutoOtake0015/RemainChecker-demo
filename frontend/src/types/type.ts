// 性別の型定義
export type SexType = "male" | "female" | null;

// 人物情報の型定義
export type personType = {
  id: number;
  name: string;
  sex: string;
  birthDate: string;
  isAccountUser: boolean;
  remainTime: number;
};

// ユーザの人物情報の型定義
export type userProfileType = {
  birthDate: Date;
  sex: SexType;
} | null;

// ユーザ情報
export type userType = null | {
  id: number;
  email: string;
  sex: string;
  birthDate: string;
};

// RemainingLifePropsのprops
export type RemainingLifeProps = {
  person: {
    sex: SexType;
    birthDate: Date;
  };
};

// エラーの型定義
export type errType = string[] | null;
