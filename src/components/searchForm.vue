<script setup>
import { ref } from 'vue'
import { useProducts } from '../composables/useProducts'

const q = ref('')
const { getProducts } = useProducts()

async function onRefresh(){
  try{ await getProducts(q.value) }catch(e){ console.error(e) }
}
</script>

<template>
  <div class="search-form">
    <label class="search-label">Cari:
      <input class="search-input" @change="onRefresh" v-model="q" placeholder="ketik kata kunci..." />
    </label>
    <button class="search-btn" @click="onRefresh">Cari</button>
  </div>
</template>

<style scoped>
.search-form{display:flex;gap:8px;align-items:center;max-width:900px;margin:12px auto}
.search-input{padding:6px 8px;border:1px solid #cbd5e1;border-radius:6px}
.search-btn{padding:6px 10px;border-radius:6px;background:#2563eb;color:#fff;border:none;cursor:pointer}
.search-label{color:#334e68;font-weight:600}
</style>