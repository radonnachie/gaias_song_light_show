import * as THREE from 'three'

export class PickHelper {
    raycaster: THREE.Raycaster;
    constructor() {
      this.raycaster = new THREE.Raycaster();
    }
    pick(normalizedPosition: THREE.Vector2, objects: THREE.Mesh[], camera: THREE.Camera) {   
      // cast a ray through the frustum
      this.raycaster.setFromCamera(normalizedPosition, camera);
      // get the list of objects the ray intersected
      const intersectedObjects = this.raycaster.intersectObjects(objects);
      if (intersectedObjects.length) {
        // pick the first object. It's the closest one
        return intersectedObjects[0].point;
      }
      return false
    }
  }