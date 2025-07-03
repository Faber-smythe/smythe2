<template>
  <div class="card">
    <h2>{{ project.title }}</h2>
    <div class="filter"></div>
    <div class="imgHolder">
      <div class="img" :style="`background-image: url('${imagePath}')`">
        <a v-if="!(isMobile || isSmartPhone)" :href="project.link" target="_blank"> </a>
      </div>
    </div>
    <div class="desc">
      <div :v-if="project.badges.length > 0" id="badgeHolder">
        <BadgePin v-for="badge in project.badges" :badge="badge"></BadgePin>
      </div>
      <p class="cardName">{{ project.title }}</p>
      <p v-html="project.desc"></p>
      <p class="previewLink">
        <a :href="project.link" target="_blank">View project</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { onMounted } from "vue";
import BadgePin from "@/components/BadgePin.vue";
import { isMobile, isSmartPhone } from "@/composables/utilsCompo";
import type Project from "@/utils/project";

const props = defineProps({
  project: {
    type: Object as PropType<Project>,
    required: true,
  },
  imageSrc: {
    type: String,
    required: true,
  },
});
const { project, imageSrc } = props;

const imagePath = imageSrc!;

// try loading the required image already, in order to warn the index when ready
const emit = defineEmits<{
  (e: "img-load", payload: string): void;
}>();

onMounted(() => {
  const _img = new Image();
  _img.src = imagePath;
  _img.addEventListener("load", () => {
    emit("img-load", imagePath);
  });
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;500;700;900&display=swap");

#badgeHolder {
  top: 10px;
  left: 0px;
  max-width: max-content;
  display: flex;
  flex-wrap: wrap;
}
.card {
  position: relative;
  z-index: 0;
  width: 50vw;
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: -1px;
  pointer-events: all;
}
.card:first-of-type {
  margin-top: 50vh;
}
.card,
.card .imgHolder,
.card .img,
.card h2,
.card .desc,
.card .filter {
  transition: all 0.5s ease;
}

.card h2,
.card .filter {
  position: absolute;
  pointer-events: none;
}

.card .imgHolder {
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.card .img {
  position: relative;
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.card .img a {
  display: inline-block;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.card h2 {
  font-family: "Roboto", sans-serif;
  color: white;
  z-index: 2;
  font-size: 2.5em;
  font-weight: 100;
  border-radius: 30px;
  padding: 0px 15px;
  box-shadow: 0px 0px 40px 40px rgba(0, 0, 0, 0.15),
    0px 0px 50px 60px inset rgba(0, 0, 0, 0.15);
}

.card .filter {
  width: 100%;
  height: 100%;
  background: black;
  opacity: 0.2;
  z-index: 1;
}

.card .desc {
  position: absolute;
  z-index: -1;
  right: -20px;
  height: 40%;
  width: 35vw;
  padding: 10px 20px;
  border-right: 40px solid transparent;
  border-color: var(--highlight-transp);
  background: var(--background-transp);
  font-family: "Roboto", sans-serif;
  font-size: 1.2em;
  font-weight: 100;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: flex-end;
  overflow: hidden;
}

.card .cardName {
  text-transform: uppercase;
  font-size: 1.5em;
  margin: 5px;
}

.card .desc a {
  color: var(--link);
  cursor: pointer;
}
.card .desc p {
  margin: 5px 0px;
  color: var(--text);
}
.card .previewLink {
  font-weight: 900;
}
.card .desc a {
  transition: all 0.3s ease;
}
.card .desc a:hover {
  opacity: 0.5;
}

.card:hover h2 {
  opacity: 0;
  transform: scale(0.8);
}
.card:hover .filter {
  opacity: 0;
}
.card:hover .img {
  transform: scale(1.1);
}
.card:hover .desc {
  right: -35vw;
  height: 100%;
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
    padding: 8px;
    border: none;
    background: rgba(255, 255, 255, 1);
    font-family: "Roboto", sans-serif;
    font-size: 0.7em;
    display: flex;
    flex-direction: column;
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
@media screen and (max-width: 767px) {
  .card .desc {
    font-weight: 300;
    font-size: 0.5em;
  }
}
</style>
