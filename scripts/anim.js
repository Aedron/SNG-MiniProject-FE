
const width = window.innerWidth;
const height = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);

camera.position.set(0, 5, 50);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setClearColor('white');
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.render(scene, camera);


var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2;
// 使动画循环使用时阻尼或自转 意思是否有惯性
controls.enableDamping = true;
//是否可以缩放
controls.enableZoom = true;
//是否自动旋转
controls.autoRotate = true;
controls.target = new THREE.Vector3(0, 0, 0);
controls.addEventListener('change', function() {
    renderer.render(scene, camera);
});


var leaf = new THREE.SphereGeometry(7, 5, 5, 2, 6.3, 0, 3);
var material = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true});
var sphere = new THREE.Mesh(leaf, material);
scene.add(sphere);


var Leaf = function() {
    THREE.Group.apply(this, arguments);

    var leaf = new THREE.Mesh(
        new THREE.TorusGeometry(.8,1.6,3,4),
        new THREE.MeshStandardMaterial({
            color: 0x0b8450,
            shading: THREE.FlatShading ,
            metalness: 0,
            roughness: 0.8,
            refractionRatio: 0.25,
            wireframe: true
        }));
    //leaf.geometry.vertices[4].y -=1;
    leaf.rotateX(Math.random()*Math.PI*2);
    leaf.rotateZ(Math.random()*Math.PI*2);
    leaf.rotateY(Math.random()*Math.PI*2);
    leaf.receiveShadow = true;
    leaf.castShadow = true;

    this.add(leaf);
};

Leaf.prototype = Object.create(THREE.Group.prototype);
Leaf.prototype.constructor = Leaf;
var firstLeaf = new Leaf();
scene.add(firstLeaf);

var inhale = true;

function render() {

    if (sphere) {
        sphere.rotation.x += 0.005;
        sphere.rotation.y += 0.005;
        sphere.rotation.z += 0.005;
    }

    controls.update();

    breathe();

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

let inhaleTime = 0.006;
let exhaleTime = 0.009;

function checkBreath() {
    if (sphere.scale.x >= 2) {
        inhale = false;
    }
    else if (sphere.scale.x <= 0.5) {
        inhale = true;
    }
}

function breathe() {
    checkBreath();

    if (inhale) {
        sphere.scale.x += inhaleTime;
        sphere.scale.y += inhaleTime;
        sphere.scale.z += inhaleTime;
    }

    else if (!inhale) {
        sphere.scale.x -= exhaleTime;
        sphere.scale.y -= exhaleTime;
        sphere.scale.z -= exhaleTime;
    }
}

requestAnimationFrame(render);

document.body.appendChild(renderer.domElement);