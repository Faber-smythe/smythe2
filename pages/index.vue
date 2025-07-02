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

    <ClientOnly fallback-tag="span" fallback="Loading 3D scene...">
      <Scene
        :progress="scrollProgress"
        :cursor="cursor"
        :page-loaded="pageLoaded"
        @compass-loaded="compassIsLoaded()"
      />
    </ClientOnly>
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
import { ref, onMounted } from "vue";

import { gsap, Elastic, Power3 } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomEase from "@/assets/gsap/CustomEase.js";
import Scrollbar from "smooth-scrollbar";

import { attachImages } from "@/composables/useProjectImages";
import { isMobile, isSmartPhone, isLandscape } from "@/composables/utilsCompo";

import type Project from "@/types/Project";
import type Position2 from "@/types/Position2";
import type TitleAnimation from "@/types/TitleAnimation";

gsap.registerPlugin(ScrollTrigger);

const title = ref<HTMLElement | null>(null);
const up = ref<HTMLElement | null>(null);
const down = ref<HTMLElement | null>(null);
const scroller = ref<HTMLElement | null>(null);
const scrollProgress = ref(0);
const cursor = ref<Position2>({ x: 0, y: 0 });
const pageLoaded = ref(false);
// let pageLoaded = false;

const showTracks = !(isMobile || isSmartPhone);
let compassLoaded = false;
let loadedImages = 0;
let titleAnimations: TitleAnimation[] = [];

let tweening = false;
let titleHoverCount = 0;

const projects = attachImages(rawProjects as Project[]);

const imgIsLoaded = () => {
  loadedImages += 1;
  if (loadedImages === projects.length && compassLoaded) pageIsReady();
};

const compassIsLoaded = () => {
  console.log("compassIsLoaded was called");
  compassLoaded = true;
  if (loadedImages === projects.length) pageIsReady();
  // console.log('compass is loaded')
};

const pageIsReady = () => {
  pageLoaded.value = true;
  const loadingUI = document.getElementById("babylonjsLoadingDiv-0") as HTMLElement;
  if (!loadingUI) return;
  loadingUI.style.pointerEvents = "none";
};

const prepareTitleTweens = () => {
  if (!title.value || !title.value.querySelector("#h1")) return;
  const smytheBoundingRec = title.value.querySelector("#h1")!.getBoundingClientRect();

  // STRETCH
  const stretch = gsap.timeline();
  stretch.to("#h1 span", {
    duration: 0.5,
    margin: "0px 15px",
  });
  stretch.to("#h1 span", {
    duration: 0.8,
    margin: "0px",
    ease: Elastic.easeOut.config(2, 0.3),
  });
  stretch.eventCallback("onComplete", () => {
    tweening = false;
  });
  stretch.pause();
  titleAnimations.push({ timeline: stretch, name: "stretch" });

  // FOCUS
  const focus = gsap.timeline();
  focus.to("#h1", { duration: 0, width: "auto", transformOrigin: "center" });
  focus.to("#h1", {
    duration: 0.65,
    filter: "blur(5px)",
    transform: "scale(0.95)",
    ease: CustomEase.create("custom", "M0,0 C0,0 0,0 0.678,1 1,0 1,0 1,0"),
  });
  focus.to("#h1", {
    duration: 0.65,
    filter: "blur(5px)",
    transform: "scale(1.05)",
    ease: CustomEase.create("custom", "M0,0 C0,0 0,0 0.33,1 1,0 1,0 1,0"),
  });
  focus.eventCallback("onComplete", () => {
    tweening = false;
  });
  focus.pause();
  titleAnimations.push({ timeline: focus, name: "focus" });

  // WAVE
  const wave = gsap.timeline();
  wave.to("#h1 span", {
    duration: 0.5,
    paddingTop: "20px",
    stagger: 0.1,
    ease: CustomEase.create(
      "custom",
      "M0,0 C0,0 0,0 0.33,1 0.33,0.996 0.331,0.992 0.331,0.988 0.426,0.712 0.474,0.54 0.66,0.27 0.77,0.126 1,0 1,0"
    ),
  });
  wave.eventCallback("onComplete", () => {
    tweening = false;
  });
  wave.pause();
  titleAnimations.push({ timeline: wave, name: "wave" });

  // SPIN
  const spin = gsap.timeline();
  // spin.to('#h1', { duration: 0, width: 'auto', transformOrigin: 'center' })
  spin.to("#h1", {
    duration: 1,
    transformOrigin: "85% left",
    rotateX: "180deg",
    width: "auto",
    ease: CustomEase.create("cusom", "M0,0 C0,0 0.2,0.2 0.3,1 0.4,0.204 1,0 1,0 "),
  });
  spin.eventCallback("onComplete", () => {
    tweening = false;
  });
  spin.pause();
  titleAnimations.push({ timeline: spin, name: "spin" });

  // FALL
  const fall = gsap.timeline();
  fall.to("#h1", {
    duration: 1.5,
    top: `100vh`,
    ease: "expo.in",
  });
  fall.to("#h1", {
    duration: 0,
    top: `${-smytheBoundingRec.height - smytheBoundingRec.top}px`,
  });
  fall.to("#h1", {
    duration: 1.2,
    top: `0px`,
    ease: "expo.out",
  });

  fall.eventCallback("onComplete", () => {
    tweening = false;
  });
  fall.pause();
  titleAnimations.push({ timeline: fall, name: "fall" });

  // DOMINO
  const domino = gsap.timeline();
  domino.to("#h1 span:not(:last-child)", {
    duration: 0,
    transformOrigin: "60% 75%",
  });
  domino.to("#h1 span:last-child", {
    duration: 0,
    transformOrigin: "60% 30%",
  });
  domino.to("#h1 span:not(:last-child)", {
    duration: 1,
    rotateZ: "65deg",
    stagger: 0.2,
    ease: CustomEase.create("custom", "M0,0 C0,0 0,0 0.494,0.916 1,1 1,1 1,1"),
  });
  domino.to("#h1 span:last-child", {
    duration: 0.5,
    rotateZ: "45deg",
    ease: CustomEase.create(
      "custom",
      "M0,0 C0,0 0.1,0.231 0.15,0.48 0.2,0.731 0.2,1 0.2,1 0.2,1 0.327,0.643 0.48,0.452 0.656,0.238 1,0 1,0"
    ),
  });
  domino.to(
    "#h1 span:not(:last-child)",
    {
      duration: 1,
      rotateZ: "0deg",
      stagger: { from: "end", amount: 0.1, ease: Power3.easeIn },
      ease: Elastic.easeOut.config(0.8, 0.1),
    },
    1.9
  );
  domino.eventCallback("onComplete", () => {
    tweening = false;
  });
  domino.pause();
  titleAnimations.push({ timeline: domino, name: "domino" });

  // shuffle the animations
  titleAnimations = titleAnimations.sort((_a, _b) => 0.5 - Math.random());
};

