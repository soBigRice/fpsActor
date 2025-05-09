import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { PhysicsWorld } from '../physics/PhysicsWorld';

export class Obstacle {
    private mesh: THREE.Mesh;
    private body: CANNON.Body;
    private physicsWorld: PhysicsWorld;
    private active: boolean;
    private hitCount: number = 0;
    private readonly maxHits: number = 3; // 需要击中3次才会消失

    constructor(position: THREE.Vector3, size: THREE.Vector3, physicsWorld: PhysicsWorld) {
        this.physicsWorld = physicsWorld;
        this.active = true;
        
        // 创建障碍物网格
        const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x00ff00,
            roughness: 0.7,
            metalness: 0.3
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);

        // 创建物理体
        const shape = new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2));
        this.body = new CANNON.Body({
            mass: 0, // 静态物体
            shape: shape,
            position: new CANNON.Vec3(position.x, position.y, position.z)
        });

        // 添加到物理世界
        this.physicsWorld.addBody(this.body);
    }

    public hit(): boolean {
        if (!this.active) return false;
        
        this.hitCount++;
        // 根据击中次数改变颜色
        const material = this.mesh.material as THREE.MeshStandardMaterial;
        material.color.setHSL(0.3 * (1 - this.hitCount / this.maxHits), 1, 0.5);
        
        if (this.hitCount >= this.maxHits) {
            this.deactivate();
            return true;
        }
        return false;
    }

    public deactivate(): void {
        if (!this.active) return;
        
        this.active = false;
        this.mesh.visible = false;
        this.physicsWorld.removeBody(this.body);
    }

    public isActive(): boolean {
        return this.active;
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

    public getBody(): CANNON.Body {
        return this.body;
    }
} 