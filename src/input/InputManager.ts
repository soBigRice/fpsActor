export class InputManager {
    public onMouseDown: (() => void) | null = null;
    private mousePosition: { x: number; y: number } = { x: 0, y: 0 };
    private keys: { [key: string]: boolean } = {};

    constructor() {
        // 添加鼠标移动事件监听器
        document.addEventListener('mousemove', (event) => {
            this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // 添加鼠标按下事件监听器
        document.addEventListener('mousedown', (event) => {
            if (event.button === 0 && this.onMouseDown) { // 左键点击
                this.onMouseDown();
            }
        });

        // 添加键盘事件监听器
        document.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
        });

        document.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
        });
    }

    public getMousePosition(): { x: number; y: number } {
        return this.mousePosition;
    }

    public isKeyPressed(keyCode: string): boolean {
        return this.keys[keyCode] || false;
    }
} 