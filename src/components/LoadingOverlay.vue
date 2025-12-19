<template>
  <v-dialog
    :model-value="modelValue"
    persistent
    width="300"
  >
    <v-card
      rounded="lg"
      class="pa-4"
    >
      <v-card-title class="text-center headline">
        {{ message }}
      </v-card-title>
      <v-card-text class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="50"
          width="5"
          class="ma-4"
        ></v-progress-circular>
        <p>請稍候，我們正在處理您的請求...</p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
  defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      default: "處理中...",
    },
  });
</script>
