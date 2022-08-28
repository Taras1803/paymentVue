<script setup>
import Datepicker from "@vuepic/vue-datepicker";
import BaseTable from "@/components/BaseTable";
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
const { monthNames, WEEKEND, columns } = constants();
const date = ref({
  hours: new Date().getHours(),
  minutes: new Date().getMinutes(),
});

const rows = ref();
const handleDate = (modelData) => {
  rows.value = [];
  date.value = modelData;
  const curentDate = date.value;
  // Current month logic

  rows.value = _.union(rows.value, [
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
    rows.value = _.union(rows.value, [
      {
        month: monthNames[i],
        payment: format(paymentDay),
        bonus: format(bonusDay),
      },
    ]);
  }
};
const handleGenerate = () => {
  const CSV = generateCSV(rows.value);
  download(CSV);
};
</script>

<template>
  <Datepicker
    v-model="date"
    :format="format"
    @update:modelValue="handleDate"
  ></Datepicker>
  <div v-if="rows">
    <BaseTable :data="rows" :columns="columns"></BaseTable>
    <button @click="handleGenerate">Generate CSV</button>
  </div>
</template>
