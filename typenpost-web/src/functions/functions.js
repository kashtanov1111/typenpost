import { useEffect } from "react"

export function useTitle(title) {
    useEffect(() => {
      document.title = title
    },[title])
}
  
export function createImagePlaceholderUrl(path, size) {
    if (path.indexOf('cloudfront.net') > -1) {
        path = path.slice(path.indexOf('cloudfront.net') + 14,)
    }
    const awsDomainOnlyForImages = 
        "https://d1kll7zdtk3qm0.cloudfront.net"
    const first_part_of_path = path.slice(0, path.lastIndexOf('/'))
    const image_name = path.slice(path.lastIndexOf('/'),)
    const url = (
        awsDomainOnlyForImages + 
        first_part_of_path + 
        '/fit-in/' + 
        size + 
        image_name)
    return url
}

export function createImageSrcUrl(path) {
    const awsDomainOnlyForImages = "https://d1kll7zdtk3qm0.cloudfront.net"
    return awsDomainOnlyForImages + path
}

export function convertBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    })
}