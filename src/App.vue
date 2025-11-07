<script setup>
import { ref } from 'vue'
import ProductForm from './components/productForm.vue';
import TableProduct from './components/tableProduct.vue';
import { useProducts } from './composables/useProducts'
import SearchForm from './components/searchForm.vue';

const selected = ref(null)
const { getProducts } = useProducts()

function onEdit(item){
  selected.value = item ? { ...item } : null
}

async function onSaved(){
  // refresh list after save
  try{ await getProducts() }catch(e){}
  selected.value = null
}

async function onDeleted(){
  try{ await getProducts() }catch(e){}
}

function onCleared(){
  selected.value = null
}

</script>

<template>
  <h1>Aplikasi Pengelolaan Produk</h1>
  <ProductForm :selected="selected" @saved="onSaved" @cleared="onCleared" />
  <SearchForm />
  <TableProduct @edit="onEdit" @deleted="onDeleted" />
</template>

<style scoped></style>
