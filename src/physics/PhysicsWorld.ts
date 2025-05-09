import * as CANNON from 'cannon-es';
import * as THREE from 'three';

export class PhysicsWorld {
    private world: CANNON.World;
    private bodies: Map<CANNON.Body, THREE.Object3D>;

    constructor() {
        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -2.0, 0)
        });
        this.bodies = new Map();
    }

    public update(delta: number): void {
        this.world.step(1/60, delta, 3);
    }

    public addBody(body: CANNON.Body): void {
        this.world.addBody(body);
    }

    public removeBody(body: CANNON.Body): void {
        this.world.removeBody(body);
    }

    public createGroundBody(size: number): CANNON.Body {
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({
            mass: 0,
            shape: groundShape
        });
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.world.addBody(groundBody);
        return groundBody;
    }

    public createPlatformBody(position: THREE.Vector3, size: THREE.Vector3): CANNON.Body {
        const shape = new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2));
        const body = new CANNON.Body({
            mass: 0,
            shape: shape,
            position: new CANNON.Vec3(position.x, position.y, position.z)
        });
        this.world.addBody(body);
        return body;
    }
} 