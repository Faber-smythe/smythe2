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
}

@media screen and (max-width: 1440px) {
  .card .desc {
    font-size: 1em;
  }
}
@media screen and (max-width: 1024px) {
  .card {
    width: 100%;
    height: 50%;
    margin: -2px;
  }

  .card h2 {
    font-size: 1.4em;
    text-align: center;
  }

  .card .cardName {
    text-transform: uppercase;
    font-size: 1.1em;
    margin: 5px;
  }

  .card .desc {
    position: absolute;
    z-index: -1;
    left: 0vw;
    width: 50vw;
    height: 100%;
    padding: 10px;
    border: none;
    background: rgba(255, 255, 255, 1);
    font-family: "Roboto", sans-serif;
    font-size: 0.7em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
  }
  .card .desc p {
    text-align: right;
  }
  .card:hover {
    width: 50vw;
    margin-left: 50vw;
  }
  .card:hover .desc {
    left: -50vw;
    border: none;
  }
  .card .desc a:hover {
    opacity: 1;
  }
}

@media screen and (max-width: 1024px) and (orientation: portrait) {
  .card {
    height: calc(101vh / 3);
  }
}
@media screen and (max-width: 1024px) and (orientation: landscape) {
  .card {
    height: 51vh;
  }
}
</style>
