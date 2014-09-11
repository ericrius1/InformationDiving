function Lines(){


  this.strandGeometry = new THREE.Geometry();
  var points = createPoints(50)
  for(var i = 0; i < points.length; i++){
    this.strandGeometry.vertices.push(points[i]);
  }

  this.strandGeometry.dynamic = false;
  console.log(this.strandGeometry.dynamic)



  for(var i = 0; i < 2; i++){
   var material = new THREE.LineBasicMaterial({
      color: new THREE.Color().setHSL(G.rf(0,1), 1.0, 0.8),
      linewidth: 3
    });
    var line = new THREE.Line(this.strandGeometry, material);
    line.position.x = i * 20
    line.position.y = i * 10
    line.position.z = -i * 10
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