export function removeLastPath(pathname: string, count = 1) {
  const paths = pathname.split("/");
  paths.splice(paths.length - count);

  return paths.join("/");
}
