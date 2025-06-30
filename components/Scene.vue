<template>
  <div id="canvasHolder">
    <canvas ref="renderCanvas"></canvas>
  </div>
</template>

<script lang="ts">
// libs
import { Mixins, Component, Prop, Watch } from 'vue-property-decorator'
import * as BABYLON from 'babylonjs'
import 'babylonjs-loaders'
import { gsap, Power1 } from 'gsap'
// components
import { UtilMixins } from '@/utils/mixin'
// types
import { Position2 } from '@/utils/miscellaneous'

@Component
export default class Scene extends Mixins(UtilMixins) {
  @Prop({ type: Number, required: true }) readonly progress!: number
  @Prop({ type: Object, required: true }) readonly cursor!: Position2
  @Prop({ type: Boolean, required: true }) readonly pageLoaded!: boolean

  ready = false
  offset = 0.15
  nextRootPosition: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 0)
  canvas!: HTMLCanvasElement
  engine!: BABYLON.Engine
  scene!: BABYLON.Scene
  camera!: BABYLON.ArcRotateCamera
  light!: BABYLON.HemisphericLight
  head!: BABYLON.AbstractMesh
  pin!: BABYLON.AbstractMesh
  leg1!: BABYLON.AbstractMesh
  leg2!: BABYLON.AbstractMesh

  async mounted() {
    if (this.isMobile || this.isSmartPhone) {
      this.offset = -0.2
    }
    if ((this.isMobile || this.isSmartPhone) && this.isLandscape) {
      this.offset = 0
    }

    this.initScene()
    await this.loadCompass()

    this.$emit('compass-loaded')
    this.progressWatcher()
    this.swayWatcher()
    this.setIdle()

    this.ready = true

    // this.scene.debugLayer.show()

    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  }

  initScene() {
    this.canvas = this.$refs.renderCanvas as HTMLCanvasElement
    this.engine = new BABYLON.Engine(this.canvas)
    this.engine.setHardwareScalingLevel(1 / window.devicePixelRatio)
    this.engine.displayLoadingUI()
    this.scene = new BABYLON.Scene(this.engine)
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0)
    this.camera = new BABYLON.ArcRotateCamera(
      'camera',
      Math.PI,
      0,
      2,
      new BABYLON.Vector3(0, 0, 0),
      this.scene
    )
    // this.camera.attachControl(this.canvas)
    this.light = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(1, 1, 0),
      this.scene
    )
    if (this.isMobile || this.isSmartPhone) {
      this.camera.alpha = Math.PI / 2
      this.camera.minZ = 0.1
      this.camera.maxZ = 15
      if (this.isLandscape) {
        this.camera.radius = 0.8
      }
    }
    // Watch canvas resize event to adjust the 3D scene
    const resizeWatcher = new ResizeObserver(() => {
      this.engine.resize()
    })
    resizeWatcher.observe(this.$refs.renderCanvas as HTMLElement)
  }

  async loadCompass() {
    const pbr = new BABYLON.PBRMaterial('pbr', this.scene)
    pbr.backFaceCulling = false
    pbr.albedoColor = new BABYLON.Color3(1.0, 0.766, 0.336)
    pbr.reflectivityColor = new BABYLON.Color3(1.0, 0.766, 0.336)
    pbr.microSurface = 1.0 // Let the texture controls the value
    pbr.environmentIntensity = 0.85
    pbr.reflectionTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
      'environment.dds',
      this.scene
    )

    const imported = await BABYLON.SceneLoader.ImportMeshAsync(
      '',
      '',
      'compass.glb',
      this.scene
    )
    imported.meshes.forEach((mesh) => {
      switch (mesh.name) {
        case 'head':
          mesh.rotationQuaternion = null
          this.head = mesh
          break
        case 'leg1':
          this.leg1 = mesh
          break
        case 'leg2':
          this.leg2 = mesh
          break
        case 'pin':
          this.pin = mesh
          break
        case '__root__':
          mesh.rotationQuaternion = null
          break
      }
      mesh.material = pbr
    })
    return imported
  }

  @Watch('pageLoaded')
  hideLoadingUI() {
    // console.log('hide loading UI, page is loaded (compass and img)')
    this.engine.hideLoadingUI()
  }

  @Watch('progress')
  progressWatcher() {
    if (this.ready) {
      if (!(this.isMobile || this.isSmartPhone)) {
        // initial leg spread
        this.leg1.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(
          0,
          Math.PI / 12,
          0
        )
        this.leg2.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(
          0,
          -Math.PI / 12,
          0
        )
        // spin progressive
        gsap.to(this.head.rotation, {
          x: 0,
          y: 0,
          z: Math.PI * 3 * this.progress,
          duration: 0.5,
        })
      } else {
        // progressive leg spread
        this.leg1.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(
          0,
          (Math.PI / 2) * this.progress * 2,
          0
        )
        this.leg2.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(
          0,
          -(Math.PI / 2) * this.progress * 2,
          0
        )
        // progressive upwards
        const retreat = this.isLandscape ? 0.5 : 2.5
        gsap.to(this.head.position, {
          z: -retreat * this.progress,
          duration: 0.5,
        })
      }
    }
  }

  @Watch('cursor')
  swayWatcher() {
    if (this.ready) {
      const root = this.scene.getMeshByName('__root__')!
      this.nextRootPosition.x = this.nextRootPosition.x - 0.02 * this.cursor.y
      this.nextRootPosition.z =
        this.nextRootPosition.z + this.offset - 0.02 * this.cursor.x
      gsap.to(root.rotation, {
        x: (Math.PI / 6) * this.cursor.x,
        y: Math.PI,
        z: (Math.PI / 6) * this.cursor.y,
        duration: 0.5,
      })
    }
  }

  setIdle() {
    let swap = 0
    const root = this.scene.getMeshByName('__root__')!
    setInterval(() => {
      this.nextRootPosition.x =
        ((Math.random() - 0.5) / 6) *
        (this.isMobile || this.isSmartPhone ? 0 : 1)
      this.nextRootPosition.y = (Math.random() - 0.5) / 6
      this.nextRootPosition.z = this.offset + (Math.random() - 0.5) / 6

      gsap.to(root.position, {
        duration: 2.5,
        x: this.nextRootPosition.x,
        y: this.nextRootPosition.y,
        z: this.nextRootPosition.z,
        ease: Power1.easeInOut,
      })
    }, 2500)
    if (this.isMobile || this.isSmartPhone) {
      setInterval(() => {
        swap += Math.random() < 0.5 ? Math.PI : -Math.PI
        gsap.to(this.head.rotation, {
          duration: 1,
          x: 0,
          y: 0,
          z: swap,
          ease: Power1.easeInOut,
        })
      }, 3500)
    }
  }
}
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
