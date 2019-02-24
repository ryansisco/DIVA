import * as THREE from 'three';

export default (scene, graphData) => {
  const pointsGeometery = new THREE.Geometry();
  
  graphData.data.forEach(value => {
    pointsGeometery.vertices.push(new THREE.Vector3(value.x, value.y, -1 * value.z));
  });

  const pointsMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 0.2 });

  const points = new THREE.Points(pointsGeometery, pointsMaterial);

  scene.add(points);

  scene.add(new THREE.AxesHelper(3));


  const speed = 0.02;

  function update(time) {
  }

  return {
    update
  }
}