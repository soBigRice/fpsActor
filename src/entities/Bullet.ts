import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { PhysicsWorld } from '../physics/PhysicsWorld';
import { World } from '../world/World';

export class Bullet {
    private mesh: THREE.Mesh;
    private body: CANNON.Body;
    private physicsWorld: PhysicsWorld;
    private world: World;
    private active: boolean;
    private readonly lifetime: number = 2.0; // 子弹生命周期（秒）
    private currentTime: number = 0;

    constructor(position: THREE.Vector3, direction: THREE.Vector3, physicsWorld: PhysicsWorld, world: World) {
        this.physicsWorld = physicsWorld;
        this.world = world;
        this.active = false; // 初始状态设为非激活
        
        // 创建子弹网格
        const geometry = new THREE.SphereGeometry(0.05, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        this.mesh.visible = false; // 初始时不可见

        // 创建物理体
        const shape = new CANNON.Sphere(0.05);
        this.body = new CANNON.Body({
            mass: 0.05, // 减小质量
            shape: shape,
            position: new CANNON.Vec3(position.x, position.y, position.z),
            velocity: new CANNON.Vec3(0, 0, 0),
            linearDamping: 0.05, // 减小阻尼
            material: new CANNON.Material({
                friction: 0.1, // 减小摩擦
                restitution: 0.3 // 减小弹性
            })
        });

        // 添加到物理世界
        this.physicsWorld.addBody(this.body);
    }

    public reset(position: THREE.Vector3, direction: THREE.Vector3): void {
        this.active = true;
        this.currentTime = 0;
        
        // 重置网格位置和可见性
        this.mesh.position.copy(position);
        this.mesh.visible = true;

        // 重置物理体
        this.body.position.set(position.x, position.y, position.z);
        this.body.velocity.set(direction.x * 100, direction.y * 100, direction.z * 100); // 增加初始速度
        this.body.angularVelocity.set(0, 0, 0);
        this.body.quaternion.set(0, 0, 0, 1);
        this.body.wakeUp(); // 确保物理体被唤醒
    }

    public update(delta: number): void {
        if (!this.active) return;

        // 更新生命周期
        this.currentTime += delta;
        if (this.currentTime >= this.lifetime) {
            this.deactivate();
            return;
        }

        // 更新网格位置
        this.mesh.position.copy(this.body.position as any);

        // 检查碰撞
        this.world.checkBulletCollision(this.mesh.position);
    }

    public deactivate(): void {
        if (!this.active) return;
        
        this.active = false;
        this.mesh.visible = false;
        this.body.sleep(); // 让物理体进入睡眠状态
    }

    public isBulletActive(): boolean {
        return this.active;
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }
} 