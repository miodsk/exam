export interface JwtPayload {
  sub: number; // 通常存放用户 ID (Subject)
  username: string; // 用户名
  iat?: number; // 签发时间 (Issued At - 由 Passport 自动注入)
  exp?: number; // 过期时间 (Expiration Time - 由 Passport 自动注入)
}

declare module 'express' {
  interface Request {
    // 建议设为可选，或者确保在 Guard 之后使用
    user: {
      id: number;
      username: string;
    };
  }
}
export type Question = {
  id: number;
  question: string;
  type: 'radio' | 'checkbox' | 'input';
  options?: string[];
  score: number;
  answer: string | string[];
  answerAnalyse: string;
};
