//Entry point for app


G.loader.addLoad()

G.shaders.load('vs-text', 'text', 'vertex');
G.shaders.load('fs-text', 'text', 'fragment');
G.shaders.load('ss-text', 'text', 'simulation');

G.loadTextures()

G.shaders.shaderSetLoaded = function(){
  G.loader.onLoad();
}