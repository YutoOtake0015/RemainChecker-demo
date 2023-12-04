const Joi = require("joi");

const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,10}$/;
const signupSchema = Joi.object({
  username: Joi.string().trim().max(15).required().messages({
    "any.required": "名前を入力してください",
    "string.empty": "名前を入力してください",
    "string.max": "名前は15文字以内で入力してください",
  }),

  email: Joi.string().email().trim().required().messages({
    "any.required": "メールアドレスを入力してください",
    "string.empty": "メールアドレスを入力してください",
    "string.email": "有効なメールアドレスを入力してください",
  }),

  password: Joi.string().trim().pattern(pattern).required().messages({
    "any.required": "パスワードを入力してください",
    "string.empty": "パスワードを入力してください",
    "string.pattern.base":
      "パスワードは英字と数字の組み合わせで、8文字以上10文字以内で入力してください",
  }),

  birthDate: Joi.date().min("1900-01-01").max(new Date()).required().messages({
    "any.required": "生年月日を指定してください",
    "date.base": "有効な日付を指定してください",
    "date.min": "生年月日は 1900/01/01〜本日 の範囲で選択してください",
    "date.max": "生年月日は 1900/01/01〜本日 の範囲で選択してください",
  }),

  sex: Joi.string().trim().required().messages({
    "any.required": "性別を指定してください",
    "string.empty": "性別を指定してください",
  }),
});

module.exports = signupSchema;
