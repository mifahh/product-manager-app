<script setup>
import { onMounted } from 'vue'
import { useProducts } from '../composables/useProducts'
import axios from 'axios'

const { products, loading, message, getProducts } = useProducts()
const emit = defineEmits(['edit','deleted'])

async function Delete(productId) {
  if (!productId) {
    message.value = 'Tidak ada produk yang dipilih untuk diupdate (id kosong).'
    return
  }

  try {
    await axios.delete(`https://my-json-server.typicode.com/mifahh/product-manager-app/productData/${productId}`)
    message.value = 'Produk berhasil didelete.'
    // refresh list
    await getProducts()
    emit('deleted')
  } catch (err) {
    console.error('Delete product failed:', err)
    message.value = 'Gagal mendelete produk. Lihat console untuk detail.'
    throw err
  }
}

onMounted(() => {
  getProducts()
})
</script>

<template>
  <div class="table-wrap">
    <table class="products-table">
      <thead>
        <tr>
          <th>No</th>
          <th>Nama</th>
          <th>Kategori</th>
          <th>Harga</th>
          <th>Stok</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="6" class="center">Memuat...</td>
        </tr>
        <tr v-else-if="products.length === 0">
          <td colspan="6" class="center">Tidak ada produk</td>
        </tr>
        <tr v-else v-for="(item, index) in products" :key="item.id || index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.nama }}</td>
          <td>{{ item.kategori }}</td>
          <td>{{ item.harga }}</td>
          <td>{{ item.stok }}</td>
          <td>
            <!-- Aksi placeholder: bisa dihubungkan ke form/edit/delete -->
            <button @click="$emit('edit', item)" class="small">Edit</button>
            <button @click="Delete(item.id)" class="small ghost">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p class="message" v-if="message">{{ message }}</p>
  </div>
</template>

<style scoped>
.message{
  margin-top: 12px;
  padding: 8px 10px;
  background: #f1f5f9;
  color: #102a43;
  border-radius: 6px;
  font-size: 13px;
}

.table-wrap{max-width:900px;margin:18px auto}
.products-table{width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden}
.products-table thead tr{background:#f8fafc}
.products-table th,.products-table td{padding:10px 12px;text-align:left;border-bottom:1px solid #eef2f7}
.products-table tr td.center{text-align:center;color:#64748b}
.products-table tbody tr:hover{background:#fbfdff}
.small{padding:6px 8px;border-radius:6px;border:none;background:#2563eb;color:#fff;margin-right:6px;cursor:pointer}
.small.ghost{background:transparent;color:#0f172a;border:1px solid #e2e8f0}
.small:active{transform:translateY(1px)}
</style>