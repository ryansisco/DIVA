import * as THREE from 'three';
import * as MeshLine from 'three.meshline';

import { SCALE } from './SceneManager';

export default (scene, graphData) => {
	// SET UP AXES
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
			lineWidth: 0.001 * SCALE
		});
		
		var mesh = new THREE.Mesh(g.geometry, material);
		graph.add(mesh);
  }
  
	line.vertices.push( new THREE.Vector3( SCALE, 0, 0) );
	line.vertices.push( new THREE.Vector3( 0, 0, 0) );
	makeLine(line, '#ff0000');
	
	var line = new THREE.Geometry();
	line.vertices.push( new THREE.Vector3( 0, SCALE, 0) );
	line.vertices.push( new THREE.Vector3( 0, 0, 0) );
	makeLine(line, '#00ff00');
	
	var line = new THREE.Geometry();
	line.vertices.push( new THREE.Vector3( 0, 0, -1 * SCALE) );
	line.vertices.push( new THREE.Vector3( 0, 0, 0) );
	makeLine(line, '#0000ff');
	// END OF AXES

	// START OF GRAPH DATA
  const pointsGeometery = new THREE.Geometry();
	
	// All points must be inbetween (0, 0, 0) and (10, 10, 10). This keeps the viewbox consistent for different data being displayed.
	// The max values will be plotted at 10 on the respective axes. Every other point will be graphed as a percentage of the max.
	const formatX = val => {
		return SCALE * (val / (graphData.xColumn.max - graphData.xColumn.min)) - graphData.xColumn.min;
	}
	const formatY = val => {
		return SCALE * (val / (graphData.yColumn.max - graphData.yColumn.min)) - graphData.yColumn.min;
	}
	const formatZ = val => {
		return -1 * SCALE * (val / (graphData.zColumn.max - graphData.zColumn.min)) - graphData.zColumn.min;
	}

  graphData.data.forEach(value => {
    pointsGeometery.vertices.push(new THREE.Vector3(formatX(value.x), formatY(value.y), formatZ(value.z)));
  });

  const pointsMaterial = new THREE.PointsMaterial({ color: 0xFF0000, size: 0.01 * SCALE });

  const points = new THREE.Points(pointsGeometery, pointsMaterial);

	scene.add(points);
	// END OF GRAPH DATA


  const speed = 0.02;

  function update(time) {
  }

  return {
    update
  }
}
