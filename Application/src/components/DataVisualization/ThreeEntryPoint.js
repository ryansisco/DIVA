import SceneManager from './SceneManager';

export default (container, graphData) => {
    let canvas = document.getElementById('visualizer');
    if (!canvas) {
        canvas = createCanvas(document, container);
        canvas.id = 'visualizer';
    }
    const sceneManager = new SceneManager(canvas, graphData);

    let canvasHalfHeight;
    let canvasHalfWidth;

    bindEventListeners();
    render();

    function createCanvas(document, container) {
        const canvas = document.createElement('canvas');     
        container.appendChild(canvas);
        return canvas;
    }

    function bindEventListeners() {
        window.onresize = resizeCanvas;
        resizeCanvas();	
    }

    function resizeCanvas() {        
        canvas.style.width = '100%';
        canvas.style.height= '100%';
        
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        canvasHalfWidth = Math.round(canvas.offsetWidth/2);
        canvasHalfHeight = Math.round(canvas.offsetHeight/2);

        sceneManager.onWindowResize()
    }

    function render(time) {
        requestAnimationFrame(render);
        sceneManager.update();
    }

    return canvas;
}