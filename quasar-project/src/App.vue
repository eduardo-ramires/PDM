<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';


onMounted(() => {
  // Isso só roda se for Capacitor
  if (Capacitor.isNativePlatform()) {
    StatusBar.setOverlaysWebView({ overlay: true });
  }
});
</script>
