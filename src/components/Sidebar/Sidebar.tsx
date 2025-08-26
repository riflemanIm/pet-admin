import React, { useState, useEffect } from "react";
import { Box, Drawer, Toolbar } from "@mui/material";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";

// styles
import useStyles from "./styles";

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";
import { useUserState } from "../../context/UserContext";
import { StructureItem } from "./SidebarStructure";
import { useTranslation } from "react-i18next";
import { AccountRole } from "../../helpers/enums";
import {
  DashboardSidebarSubNavigation,
  getDrawerWidthTransitionMixin,
} from "./components/Navigation";

interface SidebarProps {
  structure: StructureItem[];
}

const drawerWidth = 320;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const allowItem = (
  item: StructureItem,
  role: AccountRole,
  features: string[]
): boolean => {
  const allowRole = !item.role || item.role.includes(role);
  if (!allowRole) return false;
  if (
    role === AccountRole.admin ||
    !item.features ||
    item.features.length === 0
  )
    return true;
  for (const feature of item.features)
    if (features.includes(feature)) return true;
  return false;
};

function Sidebar({ structure }: SidebarProps): JSX.Element {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const {
    currentUser: { role },
    features,
  } = useUserState();

  // global
  const { isSidebarOpened } = useLayoutState();
  const layoutDispatch = useLayoutDispatch();

  // local
  const [isPermanent, setPermanent] = useState(true);
  const [isNavigationFullyExpanded, setIsNavigationFullyExpanded] =
    React.useState(isSidebarOpened);

  React.useEffect(() => {
    if (isSidebarOpened) {
      const drawerWidthTransitionTimeout = setTimeout(() => {
        setIsNavigationFullyExpanded(true);
      }, theme.transitions.duration.enteringScreen);

      return () => clearTimeout(drawerWidthTransitionTimeout);
    }

    setIsNavigationFullyExpanded(false);

    return () => {};
  }, [isSidebarOpened, theme]);

  useEffect(function () {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });

  const selectedItemIdRef = React.useRef("");

  const handleNavigationLinkClick = React.useCallback(() => {
    selectedItemIdRef.current = "";
  }, []);

  const navigation = structure
    .filter((item) => allowItem(item, role, features))
    .map((link) => ({
      ...link,
      title: t(`SIDEBAR.${link.id}`),
      icon: link.icon ? <link.icon /> : undefined,
    }));

  const getDrawerContent = React.useCallback(
    (isMini: boolean, ariaLabel: string) => (
      <React.Fragment>
        <Toolbar />
        <Box
          component="nav"
          aria-label={ariaLabel}
          sx={{
            overflow: "auto",
            pt: navigation[0]?.kind === "header" && !isMini ? 0 : 2,
          }}
        >
          <DashboardSidebarSubNavigation
            subNavigation={navigation}
            onLinkClick={handleNavigationLinkClick}
            isMini={isMini}
            isFullyExpanded={isNavigationFullyExpanded}
            hasDrawerTransitions={false}
            selectedItemId={selectedItemIdRef.current}
          />
        </Box>
      </React.Fragment>
    ),
    [handleNavigationLinkClick, isNavigationFullyExpanded, navigation]
  );

  const getDrawerSharedSx = React.useCallback(
    (isMini: boolean) => {
      const drawerWidth = isMini ? 64 : 320;
      return {
        width: drawerWidth,
        flexShrink: 0,
        ...getDrawerWidthTransitionMixin(isSidebarOpened),
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundImage: "none",
          ...getDrawerWidthTransitionMixin(isSidebarOpened),
        },
      };
    },
    [isSidebarOpened]
  );

  return (
    <StyledDrawer
      variant={isPermanent ? "permanent" : "temporary"}
      sx={{
        display: { xs: "none", md: "block" },
        ...getDrawerSharedSx(!isSidebarOpened),
      }}
      open={isSidebarOpened}
    >
      {getDrawerContent(!isSidebarOpened, "Desktop")}
    </StyledDrawer>
  );

  // ##################################################################
  function handleWindowWidthChange() {
    const windowWidth = window.innerWidth;
    const breakpointWidth = theme.breakpoints.values.md;
    const isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default Sidebar;
