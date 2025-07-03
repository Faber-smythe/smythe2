<template>
  <div id="logo_wrapper" ref="logo_wrapper" class="logo_wrapper">
    <div id="logo_container">
      <span id="circle"></span>
      <div id="handle_container">
        <span id="handle"></span>
      </div>
      <div class="compass_container" id="left_compass_container">
        <span class="compass" id="left_compass"></span>
        <span class="needle" id="left_needle"></span>
      </div>
      <div class="compass_container" id="right_compass_container">
        <span class="compass" id="right_compass"></span>
        <span class="needle" id="right_needle"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const logo_wrapper = ref<HTMLElement | null>(null);

onMounted(() => {
  console.log(logo_wrapper);
});
</script>

<style>
:root {
  --black: #242220;
  --white: #eee;
  --gold: #e18f00;
}

/**
** LOGO STYLE 
**/
#logo_wrapper {
  position: relative;
  height: 262px;
  width: 185px;
  display: flex;
  flex-direction: column;
  transform-origin: bottom right;
}

#logo_container {
  position: relative;
  height: 262px;
  width: 185px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transform-origin: bottom left;
  animation-timing-function: linear;
  border: 1px solid red;
}

#logo_container span {
  background: #242220;
}

#circle {
  position: absolute;
  left: 62px;
  top: 35px;
  background: none !important;
  height: 50px;
  width: 50px;
  border-radius: 40px;
  transform-origin: center;
  border: 5px solid #242220;
}

#handle_container {
  position: absolute;
  display: flex;
  align-items: flex-end;
  height: 50px;
  width: 5px;
  left: 90px;
  top: 0px;
}

#handle {
  width: 5px;
  height: 50px;
  transform-origin: bottom;
  position: absolute;
  top: 0px;
}

.compass_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 38px;
  height: 200px;
  width: 6px;
  position: absolute;
  bottom: -10px;
}

.compass {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 6px;
  transform-origin: top;
  height: 180px;
}

#right_compass_container {
  margin-left: 50px;
  transform: rotate(-25deg);
}

#left_compass_container {
  transform: rotate(25deg);
  left: 40px;
}

.compass_container .needle {
  transform-origin: top;
  width: 3px;
  height: 20px;
}
</style>
