
<template>
  <v-dialog v-model="dialog" max-width="500px" persistent>
    <v-card class="pa-4 rounded-lg">
      <v-card-title class="text-h5 font-weight-bold">更新頭像</v-card-title>
      <v-card-text>
        <div v-if="!imageSrc" class="text-center">
          <v-btn color="primary" @click="triggerFileInput" variant="flat" rounded="lg">選擇圖片</v-btn>
          <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none;">
        </div>
        <div v-else>
          <vue-cropper
            ref="cropper"
            :src="imageSrc"
            :aspect-ratio="1"
            :view-mode="1"
            drag-mode="move"
            :auto-crop-area="0.8"
            :crop-box-resizable="false"
            :toggle-drag-mode-on-dblclick="false"
            preview=".img-preview"
            style="max-height: 400px;"
          ></vue-cropper>
          <p class="text-caption text-center mt-4">請拖曳及縮放圖片以調整頭像</p>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="text" @click="resetAndClose">取消</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="flat" @click="cropAndUpload" :loading="isUploading">儲存頭像</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import { useAuthStore } from '@/stores/authStore';

const dialog = ref(false);
const imageSrc = ref(null);
const fileInput = ref(null);
const cropper = ref(null);
const isUploading = ref(false);
const authStore = useAuthStore();

const emit = defineEmits(['upload-complete', 'upload-error']);

const open = () => {
  dialog.value = true;
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageSrc.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const cropAndUpload = async () => {
  if (!cropper.value) return;
  isUploading.value = true;
  
  const croppedCanvas = cropper.value.getCroppedCanvas({
    width: 256,
    height: 256,
    imageSmoothingQuality: 'high',
  });

  const croppedImageData = croppedCanvas.toDataURL('image/png');

  try {
    await authStore.updateAvatar(croppedImageData);
    emit('upload-complete');
    resetAndClose();
  } catch (error) {
    console.error("Avatar upload failed:", error);
    emit('upload-error');
  } finally {
    isUploading.value = false;
  }
};

const resetAndClose = () => {
  dialog.value = false;
  imageSrc.value = null;
  if(fileInput.value) fileInput.value.value = null; // Reset file input
};

// Expose the open method to parent components
defineExpose({ open });

</script>

<style>
/* Ensure the cropper is displayed correctly */
.cropper-container {
  width: 100%;
}
.cropper-bg {
    background-size: 10px 10px; 
}
</style>
