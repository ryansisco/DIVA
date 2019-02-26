import * as THREE from 'three';
import * as OrbitControls from 'three-orbitcontrols';
import SceneSubject from './SceneSubject';

export default (canvas, graphData) => {

    const clock = new THREE.Clock();

    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }

    const scene = buildScene();
    const renderer = buildRender(screenDimensions);
    const camera = buildCamera(screenDimensions);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(10,5,0);
    controls.enableKeys;
    renderer.domElement.addEventListener("mouseenter", function(  ) {controls.enabled = true});
    renderer.domElement.addEventListener("mouseout", function(  ) {controls.enabled = false});
    const sceneSubjects = createSceneSubjects(scene);

    function buildScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#FFF");

        return scene;
    }

    function buildRender({ width, height }) {
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); 
        const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);

        renderer.gammaInput = true;
        renderer.gammaOutput = true; 

        return renderer;
    }

    function buildCamera({ width, height }) {
        const aspectRatio = width / height;
        const fieldOfView = 60;
        const nearPlane = 4;
        const farPlane = 100; 
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

        camera.position.set(10,5,10);

        return camera;
    }

    function createSceneSubjects(scene) {
        const sceneSubjects = [
            new SceneSubject(scene, graphData)
        ];

        return sceneSubjects;
    }

    function update() {
        const elapsedTime = clock.getElapsedTime();

        for(let i=0; i<sceneSubjects.length; i++)
            sceneSubjects[i].update(elapsedTime);

        controls.update();
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        const { width, height } = canvas;
        
        screenDimensions.width = width;
        screenDimensions.height = height;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
    }

    return {
        update,
        onWindowResize
    }
}
