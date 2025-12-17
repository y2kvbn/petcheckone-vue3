import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '@/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { getCollectionPath } from '@/utils/firestoreHelper';

const serviceTableHeaders = [
  { title: '服務項目', key: 'name', align: 'start', sortable: false },
  { title: '小型', key: 'small', align: 'end', sortable: false },
  { title: '中型', key: 'medium', align: 'end', sortable: false },
  { title: '大型', key: 'large', align: 'end', sortable: false },
];

export const useServiceStore = defineStore('service', () => {
  const services = ref({
    dogs: { headers: serviceTableHeaders, items: [] },
    cats: { headers: serviceTableHeaders, items: [] }
  });
  const isLoading = ref(false);
  const error = ref(null);

  async function fetchServices() {
    isLoading.value = true;
    error.value = null;
    
    try {
      const servicesCollectionPath = getCollectionPath('services');
      const q = query(collection(db, servicesCollectionPath));
      
      const querySnapshot = await getDocs(q);
      const fetchedServices = {
        dogs: { headers: serviceTableHeaders, items: [] },
        cats: { headers: serviceTableHeaders, items: [] },
      };
      
      querySnapshot.forEach(doc => {
        const serviceData = doc.data();
        const category = serviceData.category;
        
        if (fetchedServices[category]) {
          fetchedServices[category].items.push({ id: doc.id, ...serviceData });
        }
      });
      
      services.value = fetchedServices;

    } catch (e) {
      console.error("Error fetching services:", e);
      error.value = "無法載入服務項目，請稍後再試。";
    } finally {
      isLoading.value = false;
    }
  }

  function $reset() {
    services.value = {
      dogs: { headers: serviceTableHeaders, items: [] },
      cats: { headers: serviceTableHeaders, items: [] }
    };
    isLoading.value = false;
    error.value = null;
  }

  return {
    services,
    isLoading,
    error,
    fetchServices,
    $reset
  };
});
