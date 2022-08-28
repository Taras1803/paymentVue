<script setup>
import { defineProps } from "vue";

defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    default: () => [],
    required: true,
  },
});
</script>

<template>
  <div class="scroll-container">
    <table class="table">
      <thead class="table-header">
        <tr>
          <th :key="index" v-for="(columnName, index) in columns">
            {{ columnName }}
          </th>
        </tr>
      </thead>

      <tbody class="body">
        <tr :key="rowIndex" v-for="(rowData, rowIndex) in data">
          <td :key="rowDataIndex" v-for="(value, rowDataIndex) in rowData">
            {{ value }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
td {
  border: 1px solid black;
  padding: 10px;
}
</style>
