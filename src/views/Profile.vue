
<template>
  <v-container class="pa-0 pa-md-4">

    <!-- Profile Header -->
    <div class="profile-header-wrapper mx-auto" style="max-width: 600px;">
      <div class="avatar-container" @click="openAvatarCropper">
        <v-avatar
          class="profile-header-avatar"
          color="grey-lighten-4"
          size="120"
        >
          <v-img v-if="auth.user && auth.user.avatar" :src="auth.user.avatar" alt="User Avatar" />
          <v-icon v-else size="80" color="grey-darken-1">mdi-account-circle</v-icon>
        </v-avatar>
        <div class="avatar-overlay">
          <v-icon color="white">mdi-camera-plus-outline</v-icon>
        </div>
      </div>

      <v-card
        class="profile-card text-white"
        flat
        v-if="auth.user"
        style="background: linear-gradient(135deg, #FFA726 0%, #FB8C00 100%);"
      >
        <v-card-actions class="profile-card-actions">
            <v-btn icon="mdi-pencil" variant="flat" color="rgba(0, 0, 0, 0.2)" @click="openEditDialog" />
            <v-btn icon="mdi-logout" variant="flat" color="rgba(0, 0, 0, 0.2)" @click="handleLogout" />
        </v-card-actions>
        
        <v-card-item class="text-center" style="padding-top: 72px; padding-bottom: 24px;">
            <v-card-title class="profile-card-title">{{ auth.user.name }}</v-card-title>
            <v-card-subtitle class="profile-card-subtitle mt-1">{{ auth.user.phone }}</v-card-subtitle>
        </v-card-item>
      </v-card>
    </div>

    <!-- Secondary Contact Display -->
    <v-card
      class="mx-auto pa-2 mt-4"
      max-width="600"
      v-if="auth.user && auth.user.secondaryContact && auth.user.secondaryContact.name"
      variant="tonal"
      color="grey-lighten-2"
    >
      <v-list-item class="py-0">
          <template v-slot:prepend>
             <v-icon color="grey-darken-2">mdi-account-box-outline</v-icon>
          </template>
          <v-list-item-title class="font-weight-bold text-grey-darken-4">第二聯絡人</v-list-item-title>
          <v-list-item-subtitle class="text-grey-darken-3">{{ auth.user.secondaryContact.name }} | {{ auth.user.secondaryContact.phone }}</v-list-item-subtitle>
      </v-list-item>
    </v-card>

    <!-- My Pets Section -->
    <section class="my-8 mx-auto" style="max-width: 600px;">
      <h3 class="text-h6 font-weight-bold px-4 mb-3">我的寵物</h3>
      <div class="d-flex flex-column ga-3 pa-2">
        <v-card
          v-for="pet in pets.pets"
          :key="pet.id"
          class="pet-card d-flex align-center pa-3"
          @click="editPet(pet.id)"
          variant="tonal"
          :color="pet.type === '貓' ? 'blue-grey' : 'orange'"
        >
          <v-avatar :icon="pet.type === '貓' ? 'mdi-cat' : 'mdi-dog'" :color="pet.type === '貓' ? 'blue-grey-lighten-4' : 'orange-lighten-4'" class="mr-4"></v-avatar>
          <div class="text-left mr-4">
            <v-card-title class="text-subtitle-1 font-weight-bold pa-0">{{ pet.name }}</v-card-title>
            <v-card-subtitle class="text-body-2 pa-0">{{ pet.breed }}</v-card-subtitle>
          </div>
          <div class="d-flex align-center">
            <v-chip v-if="pet.size" size="small" variant="outlined">{{ pet.size }}</v-chip>
            <v-icon v-if="petHasUpcomingBooking(pet.id)" size="small" color="primary" class="ml-2">mdi-calendar-clock</v-icon>
          </div>
          <v-spacer></v-spacer>
          <v-chip size="small" :color="pet.type === '貓' ? 'blue-grey' : 'orange-darken-2'">
              {{ pet.type }}
          </v-chip>
        </v-card>
        
        <v-card
            class="add-pet-card d-flex justify-center align-center pa-4"
            to="/add-pet"
            variant="outlined"
        >
            <div class="text-center d-flex align-center">
                <v-icon size="24" color="grey-darken-1" class="mr-2">mdi-plus-box-outline</v-icon>
                <span class="text-grey-darken-1 font-weight-bold">新增寵物</span>
            </div>
        </v-card>
      </div>
    </section>

    <!-- My Bookings Section -->
    <section class="my-8 px-4 mx-auto" style="max-width: 600px;">
      <h3 class="text-h6 font-weight-bold mb-4">我的預約</h3>
      <div v-if="!bookingStore.isLoading && !serviceStore.isLoading">
        <div v-if="upcomingBookings.length > 0">
          <v-card v-for="booking in upcomingBookings" :key="booking.id" class="mb-3 pa-4 rounded-lg" border>
              <div class="d-flex justify-space-between align-start">
                  <div>
                      <p class="text-h6 font-weight-bold text-primary">{{ formatBookingDate(booking.bookingDateTime) }}</p>
                      <p class="text-subtitle-1 font-weight-medium">{{ formatBookingTime(booking.bookingDateTime) }}</p>
                  </div>
                  <v-btn color="red-lighten-1" variant="flat" rounded="lg" @click="handleCancelBooking(booking.id)">取消預約</v-btn>
              </div>
              <v-divider class="my-3" />
              <div v-for="pet in getBookingDetails(booking).pets" :key="pet.id" class="mb-3">
                  <div class="d-flex align-center font-weight-bold mb-1">
                      <v-icon size="20" class="mr-2">{{ pet.type === '貓' ? 'mdi-cat' : 'mdi-dog' }}</v-icon>
                      <span>{{ pet.name }}</span>
                  </div>
                  <ul class="pl-8 text-body-2 text-grey-darken-3">
                      <li v-for="service in pet.services" :key="service.name">{{ service.name }} ({{ service.duration }})</li>
                  </ul>
              </div>
              <v-divider class="my-3" />
              <div class="d-flex justify-space-between align-center">
                  <div class="d-flex align-center text-caption text-grey-darken-1">
                      <v-icon start size="small">mdi-message-text-outline</v-icon>
                      服務完成後會以LINE訊息通知您
                  </div>
                  <div
                    class="font-weight-bold text-primary"
                    @click="showQrCode(booking)"
                    style="cursor: pointer; text-decoration: underline;"
                  >
                    點我打開預約QRcode
                  </div>
              </div>
          </v-card>
        </div>
        <v-card v-else class="text-center pa-8 rounded-lg border-dashed" border to="/booking">
              <v-icon size="48" color="grey-lighten-1">mdi-calendar-question</v-icon>
              <p class="mt-4 text-grey-darken-1">您目前沒有即將到來的預約。</p>
              <p class="text-caption text-primary">點擊這裡立即預約</p>
          </v-card>
        </div>
    </section>

    <!-- QR Code Dialog -->
