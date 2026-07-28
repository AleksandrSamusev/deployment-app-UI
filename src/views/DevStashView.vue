<script setup>
import {useRouter} from 'vue-router'
import {ref, onMounted} from 'vue'
import apiClient from "../api/client";

const router = useRouter()

const bookmarks = ref([])
const isLoading = ref(false)
const newBookmark = ref({
  title: '',
  url: '',
  description: ''
})

async function fetchBookmarks() {
  try {
    const response = await apiClient.get('/v1/bookmarks')
    bookmarks.value = response.data.content
  } catch (error) {
    console.error("Failed to load bookmark resource list:", error)
  }
}

async function handleCreateBookmark() {
  if (isLoading.value) {
    return
  }
  try {
    isLoading.value = true
    const response = await apiClient.post('/v1/bookmarks', {
      title: newBookmark.value.title,
      url: newBookmark.value.url,
      description: newBookmark.value.description
    })

    if (response.status === 201) {
      bookmarks.value.unshift(response.data)
      newBookmark.value = {title: '', url: '', description: ''}
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      alert("validation error: " + JSON.stringify(error.response.data))
    } else {
      alert("Failed to save link. Please check your URL input string.")
    }
  } finally {
    isLoading.value = false
  }
}


async function handleDelete(bookmarkId) {
  if(!confirm("Are you sure you want to delete this stashed link?")) return;
  try {
    const response = await apiClient.delete(`/v1/bookmarks/${bookmarkId}`)
    if (response.status === 204) {
      bookmarks.value = bookmarks.value.filter(item => item['bookmarkId'] !== bookmarkId)
    }
  } catch (error) {
    console.error("Failed to eliminate resource target:", error)
    alert("Unauthorized or missing resource.")
  }
}


function handleLogout() {
  localStorage.removeItem('auth_token');
  router.push('/login')
}

onMounted(() => {
  fetchBookmarks()
})

</script>
<template>
  <div class="dashboard-wrapper">
    <header class="dash-header">
      <h1>DevStash Workspace</h1>
      <button @click="handleLogout" class="btn-logout">Sign Out</button>
    </header>

    <!-- Create Bookmark Form Container Section -->
    <form @submit.prevent="handleCreateBookmark" class="stash-form">
      <h3>Stash a New Code Resource Link</h3>
      <div class="form-grid">
        <input type="text" v-model="newBookmark.title" placeholder="Resource Title (e.g., Spring Security Docs)" required />
        <input type="text" v-model="newBookmark.url" placeholder="https://example.com" required />
        <input type="text" v-model="newBookmark.description" placeholder="Optional notes or tag labels..." />
      </div>
      <button type="submit" :disabled="isLoading" class="btn-submit">
        {{ isLoading ? 'Stashing...' : 'Save to My Stash' }}
      </button>
    </form>

    <!-- Display List Grid Layout Output Area -->
    <div class="stash-list">
      <h3>My Saved Repositories</h3>

      <!-- Conditional Empty State View -->
      <div v-if="bookmarks.length === 0" class="empty-state">
        <p>Your stash layout is currently empty. Start saving links above!</p>
      </div>

      <!-- Main Render Grid Layout Loop -->
      <div v-else class="grid-container">
        <div v-for="item in bookmarks" :key="item.bookmarkId" class="bookmark-card">
          <div class="card-content">
            <h4>{{ item.title }}</h4>
            <a :href="item.url" target="_blank" class="resource-link">{{ item.url }}</a>
            <p v-if="item.description" class="resource-desc">{{ item.description }}</p>
          </div>
          <button @click="handleDelete(item.bookmarkId)" class="btn-delete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.dashboard-wrapper { max-width: 1000px; margin: 40px auto; padding: 0 20px; font-family: sans-serif; }
.dash-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 20px; }
.btn-logout { background: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
.stash-form { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 30px 0; border: 1px solid #e9ecef; }
.form-grid { display: flex; flex-direction: column; gap: 12px; margin-bottom: 15px; }
.form-grid input { padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px; }
.btn-submit { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; width: 100%; font-weight: bold; }
.btn-submit:disabled { background: #6c757d; }
.bookmark-card { background: white; border: 1px solid #dee2e6; border-radius: 6px; padding: 16px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
.card-content { display: flex; flex-direction: column; gap: 6px; overflow: hidden; }
.resource-link { color: #0056b3; text-decoration: none; word-break: break-all; font-size: 13px; }
.resource-link:hover { text-decoration: underline; }
.resource-desc { font-size: 13px; color: #6c757d; margin: 4px 0 0 0; }
.btn-delete { background: #fff; color: #dc3545; border: 1px solid #dc3545; padding: 6px 12px; border-radius: 4px; cursor: pointer; transition: all 0.2s; }
.btn-delete:hover { background: #dc3545; color: white; }
.empty-state { text-align: center; color: #6c757d; padding: 40px; background: #fafafa; border-radius: 6px; border: 1px dashed #dee2e6; }
</style>