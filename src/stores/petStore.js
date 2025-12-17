import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useAuthStore } from './authStore';
import { db } from '@/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc,
  updateDoc,
  deleteDoc,
  doc 
} from 'firebase/firestore';
import { getCollectionPath } from '@/utils/firestoreHelper';

export const usePetStore = defineStore('pet', () => {
  const pets = ref([]);
  const authStore = useAuthStore();
  const isLoading = ref(false);
  const error = ref(null);

  async function fetchPets() {
    if (!authStore.user?.uid) {
      pets.value = [];
      return;
    }

    isLoading.value = true;
    error.value = null;
    
    try {
      const petsCollectionPath = getCollectionPath('pets');
      const q = query(collection(db, petsCollectionPath), where("userId", "==", authStore.user.uid));
      
      const querySnapshot = await getDocs(q);
      pets.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    } catch (e) {
      console.error("Error fetching pets:", e);
      error.value = "無法載入寵物資料，請稍後再試。";
      pets.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  // Refetch pets when user logs in or store changes
  watch(() => [authStore.user, useAuthStore().isAuthenticated], () => {
    fetchPets();
  }, { immediate: true });

  async function addPet(petData) {
    if (!authStore.user?.uid) throw new Error("User not authenticated.");
    
    const newPet = {
      ...petData,
      userId: authStore.user.uid,
      createdAt: new Date(),
    };

    try {
      const petsCollectionPath = getCollectionPath('pets');
      const docRef = await addDoc(collection(db, petsCollectionPath), newPet);
      pets.value.push({ id: docRef.id, ...newPet });
    } catch (e) {
      console.error("Error adding pet: ", e);
      throw new Error("新增寵物失敗");
    }
  }

  async function updatePet(updatedPet) {
    const { id, ...dataToUpdate } = updatedPet;
    if (!id) throw new Error("Pet ID is required for update.");

    try {
      const petDocRef = doc(db, getCollectionPath('pets'), id);
      await updateDoc(petDocRef, dataToUpdate);
      
      const index = pets.value.findIndex(p => p.id === id);
      if (index !== -1) {
        pets.value[index] = { ...pets.value[index], ...dataToUpdate };
      }
    } catch (e) {
      console.error("Error updating pet: ", e);
      throw new Error("更新寵物資料失敗");
    }
  }

  async function deletePet(petId) {
    if (!petId) throw new Error("Pet ID is required for deletion.");

    try {
      const petDocRef = doc(db, getCollectionPath('pets'), petId);
      await deleteDoc(petDocRef);
      
      pets.value = pets.value.filter(p => p.id !== petId);
    } catch (e) {
      console.error("Error deleting pet: ", e);
      throw new Error("刪除寵物失敗");
    }
  }

  const getPetById = (id) => {
    return pets.value.find(p => p.id === id);
  };
  
  function $reset() {
    pets.value = [];
    error.value = null;
  }

  return {
    pets,
    isLoading,
    error,
    addPet,
    updatePet,
    deletePet,
    getPetById,
    fetchPets,
    $reset
  };
});
