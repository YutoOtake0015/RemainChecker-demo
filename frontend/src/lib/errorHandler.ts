import { AxiosError } from "axios";
import { NextRouter } from "next/router";
import { SetterOrUpdater } from "recoil";

// バリデーションエラーのメッセージ配列を追加
interface CustomErrorResponse {
  message: string;
  messages?: string[];
}

// エラーレスポンスの型
type handleErrorResponseType = (
  err: AxiosError<CustomErrorResponse>,
  router: NextRouter,
  redirectUrl: string,
  setValidationErrorMessages: SetterOrUpdater<string[]>,
) => void;

export const handleErrorResponse: handleErrorResponseType = (
  err,
  router,
  redirectUrl,
  setValidationErrorMessages,
) => {
  if (!err.response) {
    alert("予期しないエラーが発生しました。\nもう一度やり直してください。");
    return;
  }

  const { status, data } = err.response;
  switch (status) {
    case 400:
      setValidationErrorMessages(data.messages);
      break;
    case 401:
      alert(data.message || "エラーが発生しました。");
      router.push("/auth/signin");
      break;
    case 403:
    case 404:
      alert(data.message || "エラーが発生しました。");
      router.push(redirectUrl);
      break;
    case 500:
      alert("サーバで問題が発生しました。\nもう一度やり直してください。");
      router.push(redirectUrl);
      break;
    default:
      alert("予期しないエラーが発生しました。\nもう一度やり直してください。");
  }
};
