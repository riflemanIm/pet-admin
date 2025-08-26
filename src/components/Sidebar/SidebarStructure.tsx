import React from 'react';
import {
  Translate as TranslateIcon,
  Chat as ChatIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CardGiftcard as CardGiftcardIcon,
  Dns as DnsIcon,
  DonutLarge as DonutLargeIcon,
  LibraryAdd as LibraryAddIcon,
  LocalHospital as LocalHospitalIcon,
  BadgeOutlined as BadgeIcon,
  AcUnit as AcUnitIcon,
  Build as BuildIcon,
  Handshake as HandshakeIcon,
  Settings as SettingsIcon,
  ConfirmationNumber as ConfirmationNumberIcon,
  SendTimeExtension as SendTimeExtensionIcon,
  DataObject as DataObjectIcon,
  LiveHelp as LiveHelpIcon,
  Reviews as ReviewsIcon,
  VerifiedUser as VerifiedUserIcon,
  Speed as SpeedIcon,
  SvgIconComponent
} from '@mui/icons-material';
import { AccountRole, Feature } from '../../helpers/enums';
import CalyspoIcon from './calypso';

export interface StructureItem {
  kind?: 'page' | 'header' | 'divider';
  id: string;
  role?: AccountRole[];
  features?: Feature[];
  link?: string;
  icon?: SvgIconComponent;
}

const structure: StructureItem[] = [
  {
    id: 'content',
    kind: 'header',
    role: [AccountRole.admin, AccountRole.netAdmin, AccountRole.netMarketer]
  },
  {
    id: 'specialization',
    role: [AccountRole.admin, AccountRole.netAdmin],
    features: [],
    icon: BadgeIcon,
    link: 'specialization/list'
  },
  {
    id: 'promo',
    role: [AccountRole.admin, AccountRole.netAdmin, AccountRole.netMarketer],
    features: [Feature.web, Feature.mobile],
    icon: CardGiftcardIcon,
    link: 'promo/list'
  },
  {
    id: 'clinic',
    role: [AccountRole.admin, AccountRole.netAdmin],
    features: [],
    icon: LocalHospitalIcon,
    link: 'clinic/list'
  },
  {
    id: 'medical_net',
    role: [AccountRole.admin, AccountRole.netAdmin],
    features: [],
    icon: LibraryAddIcon,
    link: 'medical_net/list'
  },
  {
    id: 'medical_brand',
    role: [AccountRole.admin],
    features: [],
    icon: AcUnitIcon,
    link: 'medical_brand/list'
  },
  {
    id: 'notificationTemplate',
    role: [AccountRole.admin, AccountRole.netAdmin],
    features: [Feature.web, Feature.mobile],
    link: 'notificationTemplate/list',
    icon: EmailIcon
  },
  {
    id: 'agreement',
    role: [AccountRole.admin, AccountRole.netAdmin],
    features: [Feature.web, Feature.mobile],
    link: 'agreement/list',
    icon: HandshakeIcon
  },
  {
    id: 'medicalNetFaq',
    role: [AccountRole.admin, AccountRole.netAdmin],
    features: [Feature.web, Feature.mobile],
    link: 'medicalNetFaq/list',
    icon: LiveHelpIcon
  },
  {
    id: 'webForms',
    role: [AccountRole.admin],
    features: [],
    icon: CalyspoIcon,
    link: 'webForm/list'
  },
  {
    id: 'userData',
    kind: 'header',
    role: [AccountRole.admin, AccountRole.netAdmin, AccountRole.operator]
  },
  {
    id: 'users',
    role: [AccountRole.admin, AccountRole.netAdmin, AccountRole.operator],
    features: [],
    link: 'user/list',
    icon: PersonIcon
  },
  {
    id: 'chat',
    role: [AccountRole.operator],
    features: [Feature.chat],
    link: 'chat',
    icon: ChatIcon
  },
  {
    id: 'reviews',
    role: [AccountRole.admin],
    features: [],
    link: 'review/list',
    icon: ReviewsIcon
  },
  {
    id: 'manage',
    kind: 'header',
    role: [AccountRole.admin, AccountRole.netAdmin, AccountRole.operator]
  },
  {
    id: 'service',
    role: [AccountRole.admin],
    features: [],
    icon: DnsIcon,
    link: 'service/list'
  },
  {
    id: 'settings',
    role: [AccountRole.admin],
    features: [],
    icon: SettingsIcon,
    link: 'setting/list'
  },
  {
    id: 'cacheSettings',
    role: [AccountRole.admin, AccountRole.netAdmin],
    features: [],
    icon: DataObjectIcon,
    link: 'cacheSetting/list'
  },
  {
    id: 'hl7Settings',
    role: [AccountRole.admin],
    features: [],
    icon: SendTimeExtensionIcon,
    link: 'hl7Setting/list'
  },
  {
    id: 'rateLimitSettings',
    role: [AccountRole.admin],
    features: [],
    icon: SpeedIcon,
    link: 'rateLimit/list'
  },
  {
    id: 'confirmationCodeSettings',
    role: [AccountRole.admin, AccountRole.netAdmin],
    features: [Feature.web, Feature.mobile],
    icon: ConfirmationNumberIcon,
    link: 'confirmationCodeSetting/list'
  },
  {
    id: 'translation',
    role: [AccountRole.admin, AccountRole.interpreter],
    features: [],
    icon: TranslateIcon,
    link: 'translation/list'
  },
  {
    id: 'serviceTasks',
    role: [AccountRole.admin, AccountRole.netAdmin, AccountRole.operator],
    features: [],
    icon: BuildIcon,
    link: 'serviceTasks'
  },
  {
    id: 'reports',
    kind: 'header',
    role: [AccountRole.admin, AccountRole.netAdmin, AccountRole.netMarketer]
  },
  {
    id: 'statistics',
    role: [AccountRole.admin, AccountRole.netAdmin, AccountRole.netMarketer],
    features: [],
    link: 'user/report',
    icon: DonutLargeIcon
  },
  {
    id: 'audit',
    role: [AccountRole.admin, AccountRole.netAdmin],
    features: [],
    link: 'audit/list',
    icon: VerifiedUserIcon
  }
];

export default structure;
