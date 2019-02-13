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
    scene.background = new THREE.Color(0x8FBCD4);

    initCamera();
    initControls();
    initLights();
    initMeshes();
    initRenderer();

    renderer.setAnimationLoop(() => {

        update();
        render();

    });

}

function initCamera() {

    camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(-5, 5, 7);

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
    scene.children[TRAIN_INDEX].position.x -= 0.005
    scene.children[TRAIN_INDEX].children[2].rotation.z += 0.005
    scene.children[TRAIN_INDEX].children[3].rotation.z += 0.005
    scene.children[TRAIN_INDEX].children[4].rotation.z += 0.005
    scene.children[TRAIN_INDEX].children[5].rotation.z += 0.005
}

function animateSmoke() {
    var smoke = scene.children[TRAIN_INDEX].children[5];
    smoke.applyMatrix(smoke.matrix.setPosition(1,1,1));
    // smoke.position.y += 0.005
    // smoke.scale.x += 0.005
    // smoke.scale.y += 0.005
    // smoke.scale.z += 0.005
    // if (smoke.position.y >= 5) {
    //     smoke.position.set(-2, 0.9, 0);
    //     smoke.scale.x = 1;
    //     smoke.scale.y = 1;
    //     smoke.scale.z = 1;
    // }
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

window.addEventListener('resize', onWindowResize);

init();
