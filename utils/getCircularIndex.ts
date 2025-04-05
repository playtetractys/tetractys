export const getCircularIndex = (index: number, array: unknown[], option: { asc: boolean }) => {
  if (option.asc) return (index + 1) % array.length;
  return (index + array.length - 1) % array.length;
};
