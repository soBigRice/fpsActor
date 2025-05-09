import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { PhysicsWorld } from '../physics/PhysicsWorld';

export class Obstacle {
    private mesh: THREE.Mesh;
    private body: CANNON.Body;
    private physicsWorld: PhysicsWorld;
    private active: boolean = true;
    private hitCount: number = 0;
    private readonly maxHits: number = 3; // 需要击中3次才会消失
    private healthBar: HTMLDivElement;
    private healthBarContainer: HTMLDivElement;
    private camera: THREE.PerspectiveCamera;

    constructor(position: THREE.Vector3, size: THREE.Vector3, physicsWorld: PhysicsWorld, camera: THREE.PerspectiveCamera) {
        this.physicsWorld = physicsWorld;
        this.camera = camera;
        
        // 创建障碍物网格
        const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        geometry.computeBoundingBox(); // 计算边界框
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
            mass: 0,
            shape: shape,
            position: new CANNON.Vec3(position.x, position.y, position.z)
        });

        // 添加到物理世界
        this.physicsWorld.addBody(this.body);

        // 创建血条容器
        this.healthBarContainer = document.createElement('div');
        this.healthBarContainer.style.position = 'absolute';
        this.healthBarContainer.style.width = '50px';
        this.healthBarContainer.style.height = '5px';
        this.healthBarContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        this.healthBarContainer.style.borderRadius = '2px';
        this.healthBarContainer.style.overflow = 'hidden';
        this.healthBarContainer.style.pointerEvents = 'none'; // 防止血条影响鼠标事件
        document.body.appendChild(this.healthBarContainer);

        // 创建血条
        this.healthBar = document.createElement('div');
        this.healthBar.style.width = '100%';
        this.healthBar.style.height = '100%';
        this.healthBar.style.backgroundColor = '#00ff00';
        this.healthBar.style.transition = 'width 0.3s ease-in-out';
        this.healthBarContainer.appendChild(this.healthBar);

        // 初始化血条位置
        this.updateHealthBarPosition();
    }

    private updateHealthBarPosition(): void {
        if (!this.active) return;

        // 获取障碍物的顶部中心点
        const topPosition = this.mesh.position.clone();
        topPosition.y += this.mesh.geometry.boundingBox?.max.y || 1; // 使用几何体的边界框高度

        // 将3D位置转换为屏幕坐标
        const vector = topPosition.clone();
        vector.project(this.camera);

        // 检查是否在屏幕内
        if (vector.z < 1) {
            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;

            this.healthBarContainer.style.display = 'block';
            this.healthBarContainer.style.left = `${x - 25}px`; // 居中显示
            this.healthBarContainer.style.top = `${y - 10}px`; // 在障碍物上方显示
        } else {
            // 如果障碍物在屏幕外，隐藏血条
            this.healthBarContainer.style.display = 'none';
        }
    }

    public hit(): boolean {
        if (!this.active) return false;
        
        this.hitCount++;
        const healthPercentage = (this.maxHits - this.hitCount) / this.maxHits * 100;
        this.healthBar.style.width = `${healthPercentage}%`;

        // 根据剩余血量改变颜色
        if (this.hitCount === 1) {
            this.healthBar.style.backgroundColor = '#ffff00'; // 黄色
            (this.mesh.material as THREE.MeshStandardMaterial).color.set(0xffff00);
        } else if (this.hitCount === 2) {
            this.healthBar.style.backgroundColor = '#ff0000'; // 红色
            (this.mesh.material as THREE.MeshStandardMaterial).color.set(0xff0000);
        }

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
        document.body.removeChild(this.healthBarContainer);
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

    public update(): void {
        if (this.active) {
            this.updateHealthBarPosition();
        }
    }
} 