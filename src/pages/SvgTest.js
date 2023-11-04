import { onMount } from "solid-js";
import * as THREE from "three";
import "./SvgTest.scss";

const SvgTest = () => {
  let container;

  onMount(() => {
    const scene = new THREE.Scene();
    // const camera = new THREE.OrthographicCamera(
    //   75,
    //   window.innerWidth / window.innerHeight,
    //   0.1,
    //   1000
    // );
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;

    // Define the size of the orthographic view
    const viewSize = 200; // Adjust as needed based on your scene's dimensions

    // Create an orthographic camera
    const camera = new THREE.OrthographicCamera(
      (viewSize * aspectRatio) / -2, // left
      (viewSize * aspectRatio) / 2, // right
      viewSize / 2, // top
      viewSize / -2, // bottom
      1, // near
      1000 // far
    );

    // Set the camera position and look at a point (adjust as needed)
    camera.position.set(0, 0, 200);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const rectSize = 300;
    const borderRadius = 30;
    const paddingSize = 50;
    const comb = rectSize + paddingSize;
    const gridSize = 10;

    const svgString = `
    <svg width="${comb * gridSize}" height="${
      comb * gridSize
    }" xmlns="http://www.w3.org/2000/svg">
    <!-- Padding around the entire SVG -->
    <rect width="100%" height="100%" fill="#3a3a3a" />
  
    <defs>
      <!-- Inner shadow filter definition -->
      <filter id="inner-shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feComponentTransfer in="SourceAlpha">
          <feFuncA type="table" tableValues="1 0" />
        </feComponentTransfer>
        <feGaussianBlur stdDeviation="${40}" />
        <feOffset dx="${-10}" dy="${50}" result="offsetblur" />
        <feFlood flood-color="#000000" result="color" />
        <feComposite in2="offsetblur" operator="in" />
        <feComposite in2="SourceAlpha" operator="in" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode />
        </feMerge>
      </filter>
  
      <rect id="rounded-rect" width="${rectSize}" height="${rectSize}" rx="${borderRadius}" ry="${borderRadius}" style="fill:#9a9a9a; stroke: white; filter:url(#inner-shadow);" />
    </defs>
  
    <g fill="none" stroke="white">
      ${Array.from(
        { length: gridSize },
        (_, rowIndex) =>
          `
            ${Array.from(
              { length: gridSize },
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

      const planeSize = 1;
      const gridSize = 100;

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

        const delta = -event.deltaY / 3;

        // Adjust the zoom of the orthographic camera
        camera.zoom += delta * zoomSpeed;

        // Limit the zoom level if needed
        camera.zoom = Math.max(1, camera.zoom);

        // Update the camera's projection matrix
        camera.updateProjectionMatrix();

        // Request animation frame to trigger a render
        requestAnimationFrame(render);
      };

      container.addEventListener("wheel", onMouseWheel);

      render();
    });
  });

  return <div class="SvgTest" ref={container} />;
};

export default SvgTest;
