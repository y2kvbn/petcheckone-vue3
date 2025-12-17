<template>
  <v-container class="pa-md-4">
    <h1 class="text-h4 font-weight-bold mb-4">服務項目與價目表</h1>
    
    <!-- Services Tabs and Tables -->
    <div>
      <v-tabs v-model="tab" grow color="primary">
        <v-tab value="dogs">犬類服務</v-tab>
        <v-tab value="cats">貓類服務</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item value="dogs">
          <v-card class="mt-4" flat border>
            <v-table density="comfortable" class="service-table">
              <thead>
                <tr>
                  <th v-for="header in services.dogs.headers" :key="header.key" :class="'text-' + header.align">
                    {{ header.title }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading">
                  <td :colspan="services.dogs.headers.length" class="text-center pa-4">
                      <v-progress-circular indeterminate color="primary"></v-progress-circular>
                      <div class="mt-2">載入中...</div>
                  </td>
                </tr>
                <tr v-else-if="services.dogs.items.length === 0">
                    <td :colspan="services.dogs.headers.length" class="text-center pa-4">目前沒有提供犬類服務。</td>
                </tr>
                <tr v-else v-for="item in services.dogs.items" :key="item.name">
                  <td class="font-weight-medium text-no-wrap">
                    <div>{{ item.name }}</div>
                    <div v-if="item.duration > 0" class="text-caption text-red d-flex align-center mt-1">
                      <v-icon size="x-small" class="mr-1">mdi-clock-outline</v-icon>
                      <span>{{ formatDuration(item.duration) }}</span>
                    </div>
                  </td>
                  <td class="text-end">{{ item.small }}</td>
                  <td class="text-end">{{ item.medium }}</td>
                  <td class="text-end">{{ item.large }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-window-item>

        <v-window-item value="cats">
          <v-card class="mt-4" flat border>
            <v-table density="comfortable" class="service-table">
              <thead>
                <tr>
                  <th v-for="header in services.cats.headers" :key="header.key" :class="'text-' + header.align">
                    {{ header.title }}
                  </th>
                </tr>
              </thead>
              <tbody>
                  <tr v-if="isLoading">
                      <td :colspan="services.cats.headers.length" class="text-center pa-4">
                          <v-progress-circular indeterminate color="primary"></v-progress-circular>
                          <div class="mt-2">載入中...</div>
                      </td>
                  </tr>
                  <tr v-else-if="services.cats.items.length === 0">
                      <td :colspan="services.cats.headers.length" class="text-center pa-4">目前沒有提供貓類服務。</td>
                  </tr>
                  <tr v-else v-for="item in services.cats.items" :key="item.name">
                    <td class="font-weight-medium text-no-wrap">
                      <div>{{ item.name }}</div>
                      <div v-if="item.duration > 0" class="text-caption text-red d-flex align-center mt-1">
                        <v-icon size="x-small" class="mr-1">mdi-clock-outline</v-icon>
                        <span>{{ formatDuration(item.duration) }}</span>
                      </div>
                    </td>
                    <td class="text-end">{{ item.small }}</td>
                    <td class="text-end">{{ item.medium }}</td>
                    <td class="text-end">{{ item.large }}</td>
                  </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-window-item>
      </v-window>
    </div>

  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useServiceStore } from '@/stores/serviceStore';

const tab = ref('dogs');

// Service store for fetching and displaying service data
const serviceStore = useServiceStore();
const { services, isLoading } = storeToRefs(serviceStore);
const { fetchServices } = serviceStore;

// Fetch services when the component is mounted
onMounted(() => {
  fetchServices();
});

// Helper function to format the duration
const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) return '';
  return `約 ${minutes} 分鐘`;
};

</script>

<style scoped>
.service-table {
  border-radius: 8px;
}

.service-table th {
  font-weight: bold !important;
  background-color: #f5f5f5;
}

.service-table td {
  font-size: 0.9rem;
  vertical-align: top; /* Align content to the top */
  padding-top: 12px !important; /* Vuetify override */
  padding-bottom: 12px !important; /* Vuetify override */
}

.text-no-wrap {
    white-space: nowrap;
}
</style>