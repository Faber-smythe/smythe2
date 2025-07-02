import type Project from '@/types/Project'

const images = import.meta.glob("~/assets/img/screenshots/*", {
  eager: true,
  import: "default"
})

export function attachImages(projects: Project[]): Project[] {
  return projects.map((project) => {
    const imgPath = `/assets/img/screenshots/${project.image}`
    const matchedImage = images[imgPath] as string
    if (!matchedImage) {
      console.warn(`Image not found for project: ${project.title} (${imgPath})`)
    }

    return {
      ...project,
      imageSrc: matchedImage || undefined
    }
  })
}