<v-dialog v-model="qrDialog" max-width="400px">
  <v-card class="pa-4 rounded-lg">
    <v-card-title class="text-h5 font-weight-bold text-center">預約 QR Code</v-card-title>
    <v-card-text class="text-center">
      <p class="mb-1 font-weight-bold">寵客玩寵物美容</p>
      <p class="mb-4 text-caption">聯絡店家: 0978031653</p>
      
      <div v-if="computedOrderId" class="d-flex justify-center my-4">
        <qrcode-vue :value="computedOrderId" :size="280" level="H" :margin="2">
          <template #logo>
            <img src="/logo.svg" style="width: 60px; height: 60px; border-radius: 8px;">
          </template>
        </qrcode-vue>
      </div>

      <div v-if="selectedBookingForQR">
          <p class="mt-4 text-body-1"><strong>訂單編號:</strong> {{ computedOrderId }}</p>
          <p class="text-body-2"><strong>日期:</strong> {{ formatBookingDate(selectedBookingForQR.bookingDateTime) }}</p>
          <p class="text-body-2"><strong>時間:</strong> {{ formatBookingTime(selectedBookingForQR.bookingDateTime) }}</p>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" variant="text" @click="qrDialog = false">關閉</v-btn>
      <v-spacer />
    </v-card-actions>
  </v-card>
