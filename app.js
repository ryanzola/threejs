'use strict';

const THREE = require('three');
//const OrbitControls = require('three-orbit-controls')(THREE);
const PointerControls = require('three-pointer-controls')(THREE);


class Decoration {
  constructor() {
    // Run the Group constructor with the given arguments
    THREE.Group.apply(this, arguments);
    this.rotationSpeed = Math.random() * 0.02 + 0.005;
    this.rotationPosition = Math.random();
    // A random color assignment
    var colors = ['#ff0051', '#f56762', '#a53c6c', '#f19fa0', '#72bdbf', '#47689b'];
    // The main bauble is an Octahedron
    var bauble = new THREE.Mesh(addNoise(new THREE.OctahedronGeometry(12, 1), 2), new THREE.MeshStandardMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
      flatShading: true,
      metalness: 0,
      roughness: 0.8,
      refractionRatio: 0.25
    }));
    bauble.castShadow = true;
    bauble.receiveShadow = true;
    bauble.rotateZ(Math.random() * Math.PI * 2);
    bauble.rotateY(Math.random() * Math.PI * 2);
    this.add(bauble);
    // A cylinder to represent the top attachement
    var shapeOne = new THREE.Mesh(addNoise(new THREE.CylinderGeometry(4, 6, 10, 6, 1), 0.5), new THREE.MeshStandardMaterial({
      color: 0xf8db08,
      flatShading: true,
      metalness: 0,
      roughness: 0.8,
      refractionRatio: 0.25
    }));
    shapeOne.position.y += 8;
    shapeOne.castShadow = true;
    shapeOne.receiveShadow = true;
    this.add(shapeOne);
    // A Torus to represent the top hook
    var shapeTwo = new THREE.Mesh(addNoise(new THREE.TorusGeometry(2, 1, 6, 4, Math.PI), 0.2), new THREE.MeshStandardMaterial({
      color: 0xf8db08,
      flatShading: true,
      metalness: 0,
      roughness: 0.8,
      refractionRatio: 0.25
    }));
    shapeTwo.position.y += 13;
    shapeTwo.castShadow = true;
    shapeTwo.receiveShadow = true;
    this.add(shapeTwo);
  }
  updatePosition() {
    this.rotationPosition += this.rotationSpeed;
    this.rotation.y = (Math.sin(this.rotationPosition));
  }
}
Decoration.prototype = Object.create(THREE.Group.prototype);
Decoration.prototype.constructor = Decoration;


// Create a scene which will hold all our meshes to be rendered
var scene = new THREE.Scene();
scene.fog = new THREE.Fog( 0x002233, 0, 1000 );

// Create and position a camera
var camera = new THREE.PerspectiveCamera(
  60,                                   // Field of view
  window.innerWidth/window.innerHeight, // Aspect ratio
  0.1,                                  // Near clipping pane
  2000                                  // Far clipping pane
);

// Reposition the camera
camera.position.set(0, 100, -100);
camera.lookAt(new THREE.Vector3(0, 100, 0));

// Create a renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });

// Size should be the same as the window
renderer.setSize( window.innerWidth, window.innerHeight );

// Set a near white clear color (default is black)
renderer.setClearColor( 0x52ffd8 );

// Enable shadow mapping
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

