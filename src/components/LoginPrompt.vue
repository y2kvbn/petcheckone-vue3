<template>
  <v-container class="fill-height text-center pa-8" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" md="6">
        <v-card class="pa-6 rounded-xl elevation-2" color="white">
            <v-img
                src="/undraw_dog_cuddling.svg"
                height="200px"
                contain
                class="mb-4"
            ></v-img>
            <h2 class="text-h5 font-weight-bold mb-2 text-grey-darken-3">建立您的寵物檔案</h2>
            <p class="body-1 text-grey-darken-1 mb-6">加入會員，輕鬆管理您的寵物資訊並享受快速預約服務。</p>
            <v-btn
                color="primary"
                rounded="xl"
                size="large"
                block
                to="/auth"
                prepend-icon="mdi-account-plus"
            >
                立即登入或註冊
            </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// This is a static component to prompt users to log in.
</script>

<style scoped>
.fill-height {
    min-height: calc(100vh - 120px); /* Adjust based on your app-bar and bottom-nav height */
}
.rounded-xl {
    border-radius: 16px;
}
</style>
