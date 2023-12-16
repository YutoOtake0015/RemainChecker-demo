import apiClient from "./apiClient";
import nookies from "nookies";

export const signin = async (setUser) => {
  try {
    // サインイン時、ユーザーをセット
    apiClient
      .get("/users/find")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        handleErrorResponse(err);
        signout(setUser);
      });
  } catch (err) {
    alert("予期しないエラーが発生しました\nもう一度やり直してください");
    signout(setUser);
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

export const signout = (setUser) => {
  nookies.destroy(null, "auth_token");
  setUser(null);
};
