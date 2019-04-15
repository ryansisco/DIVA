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

function makeLine( geo, clr, graph ){
	const res = new THREE.Vector2(window.innerWidth, window.innerHeight);
	const g = new MeshLine.MeshLine();
	g.setGeometry(geo);

	const material = new MeshLine.MeshLineMaterial({
		useMap: false,
		color: new THREE.Color(clr),
		opacity: 1,
		resolution: res,
		sizeAttenuation: true,
		lineWidth: 0.001 * SCALE
	});

	const mesh = new THREE.Mesh(g.geometry, material);
	graph.add(mesh);
}

export default (scene, graphData) => {
	// SET UP AXES
	var graph = new THREE.Object3D();
	scene.add(graph);

  
  
  	const xaxis = new THREE.Geometry();
	xaxis.vertices.push( new THREE.Vector3( SCALE, 0, 0) );
	xaxis.vertices.push( new THREE.Vector3( 0, 0, 0) );
	makeLine(xaxis, '#ff0000', graph);
	
	var yaxis = new THREE.Geometry();
	yaxis.vertices.push( new THREE.Vector3( 0, SCALE, 0) );
	yaxis.vertices.push( new THREE.Vector3( 0, 0, 0) );
	makeLine(yaxis, '#00ff00', graph);
	
	var zaxis = new THREE.Geometry();
	zaxis.vertices.push( new THREE.Vector3( 0, 0, -1 * SCALE) );
	zaxis.vertices.push( new THREE.Vector3( 0, 0, 0) );
	makeLine(zaxis, '#0000ff', graph);

	const formatString = (i, max, min, indices) => {
		return indices[Math.round((i/SCALE * (max - min)) + min)];
	}

	const axes = {
		x: {
			...graphData.xColumn,
			fromX: SCALE,
			fromY: 0,
			fromZ: 0
		},
		y: {
			...graphData.yColumn,
			fromX: 0,
			fromY: SCALE,
			fromZ: 0
		},
		z: {
			...graphData.zColumn,
			fromX: 0,
			fromY: 0,
			fromZ: -1 * SCALE
		}
	}

	const offsetText = (key, per) => {
		switch(key) {
			case 'x':
				return {
					x: per * SCALE,
					y: 0,
					z: SCALE/25 
				}
			case 'y':
				return {
					x: -SCALE/25,
					y: per * SCALE,
					z: SCALE/25
				}
			case 'z':
				return {
					x: -SCALE/25,
					y: 0,
					z: -per * SCALE
				}
			default:
				return null;
		}
	}

	const offsetTick = (key, per) => {
		switch(key) {
			case 'x':
				return {
					from: {
						x: per * SCALE,
						y: 0,
						z: 0
					},
					to: {
						x: per * SCALE,
						y: 0,
						z: SCALE/75
					},
					color: '#ff0000' 
				}
			case 'y':
				return {
					from: {
						x: 0,
						y: per * SCALE,
						z: 0
					},
					to: {
						x: -SCALE/100,
						y: per * SCALE,
						z: SCALE/100
					},
					color: '#00ff00'
				}
			case 'z':
				return {
					from: {
						x: 0,
						y: 0,
						z: -per * SCALE
					},
					to: {
						x: -SCALE/75,
						y: 0,
						z: -per * SCALE
					},
					color: '#0000ff'
				}
			default:
				return null;
		}
	}

	Object.keys(axes).forEach(axisKey => {
		const axis = axes[axisKey];
		switch(axis.type) {
			case 'date':
			case 'number':
				for (let i = 0; i <= axis.max - axis.min; i += (axis.max - axis.min)/10) {
					const per = i/(axis.max - axis.min);
					const textOffset = offsetText(axisKey, per);
					const tickInfo = offsetTick(axisKey, per);
					var line = new THREE.Geometry();
					line.vertices.push(new THREE.Vector3(tickInfo.from.x, tickInfo.from.y, tickInfo.from.z));
					line.vertices.push(new THREE.Vector3(tickInfo.to.x, tickInfo.to.y, tickInfo.to.z));
					makeLine(line, tickInfo.color, graph);
					makeText(scene, String(i + axis.min), 0.015 * SCALE, textOffset.x, textOffset.y, textOffset.z);
				}
				break;
			case 'string':
				const incrementAmount = axis.max >= 10 ? (axis.max - (axis.max % 10)) / 10 : 1;
				const incrementTo = axis.max >= 10 ?  axis.max - (axis.max % 10) : axis.max;
				console.log(axis.name);
				console.log(incrementAmount, axis.max)
				for (let i = 0; i < incrementTo; i+=incrementAmount) {
					const per = i/incrementTo;
					const textOffset = offsetText(axisKey, per);
					const tickInfo = offsetTick(axisKey, per);
					var line = new THREE.Geometry();
					line.vertices.push(new THREE.Vector3(tickInfo.from.x, tickInfo.from.y, tickInfo.from.z));
					line.vertices.push(new THREE.Vector3(tickInfo.to.x, tickInfo.to.y, tickInfo.to.z));
					makeLine(line, tickInfo.color, graph)
					makeText(scene, axis.indices[i], 0.015 * SCALE, textOffset.x, textOffset.y, textOffset.z);
				}
		}
	});
	
	
	makeText(scene, graphData.xColumn.name, .03 * SCALE, SCALE/2, 0, SCALE/5);
	makeText(scene, graphData.yColumn.name, .03 * SCALE, -SCALE/5, SCALE/2, SCALE/5);
	makeText(scene, graphData.zColumn.name, .03 * SCALE, -SCALE/5, 0, -SCALE/2);
	// END OF AXES
	
	// START OF GRAPH DATA
	const pointsGeometery = new THREE.Geometry();
	
	// All points must be inbetween (0, 0, 0) and (SCALE, SCALE, SCALE). This keeps the viewbox consistent for different data being displayed.
	// The max values will be plotted at SCALE on the respective axes. Every other point will be graphed as a percentage of the max.
	const formatX = val => {
		return SCALE * (val - graphData.xColumn.min) / (graphData.xColumn.max - graphData.xColumn.min);
	}
	const formatY = val => {
		return SCALE * (val - graphData.yColumn.min) / (graphData.yColumn.max - graphData.yColumn.min);
	}
	const formatZ = val => {
		return -1 * SCALE * (val - graphData.zColumn.min) / (graphData.zColumn.max - graphData.zColumn.min);
	}


	graphData.data.forEach(value => {
		
		var geometry = new THREE.SphereGeometry( 5, 32, 32 );
		var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
		var sphere = new THREE.Mesh( geometry, material );
		sphere.position.set(formatX(value.x), formatY(value.y), formatZ(value.z));
		scene.add( sphere );
	});
	// END OF GRAPH DATA


  const speed = 0.02;

  function update(time) {
  }

  return {
    update
  }
}
