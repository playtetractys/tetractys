const RADIUS_OF_THE_EARTH_IN_KM = 6371;

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

export const getDistanceInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const a =
    Math.pow(Math.sin(deg2rad(lat2 - lat1) / 2), 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.pow(Math.sin(deg2rad(lon2 - lon1) / 2), 2);

  // Distance in km
  return RADIUS_OF_THE_EARTH_IN_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
