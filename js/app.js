// import * as THREE from 'three';
import * as THREE from '../node_modules/three/build/three.module.js';
import vertexShader from './shaders/vertexShader.glsl';
import fragmentShader from './shaders/fragmentShader.glsl';


class app3 {
    constructor() {
        this.container = document.querySelector('main');
        this.scene = new THREE.Scene();
        this.mesh = null;
        this.meshes = [];
        
        this.mouse = new THREE.Vector2(0.5, 0.5);
        this.time = 0;
        this.walkX = 0;
        this.x = 0;
        this.endX = 0;
        this.isDown = false;
        this.startX = 0;
        this.velocity = 0;

        this. LENGTH = 10;
        this. WIDTH = 320;
        this. SPACING = 80;
        this. WIDTH_TOTAL = (this.WIDTH + this.SPACING) * this.LENGTH;

        this.init();
    }

    init() {
        this.mousePosition();
        this.createCamera();
        this.createRenderer();
        this.createMesh();
        this.render();

        this.drug();
    }

    get viewport(){
        let width = window.innerWidth;
        let height = window.innerHeight;
        let aspectRatio = width / height;

        return{
            width,
            height,
            aspectRatio
        }
    }

    mousePosition() {
            window.addEventListener('mousemove', (event) => {
            this.mouse.x = event.clientX - this.viewport.width / 2;
            this.mouse.y = this.viewport.height / 2 - event.clientY;
        });
    }

    createCamera() {
        let perspective = 1000;
        let fov = (180 * (2 * Math.atan(this.viewport.height / 2 / perspective))) / Math.PI;
        this.camera = new THREE.PerspectiveCamera(fov, this.viewport.aspectRatio, 1, 1000);
        this.camera.position.z = perspective;
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        // this.renderer.setClearColor(0x000000);
        this.renderer.setSize(this.viewport.width, this.viewport.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
    }
    createMesh() {
        for (let i = 0; i < 10; i++) {
            const geometry = new THREE.PlaneGeometry(320, 180, 32, 32);
            const material = new THREE.MeshBasicMaterial({
                color: 0x000000,
                side: THREE.DoubleSide
            });
            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.position.x = i * 400 - (10 * 400 / 2);
            this.meshes.push(this.mesh);
            this.scene.add(this.mesh);
        }
    }

    drug() {
        this.isDown = false;

        window.addEventListener('mousedown', (e) => {
            this.isDown = true;
            this.startX = e.pageX;
            this.velocity = 0; // Reset velocity on new drag
        });

        window.addEventListener('mouseleave', () => {
            this.isDown = false;
        });

        window.addEventListener('mouseup', () => {
            this.isDown = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.isDown) return;
            e.preventDefault();
            this.endX = e.pageX;
            this.velocity = (this.endX - this.startX) * 1.2;
            this.startX = this.endX;
        });
    }

    posReset() {
        // メッシュの位置を調整して画面内に収める
        this.meshes.forEach((mesh , index) => {
            // メッシュのx座標を取得
            const x = mesh.position.x;
            // サイン波による変位を計算
            const s = Math.sign(x);
            // 全体の幅でモジュロ演算して画面内に収める
            const mx = (x + (this.WIDTH_TOTAL / 2) * s) % this.WIDTH_TOTAL;
            // サイン波の変位を戻して最終位置を計算
            const rx = mx - (this.WIDTH_TOTAL / 2) * s;
            mesh.position.x = rx;
        });
    }

    render() {
        this.time += 0.01;
        this.renderer.render(this.scene, this.camera);

        // Apply velocity to mesh positions
        this.meshes.forEach(mesh => {
            mesh.position.x += this.velocity;
        });

        // Decay velocity for inertia effect
        this.velocity *= 0.97; // Adjust decay factor as needed

        this.posReset();
        requestAnimationFrame(this.render.bind(this));
    }


    lerp(a, b, n) {
        return (1 - n) * a + n * b;
    }

}

new app3();
