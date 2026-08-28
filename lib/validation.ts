// 表單驗證工具

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// 手機號碼驗證 (台灣格式)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^09\d{2}-?\d{3}-?\d{3}$/;
  return phoneRegex.test(phone.replace(/-/g, ''));
};

// 電子郵件驗證
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 台灣手機號碼格式化
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

// 驗證碼驗證 (6位數字)
export const validateVerificationCode = (code: string): boolean => {
  return /^\d{6}$/.test(code);
};

// 健康回報表單驗證
export const validateHealthReport = (data: {
  sleep: string;
  energy: string;
  digestion: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.sleep) {
    errors.sleep = '請選擇睡眠品質';
  }
  if (!data.energy) {
    errors.energy = '請選擇精神狀態';
  }
  if (!data.digestion) {
    errors.digestion = '請選擇腸胃狀況';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// 顧問案件表單驗證
export const validateAdvisorCase = (data: {
  type: string;
  subject: string;
  description: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.type) {
    errors.type = '請選擇案件類型';
  }
  if (!data.subject || data.subject.length < 5) {
    errors.subject = '主旨至少需要5個字元';
  }
  if (!data.description || data.description.length < 10) {
    errors.description = '詳細描述至少需要10個字元';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// 個人資料表單驗證
export const validateProfile = (data: {
  name: string;
  phone: string;
  email?: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.length < 2) {
    errors.name = '姓名至少需要2個字元';
  }
  if (!validatePhone(data.phone)) {
    errors.phone = '請輸入有效的手機號碼 (09xx-xxx-xxx)';
  }
  if (data.email && !validateEmail(data.email)) {
    errors.email = '請輸入有效的電子郵件地址';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// 訂單歸戶表單驗證
export const validateOrderLink = (data: {
  platform: string;
  orderNumber: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.platform) {
    errors.platform = '請選擇購買平台';
  }
  if (!data.orderNumber || data.orderNumber.length < 5) {
    errors.orderNumber = '請輸入有效的訂單編號';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// 通用錯誤訊息顯示
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return '發生未知錯誤，請稍後再試';
};

// 表單欄位錯誤顯示組件用的 helper
export const getFieldError = (errors: Record<string, string>, fieldName: string): string | undefined => {
  return errors[fieldName];
};

export const hasFieldError = (errors: Record<string, string>, fieldName: string): boolean => {
  return fieldName in errors;
};