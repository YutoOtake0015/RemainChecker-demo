const Joi = require("joi");

const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,10}$/;
const editUserSchema = Joi.object({
  id: Joi.number()
    .required()
    .messages({ "any.required": "ユーザ情報が不正です" }),

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
});

module.exports = editUserSchema;
