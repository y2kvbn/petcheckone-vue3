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
import { useStoreStore } from './storeStore';
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
  const storeStore = useStoreStore();

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

  async function confirmBooking(userId) {
    if (!currentBooking.value.bookingDate || !currentBooking.value.bookingTime || currentBooking.value.selectedPetIds.length === 0) {
      return { success: false, message: '預約資訊不完整，請重新操作。' };
    }

    const currentStoreId = storeStore.currentStoreId;
    if (!currentStoreId) {
      console.error("Booking failed: No store selected.");
      return { success: false, message: '未選擇店家，無法完成預約。' };
    }

    isLoading.value = true;
    try {
      const dateTimeString = `${currentBooking.value.bookingDate}T${currentBooking.value.bookingTime}`;
      const timeZone = 'Asia/Taipei';
      
      const localDate = new Date(dateTimeString);
      const utcDate = new Date(localDate.toLocaleString('en-US', { timeZone }));

      const newBookingData = {
        userId: userId,
        storeId: currentStoreId,
        petIds: currentBooking.value.selectedPetIds,
        services: currentBooking.value.selectedServices,
        bookingDateTime: Timestamp.fromDate(utcDate),
        status: 'confirmed',
        createdAt: Timestamp.now(),
      };

      const bookingsCollectionPath = getCollectionPath('bookings');
      // Capture the returned DocumentReference
      const docRef = await addDoc(collection(db, bookingsCollectionPath), newBookingData);

      // Create the complete booking object with the new ID
      const completeBooking = { id: docRef.id, ...newBookingData };

      // Push the new booking directly into the local state
      bookings.value.push(completeBooking);
      
      const memberDocRef = doc(db, 'stores', currentStoreId, 'members', userId);
      const memberDocSnap = await getDoc(memberDocRef);
      
      const memberData = {
          userId: userId,
          email: authStore.user?.email || 'N/A',
          displayName: authStore.user?.displayName || 'N/A',
          lastBookingAt: Timestamp.now(),
      };

      if (!memberDocSnap.exists()) {
          memberData.joinedAt = Timestamp.now();
      }

      await setDoc(memberDocRef, memberData, { merge: true });

      // No longer need to fetch all bookings again
      // await fetchBookings(userId); 
      
      resetCurrentBooking();
      return { success: true, newBooking: completeBooking }; // Return the new booking
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
    if (!userId || !storeStore.currentStoreId) return;
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
      
      // Instead of just updating status, you might want to remove it from the upcoming list
      // This removes the booking from the local array entirely
      // bookings.value.splice(bookingIndex, 1);

      // Or, if you want to keep it but show it as cancelled:
      bookings.value[bookingIndex].status = 'cancelled';

      return { success: true, message: '預約已成功取消' };
    } catch (error) {
      console.error("Error cancelling booking:", error);
      return { success: false, message: '取消預約失敗，請稍後再試。' };
    } finally {
      isLoading.value = false;
    }
  }

  watch([() => authStore.user?.uid, () => storeStore.currentStoreId], ([userId, storeId]) => {
    if (userId && storeId) {
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
