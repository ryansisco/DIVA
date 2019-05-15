import * as THREE from 'three';
import * as MeshLine from 'three.meshline';
import * as TextSprite from 'three.textsprite';
import { SCALE } from './SceneManager';

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

export default (scene, graphData, camera) => {
	
	const WIDTH = 0.005 * SCALE
	const blobRadius = 50;
	const sphereRadius = 5;
	const sphereSegment = 32;
	const pink = 0xff00ff;
	const white = 0xffffff;
	// SET UP AXES
	var res = new THREE.Vector2(window.innerWidth, window.innerHeight);
	var graph = new THREE.Object3D();
	scene.add(graph);
  var line = new THREE.Geometry();
  
  function makeLine( geo, clr, w ){
		var g = new MeshLine.MeshLine();
		g.setGeometry(geo);
		
		var material = new MeshLine.MeshLineMaterial({
			useMap: false,
			color: new THREE.Color(clr),
			opacity: 1,
			resolution: res,
			sizeAttenuation: true,
			lineWidth: w
		});
		
		var mesh = new THREE.Mesh(g.geometry, material);
		graph.add(mesh);
  }
  
	line.vertices.push( new THREE.Vector3( SCALE, 0, 0) );
	line.vertices.push( new THREE.Vector3( 0, 0, 0) );
	makeLine(line, '#ff0000', WIDTH);
	
	var line = new THREE.Geometry();
	line.vertices.push( new THREE.Vector3( 0, SCALE, 0) );
	line.vertices.push( new THREE.Vector3( 0, 0, 0) );
	makeLine(line, '#00ff00', WIDTH);
	
	var line = new THREE.Geometry();
	line.vertices.push( new THREE.Vector3( 0, 0, -1 * SCALE) );
	line.vertices.push( new THREE.Vector3( 0, 0, 0) );
	makeLine(line, '#0000ff', WIDTH);

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
					makeLine(line, tickInfo.color, WIDTH);
					makeText(scene, String(i + axis.min), white,0.015 * SCALE, textOffset.x, textOffset.y, textOffset.z);
				}
				break;
			case 'string':
				for (let i = 0; i <= axis.max; i++) {
					const per = i/axis.max;
					const textOffset = offsetText(axisKey, per);
					const tickInfo = offsetTick(axisKey, per);
					var line = new THREE.Geometry();
					line.vertices.push(new THREE.Vector3(tickInfo.from.x, tickInfo.from.y, tickInfo.from.z));
					line.vertices.push(new THREE.Vector3(tickInfo.to.x, tickInfo.to.y, tickInfo.to.z));
					makeLine(line, tickInfo.color, WIDTH)
					makeText(scene, axis.indices[i], white, 0.015 * SCALE, textOffset.x, textOffset.y, textOffset.z);
				}
		}
	});
	
	
	makeText(scene, graphData.xColumn.name, white, .03 * SCALE, SCALE/2, 0, SCALE/5);
	makeText(scene, graphData.yColumn.name, white, .03 * SCALE, -SCALE/5, SCALE/2, SCALE/5);
	makeText(scene, graphData.zColumn.name, white, .03 * SCALE, -SCALE/5, 0, -SCALE/2);
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
  
  function makeBlob(group, r, clr, x, y, z){
	// POINT CLOUD
	const sphereGeom = new THREE.SphereGeometry(r, 50, 50);
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
  
  
  //Graph Blob
  /*graphData.data.forEach((value) => {
	makeBlob(group, blobRadius, pink, formatX(value.x), formatY(value.y), formatZ(value.z));
  });
  	
  scene.add( group );*/

	//Graph Scatterplot
  	/*graphData.data.forEach(value => {
		var geometry = new THREE.SphereGeometry( sphereRadius, sphereSegment, sphereSegment );
		var material = new THREE.MeshBasicMaterial( {color: pink} );
		var sphere = new THREE.Mesh( geometry, material );
		sphere.position.set(formatX(value.x), formatY(value.y), formatZ(value.z));
		scene.add( sphere );
	});*/
  
  //Graph linechart
   /*var line = new THREE.Geometry();
   	graphData.data.forEach(value => {
		line.vertices.push( new THREE.Vector3( formatX(value.x), formatY(value.y), formatZ(value.z)) );
	});
	makeLine(line, pink, WIDTH);*/

  //Graph Branch
   	graphData.data.forEach(point => {
		const minDistancePoints = [];
		const minDistance = [];
		graphData.data.forEach(otherPoint => {
			// calc dist between point and otherPoint. Scale them using formatX, formatY, and formatZ
			// const dist = distBetween(point, otherPoint)
			// if dist between point and otherPoint is less than any in minDistancePoints
			//   create new object const otherPointWithDist = { x: otherPoint.x, y: otherPoint.y, z: otherPoint.z, dist }
			//   remove largest point in minDistancePoints if minDistancePoints is "full"
			//   add otherPointWithDist to minDistancePoints array
			var pointA = new THREE.Vector3( formatX(point.x), formatY(point.y), formatZ(point.z));
			var pointB = new THREE.Vector3( formatX(otherPoint.x), formatY(otherPoint.y), formatZ(otherPoint.z));
			const dist = pointA.distanceTo(pointB);
			const full = 4;
			if (minDistancePoints.length < full){
				minDistancePoints.push(pointB);
				minDistance.push(dist);
			}
			else{
				if (dist < Math.max(minDistance)){
					minDistance.push(dist);
					minDistancePoints.push(pointB);
					var index = minDistance.indexOf(Math.max(minDistance));
					if (index > -1 && index <= full) {
						minDistance.splice(index, 1);
						minDistancePoints.splice(index,1);
					}			
				}
			}
			
		});
		//draw n lines from 'point' to all points in minDistancePoints
		minDistancePoints.forEach(minPoint => {
			var line = new THREE.Geometry();
			line.vertices.push( new THREE.Vector3( minPoint.x, minPoint.y, minPoint.z));
			line.vertices.push( new THREE.Vector3( formatX(point.x), formatY(point.y), formatZ(point.z)) );
			makeLine(line, pink, WIDTH);
		});
	});

  //Graph low Branch
    /*graphData.data.forEach(value => {
		var line = new THREE.Geometry();
		line.vertices.push( new THREE.Vector3( SCALE/2, SCALE/2, -SCALE/2) );
		line.vertices.push( new THREE.Vector3( formatX(value.x), formatY(value.y), formatZ(value.z)) );
		makeLine(line, pink, WIDTH);
	});*/


  //Graph Everything
  /*graphData.data.forEach(value => {
		makeBlob(group, blobRadius, pink, formatX(value.x), formatY(value.y), formatZ(value.z));
		var geometry = new THREE.SphereGeometry( sphereRadius, sphereSegment, sphereSegment );
		var material = new THREE.MeshBasicMaterial( {color: pink} );
		var sphere = new THREE.Mesh( geometry, material );
		sphere.position.set(formatX(value.x), 0, formatZ(value.z));
		scene.add( sphere );
		var geometry = new THREE.SphereGeometry( sphereRadius, sphereSegment, sphereSegment );
		var material = new THREE.MeshBasicMaterial( {color: pink} );
		var sphere = new THREE.Mesh( geometry, material );
		sphere.position.set(0, formatY(value.y), formatZ(value.z));
		scene.add( sphere );
		var line = new THREE.Geometry();
		line.vertices.push( new THREE.Vector3( 0, formatY(value.y), formatZ(value.z)) );
		line.vertices.push( new THREE.Vector3( formatX(value.x), formatY(value.y), formatZ(value.z)) );
		makeLine(line, white, .1*WIDTH);
		var line = new THREE.Geometry();
		line.vertices.push( new THREE.Vector3( formatX(value.x), 0, formatZ(value.z)) );
		line.vertices.push( new THREE.Vector3( formatX(value.x), formatY(value.y), formatZ(value.z)) );
		makeLine(line, white, .1*WIDTH);
  });
  scene.add(group)*/
	
	// END OF GRAPH DATA	
	
  /*
	function STATE(graphOptions, axes, clr, bg, width){
		Enter vis here
		case
	}
  */
	
  const speed = 0.02;

  function update(camera) {
	 group.traverse(function (node){
		 if(node instanceof THREE.Mesh){
		   node.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, node.position);
		   node.material.uniforms.viewVector.value.needsUpdate = true;
		 }
	 });
  }
  
  
  return {
    update
  }
}
