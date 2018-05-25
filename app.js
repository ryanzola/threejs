'use strict';

var THREE = require('three');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();


renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor( 0xc586ff );
document.body.appendChild(renderer.domElement);

var ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
scene.add( ambientLight );

var pointLight = new THREE.PointLight( 0xffffff, 1 );
pointLight.position.set( 25, 50, 25 );
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
scene.add( pointLight );

var shadowMaterial = new THREE.ShadowMaterial( { color: 0x000000 } );
shadowMaterial.opacity = 0.2;
var groundMesh = new THREE.Mesh(
  new THREE.BoxGeometry( 100, .1, 100 ),
  shadowMaterial
);
groundMesh.receiveShadow = true;
scene.add( groundMesh );

var shapeOne = new THREE.Mesh(
  new THREE.OctahedronGeometry(20,1),
  new THREE.MeshStandardMaterial( {
    color: 0xc526ff,
    flatShading: true,
    metalness: 0.5,
    roughness: 0
  } )
);
shapeOne.position.y += 10;
shapeOne.rotateZ(Math.PI/3);
shapeOne.castShadow = true;
shapeOne.receiveShadow = true;
scene.add(shapeOne);

// var geometry = new THREE.BoxGeometry(5,5,5);
// var material = new THREE.MeshBasicMaterial({ color: 0x551a8b });
// var cube = new THREE.Mesh(geometry, material);

//scene.add(cube);

// var lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

// var lineGeomery = new THREE.Geometry();
// lineGeomery.vertices.push(new THREE.Vector3(-10, 0, 0 ));
// lineGeomery.vertices.push(new THREE.Vector3(0, 10, 0));
// lineGeomery.vertices.push(new THREE.Vector3(10, 0, 0));
// lineGeomery.vertices.push(new THREE.Vector3(0, -10, 0));
// lineGeomery.vertices.push(new THREE.Vector3(-10, 0, 0 ));

// var line = new THREE.Line(lineGeomery, lineMaterial);
// scene.add(line);



camera.position.set(0, 30, 50);
camera.lookAt(new THREE.Vector3(0, 15, 0));

function animate() {
  requestAnimationFrame(animate);

  shapeOne.rotation.x += 0.01;
  shapeOne.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();