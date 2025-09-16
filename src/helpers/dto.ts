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
export interface FoodDto {
  id?: number;
  img?: string | null;
  artikul?: string | null;
  title?: string | null;
  type?: 'Treat' | 'Souvenirs' | 'DryFood';
  price?: number;
  priceDiscount?: number;
  stock?: number;
  isPromo?: boolean;
  createdAt?: string;

  tasteId?: number | null;
  ingredientId?: number | null;
  hardnessId?: number | null;

  designedForIds?: number[];
  ageIds?: number[];
  typeTreatIds?: number[];
  petSizeIds?: number[];
  packageIds?: number[];
  specialNeedsIds?: number[];
}
//
export interface ListDto<T> {
  rows: T[];
  totalCount: number;
}
export interface DictDto {
  id?: number;
  name: string | null;
}

export type OrderDirection = 'asc' | 'desc' | null | undefined;
