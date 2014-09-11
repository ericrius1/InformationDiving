function SplineCamera(){
  var parent = new THREE.Object3D();
  parent.position.y = 100;
  G.splineCamera = new THREE.PerspectiveCamera(84, G.w/G.h, 0.01, 1000);
  parent.add(G.splineCamera);


  var extrudePath = new THREE.SplineCurve3([
    new THREE.Vector3(0,0,0), new THREE.Vector3(-1, 0, -5), new THREE.Vector3(-2, -10)
    ]);

  //path, segments, radius, radialSegments, closed
  var pathGeo = new THREE.TubeGeometry(extrudePath, 100, 2, 12, false);
  var pathMesh = new THREE.Mesh(pathGeo);
  pathMesh.scale.set(10, 10, 10);
  parent.add(pathMesh);

  cameraHelper = new THREE.CameraHelper( G.splineCamera);
  G.scene.add(cameraHelper);




}