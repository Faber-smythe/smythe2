<template>
  <a
    class="badge"
    :href="getBadge(badge).link"
    target="_blank"
    :style="{ backgroundColor: badgeColor }"
  >
    {{ getBadge(badge).tag }}
  </a>
</template>

<script setup lang="ts">
const props = defineProps({
  badge: {
    type: String,
    required: true,
  },
});
const { badge } = props;

const badgeColor = "rgb(0, 113, 241)";

const getBadge = (badge: string) => {
  switch (badge) {
    case "react":
      return {
        tag: "React",
        link: "https://fr.react.dev/",
      };
      break;
    case "nuxt":
      return {
        tag: "Nuxt",
        link: "https://nuxt.com/",
      };
      break;
    case "babylon":
      return {
        tag: "Babylon",
        link: "https://www.babylonjs.com/",
      };
      break;
    case "playcanvas":
      return {
        tag: "Playcanvas",
        link: "https://playcanvas.com/",
      };
      break;
    case "gsap":
      return {
        tag: "GSAP",
        link: "https://gsap.com/",
      };
      break;
    case "blender":
      return {
        tag: "Blender",
        link: "https://www.blender.org/",
      };
      break;
    case "typescript":
      return {
        tag: "Typescript",
        link: "https://www.typescriptlang.org/",
      };
      break;
    case "tailwindcss":
      return {
        tag: "TailwindCSS",
        link: "https://v3.tailwindcss.com/",
      };
      break;
    default:
      return {};
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@100;900&display=swap");

.badge {
  font-family: "Roboto", sans-serif;
  display: inline-block;
  color: white !important;
  margin: 5px;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 300;
}

@media screen and (max-width: 1024px) {
  .badge {
    margin: 3px;
    font-size: 0.6rem;
  }
}

@media screen and (max-width: 767px) {
  .badge {
    margin: 1px;
    padding: 5px 7px;
    font-size: 0.6rem;
  }
}
</style>
