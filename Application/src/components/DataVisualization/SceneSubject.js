import * as THREE from 'three';

export default scene => {    
    const group = new THREE.Group();

    scene.add(new THREE.AxesHelper(3));


    const speed = 0.02;

    function update(time) {
    }

    return {
        update
    }
}