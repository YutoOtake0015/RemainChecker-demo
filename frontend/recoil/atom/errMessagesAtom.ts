import { atom } from "recoil";

type errType = null | string[];

const errMessagesAtom = atom<errType>({
  key: "errMessagesAtom",
  default: [],
});

export default errMessagesAtom;
