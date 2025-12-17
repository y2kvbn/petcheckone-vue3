import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';
import { auth } from '@/firebase';
import { useRouter } from 'vue-router';
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors.js';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(true);
  const error = ref(null);
  const router = useRouter();

  async function login(email, password) {
    isLoading.value = true;
    error.value = null;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
      isAuthenticated.value = true;
      router.push('/profile');
    } catch (e) {
      error.value = getFirebaseErrorMessage(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function register(email, password) {
    isLoading.value = true;
    error.value = null;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
      isAuthenticated.value = true;
      router.push('/profile');
    } catch (e) {
      error.value = getFirebaseErrorMessage(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    isLoading.value = true;
    try {
      await signOut(auth);
      user.value = null;
      isAuthenticated.value = false;
      router.push('/login');
    } catch (e) {
      error.value = getFirebaseErrorMessage(e);
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(() => {
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser;
      isAuthenticated.value = !!currentUser;
      isLoading.value = false;
    });
  });

  return { user, isAuthenticated, isLoading, error, login, register, logout };
});
