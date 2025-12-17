
<template>
  <div>
    <v-app-bar app color="white" elevation="1">
        <v-btn icon @click="goBack">
            <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-app-bar-title class="font-weight-bold">{{ pageTitle }}</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="savePet" :loading="isSaving" variant="flat" rounded="xl">儲存</v-btn>
    </v-app-bar>

    <v-container>
        <v-card class="pa-4 rounded-xl" border>
            <v-form ref="form">
                <v-text-field 
                    v-model="pet.name" 
                    label="寵物名字" 
                    :rules="[rules.required]"
                    variant="outlined"
                    rounded="lg"
                    class="mb-3"
                ></v-text-field>

                <v-select 
                    v-model="pet.type" 
                    :items="['犬', '貓']" 
                    label="類型" 
                    :rules="[rules.required]"
                    variant="outlined"
                    rounded="lg"
                    class="mb-3"
                ></v-select>

                <v-text-field 
                    v-model="pet.breed" 
                    label="品種" 
                    :rules="[rules.required]"
                    variant="outlined"
                    rounded="lg"
                    class="mb-3"
                ></v-text-field>

                <v-text-field 
                    v-model.number="pet.weight" 
                    label="體重 (kg)" 
                    type="number"
                    suffix="kg"
                    :rules="[rules.required, rules.number]"
                    variant="outlined"
                    rounded="lg"
                    class="mb-3"
                ></v-text-field>

                <v-text-field
                    v-model="pet.size"
                    label="體型 (自動計算)"
                    readonly
                    variant="outlined"
                    rounded="lg"
                    bg-color="grey-lighten-3"
                ></v-text-field>
            </v-form>
        </v-card>
        
        <!-- Delete button appears only when editing -->
        <v-btn 
            v-if="route.params.id" 
            color="red" 
            @click="confirmDelete" 
            class="mt-4" 
            block 
            variant="tonal"
            rounded="lg"
        >
            刪除寵物
        </v-btn>
    </v-container>

    <!-- Deletion confirmation dialog -->
    <v-dialog v-model="deleteDialog" max-width="400" persistent>
        <v-card class="pa-4 rounded-lg">
            <v-card-title class="text-h5 font-weight-bold">確認刪除</v-card-title>
            <v-card-text>
                您確定要刪除這隻寵物嗎？此操作無法復原。
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="text" @click="deleteDialog = false">取消</v-btn>
                <v-btn color="red" variant="flat" @click="deletePetConfirmed" :loading="isDeleting">確認刪除</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePetStore } from '@/stores/petStore';

const route = useRoute();
const router = useRouter();
const petStore = usePetStore();
const form = ref(null);
const isSaving = ref(false);
const isDeleting = ref(false);
const deleteDialog = ref(false);
const snackbar = ref({ show: false, text: '', color: '' });

const pet = ref({
  id: null, // Ensure id is part of the model
  name: '',
  type: '犬',
  breed: '',
  weight: null,
  size: ''
});

const rules = {
    required: value => !!value || '此欄位為必填',
    number: value => value > 0 || '請輸入有效的體重'
};

const pageTitle = computed(() => route.params.id ? '編輯寵物' : '新增寵物');

watch(() => pet.value.weight, (newWeight) => {
  if (!newWeight || newWeight <= 0) {
    pet.value.size = '';
  } else if (newWeight < 10) {
    pet.value.size = '小型';
  } else if (newWeight >= 10 && newWeight < 25) {
    pet.value.size = '中型';
  } else {
    pet.value.size = '大型';
  }
}, { immediate: true });

onMounted(() => {
  if (route.params.id) {
    // Use a slight delay to ensure petStore is populated
    setTimeout(() => {
        const existingPet = petStore.getPetById(route.params.id);
        if (existingPet) {
            pet.value = { ...existingPet };
        }
    }, 100); 
  }
});

const savePet = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  isSaving.value = true;
  try {
    if (pet.value.id) {
      await petStore.updatePet(pet.value);
      snackbar.value = { show: true, text: '寵物資料已更新！', color: 'success' };
    } else {
      await petStore.addPet(pet.value);
      snackbar.value = { show: true, text: '寵物已成功新增！', color: 'success' };
    }
    router.push('/profile');
  } catch (error) {
    console.error("Error saving pet:", error);
    snackbar.value = { show: true, text: '儲存失敗，請稍後再試', color: 'error' };
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = () => {
    deleteDialog.value = true;
};

const deletePetConfirmed = async () => {
    isDeleting.value = true;
    try {
        await petStore.deletePet(pet.value.id);
        snackbar.value = { show: true, text: '寵物已刪除', color: 'success' };
        router.push('/profile');
    } catch (error) {
        console.error("Error deleting pet:", error);
        snackbar.value = { show: true, text: '刪除失敗，請稍後再試', color: 'error' };
    } finally {
        isDeleting.value = false;
        deleteDialog.value = false;
    }
};

const goBack = () => {
    router.push('/profile');
}

</script>

<style scoped>
.rounded-xl {
    border-radius: 16px;
}
</style>
