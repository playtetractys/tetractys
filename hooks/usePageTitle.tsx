import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

/**
 * Calculates the page titles and returns it for the handler to set
 * @param defaultTitle The default title if no routes are matched
 * @param routeMap The list of routes to match. Make sure the array elements are in the correct order (complex items before simple ones) so that the `includes` doesn't trigger too early
 * @returns The page title to be set
 */
export const usePageTitle = (defaultTitle: string, routeMap: { routeTo: string; pageTitle: string }[]) => {
  const pathname = usePathname();

  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    const validPageTitle = routeMap.find((each) => pathname.includes(each.routeTo));

    if (validPageTitle) {
      setPageTitle(validPageTitle.pageTitle);
    } else {
      setPageTitle(defaultTitle);
    }
  }, [pathname, defaultTitle, routeMap]);

  return pageTitle;
};
