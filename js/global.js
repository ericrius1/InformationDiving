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
G.camera.position.z = 100
G.scene = new THREE.Scene();
G.renderer = new THREE.WebGLRenderer();
G.clock = new THREE.Clock();

G.container = document.getElementById('container');

G.dT    =   { type: 'f', value: 0 }  
G.timer =   { type: 'f', value: 0 }                         
G.dpr   =   {type: 'f', value: window.devicePixelRatio || 1 }

G.renderer.setSize(G.w, G.h);
G.container.appendChild(G.renderer.domElement)

G.textChunk = [ 'This is a test bitches'].join('\n');

G.startArray = [];

G.init = function(){

  this.text = new TextParticles({
    vertexShader: this.shaders.vs.text,
    fragmentShader: this.shaders.fs.text,
    lineLength: 60
  });

  this.textCreator = new TextCreator(300)
  this.scene.add(this.text.createTextParticles("yo"));
  // this.scene.add(this.text.createDebugMesh());
  // this.scene.add(new THREE.Mesh(new THREE.SphereGeometry(10, 20)));
}



G.animate = function(){
  this.dT.value = this.clock.getDelta();
  this.timer.value += this.dT.value
  this.renderer.render(this.scene, this.camera);
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
