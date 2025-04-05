/** ONLY USE THIS ON THE FRONT END */
export function isProd() {
  if (typeof window !== "undefined" && window.location.hostname.includes("tetractys.fyi")) return true;
  return false;
}

export function getDomain() {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}${
      window.location.port ? `:${window.location.port}` : ""
    }`;
  }

  return null;
}
