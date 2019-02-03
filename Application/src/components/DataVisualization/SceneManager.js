import * as THREE from 'three';
import SceneSubject from './SceneSubject';

export default canvas => {


    var mouseDown = 0;
    document.body.onmousedown = function() { 
        mouseDown = 1;
    }
    document.body.onmouseup = function() {
        mouseDown = 0;
    }

    const clock = new THREE.Clock();
    const origin = new THREE.Vector3(10,10,0);

    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }

    const mouse = {
        x: 0,
        y: 0
    }

    
    var cameraMoves = {x:0,y:0,z:-0.1,move:false,speed:0.2};

    const scene = buildScene();
    const renderer = buildRender(screenDimensions);
    const camera = buildCamera(screenDimensions);
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

        camera.position.set(0,0,8);

        return camera;
    }

    function createSceneSubjects(scene) {
        const sceneSubjects = [
            new SceneSubject(scene)
        ];

        return sceneSubjects;
    }

    function update() {
        const elapsedTime = clock.getElapsedTime();

        for(let i=0; i<sceneSubjects.length; i++)
            sceneSubjects[i].update(elapsedTime);

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

    function mouseMove(e) {
        if(mouseDown && e.shiftKey) {
            camera.position.x += Math.max(Math.min((e.clientX - mouse.x) * 0.01, cameraMoves.speed), -cameraMoves.speed);
            camera.position.y += Math.max(Math.min((mouse.y - e.clientY) * 0.01, cameraMoves.speed), -cameraMoves.speed);

            console.log(mouse.x);
        
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }
    }
    window.addEventListener('mousemove', mouseMove);

    return {
        update,
        onWindowResize
    }
}