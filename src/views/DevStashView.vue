<script setup>
import {useRouter} from 'vue-router'
const router = useRouter()

function handleLogout() {
  localStorage.removeItem('auth_token');
  router.push('/login')
}
</script>
<template>
  <div>
    <h1>Welcome to Your Secure DevStash Dashboard!</h1>
    <p>If you see this, your router firewall is working perfectly.</p>
    <button @click="handleLogout" class="logout-button">Sign Out</button>
  </div>
</template>
<style scoped>
.logout-button {
  background-color: #dc3545;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}
.logout-button:hover {
  background-color: #bd2130;
}
</style>