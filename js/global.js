var G = {}

G.texturesToLoad = [
  ['ubuntuMono', 'img/ubuntuMono.png']
]

G.TEXTURES = {};

G.shaders = new ShaderLoader('shaders')
G.loader = new Loader()

G.loader.onStart = function(){

  G.init()
  G.animate()
}

G.w = window.innerWidth;
G.h = window.innerHeight;
G.position = new THREE.Vector3()
G.windowSize = new THREE.Vector2(G.w, G.h);
G.camera = new THREE.PerspectiveCamera(45, G.w/G.h, 1, 10000);
G.camera.position.z = 50
G.scene = new THREE.Scene();
G.renderer = new THREE.WebGLRenderer();
G.clock = new THREE.Clock();
G.controls = new THREE.OrbitControls(G.camera);
G.stats = new Stats();
G.rf = THREE.Math.randFloat;

// Align top-left
G.stats.domElement.style.position = 'absolute';
G.stats.domElement.style.left = '0px';
G.stats.domElement.style.top = '0px';

document.body.appendChild( G.stats.domElement );

G.container = document.getElementById('container');

G.lines = new Lines()

G.dT    =   { type: 'f', value: 0 }  
G.timer =   { type: 'f', value: 0 }                         
G.dpr   =   {type: 'f', value: window.devicePixelRatio || 1 }

G.renderer.setSize(G.w, G.h);
G.container.appendChild(G.renderer.domElement)


G.startArray = [];

G.init = function(){



  this.text = new TextParticles({
    vertexShader: this.shaders.vs.text,
    fragmentShader: this.shaders.fs.text,
    lineLength: 120,
    lineHeight: 2,
    letterWidth:2
  });

  // this.scene.add(this.text.createTextParticles("Hello"));

}



G.animate = function(){
  this.dT.value = this.clock.getDelta();
  this.timer.value += this.dT.value
  this.controls.update()
  this.renderer.render(this.scene, this.camera);
  this.stats.update()
  requestAnimationFrame(this.animate.bind(this));

}

G.loadTextures = function(){
  for(var i = 0; i < G.texturesToLoad.length; i++){
    var t = G.texturesToLoad[i];
    this.loadTexture(t[0], t[1]);
  }
}

G.loadTexture = function(name, file){
  var cb = function(){
    this.loader.onLoad();
  }.bind(this);

  var m = THREE.UVMapping;
  var l = THREE.ImageUtils.loadTexture;

  G.loader.addLoad();
  G.TEXTURES[name] = l(file, m, cb);
  G.TEXTURES[ name ].wrapS = THREE.RepeatWrapping;
  G.TEXTURES[ name ].wrapT = THREE.RepeatWrapping;
}
