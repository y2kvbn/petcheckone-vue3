import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { stores, defaultStoreId } from '@/config/stores';

export const useStoreStore = defineStore('store', () => {
  const allStores = ref(stores);
  
  // Function to get the initial store ID
  const getInitialStoreId = () => {
    const savedStoreId = localStorage.getItem('currentStoreId');
    if (savedStoreId && allStores.value.some(s => s.id === savedStoreId)) {
      return savedStoreId;
    }
    if (allStores.value.length > 0) {
      return allStores.value[0].id;
    }
    return defaultStoreId;
  };

  const currentStoreId = ref(getInitialStoreId());

  const currentStore = computed(() => 
    allStores.value.find(s => s.id === currentStoreId.value)
  );

  function setStore(storeId) {
    if (allStores.value.some(s => s.id === storeId)) {
      currentStoreId.value = storeId;
    } else {
      console.error(`Attempted to switch to an invalid store ID: ${storeId}`);
    }
  }

  // Watch for changes in currentStoreId and save to localStorage
  watch(currentStoreId, (newId) => {
    localStorage.setItem('currentStoreId', newId);
    console.log(`Store changed to: ${newId}`);
  });

  return { 
    allStores, 
    currentStoreId, 
    currentStore, 
    setStore 
  };
});
