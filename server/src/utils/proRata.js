/**
 * Calculate pro-rata rent for partial month stays
 * @param {number} monthlyRent - Full monthly rent amount
 * @param {Date} startDate - Move-in date
 * @returns {object} { proRataAmount, remainingDays, totalDaysInMonth }
 */
const calculateProRata = (monthlyRent, startDate) => {
  const date = new Date(startDate);
  const year = date.getFullYear();
  const month = date.getMonth();
  const dayOfMonth = date.getDate();

  // Total days in the start month
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  // Remaining days (inclusive of start date)
  const remainingDays = totalDaysInMonth - dayOfMonth + 1;

  // Pro-rata calculation
  const dailyRate = monthlyRent / totalDaysInMonth;
  const proRataAmount = Math.round(dailyRate * remainingDays * 100) / 100;

  return {
    proRataAmount,
    remainingDays,
    totalDaysInMonth,
    dailyRate: Math.round(dailyRate * 100) / 100,
  };
};

/**
 * Calculate electricity bill from meter readings
 * @param {number} previousReading
 * @param {number} currentReading
 * @param {number} ratePerUnit - Price per kWh
 * @returns {object} { unitsConsumed, totalAmount }
 */
const calculateElectricityBill = (previousReading, currentReading, ratePerUnit = 8) => {
  const unitsConsumed = currentReading - previousReading;
  const totalAmount = Math.round(unitsConsumed * ratePerUnit * 100) / 100;

  return {
    unitsConsumed,
    ratePerUnit,
    totalAmount,
  };
};

module.exports = { calculateProRata, calculateElectricityBill };
