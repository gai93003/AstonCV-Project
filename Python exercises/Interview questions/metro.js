function solution(start, dest, limit) {
  let totalCost = 0;
  let maxStation = 0;

  for (let i = 0; i < start.length; i++) {
    const boardAt = start[i];
    const leaveAt = dest[i];

    const DistanceTravelled = Math.abs(leaveAt - boardAt);

    const costOfTheRide = 1 + (2 * DistanceTravelled);

    totalCost += costOfTheRide;

    maxStation = Math.max(maxStation, boardAt, leaveAt);
  }

  const limitOfTheFee = limit(maxStation);

  if (totalCost > limitOfTheFee) {
    return limitOfTheFee;
  }

  return totalCost;
}