const Joi = require("joi");

const signinSchema = Joi.object({
  email: Joi.string().trim().required().messages({
    "any.required": "メールアドレスを入力してください",
    "string.empty": "メールアドレスを指定してください",
  }),

  password: Joi.string().trim().required().messages({
    "any.required": "パスワードを入力してください",
    "string.empty": "パスワードを指定してください",
    "date.min": "生年月日は 1900/01/01〜本日 の範囲で選択してください",
    "date.max": "生年月日は 1900/01/01〜本日 の範囲で選択してください",
  }),
});

module.exports = signinSchema;
