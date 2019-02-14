export function initTrainMeshes(scene){
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