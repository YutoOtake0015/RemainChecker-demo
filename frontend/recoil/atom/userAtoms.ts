import { atom } from "recoil";

type userType = null | {
  id: number;
  username: string;
  email: string;
  sex: string;
  birthDate: string;
};

const userAtom = atom<userType>({
  key: "userAtom",
  default: null,
});

export default userAtom;
