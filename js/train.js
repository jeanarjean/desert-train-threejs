// these need to be accessed inside more than one function so we'll declare them first
const TRAIN_INDEX = 3;
let container;
let camera;
let controls;
let renderer;
let scene;

function init() {

    container = document.querySelector('#container');

    scene = new THREE.Scene();
    scene.background = new THREE.Color('darksalmon');

    initCamera();
    initControls();
    initLights();
    initMeshes();
    initRenderer();

    //var axesHelper = new THREE.AxesHelper(-40);
    //scene.add(axesHelper);
    //axesHelper = new THREE.AxesHelper(60);
    //scene.add(axesHelper);

    renderer.setAnimationLoop(() => {
        update();
        render();
    });

}

function initCamera() {

    camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(-68, 70, 75);
    camera.lookAt(scene.position)
}

function initControls() {
    controls = new THREE.OrbitControls(camera, container);
}

function initLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 1);
    frontLight.position.set(10, 10, 10);

    const backLight = new THREE.DirectionalLight(0xffffff, 1);
    backLight.position.set(-10, 10, -10);

    scene.add(frontLight, backLight);
}

function initMeshes() {
    initTrainMeshes();
    initTerrainMeshes();
}

function initRenderer() {

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);

    renderer.setPixelRatio(window.devicePixelRatio);

    // add the automatically created <canvas> element to the page
    container.appendChild(renderer.domElement);

}

function update() {
    moveTrain();
    animateSmoke();
}

function moveTrain() {
    var train = scene.children[TRAIN_INDEX];
    train.position.x -= 0.020;
    train.children[2].rotation.z += 0.020;
    train.children[3].rotation.z += 0.020;
    train.children[4].rotation.z += 0.020;
    train.children[5].rotation.z += 0.020;

    if (train.position.x <= -32.5) {
        train.position.x = 32.5;
    }
}

function animateSmoke() {
    var smoke = scene.children[TRAIN_INDEX].children[7];
    //smoke.applyMatrix(smoke.matrix.setPosition(1, 1, 1));
    smoke.position.y += 0.020;
    smoke.scale.x += 0.010;
    smoke.scale.y += 0.010;
    smoke.scale.z += 0.010;
    if (smoke.position.y >= 5) {
        smoke.position.set(-2, 0.9, 0);
        smoke.scale.x = 1;
        smoke.scale.y = 1;
        smoke.scale.z = 1;
    }
}

function render() {

    renderer.render(scene, camera);

}

function onWindowResize() {

    camera.aspect = container.clientWidth / container.clientHeight;

    // update the camera's frustum
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);

}

function initTrainMeshes() {
    // create a Group to hold the pieces of the train
    const train = new THREE.Group();
    scene.add(train);

    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3333, // red
        flatShading: true,
    });

    const detailMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333, // darkgrey
        flatShading: true,
    });

    const smokeMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111, // darkdarkgrey
        flatShading: true,
    });

    const noseGeometry = new THREE.CylinderBufferGeometry(0.75, 0.75, 3, 12);
    const nose = new THREE.Mesh(noseGeometry, bodyMaterial);
    nose.rotation.z = Math.PI / 2;
    nose.position.x = -1;

    const cabinGeometry = new THREE.BoxBufferGeometry(2, 2.25, 1.5);
    const cabin = new THREE.Mesh(cabinGeometry, bodyMaterial);
    cabin.position.set(1.5, 0.4, 0);

    train.add(nose, cabin);

    const wheelGeo = new THREE.CylinderBufferGeometry(0.4, 0.4, 1.75, 16);
    wheelGeo.rotateX(Math.PI / 2);

    const smallWheelRear = new THREE.Mesh(wheelGeo, detailMaterial);
    smallWheelRear.position.set(0, -0.5, 0);

    const smallWheelCenter = smallWheelRear.clone();
    smallWheelCenter.position.x = -1;

    const smallWheelFront = smallWheelRear.clone();
    smallWheelFront.position.x = -2;

    const bigWheel = smallWheelRear.clone();
    bigWheel.scale.set(2, 2, 1.25);
    bigWheel.position.set(1.5, -0.1, 0);

    train.add(smallWheelRear, smallWheelCenter, smallWheelFront, bigWheel);

    const chimneyGeometry = new THREE.CylinderBufferGeometry(0.3, 0.1, 0.5);
    const chimney = new THREE.Mesh(chimneyGeometry, detailMaterial);
    chimney.position.set(-2, 0.9, 0);

    train.add(chimney);

    const smokeGeometry = new THREE.SphereBufferGeometry(0.1, 16, 16);

    const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
    smoke.position.set(-2, 0.9, 0);

    train.add(smoke);
    train.position.y = 1.5;
    train.position.x = 20;
}

function initTerrainMeshes() {
    var shape = new THREE.Shape();
    
    shape.moveTo( -2, -30 );
    shape.lineTo( -2, 30);
    shape.lineTo( 2, 30);
    shape.lineTo( 2, 5);
    shape.bezierCurveTo( -2, 5, -2, -5, 2, -5 );
    shape.lineTo( 2, -30);
    shape.lineTo( 2, -30);
    
    var extrudeSettings = {
        steps: 2,
        depth: 60,
        bevelEnabled: false,
    };

    var groundGeometry = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );
    groundGeometry.rotateZ(Math.PI / 2);

    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xf4b942 }); // sand
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.set(0, -2, -30);
    scene.add(ground);

    const waterGeometry = new THREE.BoxBufferGeometry(10, 3, 59);
    const waterMaterial = new THREE.MeshBasicMaterial({ color: 'skyblue' }); // sand
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.position.set(0, -2.25, 0);
    scene.add(water);

    const trackGeometry = new THREE.BoxBufferGeometry(60.2, 1, 0.5);
    const trackMaterial = new THREE.MeshBasicMaterial({ color: 0x898989 }); // dark grey
    var track1 = new THREE.Mesh(trackGeometry, trackMaterial);
    track1.position.x = -0.5;
    track1.position.z = 0.8;
    scene.add(track1);

    var track2 = new THREE.Mesh(trackGeometry, trackMaterial);
    track2.position.x = -0.5;
    track2.position.z = -0.8;
    scene.add(track2);
}

window.addEventListener('resize', onWindowResize);

init();