const triggerTitleTween = () => {
  console.log(titleAnimations);
  // return;
  if (!tweening) {
    tweening = true;
    const tween = titleAnimations[titleHoverCount].timeline;
    tween.play(0);
    titleHoverCount++;
    if (titleHoverCount === titleAnimations.length) {
      titleHoverCount = 0;
    }
  }
};

onMounted(() => {
  if (!scroller.value || !title.value || !up.value || !down.value) {
    return;
  }
  const bodyScrollbar = Scrollbar.init(scroller.value, {
    alwaysShowTracks: showTracks,
    delegateTo: document,
  });
  bodyScrollbar.track.xAxis.element.remove();

  // ---------------------------
  console.log(scroller.value);

  ScrollTrigger.scrollerProxy(scroller.value, {
    scrollTop(value) {
      if (arguments.length) {
        bodyScrollbar.scrollTop = value!;
      }
      return bodyScrollbar.scrollTop;
    },
  });
  // ---------------------------

  bodyScrollbar.addListener(ScrollTrigger.update);
  ScrollTrigger.defaults({ scroller: scroller.value });
  // Only necessary to correct marker position - not needed in production
  if (document.querySelector(".gsap-marker-scroller-start")) {
    const markers = gsap.utils.toArray('[class *= "gsap-marker"]');

    bodyScrollbar.addListener(({ offset }) => {
      gsap.set(markers, { marginTop: -offset.y });
    });
  }

  // down arrow always white on mobile
  if (isMobile() || isSmartPhone()) down.value.style.filter = "invert(1)";

  // scroll listener
  bodyScrollbar.addListener(() => {
    if (!title.value || !up.value || !down.value) {
      return;
    }
    // handling the up and down angle
    if (bodyScrollbar.scrollTop === 0) {
      up.value.style.display = "none";
      if (isMobile() || isSmartPhone()) {
        down.value.style.filter = "invert(1)";
      }
    } else {
      up.value.style.display = "flex";
      if (isMobile() || isSmartPhone()) {
        down.value.style.filter = "invert(0)";
      }
    }
    if (bodyScrollbar.scrollTop === bodyScrollbar.limit.y) {
      up.value.style.display = "flex";
      down.value.style.display = "none";
      if (isMobile() || isSmartPhone()) {
        // up.value.style.display = 'flex'
        // down.value.style.display = 'none'
      }
      // } else if (isMobile() || isSmartPhone()) {
    } else {
      down.value.style.display = "flex";
      if (isMobile() || isSmartPhone()) {
        up.value.style.display = "none";
      }
    }

    // update the scroll progress
    if (isMobile() || isSmartPhone()) {
      const bias = isLandscape() ? 0.5 : 2;
      let ratio = bodyScrollbar.scrollTop / (window.innerHeight * bias);
      if (ratio > 1) ratio = 1;
      title.value.style.top = `-${50 * ratio}vh`;
      // set progress
      scrollProgress.value = ratio;
    } else {
      // set progress
      scrollProgress.value = bodyScrollbar.scrollTop / bodyScrollbar.limit.y;
    }

    // pull up footer for mobile
    if (isMobile() || isSmartPhone()) {
      // footer.style.bottom = `-${  }px`
    }
  }); // Only for desktop

  if (!(isMobile() || isSmartPhone())) {
    // register animation list
    prepareTitleTweens();
    // listen to title hover
    title.value.onmouseenter = () => {
      triggerTitleTween();
    };

    // title scroll tween
    const titleTween = gsap.timeline({
      scrollTrigger: {
        trigger: ".card:first-of-type",
        start: "top center",
        end: `top top`,
        // toggleActions: "play none reverse none",
        // markers: true,
        scrub: true,
      },
    });

    titleTween.to(title.value, { duration: 1, left: "50vw" }, 0);

    // listen to mouse sway
    document.addEventListener("mousemove", (e) => {
      cursor.value = {
        x: (e.x - window.innerWidth) / (window.innerWidth / 2) + 1,
        y: (e.y - window.innerHeight) / (window.innerHeight / 2) + 1,
      };
    });
  }
  // click on down / up arrows
  up.value.onclick = () => {
    bodyScrollbar.scrollTo(0, 0, 500);
  };
  down.value.onclick = () => {
    bodyScrollbar.scrollTo(0, bodyScrollbar.limit.y, 500);
  };
});
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
  font-size: 3vw;
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

#babylonjsLoadingDiv-0 {
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
