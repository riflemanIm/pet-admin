// Минимальные типы под твою схему (User + Role, без medicalNet и т.п.)

export type Role = 'User' | 'Admin';

export interface TokenData {
  userId: number;
  email?: string;
  role: Role;
  // можно добавить другие клеймы, если они приходят в JWT:
  // name?: string;
  // authType?: 'Password' | 'ConfirmCode';
  // iat/exp идут от jwt-decode через JwtPayload
}

export interface TokenResponseDto {
  authToken: string; // JWT access token
}

export interface RefreshTokenDto extends TokenResponseDto {
  refreshToken: string; // JWT refresh token
}

export interface LoginResponseDto extends RefreshTokenDto {
  // можно добавить флаги, если бэк их отдаёт (необязательно)
  // isPasswordExpired?: boolean;
  // isTwoFactorAuth?: boolean;
}

export interface UserDto {
  userId?: number;
  password?: string;
  email?: string;
  name: string | null;
  balance: any; // Decimal; вернётся строкой
}

export interface ListDto<T> {
  rows: T[];
  totalCount: number;
}
export interface DictDto {
  id?: number;
  name: string | null;
}

export type OrderDirection = 'asc' | 'desc' | null | undefined;
