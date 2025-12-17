<template>
  <v-container>
    <h2 class="text-h5 font-weight-bold mb-4">最後一步：確認預約資訊</h2>
    <p class="text-body-1 mb-6">請核對以下預約詳情，確認無誤後即可送出。</p>

    <v-card class="pa-4 rounded-lg" border>
      <v-list-item>
        <template v-slot:prepend>
            <v-icon>mdi-calendar-clock</v-icon>
        </template>
        <v-list-item-title class="font-weight-bold">預約時間</v-list-item-title>
        <v-list-item-subtitle>{{ bookingDetails.date }} {{ bookingDetails.time }}</v-list-item-subtitle>
      </v-list-item>

      <v-divider class="my-4"></v-divider>

      <h3 class="text-h6 font-weight-bold mb-2 ml-4">預約寵物與服務</h3>
      <div v-for="pet in bookingDetails.pets" :key="pet.id" class="mb-4">
        <v-list-item>
            <template v-slot:prepend>
                <v-icon size="32" class="mr-3">{{ pet.type === '貓' ? 'mdi-cat' : 'mdi-dog' }}</v-icon>
            </template>
            <v-list-item-title class="font-weight-bold">{{ pet.name }} ({{ pet.size }})</v-list-item-title>
        </v-list-item>
         <v-list-item class="text-caption ml-6">
              <ul class="pl-4">
                  <li v-for="service in pet.services" :key="service.name">
                      {{ service.name }} - ${{ service.price }}
                  </li>
              </ul>
          </v-list-item>
      </div>

       <v-divider class="my-4"></v-divider>

        <div class="d-flex justify-end align-center pa-4">
            <span class="text-h6 font-weight-bold mr-4">預估總金額:</span>
            <span class="text-h5 font-weight-bold text-primary">$ {{ totalCost }}</span>
        </div>
    </v-card>

    <v-alert v-if="error" type="error" class="mt-5" dense text closable @click:close="error = null">{{ error }}</v-alert>

    <v-row class="mt-8">
      <v-col cols="6">
        <v-btn 
            variant="text"
            block
            @click="router.back()"
            :disabled="bookingStore.isLoading"
        >
            返回上一步
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn 
            color="primary"
            size="large"
            rounded="xl"
            block
            @click="confirmAndBook"
            :loading="bookingStore.isLoading"
            :disabled="bookingStore.isLoading"
        >
            確認預約
        </v-btn>
      </v-col>
    </v-row>
    
     <!-- Booking Success Dialog -->
    <v-dialog v-model="showSuccessDialog" persistent max-width="320">
        <v-card class="text-center pa-6 rounded-lg">
            <v-icon size="64" color="success" class="mb-4">mdi-check-circle-outline</v-icon>
            <h3 class="text-h6 font-weight-bold mb-2">預約成功！</h3>
            <p class="mb-6">我們已經收到您的預約，期待您的光臨。</p>
            <v-btn color="primary" block rounded="xl" to="/profile">查看我的預約</v-btn>
        </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBookingStore } from '@/stores/bookingStore';
import { usePetStore } from '@/stores/petStore';
import { useServiceStore } from '@/stores/serviceStore';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const bookingStore = useBookingStore();
const petStore = usePetStore();
const serviceStore = useServiceStore();
const authStore = useAuthStore();

const showSuccessDialog = ref(false);
const error = ref(null);

const getPrice = (serviceName, petType, petSize) => {
    const serviceList = petType === '貓' ? serviceStore.services.cats.items : serviceStore.services.dogs.items;
    const service = serviceList.find(s => s.name === serviceName);
    if (!service) return 'N/A';

    const sizeKey = (petSize?.toLowerCase() === 'small' || petSize === '小型') ? 'small' :
                    (petSize?.toLowerCase() === 'medium' || petSize === '中型') ? 'medium' :
                    'large';
    const price = service[sizeKey];

    if (price === null || price === undefined) {
        return 'N/A';
    }

    if (typeof price === 'number') {
        return price;
    }

    if (typeof price === 'string') {
        if (price.includes('-')) {
            const parts = price.split('-').map(part => parseInt(part.replace(/[^\d]/g, ''), 10));
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                return Math.round((parts[0] + parts[1]) / 2);
            }
        }
        
        const numericPrice = parseInt(price.replace(/[^\d]/g, ''), 10);
        if (!isNaN(numericPrice)) {
            return numericPrice;
        }

        return price;
    }

    return 'N/A'; 
};

const bookingDetails = computed(() => {
    const bookingData = bookingStore.currentBooking;
    const pets = bookingData.selectedPetIds.map(petId => {
        const petInfo = petStore.pets.find(p => p.id === petId);
        if (!petInfo) return null;

        const services = (bookingData.selectedServices[petId] || []).map(serviceName => ({
            name: serviceName,
            price: getPrice(serviceName, petInfo.type, petInfo.size)
        }));

        return { ...petInfo, services };
    }).filter(p => p !== null);

    return {
        date: bookingData.bookingDate,
        time: bookingData.bookingTime,
        pets,
    };
});

const totalCost = computed(() => {
    return bookingDetails.value.pets.reduce((total, pet) => {
        const petTotal = pet.services.reduce((sum, service) => {
            const price = typeof service.price === 'number' ? service.price : 0;
            return sum + price;
        }, 0);
        return total + petTotal;
    }, 0);
});

const confirmAndBook = async () => {
  error.value = null;
  if (!authStore.user || !authStore.user.uid) {
      error.value = "無法取得使用者資訊，請重新登入後再試。";
      return;
  }
  const result = await bookingStore.confirmBooking(authStore.user.uid);
  if (result.success) {
      showSuccessDialog.value = true;
  } else {
      error.value = result.message || '預約失敗，請稍後再試。';
  }
};

</script>
<style scoped>
.rounded-lg {
  border-radius: 12px;
}
</style>