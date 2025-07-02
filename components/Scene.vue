<template>
  <div id="canvasHolder">
    <canvas ref="renderCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
// libs
import { ref, onMounted, PropType, watch } from "vue";
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import { gsap, Power1 } from "gsap";
// components
// types
import type Position2 from "@/types/Position2";
import { isMobile, isSmartPhone, isLandscape } from "@/composables/utilsCompo";

const props = defineProps({
  progress: {
    type: Number,
    required: true,
  },
  cursor: {
    type: Object as PropType<Position2>,
    required: true,
  },
  pageLoaded: {
    type: Boolean,
    required: true,
  },
});
// const { progress, cursor, pageLoaded } = props;

let ready = false;
let offset = 0.15;
let nextRootPosition: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 0);
let canvas!: HTMLCanvasElement;
let engine!: BABYLON.Engine;
let scene!: BABYLON.Scene;
let camera!: BABYLON.ArcRotateCamera;
let light!: BABYLON.HemisphericLight;
let head!: BABYLON.AbstractMesh;
let pin!: BABYLON.AbstractMesh;
let leg1!: BABYLON.AbstractMesh;
let leg2!: BABYLON.AbstractMesh;

const renderCanvas = ref<HTMLElement | null>(null);

const initScene = () => {
  canvas = renderCanvas.value as HTMLCanvasElement;
  engine = new BABYLON.Engine(canvas);
  engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
  engine.displayLoadingUI();
  scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
  camera = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI,
    0,
    2,
    new BABYLON.Vector3(0, 0, 0),
    scene
  );
  // camera.attachControl(canvas)
  light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
  if (isMobile() || isSmartPhone()) {
    camera.alpha = Math.PI / 2;
    camera.minZ = 0.1;
    camera.maxZ = 15;
    if (isLandscape()) {
      camera.radius = 0.8;
    }
  }
  // Watch canvas resize event to adjust the 3D scene
  const resizeWatcher = new ResizeObserver(() => {
    engine.resize();
  });
  resizeWatcher.observe(canvas);
};
const loadCompass = async () => {
  const pbr = new BABYLON.PBRMaterial("pbr", scene);
  pbr.backFaceCulling = false;
  pbr.albedoColor = new BABYLON.Color3(1.0, 0.766, 0.336);
  pbr.reflectivityColor = new BABYLON.Color3(1.0, 0.766, 0.336);
  pbr.microSurface = 1.0; // Let the texture controls the value
  pbr.environmentIntensity = 0.85;
  pbr.reflectionTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
    "environment.dds",
    scene
  );

  const imported = await BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "",
    "compass.glb",
    scene
  );
  imported.meshes.forEach((mesh) => {
    switch (mesh.name) {
      case "head":
        mesh.rotationQuaternion = null;
        head = mesh;
        break;
      case "leg1":
        leg1 = mesh;
        break;
      case "leg2":
        leg2 = mesh;
        break;
      case "pin":
        pin = mesh;
        break;
      case "__root__":
        mesh.rotationQuaternion = null;
        break;
    }
    mesh.material = pbr;
  });
  return imported;
};

const setIdle = () => {
  let swap = 0;
  const root = scene.getMeshByName("__root__")!;
  if (!isMobile() && !isSmartPhone()) {
    // root.rotation = new BABYLON.Vector3(0, Math.PI, 0);
  }
  setInterval(() => {
    nextRootPosition.x =
      ((Math.random() - 0.5) / 6) * (isMobile() || isSmartPhone() ? 0 : 1);
    nextRootPosition.y = (Math.random() - 0.5) / 6;
    nextRootPosition.z = offset + (Math.random() - 0.5) / 6;

    gsap.to(root.position, {
      duration: 2.5,
      x: nextRootPosition.x,
      y: nextRootPosition.y,
      z: nextRootPosition.z,
      ease: Power1.easeInOut,
    });
  }, 2500);
  if (isMobile() || isSmartPhone()) {
    setInterval(() => {
      swap += Math.random() < 0.5 ? Math.PI : -Math.PI;
      gsap.to(head.rotation, {
        duration: 1,
        x: 0,
        y: 0,
        z: swap,
        ease: Power1.easeInOut,
      });
    }, 3500);
  }
};

const spinCompass = (scrollProgress: number) => {
  if (ready) {
    if (!(isMobile() || isSmartPhone())) {
      // initial leg spread
      const spread = Math.min(1, scrollProgress * 5);
      leg1.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(
        0,
        (Math.PI / 12) * spread,
        0
      );
      leg2.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(
        0,
        (-Math.PI / 12) * spread,
        0
      );
      // spin progressive
      gsap.to(head.rotation, {
        x: 0,
        y: 0,
        z: Math.PI * 3 * scrollProgress,
        duration: 0.5,
      });
    } else {
      // progressive leg spread
      leg1.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(
        0,
        (Math.PI / 2) * scrollProgress * 2,
        0
      );
      leg2.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(
        0,
        -(Math.PI / 2) * scrollProgress * 2,
        0
      );
      // progressive upwards
      const retreat = isLandscape() ? 0.5 : 2.5;
      gsap.to(head.position, {
        z: -retreat * scrollProgress,
        duration: 0.5,
      });
    }
  }
};

const swayCompass = (cursorPosition: Position2) => {
  if (ready) {
    const root = scene.getMeshByName("__root__")!;
    nextRootPosition.x = nextRootPosition.x - 0.02 * cursorPosition.y;
    nextRootPosition.z = nextRootPosition.z + offset - 0.02 * cursorPosition.x;
    gsap.to(root.rotation, {
      x: (Math.PI / 6) * cursorPosition.x,
      y: Math.PI,
      z: (Math.PI / 6) * cursorPosition.y,
      duration: 0.5,
    });
  }
};

const emit = defineEmits<{
  (e: "compass-loaded", payload: Boolean): void;
}>();

onMounted(async () => {
  if (isMobile() || isSmartPhone()) {
    offset = -0.2;
  }
  if ((isMobile() || isSmartPhone()) && isLandscape()) {
    offset = 0;
  }

  initScene();
  console.log(await loadCompass());

  emit("compass-loaded", true);
  setIdle();
  spinCompass(0);
  swayCompass({ x: 0, y: 0 });

  ready = true;

  // scene.debugLayer.show()

  engine.runRenderLoop(() => {
    scene.render();
  });
});

watch(
  () => props.pageLoaded,
  (loaded) => {
    console.log("pageLoaded : ", props.pageLoaded);
    if (loaded) engine.hideLoadingUI();
  }
);

watch(
  () => props.progress,
  (newvalue, oldvalue) => {
    spinCompass(newvalue);
  }
);

watch(
  () => props.cursor,
  (cursorPosition) => {
    swayCompass(cursorPosition);
  }
);
</script>

<style scoped>
#canvasHolder {
  position: absolute;
  z-index: -1;
  height: 100%;
  width: 100%;
  overflow: hidden;
  pointer-events: none;
}
canvas {
  position: absolute;
  height: 100%;
  width: 100%;
  right: -42vw;
}

@media screen and (max-width: 1024px) {
  canvas {
    right: 0vw;
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
