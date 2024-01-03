import { useSetRecoilState } from "recoil";
import { loadingAtom } from "../../recoil/atom/loadingAtom";

export const useLoading = () => {
  const setLoading = useSetRecoilState(loadingAtom);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return { startLoading, stopLoading };
};
