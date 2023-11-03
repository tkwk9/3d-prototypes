import { onMount, createSignal, Index } from "solid-js";
import { createStore } from "solid-js/store";
import anime from "animejs";
import * as THREE from "three";

import "./Base.scss";

const Base = () => {
  let container;

  onMount(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const directionalLight = new THREE.DirectionalLight("#dd7fd2", 1.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const material = new THREE.MeshStandardMaterial({
      roughness: 0.7,
      metalness: 0.0,
    });

    const geometry = new THREE.BoxGeometry();
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    const animate = () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();
  });

  return (
    <div class="Base" ref={container} />
  );
};

export default Base;
