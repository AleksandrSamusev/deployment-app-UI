<script setup>
import '../styles.css'
</script>

<template>
  <div class="buttons-flex-container">
    <router-link to="/signup" class="auth-button">Sign Up</router-link>
    <router-link to="/login" class="auth-button"> Login</router-link>
  </div>
</template>

<style scoped>
.buttons-flex-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>