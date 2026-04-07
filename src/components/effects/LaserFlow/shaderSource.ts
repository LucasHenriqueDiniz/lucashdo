export const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = `
uniform float time;
uniform vec3 color;
uniform float wispDensity;
uniform float wispSpeed;
uniform float wispIntensity;
uniform float flowSpeed;
uniform float flowStrength;
uniform float fogIntensity;
uniform float fogScale;
uniform float fogFallSpeed;
uniform float horizontalBeamOffset;
uniform float verticalBeamOffset;
uniform float horizontalSizing;
uniform float verticalSizing;

varying vec2 vUv;
varying vec3 vPosition;

float noise(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;

  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }

  return value;
}

float smoothNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  f = f * f * (3.0 - 2.0 * f);

  float a = noise(i);
  float b = noise(i + vec2(1.0, 0.0));
  float c = noise(i + vec2(0.0, 1.0));
  float d = noise(i + vec2(1.0, 1.0));

  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
  vec2 uv = vUv;
  uv.x = (uv.x - 0.5) / horizontalSizing + 0.5 + horizontalBeamOffset;
  uv.y = (uv.y - 0.5) / verticalSizing + 0.5 + verticalBeamOffset;

  float animTime = time * flowSpeed;
  float wispTime = time * wispSpeed;

  float beam = 0.0;

  float beamY = 0.5 + sin(uv.x * 3.14159 + animTime) * 0.1 * flowStrength;
  float beamDist = abs(uv.y - beamY);
  beam += smoothstep(0.05, 0.0, beamDist) * wispIntensity;

  for (float i = 0.0; i < 5.0; i++) {
    if (i >= wispDensity * 5.0) break;

    float offset = i * 0.2 - 0.4;
    float wispY = 0.5 + offset + sin(uv.x * 6.28 + wispTime + i) * 0.08 * flowStrength;
    float wispDist = abs(uv.y - wispY);
    float wispBeam = smoothstep(0.03, 0.0, wispDist) * wispIntensity * 0.6;
    float noiseVar = smoothNoise(vec2(uv.x * 5.0 + wispTime * 0.5, i));
    wispBeam *= 0.5 + noiseVar * 0.5;
    beam += wispBeam;
  }

  float flowPattern = fbm(vec2(uv.x * 3.0 - animTime * 0.5, uv.y * 2.0));
  flowPattern = pow(flowPattern, 2.0);
  beam *= 0.7 + flowPattern * 0.3 * flowStrength;

  float flowStreaks = smoothNoise(vec2(uv.x * 8.0 - animTime * 2.0, uv.y * 10.0));
  flowStreaks = pow(flowStreaks, 3.0);
  beam += flowStreaks * flowStrength * 0.3;

  float fog = 0.0;
  vec2 fogUV1 = vec2(uv.x * fogScale, uv.y * fogScale + time * fogFallSpeed * 0.1);
  fog += fbm(fogUV1 * 2.0) * 0.4;

  vec2 fogUV2 = vec2(uv.x * fogScale * 1.5, uv.y * fogScale * 1.5 + time * fogFallSpeed * 0.15);
  fog += smoothNoise(fogUV2 * 3.0) * 0.3;

  vec2 fogUV3 = vec2(uv.x * fogScale * 2.0, uv.y * fogScale * 2.0 + time * fogFallSpeed * 0.2);
  fog += noise(fogUV3 * 5.0) * 0.2;

  fog = fog * fogIntensity;
  fog *= 1.0 - uv.y * 0.3;

  float combinedIntensity = beam + fog * 0.5;
  vec3 finalColor = color * combinedIntensity;
  vec3 glowColor = color * 1.5;
  finalColor = mix(finalColor, glowColor, beam * 0.3);

  float alpha = clamp(combinedIntensity, 0.0, 1.0);
  vec3 colorVariation = vec3(
    1.0 + sin(uv.x * 3.14159 + time * 0.5) * 0.1,
    1.0,
    1.0 + cos(uv.y * 3.14159 + time * 0.3) * 0.1
  );

  finalColor *= colorVariation;
  gl_FragColor = vec4(finalColor, alpha);
}
`;
