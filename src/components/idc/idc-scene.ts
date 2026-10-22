import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

import type { IdcConfiguration, IdcSide } from "@/lib/idc";

export type IdcView = "perspective" | "top" | "endA" | "free";
export type ViewerAction = "rotateLeft" | "rotateRight" | "zoomIn" | "zoomOut";
type Labels = {
  A: HTMLSpanElement;
  B: HTMLSpanElement;
  dimension: HTMLSpanElement;
};

export function createIdcScene(
  canvas: HTMLCanvasElement,
  stage: HTMLDivElement,
  labels: Labels,
  initial: IdcConfiguration,
  onView: (view: IdcView) => void,
  onContext: (lost: boolean) => void,
) {
  let config = initial;
  let disposed = false;
  let pending = 0;
  let view: IdcView = "perspective";
  let width = 50;
  let dimensions = true;
  let dimensionGroup = new THREE.Group();
  let anchors: Record<keyof Labels, THREE.Vector3>;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 10000);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = !window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  controls.dampingFactor = 0.12;
  controls.rotateSpeed = 0.7;
  controls.zoomSpeed = 0.85;
  controls.panSpeed = 0.8;
  controls.minPolarAngle = 0.015;
  controls.maxPolarAngle = Math.PI - 0.015;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.55;
  room.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xf7fbff, 0x738294, 1.1));
  const key = new THREE.DirectionalLight(0xfffaf5, 2.5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.normalBias = 0.12;
  key.shadow.bias = -0.0001;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xe4f0ff, 1.5);
  rim.position.set(-120, 150, -200);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffffff, 0.5);
  fill.position.set(0, -80, 100);
  scene.add(fill);

  const materials = {
    wire: new THREE.MeshPhysicalMaterial({
      color: 0x9ba3aa,
      roughness: 0.45,
      metalness: 0.025,
      clearcoat: 0.16,
    }),
    red: new THREE.MeshPhysicalMaterial({
      color: 0xb42130,
      roughness: 0.4,
      metalness: 0.015,
    }),
    web: new THREE.MeshStandardMaterial({ color: 0xa4adb5, roughness: 0.6 }),
    housing: new THREE.MeshStandardMaterial({
      color: 0x191e25,
      roughness: 0.34,
      metalness: 0.07,
    }),
    clamp: new THREE.MeshStandardMaterial({
      color: 0x252d36,
      roughness: 0.45,
      metalness: 0.035,
    }),
    black: new THREE.MeshStandardMaterial({ color: 0x070b10, roughness: 0.68 }),
    metal: new THREE.MeshStandardMaterial({
      color: 0xb8aa7c,
      metalness: 0.92,
      roughness: 0.3,
    }),
    mark: new THREE.MeshStandardMaterial({ color: 0xa1a8af, roughness: 0.65 }),
    ghost: new THREE.MeshStandardMaterial({
      color: 0x7e9bb6,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    }),
    dimension: new THREE.LineBasicMaterial({
      color: 0x65758a,
      transparent: true,
      opacity: 0.7,
    }),
  };
  const shadowMaterial = new THREE.ShadowMaterial({
    opacity: 0.16,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000),
    shadowMaterial,
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -7.4;
  floor.receiveShadow = true;
  scene.add(floor);
  const model = new THREE.Group();
  scene.add(model);

  function positionLabels() {
    for (const name of ["A", "B", "dimension"] as const) {
      const point = anchors[name].clone().project(camera);
      const x = ((point.x + 1) * stage.clientWidth) / 2;
      const y = ((1 - point.y) * stage.clientHeight) / 2;
      const node = labels[name];
      node.hidden =
        (name === "dimension" && !dimensions) ||
        point.z < -1 ||
        point.z > 1 ||
        x < 12 ||
        x > stage.clientWidth - 12 ||
        y < 12 ||
        y > stage.clientHeight - 12;
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
    }
  }
  function invalidate() {
    if (disposed || pending) return;
    pending = requestAnimationFrame(() => {
      pending = 0;
      if (disposed || !stage.clientWidth) return;
      controls.update();
      renderer.render(scene, camera);
      positionLabels();
    });
  }
  function mesh(
    parent: THREE.Group,
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    x = 0,
    y = 0,
    z = 0,
  ) {
    const item = new THREE.Mesh(geometry, material);
    item.position.set(x, y, z);
    item.castShadow = material !== materials.ghost;
    item.receiveShadow = true;
    parent.add(item);
    return item;
  }
  function rounded(
    parent: THREE.Group,
    x: number,
    y: number,
    z: number,
    material: THREE.Material,
    px = 0,
    py = 0,
    pz = 0,
    radius = 0.18,
  ) {
    return mesh(
      parent,
      new RoundedBoxGeometry(x, y, z, 2, Math.min(radius, x / 3, y / 3, z / 3)),
      material,
      px,
      py,
      pz,
    );
  }
  function socket(side: IdcSide) {
    const group = new THREE.Group();
    const columns = config.pins / 2;
    const bodyLength = (columns - 1) * 2.54 + 6.1;
    const shape = new THREE.Shape();
    const left = -4.4,
      right = 4.4,
      bottom = -bodyLength / 2,
      top = bodyLength / 2,
      radius = 0.45;
    shape.moveTo(left + radius, bottom);
    shape.lineTo(right - radius, bottom);
    shape.quadraticCurveTo(right, bottom, right, bottom + radius);
    shape.lineTo(right, top - radius);
    shape.quadraticCurveTo(right, top, right - radius, top);
    shape.lineTo(left + radius, top);
    shape.quadraticCurveTo(left, top, left, top - radius);
    shape.lineTo(left, bottom + radius);
    shape.quadraticCurveTo(left, bottom, left + radius, bottom);
    for (let j = 0; j < columns; j++) {
      const z = (j - (columns - 1) / 2) * 2.54;
      for (const x of [-1.27, 1.27]) {
        const hole = new THREE.Path(),
          r = 0.73;
        hole.moveTo(x - r, z - r);
        hole.lineTo(x - r, z + r);
        hole.lineTo(x + r, z + r);
        hole.lineTo(x + r, z - r);
        hole.closePath();
        shape.holes.push(hole);
      }
    }
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 6.6,
      bevelEnabled: true,
      bevelSize: 0.12,
      bevelThickness: 0.13,
      bevelSegments: 2,
      curveSegments: 3,
    });
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(0, -3, 0);
    mesh(group, geometry, materials.housing);
    rounded(group, 8.3, 0.7, bodyLength - 0.4, materials.black, 0, -3.3, 0);
    rounded(
      group,
      11.2,
      2,
      bodyLength + 0.7,
      materials.clamp,
      0,
      -4.7,
      0,
      0.32,
    );
    rounded(group, 5.2, 1.6, bodyLength - 4.2, materials.housing, 0, -6, 0);
    for (const z of [-bodyLength / 2 + 1, bodyLength / 2 - 1]) {
      rounded(group, 12.4, 7.5, 2.1, materials.clamp, 0, -0.7, z);
      rounded(group, 0.65, 3.4, 1.1, materials.housing, 4.85, 0.1, z, 0.08);
      rounded(group, 0.65, 3.4, 1.1, materials.housing, -4.85, 0.1, z, 0.08);
    }
    rounded(group, 1.2, 2.7, 4.6, materials.housing, -4.8, 1.3, 0);
    for (let j = 0; j < columns; j++) {
      const z = (j - (columns - 1) / 2) * 2.54;
      for (const x of [-1.27, 1.27])
        mesh(
          group,
          new THREE.BoxGeometry(0.3, 1.35, 0.8),
          materials.metal,
          x + 0.38,
          2,
          z,
        );
    }
    const triangle = new THREE.Shape();
    triangle.moveTo(-0.62, 0);
    triangle.lineTo(0.62, 0);
    triangle.lineTo(0, 1);
    triangle.closePath();
    const mark = new THREE.ShapeGeometry(triangle);
    mark.rotateX(-Math.PI / 2);
    mesh(group, mark, materials.mark, 2.9, 3.77, bodyLength / 2 - 1.7);
    group.position.x = side === "A" ? -config.length / 2 : config.length / 2;
    if (
      side === "B" &&
      config.endA === "socket" &&
      config.endB === "socket" &&
      config.orientation === "opposite"
    )
      group.rotation.x = Math.PI;
    return group;
  }
  function clearGeometry() {
    model.traverse((item) => {
      if (item instanceof THREE.Mesh || item instanceof THREE.LineSegments)
        item.geometry.dispose();
    });
    model.clear();
  }
  function build() {
    clearGeometry();
    width = (config.pins - 1) * 1.27 + 1.1;
    const length = config.length;
    const rise = (x: number) =>
      Math.min(3.2, length * 0.012) * (1 - ((2 * x) / length) ** 2);
    materials.wire.color.setHex(config.color === "gray" ? 0x9ba3aa : 0x282f38);
    materials.web.color.setHex(config.color === "gray" ? 0xa4adb5 : 0x242c35);
    const web = new THREE.BoxGeometry(length, 0.44, width, 48, 1, 1);
    const positions = web.attributes.position;
    for (let i = 0; i < positions.count; i++)
      positions.setY(i, positions.getY(i) + rise(positions.getX(i)));
    web.computeVertexNormals();
    mesh(model, web, materials.web).receiveShadow = false;
    for (let i = 0; i < config.pins; i++) {
      const z = ((config.pins - 1) * 1.27) / 2 - i * 1.27;
      const points = Array.from({ length: 9 }, (_, j) => {
        const x = -length / 2 + (j * length) / 8;
        return new THREE.Vector3(x, rise(x), z);
      });
      mesh(
        model,
        new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3(points),
          48,
          0.53,
          10,
        ),
        i === 0 ? materials.red : materials.wire,
      ).receiveShadow = false;
    }
    for (const side of ["A", "B"] as const) {
      if (config[`end${side}`] === "socket") model.add(socket(side));
      if (config[`end${side}`] === "custom")
        rounded(
          model,
          11,
          8,
          width + 6,
          materials.ghost,
          side === "A" ? -length / 2 : length / 2,
          0,
          0,
          0.8,
        );
    }
    dimensionGroup = new THREE.Group();
    const z = width / 2 + 13,
      y = -1.7,
      a = -length / 2,
      b = length / 2;
    const lines = new THREE.BufferGeometry();
    lines.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        [
          a,
          y,
          z,
          b,
          y,
          z,
          a,
          y,
          z - 3,
          a,
          y,
          z + 3,
          b,
          y,
          z - 3,
          b,
          y,
          z + 3,
          a,
          y,
          width / 2 + 3,
          a,
          y,
          z - 1,
          b,
          y,
          width / 2 + 3,
          b,
          y,
          z - 1,
        ],
        3,
      ),
    );
    dimensionGroup.add(new THREE.LineSegments(lines, materials.dimension));
    dimensionGroup.visible = dimensions;
    model.add(dimensionGroup);
    anchors = {
      A: new THREE.Vector3(a, 12, 0),
      B: new THREE.Vector3(b, 12, 0),
      dimension: new THREE.Vector3(0, y, z + 2.5),
    };
    const extent = Math.max(length, width + 40, 80);
    key.position.set(extent * 0.3, extent * 0.85, extent * 0.5);
    Object.assign(key.shadow.camera, {
      left: -extent * 0.7,
      right: extent * 0.7,
      top: extent * 0.7,
      bottom: -extent * 0.7,
      near: 0.5,
      far: extent * 4,
    });
    key.shadow.camera.updateProjectionMatrix();
    floor.scale.set((extent * 4) / 2000, (extent * 4) / 2000, 1);
    canvas.dataset.modelReady = "true";
  }
  function fit(keepDirection = false, updateControls = true) {
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov =
      2 * Math.atan(Math.tan(vFov / 2) * Math.max(camera.aspect, 0.1));
    const radius =
      Math.sqrt((config.length + 17) ** 2 + (width + 24) ** 2 + 18 ** 2) / 2;
    let distance = (radius / Math.sin(Math.min(vFov, hFov) / 2)) * 1.1;
    const direction =
      keepDirection && camera.position.length() > 1
        ? camera.position.clone().sub(controls.target).normalize()
        : view === "top"
          ? new THREE.Vector3(0, 1, 0.0001).normalize()
          : view === "endA"
            ? new THREE.Vector3(-1, 0.12, 0.08).normalize()
            : new THREE.Vector3(0.45, 0.75, 1).normalize();
    controls.target.set(0, 0, 0);
    const bounds = new THREE.Box3().setFromObject(model);
    for (let iteration = 0; iteration < 4; iteration++) {
      camera.position.copy(direction).multiplyScalar(distance);
      camera.lookAt(controls.target);
      camera.updateMatrixWorld();
      if (iteration === 3) break;
      let maxX = 0,
        maxY = 0;
      for (const x of [bounds.min.x, bounds.max.x])
        for (const y of [bounds.min.y, bounds.max.y])
          for (const z of [bounds.min.z, bounds.max.z]) {
            const p = new THREE.Vector3(x, y, z).project(camera);
            maxX = Math.max(maxX, Math.abs(p.x));
            maxY = Math.max(maxY, Math.abs(p.y));
          }
      distance *= THREE.MathUtils.clamp(
        Math.max(maxX / 0.82, maxY / 0.72),
        0.45,
        2,
      );
    }
    camera.near = Math.max(0.01, distance / 2000);
    camera.far = distance * 20;
    camera.updateProjectionMatrix();
    controls.minDistance = Math.max(2, Math.min(distance * 0.08, width * 1.2));
    controls.maxDistance = distance * 5;
    if (updateControls) controls.update();
    invalidate();
  }
  function resize() {
    if (!stage.clientWidth || !stage.clientHeight) return;
    renderer.setSize(stage.clientWidth, stage.clientHeight, false);
    camera.aspect = stage.clientWidth / stage.clientHeight;
    camera.updateProjectionMatrix();
    fit(view === "free");
  }
  const onStart = () => {
    view = "free";
    onView(view);
  };
  const onLost = (event: Event) => {
    event.preventDefault();
    onContext(true);
  };
  const onRestored = () => {
    onContext(false);
    invalidate();
  };
  controls.addEventListener("change", invalidate);
  controls.addEventListener("start", onStart);
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);
  build();
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(stage);
  return {
    update(next: IdcConfiguration) {
      const previous = config;
      config = next;
      if (
        ["pins", "length", "color", "endA", "endB", "orientation"].some(
          (key) =>
            previous[key as keyof IdcConfiguration] !==
            config[key as keyof IdcConfiguration],
        )
      ) {
        build();
        fit(view === "free");
      }
      invalidate();
    },
    setView(next: Exclude<IdcView, "free">) {
      view = next;
      onView(view);
      fit();
    },
    setDimensions(next: boolean) {
      dimensions = next;
      dimensionGroup.visible = next;
      invalidate();
    },
    action(action: ViewerAction) {
      const offset = camera.position.clone().sub(controls.target);
      if (action === "rotateLeft" || action === "rotateRight") {
        view = "free";
        onView(view);
        offset.applyAxisAngle(
          new THREE.Vector3(0, 1, 0),
          action === "rotateLeft" ? Math.PI / 9 : -Math.PI / 9,
        );
      } else
        offset.setLength(
          THREE.MathUtils.clamp(
            offset.length() * (action === "zoomIn" ? 0.8 : 1.25),
            controls.minDistance,
            controls.maxDistance,
          ),
        );
      camera.position.copy(controls.target).add(offset);
      controls.update();
      invalidate();
    },
    capturePreview() {
      if (disposed || renderer.getContext().isContextLost()) return null;
      const size = renderer.getSize(new THREE.Vector2());
      const pixelRatio = renderer.getPixelRatio();
      const saved = {
        position: camera.position.clone(),
        quaternion: camera.quaternion.clone(),
        target: controls.target.clone(),
        aspect: camera.aspect,
        near: camera.near,
        far: camera.far,
        minDistance: controls.minDistance,
        maxDistance: controls.maxDistance,
        dimensions: dimensionGroup.visible,
      };
      const width = 1500,
        height = 520;
      try {
        // Fit the full cable at the current angle, independently of screen size or zoom.
        renderer.setPixelRatio(1);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        dimensionGroup.visible = true;
        fit(true, false);
        renderer.render(scene, camera);
        const image = document.createElement("canvas");
        image.width = width;
        image.height = height;
        const context = image.getContext("2d");
        if (!context) return null;
        const background = context.createLinearGradient(0, 0, 0, height);
        background.addColorStop(0, "#f0f3f8");
        background.addColorStop(0.5, "#ffffff");
        background.addColorStop(1, "#f3f6fb");
        context.fillStyle = background;
        context.fillRect(0, 0, width, height);
        context.drawImage(canvas, 0, 0, width, height);
        context.textAlign = "center";
        context.textBaseline = "middle";
        for (const side of ["A", "B", "dimension"] as const) {
          const point = anchors[side].clone().project(camera);
          const x = ((point.x + 1) * width) / 2;
          const y = ((1 - point.y) * height) / 2;
          if (
            point.z < -1 ||
            point.z > 1 ||
            x < 20 ||
            x > width - 20 ||
            y < 20 ||
            y > height - 40
          )
            continue;
          const label = side === "dimension" ? `L ${config.length} mm` : side;
          context.font =
            side === "dimension"
              ? "22px Arial, sans-serif"
              : "bold 24px Arial, sans-serif";
          const labelWidth =
            side === "dimension" ? context.measureText(label).width + 24 : 36;
          const centerY = y + (side === "dimension" ? 22 : -25);
          context.fillStyle = side === "dimension" ? "#f4f6fb" : "#0759dc";
          context.beginPath();
          context.roundRect(
            x - labelWidth / 2,
            centerY - 18,
            labelWidth,
            36,
            5,
          );
          context.fill();
          context.fillStyle = side === "dimension" ? "#344c67" : "#ffffff";
          context.fillText(label, x, centerY);
        }
        return { dataUrl: image.toDataURL("image/png"), width, height };
      } finally {
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(size.x, size.y, false);
        camera.position.copy(saved.position);
        camera.quaternion.copy(saved.quaternion);
        camera.aspect = saved.aspect;
        camera.near = saved.near;
        camera.far = saved.far;
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();
        controls.target.copy(saved.target);
        controls.minDistance = saved.minDistance;
        controls.maxDistance = saved.maxDistance;
        dimensionGroup.visible = saved.dimensions;
        renderer.render(scene, camera);
        positionLabels();
        invalidate();
      }
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(pending);
      observer.disconnect();
      controls.dispose();
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      clearGeometry();
      floor.geometry.dispose();
      shadowMaterial.dispose();
      Object.values(materials).forEach((material) => material.dispose());
      key.shadow.dispose();
      environment.dispose();
      renderer.dispose();
      delete canvas.dataset.modelReady;
    },
  };
}
