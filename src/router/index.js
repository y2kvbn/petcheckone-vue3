
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useBookingStore } from '@/stores/bookingStore';

// --- Page Components ---
import Services from '@/views/Services.vue';
import StoreInfo from '@/views/StoreInfo.vue';
import Profile from '@/views/Profile.vue';
import AddEditPet from '@/views/AddEditPet.vue';

// --- Auth Components ---
import Login from '@/views/auth/Auth.vue'; // Renaming for clarity
import Register from '@/views/auth/Register.vue';

// --- Booking Flow Components ---
import BookingView from '@/views/booking/BookingView.vue';
import SelectPet from '@/views/booking/SelectPet.vue';
import SelectService from '@/views/booking/SelectService.vue';
import SelectDateTime from '@/views/booking/SelectDateTime.vue';
import BookingConfirmation from '@/views/booking/BookingConfirmation.vue';

const routes = [
  {
    path: '/',
    redirect: '/store-info'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true } // Redirect if logged in
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true } // Redirect if logged in
  },
  {
    path: '/services',
    name: 'Services',
    component: Services
  },
  {
    path: '/booking',
    component: BookingView,
    meta: { requiresAuth: true }, // The entire booking process requires login
    children: [
      {
        path: '',
        name: 'SelectPet',
        component: SelectPet
      },
      {
        path: 'select-service',
        name: 'SelectService',
        component: SelectService
      },
      {
        path: 'select-datetime',
        name: 'SelectDateTime',
        component: SelectDateTime
      },
      {
        path: 'confirmation',
        name: 'BookingConfirmation',
        component: BookingConfirmation
      }
    ]
  },
  {
    path: '/store-info',
    name: 'StoreInfo',
    component: StoreInfo
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/add-pet',
    name: 'AddPet',
    component: AddEditPet,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit-pet/:id',
    name: 'EditPet',
    component: AddEditPet,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  }
});

// --- Navigation Guards ---
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const bookingStore = useBookingStore();
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);

  // When leaving the booking flow, reset the temporary booking state
  if (from.path.startsWith('/booking') && !to.path.startsWith('/booking')) {
      bookingStore.resetCurrentBooking();
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    // If a route requires authentication and the user is not logged in, redirect to LOGIN page
    next('/login');
  } else if (requiresGuest && authStore.isAuthenticated) {
    // If a route requires a guest (like login/register) and user is logged in, redirect to profile
    next('/profile');
  } else {
    // Otherwise, proceed as normal
    next();
  }
});

export default router;
