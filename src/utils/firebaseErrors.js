const errorMap = {
  'auth/user-not-found': '找不到此用戶，請檢查您輸入的資料。',
  'auth/wrong-password': '密碼錯誤，請重新輸入。',
  'auth/email-already-in-use': '此電子郵件地址已被註冊。',
  'auth/invalid-email': '電子郵件地址格式不正確。',
  'auth/weak-password': '密碼強度不足，請設定至少六位數的密碼。'
};

/**
 * Converts a Firebase error object to a user-friendly Chinese error message.
 * @param {object} error The Firebase error object, containing a 'code' property.
 * @returns {string} A user-friendly error message in Traditional Chinese.
 */
export function getFirebaseErrorMessage(error) {
  if (error && error.code) {
    return errorMap[error.code] || '發生未知錯誤，請稍後再試或聯繫客服。';
  }
  return '發生未知錯誤，請稍後再試或聯繫客服。';
}
