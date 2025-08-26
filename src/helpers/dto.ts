import { Dayjs } from "dayjs";
import {
  AccountRole,
  AgeGroup,
  NotificationRecordType,
  NotificationType,
  PromoActionType,
  RegistrationSource,
  SettingValidator,
} from "./enums";

export type OrderDirection = "asc" | "desc" | null | undefined;

export interface LoginRequestDto {
  readonly login: string;
  readonly password: string;
}

export interface ConfirmationCodeInfo {
  address: string;
  lifeTime: number;
  deliveryMethod: string;
}

export interface TokenResponseDto {
  authToken: string;
}

export interface RefreshTokenDto extends TokenResponseDto {
  refreshToken: string;
}

export interface LoginResponseDto extends RefreshTokenDto {
  readonly role: AccountRole;
  readonly isPasswordExpired: boolean;
  readonly isTwoFactorAuth: boolean;
  confirmationCodeInfo?: ConfirmationCodeInfo;
}

export interface TokenData {
  userId?: number;
  role: AccountRole;
  appCode?: string;
  medicalNetId: number;
  langCode?: string;
  medecinsId?: number;
  meddepClinicId?: number;
  jti?: string;
}

export interface ClinicDto {
  clinicId?: number;
  code: string;
  title: string;
  postalAddress: string;
  phone: string;
  url: string;
  comment?: string;
  cdate: Date;
  clientServiceId: number;
  medicalBrandId?: number;
  isAnonymousVisitsProhibited: boolean;
  defaultMedicalNetId?: number;
  isVisible: boolean;
  email: string;
  clientDatabaseId?: number;
}

export interface ClinicImageDto {
  clinicImageId?: number;
  clinicId: number;
  image: string;
  sortOrder: number;
}

export interface ClinicSpecializationDto {
  clinicId?: number;
  clinicSpecializationId?: number;
  name?: string;
  specializationId?: number;
}

export interface ClinicPlExGrWebDto {
  clinicDatabaseId?: number;
  plExGrWebId?: number;
  code?: string;
  specializationId?: number;
}

export interface MedicalNetActionDto {
  medicalnetActionsId?: number;
  description: string;
  medicalNetId: number;
  sortOrder: number;
  dateFrom: Date | null;
  dateTo: Date | null;
  url: string;
  image: string;
  actionText: string;
  actionType: PromoActionType;
}

export interface MedicalNetDto {
  medicalNetId?: number;
  code: string;
  title: string;
  notifyEmail: string;
  notifyPhone: string;
  activeDate: Date;
  appCode: string;
  websiteUrl: string;
  license: string;
  logo: string;
  isLicenseValid: boolean;
}

export enum ClientComponentCheckStatus {
  Success = 1,
  Warning = 2,
  Error = 3,
}

export interface ClientComponentStatus {
  code: string;
  title: string;
  version: string;
  protocol: string;
  checkStatus: ClientComponentCheckStatus;
  message?: string;
}

export interface ClientServiceDto {
  id?: number;
  label: string;
  params: string;
  state: string;
  updateConfig: number;
  address: string;
  fileServerAddress: string;
  dbdataAddress: string;
  hl7Address: string;
  discoveryAddress: string;
  discoveryToken: string;
  calypsoAddress: string;
  calypsoKey: string;
  clientKey: string;
  versionInfo: string;
  versionDate: Date;
  componentStatus?: ClientComponentStatus[];
}

export interface MedicalBrandDto {
  medicalBrandId?: number;
  code: string;
  title: string;
  logo: string;
  email?: string | null;
  phone: string | null;
}

export interface SpecializationNameDto {
  specializationId: number;
  langCode: string;
  name: string;
  description: string;
  shortDescription: string;
}

export interface SpecializationOrderDto {
  specializationOrderId: number;
  specializationId: number;
  medicalNetId: number;
  sortOrder: number;
}

