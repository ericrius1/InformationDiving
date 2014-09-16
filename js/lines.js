function Lines() {

  var colorPalette = [0xfeee40, 0x17a1d2, 0xf22a5b, 0x9f0a5c];
  var strands = []
  var curVertexIndex = 0;
  var curStrandIndex = 0;
  var curColor = _.sample(colorPalette);
  var activeAttribute;



  // var material = new THREE.LineBasicMaterial({
  //   vertexColors: THREE.VertexColors,

  // activeAttribute = strands[0].material.attributes;

  setTimeout(function(){
    drawStrands() 
  }, 1000)

  function drawStrands(){
    //get cam direction
    var t = (G.time % G.looptime) / G.looptime
    var pos = G.pathGeo.parameters.path.getPointAt((t + 30 / G.pathGeo.parameters.path.getLength()) % 1).multiplyScalar( G.ringScale );
    var surface
    lineGeo = new THREE.Geometry()
    lineMat = new THREE.LineBasicMaterial({

    })
    var dir = new THREE.Vector3().add(pos)
    var newPos = new THREE.Vector3().addVectors(dir, pos).normalize().multiplyScalar(1110)
    var pos1 = new THREE.Vector3(pos.x, pos.y - 50, pos.z)
    var pos2 = new THREE.Vector3(pos.x, pos.y + 50, pos.z)
    var dirVec1 = new THREE.Vector3().sub(pos1).normalize().multiplyScalar(100)
    var dirVec2 = new THREE.Vector3().sub(pos2).normalize().multiplyScalar(100)

    var pos1a = new THREE.Vector3().addVectors(pos1, dirVec1)
    var pos2a = new THREE.Vector3().addVectors(pos2, dirVec2)
    var SUBDIVISIONS = 200;
    var geometry = new THREE.Geometry()
    var curve = new THREE.QuadraticBezierCurve3();

    curve.v0 = pos1a;
    curve.v1 = newPos;
    curve.v2 = pos2a;
    for(var j = 0; j < SUBDIVISIONS; j++){
      geometry.vertices.push(curve.getPoint(j/SUBDIVISIONS))
    }
    var line = new THREE.Line(geometry)
    G.scene.add(line)




    setTimeout(function(){
      drawStrands()
    }, 500)


  }


  this.update = function() {
  //   if(curStrandIndex === strands.length){
  //     return;
  //   }

  //   activeAttribute.opacity.value[curVertexIndex++] = 1.0;
  //   activeAttribute.opacity.needsUpdate = true;
    
  //   //Were done growing this strand, move onto the next one
  //   if (curVertexIndex === strand.geometry.vertices.length) {
  //     curVertexIndex = 0;
  //     activeAttribute = strands[++curStrandIndex].material.attributes;
  //   }
  //   strands[curStrandIndex].geometry.colorsNeedUpdate = true;
  }


}