<template>
  <v-dialog v-model="dialog" max-width="400" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="d-flex justify-center align-center text-h5 font-weight-bold green-bg">
        <v-icon left color="white">mdi-check-circle</v-icon>
        <span class="ml-2 text-white">操作成功</span>
      </v-card-title>
      <v-card-text class="text-center text-h6 py-10">
        {{ message }}
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          color="green-darken-1"
          variant="elevated"
          size="large"
          block
          @click="closeDialog"
        >
          關閉
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  message: String,
});

const emit = defineEmits(['update:modelValue']);

const dialog = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  dialog.value = newValue;
});

const closeDialog = () => {
  emit('update:modelValue', false);
};
</script>

<style scoped>
.green-bg {
  background-color: #4CAF50; /* A pleasant green */
}
</style>
