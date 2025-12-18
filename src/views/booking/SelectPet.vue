<template>
  <v-container>
    <h2 class="text-h5 font-weight-bold mb-4">第一步：選擇寵物</h2>
    <p class="text-body-1 mb-6">請選擇要為哪些寵物預約服務。</p>

    <div v-if="petStore.pets.length > 0">
      <v-row>
        <v-col
          v-for="pet in petStore.pets"
          :key="pet.id"
          cols="12"
          md="6"
        >
          <v-card
            :color="isPetSelected(pet.id) ? 'primary' : ''"
            class="d-flex align-center pa-4 rounded-lg"
            @click="togglePet(pet.id)"
            style="cursor: pointer;"
          >
            <v-icon size="40" class="mr-4">{{ pet.type === '貓' ? 'mdi-cat' : 'mdi-dog' }}</v-icon>
            <div class="flex-grow-1">
              <div class="font-weight-bold">{{ pet.name }}</div>
              <div class="text-caption">{{ pet.breed }}</div>
            </div>
            <v-checkbox-btn :model-value="isPetSelected(pet.id)" />
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-card v-else class="text-center pa-8 rounded-lg border-dashed mt-4" border to="/add-pet">
        <v-icon size="48" color="grey-lighten-1">mdi-paw</v-icon>
        <p class="mt-4 text-grey-darken-1">您還沒有新增任何寵物。</p>
        <p class="text-caption text-primary">點擊這裡立即新增</p>
    </v-card>

    <v-btn 
        :disabled="localSelectedPetIds.length === 0"
        color="primary"
        size="large"
        rounded="xl"
        block
        class="mt-8"
        @click="nextStep"
    >
        下一步：選擇服務
    </v-btn>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePetStore } from '@/stores/petStore';
import { useBookingStore } from '@/stores/bookingStore';

const router = useRouter();
const petStore = usePetStore();
const bookingStore = useBookingStore();

const localSelectedPetIds = ref([...bookingStore.currentBooking.selectedPetIds]);

const isPetSelected = (petId) => {
  return localSelectedPetIds.value.includes(petId);
};

const togglePet = (petId) => {
  const index = localSelectedPetIds.value.indexOf(petId);
  if (index > -1) {
    localSelectedPetIds.value.splice(index, 1);
  } else {
    localSelectedPetIds.value.push(petId);
  }
};

const nextStep = () => {
  if (localSelectedPetIds.value.length > 0) {
    bookingStore.selectPets(localSelectedPetIds.value);
    router.push('/booking/select-service');
  } else {
    alert('請至少選擇一隻寵物！');
  }
};
</script>

<style scoped>
.border-dashed {
    border-style: dashed;
}
.rounded-lg {
  border-radius: 12px;
}
</style>