export interface SpecializationDto {
  specializationId?: number;
  code: string;
  image: string;
  largeImage: string;
  names: SpecializationNameDto[];
  orders: SpecializationOrderDto[];
}

export interface UserDto {
  userId?: number;
  password?: string;
  email?: string;
  phone?: string;
  cdate?: Date;
  isActive: boolean;
  userType: number;
  esiaId?: string;
  confirmDate?: Date;
  isTwoFactorAuth?: boolean;
  sessionLifetime?: number;
  isPasswordExpired?: boolean;
  medicalNetId?: number;
  registrationSourceId?: RegistrationSource;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  fullName?: string;
  birthDate?: string | null;
  gender?: string;
  snils?: string;
  mmk?: number;
  lastActive?: Date | null;
  hasDuplicate?: boolean;
}

export interface ListDto<T> {
  rows: T[];
  totalCount: number;
}

export interface UserInfoDto {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  gender: string;
  birthDate: Dayjs | null;
  email: string;
  phone: string;
  emailCandidate: string;
  phoneCandidate: string;
  snils: string;
  canDeleteAccount: boolean;
  photoUrl: string;
  // { array<ExternalMmkInfo>} mmkList - Список идентификаторов ММК в разных клиниках
  isTwoFactorAuth: boolean;
  isEsiaConntected: boolean;
}

export interface NotificationTemplateDto {
  ntfTemplateClinicId?: number;
  description: string;
  notificationType: NotificationType;
  medicalNetId?: number;
  clinicId?: number;
  recordType: NotificationRecordType;
  template?: string;
  templateHtml?: string;
  langCode: string;
}

export interface AgreementTypeDto {
  agreementTypeId: number;
  code: string;
}

export interface AgreementDto {
  agreementId?: number;
  agreementTypeId: number;
  medicalNetId: number;
  platform?: string;
  langCode: string;
  description?: string;
  agreement: string;
  sortOrder?: number;
}

export interface TranslationsDto {
  id?: number;
  accountId?: number;
  checkedEn: boolean;
  checkedFr: boolean;
  checkedRu: boolean;
  email?: string;
  fname?: string;
  gkey?: string;
  langEn: string;
  langFr: string;
  langRu: string;
  lname?: string;
  pname?: string;
  tkey?: string;
  created_at?: Date;
  updated_at?: Date;
}

export type TranslationCheckIndex = "checkedRu" | "checkedFr" | "checkedEn";

export interface TranslationsCheckedDto {
  ids: number[];
  accountId: number;
  checkedEn: boolean;
  checkedFr: boolean;
  checkedRu: boolean;
}

export interface TranslationsBackupsDto {
  pname: string;
  backuped_at: Date;
}

export type ServiceTaskStatus = "inactive" | "running" | "ready" | "error";

export interface ServiceTaskState {
  status: ServiceTaskStatus;
  messages: string[];
}

export interface ServiceTaskItem {
  title: string;
  name: string;
  state: ServiceTaskState;
}

export interface ServiceTaskItemsDto {
  dbCleaner: ServiceTaskItem[];
  cacheCleaner: ServiceTaskItem[];
  cacheWarmUp: ServiceTaskItem[];
}

export interface ServiceMetricValue {
  sum?: number;
  count: number;
}

export interface ServiceMetricDataset {
  name: string;
  values: ServiceMetricValue[];
}

export interface ServiceMetric {
  name: string;
  title: string;
  type: string;
  datasets: ServiceMetricDataset[];
  labels?: string[];
}

export interface SourceDistributionDto {
  registrationSourceId: number;
  cnt: number;
}

export interface AgeDistributionDto {
  age: number;
  cnt: number;
}

export interface VisitDistributionDto {
  isAnonymous: boolean;
  isMobimedCreated: boolean;
  cnt: number;
}

export interface VisitDistributionByMonthDto extends VisitDistributionDto {
  year: number;
  month: number;
}

export interface UserReportConditionDto {
  dateFrom?: Date;
  dateTo?: Date;
  medicalNetId?: number;
}

