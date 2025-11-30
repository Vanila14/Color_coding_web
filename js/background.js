document.addEventListener("DOMContentLoaded", () => {
      const container = document.getElementById("color-bends-container");

      const settings = {
        colors: [
  "#FF0000",
  "#FF7F00",
  "#FFFF00", 
  "#00FF00", 
  "#00fff2ff",
  "#0000FF",
  "#4B0082", 
  "#ff00fbff"
],
        rotation: 30,
        speed: 0.3,
        scale: 1.2,
        frequency: 1.4,
        warpStrength: 1.2,
        mouseInfluence: 0.8,
        parallax: 0.6,
        noise: 0.08,
        transparent: true
      };

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
      const geometry = new THREE.PlaneGeometry(2,2);

      // Шейдеры
      const vert = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position,1.0);
        }
      `;

      const frag = `
        #define MAX_COLORS 8
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
varying vec2 vUv;

// мягкое ограничение яркости, убирает белые вспышки
vec3 softClamp(vec3 col, float maxVal) {
    return col / (1.0 + col / maxVal);
}

void main() {
    float t = uTime * uSpeed;

    vec2 p = vUv * 2.0 - 1.0;
    p += uPointer * uParallax * 0.12;

    vec2 rp = vec2(
        p.x * uRot.x - p.y * uRot.y,
        p.x * uRot.y + p.y * uRot.x
    );

    vec2 q = vec2(
        rp.x * (uCanvas.x / uCanvas.y),
        rp.y
    );

    q /= max(uScale, 0.0001);
    q /= 0.5 + 0.25 * dot(q, q);

    q += 0.2 * cos(t) - 1.0;

    q += (uPointer - rp) * uMouseInfluence * 0.18;

    vec3 sumCol = vec3(0.0);
    float cover = 0.0;

    for (int i = 0; i < MAX_COLORS; ++i) {
        if (i >= uColorCount) break;

        vec2 s = q - float(i) * 0.012;

        vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));

        float m = length(
            r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0
        );

        float w = exp(-6.0 * abs(m));

        sumCol += uColors[i] * w;
        cover = max(cover, w);
    }

    vec3 col = sumCol;

    // гамма + мягкое усиление
    col = pow(col, vec3(0.92));
    col *= 1.25;

    // защита от пересвета
    col = softClamp(col, 1.0);

    // шум
    if (uNoise > 0.0001) {
        float n = fract(
            sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 
            43758.5453123
        );
        col += (n - 0.5) * uNoise;
        col = clamp(col, 0.0, 1.0);
    }

    float a = (uTransparent > 0) ? cover : 1.0;

    gl_FragColor = vec4(col, a);
}

      `;

      const MAX_COLORS = 8;
      const uColorsArray = Array.from({length: MAX_COLORS}, (_, i) => {
        const hex = settings.colors[i] || "#000000";
        const h = hex.replace('#','');
        return new THREE.Vector3(
          parseInt(h.slice(0,2),16)/255,
          parseInt(h.slice(2,4),16)/255,
          parseInt(h.slice(4,6),16)/255
        );
      });

      const material = new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms: {
          uCanvas: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          uTime: { value: 0 },
          uSpeed: { value: settings.speed },
          uRot: { value: new THREE.Vector2(1,0) },
          uColorCount: { value: settings.colors.length },
          uColors: { value: uColorsArray },
          uTransparent: { value: settings.transparent ? 1 : 0 },
          uScale: { value: settings.scale },
          uFrequency: { value: settings.frequency },
          uWarpStrength: { value: settings.warpStrength },
          uPointer: { value: new THREE.Vector2(0,0) },
          uMouseInfluence: { value: settings.mouseInfluence },
          uParallax: { value: settings.parallax },
          uNoise: { value: settings.noise }
        },
        transparent: true
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const renderer = new THREE.WebGLRenderer({ alpha:true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
      container.appendChild(renderer.domElement);

      const clock = new THREE.Clock();
      const pointer = new THREE.Vector2(0,0);

      window.addEventListener('pointermove', e => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;

    pointer.set(x, y);
});


      function animate() {
        material.uniforms.uTime.value = clock.getElapsedTime();
        material.uniforms.uPointer.value.copy(pointer);
        const rad = settings.rotation * Math.PI / 180;
        material.uniforms.uRot.value.set(Math.cos(rad), Math.sin(rad));
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      animate();

      window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        material.uniforms.uCanvas.value.set(window.innerWidth, window.innerHeight);
      });
    });