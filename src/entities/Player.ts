import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { InputManager } from '../core/InputManager';
import { Bullet } from './Bullet';
import { PhysicsWorld } from '../physics/PhysicsWorld';
import { World } from '../world/World';

export class Player {
    private camera: THREE.PerspectiveCamera;
    private controls: PointerLockControls;
    private inputManager: InputManager;
    private moveSpeed: number;
    private direction: THREE.Vector3;
    private bullets: Bullet[];
    private scene: THREE.Scene;
    private physicsWorld: PhysicsWorld;
    private world: World;
    private lastShootTime: number;
    private shootCooldown: number;
    private readonly maxBullets: number = 50; // 限制最大子弹数量
    private readonly bulletPool: Bullet[] = []; // 子弹对象池
    private readonly tempVector: THREE.Vector3; // 重用向量对象
    private nextBulletIndex: number = 0; // 下一个要使用的子弹索引
    private crosshair: THREE.Mesh;
    private bulletCount: number = 0;

    constructor(camera: THREE.PerspectiveCamera, inputManager: InputManager, scene: THREE.Scene, physicsWorld: PhysicsWorld, world: World) {
        this.camera = camera;
        this.inputManager = inputManager;
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.world = world;
        this.moveSpeed = 5.0;
        this.direction = new THREE.Vector3();
        this.bullets = [];
        this.lastShootTime = 0;
        this.shootCooldown = 0.2;
        this.tempVector = new THREE.Vector3();

        // 创建准星
        const crosshairGeometry = new THREE.RingGeometry(0.02, 0.03, 32);
        const crosshairMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        this.crosshair = new THREE.Mesh(crosshairGeometry, crosshairMaterial);
        this.crosshair.position.z = -0.5; // 将准星放在相机前方
        this.camera.add(this.crosshair);

        // 初始化PointerLockControls
        this.controls = new PointerLockControls(this.camera, document.body);
        this.scene.add(this.controls.getObject());

        // 设置初始位置
        this.camera.position.set(0, 1.6, 0);

        // 预创建子弹对象池
        for (let i = 0; i < this.maxBullets; i++) {
            const bullet = new Bullet(new THREE.Vector3(), new THREE.Vector3(), this.physicsWorld, this.world);
            this.bulletPool.push(bullet);
            this.scene.add(bullet.getMesh());
        }

        // 添加点击事件监听器
        document.addEventListener('click', () => {
            if (!this.controls.isLocked) {
                this.controls.lock();
            }
        });

        // 添加锁定状态变化监听器
        this.controls.addEventListener('lock', () => {
            console.log('Controls locked');
        });

        this.controls.addEventListener('unlock', () => {
            console.log('Controls unlocked');
        });

        // 添加射击事件监听器
        this.inputManager.onMouseDown = () => {
            if (this.controls.isLocked) {
                this.shoot();
            }
        };
    }

    public update(delta: number): void {
        if (this.controls.isLocked) {
            // 处理键盘移动
            this.direction.z = Number(this.inputManager.isKeyPressed('KeyW')) - Number(this.inputManager.isKeyPressed('KeyS'));
            this.direction.x = Number(this.inputManager.isKeyPressed('KeyD')) - Number(this.inputManager.isKeyPressed('KeyA'));
            this.direction.normalize();

            // 使用controls的移动方法
            this.controls.moveForward(this.direction.z * this.moveSpeed * delta);
            this.controls.moveRight(this.direction.x * this.moveSpeed * delta);

            // 处理射击
            this.handleShooting(delta);
        }

        // 更新子弹
        this.updateBullets();
        
        // 更新物理
        this.updatePhysics(delta);
    }

    private handleShooting(delta: number): void {
        const currentTime = performance.now() / 1000;
        if (this.inputManager.isMouseButtonDown() && currentTime - this.lastShootTime >= this.shootCooldown) {
            this.shoot();
            this.lastShootTime = currentTime;
        }
    }

    private shoot(): void {
        if (this.bulletCount >= this.maxBullets) return;

        const bullet = this.bulletPool[this.bulletCount];
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        
        bullet.reset(this.camera.position, direction);
        this.scene.add(bullet.getMesh());
        this.bulletCount++;
    }

    private updateBullets(): void {
        for (let i = this.bulletCount - 1; i >= 0; i--) {
            const bullet = this.bulletPool[i];
            bullet.update(1/60);
            
            if (!bullet.isBulletActive()) {
                this.scene.remove(bullet.getMesh());
                this.bulletCount--;
                if (i < this.bulletCount) {
                    this.bulletPool[i] = this.bulletPool[this.bulletCount];
                    this.bulletPool[this.bulletCount] = bullet;
                }
            }
        }
    }

    private updatePhysics(delta: number): void {
        // Implementation of updatePhysics method
    }
} 