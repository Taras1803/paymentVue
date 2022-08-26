<script setup>
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { ref } from "vue";
import _ from "lodash";

const date = ref({
  hours: new Date().getHours(),
  minutes: new Date().getMinutes(),
});
const WEEKEND = [6, 0];
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

const handleDate = (modelData) => {
  date.value = modelData;
  const curentDate = date.value;
  // Current month logic
  let data = [];
  data = _.union(data, [
    {
      month: monthNames[curentDate.getMonth()],
      payment:
        _.includes(WEEKEND, curentDate.getDay()) &&
        getPaymentDay(endOfMonth(curentDate)) < curentDate
          ? "-"
          : format(getPaymentDay(endOfMonth(curentDate))),
      bonus:
        curentDate.getDate() <= 15
          ? format(getBonusDay(bonusDay(curentDate)))
          : "-",
    },
  ]);
  // Not current month logic
  for (let i = curentDate.getMonth() + 1; i <= 11; i++) {
    const paymentDay = getPaymentDay(
      new Date(curentDate.getFullYear(), i + 1, 0)
    );
    const bonusDay = getBonusDay(new Date(curentDate.getFullYear(), i, 15));
    data = _.union(data, [
      {
        month: monthNames[i],
        payment: format(paymentDay),
        bonus: format(bonusDay),
      },
    ]);
  }
  const csv = generateCSV(data);
  download(csv);
};
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
</script>

<template>
  <Datepicker
    v-model="date"
    :format="format"
    @update:modelValue="handleDate"
  ></Datepicker>
</template>
