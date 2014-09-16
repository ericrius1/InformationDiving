function CameraAnimator() {
  var parent = new THREE.Object3D();
  G.sphereRadius = 1000
  G.ringRadius = G.sphereRadius + 10
  var lookAhead = true;
  var pointIndex = 0;
  var binormal = new THREE.Vector3();
  var normal = new THREE.Vector3();
  var zRotateFactor = 0
  var pathMesh;
  // parent.position.y = 100;
  G.splineCamera = new THREE.PerspectiveCamera(45, G.w / G.h, 0.01, 10000);
  G.splineCamera.rotation.order = 'YXZ';

  parent.add(G.splineCamera);
  G.scene.add(parent);
  var cameraEye = new THREE.Mesh(new THREE.SphereGeometry(10), new THREE.MeshBasicMaterial({
    color: 0xddddd
  }));
  parent.add(cameraEye);


  createCameraPath()
  createSphere();

  cameraHelper = new THREE.CameraHelper(G.splineCamera);
  cameraHelper.visible = false;
  G.scene.add(cameraHelper);






  this.update = function(t) {


    //Try animate camera along spline

    var pos = G.pathGeo.parameters.path.getPointAt(t);


    //interpolation
    var segments = G.pathGeo.tangents.length;
    var pickt = t * segments;
    var pick = Math.floor(pickt);
    var pickNext = (pick + 1) % segments;

    binormal.subVectors(G.pathGeo.binormals[pickNext], G.pathGeo.binormals[pick]);
    binormal.multiplyScalar(pickt - pick).add(G.pathGeo.binormals[pick]);

    var dir = G.pathGeo.parameters.path.getTangentAt(t);
    var offset = 5;

    normal.copy(binormal).cross(dir);

    //We move on a offset on its binormal
    pos.add(normal.clone().multiplyScalar(offset));

    G.splineCamera.position.copy(pos);
    cameraEye.position.copy(pos);

    //Use arclength for stabilization in look ahead
    var lookAt = G.pathGeo.parameters.path.getPointAt((t + 30 / G.pathGeo.parameters.path.getLength()) % 1)

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
      var x = G.ringRadius * Math.cos(theta)
      var z = G.ringRadius * Math.sin(theta)
      points.push(new THREE.Vector3(x, 0, z))

    }
    var extrudePath = new THREE.SplineCurve3(points);

    //path, segments, radius, radialSegments, closed
    G.pathGeo = new THREE.TubeGeometry(extrudePath, 1000, 2, 12, true);
    var pathMat = new THREE.MeshNormalMaterial({
      transparent: true,
      opacity: .2,
      // side: THREE.DoubleSide
    })
    pathMesh = new THREE.Mesh(G.pathGeo, pathMat);
    // pathMesh.scale.y = 0.01
    //not sure why but looks like I need to rotate parent on z-axis
    //to keep camera from going upside down... ****
    pathMesh.visible = false;
    parent.add(pathMesh);


  }
  function createSphere(){
    var sphereGeo = new THREE.SphereGeometry(G.sphereRadius, 128, 128);
    var sphereMat = new THREE.MeshNormalMaterial({
      // wireframe: true
      transparent: true,
      opacity: 0.11
    });
    var sphere = new THREE.Mesh(sphereGeo, sphereMat);
    // sphere.visible = false
    G.scene.add(sphere)
  }



}