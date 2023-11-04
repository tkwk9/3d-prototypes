import { onMount } from "solid-js";
import * as THREE from "three";
import "./SvgTest.scss";

const SvgTest = () => {
  let container;

  onMount(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const rectSize = 30;
    const paddingSize = 10;
    const comb = rectSize + paddingSize;

    const svgString = `
    <svg width="${comb * 100}" height="${
      comb * 100
    }" xmlns="http://www.w3.org/2000/svg">
    <!-- Padding around the entire SVG -->
    <rect width="100%" height="100%" fill="#3a3a3a" />
  
    <defs>
      <!-- Inner shadow filter definition -->
      <filter id="inner-shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feComponentTransfer in="SourceAlpha">
          <feFuncA type="table" tableValues="1 0" />
        </feComponentTransfer>
        <feGaussianBlur stdDeviation="2" />
        <feOffset dx="2" dy="2" result="offsetblur" />
        <feFlood flood-color="#000000" result="color" />
        <feComposite in2="offsetblur" operator="in" />
        <feComposite in2="SourceAlpha" operator="in" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode />
        </feMerge>
      </filter>
  
      <rect id="rounded-rect" width="${rectSize}" height="${rectSize}" rx="5" ry="5" style="fill:#9a9a9a; stroke: white; filter:url(#inner-shadow);" />
    </defs>
  
    <g fill="none" stroke="white">
      ${Array.from(
        { length: 100 },
        (_, rowIndex) =>
          `
            ${Array.from(
              { length: 100 },
              (_, colIndex) =>
                `<use href="#rounded-rect" x="${
                  colIndex * (rectSize + paddingSize) + paddingSize / 2
                }" y="${
                  rowIndex * (rectSize + paddingSize) + paddingSize / 2
                }" />`
            ).join("\n       ")}`
      ).join("\n    ")}
    </g>
  </svg>
  

    `;

    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    const loader = new THREE.TextureLoader();
    loader.load(svgUrl, function (texture) {
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
      });

      const planeSize = 30;
      const gridSize = 10;

      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(planeSize, planeSize),
            material
          );
          const xOffset = col * planeSize;
          const yOffset = row * planeSize;
          mesh.position.set(xOffset, -yOffset, 0);
          scene.add(mesh);
        }
      }

      camera.position.z = 5;

      let isPanning = false;

      const render = () => {
        renderer.render(scene, camera);
      };

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      let selectedPoint = new THREE.Vector3();

      const onMouseDown = (event) => {
        isPanning = true;

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        raycaster.ray.intersectPlane(
          new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
          selectedPoint
        );
      };

      const onMouseMove = (event) => {
        if (!isPanning) return;

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const newPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(
          new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
          newPoint
        );

        camera.position.sub(newPoint.sub(selectedPoint));

        requestAnimationFrame(render);
      };

      const onMouseUp = () => {
        isPanning = false;
      };

      container.addEventListener("mousedown", onMouseDown);
      container.addEventListener("mousemove", onMouseMove);
      container.addEventListener("mouseup", onMouseUp);

      const zoomSpeed = 0.1;

      const onMouseWheel = (event) => {
        event.preventDefault();

        const delta = event.wheelDelta
          ? event.wheelDelta / 40
          : event.deltaY
          ? -event.deltaY / 3
          : 0;

        camera.position.z = Math.max(1, camera.position.z + delta * zoomSpeed);
        requestAnimationFrame(render);
      };

      container.addEventListener("wheel", onMouseWheel);

      render();
    });
  });

  return <div class="SvgTest" ref={container} />;
};

export default SvgTest;
