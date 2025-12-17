<template>
  <v-container>
    <h2 class="text-h5 font-weight-bold mb-4">第二步：選擇服務項目</h2>
    <p class="text-body-1 mb-6">請為您的每一隻寵物選擇所需服務。</p>

    <v-row>
      <!-- Main Content: Service Selection -->
      <v-col cols="12" md="7">
        <div v-if="serviceStore.isLoading" class="text-center pa-8">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p class="mt-4">正在載入服務項目...</p>
        </div>
        <v-expansion-panels v-else-if="selectedPetsWithDetails.length > 0" variant="inset" class="mb-4">
          <v-expansion-panel v-for="pet in selectedPetsWithDetails" :key="pet.id">
            <v-expansion-panel-title>
              <v-icon class="mr-3">{{ pet.type === '貓' ? 'mdi-cat' : 'mdi-dog' }}</v-icon>
              <span class="font-weight-bold">{{ pet.name }}</span>
            </v-expansion-panel-title>
            <v-expansion-panel-text class="pa-0">
              <v-list class="py-0">
                <v-list-item
                  v-for="service in getServicesForPetType(pet.type)"
                  :key="service.id"
                  @click="toggleService(pet.id, service.name)"
                  :class="{ 'bg-primary text-white': isServiceSelected(pet.id, service.name) }"
                  class="service-item"
                >
                  <template v-slot:prepend>
                    <v-icon :icon="isServiceSelected(pet.id, service.name) ? 'mdi-check-circle' : 'mdi-circle-outline'"></v-icon>
                  </template>
                  <v-list-item-title>{{ service.name }}</v-list-item-title>
                  <template v-slot:append>
                    <span class="font-weight-bold">${{ getPriceForPetSize(service, pet.size) }}</span>
                  </template>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-alert v-else type="warning" border="start">
          您似乎還沒有選擇任何寵物，請回到上一步。
        </v-alert>

        <!-- Navigation Buttons -->
        <v-row class="mt-4">
          <v-col cols="6">
            <v-btn variant="text" block @click="router.back()">返回上一步</v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              :disabled="!isAnyServiceSelected"
              color="primary"
              size="large"
              rounded="xl"
              block
              @click="nextStep"
            >
              下一步
            </v-btn>
          </v-col>
        </v-row>
      </v-col>

      <!-- Sticky Sidebar: Booking Summary -->
      <v-col cols="12" md="5">
        <v-card class="summary-card pa-4 rounded-lg" border>
          <h3 class="text-h6 font-weight-bold mb-4">預約總覽</h3>
          <v-divider></v-divider>
          <div v-if="summaryDetails.pets.length > 0" class="mt-4">
            <div v-for="pet in summaryDetails.pets" :key="pet.id" class="mb-4">
              <p class="font-weight-bold d-flex align-center">
                <v-icon class="mr-2">{{ pet.type === '貓' ? 'mdi-cat' : 'mdi-dog' }}</v-icon>
                {{ pet.name }}
              </p>
              <ul v-if="pet.services.length > 0" class="pl-6 text-body-2">
                <li v-for="service in pet.services" :key="service.name" class="d-flex justify-space-between">
                  <span>{{ service.name }}</span>
                  <span>${{ service.price }}</span>
                </li>
              </ul>
              <p v-else class="text-caption text-grey pl-6">尚未選擇服務</p>
            </div>
          </div>
          <div v-else class="text-center py-6">
            <p class="text-grey-darken-1">請從左側為您的寵物選擇服務</p>
          </div>

          <v-divider class="my-2"></v-divider>

          <div class="d-flex justify-space-between align-center pa-2 mt-2">
            <span class="text-h6 font-weight-bold">預估總金額:</span>
            <span class="text-h5 font-weight-bold text-primary">$ {{ summaryDetails.totalCost }}</span>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePetStore } from '@/stores/petStore';
import { useBookingStore } from '@/stores/bookingStore';
import { useServiceStore } from '@/stores/serviceStore';

const router = useRouter();
const petStore = usePetStore();
const bookingStore = useBookingStore();
const serviceStore = useServiceStore();

// Create a deep copy of the services for local manipulation
const localSelectedServices = ref(JSON.parse(JSON.stringify(bookingStore.currentBooking.selectedServices || {})));

const selectedPetsWithDetails = computed(() => {
  const petIds = bookingStore.currentBooking.selectedPetIds || [];
  // Initialize local services for any newly selected pets
  petIds.forEach(id => {
    if (!localSelectedServices.value[id]) {
      localSelectedServices.value[id] = [];
    }
  });
  return petStore.pets.filter(pet => petIds.includes(pet.id));
});

onMounted(() => {
  if (serviceStore.services.cats.items.length === 0 && serviceStore.services.dogs.items.length === 0) {
    serviceStore.fetchServices();
  }
});

const isServiceSelected = (petId, serviceName) => {
  return localSelectedServices.value[petId]?.includes(serviceName);
};

const toggleService = (petId, serviceName) => {
  const services = localSelectedServices.value[petId];
  if (!services) return;
  
  const index = services.indexOf(serviceName);
  if (index > -1) {
    services.splice(index, 1);
  } else {
    services.push(serviceName);
  }
};

const getServicesForPetType = (type) => {
  const allServices = serviceStore.services;
  return type === '貓' ? allServices?.cats.items || [] : allServices?.dogs.items || [];
};

const getPriceForPetSize = (service, size) => {
    const sizeKey = (size?.toLowerCase() === 'small' || size === '小型') ? 'small' :
                    (size?.toLowerCase() === 'medium' || size === '中型') ? 'medium' :
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

        // Return the original string if it's not a parsable number (e.g., "視情況報價")
        return price;
    }

    return 'N/A'; // Fallback for other types
};


const summaryDetails = computed(() => {
  let totalCost = 0;
  const pets = selectedPetsWithDetails.value.map(pet => {
    const petServices = localSelectedServices.value[pet.id] || [];
    const services = petServices.map(serviceName => {
      const serviceList = getServicesForPetType(pet.type);
      const serviceData = serviceList.find(s => s.name === serviceName);
      const price = serviceData ? getPriceForPetSize(serviceData, pet.size) : 0;
      
      if (typeof price === 'number') {
        totalCost += price;
      }

      return { name: serviceName, price };
    });
    return { ...pet, services };
  });
  return { pets, totalCost };
});

const isAnyServiceSelected = computed(() => {
    return Object.values(localSelectedServices.value).some(services => services.length > 0);
});

const nextStep = () => {
  if (isAnyServiceSelected.value) {
    // Commit the local changes to the store
    for (const petId in localSelectedServices.value) {
        bookingStore.selectServicesForPet(petId, localSelectedServices.value[petId]);
    }
    router.push('/booking/select-datetime');
  }
};

</script>

<style scoped>
.summary-card {
  position: -webkit-sticky; /* For Safari */
  position: sticky;
  top: 80px; 
}
.rounded-lg {
  border-radius: 12px;
}
.service-item {
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
}
.service-item:hover {
    background-color: #f0f0f0;
}
.service-item.bg-primary:hover {
    background-color: #1976D2 !important;
}
</style>
