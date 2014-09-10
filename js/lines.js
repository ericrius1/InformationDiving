function Lines(){


  this.strandGeometry = new THREE.Geometry();
  var points = createPoints(30)
  for(var i = 0; i < points.length; i++){
    this.strandGeometry.vertices.push(points[i]);
  }

  material = new THREE.LineBasicMaterial({
    vertexColors: THREE.VertexColors,
    // lineWidth: 2
  });


  for(var i = 0; i < 2000; i++){
    var line = new THREE.Line(this.strandGeometry);
    line.position.x = G.rf(-20, 20)
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