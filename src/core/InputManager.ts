export class InputManager {
    private keys: { [key: string]: boolean };
    private mouseX: number;
    private mouseY: number;
    private mouseSensitivity: number;
    private isPointerLocked: boolean;
    private isMouseDown: boolean;

    constructor() {
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseSensitivity = 0.002;
        this.isPointerLocked = false;
        this.isMouseDown = false;

        // 键盘事件监听
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));

        // 鼠标事件监听
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mousedown', (e) => this.onMouseDown(e));
        document.addEventListener('mouseup', (e) => this.onMouseUp(e));
        document.addEventListener('click', () => this.onClick());

        // 添加指针锁定状态变化监听
        document.addEventListener('pointerlockchange', () => {
            this.isPointerLocked = document.pointerLockElement === document.body;
            console.log('Pointer lock state:', this.isPointerLocked);
        });
    }

    private onKeyDown(event: KeyboardEvent): void {
        this.keys[event.code] = true;
    }

    private onKeyUp(event: KeyboardEvent): void {
        this.keys[event.code] = false;
    }

    private onMouseMove(event: MouseEvent): void {
        if (this.isPointerLocked) {
            this.mouseX = event.movementX * this.mouseSensitivity;
            this.mouseY = event.movementY * this.mouseSensitivity;
        }
    }

    private onMouseDown(event: MouseEvent): void {
        if (event.button === 0) { // 左键
            this.isMouseDown = true;
            console.log('Mouse down');
        }
    }

    private onMouseUp(event: MouseEvent): void {
        if (event.button === 0) { // 左键
            this.isMouseDown = false;
            console.log('Mouse up');
        }
    }

    private onClick(): void {
        if (!this.isPointerLocked) {
            document.body.requestPointerLock();
            this.isPointerLocked = true;
        }
    }

    public isKeyPressed(keyCode: string): boolean {
        return this.keys[keyCode] || false;
    }

    public isMouseButtonDown(): boolean {
        return this.isMouseDown;
    }

    public getMouseMovement(): { x: number; y: number } {
        const movement = { x: this.mouseX, y: this.mouseY };
        this.mouseX = 0;
        this.mouseY = 0;
        return movement;
    }
} 