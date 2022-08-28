const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKEND = [6, 0];
const columns = ["Month", "Payment", "Bonus"];
const constants = () => {
  return { monthNames, WEEKEND, columns };
};
export default constants;
