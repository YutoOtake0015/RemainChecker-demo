const Joi = require("joi");

const editPersonSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().required().messages({
      "any.required": "IDが必要です",
      "number.base": "有効なIDを指定してください",
    }),
  }),
  body: Joi.object({
    personName: Joi.string().trim().required().max(15).messages({
      "any.required": "名前を入力してください",
      "string.empty": "名前を入力してください",
      "string.max": "名前は15文字以内で入力してください",
    }),

    birthDate: Joi.date()
      .min("1900-01-01")
      .max(new Date())
      .required()
      .messages({
        "any.required": "生年月日を指定してください",
        "date.base": "有効な日付を指定してください",
        "date.min": "生年月日は 1900/01/01〜本日 の範囲で選択してください",
        "date.max": "生年月日は 1900/01/01〜本日 の範囲で選択してください",
      }),

    sex: Joi.string().trim().required().messages({
      "any.required": "性別を指定してください",
      "string.empty": "性別を指定してください",
    }),
  }),
});

module.exports = editPersonSchema;
