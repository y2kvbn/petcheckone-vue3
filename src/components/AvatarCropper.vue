
<template>
  <v-dialog v-model="dialog" max-width="500px" persistent>
    <v-card class="pa-2 pa-sm-4 rounded-xl">
      <v-card-title class="text-h5 font-weight-bold text-center pt-4 pb-2">更新頭像</v-card-title>
      
      <v-card-text class="pa-4">
        <div v-if="imageSrc">
            <!-- Circular Cropper -->
            <div class="cropper-circular-wrapper mb-4">
              <vue-cropper
                ref="cropper"
                :src="imageSrc"
                :aspect-ratio="1"
                :view-mode="1"
                drag-mode="move"
                :auto-crop-area="0.9"
                :crop-box-resizable="false"
                :crop-box-movable="false"
                :toggle-drag-mode-on-dblclick="false"
                style="height: 300px;"
              ></vue-cropper>
            </div>
            <p class="text-caption text-grey-darken-1 text-center">請拖曳及縮放圖片以調整頭像</p>
        </div>

        <!-- Placeholder for file input -->
        <div 
          v-else 
          @click="triggerFileInput"
          class="file-input-placeholder d-flex flex-column align-center justify-center text-center"
          style="height: 340px;"
        >
          <v-icon size="64" color="grey-lighten-1">mdi-image-plus-outline</v-icon>
          <div class="text-h6 font-weight-medium text-grey-darken-2 mt-3">點擊此處選擇圖片</div>
          <div class="text-body-2 text-grey-darken-1">建議使用 1:1 的圖片</div>
        </div>
        
        <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none;">
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-btn 
          v-if="imageSrc"
          variant="outlined"
          color="primary"
          @click="triggerFileInput"
          rounded="lg"
          class="px-4"
        >
          重新選擇
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn 
          variant="text" 
          @click="resetAndClose"
          rounded="lg"
          class="px-4"
        >取消</v-btn>
        <v-btn 
          color="primary" 
          variant="flat" 
          @click="cropAndUpload" 
          :loading="isUploading" 
          :disabled="!imageSrc"
          rounded="lg"
          size="large"
          class="px-6"
        >儲存頭像</v-btn>
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
const originalFileName = ref('avatar.png');
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
    originalFileName.value = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      imageSrc.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const cropAndUpload = () => {
  if (!cropper.value) return;
  isUploading.value = true;

  cropper.value.getCroppedCanvas({ 
    width: 256, 
    height: 256,
    imageSmoothingQuality: 'high',
  }).toBlob(async (blob) => {
    if (!blob) {
        console.error('Canvas to Blob conversion failed.');
        emit('upload-error');
        isUploading.value = false;
        return;
    }

    const avatarFile = new File([blob], originalFileName.value, {
        type: blob.type,
        lastModified: Date.now(),
    });

    try {
        const result = await authStore.updateAvatar(avatarFile);
        if (result.success) {
            emit('upload-complete');
            resetAndClose();
        } else {
            throw new Error(result.message || 'Upload failed in store');
        }
    } catch (error) {
        console.error("Avatar upload failed:", error);
        emit('upload-error');
    } finally {
        isUploading.value = false;
    }
  }, 'image/png');
};

const resetAndClose = () => {
  dialog.value = false;
  setTimeout(() => {
    imageSrc.value = null;
    if(fileInput.value) fileInput.value.value = null;
    originalFileName.value = 'avatar.png';
  }, 300);
};

// Expose the open method to parent components
defineExpose({ open });

</script>

<style>
/* --- Circular Cropper Styles --- */
.cropper-circular-wrapper .cropper-view-box,
.cropper-circular-wrapper .cropper-face {
  border-radius: 50%;
  outline: none;
  box-shadow: none;
}

.cropper-circular-wrapper .cropper-face {
  background-color: transparent; /* Makes the cropper face transparent */
}

/* Hide the rectangular guides */
.cropper-circular-wrapper .cropper-dashed,
.cropper-circular-wrapper .cropper-line,
.cropper-circular-wrapper .cropper-point {
  display: none;
}

/* --- Placeholder Styles --- */
.file-input-placeholder {
  border: 2px dashed #BDBDBD;
  border-radius: 12px;
  padding: 32px;
  cursor: pointer;
  background-color: #FAFAFA;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.file-input-placeholder:hover {
  background-color: #F0F0F0;
  border-color: #9E9E9E;
}

/* --- General Cropper Tweaks --- */
.cropper-container .cropper-bg {
    background-size: 10px 10px; 
}
</style>
