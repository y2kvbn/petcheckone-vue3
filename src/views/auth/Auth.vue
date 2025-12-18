<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-2 rounded-xl">
          <v-tabs v-model="tab" grow background-color="primary" dark>
            <v-tab value="login">登入</v-tab>
            <v-tab value="register">註冊</v-tab>
          </v-tabs>

          <v-card-text>
            <v-window v-model="tab">
              <v-window-item value="login">
                <Login />
              </v-window-item>
              <v-window-item value="register">
                <Register @switch-to-login="tab = 'login'" />
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import Login from '@/views/auth/Login.vue';
import Register from '@/views/auth/Register.vue';

const tab = ref('login');

</script>

<style scoped>
.rounded-xl {
    border-radius: 16px;
}
</style>
