import * as THREE from 'three';
import * as MeshLine from 'three.meshline';
import * as TextSprite from 'three.textsprite';
import { SCALE } from './SceneManager';


const res = new THREE.Vector2(window.innerWidth, window.innerHeight);

function makeText(scene, text, clr, textSize, x, y, z){
	var sprite = new TextSprite({
		textSize,
		texture: {
			text,
			fontFamily: 'Arial, Helvetical, sans-serif',
		},
		material: {color: clr},
	});
	sprite.position.x = x
	sprite.position.y = y
	sprite.position.z = z
	scene.add(sprite)
}

function makeLine( geo, clr, w, graph ){
	var g = new MeshLine.MeshLine();
	g.setGeometry(geo);
	
	var material = new MeshLine.MeshLineMaterial({
		useMap: false,
		color: clr,
		opacity: 1,
		resolution: res,
		sizeAttenuation: true,
		lineWidth: w
	});
	
	var mesh = new THREE.Mesh(g.geometry, material);
	graph.add(mesh);
}

export default (scene, graphData, graphicOptions, camera) => {
	
	const WIDTH = 0.005 * SCALE
	// SET UP AXES
	var graph = new THREE.Object3D();
	scene.add(graph);
 	var line = new THREE.Geometry();

	line.vertices.push( new THREE.Vector3( SCALE, 0, 0) );
	line.vertices.push( new THREE.Vector3( 0, 0, 0) );
	makeLine(line, graphicOptions.color.x, WIDTH, graph);
	
	var line = new THREE.Geometry();
	line.vertices.push( new THREE.Vector3( 0, SCALE, 0) );
	line.vertices.push( new THREE.Vector3( 0, 0, 0) );
	makeLine(line, graphicOptions.color.y, WIDTH, graph);
	
	var line = new THREE.Geometry();
	line.vertices.push( new THREE.Vector3( 0, 0, -1 * SCALE) );
	line.vertices.push( new THREE.Vector3( 0, 0, 0) );
	makeLine(line, graphicOptions.color.z, WIDTH, graph);

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
					color: graphicOptions.color.x
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
					color: graphicOptions.color.y
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
					color: graphicOptions.color.z
				}
			default:
				return null;
		}
	}

	if (graphicOptions.axesLabels) {
		Object.keys(axes).forEach(axisKey => {
			const axis = axes[axisKey];
			switch(axis.type) {
				case 'date':
					for (let i = 0; i <= axis.max - axis.min; i += (axis.max - axis.min)/10) {
						const per = i/(axis.max - axis.min);
						const textOffset = offsetText(axisKey, per);
						const tickInfo = offsetTick(axisKey, per);
						var line = new THREE.Geometry();
						line.vertices.push(new THREE.Vector3(tickInfo.from.x, tickInfo.from.y, tickInfo.from.z));
						line.vertices.push(new THREE.Vector3(tickInfo.to.x, tickInfo.to.y, tickInfo.to.z));
						makeLine(line, tickInfo.color, WIDTH, graph);
						makeText(scene, new Date(i + axis.min).toLocaleDateString(), graphicOptions.color.background === 'white' ? '#000000' : '#FFFFFF' , 0.015 * SCALE, textOffset.x, textOffset.y, textOffset.z);
					}
				break;
				case 'number':
					for (let i = 0; i <= axis.max - axis.min; i += (axis.max - axis.min)/10) {
						const per = i/(axis.max - axis.min);
						const textOffset = offsetText(axisKey, per);
						const tickInfo = offsetTick(axisKey, per);
						var line = new THREE.Geometry();
						line.vertices.push(new THREE.Vector3(tickInfo.from.x, tickInfo.from.y, tickInfo.from.z));
						line.vertices.push(new THREE.Vector3(tickInfo.to.x, tickInfo.to.y, tickInfo.to.z));
						makeLine(line, tickInfo.color, WIDTH, graph);
						makeText(scene, String(i + axis.min),  graphicOptions.color.background === 'white' ? '#000000' : '#FFFFFF', 0.015 * SCALE, textOffset.x, textOffset.y, textOffset.z);
					}
					break;
				case 'string':
					const incrementAmount = axis.max >= 10 ? (axis.max - (axis.max % 10)) / 10 : 1;
					const incrementTo = axis.max >= 10 ?  axis.max - (axis.max % 10) : axis.max;
					for (let i = 0; i < incrementTo; i+=incrementAmount) {
						const per = i/incrementTo;
						const textOffset = offsetText(axisKey, per);
						const tickInfo = offsetTick(axisKey, per);
						var line = new THREE.Geometry();
						line.vertices.push(new THREE.Vector3(tickInfo.from.x, tickInfo.from.y, tickInfo.from.z));
						line.vertices.push(new THREE.Vector3(tickInfo.to.x, tickInfo.to.y, tickInfo.to.z));
						makeLine(line, tickInfo.color, WIDTH, graph)
						makeText(scene, axis.indices[i],  graphicOptions.color.background === 'white' ? '#000000' : '#FFFFFF', 0.015 * SCALE, textOffset.x, textOffset.y, textOffset.z);
					}
			}
		});
	}
	
	if (graphicOptions.axesNames) {
		makeText(scene, graphData.xColumn.name, graphicOptions.color.background === 'white' ? '#000000' : '#FFFFFF', .03 * SCALE, SCALE/2, 0, SCALE/5);
		makeText(scene, graphData.yColumn.name, graphicOptions.color.background === 'white' ? '#000000' : '#FFFFFF', .03 * SCALE, -SCALE/5, SCALE/2, SCALE/5);
		makeText(scene, graphData.zColumn.name, graphicOptions.color.background === 'white' ? '#000000' : '#FFFFFF', .03 * SCALE, -SCALE/5, 0, -SCALE/2);
	}
	// END OF AXES
	

	// START OF GRAPH DATA
	
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
	
  var group = new THREE.Object3D();
	
	if (graphicOptions.visualization === 'cloud') {
		function makeBlob(group, clr, x, y, z){
			// POINT CLOUD
			const sphereGeom = new THREE.SphereGeometry(50, 50, 50);
			var material = new THREE.ShaderMaterial( 
			{
				uniforms: 
				{ 
					"c":   { type: "f", value: 0.0 },
					"p":   { type: "f", value: 6.0},
					glowColor: { type: "c", value: new THREE.Color(clr) },
					viewVector: { type: "v3", value: camera.position }
				},
				vertexShader:  `
					uniform vec3 viewVector;
					uniform float c;
					uniform float p;
					varying float intensity;
					void main() 
					{
						vec3 vNormal = normalize( normalMatrix * normal );
						vec3 vNormel = normalize( normalMatrix * viewVector );
						intensity = pow( c - dot(vNormal, vNormel), p );
						
						gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
					}
				`,
				fragmentShader: `
					uniform vec3 glowColor;
					varying float intensity;
					void main() 
					{
						vec3 glow = glowColor * intensity;
						gl_FragColor = vec4( glow, 1.0 );
					}
				`,
				side: THREE.BackSide,
				blending: THREE.AdditiveBlending,
				transparent: true
			}   );
			var moonGlow = new THREE.Mesh( sphereGeom, material );
			moonGlow.position.set(x, y, z);
			group.add(moonGlow)
		}

		//graph blob
		graphData.data.forEach((value) => {
			makeBlob(group, graphicOptions.color.d, formatX(value.x), formatY(value.y), formatZ(value.z));
		});
			  
		scene.add( group );
	} else if (graphicOptions.visualization === 'linechart') {
		//Graph linechart
		graphData.data.forEach(value => {
			line.vertices.push( new THREE.Vector3( formatX(value.x), formatY(value.y), formatZ(value.z)) );
		});
		makeLine(line, graphicOptions.color.d, WIDTH, graph);
	} else if (graphicOptions.visualization === 'cluster') {
		//Graph Branch
		graphData.data.forEach(point => {
			const minDistancePoints = [];
			var pointA = new THREE.Vector3( formatX(point.x), formatY(point.y), formatZ(point.z));
			graphData.data.forEach(otherPoint => {
				var pointB = new THREE.Vector3( formatX(otherPoint.x), formatY(otherPoint.y), formatZ(otherPoint.z));
				const dist = pointA.distanceTo(pointB);
				const full = 4;
				if (minDistancePoints.length < full) {
					const newMinPoint = { x: pointB.x, y: pointB.y, z: pointB.z, dist }
					minDistancePoints.push(newMinPoint);
				} else if (minDistancePoints.some(currentMin => dist < currentMin.dist)) {
					const newMinPoint = { x: pointB.x, y: pointB.y, z: pointB.z, dist }
					minDistancePoints.push(newMinPoint);
					minDistancePoints.sort((a, b) => a.dist < b.dist ? -1 : 1);
					minDistancePoints.pop();
				}	
			});
			//draw n lines from 'point' to all points in minDistancePoints
			minDistancePoints.forEach(minPoint => {
				var line = new THREE.Geometry();
				line.vertices.push( new THREE.Vector3( minPoint.x, minPoint.y, minPoint.z));
				line.vertices.push( pointA );
				makeLine(line, graphicOptions.color.d, WIDTH*.5, graph);
			});
		});
	} else {
		//Graph Scatterplot
		  graphData.data.forEach(value => {
			var geometry = new THREE.SphereGeometry( 5, 32, 32 );
			var material = new THREE.MeshBasicMaterial( {color: graphicOptions.color.d } );
			var sphere = new THREE.Mesh( geometry, material );
			sphere.position.set(formatX(value.x), formatY(value.y), formatZ(value.z));
			scene.add( sphere );
		});
	}
	// END OF GRAPH DATA
	
  const speed = 0.02;

	function update(camera) {
		if (graphicOptions.visualization === 'blob') {
			group.traverse(function (node){
				if(node instanceof THREE.Mesh){
				node.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, node.position);
				node.material.uniforms.viewVector.value.needsUpdate = true;
				}
			});
		}
	}
  
  
  return {
    update
  }
}
