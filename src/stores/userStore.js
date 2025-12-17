import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: true, // 預設為登入狀態以便開發
    profile: {
      name: '于豐豪',
      phone: '0978031653',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg' // 模擬的頭像
    }
  }),
  actions: {
    logout() {
      this.isLoggedIn = false;
      this.profile = {
        name: '',
        phone: '',
        avatar: ''
      };
      // 在真實應用中，這裡會清除 token 並呼叫登出 API
    }
  }
});
