import * as React from 'react';

export interface NavigationPageItem {
    kind?: "page";
    link?: string;
    segment?: string;
    title?: string;
    icon?: React.ReactNode;
    pattern?: string;
    action?: React.ReactNode;
    children?: Navigation;
}

export interface NavigationSubheaderItem {
    kind: "header";
    title: string;
}

export interface NavigationDividerItem {
    kind: "divider";
}

export type NavigationItem =
    | NavigationPageItem
    | NavigationSubheaderItem
    | NavigationDividerItem;
export type Navigation = NavigationItem[];

export const getItemKind = (item: NavigationItem) => item.kind ?? "page";

export const isPageItem = (item: NavigationItem): item is NavigationPageItem =>
    getItemKind(item) === "page";

export const getItemTitle = (
    item: NavigationPageItem | NavigationSubheaderItem
) => {
    return isPageItem(item) ? item.title ?? item.segment ?? "" : item.title;
};

export function getPageItemFullPath(
    basePath: string,
    navigationItem: NavigationPageItem
) {
    if (navigationItem.link) {
        return navigationItem.link;
    }
    return `${basePath}${basePath && !navigationItem.segment ? "" : "/"}${navigationItem.segment ?? ""}`;
}

export function isPageItemSelected(
    navigationItem: NavigationPageItem,
    basePath: string,
    pathname: string
) {
    /*
      return navigationItem.pattern
      ? pathToRegexp(`${basePath}/${navigationItem.pattern}`).test(pathname)
      : getPageItemFullPath(basePath, navigationItem) === pathname;
      */
    return getPageItemFullPath(basePath, navigationItem) === pathname;
}

export function hasSelectedNavigationChildren(
    navigationItem: NavigationItem,
    basePath: string,
    pathname: string
): boolean {
    if (isPageItem(navigationItem) && navigationItem.children) {
        const navigationItemFullPath = getPageItemFullPath(
            basePath,
            navigationItem
        );

        return navigationItem.children.some((nestedNavigationItem) => {
            if (!isPageItem(nestedNavigationItem)) {
                return false;
            }

            if (nestedNavigationItem.children) {
                return hasSelectedNavigationChildren(
                    nestedNavigationItem,
                    navigationItemFullPath,
                    pathname
                );
            }

            return isPageItemSelected(
                nestedNavigationItem,
                navigationItemFullPath,
                pathname
            );
        });
    }

    return false;
}
