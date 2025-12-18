import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { db } from '@/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  Timestamp, 
  doc, 
  updateDoc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { useAuthStore } from './authStore';
import { usePetStore } from './petStore'; // Import pet store
import { getCollectionPath } from '@/utils/firestoreHelper';

const getDefaultBookingState = () => ({
  selectedPetIds: [],
  selectedServices: {},
  bookingDate: null,
  bookingTime: null,
});

export const useBookingStore = defineStore('booking', () => {
  const bookings = ref([]);
  const isLoading = ref(false);

  const currentBooking = ref(getDefaultBookingState());

  const authStore = useAuthStore();
  const petStore = usePetStore(); // Get pet store instance

  function startNewBooking() {
    currentBooking.value = getDefaultBookingState();
  }

  function selectPets(petIds) {
    currentBooking.value.selectedPetIds = petIds;
  }

  function selectServicesForPet(petId, serviceNames) {
    currentBooking.value.selectedServices[petId] = serviceNames;
  }

  function setDateTime(date, time) {
    currentBooking.value.bookingDate = date;
    currentBooking.value.bookingTime = time;
  }

  async function confirmBooking() {
    const currentUser = authStore.user;
    if (!currentUser || !currentUser.uid || !currentUser.phone) {
      console.error("Booking failed: User not authenticated or phone number is missing.");
      return { success: false, message: '使用者未登入或缺少手機號碼，無法預約。' };
    }
    const userId = currentUser.uid;
    const userName = currentUser.name; // Get user's name

    if (!currentBooking.value.bookingDate || !currentBooking.value.bookingTime || currentBooking.value.selectedPetIds.length === 0) {
      return { success: false, message: '預約資訊不完整，請重新操作。' };
    }

    // Get pet details
    const petDetails = currentBooking.value.selectedPetIds.map(petId => {
        const pet = petStore.getPetById(petId);
        return pet ? { id: pet.id, name: pet.name, type: pet.type } : null;
    }).filter(p => p !== null);


    isLoading.value = true;
    try {
      const dateTimeString = `${currentBooking.value.bookingDate}T${currentBooking.value.bookingTime}`;
      const localDate = new Date(dateTimeString);
      
      // Generate Order ID
      const year = localDate.getFullYear();
      const month = (localDate.getMonth() + 1).toString().padStart(2, '0');
      const day = localDate.getDate().toString().padStart(2, '0');
      const phoneLastFour = currentUser.phone.slice(-4);
      const orderId = `ORD-${year}${month}${day}-${phoneLastFour}-S01`;

      const newBookingData = {
        userId: userId,
        userName: userName, // Add user's name
        petIds: currentBooking.value.selectedPetIds,
        petDetails: petDetails, // Add pet details
        services: currentBooking.value.selectedServices,
        bookingDateTime: Timestamp.fromDate(localDate),
        status: 'confirmed',
        createdAt: Timestamp.now(),
        orderId: orderId, // Add the generated order ID
      };

      const bookingsCollectionPath = getCollectionPath('bookings');
      const docRef = await addDoc(collection(db, bookingsCollectionPath), newBookingData);

      const completeBooking = { id: docRef.id, ...newBookingData };
      bookings.value.push(completeBooking);
      
      resetCurrentBooking();
      return { success: true, newBooking: completeBooking };
    } catch (error) {
      console.error("Error saving booking to Firestore:", error);
      return { success: false, message: '儲存預約失敗，請稍後再試。' };
    } finally {
      isLoading.value = false;
    }
  }

  function resetCurrentBooking() {
    currentBooking.value = getDefaultBookingState();
  }

  function reset() {
    bookings.value = [];
    isLoading.value = false;
    resetCurrentBooking();
  }

  async function fetchBookings(userId) {
    if (!userId) return;
    isLoading.value = true;
    try {
      const bookingsCollectionPath = getCollectionPath('bookings');
      const q = query(collection(db, bookingsCollectionPath), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      bookings.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      isLoading.value = false;
    }
  }

  async function cancelBooking(bookingId) {
    const bookingIndex = bookings.value.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) {
      return { success: false, message: '找不到預約記錄' };
    }

    const bookingToCancel = bookings.value[bookingIndex];
    const bookingDate = bookingToCancel.bookingDateTime.toDate();
    const today = new Date();
    if (bookingDate.toDateString() === today.toDateString()) {
      return { success: false, message: '當日預約無法取消，如有問題請聯繫店家。', isToday: true };
    }
      
    isLoading.value = true;
    try {
      const bookingDocRef = doc(db, getCollectionPath('bookings'), bookingId);
      await updateDoc(bookingDocRef, { status: 'cancelled' });
      
      bookings.value[bookingIndex].status = 'cancelled';

      return { success: true, message: '預約已成功取消' };
    } catch (error) {
      console.error("Error cancelling booking:", error);
      return { success: false, message: '取消預約失敗，請稍後再試。' };
    } finally {
      isLoading.value = false;
    }
  }

  watch(() => authStore.user?.uid, (userId) => {
    if (userId) {
      fetchBookings(userId);
    } else {
      bookings.value = [];
    }
  }, { immediate: true });

  const getUserBookings = computed(() => {
    return bookings.value.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
  });

  const getUpcomingUserBookings = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookings.value
      .filter(b => b.status === 'confirmed' && b.bookingDateTime.toDate() >= today)
      .sort((a, b) => a.bookingDateTime.toDate() - b.bookingDateTime.toDate());
  });

  return {
    bookings,
    isLoading,
    currentBooking,
    startNewBooking,
    selectPets,
    selectServicesForPet,
    setDateTime,
    confirmBooking,
    resetCurrentBooking,
    fetchBookings,
    cancelBooking,
    getUserBookings,
    getUpcomingUserBookings,
    reset
  };
}, {
  persist: false,
});
