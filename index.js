main();

function main() {

  /*========== Create a WebGL Context ==========*/
  const canvas = document.querySelector("#c");
  const gl = canvas.getContext("webgl");

  if (!gl) {
    console.log("WebGL unavailable");
    return;
  }

  /*========== Define and Store the Geometry (once) ==========*/

  // Cube centered on the origin: -0.5 .. +0.5
  const cube = [
    // front
    -0.5, -0.5, -0.5,
     0.5, -0.5, -0.5,
     0.5,  0.5, -0.5,

    -0.5, -0.5, -0.5,
     0.5,  0.5, -0.5,
    -0.5,  0.5, -0.5,

    // back
    -0.5, -0.5, 0.5,
    -0.5,  0.5, 0.5,
     0.5,  0.5, 0.5,

    -0.5, -0.5, 0.5,
     0.5,  0.5, 0.5,
     0.5, -0.5, 0.5,

    // top
    -0.5, 0.5, -0.5,
     0.5, 0.5, -0.5,
     0.5, 0.5,  0.5,

    -0.5, 0.5, -0.5,
     0.5, 0.5,  0.5,
    -0.5, 0.5,  0.5,

    // bottom
    -0.5, -0.5, -0.5,
    -0.5, -0.5,  0.5,
     0.5, -0.5,  0.5,

    -0.5, -0.5, -0.5,
     0.5, -0.5,  0.5,
     0.5, -0.5, -0.5,

    // left
    -0.5, -0.5, -0.5,
    -0.5,  0.5, -0.5,
    -0.5,  0.5,  0.5,

    -0.5, -0.5, -0.5,
    -0.5,  0.5,  0.5,
    -0.5, -0.5,  0.5,

    // right
     0.5, -0.5, -0.5,
     0.5,  0.5,  0.5,
     0.5,  0.5, -0.5,

     0.5, -0.5, -0.5,
     0.5, -0.5,  0.5,
     0.5,  0.5,  0.5
  ];

  // Pentagonal prism centered on its own origin
  const p = [
    [ 0.30,  0.30],
    [ 0.50,  0.15],
    [ 0.40, -0.20],
    [ 0.00, -0.35],
    [-0.25,  0.00]
  ];

  const prism = [];

  // front
  prism.push(
     p[0][0], p[0][1], -0.5,
     p[1][0], p[1][1], -0.5,
     p[2][0], p[2][1], -0.5,

     p[0][0], p[0][1], -0.5,
     p[2][0], p[2][1], -0.5,
     p[3][0], p[3][1], -0.5,

     p[0][0], p[0][1], -0.5,
     p[3][0], p[3][1], -0.5,
     p[4][0], p[4][1], -0.5
  );

  // back
  prism.push(
     p[0][0], p[0][1], 0.5,
     p[2][0], p[2][1], 0.5,
     p[1][0], p[1][1], 0.5,

     p[0][0], p[0][1], 0.5,
     p[3][0], p[3][1], 0.5,
     p[2][0], p[2][1], 0.5,

     p[0][0], p[0][1], 0.5,
     p[4][0], p[4][1], 0.5,
     p[3][0], p[3][1], 0.5
  );

  // sides
  for (let i = 0; i < 5; i++) {
    const j = (i + 1) % 5;

    prism.push(
      p[i][0], p[i][1], -0.5,
      p[j][0], p[j][1], -0.5,
      p[j][0], p[j][1],  0.5,

      p[i][0], p[i][1], -0.5,
      p[j][0], p[j][1],  0.5,
      p[i][0], p[i][1],  0.5
    );
  }

  const positions = cube.concat(prism);

  // colours
  const cubeColors = [
    // front
    0,0,1,1,
    1,0,0,1,
    0,1,0,1,

    0,0,1,1,
    0,1,0,1,
    1,1,0,1,

    // back
    1,0,0,1,
    1,0,0,1,
    1,0,0,1,
    1,0,0,1,
    1,0,0,1,
    1,0,0,1,

    // top
    0,1,0,1,
    0,1,0,1,
    0,1,0,1,
    0,1,0,1,
    0,1,0,1,
    0,1,0,1,

    // bottom
    1,1,0,1,
    1,1,0,1,
    1,1,0,1,
    1,1,0,1,
    1,1,0,1,
    1,1,0,1,

    // left
    1,0,1,1,
    1,0,1,1,
    1,0,1,1,
    1,0,1,1,
    1,0,1,1,
    1,0,1,1,

    // right
    0,1,1,1,
    0,1,1,1,
    0,1,1,1,
    0,1,1,1,
    0,1,1,1,
    0,1,1,1
  ];

  const prismColors = [];

  // front: gradient
  prismColors.push(
    0,0,1,1,
    1,0,0,1,
    0,1,0,1,

    0,0,1,1,
    0,1,0,1,
    1,1,0,1,

    0,0,1,1,
    1,1,0,1,
    1,0,1,1
  );

  // back
  for (let i = 0; i < 9; i++) {
    prismColors.push(
      1,0,1,1
    );
  }

  // sides
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 6; j++) {
      prismColors.push(
        0.2 + i * 0.1,
        0.2,
        0.8,
        1
      );
    }
  }

  const colors = cubeColors.concat(prismColors);

  console.assert(
    colors.length === positions.length / 3 * 4
  );

  const buffers = initBuffers(gl, positions, colors);

  /*========== Shaders (once) ==========*/

  const vsSource = `
    attribute vec4 aPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main() {
      gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aPosition;
      vColor = aVertexColor;
    }
  `;

  const fsSource = `
    varying lowp vec4 vColor;

    void main() {
      gl_FragColor = vColor;
    }
  `;

  const program = createProgram(
    gl,
    createShader(gl, gl.VERTEX_SHADER, vsSource),
    createShader(gl, gl.FRAGMENT_SHADER, fsSource)
  );

  /*====== Connect the attributes with the vertex shader ======*/

  const posAttribLocation =
    gl.getAttribLocation(program, "aPosition");

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);

  gl.vertexAttribPointer(
    posAttribLocation,
    3,
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.enableVertexAttribArray(posAttribLocation);

  const colorAttribLocation =
    gl.getAttribLocation(program, "aVertexColor");

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);

  gl.vertexAttribPointer(
    colorAttribLocation,
    4,
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.enableVertexAttribArray(colorAttribLocation);

  const modelMatrixLocation =
    gl.getUniformLocation(program, "uModelMatrix");

  const viewMatrixLocation =
    gl.getUniformLocation(program, "uViewMatrix");

  const projectionMatrixLocation =
    gl.getUniformLocation(program, "uProjectionMatrix");

  /*========== State ==========*/

  const state = {
    t: 0,
    paused: false,
    ortho: false,
    fovDeg: 60,
    azimuth: 0
  };

  let aspect = 1;

  function resize() {
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);

    gl.viewport(
      0,
      0,
      canvas.width,
      canvas.height
    );

    aspect = canvas.width / canvas.height;
  }

  window.addEventListener("resize", resize);

  resize();

  gl.clearColor(1, 1, 1, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  document.addEventListener("keydown", (event) => {

    if (event.key.toLowerCase() === "p") {
      state.paused = !state.paused;
    }

    if (event.key.toLowerCase() === "o") {
      state.ortho = !state.ortho;
    }

    if (event.key === "+" || event.key === "=") {
      state.fovDeg = Math.min(
        state.fovDeg + 5,
        100
      );
    }

    if (event.key === "-") {
      state.fovDeg = Math.max(
        state.fovDeg - 5,
        20
      );
    }

    if (event.key === "ArrowLeft") {
      state.azimuth -= 5 * Math.PI / 180;
    }

    if (event.key === "ArrowRight") {
      state.azimuth += 5 * Math.PI / 180;
    }

    if (event.key.toLowerCase() === "r") {
      state.t = 0;
      state.paused = false;
      state.ortho = false;
      state.fovDeg = 60;
      state.azimuth = 0;
    }
  });

  /*========== Drawing (every frame) ==========*/

  const projectionMatrix = mat4.create();
  const viewMatrix = mat4.create();

  let then = 0;

  let fpsFrames = 0;
  let fpsTime = 0;
  let fps = 0;

  function render(now) {

    now *= 0.001;

    if (then === 0) {
      then = now;
    }

    const realDt = now - then;
    const dt = Math.min(realDt, 0.1);

    then = now;

    if (!state.paused) {
      state.t += dt;
    }

    fpsFrames++;
    fpsTime += realDt;

    if (fpsTime >= 1.0) {
      fps = fpsFrames / fpsTime;
      fpsFrames = 0;
      fpsTime = 0;
    }

    /*========== Projection ==========*/

    if (state.ortho) {

      const halfHeight = 4.5;
      const halfWidth = halfHeight * aspect;

      mat4.ortho(
        projectionMatrix,
        -halfWidth,
        halfWidth,
        -halfHeight,
        halfHeight,
        0.1,
        20.0
      );

    } else {

      mat4.perspective(
        projectionMatrix,
        state.fovDeg * Math.PI / 180,
        aspect,
        0.1,
        20.0
      );
    }

    /*========== View ==========*/

    const horizontalRadius = Math.sqrt(
      5 * 5 + 5 * 5
    );

    const baseAngle = Math.atan2(5, 5);

    const eye = [
      horizontalRadius *
        Math.cos(baseAngle + state.azimuth),
      3,
      horizontalRadius *
        Math.sin(baseAngle + state.azimuth)
    ];

    const target = [0, 0, 0];
    const up = [0, 1, 0];

    mat4.lookAt(
      viewMatrix,
      eye,
      target,
      up
    );

    /*========== Upload view and projection ==========*/

    gl.uniformMatrix4fv(
      projectionMatrixLocation,
      false,
      projectionMatrix
    );

    gl.uniformMatrix4fv(
      viewMatrixLocation,
      false,
      viewMatrix
    );

    /*========== Clear colour + depth ==========*/

    gl.clear(
      gl.COLOR_BUFFER_BIT |
      gl.DEPTH_BUFFER_BIT
    );

    /*========== Draw cube ==========*/

    gl.uniformMatrix4fv(
      modelMatrixLocation,
      false,
      cubeModelMatrix(state.t)
    );

    const cubeCount = cube.length / 3;
    const prismCount = prism.length / 3;

    gl.drawArrays(
      gl.TRIANGLES,
      0,
      cubeCount
    );

    /*========== Draw solid ==========*/

    gl.uniformMatrix4fv(
      modelMatrixLocation,
      false,
      solidModelMatrix(state.t)
    );

    gl.drawArrays(
      gl.TRIANGLES,
      cubeCount,
      prismCount
    );

    /*========== Update status ==========*/

    document.querySelector("#status").textContent =
      "Student ID: 241629" +
      " | Projection: " +
      (state.ortho ? "ORTHOGRAPHIC" : "PERSPECTIVE") +
      " | FOV: " +
      state.fovDeg.toFixed(0) +
      "°" +
      " | t: " +
      state.t.toFixed(1) +
      " | FPS: " +
      fps.toFixed(1);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}


function cubeModelMatrix(t) {

  const model = mat4.create();

  const angle = 1.2 * t;

  const axis = [
    1 / Math.sqrt(3),
    1 / Math.sqrt(3),
    1 / Math.sqrt(3)
  ];

  mat4.rotate(
    model,
    model,
    angle,
    axis
  );

  return model;
}


function solidModelMatrix(t) {

  const model = mat4.create();

  const orbitPeriod = 15.0;
  const orbitAngle =
    2 * Math.PI * t / orbitPeriod;

  const selfAngle = 2.0 * t;

  const scaleValue =
    0.65 +
    0.15 * Math.sin(
      2 * Math.PI * t / 3
    );

  // E1:
  // M = R_orbit · T · R_self · S
  // Because glMatrix calls right-multiply,
  // the last call is applied to the vertex first.

  mat4.scale(
    model,
    model,
    [
      scaleValue,
      scaleValue,
      scaleValue
    ]
  );

  mat4.rotate(
    model,
    model,
    selfAngle,
    [0, 1, 0]
  );

  mat4.translate(
    model,
    model,
    [2.5, 0, 0]
  );

  mat4.rotate(
    model,
    model,
    orbitAngle,
    [0, 1, 0]
  );

  return model;
}


// createShader(...) and createProgram(...) from PA1

function createShader(gl, type, source) {

  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(
    shader,
    gl.COMPILE_STATUS
  )) {

    console.log(
      gl.getShaderInfoLog(shader)
    );

    gl.deleteShader(shader);

    return null;
  }

  return shader;
}


function createProgram(
  gl,
  vertexShader,
  fragmentShader
) {

  const program = gl.createProgram();

  gl.attachShader(
    program,
    vertexShader
  );

  gl.attachShader(
    program,
    fragmentShader
  );

  gl.linkProgram(program);

  if (!gl.getProgramParameter(
    program,
    gl.LINK_STATUS
  )) {

    console.log(
      gl.getProgramInfoLog(program)
    );

    return null;
  }

  gl.useProgram(program);

  return program;
}


function initBuffers(
  gl,
  positions,
  colors
) {

  const positionBuffer =
    gl.createBuffer();

  gl.bindBuffer(
    gl.ARRAY_BUFFER,
    positionBuffer
  );

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(positions),
    gl.STATIC_DRAW
  );

  const colorBuffer =
    gl.createBuffer();

  gl.bindBuffer(
    gl.ARRAY_BUFFER,
    colorBuffer
  );

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(colors),
    gl.STATIC_DRAW
  );

  return {
    position: positionBuffer,
    color: colorBuffer
};
}