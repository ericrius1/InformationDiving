var G = {}

G.texturesToLoad = [
  ['ubuntuMono', 'img/ubuntuMono.png']
]

G.TEXTURES = {};

G.shaders = new ShaderLoader('shaders')
G.loader = new Loader()

G.loader.onStart = function() {
  this.onResize();
  this.init()
  this.animate()
}.bind(G);

G.w = window.innerWidth;
G.h = window.innerHeight;
G.ratio = G.w / G.h;
G.position = new THREE.Vector3()
G.windowSize = new THREE.Vector2(G.w, G.h);
G.camera = new THREE.PerspectiveCamera(45, G.w / G.h, 1, 10000);
G.camera.position.z = 50
G.scene = new THREE.Scene();
G.renderer = new THREE.WebGLRenderer();
G.clock = new THREE.Clock();
// G.controls = new THREE.OrbitControls(G.camera);
G.stats = new Stats();
G.gui = new dat.GUI();
G.rf = THREE.Math.randFloat;

// Align top-left
G.stats.domElement.style.position = 'absolute';
G.stats.domElement.style.left = '0px';
G.stats.domElement.style.top = '0px';

document.body.appendChild(G.stats.domElement);
G.container = document.getElementById('container');
//POST PROCESSING
G.renderer.autoClear = false;
G.renderModel = new THREE.RenderPass(G.scene, G.camera);
G.effectBloom = new THREE.BloomPass(1);
G.effectCopy = new THREE.ShaderPass(THREE.CopyShader);
G.effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
G.effectFXAA.uniforms['resolution'].value.set(1 / G.w, 1 / G.h);
G.effectCopy.renderToScreen = true;

G.composer = new THREE.EffectComposer(G.renderer)
G.composer.addPass(G.renderModel);
G.composer.addPass(G.effectFXAA);
G.composer.addPass(G.effectBloom);
G.composer.addPass(G.effectCopy);



G.dT = {
  type: 'f',
  value: 0
}
G.timer = {
  type: 'f',
  value: 0
}
G.dpr = {
  type: 'f',
  value: window.devicePixelRatio || 1
}

G.renderer.setSize(G.w, G.h);
G.container.appendChild(G.renderer.domElement)


G.startArray = [];

G.init = function() {


  G.lines = new Lines()

  this.text = new TextParticles({
    vertexShader: this.shaders.vs.text,
    fragmentShader: this.shaders.fs.text,
    lineLength: 120,
    lineHeight: 2,
    letterWidth: 2
  });

  //Skydome
  var skyParams = {
    offset: {
      type: 'f',
      // value: 2111
      value: 2111
    },
    exponent: {
      type: 'f',
      value: 0.13
    }
  }
  var skyGeo = new THREE.SphereGeometry(4000, 64, 64);
  var skyMat = new THREE.ShaderMaterial({
    vertexShader: this.shaders.vs.sky,
    fragmentShader: this.shaders.fs.sky,
    uniforms: {
      topColor: {
        type: 'c',
        value: new THREE.Color(0x000000)
      },
      bottomColor: {
        type: 'c',
        value: new THREE.Color(0x55072f)
      },
      offset: skyParams.offset,
      exponent: skyParams.exponent

    },
    side: THREE.BackSide
  });
  var sky = new THREE.Mesh(skyGeo, skyMat);
  G.scene.add(sky)

  var skyGui = G.gui.addFolder('Sky Params');
  skyGui.add(skyParams.offset, 'value').name('offset');
  skyGui.add(skyParams.exponent, 'value').name('exponent');

  // this.scene.add(this.text.createTextParticles("Hello"));

}



G.animate = function() {
  this.dT.value = this.clock.getDelta();
  this.timer.value += this.dT.value
  // this.controls.update()
  this.stats.update()
  this.camera.position.z -= .1
  requestAnimationFrame(this.animate.bind(this));
  G.renderer.clear();
  G.composer.render();

}

G.loadTextures = function() {
  for (var i = 0; i < G.texturesToLoad.length; i++) {
    var t = G.texturesToLoad[i];
    this.loadTexture(t[0], t[1]);
  }
}

G.loadTexture = function(name, file) {
  var cb = function() {
    this.loader.onLoad();
  }.bind(this);

  var m = THREE.UVMapping;
  var l = THREE.ImageUtils.loadTexture;

  G.loader.addLoad();
  G.TEXTURES[name] = l(file, m, cb);
  G.TEXTURES[name].wrapS = THREE.RepeatWrapping;
  G.TEXTURES[name].wrapT = THREE.RepeatWrapping;
}

G.onResize = function() {
  this.w = window.innerWidth;
  this.h = window.innerHeight;
  this.ratio = this.w / this.h

  this.camera.aspect = this.ratio;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(this.w, this.h);
}

window.addEventListener('resize', G.onResize.bind(G), false);