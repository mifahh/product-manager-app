<script setup>
import { computed, reactive, ref, watch } from 'vue';
import axios from 'axios';
const props = defineProps({ selected: { type: Object, default: null } })
const emit = defineEmits(['saved','cleared'])

// watch prop selected and populate form when parent passes selected product
watch(() => props.selected, (val) => {
  if (val) {
    product.id = val.id != null ? String(val.id) : null
    product.nama = val.nama || ''
    product.kategori = val.kategori || ''
    product.harga = val.harga || 0
    product.stok = val.stok || 0
    message.value = 'Mengedit produk: ' + (val.nama || '')
  }
})

const product = reactive({
  id: null,
  nama: "",
  kategori: "",
  harga: 0,
  stok: 0
})

const message = ref('')

const add = async () => {
  try {
    // generate sequential numeric id before adding
    if (!product.id) {
      product.id = String(await generateId())
    }
    const res = await axios.post("http://localhost:3000/productData", product, {
      headers: { "Content-Type": "application/json" },
    })
  // json-server returns the created object (with id)
  message.value = 'Produk berhasil ditambahkan.'
  // refresh shared list in parent via event
  emit('saved')
  reset(res.data && res.data.id ? res.data.id : null)
  return res
  } catch (err) {
    console.error('Add product failed:', err)
    message.value = 'Gagal menambahkan produk. Lihat console untuk detail.'
    throw err
  }
}

/**
 * Generate a new numeric id based on existing product ids.
 * Fetches the current list, computes max id (numeric) and returns max+1.
 * Falls back to a timestamp-based id when something goes wrong.
 */
async function generateId(){
  try{
    const res = await axios.get('http://localhost:3000/productData')
    const list = Array.isArray(res.data) ? res.data : []
    // extract numeric ids
    const numericIds = list.map(p => Number(p.id)).filter(n => !Number.isNaN(n) && Number.isFinite(n))
    const max = numericIds.length ? Math.max(...numericIds) : 0
    return String(max + 1)
  }catch(e){
    console.warn('generateId fallback to timestamp due to error', e)
    return String(Date.now())
  }
}

const update = async () => {
  if (!product.id) {
    message.value = 'Tidak ada produk yang dipilih untuk diupdate (id kosong).'
    return
  }

  try {
    const res = await axios.put(`http://localhost:3000/productData/${product.id}`, product, {
      headers: { "Content-Type": "application/json" },
    })
    message.value = 'Produk berhasil diupdate.'
    emit('saved')
    return res
  } catch (err) {
    console.error('Update product failed:', err)
    message.value = 'Gagal mengupdate produk. Lihat console untuk detail.'
    throw err
  }
}

function reset(productId){
      // reset form
    product.id = productId != null ? String(productId) : null
    product.nama = ''
    product.kategori = ''
    product.harga = 0
    product.stok = 0
}
</script>

<template>
  <div class="product-form">
    <h2 class="form-title">Form Tambah dan Edit Produk</h2>

    <div class="form-row">
      <label class="form-label">Nama</label>
      <input class="form-input" v-model="product.nama" placeholder="Masukkan nama produk" />
    </div>

    <div class="form-row">
      <label class="form-label">Kategori</label>
      <input class="form-input" v-model="product.kategori" placeholder="Masukkan kategori" />
    </div>

    <div class="form-row">
      <label class="form-label">Harga</label>
      <input class="form-input" type="number" v-model="product.harga" placeholder="0" />
    </div>

    <div class="form-row">
      <label class="form-label">Stok</label>
      <input class="form-input" type="number" v-model="product.stok" placeholder="0" />
    </div>

    <div class="form-actions">
      <button class="btn btn-primary" @click="add">Tambah</button>
      <button class="btn btn-ghost" @click="update" :disabled="!product.id">Edit</button>
  <button class="btn" @click="(function(){ reset(null); message.value=''; emit('cleared') })()">Clear</button>
    </div>

    <p class="message" v-if="message">{{ message }}</p>
  </div>

</template>

<style scoped>
.product-form{
  max-width: 520px;
  margin: 18px auto;
  padding: 18px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 6px 18px rgba(18, 38, 63, 0.08);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
}
.form-title{
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #102a43;
}
.form-row{
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.form-label{
  width: 90px;
  color: #334e68;
  font-weight: 600;
}
.form-input{
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  color: #102a43;
  background: #fbfdff;
}
.form-input:focus{
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.08);
}
.form-actions{
  display: flex;
  gap: 10px;
  margin-top: 12px;
}
.btn{
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}
.btn-primary{
  background: linear-gradient(180deg,#2563eb,#1d4ed8);
  color: white;
  box-shadow: 0 6px 12px rgba(37,99,235,0.18);
}
.btn-primary:active{transform: translateY(1px)}
.btn-ghost{
  background: transparent;
  color: #0f172a;
  border: 1px solid #e2e8f0;
}
.btn[disabled], .btn:disabled{
  opacity: 0.55;
  cursor: not-allowed;
}
.message{
  margin-top: 12px;
  padding: 8px 10px;
  background: #f1f5f9;
  color: #102a43;
  border-radius: 6px;
  font-size: 13px;
}

</style>