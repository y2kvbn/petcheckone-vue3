import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import vuetify from './plugins/vuetify';
import { auth } from './firebase'; // Import Firebase auth instance
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged

let app;

onAuthStateChanged(auth, () => {
  // This function runs whenever the user's auth state changes.
  // We will initialize the app here to make sure routing decisions
  // are made only after Firebase has determined the initial auth state.

  if (!app) {
    app = createApp(App);
    const pinia = createPinia();

    app.use(pinia);
    app.use(router);
    app.use(vuetify);

    app.mount('#app');
  }
});
