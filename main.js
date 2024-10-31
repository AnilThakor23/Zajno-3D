import './style.css'
import LocomotiveScroll from 'locomotive-scroll';
const locomotiveScroll = new LocomotiveScroll();
import * as THREE from 'three';
import vertexShader from './shaders/vertexShader.glsl';
import fragmentShader from './shaders/fragmentShader.glsl';
import gsap from 'gsap';

if (window.innerWidth > 1024) {
    const scene = new THREE.Scene();

    const distance = 20;
    const fov = Math.atan(window.innerHeight / 2 / distance)*2  * 180/Math.PI;
    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = distance;

    // Create a renderer and set its size
    const renderer = new THREE.WebGLRenderer({ 
        canvas: document.querySelector('#canvas'),
        antialias: true,
        alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const textureLoader = new THREE.TextureLoader();
    const images = document.querySelectorAll('img');
    const planes = [];
    images.forEach((img) => {
        const texture = textureLoader.load(img.src);
        const rect = img.getBoundingClientRect();
        const geometry = new THREE.PlaneGeometry(rect.width, rect.height);
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTexture: { value: texture },
                uMouse: { value: new THREE.Vector2(0.5, 0.5) },
                uHover: { value: 0 }
            }
        });
        const plane = new THREE.Mesh(geometry, material);
        
        plane.position.set(
            rect.left + rect.width / 2 - window.innerWidth / 2,
            -(rect.top - rect.height / 2 + window.innerHeight / 2),
            0
        );
        
        planes.push(plane);
        scene.add(plane);
    });

    function updatePlanesPosition() {
        planes.forEach((plane, index) => {
            const image = images[index];
            const rect = image.getBoundingClientRect();
            plane.position.set(
                rect.left + rect.width / 2 - window.innerWidth / 2,
                -rect.top - rect.height / 2 + window.innerHeight / 2 ,
                0
            );
            plane.scale.set(rect.width / plane.geometry.parameters.width, rect.height / plane.geometry.parameters.height, 1);
        });
    }

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function animate() {
        requestAnimationFrame(animate);
        updatePlanesPosition();
        renderer.render(scene, camera);
    }
    animate();

    // Handle window resizing
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        updatePlanesPosition();
    });

    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(planes);
        planes.forEach((plane) => {
            gsap.to(plane.material.uniforms.uHover, { value: 0, duration: 0.5 });
        });

        if (intersects.length > 0) {
            const intersectedPlane = intersects[0];
            const uv = intersectedPlane.uv;
            gsap.to(intersectedPlane.object.material.uniforms.uMouse.value, { x: uv.x, y: uv.y, duration: 0.4 });
            gsap.to(intersectedPlane.object.material.uniforms.uHover, { value: 1, duration: 0.4 });
        }
    });
}
else {
    document.querySelector('#canvas').style.display = 'none';
    document.querySelectorAll('img').forEach((img) => {
        img.style.opacity = '1';
    });
}
