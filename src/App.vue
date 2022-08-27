<script setup>
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { ref } from "vue";
import _ from "lodash";
import functions from "@/functions";
import constants from "@/constants";

const {
  generateCSV,
  download,
  format,
  getBonusDay,
  getPaymentDay,
  endOfMonth,
  bonusDay,
} = functions();
const { monthNames, WEEKEND } = constants();
const date = ref({
  hours: new Date().getHours(),
  minutes: new Date().getMinutes(),
});

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
</script>

<template>
  <Datepicker
    v-model="date"
    :format="format"
    @update:modelValue="handleDate"
  ></Datepicker>
</template>
