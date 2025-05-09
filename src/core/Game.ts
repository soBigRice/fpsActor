import * as THREE from 'three';
import { InputManager } from './InputManager';
import { Player } from '../entities/Player';
import { World } from '../world/World';
import { PhysicsWorld } from '../physics/PhysicsWorld';
import Stats from 'three/examples/jsm/libs/stats.module';

export class Game {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private inputManager: InputManager;
    private player: Player;
    private world: World;
    private physicsWorld: PhysicsWorld;
    private clock: THREE.Clock;
    private stats: Stats;

    constructor() {
        // 初始化场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb);
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // 初始化时钟
        this.clock = new THREE.Clock();

        // 初始化物理世界
        this.physicsWorld = new PhysicsWorld();

        // 初始化输入管理器
        this.inputManager = new InputManager();

        // 初始化世界
        this.world = new World(this.scene, this.physicsWorld);

        // 初始化玩家
        this.player = new Player(this.camera, this.inputManager, this.scene, this.physicsWorld, this.world);

        // 创建帧率显示器
        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom);

        // 设置窗口大小调整事件
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    private onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public start(): void {
        this.animate();
    }

    private animate(): void {
        requestAnimationFrame(this.animate.bind(this));

        const delta = this.clock.getDelta();

        this.stats.begin();
        
        // 更新物理世界
        this.physicsWorld.update(delta);

        // 更新玩家
        this.player.update(delta);

        // 更新世界
        this.world.update(delta);
        
        this.stats.end();

        // 渲染场景
        this.renderer.render(this.scene, this.camera);
    }

    public render(): void {
        this.renderer.render(this.scene, this.camera);
    }
} 