export interface AuditConditionDto {
  dateFrom: Date;
  dateTo: Date;
  medicalNetId?: number;
  eventType?: string;
  serviceName?: string;
  success?: boolean;
}

export interface DoctorCallDistributionDto {
  ageGroup: AgeGroup;
  cnt: number;
}

export interface NotificationDistributionDto {
  recordType: NotificationRecordType;
  notificationType: NotificationType;
  cnt: number;
}

export interface NotificationStatusDistributionDto {
  errors: number;
  retries: number;
  waiting: number;
  errorsInLog: number;
}

export interface EmrRecordDistributionByMonthDto {
  year: number;
  month: number;
  cnt: number;
}

export interface UserReportDto {
  sourceDistribution: SourceDistributionDto[];
  ageDistribution: AgeDistributionDto[];
  visitDistribution: VisitDistributionDto[];
  visitDistributionByMonth: VisitDistributionByMonthDto[];
  doctorCallDistribution: DoctorCallDistributionDto[];
  notificationDistribution: NotificationDistributionDto[];
  notificationStatusDistribution: NotificationStatusDistributionDto;
  emrRecordDistributionByMonth: EmrRecordDistributionByMonthDto[];
  condition: UserReportConditionDto;
}

export interface GenericSettingDto {
  groupName: string;
  name: string;
  code: string;
  value: string;
  validation: SettingValidator;
}

export interface SettingDto extends GenericSettingDto {
  id: number;
}

export interface SettingListDto {
  rows: SettingDto[];
}

export interface MedicalNetSettingDto extends GenericSettingDto {
  medicalNetSettingsId: number;
  medicalNetId: number;
  description?: string;
}

export interface MedicalNetSettingListgDto {
  rows: MedicalNetSettingDto[];
}

export interface CacheSettingDto {
  cacheSettingsId: number;
  groupName: string;
  code: string;
  name: string;
  driver: string;
  ttl: number;
  memoryTTL: number;
  hotSwap: boolean;
}

export interface CacheSettingListDto {
  rows: CacheSettingDto[];
}

