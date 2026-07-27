<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import axios from "axios";

const router = useRouter();
const isLoading = ref(false);
const credentials = ref({
  email: '',
  password: '',
});

async function handleSubmit() {
  if (isLoading.value) {
    return;
  }
  try {
    isLoading.value = true;
    const response = await axios.post("http://localhost:8080/api/auth/login", {
      email: credentials.value.email,
      password: credentials.value.password
    });
    if (response.status === 200) {
      const token = response.data.token;
      localStorage.setItem("auth_token", token);
      await router.push("/devstash");
    }
    credentials.value = {
      email: "",
      password: ""
    }
  } catch (error) {
    isLoading.value = false;
    // Handle validation / server failures
    if (error.response && error.response.status === 400) {
      alert("Validation error: " + JSON.stringify(error.response.data));
    } else if (error.response && (error.response.status === 403 || error.response.status === 401)) {
      alert("Invalid Credentials");
    } else {
      alert("An unexpected error occurred. Please try again later.");
    }
    console.error("Login error: ", error);
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="form-container">
    <h1>Login</h1>
    <div class="rows-container">
      <div class="flex-row">
        <label for="email">Email<span> *</span></label>
        <input id="email" type="email" v-model="credentials.email" placeholder="enter email"/>
      </div>
      <div class="flex-row">
        <label for="password">Password<span> *</span></label>
        <input id="password" type="password" v-model="credentials.password" placeholder="enter password"/>
      </div>
      <p>Note: all fields required</p>
    </div>
    <button type="submit" :disabled="isLoading" class="auth-button">{{isLoading? 'Processing...' : 'Continue'}}</button>
  </form>

</template>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 500px;
  height: 500px;
}

.rows-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0 40px;
  gap: 20px;
  margin-bottom: 40px;
}

.flex-row {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  gap: 50px;
}

input {
  padding: 2px 0 2px 5px;
  border: none;
  border-bottom: 1px solid black;
  color: black;
}

input::placeholder {
  color: lightgrey;
  font-size: 0.9rem;
}

h1 {
  margin-bottom: 40px;
}

p {
  align-self: flex-end;
  font-size: 0.75rem;
  color: firebrick;
}

label span {
  color: firebrick;
  font-weight: bold;
  font-size: 0.9rem;
}
</style>