</v-dialog>


    <!-- Avatar Cropper Component -->
    <AvatarCropper ref="avatarCropperRef" @upload-complete="handleUploadComplete" @upload-error="handleUploadError" />

    <!-- Edit User Dialog -->
    <v-dialog v-model="editDialog" max-width="500px" persistent>
      <v-card class="pa-4 rounded-lg">
        <v-card-title class="text-h5 font-weight-bold">編輯個人資料</v-card-title>
        <v-card-text>
            <v-form @submit.prevent="handleSave">
                <h3 class="text-subtitle-1 font-weight-bold my-4">會員資料</h3>
                <v-text-field v-model="editableUser.name" label="姓名" variant="outlined" rounded="lg" class="mb-3"/>
                <v-text-field v-if="auth.user" :model-value="auth.user.phone" label="手機號碼 (帳號)" variant="outlined" rounded="lg" readonly prepend-inner-icon="mdi-lock-outline"/>

                <v-divider class="my-4" />

                <h3 class="text-subtitle-1 font-weight-bold my-4">第二聯絡人</h3>
                <v-text-field v-model="editableUser.secondaryContact.name" label="第二聯絡人姓名" variant="outlined" rounded="lg" class="mb-3"/>
                <v-text-field v-model="editableUser.secondaryContact.phone" label="第二聯絡人電話" variant="outlined" rounded="lg"/>
            </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="editDialog = false">取消</v-btn>
          <v-btn color="primary" variant="flat" @click="handleSave" :disabled="!isDirty">儲存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>

    <v-dialog v-model="cancelErrorDialog" max-width="400">
        <v-card>
            <v-card-title class="text-h5">無法取消</v-card-title>
            <v-card-text>{{ cancelErrorMessage }}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="cancelErrorDialog = false">了解</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { usePetStore } from '@/stores/petStore';
import { useBookingStore } from '@/stores/bookingStore';
import { useServiceStore } from '@/stores/serviceStore';
import AvatarCropper from '@/components/AvatarCropper.vue';
import QrcodeVue from 'qrcode.vue';

const auth = useAuthStore();
const pets = usePetStore();
const bookingStore = useBookingStore();
const serviceStore = useServiceStore();
const router = useRouter();
const avatarCropperRef = ref(null);

const cancelErrorDialog = ref(false);
const cancelErrorMessage = ref('');

const editableUser = ref({ name: '', secondaryContact: { name: '', phone: '' } });
const snackbar = ref({ show: false, text: '', color: 'success' });
const editDialog = ref(false);

const qrDialog = ref(false);
const selectedBookingForQR = ref(null);

// When the component is mounted, fetch all necessary data
onMounted(() => {
  if (auth.user && auth.user.uid) {
    bookingStore.fetchBookings(auth.user.uid);
  }
  serviceStore.fetchServices();
});

const computedOrderId = computed(() => {
  if (!selectedBookingForQR.value || !auth.user || !auth.user.phone) {
    return '';
  }
  const bookingDate = selectedBookingForQR.value.bookingDateTime.toDate();
  const year = bookingDate.getFullYear();
  const month = (bookingDate.getMonth() + 1).toString().padStart(2, '0');
  const day = bookingDate.getDate().toString().padStart(2, '0');
  const phoneLastFour = auth.user.phone.slice(-4);
  
  return `ORD-${year}${month}${day}-${phoneLastFour}-S01`;
});

const isDirty = computed(() => {
  if (!auth.user || !editDialog.value) return false;
  const originalUser = auth.user;
  const currentUser = editableUser.value;
  if (originalUser.name !== currentUser.name) return true;
  const originalSecondary = originalUser.secondaryContact || { name: '', phone: '' };
  const currentSecondary = currentUser.secondaryContact || { name: '', phone: '' };
  if (originalSecondary.name !== currentSecondary.name) return true;
  if (originalSecondary.phone !== currentSecondary.phone) return true;
  return false;
});

const upcomingBookings = computed(() => bookingStore.getUpcomingUserBookings);

