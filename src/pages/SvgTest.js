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

    const svgString = `
    <svg width="5000" height="5000" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#3a3a3a" />

      <defs>
        <!-- Inner shadow filter definition -->
        <filter id="inner-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feComponentTransfer in="SourceAlpha">
            <feFuncA type="table" tableValues="1 0" />
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="2"/>
          <feOffset dx="2" dy="2" result="offsetblur"/>
          <feFlood flood-color="#000000" result="color"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feComposite in2="SourceAlpha" operator="in" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode />
          </feMerge>
        </filter>

        <rect id="rounded-rect" width="40" height="40" rx="5" ry="5" style="fill:#9a9a9a; stroke: white; filter:url(#inner-shadow);"/>
      </defs>
      
      <g fill="none" stroke="white">
        ${Array.from(
          { length: 300 },
          (_, rowIndex) =>
            `<!-- Row ${rowIndex + 1} -->
            ${Array.from(
              { length: 300 },
              (_, colIndex) =>
                `<use href="#rounded-rect" x="${colIndex * 50 + 5}" y="${
                  rowIndex * 50 + 5
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
      const material = new THREE.MeshBasicMaterial(
        {
          map: texture,
          transparent: true,
        }
      );

      const geometry = new THREE.PlaneGeometry(10, 10);

      const mesh = new THREE.Mesh(geometry, material);

      scene.add(mesh);

      camera.position.z = 5;

      let isPanning = false;
      let startPoint = { x: 0, y: 0 };
      let endPoint = { x: 0, y: 0 };
      let translateSpeed = 0.01;

      const render = () => {
        renderer.render(scene, camera);
      };

      const onMouseDown = (event) => {
        isPanning = true;
        startPoint = {
          x: event.clientX,
          y: event.clientY,
        };
      };

      const onMouseMove = (event) => {
        if (!isPanning) return;

        endPoint = {
          x: event.clientX,
          y: event.clientY,
        };

        const deltaX = endPoint.x - startPoint.x;
        const deltaY = endPoint.y - startPoint.y;

        camera.position.x -= deltaX * translateSpeed;
        camera.position.y += deltaY * translateSpeed;

        startPoint = {
          x: endPoint.x,
          y: endPoint.y,
        };

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

        camera.position.z += delta * zoomSpeed;

        camera.position.z = Math.min(Math.max(camera.position.z, 1), 100);
        requestAnimationFrame(render);
      };

      container.addEventListener("wheel", onMouseWheel);

      render();
    });
  });

  return <div class="SvgTest" ref={container} />;
};

export default SvgTest;
