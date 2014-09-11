function Lines(){

  var colorPalette = [0xfeee40, 0x17a1d2, 0xf22a5b];
  this.strandGeometry = new THREE.Geometry();
  var points = createPoints(100)
  for(var i = 0; i < points.length; i++){
    this.strandGeometry.vertices.push(points[i]);
  }

  this.strandGeometry.dynamic = false;
  console.log(this.strandGeometry.dynamic)



  for(var i = 0; i < 100; i++){
   var material = new THREE.LineBasicMaterial({
      color: new THREE.Color(_.sample(colorPalette)),
      linewidth: 2
    });
    var line = new THREE.Line(this.strandGeometry, material);
    line.scale.set(G.rf(10, 20), G.rf(10, 50), 1)
    line.position.set(G.rf(-100, 100), 0, G.rf(-10, 10))
    line.position.y = line.scale.y- 10;
    G.scene.add(line);
    
  }



  function createPoints(numPoints){
    var points = []
    var range = 2;
    var step = 2/numPoints
    for(var x = -1; x < 1; x+=step){
      var y = -Math.pow(x, 2);
      points.push(new THREE.Vector3(x, y, 0));
    }

    return points;
  }



}