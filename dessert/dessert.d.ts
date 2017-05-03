declare namespace math {
    class Point {
        x: number;
        y: number;
        constructor(x: number, y: number);
    }
    function pointAppendMatrix(point: Point, m: Matrix): Point;
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m: Matrix): Matrix;
    function matrixAppendMatrix(m1: Matrix, m2: Matrix): Matrix;
    class Rectangle {
        x: number;
        y: number;
        height: number;
        width: number;
        constructor(x?: number, y?: number, high?: number, width?: number);
        isPointInRectangle(point: math.Point): boolean;
    }
    class Matrix {
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;
        toString(): string;
        updateFromDisplayObject(x: number, y: number, scaleX: number, scaleY: number, rotation: number): void;
    }
}
declare namespace dessert {
    interface IEventDispatcher {
        /**
         * 注册事件监听器
         */
        addEventListener(type: MouseState, listener: (e?: MouseEvent) => void, useCapture?: boolean): any;
        /**
         * 移除事件监听器
         */
        removeEventListener(type: MouseState, listener: (e?: MouseEvent) => void, useCapture?: boolean): any;
        /**
         * 时间派发器
         */
        dispatchEvent(event: MyEvent): any;
    }
    /**
     * 事件
     */
    class MyEvent {
        currentTarget: IEventDispatcher;
        target: IEventDispatcher;
        type: MouseState;
        cancelBubble: boolean;
        constructor(type: MouseState, target: IEventDispatcher, currentTarget: IEventDispatcher, cancelBubble?: boolean);
    }
    class MyTouchevent {
        /**
         * 鼠标事件
         */
        Mouse_Event: MyEvent;
        /**
         * 函数
         */
        listener: (e?: MouseEvent) => void;
        constructor(Mouse_Event: MyEvent, listener: (e?: MouseEvent) => void);
    }
    class EventDispatcher implements IEventDispatcher {
        totalEventArray: MyTouchevent[];
        static dispatchEventArray: MyTouchevent[];
        addEventListener(type: MouseState, listener: (e?: MouseEvent) => void, useCapture?: boolean): void;
        removeEventListener(type: MouseState, listener: Function, useCapture?: boolean): void;
        dispatchEvent(event: MyEvent): void;
        static eventDispatch(e: MouseEvent): void;
    }
    enum MouseState {
        MOUSE_UP = 1,
        MOUSE_DOWN = 2,
        MOUSE_MOVE = 3,
        MOUSE_CLICK = 0,
    }
}
declare namespace dessert {
    interface Drawable {
        update(): any;
        hitTest(point: math.Point): DisplayObject;
    }
    abstract class DisplayObject extends EventDispatcher implements Drawable {
        /**
         * 坐标
         */
        x: number;
        y: number;
        /**
         * 透明度
         */
        alpha: number;
        globalAlpha: number;
        /**
         * 缩放(x,y)
         */
        scaleX: number;
        scaleY: number;
        /**
         * 旋转(度数 0~360)
         */
        rotation: number;
        /**
         * 相对位置矩阵
         */
        localMatrix: math.Matrix;
        /**
         * 全球位置矩阵
         */
        globalMatrix: math.Matrix;
        /**
         * 父容器
         */
        parent: DisplayObjectContainer;
        /**
         * 是否可触碰
         */
        touchEnabled: boolean;
        /**
         * 类型
         */
        type: string;
        /**
         * 渲染组
         */
        static renderList: DisplayObject[];
        constructor(type: string);
        /**
         * 绘制（矩阵变换）
         */
        update(): void;
        /**
         * 事件触发器
         */
        handle(e: MouseEvent, type: MouseState): void;
        /**
         * 事件派发器
         */
        dispatchEvent(event: MyEvent): boolean;
        abstract hitTest(point: math.Point): DisplayObject;
    }
    class DisplayObjectContainer extends DisplayObject {
        children: DisplayObject[];
        constructor();
        /**
         * 增加子物体
         */
        addChild(newObject: any): void;
        /**
         * 移除子物体
         */
        removeChild(displayObject: DisplayObject): void;
        /**
         * 渲染
         */
        update(): void;
        /**
         * 碰撞检测
         */
        hitTest(point: math.Point): DisplayObject;
    }
    class Bitmap extends DisplayObject {
        imageResource: ImageResource;
        constructor();
        hitTest(point: math.Point): DisplayObject;
    }
    class ImageResource {
        bitmapData: HTMLImageElement;
        name: string;
        width: number;
        height: number;
        url: string;
        constructor(name: string, width: number, height: number, url: string);
        /**
         * 加载资源
         */
        load(): void;
    }
    class TextField extends DisplayObject {
        text: string;
        font: string;
        size: number;
        textcolor: string;
        width: number;
        height: number;
        constructor();
        hitTest(point: math.Point): DisplayObject;
    }
    /**
     * 图形
     */
    class Shape extends DisplayObject {
        /**
         * 图形宽度
         */
        width: number;
        /**
         * 图形高度
         */
        height: number;
        /**
         * 颜色
         */
        color: string;
        /**
         * 形状
         */
        shapeType: string;
        constructor();
        hitTest(point: math.Point): DisplayObject;
        /**
         * 设置颜色和alpha
         */
        beginFill(color: string, alpha: number): void;
        /**
         * 绘制方形
         */
        drawRect(x: number, y: number, width: number, height: number): void;
    }
    type MovieClipData = {
        name: string;
        frames: MovieClipFrameData[];
    };
    type MovieClipFrameData = {
        "image": string;
    };
    class MovieClip extends Bitmap {
        /**
         * 走过的时间
         */
        private advancedTime;
        /**
         * 每帧时间
         */
        private static FRAME_TIME;
        /**
         * 总帧数
         */
        private TOTAL_FRAME;
        /**
         * 当前帧
         */
        private currentFrameIndex;
        /**
         * 动画信息
         */
        private data;
        constructor(data: dessert.res.FramesData);
        ticker: (deltaTime: number) => void;
        play(): void;
        stop(): void;
        setMovieClipData(data: dessert.res.FramesData): void;
    }
}
declare namespace dessert {
    type Ticker_Listener_Type = (deltaTime: number) => void;
    class Ticker {
        private static instance;
        /**
         * 得到Ticker（全局只有一个）
         */
        static getInstance(): Ticker;
        listeners: Ticker_Listener_Type[];
        register(listener: Ticker_Listener_Type): void;
        unregister(listener: Ticker_Listener_Type): void;
        notify(deltaTime: number): void;
    }
}
declare namespace dessert.res {
    /**
     * 文件处理器接口
     */
    interface Processor {
        load(url: string, callback: Function): void;
    }
    /**
     * 图片处理器
     */
    class ImageProcessor implements Processor {
        load(url: string, callback: Function): void;
    }
    /**
     * 文本处理器
     */
    class TextProcessor implements Processor {
        load(url: string, callback: Function): void;
    }
    function mapTypeSelector(typeSelector: (url: string) => string): void;
    /**
     * 加载，根据url加载资源
     */
    function load(url: string, callback: (data: any) => void): void;
    /**
     * 根据url,直接从缓存中得到文件
     */
    function get(name: string): any;
    /**
     * 通过路径获得文件名http://www.111cn.net/wy/js-ajax/65531.htm
     */
    function getNameByUrl(url: string): string;
    /**
     * 自己设计文件处理器
     */
    function map(type: string, processor: Processor): void;
    /**
     * 加载配置文件
     */
    function loadConfig(url: string, callback: Function): void;
    /**
     * 配置文件中文件标准格式
     */
    type ResourceData = {
        name: string;
        type: string;
        url: string;
    };
    type ImageData = {
        image: string;
        width: number;
        height: number;
    };
    type FramesData = {
        name: string;
        length: number;
        frames: ImageData[];
    };
}
declare namespace RES {
    /**
     *  拿到一个名字，用该名字遍历数组找到ImageData，返回ImageResource
     * */
    function getRes(name: string): dessert.ImageResource;
    type ImageData = {
        name: string;
        type: string;
        url: string;
        width: number;
        height: number;
    };
    class ImageLoader {
        static ResourcesFile: {};
        static loadImageConfig(ResourcesFile: ImageData[]): void;
    }
}
declare namespace dessert {
    let run: (canvas: HTMLCanvasElement) => DisplayObjectContainer;
    class Canvas2DRender {
        private stage;
        private context2D;
        constructor(stage: DisplayObjectContainer, context2D: CanvasRenderingContext2D);
        render(): void;
        renderContainer(stage: DisplayObjectContainer): void;
        private renderBitmap(bitmap);
        private renderTextField(textField);
        private renderShape(shape);
    }
}
