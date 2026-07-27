<script setup>
import {ref} from "vue";
import {useRouter} from 'vue-router'
import axios from "axios";

const router = useRouter();
const isLoading = ref(false);

const user = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirm: '',
});

async function handleSubmit() {
  if (isLoading.value) {
    return;
  }
  if(user.value.password !== user.value.passwordConfirm) {
    alert("Passwords do not match");
    return;
  }
  try {
    isLoading.value = true;
    const response = await axios.post("http://localhost:8080/api/auth/signup", {
      firstName: user.value.firstName,
      lastName: user.value.lastName,
      email: user.value.email,
      password: user.value.password
    });
    if (response.status === 201) {
      const token = response.data.token;
      localStorage.setItem("auth_token", token);
      await router.push("/devstash");
    }
    user.value = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "",
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
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="form-container">
    <h1>Sign Up</h1>
    <div class="rows-container">
      <div class="flex-row">
        <label for="first-name">First name<span> *</span></label>
        <input id="first-name" type="text" v-model="user.firstName" placeholder="enter First name"/>
      </div>
      <div class="flex-row">
        <label for="last-name">Last name<span> *</span></label>
        <input id="last-name" type="text" v-model="user.lastName" placeholder="enter Last name"/>
      </div>
      <div class="flex-row">
        <label for="email">Email<span> *</span></label>
        <input id="email" type="email" v-model="user.email" placeholder="enter email"/>
      </div>
      <div class="flex-row">
        <label for="password">Password<span> *</span></label>
        <input id="password" type="password" v-model="user.password" placeholder="enter password"/>
      </div>
      <div class="flex-row">
        <label for="password-confirmation">Confirm password<span> *</span></label>
        <input id="password-confirmation" type="password" v-model="user.passwordConfirm" placeholder="confirm password"/>
      </div>
      <p>Note: all fields required</p>
    </div>
    <button type="submit" :disabled="isLoading" class="auth-button">{{isLoading? 'Processing..' : 'Continue'}}</button>
  </form>
</template>

<style scoped>

.form-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 650px;
  height: auto;
}

.rows-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0 40px;
  gap: 20px;
  margin-bottom: 50px;
}

.flex-row {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
}

input {
  padding: 2px 0 2px 5px;
  border: none;
  outline: none;
  border-bottom: 1px solid black;
  color: black;
  font-size: 1.4rem;
  width: 55%
}

input::placeholder {
  color: lightgrey;
  font-size: 1rem;
}

h1 {
  margin-bottom: 60px;
  font-size: 3rem;
}

p {
  align-self: flex-end;
  font-size: 1rem;
  color: firebrick;
}

label {
  font-size: 1.5rem;
}

label span {
  color: firebrick;
  font-weight: bold;
  font-size: 1.2rem;
}
</style>