<template>
  <div>
    <router-view v-slot="{ Component }">
        <v-slide-x-transition mode="out-in">
            <component :is="Component" />
        </v-slide-x-transition>
    </router-view>
  </div>
</template>

<script setup>
// This component just acts as a container for the nested booking routes
// and provides a transition effect.
</script>
