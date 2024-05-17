function degreesToRadians(degrees: number) {
  return degrees * Math.PI / 180;
}

function radiansToDegrees(radians: number) {
  return radians * 180 / Math.PI;
}

function addDistance(coordinates: [number, number], distance: number, bearing: number = 180) {
  const earthRadiusKm = 6371;
  const distanceKm = distance / 1000; // Convert meters to kilometers
  const bearingRad = degreesToRadians(bearing);

  const lat1 = degreesToRadians(coordinates[0]);
  const lon1 = degreesToRadians(coordinates[1]);

  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distanceKm / earthRadiusKm) +
      Math.cos(lat1) * Math.sin(distanceKm / earthRadiusKm) * Math.cos(bearingRad));

  const lon2 = lon1 + Math.atan2(Math.sin(bearingRad) * Math.sin(distanceKm / earthRadiusKm) * Math.cos(lat1),
      Math.cos(distanceKm / earthRadiusKm) - Math.sin(lat1) * Math.sin(lat2));

  return [
      radiansToDegrees(lat2),
      radiansToDegrees(lon2)
  ];
}

export default addDistance;