// assets
import { DashboardOutlined, UserOutlined } from '@ant-design/icons';

// mui icons
import ElderlyIcon from '@mui/icons-material/Elderly'; // ages
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'; // taste
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'; // designedFor
import ScienceIcon from '@mui/icons-material/Science'; // ingredient
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'; // hardness
import InventoryIcon from '@mui/icons-material/Inventory'; // packages
import PetsIcon from '@mui/icons-material/Pets'; // petSizes
import HealingIcon from '@mui/icons-material/Healing'; // specialNeeds
import CategoryIcon from '@mui/icons-material/Category';
// icons
const icons = {
  DashboardOutlined,
  UserOutlined,
  ElderlyIcon,
  RestaurantMenuIcon,
  PeopleAltIcon,
  ScienceIcon,
  FitnessCenterIcon,
  InventoryIcon,
  PetsIcon,
  HealingIcon,
  CategoryIcon
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    // {
    //   id: 'dashboard',
    //   title: 'Dashboard',
    //   type: 'item',
    //   url: '/dashboard/default',
    //   icon: icons.DashboardOutlined,
    //   breadcrumbs: false
    // },
    {
      id: 'user',
      title: 'Пользователи',
      type: 'item',
      url: '/user/list',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'food',
      title: 'Каталог',
      type: 'item',
      url: '/food',
      icon: icons.CategoryIcon,
      breadcrumbs: false
    },
    // --- справочники ---
    {
      id: 'ages',
      title: 'Возраст',
      type: 'item',
      url: '/ages/list',
      icon: icons.ElderlyIcon,
      breadcrumbs: false
    },
    {
      id: 'taste',
      title: 'Вкусы',
      type: 'item',
      url: '/taste/list',
      icon: icons.RestaurantMenuIcon,
      breadcrumbs: false
    },
    {
      id: 'designedFor',
      title: 'Для кого',
      type: 'item',
      url: '/designedFor/list',
      icon: icons.PeopleAltIcon,
      breadcrumbs: false
    },
    {
      id: 'ingredient',
      title: 'Ингредиенты',
      type: 'item',
      url: '/ingredient/list',
      icon: icons.ScienceIcon,
      breadcrumbs: false
    },
    {
      id: 'hardness',
      title: 'Жёсткость',
      type: 'item',
      url: '/hardness/list',
      icon: icons.FitnessCenterIcon,
      breadcrumbs: false
    },
    {
      id: 'packages',
      title: 'Упаковки',
      type: 'item',
      url: '/packages/list',
      icon: icons.InventoryIcon,
      breadcrumbs: false
    },
    {
      id: 'petSizes',
      title: 'Размеры питомцев',
      type: 'item',
      url: '/petSizes/list',
      icon: icons.PetsIcon,
      breadcrumbs: false
    },
    {
      id: 'specialNeeds',
      title: 'Особые потребности',
      type: 'item',
      url: '/specialNeeds/list',
      icon: icons.HealingIcon,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
