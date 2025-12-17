
<template>
  <v-dialog v-model="dialog" persistent max-width="800px">
    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        會員服務契約
      </v-card-title>

      <v-card-text 
        ref="scrollContainer" 
        style="height: 400px; overflow-y: auto; background-color: #f5f5f5; border: 1px solid #e0e0e0; margin: 20px; padding: 20px;"
      >
        <PetServiceContract />
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" text @click="close">取消</v-btn>
        <v-btn
          color="primary"
          @click="handleAgree"
        >
          我已閱讀並同意
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, nextTick, defineEmits, defineExpose } from 'vue';
import PetServiceContract from './legal/PetServiceContract.vue';

// Component State
const dialog = ref(false);

// Template Refs
const scrollContainer = ref(null);

// Emits
const emit = defineEmits(['agree']);

// --- Logic ---

const handleAgree = () => {
  emit('agree');
  close();
};

// --- Exposed Methods ---

const open = () => {
  dialog.value = true;
  // Use nextTick to ensure the DOM is updated before trying to access scrollContainer
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = 0;
    }
  });
};

const close = () => {
  dialog.value = false;
};

// Expose the 'open' method to the parent component
defineExpose({
  open,
});
</script>

<style scoped>
/* Styling for the component if needed */
</style>
