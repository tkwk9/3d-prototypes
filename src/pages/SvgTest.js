import { onMount } from "solid-js";
import * as THREE from "three";
import "./SvgTest.scss";

const SvgTest = () => {
  let container;

  onMount(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    const viewSize = 200;

    const backgroundColor = "#656565";
    const rectColor = "#80b4ad";

    const rectSize = 256;
    const borderRadius = 30;
    const paddingSize = 50;
    const comb = rectSize + paddingSize;
    const rectGridSize = 10;

    const planeSize = 1;
    const planeGridSize = 1;

    const svgString = `
    <svg width="${comb * rectGridSize}" height="${
      comb * rectGridSize
    }" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}" />

      <defs>
        <filter id="inner-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feComponentTransfer in="SourceAlpha">
            <feFuncA type="table" tableValues="1 0" />
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="${40}" />
          <feOffset dx="${-20}" dy="${50}" result="offsetblur" />
          <feFlood flood-color="#000000" result="color" />
          <feComposite in2="offsetblur" operator="in" />
          <feComposite in2="SourceAlpha" operator="in" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode />
          </feMerge>
        </filter>

        <filter id="pop-out-effect" x="-50%" y="-50%" width="200%" height="200%">
          <feConvolveMatrix
            in="SourceGraphic"
            result="convolved"
            order="3"
            kernelMatrix="0 -1 0 -1 5 -1 0 -1 0"
          />
          <feComposite in="convolved" in2="SourceGraphic" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
        </filter>

        <rect id="rounded-rect" width="${rectSize}" height="${rectSize}" rx="${borderRadius}" ry="${borderRadius}" fill="${rectColor}" stroke="#d4d4d4" stroke-width="10" style="filter:url(#inner-shadow);" />
      </defs>

      <g fill="none" stroke="white">
        ${Array.from(
          { length: rectGridSize },
          (_, rowIndex) =>
            `
              ${Array.from(
                { length: rectGridSize },
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

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(`${backgroundColor}`);

    const camera = new THREE.OrthographicCamera(
      (viewSize * aspectRatio) / -2,
      (viewSize * aspectRatio) / 2,
      viewSize / 2,
      viewSize / -2
    );

    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
    camera.zoom = 70;
    camera.updateProjectionMatrix();

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const updateRendererSize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", updateRendererSize);

    const loader = new THREE.TextureLoader();
    loader.load(svgUrl, function (texture) {
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearMipMapLinearFilter;
      renderer.outputEncoding = THREE.sRGBEncoding;
      texture.encoding = THREE.sRGBEncoding;
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
      });

      for (let row = 0; row < planeGridSize; row++) {
        for (let col = 0; col < planeGridSize; col++) {
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
        camera.zoom += delta * zoomSpeed;
        camera.zoom = Math.max(1, camera.zoom);
        camera.updateProjectionMatrix();
        requestAnimationFrame(render);
      };

      container.addEventListener("wheel", onMouseWheel);

      render();
    });
  });

  return <div class="SvgTest" ref={container} />;
};

export default SvgTest;
