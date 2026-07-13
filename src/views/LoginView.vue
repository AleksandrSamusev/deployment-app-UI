<script setup>
import {ref} from 'vue'
const credentials = ref({
  email: '',
  password: '',
});

function handleSubmit() {
  console.log(credentials.value);
}
</script>

<template>
  <div class="form-container">
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
    <button type="submit" @click="handleSubmit()" class="auth-button">Continue</button>
  </div>
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