window.addEventListener('resize', () => {
  let width = window.innerWidth;
  let height = window.innerHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

document.addEventListener('keydown', keyboard, false);

function keyboard() {
  var speed = 20;
  // the camera shouldnt be moving, the camera should be following an object that is moving
  if (event.keyCode === 37) {
    cube.position.x += speed;
    camera.position.x += speed;
  }
  if (event.keyCode === 39) {
    cube.position.x -= speed;
    camera.position.x -= speed;
  }
  if (event.keyCode === 40) {
    cube.position.z -= speed;
    camera.position.z -= speed;
  }
  if (event.keyCode === 38) {
    cube.position.z += speed;
    camera.position.z += speed;
  }

  camera.lookAt(cube.position);
}

// Append to the document
document.body.appendChild( renderer.domElement );

createLights();

makeGrid(17, 64, 2, 0x002233);

// var program = function ( context ) {
//   context.beginPath();
//   context.arc( 0, 0, 0.5, 0, Math.PI * 2, true );
//   context.fill();
// };

var group = new THREE.Group();
scene.add( group );
for ( var i = 0; i < 1500; i++ ) {
  var material = new THREE.SpriteMaterial( {
    //color: Math.random() * 0x808008 + 0x808080,
    color: 0xffffff,
    lights: true 
  });
  var particle = new THREE.Sprite( material );
  particle.position.x = Math.random() * 2000 - 1000;
  particle.position.y = Math.random() * 2000 - 1000;
  particle.position.z = Math.random() * 2000 - 1000;
  particle.scale.x = particle.scale.y = Math.random() * 4 + 1;
  group.add( particle );
}

class Pixel {
  constructor(x = 0, y = 0, z = 0, color = 0xffffff) {
    // Run the Group constructor with the given arguments
    THREE.Group.apply(this, arguments);
    this.x = x;
    this.y = y;
    this.z = z;
    this.color = color;
    var cube = new THREE.Mesh(
      new THREE.BoxGeometry(20,20, 20),
      new THREE.MeshStandardMaterial({
        color: this.color, 
        opacity: 0.5,
        premultipliedAlpha: true,
        transparent: true,
        roughness: 0,
        metalness: 0.5
      }),
      new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.5 })
    );

    var geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
    var edges = new THREE.EdgesGeometry(geometry);
    var line = new THREE.LineSegments(edges, 
      new THREE.LineBasicMaterial({color: 0x000000})
    );

    var cubeGroup = new THREE.Group();
    cubeGroup.add(cube);
    cubeGroup.add(line);
    cubeGroup.castShadow = true;
    cubeGroup.receiveShadow = true;
    cubeGroup.position.x += this.x;
    cubeGroup.position.y += this.y;
    cubeGroup.position.z += this.z;
    this.add(cubeGroup);
  }
}
Pixel.prototype = Object.create(THREE.Group.prototype);
Pixel.prototype.constructor = Pixel;

var skyBoxGeometry = new THREE.SphereGeometry(600, 200, 200);
var skyBoxMaterials = new THREE.MeshStandardMaterial({
  color: 0xffffff, 
  opacity: 0.5,
  premultipliedAlpha: true,
  transparent: true,
  roughness: 0,
  metalness: 0.5
});
var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterials);
scene.add(skyBox);


var  cube = new THREE.Mesh(
  new THREE.SphereGeometry(10, 10, 10),
  new THREE.MeshStandardMaterial({color: 0xff00ff})
);
cube.castShadow = true;
cube.position.set(0, 65, 0);

scene.add(cube);
// var frame = new THREE.Mesh(
//   new THREE.BoxGeometry(20,20, 20),
//   new THREE.MeshStandardMaterial( {
//     color: 0x000000,
//     wireframe: true,
//     wireframeLinejoin: 'miter'
//   })
// );

// Render the scene/camera combnation
renderer.render(scene, camera);

// Add an orbit control which allows us to move around the scene. See the three.js example for more details
// https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/OrbitControls.
//var controls = new OrbitControls( camera, renderer.domElement );
//controls.target = new THREE.Vector3(0,15,0);
//controls.maxPolarAngle = Math.PI / 2;
//controls.autoRotate = true;

var controls = new PointerControls();
controls.control(camera);
controls.listenTo(renderer.domElement);


requestAnimationFrame(render);

function render() {
  controls.update();

  camera.lookAt(cube.position);
  // Render the scene / camera combination
  renderer.render(scene, camera);

  // Repeat
  requestAnimationFrame(render);
}


