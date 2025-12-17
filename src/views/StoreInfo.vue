<template>
  <v-container>
    <v-card class="rounded-lg" border>
      <v-img src="/workshop.png" height="200px" cover></v-img>
      <v-card-text class="pb-0">
        <h2 class="text-h6 font-weight-bold mb-3">寵客玩-寵物美容寵物旅宿</h2>
        <v-list lines="two" class="pa-0" bg-color="transparent">
          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="grey-darken-1">mdi-map-marker</v-icon>
            </template>
            <v-list-item-title>地址</v-list-item-title>
            <v-list-item-subtitle class="text-wrap">台中市西區大隆路20號</v-list-item-subtitle>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="grey-darken-1">mdi-phone</v-icon>
            </template>
            <v-list-item-title>聯絡電話</v-list-item-title>
            <v-list-item-subtitle>0978031653</v-list-item-subtitle>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="grey-darken-1">mdi-clock-outline</v-icon>
            </template>
            <v-list-item-title>營業時間</v-list-item-title>
            <v-list-item-subtitle>週一至週五: 10:00 - 20:00</v-list-item-subtitle>
            <v-list-item-subtitle>週六至週日: 11:00 - 18:00</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-btn block variant="flat" color="primary" rounded="xl" size="large" prepend-icon="mdi-directions" @click="openNavigation">
          導航至店家
        </v-btn>
      </v-card-actions>
      
      <v-divider></v-divider>

       <v-card-text class="text-center">
           <h3 class="text-subtitle-1 font-weight-bold mb-3">加入 LINE 好友，預約更方便！</h3>
           <v-img src="/QRcode.png" max-width="180" class="mx-auto rounded-lg" aspect-ratio="1"></v-img>
        </v-card-text>
         <v-card-actions class="pa-4 pt-0">
             <v-btn 
                block 
                variant="flat" 
                color="green" 
                rounded="xl" 
                size="large" 
                prepend-icon="mdi-line" 
                href="https://lin.ee/kBhXL5w" 
                target="_blank"
             >
                前往 LINE
            </v-btn>
        </v-card-actions>
        <v-card-actions class="pa-4 pt-0">
             <v-btn 
                block 
                variant="outlined" 
                color="blue-grey" 
                rounded="xl" 
                size="large" 
                prepend-icon="mdi-web" 
                href="https://petcheckone.wordpress.com/" 
                target="_blank"
             >
                前往寵客玩官方網站
            </v-btn>
        </v-card-actions>

    </v-card>
  </v-container>
</template>

<script setup>
const openNavigation = () => {
  const address = '台中市西區大隆路20號';
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  window.open(url, '_blank');
};
</script>

<style scoped>
.text-wrap {
    white-space: normal;
}
.rounded-lg {
  border-radius: 16px;
}
</style>
