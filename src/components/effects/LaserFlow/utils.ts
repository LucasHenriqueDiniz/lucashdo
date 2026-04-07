import * as THREE from 'three';
import { isHexColor } from '@/utils/webgl';
import { fragmentShader, vertexShader } from './shaderSource';

export interface LaserFlowProps {
  wispDensity?: number;
  wispSpeed?: number;
  wispIntensity?: number;
  flowSpeed?: number;
  flowStrength?: number;
  fogIntensity?: number;
  fogScale?: number;
  fogFallSpeed?: number;
  horizontalBeamOffset?: number;
  verticalBeamOffset?: number;
  horizontalSizing?: number;
  verticalSizing?: number;
  color?: string;
  className?: string;
  paused?: boolean;
  pixelRatioCap?: number;
  disableFog?: boolean;
  monitorPerformance?: boolean;
}

export interface ResolvedLaserFlowProps {
  wispDensity: number;
  wispSpeed: number;
  wispIntensity: number;
  flowSpeed: number;
  flowStrength: number;
  fogIntensity: number;
  fogScale: number;
  fogFallSpeed: number;
  horizontalBeamOffset: number;
  verticalBeamOffset: number;
  horizontalSizing: number;
  verticalSizing: number;
  color: string;
  className: string;
  paused: boolean;
  pixelRatioCap: number;
  disableFog: boolean;
  monitorPerformance: boolean;
}

export interface LaserFlowSceneInstance {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  material: THREE.ShaderMaterial;
  geometry: THREE.PlaneGeometry;
  mesh: THREE.Mesh;
  resize: () => void;
  destroy: () => void;
}

type UniformMap = Record<string, THREE.IUniform>;

type CreateMaterialOptions = {
  materialFactory?: (options: THREE.ShaderMaterialParameters) => THREE.ShaderMaterial;
};

type CreateSceneOptions = {
  container: HTMLElement;
  props: ResolvedLaserFlowProps;
  rendererFactory?: (options: THREE.WebGLRendererParameters) => THREE.WebGLRenderer;
  materialFactory?: (options: THREE.ShaderMaterialParameters) => THREE.ShaderMaterial;
};

export const LASER_FLOW_DEFAULTS: ResolvedLaserFlowProps & {
  performanceWarningFps: number;
} = {
  wispDensity: 0.58,
  wispSpeed: 1.08,
  wispIntensity: 0.84,
  flowSpeed: 1.08,
  flowStrength: 0.62,
  fogIntensity: 0.24,
  fogScale: 1.12,
  fogFallSpeed: 0.42,
  horizontalBeamOffset: 0,
  verticalBeamOffset: 0,
  horizontalSizing: 1.1,
  verticalSizing: 1.04,
  color: '#0184FC',
  className: '',
  paused: false,
  pixelRatioCap: 1.75,
  disableFog: false,
  monitorPerformance: false,
  performanceWarningFps: 45,
};

