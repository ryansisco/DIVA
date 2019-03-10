import * as THREE from 'three';
import * as MeshLine from 'three.meshline';
import * as TextSprite from 'three.textsprite';
import { SCALE } from './SceneManager';

function makeText(scene, text, textSize, x, y, z){
	var sprite = new TextSprite({
		textSize,
		texture: {
			text,
			fontFamily: 'Arial, Helvetical, sans-serif',
		},
		material: {color: 0x000000},
	});
	sprite.position.x = x
	sprite.position.y = y
	sprite.position.z = z
	scene.add(sprite)
}

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
	
	for(var i = 0; i <= SCALE; i+=SCALE/10){
		// X axis
		var line = new THREE.Geometry();
		if(i != 0){
			line.vertices.push( new THREE.Vector3( i, 0, 0) );
			line.vertices.push( new THREE.Vector3( i, 0, SCALE/75) );
			makeLine(line, '#ff0000')
		}
		if(i % 10 == 0 && i != 0){
			makeText(scene, String(i/10), .015 * SCALE, i, 0, SCALE/25);
		}
		
		// Y Axis
		if(i != 0){
			var line = new THREE.Geometry();
			line.vertices.push( new THREE.Vector3( 0, i, 0) );
			line.vertices.push( new THREE.Vector3( -SCALE/100, i, SCALE/100) );
			makeLine(line, '#00ff00')
		}
		if(i % 10 == 0 && i != 0){
			makeText(scene, String(i/10), .015 * SCALE, -20, i, SCALE/25);
		}
		
		//Z Axis
		if (i != 0){
			var line = new THREE.Geometry();
			line.vertices.push( new THREE.Vector3( 0, 0, -i) );
			line.vertices.push( new THREE.Vector3( -SCALE/75, 0, -i) );
			makeLine(line, '#0000ff')
		}
		if(i % 10 == 0 && i != 0){
			makeText(scene, String(i/10), .015 * SCALE, -SCALE/25, 0, -i);
		}
	}
	
	
	makeText(scene, 'X Axis', .03 * SCALE, SCALE/2, 0, SCALE/10);
	makeText(scene, 'Y Axis', .03 * SCALE, -SCALE/10, SCALE/2, SCALE/10);
	makeText(scene, 'Z Axis', .03 * SCALE, -SCALE/10, 0, -SCALE/2);
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