function makeGrid(gridSize, tileSize, separator, color) {
  const tileGroup = new THREE.Group();
  for(var i = 0; i < Math.pow(gridSize, 2); i++) {
    tileGroup.add(
      new THREE.Mesh(
        new THREE.BoxGeometry(tileSize, 2, tileSize),
        new THREE.MeshStandardMaterial({ color: color }),
        new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.5 })
      )
    );
  }
  var multiplier = Math.floor(gridSize/2) * -1;
  const coords = [];

  for(var j = multiplier; j <= Math.floor(gridSize/2); j++) {
    coords.push((tileSize + separator) * j);
  }

  var xIndex = 0;
  var zIndex = 0;

  tileGroup.children.forEach(function(tile, index) {
    tile.position.x = coords[xIndex];
    tile.position.z = coords[zIndex];
    zIndex++;
    if(index % (gridSize) === 0) {
      xIndex++;
    }

    if(xIndex === gridSize) {
      xIndex = 0;
    }

    if(zIndex === gridSize) {
      zIndex = 0;
    }
  });

  //Generate the underfloor
  const floorSize = (tileSize + separator) * (coords.length);
  var underFloor = new THREE.Mesh(
    new THREE.BoxGeometry(floorSize, 2, floorSize),
    new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.8 }),
    new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.5 })
  );

  underFloor.position.y -= 3;
  tileGroup.position.y -= 2;
  scene.add(underFloor);

  scene.add(tileGroup);
}

function createLights() {
  // Add an ambient lights
  var ambientLight = new THREE.AmbientLight( 0xffffff, 0.3 );
  scene.add( ambientLight );

  var pointLightGroup = new THREE.Group();
  // Add a point light that will cast shadows
  var pointLight = new THREE.PointLight( 0xffffff, 1 );
  pointLight.position.set( 0, 200, 0 );
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 1024;
  pointLight.shadow.mapSize.height = 1024;
  pointLightGroup.add( pointLight );

  var pointLight2 = new THREE.PointLight( 0xffffff, 0.2 );
  pointLight2.position.set( 528, 50, 528 );
  pointLight2.castShadow = true;
  pointLight2.shadow.mapSize.width = 1024;
  pointLight2.shadow.mapSize.height = 1024;
  pointLightGroup.add( pointLight2 );

  var pointLight3 = new THREE.PointLight( 0xffffff, 0.2 );
  pointLight3.position.set( -528, 50, -528 );
  pointLight3.castShadow = true;
  pointLight3.shadow.mapSize.width = 1024;
  pointLight3.shadow.mapSize.height = 1024;
  pointLightGroup.add( pointLight3 );

  var pointLight4 = new THREE.PointLight( 0xffffff, 0.2 );
  pointLight4.position.set( 528, 50, -528 );
  pointLight4.castShadow = true;
  pointLight4.shadow.mapSize.width = 1024;
  pointLight4.shadow.mapSize.height = 1024;
  pointLightGroup.add( pointLight4 );

  var pointLight5 = new THREE.PointLight( 0xffffff, 0.2 );
  pointLight5.position.set( -528, 50, 528 );
  pointLight5.castShadow = true;
  pointLight5.shadow.mapSize.width = 1024;
  pointLight5.shadow.mapSize.height = 1024;
  pointLightGroup.add( pointLight5 );

  scene.add(pointLightGroup);
}

/**
* Helper function to add random noise to geometry vertixes
*
* @param geometry The geometry to alter
* @param noiseX Amount of noise on the X axis
* @param noiseY Amount of noise on the Y axis
* @param noiseZ Amount of noise on the Z axis
* @returns the geometry object
*/
function addNoise(geometry, noiseX, noiseY, noiseZ) {

  noiseX = noiseX || 2;
  noiseY = noiseY || noiseX;
  noiseZ = noiseZ || noiseY;

  // loop through each vertix in the geometry and move it randomly
  for(var i = 0; i < geometry.vertices.length; i++){
    var v = geometry.vertices[i];
    v.x += -noiseX / 2 + Math.random() * noiseX;
    v.y += -noiseY / 2 + Math.random() * noiseY;
    v.z += -noiseZ / 2 + Math.random() * noiseZ;
  }

  return geometry;
}
