/* ============================================================================
   CONTOUR LINES + BAND-FILL GEL — site background
   Self-contained: creates its own <canvas id="bgCanvas"> if absent, runs a
   WebGL2 loop with cursor-driven ink-flood. Config matches the user's preset.
   ============================================================================ */
(function () {
  'use strict';

  const CONFIG = {
    scale: 1.00,
    lines: 5,
    width: 0.007,
    speed: 0.05,
    detail: 0.60,
    gelReach: 0.235,
    gelDepth: 1.55,
    gelStep: 0.20,
    gelMax: 0.05,
    gelFall: 1.10,
    gelRefract: 0.009,
    velStretch: 0.20,
    velTrail: 0.075,
    velBloom: 0.24,
    gelFollow: 0.19,
    bg: '#F4F4ED',
    line: '#D9D7CD',
    darkBg: '#20251A',   // scroll-dark palette (matches the dark-green message phase)
    darkLine: '#39402D',
  };

  // ---------- Shaders ----------
  const VS = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

  const FS = `#version 300 es
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform float uScale, uLines, uWidth, uSpeed, uDetail;
uniform vec3  uBg, uLine;
uniform vec3  uDarkBg, uDarkLine;
uniform float uDark;            // 0 = light palette, 1 = dark-green palette
uniform vec4  uWindow;          // x,y,w,h in framebuffer px (origin bottom-left)
uniform float uWinAmt;          // strength of the light "glimpse" window

uniform vec2  uMouse;
uniform vec2  uVelocity;
uniform float uMouseAmt;
uniform float uGelReach;
uniform float uGelDepth;
uniform float uGelStep;
uniform float uGelMax;
uniform float uGelFall;
uniform float uGelRefract;
uniform float uVelStretch;
uniform float uVelTrail;
uniform float uVelBloom;

out vec4 outColor;

vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float contourField(vec2 uv) {
  float t = uTime * uSpeed;
  float n  = snoise(vec3(uv * uScale,        t       )) * 1.0;
  n       += snoise(vec3(uv * uScale * 2.1,  t * 1.4 )) * uDetail * 0.55;
  n       += snoise(vec3(uv * uScale * 4.3,  t * 1.9 )) * uDetail * 0.25;
  return n;
}

void main() {
  float mn = min(uRes.x, uRes.y);
  vec2 uv      = (gl_FragCoord.xy - 0.5 * uRes) / mn;
  vec2 mouseUv = (uMouse           - 0.5 * uRes) / mn;

  vec2 toCursor = uv - mouseUv;
  float velMag  = length(uVelocity);
  float distEff;
  if (velMag > 1e-4) {
    vec2 velDir = uVelocity / velMag;
    float along = dot(toCursor, velDir);
    float perp  = dot(toCursor, vec2(-velDir.y, velDir.x));
    float clamped = clamp(velMag, 0.0, 4.0);
    float stretch = 1.0 + clamped * uVelStretch;
    along += clamped * uVelTrail;
    distEff = length(vec2(along / stretch, perp));
  } else {
    distEff = length(toCursor);
  }

  float radius = uGelReach * (1.0 + min(velMag, 3.0) * uVelBloom);
  float r = clamp(distEff / radius, 0.0, 1.0);
  float infl = pow(1.0 - r, uGelFall) * uMouseAmt;

  float distNorm = dot(toCursor, toCursor);
  vec2  refractDir = (distNorm > 1e-6) ? normalize(toCursor) : vec2(0.0);
  vec2  sampleUv = uv - refractDir * infl * uGelRefract;
  float n = contourField(sampleUv);

  float bands = n * uLines;
  float d = 0.5 - abs(fract(bands) - 0.5);
  float aa = max(fwidth(bands) * 0.5, 0.0005);
  float onLine = 1.0 - smoothstep(uWidth, uWidth + aa, d);

  float waterN  = -uGelDepth + 2.0 * uGelDepth * infl;
  float depthBands = (waterN - n) * uLines;
  float tiers = floor(max(depthBands, 0.0));
  float darken = clamp(tiers * uGelStep, 0.0, uGelMax);
  darken *= smoothstep(0.0, 0.15, infl);

  vec3 col     = mix(uBg     * (1.0 - darken), uLine,     onLine);  // light palette
  vec3 darkCol = mix(uDarkBg * (1.0 - darken), uDarkLine, onLine);  // dark-green palette

  // Rectangular "glimpse" window that stays on the light palette.
  float fx = smoothstep(uWindow.x - 1.5, uWindow.x + 1.5, gl_FragCoord.x)
           * (1.0 - smoothstep(uWindow.x + uWindow.z - 1.5, uWindow.x + uWindow.z + 1.5, gl_FragCoord.x));
  float fy = smoothstep(uWindow.y - 1.5, uWindow.y + 1.5, gl_FragCoord.y)
           * (1.0 - smoothstep(uWindow.y + uWindow.w - 1.5, uWindow.y + uWindow.w + 1.5, gl_FragCoord.y));
  float inWin   = fx * fy * uWinAmt;
  float darkAmt = uDark * (1.0 - inWin);

  outColor = vec4(mix(col, darkCol, darkAmt), 1.0);
}`;

  // ---------- Canvas ----------
  let canvas = document.getElementById('bgCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'bgCanvas';
    document.body.insertBefore(canvas, document.body.firstChild);
  }
  // Always apply fixed-fullscreen positioning so the canvas never sits in flow,
  // whether it was pre-declared in the HTML or just created.
  Object.assign(canvas.style, {
    position: 'fixed', inset: '0', width: '100vw', height: '100vh',
    zIndex: '-2', display: 'block', pointerEvents: 'none',
  });

  const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: false, antialias: true });
  if (!gl) {
    console.warn('[background] WebGL2 not available — falling back to solid bg');
    document.body.style.background = CONFIG.bg;
    return;
  }

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
    return s;
  }
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) console.error(gl.getProgramInfoLog(prog));
  gl.useProgram(prog);

  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const U = Object.fromEntries(
    ['uRes','uTime','uScale','uLines','uWidth','uSpeed','uDetail','uBg','uLine',
     'uDarkBg','uDarkLine','uDark','uWindow','uWinAmt',
     'uMouse','uVelocity','uMouseAmt','uGelReach','uGelDepth','uGelStep','uGelMax',
     'uGelFall','uGelRefract','uVelStretch','uVelTrail','uVelBloom']
      .map(name => [name, gl.getUniformLocation(prog, name)])
  );

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = Math.floor(window.innerWidth  * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  // ---------- Mouse + velocity ----------
  const dprFn = () => Math.min(window.devicePixelRatio || 1, 2);
  let mouseTarget = { x: canvas.width * 0.5, y: canvas.height * 0.5 };
  let mouseSmooth = { ...mouseTarget };
  let mousePrev   = { ...mouseTarget };
  let velSmooth   = { x: 0, y: 0 };
  let mouseAmt = 0;

  window.addEventListener('pointermove', e => {
    mouseTarget.x = e.clientX * dprFn();
    mouseTarget.y = (window.innerHeight - e.clientY) * dprFn();
    mouseAmt = 1.0;
  }, { passive: true });
  window.addEventListener('pointerleave', () => { mouseAmt = 0; });
  window.addEventListener('pointerenter', () => { mouseAmt = 1.0; });

  function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  const bgRgb = hexToRgb(CONFIG.bg);
  const lineRgb = hexToRgb(CONFIG.line);
  const darkBgRgb = hexToRgb(CONFIG.darkBg);
  const darkLineRgb = hexToRgb(CONFIG.darkLine);

  // ---------- Loop ----------
  const t0 = performance.now();
  let lastT = t0;
  let mouseAmtSmooth = 0;

  function frame() {
    const now = performance.now();
    const dt = Math.min((now - lastT) / 1000, 1/30);
    lastT = now;

    const k = 1 - Math.exp(-CONFIG.gelFollow * 60 * dt);
    mouseSmooth.x += (mouseTarget.x - mouseSmooth.x) * k;
    mouseSmooth.y += (mouseTarget.y - mouseSmooth.y) * k;

    const mn = Math.min(canvas.width, canvas.height);
    const rawVX = (mouseSmooth.x - mousePrev.x) / Math.max(dt, 1e-4) / mn;
    const rawVY = (mouseSmooth.y - mousePrev.y) / Math.max(dt, 1e-4) / mn;
    mousePrev.x = mouseSmooth.x; mousePrev.y = mouseSmooth.y;
    const velK = 1 - Math.exp(-12 * dt);
    velSmooth.x += (rawVX - velSmooth.x) * velK;
    velSmooth.y += (rawVY - velSmooth.y) * velK;

    mouseAmtSmooth += (mouseAmt - mouseAmtSmooth) * (1 - Math.exp(-6 * dt));

    gl.uniform2f (U.uRes, canvas.width, canvas.height);
    gl.uniform1f (U.uTime, (now - t0) / 1000);
    gl.uniform1f (U.uScale, CONFIG.scale);
    gl.uniform1f (U.uLines, CONFIG.lines);
    gl.uniform1f (U.uWidth, CONFIG.width);
    gl.uniform1f (U.uSpeed, CONFIG.speed);
    gl.uniform1f (U.uDetail, CONFIG.detail);
    gl.uniform3fv(U.uBg, bgRgb);
    gl.uniform3fv(U.uLine, lineRgb);
    gl.uniform3fv(U.uDarkBg, darkBgRgb);
    gl.uniform3fv(U.uDarkLine, darkLineRgb);
    // scroll-driven dark phase + light "glimpse" window (set by the stage script)
    gl.uniform1f(U.uDark, window.__bgDark || 0);
    gl.uniform1f(U.uWinAmt, window.__bgWinAmt || 0);
    const win = window.__bgWindow;
    if (win) {
      const d = Math.min(window.devicePixelRatio || 1, 2);
      gl.uniform4f(U.uWindow, win[0]*d, (window.innerHeight - (win[1]+win[3]))*d, win[2]*d, win[3]*d);
    } else {
      gl.uniform4f(U.uWindow, 0, 0, 0, 0);
    }
    gl.uniform2f (U.uMouse, mouseSmooth.x, mouseSmooth.y);
    gl.uniform2f (U.uVelocity, velSmooth.x, velSmooth.y);
    gl.uniform1f (U.uMouseAmt, mouseAmtSmooth);
    gl.uniform1f (U.uGelReach, CONFIG.gelReach);
    gl.uniform1f (U.uGelDepth, CONFIG.gelDepth);
    gl.uniform1f (U.uGelStep,  CONFIG.gelStep);
    gl.uniform1f (U.uGelMax,   CONFIG.gelMax);
    gl.uniform1f (U.uGelFall,  CONFIG.gelFall);
    gl.uniform1f (U.uGelRefract, CONFIG.gelRefract);
    gl.uniform1f (U.uVelStretch, CONFIG.velStretch);
    gl.uniform1f (U.uVelTrail,   CONFIG.velTrail);
    gl.uniform1f (U.uVelBloom,   CONFIG.velBloom);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // Expose for debugging
  window.__bgConfig = CONFIG;
})();
