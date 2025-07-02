<template>
  <div class="my-component">
    <h1>Hello from MyComponent!</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

import myData from "@/data/projects.json";
import { gsap } from "gsap";

function increment() {
  count.value++;
}

// const projects = require("@/data/projects.json") as Project[];

onMounted(() => {
  gsap.to(".my-component", { x: 100 });
  const count = ref(0);
  // e.g., start some process, fetch data, add event listener
});

onUnmounted(() => {
  console.log("Component is unmounted!");
  // e.g., cleanup timers, remove event listeners
});
</script>

<style scoped>
.my-component {
  padding: 1rem;
  background: #f0f0f0;
  border-radius: 8px;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}
</style>