export interface MedicalNetFaqDto {
  medicalNetFaqId?: number;
  medicalNetId: number;
  langCode: string;
  questionGroup: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export interface MedicalNetImageDto {
  medicalNetImageId?: number;
  medicalNetId?: number;
  name: string;
  image: string;
}

export interface ShortDoctorInfoDto {
  firstName: string;
  lastName: string;
}

export interface ShortUserInfo {
  firstName: string;
  lastName: string;
  middleName?: string;
  email?: string;
  phone?: string;
}

export interface SpamDto {
  spamId: number;
  ip: string;
  address: string;
  spamReasonId: number;
  cdate: Date;
}

export interface GenericReviewDto {
  id?: number;
  doctorId: number;
  clinicId: number;
  clinicName: string;
  userId: number;
  date: Date;
  rating?: number;
  text?: string;
  userInfo: ShortUserInfo;
  doctorInfo?: ShortDoctorInfoDto;
}

export interface DoctorReviewDto extends GenericReviewDto {
  isFavorite?: boolean;
  approveUserId?: number;
  approveDate?: Date;
}

export interface EmrReviewDto extends GenericReviewDto {
  visitDate: Date;
  visitType: string;
}

export interface EmrRecordDto {
  emrRecordId: number;
  id: number;
  isApproved: boolean;
  description: string;
  dateTime: Date;
  clinicId: number;
  doctorId: number;
  visitId: number;
  modelNameMultiLang: string;
  specializationNameMultiLang: string;
  rating: number;
  reviewText: string;
  reviewDate: Date;
  reviewSendDate: Date;
}

export interface VisitRecordDto {
  visitId: number;
  emrId: number | null;
  doctorId: number;
  doctorName: string | null;
  doctorSpec: string;
  clinicId: number;
  planningId: string;
  plExamName: string | null;
  visitDate: Date;
  comment: string;
  isCanceled: boolean;
  cdate: Date;
  mobimedCr: boolean;
  emrGroupId: number;
  notAccepted: boolean;
  medecinId: number | null;
  iCameFlag: boolean | null;
  patientChatUserId: number | null;
  medecinChatUserId: number | null;
  duration: number | null;
  conferenceId: string | null;
  conferenceStatus: number | null;
  medecinsCreatorId: number;
  patientFio: string;
  fmInvoiceId: number;
  isOutsidePlanning: boolean;
  hasHl7: boolean;
}

export interface VisitIsOutsidePlanningDto {
  isOutsidePlanning: boolean;
}

export interface MedicalNetLicenseLimitRecord {
  id: string;
  code: string;
  limitValue?: number;
  currentValue: number;
}

export interface MedicalNetLicenseData {
  limits: MedicalNetLicenseLimitRecord[];
  features: string[];
}

export interface WebFormDto {
  calypsoFormId?: number;
  medicalNetId: number;
  formUUID: string;
  scope?: string;
  title: string;
  icon?: string;
  control: string;
  position?: number;
  isEnabled: boolean;
}

export interface WebFormAuthResultDto {
  address: string;
  accessToken: string;
  refreshToken: string;
}

export interface ConfirmationCodeSettingDto {
  confirmationCodeType: number;
  lifeTime: number;
  maxTryCount: number;
  nextCodeDelay: number;
}

export interface Hl7SettingDto {
  hl7NotificationTypeId: number;
  hl7NotificationType: string;
  handleMessages: boolean;
  logMessages: boolean;
}

export interface CacheValueDto {
  value: string;
  type: string;
  ttl: number;
}

export interface ServiceInfoDto {
  connection: string;
  version: string;
  mode?: string;
  logLevel: string;
  eventList: string[];
}

export interface ServiceCommandDto {
  result: string;
}

export interface Hl7LogDto {
  hl7LogId: number;
  addressHL7: string;
  addressTelemed: string;
  message: string;
  cdate: Date;
  hl7NotificationTypeId: number;
}

export interface ConfirmationCodeDto {
  confirmationCodesId: number;
  userId: number;
  code: string;
  confirmationCodeTypesId: number;
  lifeTime: number;
  customData: string;
  creationDate: Date;
  serverDateTime: Date;
  maxTryCnt: number;
  tryCnt: number;
  nextCodeDelay: number;
}

export interface MergePatientInfoDto {
  userId: number;
  emrGroupId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: string | null;
  photo?: string;
  email?: string;
  phone?: string;
  mmk?: number;
  hasPassword: boolean;
  visitCount: number;
  chatCount: number;
  reviewCount: number;
}

export interface MergeInfoDto {
  source?: MergePatientInfoDto;
  target?: MergePatientInfoDto;
}

export interface HealthDto {
  readonly success: boolean;
  readonly version: string;
}

export interface AuditOriginDto {
  type: string;
  address: string;
}

export interface AuditItemDto {
  id: string;
  timestamp: Date;
  eventType: string;
  action: string;
  workspaceId: number;
  sessionId: string;
  userId: number;
  origin: AuditOriginDto;
  message: string;
  success: boolean;
  props: Record<string, any>;
}

export interface RateLimitDto {
  rateLimitSettingsId?: number;
  routePath: string;
  windowMs: number;
  rateLimit: number;
  isEnabled: boolean;
  limitReason?: string;
}

export interface HelpDto {
  code: string;
  value: string;
}

export interface MedicalNetSettingsInfoDto {
  doctorCallText: string;
  doctorBeforeCallText: string;

  useTimeSlotsCache: boolean;
  usePlExGrWebSpecializations: boolean;
  isPaymentsEnabled: boolean;

  isChatEnabled: boolean;
  chatServerAddress: string;

  isAnonymousVisitsEnabled: boolean;
  isAnonymousChildrenEnabled: string;

