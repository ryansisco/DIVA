import * as THREE from 'three';
import * as MeshLine from 'three.meshline';

export default (scene, graphData) => {
	var res = new THREE.Vector2(window.innerWidth, window.innerHeight);
	var graph = new THREE.Object3D();
	scene.add(graph);

  var line = new THREE.Geometry();
  
  function makeLine( geo, clr ){
		var g = new MeshLine.MeshLine();
		g.setGeometry(geo);
		
		var material = new MeshLine.MeshLineMaterial({
			useMap: false,
			color: new THREE.Color(clr),
			opacity: 1,
			resolution: res,
			sizeAttenuation: !false,
			lineWidth: 0.1
		});
		
		var mesh = new THREE.Mesh(g.geometry, material);
		graph.add(mesh);
  }
  
	line.vertices.push( new THREE.Vector3( 3, 0, 0) );
	line.vertices.push( new THREE.Vector3( 0, 0, 0) );
	makeLine(line, '#ff0000')
	
	var line = new THREE.Geometry();
	line.vertices.push( new THREE.Vector3( 0, 3, 0) );
	line.vertices.push( new THREE.Vector3( 0, 0, 0) );
	makeLine(line, '#00ff00')
	
	var line = new THREE.Geometry();
	line.vertices.push( new THREE.Vector3( 0, 0, -3) );
	line.vertices.push( new THREE.Vector3( 0, 0, 0) );
	makeLine(line, '#0000ff')

  const pointsGeometery = new THREE.Geometry();
  
  graphData.data.forEach(value => {
    pointsGeometery.vertices.push(new THREE.Vector3(value.x, value.y, -1 * value.z));
  });

  const pointsMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 0.2 });

  const points = new THREE.Points(pointsGeometery, pointsMaterial);

  scene.add(points);


  const speed = 0.02;

  function update(time) {
  }

  return {
    update
  }
}
