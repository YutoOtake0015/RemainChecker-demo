import apiClient from "./apiClient";

export const fetchUser = async (setUser, router) => {
  try {
    // サインイン時、ユーザーをセット
    apiClient
      .get("/users/find")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        handleErrorResponse(err);
        signout(setUser, router);
      });
  } catch (err) {
    alert("予期しないエラーが発生しました\nもう一度やり直してください");
    signout(setUser, router);
  }
};

const handleErrorResponse = (err) => {
  switch (err.response.status) {
    case 500:
      alert("サーバで問題が発生しました\nもう一度やり直してください");
      break;
    case 404:
      alert(err.response.data.message);
      break;
    default:
      alert("予期しないエラーが発生しました\nもう一度やり直してください");
  }
};

export const signout = async (setUser, router) => {
  // Cookie削除
  await apiClient.get("/auth/clearCookie");

  // ユーザ情報削除
  setUser(null);

  // ログイン画面に遷移
  router.push("/auth/signin");
};
