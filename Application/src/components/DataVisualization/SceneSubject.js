import * as THREE from 'three';

export default scene => {    
    const group = new THREE.Group();
    var radius = 1;
    var segments = 10;
    var rings = 10;
    
    var geometry = new THREE.SphereGeometry(radius, segments, rings);
    var material = new THREE.MeshBasicMaterial({
      color: 0xF3A2B0,
      wireframe: true
    });
    
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    scene.add(new THREE.AxesHelper(3));


    const speed = 0.02;

    function update(time) {
    }

    return {
        update
    }
}