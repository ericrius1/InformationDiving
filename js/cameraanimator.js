function CameraAnimator() {
  var parent = new THREE.Object3D();
  var sphereRadius = 1000
  var ringScale = 10
  var ringRadius = sphereRadius/ringScale + 5;
  var lookAhead = true;
  var looptime = 200;
  var pointIndex = 0;
  var binormal = new THREE.Vector3();
  var normal = new THREE.Vector3();
  var zRotateFactor = 0
  var pathMesh;
  // parent.position.y = 100;
  G.splineCamera = new THREE.PerspectiveCamera(45, G.w / G.h, 0.01, 1000);
  G.splineCamera.rotation.order = 'YXZ';

  parent.add(G.splineCamera);
  G.scene.add(parent);
  var cameraEye = new THREE.Mesh(new THREE.SphereGeometry(50), new THREE.MeshBasicMaterial({
    color: 0xddddd
  }));
  parent.add(cameraEye);


  var pathGeo;

  createCameraPath()
  createSphere();

  function createSphere(){
    var radius = 1000
    var sphereGeo = new THREE.SphereGeometry(sphereRadius, 128, 128);
    var sphereMat = new THREE.MeshNormalMaterial();
    var sphere = new THREE.Mesh(sphereGeo, sphereMat);
    G.scene.add(sphere)
  }

  cameraHelper = new THREE.CameraHelper(G.splineCamera);
  cameraHelper.visible = true;
  G.scene.add(cameraHelper);



  this.update = function() {


    //Try animate camera along spline
    var time = G.clock.getElapsedTime();
    var t = (time % looptime) / looptime
    var pos = pathGeo.parameters.path.getPointAt(t);
    pos.multiplyScalar( ringScale );

    //interpolation
    var segments = pathGeo.tangents.length;
    var pickt = t * segments;
    var pick = Math.floor(pickt);
    var pickNext = (pick + 1) % segments;

    binormal.subVectors(pathGeo.binormals[pickNext], pathGeo.binormals[pick]);
    binormal.multiplyScalar(pickt - pick).add(pathGeo.binormals[pick]);

    var dir = pathGeo.parameters.path.getTangentAt(t);
    var offset = 5;

    normal.copy(binormal).cross(dir);

    //We move on a offset on its binormal
    pos.add(normal.clone().multiplyScalar(offset));

    G.splineCamera.position.copy(pos);
    cameraEye.position.copy(pos);

    //Use arclength for stabilization in look ahead
    var lookAt = pathGeo.parameters.path.getPointAt((t + 30 / pathGeo.parameters.path.getLength()) % 1).multiplyScalar( ringScale );

    //Camera orientation 2 - up orientation via normal
    if (!lookAhead) {
      lookAt.copy(pos).add(dir);
    }
    G.splineCamera.matrix.lookAt(G.splineCamera.position, lookAt, normal);
    G.splineCamera.rotation.setFromRotationMatrix(G.splineCamera.matrix, G.splineCamera.rotation.order);
    G.splineCamera.rotation.z -= Math.PI * 0.45
    // zRotateFactor += 0.001
    cameraHelper.update();

  }

  function createCameraPath() {
    var points = []
    var numSegments = 1000;
    for (var i = 0; i < numSegments; i++) {
      var theta = i / numSegments * Math.PI * 2
      var x = ringRadius * Math.cos(theta)
      var z = ringRadius * Math.sin(theta)
      points.push(new THREE.Vector3(x, 0, z))

    }
    var extrudePath = new THREE.SplineCurve3(points);

    //path, segments, radius, radialSegments, closed
    pathGeo = new THREE.TubeGeometry(extrudePath, 1000, 2, 12, true);
    console.log('vertices', pathGeo.vertices.length)
    var pathMat = new THREE.MeshNormalMaterial({
      transparent: true,
      opacity: .2,
      // side: THREE.DoubleSide
    })
    pathMesh = new THREE.Mesh(pathGeo, pathMat);
    pathMesh.scale.y = 0.01
    //not sure why but looks like I need to rotate parent on z-axis
    //to keep camera from going upside down... ****
    pathMesh.scale.set(ringScale, 0.01, ringScale);
    pathMesh.visible = false;
    parent.add(pathMesh);


  }



}