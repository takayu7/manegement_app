export const MESSAGE_LIST = {
  E010100: "必須項目です。入力してください。",
  E010101: "必須項目です。選択してください。",
  E010104: "{0}～{1}の範囲で入力してください。",
  E010105: "{0}文字以上で入力してください。",
  E010106: "{0}文字以下で入力してください。",
  E010107: "全角文字で入力してください。",
  E010108: "半角カタカナで入力してください。",
  E010109: "半角英字で入力してください。",
  E010110: "半角数字で入力してください。",
  E010111: "入力できる記号「{0}」で入力してください。",
  E010112: "半角英数字で入力してください。",
  E010113: "入力形式が正しくありません。「{0}」の形式で入力してください。",
  E010114: "{0}以上で入力してください。",
  E010115: "{0}以下で入力してください。",
} as const;

export function formatMessage(message: string, ...args: string[]): string {
  return args.reduce((formattedMessage, arg, index) => {
    const placeholder = `{${index}}`;
    return formattedMessage.replace(placeholder, arg);
  }, message);
}
