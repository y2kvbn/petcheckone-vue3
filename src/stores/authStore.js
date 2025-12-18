import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { auth, db, storage } from '@/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'vue-router';
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors.js';

const createEmailFromPhone = (phone) => `${phone}@petcheckone.app`;

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(true);
  const error = ref(null);
  const router = useRouter();
  
  const registrationSuccessMessage = ref(null);
  const shouldSwitchToLogin = ref(false);

  async function login(phone, password) {
    isLoading.value = true;
    error.value = null;
    try {
      const email = createEmailFromPhone(phone);
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (e) {
      error.value = getFirebaseErrorMessage(e);
      return { success: false, message: getFirebaseErrorMessage(e) };
    } finally {
      isLoading.value = false;
    }
  }

  async function register({ name, phone, password }) {
    isLoading.value = true;
    error.value = null;
    try {
      const email = createEmailFromPhone(phone);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      await setDoc(doc(db, 'users', newUser.uid), {
        name: name,
        phone: phone,
        email: email, 
        uid: newUser.uid,
        avatar: null, // Initialize avatar field
        hasAgreedToTerms: false // Initialize terms agreement
      });
      
      registrationSuccessMessage.value = '帳號建立成功！請使用您的手機號碼登入。';
      shouldSwitchToLogin.value = true;

    } catch (e) {
      error.value = getFirebaseErrorMessage(e);
      return { success: false, message: getFirebaseErrorMessage(e) };
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    isLoading.value = true;
    try {
      await signOut(auth);
      // onAuthStateChanged will handle the rest
    } catch (e) {
      error.value = getFirebaseErrorMessage(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function updateAvatar(avatarFile) {
    if (!user.value) return { success: false, message: 'User not authenticated.' };
    isLoading.value = true;
    try {
      // 1. Create a unique path in Storage
      const filePath = `avatars/${user.value.uid}/${Date.now()}_${avatarFile.name}`;
      const avatarStorageRef = storageRef(storage, filePath);

      // 2. Upload the file
      const uploadResult = await uploadBytes(avatarStorageRef, avatarFile);

      // 3. Get the public URL
      const downloadURL = await getDownloadURL(uploadResult.ref);

      // 4. Update the user's document in Firestore
      const userDocRef = doc(db, 'users', user.value.uid);
      await updateDoc(userDocRef, { avatar: downloadURL });

      // 5. Update the local state for immediate UI feedback
      user.value.avatar = downloadURL;

      // Also update the auth profile if you want to use Firebase's photoURL
      await updateProfile(auth.currentUser, { photoURL: downloadURL });

      return { success: true, url: downloadURL };
    } catch (e) {
      console.error("Avatar upload failed:", e);
      error.value = getFirebaseErrorMessage(e);
      return { success: false, message: getFirebaseErrorMessage(e) };
    } finally {
      isLoading.value = false;
    }
  }
  
  async function updateUser(userData) {
    if (!user.value) return;
    const userDocRef = doc(db, "users", user.value.uid);
    await updateDoc(userDocRef, userData);
    // Update local state
    Object.assign(user.value, userData);
  }

  const initialize = () => {
    onAuthStateChanged(auth, async (currentUser) => {
      isLoading.value = true;
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          user.value = { ...currentUser, ...userDoc.data() };
        } else {
          // This might happen if Firestore doc creation failed after auth creation
          user.value = currentUser;
        }
        isAuthenticated.value = true;
        if (router.currentRoute.value.path === '/login' || router.currentRoute.value.path === '/') {
            router.push('/profile');
        }
      } else {
        user.value = null;
        isAuthenticated.value = false;
        // Only redirect if not already on a public page
        if (router.currentRoute.value.meta.requiresAuth) {
            router.push('/login');
        }
      }
      isLoading.value = false;
    });
  };

  initialize();

  return { user, isAuthenticated, isLoading, error, login, register, logout, updateAvatar, updateUser, registrationSuccessMessage, shouldSwitchToLogin };
});
