import _ from "lodash";

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
const download = (csv) => {
  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csv));
  link.setAttribute("download", "payments.csv");
  document.body.appendChild(link);
  link.click();
};
const generateCSV = (data) => {
  const fields = Object.keys(data[0]);
  const replacer = (key, value) => (value === null ? "" : value);
  var csv = data.map((row) => {
    return fields
      .map((fieldName) => {
        return JSON.stringify(row[fieldName], replacer);
      })
      .join(",");
  });
  csv.unshift(fields.join(","));
  return "data:text/csv;charset=utf-8," + csv.join("\r\n");
};
const getNextWednesday = (date) => {
  const dateCopy = new Date(date.getTime());
  return new Date(
    dateCopy.setDate(
      dateCopy.getDate() + ((7 - dateCopy.getDay() + 3) % 7 || 7)
    )
  );
};
const getPreviousFriday = (date) => {
  const dateCopy = new Date(date.getTime());
  return new Date(
    dateCopy.setDate(dateCopy.getDate() - ((dateCopy.getDay() + 2) % 7 || 7))
  );
};
const format = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
const getBonusDay = (day) =>
  _.includes(WEEKEND, day.getDay()) ? getNextWednesday(day) : day;
const getPaymentDay = (day) =>
  _.includes(WEEKEND, day.getDay()) ? getPreviousFriday(day) : day;
const endOfMonth = (day) => new Date(day.getFullYear(), day.getMonth() + 1, 0);
const bonusDay = (day) => new Date(day.getFullYear(), day.getMonth(), 15);
const functions = () => {
  return {
    generateCSV,
    download,
    format,
    getBonusDay,
    getPaymentDay,
    endOfMonth,
    bonusDay,
    monthNames,
    WEEKEND,
  };
};

export default functions;
