var G = {}

G.shaders = new ShaderLoader('shaders')
G.loader = new Loader()

G.loader.onStart = function(){
  console.log('yar')
  G.init()
}

G.w = window.innerWidth;
G.h = window.innerHeight;
G.camera = new THREE.PerspectiveCamera(45, G.w/G.h, 1, 10000);
G.scene = new THREE.Scene();
G.renderer = new THREE.WebGLRenderer();
G.clock = new THREE.Clock();


G.renderer.setSize(G.w, G.h);

G.init = function(){
  console.log('yar')
}

G.animate = function(){
  this.renderer.render(this.scene, this.camera);
  requestAnimationFrame(this.animate.bind(this));

}
