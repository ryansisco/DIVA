import * as THREE from 'three';

export default scene => {    
    const group = new THREE.Group();

    const xAxisGeometry = new THREE.Geometry();
    const yAxisGeometry = new THREE.Geometry();
    const zAxisGeometry = new THREE.Geometry();

    const xAxisMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    const yAxisMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );
    const zAxisMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );

    xAxisGeometry.vertices.push(new THREE.Vector3(2, 0, 0));
    xAxisGeometry.vertices.push(new THREE.Vector3(0, 0, 0));

    yAxisGeometry.vertices.push(new THREE.Vector3(0, 2, 0));
    yAxisGeometry.vertices.push(new THREE.Vector3(0, 0, 0));

    zAxisGeometry.vertices.push(new THREE.Vector3(0, 0, -2));
    zAxisGeometry.vertices.push(new THREE.Vector3(0, 0, 0));

    const xAxis = new THREE.Line(xAxisGeometry, xAxisMaterial);
    const yAxis = new THREE.Line(yAxisGeometry, yAxisMaterial);
    const zAxis = new THREE.Line(zAxisGeometry, zAxisMaterial);

    scene.add(xAxis);
    scene.add(yAxis);
    scene.add(zAxis);


    const speed = 0.02;

    function update(time) {
    }

    return {
        update
    }
}