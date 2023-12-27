// state
import { atom } from "recoil";

// types
import { userType } from "../../src/types/type";

const userAtom = atom<userType>({
  key: "userAtom",
  default: null,
});

export default userAtom;
