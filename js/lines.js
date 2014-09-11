function Lines() {

  var colorPalette = [0xfeee40, 0x17a1d2, 0xf22a5b, 0x9f0a5c];
  var strands = []
  var curVertexIndex = 0;
  var curStrandIndex = 0;
  var curColor = _.sample(colorPalette);


  // var material = new THREE.LineBasicMaterial({
  //   vertexColors: THREE.VertexColors,
  //   linewidth: 2,
  // });
  for (var i = 0; i < 100; i++) {

    var strand = createStrand()
    strand.scale.set(G.rf(10, 20), G.rf(40, 50), 1)
    strand.position.z = -i * 5
    strand.position.y = strand.scale.y - 10;
    G.scene.add(strand);
    strands.push(strand);

  }
  // growLine();



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
      transparent: true
    });
    var strandGeometry = new THREE.Geometry();
    var colors = [];
    var points = createPoints(100);
    var opacity = strandMaterial.attributes.opacity.value;
    for (var i = 0; i < points.length; i++) {
      strandGeometry.vertices.push(points[i]);
      opacity[i] = 0.5;
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

  function growLine() {
    if(curStrandIndex === strands.length){
      return;
    }

    strands[curStrandIndex].geometry.colors[curVertexIndex++].setHex(curColor)
    
    //Were done growing this strand, move onto the next one
    if (curVertexIndex === strand.geometry.vertices.length) {
      curVertexIndex = 0;
      curColor = _.sample(colorPalette);
      curStrandIndex++;
    }
    strands[curStrandIndex].geometry.colorsNeedUpdate = true;
    setTimeout(function() {
      growLine()
    }, 10);
  }


}