export const MOBILE_LASER_FLOW_OVERRIDES: Partial<ResolvedLaserFlowProps> = {
  wispDensity: 0.3,
  fogIntensity: 0,
  pixelRatioCap: 1.2,
  verticalSizing: 1.18,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function resolveLaserFlowProps(props: LaserFlowProps = {}): ResolvedLaserFlowProps {
  return {
    wispDensity: clamp(props.wispDensity ?? LASER_FLOW_DEFAULTS.wispDensity, 0, 1),
    wispSpeed: clamp(props.wispSpeed ?? LASER_FLOW_DEFAULTS.wispSpeed, 0, 5),
    wispIntensity: clamp(props.wispIntensity ?? LASER_FLOW_DEFAULTS.wispIntensity, 0, 1),
    flowSpeed: clamp(props.flowSpeed ?? LASER_FLOW_DEFAULTS.flowSpeed, 0, 5),
    flowStrength: clamp(props.flowStrength ?? LASER_FLOW_DEFAULTS.flowStrength, 0, 1),
    fogIntensity: clamp(props.fogIntensity ?? LASER_FLOW_DEFAULTS.fogIntensity, 0, 1),
    fogScale: clamp(props.fogScale ?? LASER_FLOW_DEFAULTS.fogScale, 0.5, 2),
    fogFallSpeed: clamp(props.fogFallSpeed ?? LASER_FLOW_DEFAULTS.fogFallSpeed, 0, 2),
    horizontalBeamOffset: clamp(
      props.horizontalBeamOffset ?? LASER_FLOW_DEFAULTS.horizontalBeamOffset,
      -1,
      1
    ),
    verticalBeamOffset: clamp(
      props.verticalBeamOffset ?? LASER_FLOW_DEFAULTS.verticalBeamOffset,
      -1,
      1
    ),
    horizontalSizing: clamp(
      props.horizontalSizing ?? LASER_FLOW_DEFAULTS.horizontalSizing,
      0.5,
      2
    ),
    verticalSizing: clamp(props.verticalSizing ?? LASER_FLOW_DEFAULTS.verticalSizing, 0.5, 2),
    color: isHexColor(props.color) ? (props.color as string) : LASER_FLOW_DEFAULTS.color,
    className: props.className ?? LASER_FLOW_DEFAULTS.className,
    paused: props.paused ?? LASER_FLOW_DEFAULTS.paused,
    pixelRatioCap: clamp(props.pixelRatioCap ?? LASER_FLOW_DEFAULTS.pixelRatioCap, 0.75, 2),
    disableFog: props.disableFog ?? LASER_FLOW_DEFAULTS.disableFog,
    monitorPerformance: props.monitorPerformance ?? LASER_FLOW_DEFAULTS.monitorPerformance,
  };
}

export function parseLaserFlowColor(color: string) {
  return new THREE.Color(isHexColor(color) ? color : LASER_FLOW_DEFAULTS.color);
}

export function createLaserFlowUniforms(props: ResolvedLaserFlowProps): UniformMap {
  return {
    time: { value: 0 },
    color: { value: parseLaserFlowColor(props.color) },
    wispDensity: { value: props.wispDensity },
    wispSpeed: { value: props.wispSpeed },
    wispIntensity: { value: props.wispIntensity },
    flowSpeed: { value: props.flowSpeed },
    flowStrength: { value: props.flowStrength },
    fogIntensity: { value: props.disableFog ? 0 : props.fogIntensity },
    fogScale: { value: props.fogScale },
    fogFallSpeed: { value: props.fogFallSpeed },
    horizontalBeamOffset: { value: props.horizontalBeamOffset },
    verticalBeamOffset: { value: props.verticalBeamOffset },
    horizontalSizing: { value: props.horizontalSizing },
    verticalSizing: { value: props.verticalSizing },
  };
}

export function createLaserFlowMaterial(
  props: ResolvedLaserFlowProps,
  options: CreateMaterialOptions = {}
) {
  const config: THREE.ShaderMaterialParameters = {
    vertexShader,
    fragmentShader,
    uniforms: createLaserFlowUniforms(props),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  };

  const materialFactory = options.materialFactory ?? ((material) => new THREE.ShaderMaterial(material));

  return materialFactory(config);
}

export function syncLaserFlowUniforms(
  material: THREE.ShaderMaterial,
  props: ResolvedLaserFlowProps
) {
  const nextUniforms = createLaserFlowUniforms(props);

  Object.entries(nextUniforms).forEach(([key, uniform]) => {
    if (!material.uniforms[key]) {
      material.uniforms[key] = uniform;
      return;
    }

    material.uniforms[key].value = uniform.value;
  });
}

function getContainerSize(container: HTMLElement) {
  return {
    width: Math.max(container.clientWidth || 0, 1),
    height: Math.max(container.clientHeight || 0, 1),
  };
}

export function createLaserFlowScene({
  container,
  props,
  rendererFactory,
  materialFactory,
}: CreateSceneOptions): LaserFlowSceneInstance {
  const { width, height } = getContainerSize(container);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.z = 3.2;

  const renderer = (rendererFactory ?? ((options) => new THREE.WebGLRenderer(options)))({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, props.pixelRatioCap));
  renderer.setSize(width, height, false);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);

  const geometry = new THREE.PlaneGeometry(5.2, 4.2, 48, 48);
  const material = createLaserFlowMaterial(props, { materialFactory });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const resize = () => {
    const nextSize = getContainerSize(container);
    camera.aspect = nextSize.width / nextSize.height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, props.pixelRatioCap));
    renderer.setSize(nextSize.width, nextSize.height, false);
  };

  window.addEventListener('resize', resize);

  const destroy = () => {
    window.removeEventListener('resize', resize);
    scene.remove(mesh);
    geometry.dispose();
    material.dispose();
    renderer.dispose();

    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  };

  return {
    scene,
    camera,
    renderer,
    material,
    geometry,
    mesh,
    resize,
    destroy,
  };
}
