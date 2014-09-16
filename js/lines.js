function Lines() {

  var colorPalette = [0xfeee40, 0x17a1d2, 0xf22a5b, 0x9f0a5c];
  var strands = []
  var curVertexIndex = 0;
  var curStrandIndex = 0;
  var curColor = _.sample(colorPalette);
  var activeAttribute;



  // var material = new THREE.LineBasicMaterial({
  //   vertexColors: THREE.VertexColors,
  //   linewidth: 2,
  // });
  var strand;
  for (var i = 0; i < 1000; i++) {

    strand = createStrand()
    strand.scale.set(G.rf(10, 20), G.rf(40, 50), 1)
    strand.position.z = -i * 5
    strand.position.y = strand.scale.y - 10;
    G.scene.add(strand);
    strands.push(strand);

  }
  activeAttribute = strands[0].material.attributes;

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
    var pos1 = new THREE.Vector3(pos.x, pos.y + 50, pos.z)
    var pos2 = new THREE.Vector3(pos.x, pos.y - 50, pos.z)
    var dirVec1 = new THREE.Vector3().sub(pos1).normalize().multiplyScalar(50)
    var dirVec2 = new THREE.Vector3().sub(pos2).normalize().multiplyScalar(50)
    // lineGeo.vertices.push(G.splineCamera.position.clone(), pos)

    var pos1a = new THREE.Vector3().addVectors(pos1, dirVec1)
    var pos2a = new THREE.Vector3().addVectors(pos2, dirVec1)
    console.log(pos1a)
    lineGeo.vertices.push(pos1, pos1a)
    lineGeo.vertices.push(pos2, pos2a)
    line = new THREE.Line(lineGeo)
    line.type = THREE.LinePieces;
    G.scene.add(line)


    setTimeout(function(){
      drawStrands()
    }, 500)


  }

  function createStrand() {
    var strandMaterial = new THREE.ShaderMaterial({
      uniforms:{
        color: {type: 'c', value: new THREE.Color(_.sample(colorPalette))}
      },
      attributes: {
        opacity: {type: 'f', value : []}
      },
      vertexShader: G.shaders.vs.strand,
      fragmentShader: G.shaders.fs.strand,
      transparent: true,
      // blending: THREE.AdditiveBlending,
      linewidth: 2.4,
      depthTest: false,
      depthWrite: false
    });
    var strandGeometry = new THREE.Geometry();
    var colors = [];
    var points = createPoints(50);
    var opacity = strandMaterial.attributes.opacity.value;
    for (var i = 0; i < points.length; i++) {
      strandGeometry.vertices.push(points[i]);
      opacity[i] = 0.0;
    }
    strandGeometry.dynamic = false;

    return new THREE.Line(strandGeometry, strandMaterial);

  }

  function createPoints(numPoints) {
    var points = []
    var range = 2;
    var step = 2 / numPoints
    for (var x = -1; x < 1; x += step) {
      var y = -Math.pow(x, 2);
      points.push(new THREE.Vector3(x, y, 0));
    }

    return points;
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