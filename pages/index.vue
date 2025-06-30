<template>
  <main>
    <header>
      <h1>Johann Lefering / SMYTHE</h1>
      <div id="title" ref="title">
        <p>Johann&nbsp;Lefering</p>
        <p>/</p>
        <p id="h1">
          <span>S</span><span>M</span><span>Y</span><span>T</span><span>H</span
          ><span>E</span>
        </p>
      </div>
      <h2 id="subtitle">
        My taste for innovation and craftsmanship led me to study creative technologies.
        <br />
        After various web projects in foreign internships and a year as remote freelance,
        I keep working on immersive experiences in Paris.
      </h2>
    </header>
    <div ref="up" class="angleUp" title="up">
      <svg
        width="24"
        height="24"
        xmlns="http://www.w3.org/2000/svg"
        fill-rule="evenodd"
        clip-rule="evenodd"
      >
        <path
          stroke="white"
          stroke-width="0.2em"
          d="M 23.245 12.96 l -11.245 -9.3144 l -11.219 9.3144 l -0.781 -0.4011 l 12 -9.9669 l 12 9.9733 l -0.755 0.3947 z"
        />
      </svg>
    </div>
    <div ref="down" class="angleDown" title="down">
      <svg
        width="24"
        height="24"
        xmlns="http://www.w3.org/2000/svg"
        fill-rule="evenodd"
        clip-rule="evenodd"
      >
        <path
          stroke="white"
          stroke-width="0.2rem"
          d="M 23.245 2.6244 l -11.245 9.4308 l -11.219 -9.4308 l -0.781 0.4061 l 12 10.0915 l 12 -10.098 l -0.755 -0.3996 z"
        />
      </svg>
    </div>
    <div id="scroller" ref="scroller">
      <div id="cardHolder">
        <Card
          v-for="(project, i) in projects"
          :key="`project-${i}`"
          :project="project"
          :imageSrc="project.imageSrc"
          @img-load="imgIsLoaded"
        />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import rawProjects from "@/data/projects.json";
import { attachImages } from "@/composables/useProjectImages";
import type Project from "@/types/Project";

const projects = attachImages(rawProjects as Project[]);

const imgIsLoaded = () => {
  console.log("img is loaded");
};
</script>

<style>
html,
body {
  height: 100%;
}
header {
  position: fixed;
  width: 50%;
  height: 50%;
  display: flex;
  flex-direction: column;
}
h1 {
  display: none;
}
#scroller {
  position: fixed;
  right: 0px;
  z-index: 2;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  pointer-events: none;
}
.scrollbar-track {
  pointer-events: all;
}
#title,
#subtitle {
  margin: 2vh 35px;
}
#title {
  position: relative;
  z-index: 3;
  top: 20px;
  font-family: "Ailerons";
  font-size: 3.5vw;
  color: var(--highlight);
  display: flex;
  align-items: center;
  width: 0px;
  height: 77px;
}
#title p {
  margin: 0px 5px;
}
#h1 {
  display: flex;
  align-items: center;
  position: relative;
  height: 77px;
}
#h1 span {
  padding: 3px;
  display: block;
}
#subtitle {
  margin-left: calc(0.5em + 35px);
  width: 40vw;
  font-family: "Roboto", sans-serif;
  line-height: 1.6;
  font-size: 1.5vw;
  font-weight: 100;
}
#cardHolder {
  position: absolute;
  left: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.angleUp,
.angleDown {
  position: fixed;
  z-index: 5;
  left: calc(25vw - 12px);
  padding: 8px;
  cursor: pointer;
  transition: all 0.4s ease;
}
.angleUp:hover,
.angleDown:hover {
  opacity: 0.5;
}
.angleUp svg,
.angleDown svg {
  display: flex;
  justify-content: center;
  align-items: center;
}

.angleUp {
  display: none;
  top: 0px;
  animation: 1.5s ease 0s infinite normal both running up;
}

.angleDown {
  bottom: 0px;
  animation: 1.5s ease 0s infinite normal both running down;
}

footer {
  position: absolute;
  z-index: 5;
  right: 0px;
  bottom: 0px;
  width: 50%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

footer address {
  font-family: "Ailerons";
  font-size: 1.5em;
  text-transform: lowercase;
  margin: 10px 20px;
}

#babylonjsLoadingDiv {
  position: fixed !important;
  z-index: 999 !important;
  left: 0px !important;
  top: 0px !important ;
  pointer-events: all !important;
  background-color: #172227 !important;
}

@keyframes down {
  50% {
    bottom: 0px;
  }
  100% {
    bottom: 5px;
  }
}
@keyframes up {
  50% {
    top: 0px;
  }
  100% {
    top: 5px;
  }
}

@font-face {
  font-family: "Ailerons";
  src: url("/fonts/Ailerons.otf") format("otf"),
    url("/fonts/Ailerons.woff2") format("woff2"),
    url("/fonts/Ailerons.woff") format("woff");
}

@media screen and (max-width: 1024px) {
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  header {
    width: 100%;
    height: 100%;
    align-items: center;
  }
  #title {
    flex-direction: column;
    left: auto;
    font-size: 2em;
  }
  #title p {
    width: 90vw;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #subtitle {
    margin-top: 25vh;
    z-index: 1;
    text-align: center;
    width: 90vw;
    font-size: 1.1em;
    background: var(--background-transp);
    box-shadow: 0px 0px 10px 10px var(--background-transp);
    box-shadow: 0px 0px 10px 10px var(--background-transp);
  }
  .angleUp,
  .angleDown {
    left: calc(50vw - 20px);
    cursor: default;
  }
  .angleUp:hover,
  .angleDown:hover {
    opacity: 1;
  }
  #cardHolder {
    margin-top: 101vh;
    width: 100%;
    padding-bottom: calc(1.5em + 20px);
  }
  footer {
    width: 100%;
    z-index: 0;
    left: auto;
    height: calc(1.5em + 20px);
  }
}

@media screen and (max-width: 1024px) and (orientation: landscape) {
  #title {
    flex-direction: row;
    justify-content: center;
    font-size: 2em;
  }
}
</style>
