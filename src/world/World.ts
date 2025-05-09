import * as THREE from 'three';
import { PhysicsWorld } from '../physics/PhysicsWorld';
import { Obstacle } from '../entities/Obstacle';

export class World {
    private scene: THREE.Scene;
    private platform!: THREE.Mesh; // 使用!操作符表示该属性会在构造函数中被初始化
    private physicsWorld: PhysicsWorld;
    private obstacles: Obstacle[] = [];
    private readonly maxObstacles: number = 10;
    private readonly obstacleSpawnInterval: number = 5; // 每5秒尝试生成新障碍物
    private lastSpawnTime: number = 0;
    private score: number = 0;

    constructor(scene: THREE.Scene, physicsWorld: PhysicsWorld) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;

        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // 添加平行光（模拟太阳光）
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        this.createPlatform();
        this.createScoreDisplay();
    }

    private createPlatform(): void {
        // 创建平台几何体
        const platformGeometry = new THREE.BoxGeometry(100, 1, 100);
        const platformMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x808080,
            roughness: 0.8,
            metalness: 0.2
        });
        
        this.platform = new THREE.Mesh(platformGeometry, platformMaterial);
        this.platform.position.y = -0.5; // 将平台稍微下移，使玩家站在平台上
        this.scene.add(this.platform);

        // 添加物理属性
        const platformSize = new THREE.Vector3(100, 1, 100);
        const platformBody = this.physicsWorld.createPlatformBody(this.platform.position, platformSize);

        // 添加网格纹理
        const gridHelper = new THREE.GridHelper(100, 100, 0x000000, 0x000000);
        gridHelper.position.y = 0.01; // 稍微抬高一点，避免z-fighting
        this.scene.add(gridHelper);
    }

    private createScoreDisplay(): void {
        // 创建分数显示
        const scoreElement = document.createElement('div');
        scoreElement.style.position = 'absolute';
        scoreElement.style.top = '20px';
        scoreElement.style.left = '20px';
        scoreElement.style.color = 'white';
        scoreElement.style.fontSize = '24px';
        scoreElement.style.fontFamily = 'Arial';
        scoreElement.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
        scoreElement.id = 'score';
        document.body.appendChild(scoreElement);
        this.updateScoreDisplay();
    }

    private updateScoreDisplay(): void {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = `Score: ${this.score}`;
        }
    }

    private spawnObstacle(): void {
        if (this.obstacles.length >= this.maxObstacles) return;

        // 随机生成位置（在平台范围内）
        const x = (Math.random() - 0.5) * 80;
        const z = (Math.random() - 0.5) * 80;
        const position = new THREE.Vector3(x, 1, z);

        // 随机生成大小
        const size = new THREE.Vector3(
            1 + Math.random() * 2,
            1 + Math.random() * 2,
            1 + Math.random() * 2
        );

        const obstacle = new Obstacle(position, size, this.physicsWorld);
        this.obstacles.push(obstacle);
        this.scene.add(obstacle.getMesh());
    }

    public checkBulletCollision(bulletPosition: THREE.Vector3): void {
        for (const obstacle of this.obstacles) {
            if (!obstacle.isActive()) continue;

            const obstaclePosition = obstacle.getMesh().position;
            const distance = bulletPosition.distanceTo(obstaclePosition);

            // 如果子弹击中障碍物
            if (distance < 1) {
                if (obstacle.hit()) {
                    this.score += 100; // 击毁障碍物得分
                    this.updateScoreDisplay();
                } else {
                    this.score += 10; // 击中但未击毁得分
                    this.updateScoreDisplay();
                }
            }
        }
    }

    public update(delta: number): void {
        // 尝试生成新的障碍物
        const currentTime = performance.now() / 1000;
        if (currentTime - this.lastSpawnTime >= this.obstacleSpawnInterval) {
            this.spawnObstacle();
            this.lastSpawnTime = currentTime;
        }

        // 清理已销毁的障碍物
        this.obstacles = this.obstacles.filter(obstacle => obstacle.isActive());
    }
} 