  isDirectionsEnabled: boolean;
  isFaqEnabled: boolean;
  isPrescribedDrugsEnabled: boolean;
  isRecommendationsEnabled: boolean;
  isOTPAuthEnabled: boolean;
  isDoctorAuthEnabled: boolean;
  showTimeSlotsCacheSwitch: boolean;
  showFavoriteDoctors: boolean;
  showDoctorsRating: boolean;
  showVisitPrice: boolean;
  showVisitCabinet: boolean;
  showInvoices: boolean;
  showFilterOnline: boolean;
  showLanguageSwitch: boolean;
  showStoreLinks: boolean;
  showChatWithOperator: boolean;
  showEsiaAuth: boolean;
  showQrCodeAuth: boolean;

  showInsuranceOMS: boolean;
  showInsuranceDMS: boolean;
  showFastAppointmentButton: boolean;
  showFastDoctorCallButton: boolean;
  showFastClinicsOnMapButton: boolean;
  showFastClinicPhoneButton: boolean;
  showFastAmbulanceButton: boolean;
  showFastMedicalCardButton: boolean;
  showFastAboutClinicButton: boolean;
  showFastReportErrorButton: boolean;
  showAddVisitComment: boolean;
  showPayVisitButton: boolean;

  startPage: string;
  requireStartPageAuth: string;
  requireVisitCustomCheck: boolean;
  visitCustomCheck: string;
  authIdentifiers: string;
  filterWithTimeSlotsOnly: boolean;
  filterWithPlanningOnly: boolean;
  ageLimitLow: number;
  ageLimitHigh: number;
  linkGooglePlay: string;
  linkAppStore: string;
  linkRuStore: string;
  defaultSpecialization: string;
  invoiceDateMin: Date;
  useLocalInvoices: boolean;
  timeSlotsCacheDepth: number;

  sendPushEnabled: boolean;
  sendSMSEnabled: boolean;
  sendEmailEnabled: boolean;
  sendVoiceCallEnabled: boolean;

  appVersionMin: string;
  appVersionText: string;
  appVersionGooglePlay: string;
  appVersionAppStore: string;
  appVersionRuStore: string;

  mapsType: string;
  mapsKey: string;
  mapsAppKey: string;
  mapsZoomDefault: boolean;
  isCaptchaEnabled: boolean;
  captchaType: string;
  captchaSiteKey: string;
  isSignCheckEnabled: boolean;
  clinicWebsiteUrl: string;
  clinicLogoUrl: string;
  iCameMessageMinutesRange: number;
  isReviewEnabled: boolean;
  isSettingChildRepresentativeEnabled: boolean;
  requiredRegistrationFields: boolean;
  disabledProfileFields: string;
  calendarVersion: number;
  ambulancePhone: string;
  uiType: string;
}

export interface ChatUserDto {
  userId: number;
  medicalNetId: number;
  role: number;
  clinicId: number;
  medecinsId: number;
}

export interface ChatIdentifiersDto {
  chatUserId: number;
  operatorGroupId: number;
  warning?: string;
}

export interface UserNotificationSettingDto {
  userNotificationId: number;
  userId: number;
  recordType: number;
  notificationType: number;
  isEnabled: boolean;
  modifyDate: Date;
}

export interface NotificationDto {
  ntfNotifyId: number;
  userId: number;
  clinicId: number;
  medicalNetId: number;
  recId: number;
  recordType: number;
  notifyDate: Date;
  notifyText: string;
  customNotifyTitle: string;
  notificationType: number;
  eventType: number;
  tryCount: number;
  tryDate: Date;
  status: number;
  tryNextDate: Date;
  notifyAddress: string;
  smsServiceId: number;
  smsPrice: number;
  sendErrorText: string;
  smsPriceCount: number;
  notifyTextHtml: string;
}


export interface ClientDatabaseDto {
  clientDatabaseId: number;
  name: string;
}
