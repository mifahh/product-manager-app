import { ref } from 'vue'
import axios from 'axios'

// module-scope shared state (singleton)
const products = ref([])
const loading = ref(false)
const message = ref('')
const selectedProduct = ref(null)

/**
 * Fetch products from json-server and populate `products`.
 * Returns the products array for convenience.
 */

const normalize = (s) => {
  if (!s) return ''
  return String(s)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, '')
}

async function getProducts(q){
  loading.value = true
  try{
    const base = 'http://localhost:3000/productData'
    // fetch full list then filter client-side for partial, case-insensitive matches
    const res = await axios.get(base)
    const all = Array.isArray(res.data) ? res.data : []
    // prepare query strings
    const qStr = q == null ? '' : String(q).trim()
    // if no query provided, return full list
    if (!qStr) {
      products.value = all
      message.value = `Menampilkan ${products.value.length} produk (dari ${all.length}).`
      return products.value
    }

    const needle = normalize(qStr)
    // digits-only version of the query to match numeric fields (e.g. searching `280` should match `28000`)
    const qDigits = qStr.replace(/\D/g, '')

    products.value = all.filter(item => {
      const name = normalize(item && item.nama)
      const kategori = normalize(item && item.kategori)
      const hargaStr = String(item && (item.harga ?? ''))
      const stokStr = String(item && (item.stok ?? ''))

      // match name or category (normalized, case-insensitive)
      if (name.includes(needle) || kategori.includes(needle)) return true

      // if the query contains digits, match against price or stock string (partial match allowed)
      if (qDigits && (hargaStr.includes(qDigits) || stokStr.includes(qDigits))) return true

      // also try normalized match against numeric strings (covers queries like "28000" or non-digit queries)
      if (normalize(hargaStr).includes(needle) || normalize(stokStr).includes(needle)) return true

      return false
    })
    message.value = `Menampilkan ${products.value.length} produk (dari ${all.length}).`
    return products.value
  }catch(err){
    console.error('getProducts failed', err)
    message.value = 'Gagal menampilkan produk. Lihat console untuk detail.'
    throw err
  }finally{
    loading.value = false
  }
}

function selectProduct(p){
  // store a shallow copy to avoid accidental mutations across components
  selectedProduct.value = p ? { ...p } : null
}

function clearSelected(){
  selectedProduct.value = null
}

export function useProducts(){
  return { products, loading, message, selectedProduct, getProducts, selectProduct, clearSelected }
}
