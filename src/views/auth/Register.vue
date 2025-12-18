<template>
  <v-container>
    <v-form @submit.prevent="promptTermsAgreement">
      <v-text-field
        v-model="name"
        label="您的姓名"
        prepend-inner-icon="mdi-account-outline"
        variant="outlined"
        rounded="lg"
        class="mb-3"
        autocomplete="name"
        :rules="[v => !!v || '姓名為必填項目']"
      ></v-text-field>
      <v-text-field
        v-model="phone"
        label="手機號碼"
        type="tel"
        prepend-inner-icon="mdi-phone-outline"
        variant="outlined"
        rounded="lg"
        class="mb-3"
        :rules="phoneRules"
        maxlength="10"
        counter
        autocomplete="tel-national"
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="設定密碼"
        :type="isPasswordVisible ? 'text' : 'password'"
        prepend-inner-icon="mdi-lock-outline"
        :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="isPasswordVisible = !isPasswordVisible"
        variant="outlined"
        rounded="lg"
        class="mb-3"
        :rules="passwordRules"
        autocomplete="new-password"
      ></v-text-field>
       <v-text-field
        v-model="confirmPassword"
        label="確認密碼"
        :type="isPasswordVisible ? 'text' : 'password'"
        prepend-inner-icon="mdi-lock-check-outline"
        :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="isPasswordVisible = !isPasswordVisible"
        variant="outlined"
        rounded="lg"
        :rules="confirmPasswordRules"
        autocomplete="new-password"
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
        註冊
      </v-btn>
    </v-form>

    <TermsDialog ref="termsDialog" @agree="handleRegistration" />
    <SuccessDialog v-model="showSuccessDialog" @close="switchToLogin" />

  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import TermsDialog from '@/components/TermsDialog.vue';
import SuccessDialog from '@/components/SuccessDialog.vue';

const emit = defineEmits(['switch-to-login']);

const termsDialog = ref(null);
const showSuccessDialog = ref(false);
const name = ref('');
const phone = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref(null);
const isPasswordVisible = ref(false);

const authStore = useAuthStore();

// --- Form Validation ---
const phoneRules = [
  v => !!v || '手機號碼為必填項目',
  v => (v && /^09\d{8}$/.test(v)) || '手機號碼格式不正確 (應為 09 開頭的 10 位數字)',
];

const passwordRules = [
  v => !!v || '密碼為必填項目',
  v => (v && v.length >= 6) || '密碼長度至少需 6 個字元',
];

const confirmPasswordRules = [
  v => !!v || '確認密碼為必填項目',
  v => v === password.value || '兩次密碼輸入不一致',
];

const isFormValid = computed(() => {
  return !!name.value &&
         phoneRules.every(rule => rule(phone.value) === true) &&
         passwordRules.every(rule => rule(password.value) === true) &&
         confirmPasswordRules.every(rule => rule(confirmPassword.value) === true);
});

// --- Logic ---

const resetForm = () => {
  name.value = '';
  phone.value = '';
  password.value = '';
  confirmPassword.value = '';
  error.value = null;
};

const switchToLogin = () => {
  emit('switch-to-login');
};

const promptTermsAgreement = () => {
  error.value = null;
  if (!isFormValid.value) {
    error.value = '請確保所有欄位都已正確填寫。';
    return;
  }

  if (termsDialog.value) {
    termsDialog.value.open();
  }
}

const handleRegistration = async () => {
  const result = await authStore.register({
      name: name.value,
      phone: phone.value,
      password: password.value
  });

  if (result.success) {
    resetForm();
    showSuccessDialog.value = true;
  } else {
    error.value = result.message;
  }
};
</script>