const petHasUpcomingBooking = (petId) => {
  if (!upcomingBookings.value || upcomingBookings.value.length === 0) {
    return false;
  }
  return upcomingBookings.value.some(booking => booking.petIds && booking.petIds.includes(petId));
};

const formatBookingDate = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  return new Intl.DateTimeFormat('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Taipei' }).format(date);
};

const formatBookingTime = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  return new Intl.DateTimeFormat('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Taipei' }).format(date);
};

const showQrCode = (booking) => {
  selectedBookingForQR.value = booking;
  qrDialog.value = true;
};

const openAvatarCropper = () => {
  avatarCropperRef.value?.open();
};

const handleUploadComplete = () => {
  snackbar.value = { show: true, text: '頭像更新成功！', color: 'success' };
};

const handleUploadError = () => {
  snackbar.value = { show: true, text: '頭像上傳失敗，請稍後再試', color: 'error' };
};

const openEditDialog = () => {
  editableUser.value = {
    ...auth.user,
    secondaryContact: { ...(auth.user.secondaryContact || { name: '', phone: '' }) }
  };
  editDialog.value = true;
};

const handleSave = async () => {
  if (!isDirty.value) return;
  await auth.updateUser(editableUser.value);
  snackbar.value = { show: true, text: '會員資料已更新！', color: 'success' };
  editDialog.value = false;
};

const editPet = (id) => router.push(`/edit-pet/${id}`);

const handleCancelBooking = async (bookingId) => {
    const result = await bookingStore.cancelBooking(bookingId);
    if (result.isToday) {
        cancelErrorMessage.value = result.message;
        cancelErrorDialog.value = true;
    } else {
        snackbar.value = { show: true, text: result.message, color: result.success ? 'success' : 'error' };
    }
};

const handleLogout = () => {
  auth.logout();
  pets.$reset();
  bookingStore.reset();
  router.push('/login');
};

// --- Functions for booking details (unchanged) ---
const getPetDetails = (petId) => pets.getPetById(petId);
const getServiceDetails = (petType, serviceName) => {
    const serviceList = petType === '貓' ? serviceStore.services.cats.items : serviceStore.services.dogs.items;
    return serviceList.find(s => s.name === serviceName);
};
const parseDuration = (durationStr) => {
    if (!durationStr || typeof durationStr !== 'string') return 0;
    const match = durationStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
};
const getBookingDetails = (booking) => {
    let totalDuration = 0;
    if (!booking.services) return { pets: [], totalDuration: 0 };
    const petsWithServices = booking.petIds.map(petId => {
        const pet = getPetDetails(petId);
        if (!pet) return null;
        const serviceNames = booking.services[petId] || [];
        const services = serviceNames.map(name => {
            const service = getServiceDetails(pet.type, name);
            if (service) totalDuration += parseDuration(service.duration);
            return { name: name, duration: service ? service.duration : '-' };
        }).filter(Boolean);
        return { ...pet, services: services };
    }).filter(Boolean);
    return { pets: petsWithServices, totalDuration };
};
</script>

<style scoped>
/* New Avatar Styles */
.avatar-container {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden; /* Ensures the overlay stays within the circle */
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

/* Profile Header Styles */
.profile-header-wrapper {
  position: relative;
  padding-top: 60px; /* Space for the avatar */
  margin-top: 24px;
}

.profile-header-avatar {
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.profile-card {
  border-radius: 24px !important;
  position: relative;
}

.profile-card-actions {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 20;
}

.profile-card-title {
    font-size: 1.75rem;
    font-weight: 700;
}

.profile-card-subtitle {
    font-size: 1rem;
}

/* Pet Card Styles */
.pet-card {
    border-radius: 16px !important;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out;
    cursor: pointer;
}

.pet-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.1);
    background-color: rgba(var(--v-theme-on-surface), 0.04);
}

.add-pet-card {
    border-radius: 16px !important;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease;
    border: 2px dashed #BDBDBD;
}

.add-pet-card:hover {
    background-color: #f5f5f5;
    border-color: #9E9E9E;
}

/* General Styles */
.rounded-lg {
  border-radius: 12px;
}

.border-dashed {
  border-style: dashed;
}
</style>
