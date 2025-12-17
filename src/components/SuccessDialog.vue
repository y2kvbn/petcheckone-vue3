<template>
  <v-dialog :model-value="modelValue" @update:model-value="handleUpdate" persistent max-width="400px">
    <v-card>
      <v-card-title>
        <span class="headline">註冊成功</span>
      </v-card-title>
      <v-card-text>
        恭喜您，帳號已成功建立！請點擊下方按鈕前往登入頁面。
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="closeDialog">
          前往登入
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>

// --- Props & Emits ---
// This component now uses a standard v-model pattern and emits a 'close' event.
const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue', 'close']);

// --- Methods ---

// This method is called when the dialog's state changes internally (e.g., by clicking the overlay).
const handleUpdate = (value) => {
  emit('update:modelValue', value);
  // If the dialog is being closed, also emit the 'close' event.
  if (!value) {
    emit('close');
  }
};

// This method is called specifically when the user clicks the action button.
const closeDialog = () => {
  // First, tell the parent to update the v-model value to false.
  emit('update:modelValue', false);
  // Then, explicitly emit the 'close' event to trigger the parent's action (like redirection).
  emit('close');
};

</script>
