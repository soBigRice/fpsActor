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
        this.updateBullets(delta);
    }

    private handleShooting(delta: number): void {
        const currentTime = performance.now() / 1000;
        if (this.inputManager.isMouseButtonDown() && currentTime - this.lastShootTime >= this.shootCooldown) {
            this.shoot();
            this.lastShootTime = currentTime;
        }
    }

    private shoot(): void {
        // 检查是否达到最大子弹数
        if (this.bullets.length >= this.maxBullets) {
            return;
        }

        // 从对象池中获取下一个可用的子弹
        let bullet = this.bulletPool[this.nextBulletIndex];
        
        // 如果当前子弹还在使用中，尝试找到下一个可用的子弹
        if (bullet.isBulletActive()) {
            // 遍历对象池找到第一个未激活的子弹
            for (let i = 0; i < this.maxBullets; i++) {
                const index = (this.nextBulletIndex + i) % this.maxBullets;
                if (!this.bulletPool[index].isBulletActive()) {
                    bullet = this.bulletPool[index];
                    this.nextBulletIndex = (index + 1) % this.maxBullets;
                    break;
                }
            }
            
            // 如果所有子弹都在使用中，直接返回
            if (bullet.isBulletActive()) {
                return;
            }
        } else {
            this.nextBulletIndex = (this.nextBulletIndex + 1) % this.maxBullets;
        }
        
        // 设置子弹位置和方向
        this.tempVector.set(0, 0, -1).applyQuaternion(this.camera.quaternion);
        const bulletStartPos = this.camera.position.clone().add(this.tempVector.clone().multiplyScalar(0.5));
        
        bullet.reset(bulletStartPos, this.tempVector.clone());
        this.bullets.push(bullet);
    }

    private updateBullets(delta: number): void {
        // 更新所有子弹
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.update(delta);

            // 移除不活跃的子弹
            if (!bullet.isBulletActive()) {
                this.bullets.splice(i, 1);
            }
        }
    }
} 