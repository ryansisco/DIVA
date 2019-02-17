import * as THREE from 'three';
import * as MeshLine from 'three.meshline';

export default scene => {    
    const group = new THREE.Group();
    
	var res = new THREE.Vector2(window.innerWidth, window.innerHeight);
	var graph = new THREE.Object3D();
	scene.add(graph);
	
	function makeLine( geo, clr ){
		var g = new MeshLine.MeshLine();
		g.setGeometry(geo);
		
		var material = new MeshLine.MeshLineMaterial({
			useMap: false,
			color: new THREE.Color(clr),
			opacity: 1,
			resolution: res,
			sizeAttenuation: !false,
			lineWidth: 1
		});
		
		var mesh = new THREE.Mesh(g.geometry, material);
		graph.add(mesh);
	}
	
	var line = new THREE.Geometry();
	line.vertices.push( new THREE.Vector3( -31, -30, -30) );
	line.vertices.push( new THREE.Vector3( 30, -30, -30) );
	makeLine(line, #ff0000)
	
	var line = new THREE.Geometry();
	line.vertices.push( new THREE.Vector3( -30, -31, -30) );
	line.vertices.push( new THREE.Vector3( -30, 30, -30) );
	makeLine(line, #00ff00)
	
	var line = new THREE.Geometry();
	line.vertices.push( new THREE.Vector3( -30, -30, -29) );
	line.vertices.push( new THREE.Vector3( -30, -30, -90) );
	makeLine(line, #0000ff)
	
    const speed = 0.02;

    function update(time) {
    }

    return {
        update
    }
}
