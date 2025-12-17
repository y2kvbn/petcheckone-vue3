<template>
  <v-app>
    <v-app-bar app color="white" elevation="1">
       <v-toolbar-title class="d-flex justify-center align-center">
         <v-img
          src="/petcheckone.png"
          alt="寵客玩 PetCheckOne Logo"
          max-height="40"
          contain
        ></v-img>
      </v-toolbar-title>
    </v-app-bar>

    <v-main class="grey-lighten-4">
      <router-view />
    </v-main>

    <v-bottom-navigation v-model="activeTab" app color="primary" grow>
      <v-btn value="services" to="/services">
        <v-icon>mdi-star-outline</v-icon>
        <span>服務項目</span>
      </v-btn>

      <v-btn value="booking" to="/booking" @click="startNewBooking">
        <v-icon>mdi-calendar-multiselect</v-icon>
        <span>預約服務</span>
      </v-btn>

      <v-btn value="store-info" to="/store-info">
        <v-icon>mdi-store-outline</v-icon>
        <span>店家資訊</span>
      </v-btn>

      <v-btn :value="profileTab.value" :to="profileTab.to">
        <v-icon>{{ profileTab.icon }}</v-icon>
        <span>{{ profileTab.text }}</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useBookingStore } from '@/stores/bookingStore';

const auth = useAuthStore();
const bookingStore = useBookingStore();
const activeTab = ref('services');

const startNewBooking = () => {
  bookingStore.startNewBooking();
};

// Dynamically adjust profile tab based on auth state
const profileTab = computed(() => {
  if (auth.isAuthenticated) {
    return {
      value: 'profile',
      to: '/profile',
      icon: 'mdi-account-circle',
      text: '會員資料'
    };
  } else {
    return {
      value: 'login',
      to: '/login', // Corrected from /auth
      icon: 'mdi-login-variant',
      text: '登入/註冊'
    };
  }
});

</script>

<style>
.v-bottom-navigation .v-btn {
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  height: 100%;
}
.v-bottom-navigation .v-btn > .v-btn__content > span {
    font-size: 0.875rem; /* Increased font size */
    padding-bottom: 4px; /* Added padding to lift text */
}

body {
    background-color: #FAFAFA; /* Same as grey-lighten-4 */
}

</style>
