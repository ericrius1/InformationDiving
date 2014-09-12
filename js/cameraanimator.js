function CameraAnimator(){
  var parent = new THREE.Object3D();
  var lookAhead = true;
  var scale = 10;
  var binormal = new THREE.Vector3();
  var normal = new THREE.Vector3();
  // parent.position.y = 100;
  G.splineCamera = new THREE.PerspectiveCamera(84, G.w/G.h, 0.01, 1000);
  parent.add(G.splineCamera);
  G.scene.add(parent);
  var cameraEye = new THREE.Mesh(new THREE.SphereGeometry(5), new THREE.MeshBasicMaterial({
    color: 0xddddd
  }));
  parent.add(cameraEye);


  var extrudePath = new THREE.SplineCurve3([
    new THREE.Vector3(0,0,0), new THREE.Vector3(-1, 20, -50), new THREE.Vector3(-2, 0, -100)
    ]);

  //path, segments, radius, radialSegments, closed
  var pathGeo = new THREE.TubeGeometry(extrudePath, 100, 2, 12, false);
  var pathMesh = new THREE.Mesh(pathGeo);
  pathMesh.scale.set(scale, scale, scale);
  parent.add(pathMesh);

  cameraHelper = new THREE.CameraHelper( G.splineCamera);
  cameraHelper.visible = false;
  G.scene.add(cameraHelper);


  this.update = function(){
    //Try animate camera along spline
    var time = Date.now();
    var looptime = 20 * 1000;
    var t = (time % looptime) / looptime

    var pos = pathGeo.parameters.path.getPointAt(t);
    pos.multiplyScalar(scale);

    //interpolation
    var segments = pathGeo.tangents.length;
    var pickt = t * segments;
    var pick = Math.floor(pickt);
    var pickNext = (pick + 1) % segments;

    binormal.subVectors(pathGeo.binormals [pickNext], pathGeo.binormals[pick]);
    binormal.multiplyScalar( pickt - pick).add(pathGeo.binormals[pick]);

    var dir = pathGeo.parameters.path.getTangentAt(t);
    var offset = 15;

    normal.copy(binormal).cross(dir);

    //We move on a offset on its binormal
    pos.add(normal.clone().multiplyScalar(offset));

    G.splineCamera.position.copy(pos);
    cameraEye.position.copy ( pos );

    //Use arclength for stabilization in look ahead
    var lookAt = pathGeo.parameters.path.getPointAt(( t + 30 / pathGeo.parameters.path.getLength()) % 1).
      multiplyScalar(scale);

    //Camera orientation 2 - up orientation via normal
    if(!lookAhead){
      lookAt.copy(pos).add(dir);
    }
    G.splineCamera.matrix.lookAt(G.splineCamera.position, lookAt, normal);
    G.splineCamera.rotation.setFromRotationMatrix(G.splineCamera.matrix, G.splineCamera.rotation.order);

    cameraHelper.update();


  }



}