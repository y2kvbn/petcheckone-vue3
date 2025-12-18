<template>
  <v-container>
    <v-form @submit.prevent="handleLogin">
      <v-text-field
        v-model="phone"
        label="手機號碼"
        type="tel"
        prepend-inner-icon="mdi-phone-outline"
        variant="outlined"
        rounded="lg"
        class="mb-3"
        maxlength="10"
        :rules="phoneRules"
        autocomplete="username"
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="密碼"
        :type="isPasswordVisible ? 'text' : 'password'"
        prepend-inner-icon="mdi-lock-outline"
        :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="isPasswordVisible = !isPasswordVisible"
        variant="outlined"
        rounded="lg"
        :rules="passwordRules"
        autocomplete="current-password"
      ></v-text-field>
      <v-alert v-if="error" type="error" class="mt-3" dense text>{{ error }}</v-alert>
      <v-btn
        type="submit"
        color="primary"
        block
        rounded="xl"
        size="large"
        class="mt-6"
        :loading="authStore.isLoading"
        :disabled="!isFormValid || authStore.isLoading"
      >
        登入
      </v-btn>
    </v-form>

    <v-row align="center" class="my-4">
      <v-col><v-divider></v-divider></v-col>
      <v-col class="text-center text-caption text-grey">或</v-col>
      <v-col><v-divider></v-divider></v-col>
    </v-row>

    <v-btn
      @click="handleLineLogin"
      color="#00B900"
      dark
      block
      rounded="xl"
      size="large"
      :loading="authStore.isLoading"
      :disabled="authStore.isLoading"
    >
      <v-icon start icon="mdi-chat"></v-icon>
      Line快速登入
    </v-btn>

  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const phone = ref('');
const password = ref('');
const error = ref(null);
const router = useRouter();
const authStore = useAuthStore();
const isPasswordVisible = ref(false);

// --- Form Validation ---
const phoneRules = [
  v => !!v || '手機號碼為必填項目',
  v => (v && /^09\d{8}$/.test(v)) || '手機號碼格式不正確',
];

const passwordRules = [
  v => !!v || '密碼為必填項目',
];

const isFormValid = computed(() => {
  return phoneRules.every(rule => rule(phone.value) === true) &&
         passwordRules.every(rule => rule(password.value) === true);
});

// --- Logic ---
const handleLogin = async () => {
  error.value = null; // Reset error before login attempt

  if (!isFormValid.value) {
    error.value = '請輸入有效的手機號碼和密碼。';
    return;
  }

  const result = await authStore.login(phone.value, password.value);

  if (result.success) {
    router.push('/profile'); // Redirect to profile on successful login
  } else {
    error.value = result.message; // Show error message from the store
  }
};

const handleLineLogin = () => {
  alert('Line 登入功能正在開發中！');
};

/*
const handleGoogleLogin = async () => {
  error.value = null;
  const result = await authStore.loginWithGoogle();
  if (result.success) {
    router.push('/profile');
  } else {
    error.value = result.message;
  }
};
*/

</script>

<style scoped>
.white--text {
  color: white !important;
}
</style>
