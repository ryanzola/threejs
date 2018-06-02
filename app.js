'use strict';

const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);


// We'll define a Decoration, which is just a THREE.Group with some cusomtisation
var Decoration = function() {

  // Run the Group constructor with the given arguments
  THREE.Group.apply(this, arguments);

  this.rotationSpeed = Math.random() * 0.02 + 0.005;
  this.rotationPosition = Math.random();

  // A random color assignment
  var colors = ['#ff0051', '#f56762','#a53c6c','#f19fa0','#72bdbf','#47689b'];

  // The main bauble is an Octahedron
  var bauble = new THREE.Mesh(
    addNoise(new THREE.OctahedronGeometry(12,1), 2),
    new THREE.MeshStandardMaterial( {
      color: colors[Math.floor(Math.random()*colors.length)],
      flatShading: true,
      metalness: 0,
      roughness: 0.8,
      refractionRatio: 0.25
    })
  );
  bauble.castShadow = true;
  bauble.receiveShadow = true;
  bauble.rotateZ(Math.random()*Math.PI*2);
  bauble.rotateY(Math.random()*Math.PI*2);
  this.add(bauble);

  // A cylinder to represent the top attachement
  var shapeOne = new THREE.Mesh(
    addNoise(new THREE.CylinderGeometry(4, 6, 10, 6, 1), 0.5),
    new THREE.MeshStandardMaterial( {
      color: 0xf8db08,
      flatShading: true,
      metalness: 0,
      roughness: 0.8,
      refractionRatio: 0.25
    })
  );
  shapeOne.position.y += 8;
  shapeOne.castShadow = true;
  shapeOne.receiveShadow = true;
  this.add(shapeOne);

  // A Torus to represent the top hook
  var shapeTwo = new THREE.Mesh(
    addNoise(new THREE.TorusGeometry( 2,1, 6, 4, Math.PI), 0.2),
    new THREE.MeshStandardMaterial( {
      color: 0xf8db08,
      flatShading: true,
      metalness: 0,
      roughness: 0.8,
      refractionRatio: 0.25
    })
  );
  shapeTwo.position.y += 13;
  shapeTwo.castShadow = true;
  shapeTwo.receiveShadow = true;
  this.add(shapeTwo);

};
Decoration.prototype = Object.create(THREE.Group.prototype);
Decoration.prototype.constructor = Decoration;
Decoration.prototype.updatePosition = function() {
  this.rotationPosition += this.rotationSpeed;
  this.rotation.y = (Math.sin(this.rotationPosition));
};



// Create a scene which will hold all our meshes to be rendered
var scene = new THREE.Scene();

// Create and position a camera
var camera = new THREE.PerspectiveCamera(
  60,                                   // Field of view
  window.innerWidth/window.innerHeight, // Aspect ratio
  0.1,                                  // Near clipping pane
  1000                                  // Far clipping pane
);

// Reposition the camera
camera.position.set(-100,100,50);

// Point the camera at a given coordinate
camera.lookAt(new THREE.Vector3(0,15,0));

// Create a renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });

// Size should be the same as the window
renderer.setSize( window.innerWidth, window.innerHeight );

// Set a near white clear color (default is black)
renderer.setClearColor( 0xfff6e6 );

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

// Append to the document
document.body.appendChild( renderer.domElement );

// Add an ambient lights
var ambientLight = new THREE.AmbientLight( 0xffffff, 0.3 );
scene.add( ambientLight );

// Add a point light that will cast shadows
var pointLight = new THREE.PointLight( 0xffffff, 1 );
pointLight.position.set( 25, 50, 25 );
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
scene.add( pointLight );

var underFloor = new THREE.Mesh(
  new THREE.BoxGeometry(308, 2, 308),
  new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.8 }),
  new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.5 })
);
underFloor.position.y -= 1;
scene.add(underFloor);

var wall1 = new THREE.Mesh(
  new THREE.BoxGeometry(308, 2, 308),
  new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.8 }),
  new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.5 })
);
wall1.rotation.x = Math.PI / 2;
wall1.position.y = 308 / 2;
wall1.position.z = 308 / 2;
scene.add(wall1);


var planeGroup = new THREE.Group();

for(var i = 0; i < 9; i++) {
  planeGroup.add(
    new THREE.Mesh(
      new THREE.BoxGeometry(100, 2, 100),
      new THREE.MeshStandardMaterial({ color: 0x002233 }),
      new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.5 })
    )
  );
}

const coords = [-102, 0, 102];
var xIndex = 0;
var zIndex = 0;
planeGroup.children.forEach(function(plane, index) {
  plane.position.x = coords[xIndex];
  plane.position.z = coords[zIndex];
  zIndex++;
  if(index % 3 === 0) {
    xIndex++;
  }

  if(xIndex === 3) {
    xIndex = 0;
  }

  if(zIndex === 3) {
    zIndex = 0;
  }
});

scene.add(planeGroup);


var decorations = [];

// Add some new instances of our decoration
var decoration1 = new Decoration();
decoration1.position.y += 10;
scene.add(decoration1);
decorations.push(decoration1);

var decoration2 = new Decoration();
decoration2.position.set(20,15,-10);
decoration2.scale.set(.8,.8,.8);
scene.add(decoration2);
decorations.push(decoration2);

var decoration3 = new Decoration();
decoration3.position.set(-20,20,-12);
scene.add(decoration3);
decorations.push(decoration3);

var program = function ( context ) {
  context.beginPath();
  context.arc( 0, 0, 0.5, 0, Math.PI * 2, true );
  context.fill();
};

var group = new THREE.Group();
scene.add( group );
for ( var i = 0; i < 1500; i++ ) {
  var material = new THREE.SpriteMaterial( {
    color: Math.random() * 0x808008 + 0x808080,
    lights: true
    
 
  } );
  var particle = new THREE.Sprite( material );
  particle.position.x = Math.random() * 2000 - 1000;
  particle.position.y = Math.random() * 2000 - 1000;
  particle.position.z = Math.random() * 2000 - 1000;
  particle.scale.x = particle.scale.y = Math.random() * 10 + 5;
  group.add( particle );
}

// Render the scene/camera combnation
renderer.render(scene, camera);

// Add an orbit control which allows us to move around the scene. See the three.js example for more details
// https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/OrbitControls.
var controls = new OrbitControls( camera, renderer.domElement );
controls.target = new THREE.Vector3(0,15,0);
controls.maxPolarAngle = Math.PI / 2;

requestAnimationFrame(render);

function render() {
  controls.update();

  // Update the decoration positions
  for(var d = 0; d < decorations.length; d++) {
    decorations[d].updatePosition();
  }

  // Render the scene / camera combination
  renderer.render(scene, camera);

  // Repeat
  requestAnimationFrame(render);
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
