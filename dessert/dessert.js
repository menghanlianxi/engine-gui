var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var math;
(function (math) {
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    }());
    math.Point = Point;
    function pointAppendMatrix(point, m) {
        var x = m.a * point.x + m.c * point.y + m.tx;
        var y = m.b * point.x + m.d * point.y + m.ty;
        return new Point(x, y);
    }
    math.pointAppendMatrix = pointAppendMatrix;
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m) {
        var a = m.a;
        var b = m.b;
        var c = m.c;
        var d = m.d;
        var tx = m.tx;
        var ty = m.ty;
        var determinant = a * d - b * c;
        var result = new Matrix(1, 0, 0, 1, 0, 0);
        if (determinant == 0) {
            throw new Error("no invert");
        }
        determinant = 1 / determinant;
        var k = result.a = d * determinant;
        b = result.b = -b * determinant;
        c = result.c = -c * determinant;
        d = result.d = a * determinant;
        result.tx = -(k * tx + c * ty);
        result.ty = -(b * tx + d * ty);
        return result;
    }
    math.invertMatrix = invertMatrix;
    function matrixAppendMatrix(m1, m2) {
        var result = new Matrix();
        result.a = m1.a * m2.a + m1.b * m2.c;
        result.b = m1.a * m2.b + m1.b * m2.d;
        result.c = m2.a * m1.c + m2.c * m1.d;
        result.d = m2.b * m1.c + m1.d * m2.d;
        result.tx = m2.a * m1.tx + m2.c * m1.ty + m2.tx;
        result.ty = m2.b * m1.tx + m2.d * m1.ty + m2.ty;
        return result;
    }
    math.matrixAppendMatrix = matrixAppendMatrix;
    var PI = Math.PI;
    var HalfPI = PI / 2;
    var PacPI = PI + HalfPI;
    var TwoPI = PI * 2;
    var DEG_TO_RAD = Math.PI / 180;
    var Rectangle = (function () {
        function Rectangle(x, y, high, width) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (high === void 0) { high = 0; }
            if (width === void 0) { width = 0; }
            this.x = x;
            this.y = y;
            this.height = high;
            this.width = width;
        }
        Rectangle.prototype.isPointInRectangle = function (point) {
            if (point.x >= this.x &&
                point.x <= this.x + this.width &&
                point.y >= this.y &&
                point.y <= this.y + this.height) {
                return true;
            }
            else {
                return false;
            }
        };
        return Rectangle;
    }());
    math.Rectangle = Rectangle;
    ////     a   b   tx
    ////     c   d   ty
    ////     0   0   1
    var Matrix = (function () {
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }
        Matrix.prototype.toString = function () {
            return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
        };
        Matrix.prototype.updateFromDisplayObject = function (x, y, scaleX, scaleY, rotation) {
            this.tx = x;
            this.ty = y;
            var skewX, skewY;
            skewX = skewY = rotation / 180 * Math.PI;
            var u = Math.cos(skewX);
            var v = Math.sin(skewX);
            this.a = Math.cos(skewY) * scaleX;
            this.b = Math.sin(skewY) * scaleX;
            this.c = -v * scaleY;
            this.d = u * scaleY;
        };
        return Matrix;
    }());
    math.Matrix = Matrix;
})(math || (math = {}));
var dessert;
(function (dessert) {
    /**
     * 事件
     */
    var MyEvent = (function () {
        function MyEvent(type, target, currentTarget, cancelBubble) {
            this.cancelBubble = false;
            this.type = type;
            this.currentTarget = currentTarget;
            this.target = target;
            this.cancelBubble = cancelBubble;
        }
        return MyEvent;
    }());
    dessert.MyEvent = MyEvent;
    var MyTouchevent = (function () {
        function MyTouchevent(Mouse_Event, listener) {
            this.Mouse_Event = Mouse_Event;
            this.listener = listener;
        }
        return MyTouchevent;
    }());
    dessert.MyTouchevent = MyTouchevent;
    var EventDispatcher = (function () {
        function EventDispatcher() {
            //事件组
            this.totalEventArray = [];
        }
        EventDispatcher.prototype.addEventListener = function (type, listener, useCapture) {
            var thisObject = this;
            var event = new MyEvent(type, null, thisObject, useCapture);
            var newTouchEvent = new MyTouchevent(event, listener);
            this.totalEventArray.push(newTouchEvent);
        };
        EventDispatcher.prototype.removeEventListener = function (type, listener, useCapture) {
            var thisObject = this;
            var event = new MyEvent(type, null, thisObject, useCapture);
            var copyArray = this.totalEventArray;
            for (var _i = 0, _a = this.totalEventArray; _i < _a.length; _i++) {
                var currentEvent = _a[_i];
                if (currentEvent.Mouse_Event == event && currentEvent.listener == listener) {
                    var index = this.totalEventArray.indexOf(currentEvent);
                    copyArray.splice(index, 1);
                }
            }
            this.totalEventArray = copyArray;
        };
        //  事件触发器 获取事件流列表
        EventDispatcher.prototype.dispatchEvent = function (event) { };
        //执行事件
        EventDispatcher.eventDispatch = function (e) {
            for (var _i = 0, _a = EventDispatcher.dispatchEventArray; _i < _a.length; _i++) {
                var currentEvent = _a[_i];
                currentEvent.listener(e);
            }
            EventDispatcher.dispatchEventArray = [];
        };
        EventDispatcher.dispatchEventArray = []; //调度用eventArray；
        return EventDispatcher;
    }());
    dessert.EventDispatcher = EventDispatcher;
    (function (MouseState) {
        MouseState[MouseState["MOUSE_UP"] = 1] = "MOUSE_UP";
        MouseState[MouseState["MOUSE_DOWN"] = 2] = "MOUSE_DOWN";
        MouseState[MouseState["MOUSE_MOVE"] = 3] = "MOUSE_MOVE";
        MouseState[MouseState["MOUSE_CLICK"] = 0] = "MOUSE_CLICK";
    })(dessert.MouseState || (dessert.MouseState = {}));
    var MouseState = dessert.MouseState;
})(dessert || (dessert = {}));
var dessert;
(function (dessert) {
    var DisplayObject = (function (_super) {
        __extends(DisplayObject, _super);
        function DisplayObject(type) {
            _super.call(this);
            /**
             * 坐标
             */
            this.x = 0;
            this.y = 0;
            /**
             * 透明度
             */
            this.alpha = 1;
            this.globalAlpha = 1;
            /**
             * 缩放(x,y)
             */
            this.scaleX = 1;
            this.scaleY = 1;
            /**
             * 旋转(度数 0~360)
             */
            this.rotation = 0;
            /**
             * 父容器
             */
            this.parent = null;
            /**
             * 是否可触碰
             */
            this.touchEnabled = false;
            /**
             * 类型
             */
            this.type = "DisplayObject";
            this.type = type;
            this.localMatrix = new math.Matrix(1, 0, 0, 1, 0, 0);
            this.globalMatrix = new math.Matrix(1, 0, 0, 1, 0, 0);
        }
        /**
         * 绘制（矩阵变换）
         */
        DisplayObject.prototype.update = function () {
            this.localMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
            //alpha变化
            if (this.parent) {
                // //alpha变化
                this.globalAlpha = this.parent.globalAlpha * this.alpha;
                //矩阵变化
                this.globalMatrix = math.matrixAppendMatrix(this.localMatrix, this.parent.globalMatrix);
            }
            else {
                this.globalAlpha = this.alpha;
                this.globalMatrix = this.localMatrix;
            }
            var gMatrix = this.globalMatrix;
            DisplayObject.renderList.push(this);
        };
        /**
         * 事件触发器
         */
        DisplayObject.prototype.handle = function (e, type) {
            var x = e.offsetX;
            var y = e.offsetY;
            var targetPoint = new math.Point(x, y);
            var target = this.hitTest(targetPoint);
            var result = target;
            if (result) {
                var event_1 = new dessert.MyEvent(type, target, result); //（type , 当前目标，总目标）
                result.dispatchEvent(event_1); //发属于自己的第一条消息
                while (result.parent) {
                    var currentTarget = result.parent; //
                    event_1 = new dessert.MyEvent(type, target, currentTarget); //为父发消息
                    result.parent.dispatchEvent(event_1); //           发送消息
                    result = result.parent;
                }
                ;
                //没有parent了，开始执行所有listener
                dessert.EventDispatcher.eventDispatch(e);
            }
        };
        /**
         * 事件派发器
         */
        DisplayObject.prototype.dispatchEvent = function (event) {
            for (var _i = 0, _a = this.totalEventArray; _i < _a.length; _i++) {
                var targetEvent = _a[_i];
                if (targetEvent.Mouse_Event.currentTarget == event.currentTarget &&
                    targetEvent.Mouse_Event.type == event.type &&
                    this.touchEnabled == true) {
                    if (targetEvent.Mouse_Event.cancelBubble) {
                        dessert.EventDispatcher.dispatchEventArray.unshift(targetEvent);
                    }
                    else {
                        dessert.EventDispatcher.dispatchEventArray.push(targetEvent);
                    }
                }
                return true;
            }
            return false;
        };
        /**
         * 渲染组
         */
        DisplayObject.renderList = [];
        return DisplayObject;
    }(dessert.EventDispatcher));
    dessert.DisplayObject = DisplayObject;
    var DisplayObjectContainer = (function (_super) {
        __extends(DisplayObjectContainer, _super);
        function DisplayObjectContainer() {
            _super.call(this, "DisplayObjectContainer");
            this.children = [];
        }
        /**
         * 增加子物体
         */
        DisplayObjectContainer.prototype.addChild = function (newObject) {
            this.children.push(newObject);
            newObject.parent = this;
        };
        /**
         * 移除子物体
         */
        DisplayObjectContainer.prototype.removeChild = function (displayObject) {
            var copyArray = this.children;
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var arrayobject = _a[_i];
                if (arrayobject == displayObject) {
                    var objectIndex = this.children.indexOf(arrayobject);
                    copyArray.splice(objectIndex, 1);
                    break;
                }
            }
            this.children = copyArray;
        };
        /**
         * 渲染
         */
        DisplayObjectContainer.prototype.update = function () {
            _super.prototype.update.call(this);
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var drawable = _a[_i];
                drawable.update();
            }
        };
        /**
         * 碰撞检测
         */
        DisplayObjectContainer.prototype.hitTest = function (point) {
            for (var i = this.children.length - 1; i >= 0; i--) {
                var child = this.children[i];
                var invertChildMatrix = math.invertMatrix(this.localMatrix); //逆矩阵
                var pointBaseOnChild = math.pointAppendMatrix(point, invertChildMatrix); //点 * 逆矩阵
                var hitTestResult = child.hitTest(pointBaseOnChild); //点击目标
                if (hitTestResult) {
                    return hitTestResult;
                }
            }
            return null;
        };
        return DisplayObjectContainer;
    }(DisplayObject));
    dessert.DisplayObjectContainer = DisplayObjectContainer;
    /*
          位图
    */
    var Bitmap = (function (_super) {
        __extends(Bitmap, _super);
        function Bitmap() {
            _super.call(this, "Bitmap");
            // this.ImageResource = new ImageResource();
        }
        Bitmap.prototype.hitTest = function (point) {
            var rect = new math.Rectangle();
            rect.width = this.imageResource.width;
            rect.height = this.imageResource.height;
            var invertMatrix = math.invertMatrix(this.localMatrix); //逆矩阵
            var localPoint = math.pointAppendMatrix(point, invertMatrix);
            if (rect.isPointInRectangle(localPoint)) {
                return this;
            }
            else {
                return null;
            }
        };
        return Bitmap;
    }(DisplayObject));
    dessert.Bitmap = Bitmap;
    var ImageResource = (function () {
        function ImageResource(name, width, height, url) {
            this.bitmapData = new Image();
            this.width = width;
            this.height = height;
            this.url = url;
        }
        /**
         * 加载资源
         */
        ImageResource.prototype.load = function () {
            var bitmap = this.bitmapData;
            bitmap.src = this.url;
        };
        ;
        return ImageResource;
    }());
    dessert.ImageResource = ImageResource;
    /*
          文本框
     */
    var TextField = (function (_super) {
        __extends(TextField, _super);
        function TextField() {
            _super.call(this, "TextField");
            this.text = "";
            this.font = "Arial";
            this.size = 24;
            this.textcolor = "#000000";
        }
        Object.defineProperty(TextField.prototype, "width", {
            get: function () {
                return this.text.length * this.size;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "height", {
            get: function () {
                return this.size;
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.hitTest = function (point) {
            var rect = new math.Rectangle();
            rect.width = this.size * this.text.length;
            rect.height = this.size;
            var invertMatrix = math.invertMatrix(this.localMatrix); //逆矩阵
            var localPoint = math.pointAppendMatrix(point, invertMatrix);
            localPoint.y = localPoint.y + this.size;
            if (rect.isPointInRectangle(localPoint)) {
                return this;
            }
            else {
                return null;
            }
        };
        return TextField;
    }(DisplayObject));
    dessert.TextField = TextField;
    /**
     * 图形
     */
    var Shape = (function (_super) {
        __extends(Shape, _super);
        function Shape() {
            _super.call(this, "Shape");
            /**
             * 颜色
             */
            this.color = "#000000";
        }
        ;
        Shape.prototype.hitTest = function (point) {
            var rect = new math.Rectangle();
            rect.width = this.width;
            rect.height = this.height;
            var invertMatrix = math.invertMatrix(this.localMatrix); //逆矩阵
            var localPoint = math.pointAppendMatrix(point, invertMatrix);
            if (rect.isPointInRectangle(localPoint)) {
                return this;
            }
            else {
                return null;
            }
        };
        /**
         * 设置颜色和alpha
         */
        Shape.prototype.beginFill = function (color, alpha) {
            this.color = color;
            this.alpha = alpha;
        };
        /**
         * 绘制方形
         */
        Shape.prototype.drawRect = function (x, y, width, height) {
            this.shapeType = "Rect";
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        };
        return Shape;
    }(DisplayObject));
    dessert.Shape = Shape;
    var MovieClip = (function (_super) {
        __extends(MovieClip, _super);
        function MovieClip(data) {
            var _this = this;
            _super.call(this);
            /**
             * 走过的时间
             */
            this.advancedTime = 0;
            /**
             * 总帧数
             */
            this.TOTAL_FRAME = 0;
            this.ticker = function (deltaTime) {
                _this.advancedTime += deltaTime;
                if (_this.advancedTime >= MovieClip.FRAME_TIME * _this.TOTAL_FRAME) {
                    _this.advancedTime -= MovieClip.FRAME_TIME * _this.TOTAL_FRAME;
                } //走过的时间超过帧动画的总时间，就把走过的时间退回一个总时长，重新播放动画
                _this.currentFrameIndex = Math.floor(_this.advancedTime / MovieClip.FRAME_TIME);
                var data = _this.data;
                var frames = data.frames;
                if (_this.currentFrameIndex > _this.TOTAL_FRAME) {
                    console.log("帧数错误,位置 ： " + _this.currentFrameIndex);
                    return;
                }
                else {
                    var image = frames[_this.currentFrameIndex];
                    _this.imageResource = dessert.res.get(image.image);
                }
            };
            console.log(data);
            this.setMovieClipData(data);
            this.play();
        }
        MovieClip.prototype.play = function () {
            dessert.Ticker.getInstance().register(this.ticker);
        };
        MovieClip.prototype.stop = function () {
            dessert.Ticker.getInstance().unregister(this.ticker);
        };
        MovieClip.prototype.setMovieClipData = function (data) {
            console.log(data);
            this.data = data;
            this.TOTAL_FRAME = this.data.length;
            this.currentFrameIndex = 0;
            // 创建 / 更新 
        };
        /**
         * 每帧时间
         */
        MovieClip.FRAME_TIME = 80;
        return MovieClip;
    }(Bitmap));
    dessert.MovieClip = MovieClip;
})(dessert || (dessert = {}));
var dessert;
(function (dessert) {
    var Ticker = (function () {
        function Ticker() {
            this.listeners = [];
        }
        /**
         * 得到Ticker（全局只有一个）
         */
        Ticker.getInstance = function () {
            if (!Ticker.instance) {
                Ticker.instance = new Ticker();
            }
            return Ticker.instance;
        };
        Ticker.prototype.register = function (listener) {
            this.listeners.push(listener);
        };
        Ticker.prototype.unregister = function (listener) {
            var copyListeners = this.listeners;
            for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
                var currnetListener = _a[_i];
                if (currnetListener == listener) {
                    var listenerIndex = this.listeners.indexOf(currnetListener);
                    copyListeners.splice(listenerIndex, 1);
                    break;
                }
            }
            this.listeners = copyListeners;
        };
        Ticker.prototype.notify = function (deltaTime) {
            for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
                var listener = _a[_i];
                listener(deltaTime);
            }
        };
        return Ticker;
    }());
    dessert.Ticker = Ticker;
})(dessert || (dessert = {}));
var dessert;
(function (dessert) {
    var res;
    (function (res_1) {
        /**
         * 图片处理器
         */
        var ImageProcessor = (function () {
            function ImageProcessor() {
            }
            ImageProcessor.prototype.load = function (url, callback) {
                // let image = document.createElement("img");
                // image.src = url;
                var res = getObjectByUrl(url);
                var imageresource = new dessert.ImageResource(res.name, res.width, res.height, res.url);
                imageresource.load();
                imageresource.bitmapData.onload = function () {
                    callback(imageresource);
                };
            };
            return ImageProcessor;
        }());
        res_1.ImageProcessor = ImageProcessor;
        /**
         * 文本处理器
         */
        var TextProcessor = (function () {
            function TextProcessor() {
            }
            TextProcessor.prototype.load = function (url, callback) {
                var xhr = new XMLHttpRequest();
                xhr.open("get", url);
                xhr.send();
                xhr.onload = function () {
                    callback(xhr.responseText);
                };
            };
            return TextProcessor;
        }());
        res_1.TextProcessor = TextProcessor;
        /**
         * 根据url地址返回类型字符串
         */
        var getTypeByURL = function (url) {
            if ((url.indexOf(".jpg") >= 0) ||
                (url.indexOf(".png") >= 0)) {
                return "image";
            }
            else if (url.indexOf(".mp3") >= 0) {
                return "sound";
            }
            else if (url.indexOf(".json") >= 0) {
                return "text";
            }
        };
        function mapTypeSelector(typeSelector) {
            getTypeByURL = typeSelector;
        }
        res_1.mapTypeSelector = mapTypeSelector;
        /**
         * 缓存，用于储存加载完成的资源
         */
        var cache = {};
        /**
         * resource配置文件
         */
        var resource;
        var isLoaded = false;
        /**
         * 加载，根据url加载资源
         */
        function load(url, callback) {
            var type = getTypeByURL(url);
            var processor = createProcessor(type);
            if (processor != null && isLoaded == true) {
                processor.load(url, function (data) {
                    var name = getNameByUrl(url);
                    cache[name] = data;
                    // cache[url] = data;
                    callback(data);
                });
            }
            else {
                console.log("无法判断的文件类型");
            }
        }
        res_1.load = load;
        /**
         * 根据url,直接从缓存中得到文件
         */
        function get(name) {
            return cache[name];
        }
        res_1.get = get;
        /**
         * hashMap，用于储存文件处理器的类型
         */
        var hashMap = {
            "image": new ImageProcessor(),
            "text": new TextProcessor()
        };
        /**
         * 创建文件处理器（类型名）
         */
        function createProcessor(type) {
            var processor = hashMap[type];
            return processor;
        }
        /**
         * 通过路径获得文件名http://www.111cn.net/wy/js-ajax/65531.htm
         */
        function getNameByUrl(url) {
            var name = url.substr(url.lastIndexOf("/") + 1);
            return name;
        }
        res_1.getNameByUrl = getNameByUrl;
        /**
         * 通过url遍历resource获得对象
         */
        function getObjectByUrl(url) {
            for (var _i = 0, resource_1 = resource; _i < resource_1.length; _i++) {
                var res_2 = resource_1[_i];
                if (res_2.url == url) {
                    return res_2;
                }
            }
            console.log("没找到对象，from getObjectByUrl");
            return null;
        }
        /**
         * 自己设计文件处理器
         */
        function map(type, processor) {
            hashMap[type] = processor;
        }
        res_1.map = map;
        /**
         * 加载配置文件
         */
        function loadConfig(url, callback) {
            if (!isLoaded) {
                var processor = new TextProcessor();
                processor.load(url, function (data) {
                    var mapJson = JSON.parse(data);
                    resource = mapJson["resource"];
                });
                isLoaded = true;
                callback();
            }
            else {
                console.log("错误，已经加载资源文件");
            }
        }
        res_1.loadConfig = loadConfig;
    })(res = dessert.res || (dessert.res = {}));
})(dessert || (dessert = {}));
var RES;
(function (RES) {
    /**
     *  拿到一个名字，用该名字遍历数组找到ImageData，返回ImageResource
     * */
    function getRes(name) {
        var map = ImageLoader.ResourcesFile;
        if (map[name].url != null) {
            map[name].load();
            return map[name];
        }
        else {
            map[name] = new Image();
        }
    }
    RES.getRes = getRes;
    ;
    var ImageLoader = (function () {
        function ImageLoader() {
        }
        ImageLoader.loadImageConfig = function (ResourcesFile) {
            // ImageLoader.ResourcesFile = ResourcesFile;
            for (var _i = 0, ResourcesFile_1 = ResourcesFile; _i < ResourcesFile_1.length; _i++) {
                var image = ResourcesFile_1[_i];
                var name_1 = image.name;
                var type = image.type;
                var width = image.width;
                var height = image.height;
                var url = image.url;
                var imageResource = new dessert.ImageResource(name_1, width, height, url);
                var map = ImageLoader.ResourcesFile;
                map[name_1] = imageResource;
            }
        };
        ImageLoader.ResourcesFile = {};
        return ImageLoader;
    }());
    RES.ImageLoader = ImageLoader;
})(RES || (RES = {}));
var dessert;
(function (dessert) {
    dessert.run = function (canvas) {
        /**
         * 底层容器
         */
        var stage = new dessert.DisplayObjectContainer();
        var context2D = canvas.getContext("2d");
        var lastNow = Date.now(); //记录当前时间
        var render = new Canvas2DRender(stage, context2D);
        var frameHandler = function () {
            var now = Date.now();
            var deltaTime = now - lastNow;
            dessert.Ticker.getInstance().notify(deltaTime); //心跳控制器广播
            render.render();
            lastNow = now;
            window.requestAnimationFrame(frameHandler);
        };
        window.requestAnimationFrame(frameHandler);
        window.onmousedown = function (e) {
            stage.handle(e, dessert.MouseState.MOUSE_DOWN);
            var downX = e.offsetX;
            var downY = e.offsetY;
            window.onmousemove = function (e) {
                stage.handle(e, dessert.MouseState.MOUSE_MOVE);
            };
            window.onmouseup = function (e) {
                stage.handle(e, dessert.MouseState.MOUSE_UP);
                window.onmousemove = function (e) { };
                var upX = e.offsetX;
                var upY = e.offsetY;
                var resultX = Math.abs(upX - downX);
                var resultY = Math.abs(upY - downY);
                if (resultX < 10 &&
                    resultY < 10) {
                    stage.handle(e, dessert.MouseState.MOUSE_CLICK);
                }
            };
        };
        return stage;
    };
    var Canvas2DRender = (function () {
        function Canvas2DRender(stage, context2D) {
            this.stage = stage;
            this.context2D = context2D;
        }
        Canvas2DRender.prototype.render = function () {
            var stage = this.stage;
            var context = this.context2D;
            stage.update();
            context.clearRect(0, 0, 1000, 1000);
            context.save();
            this.renderContainer(stage);
            context.restore();
        };
        Canvas2DRender.prototype.renderContainer = function (stage) {
            // for (let displayObject of DisplayObject.renderList) {
            for (var _i = 0, _a = stage.children; _i < _a.length; _i++) {
                var displayObject = _a[_i];
                var context2D = this.context2D;
                context2D.globalAlpha = displayObject.globalAlpha;
                var m = displayObject.globalMatrix;
                context2D.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                if (displayObject.type == "Bitmap") {
                    this.renderBitmap(displayObject);
                }
                else if (displayObject.type == "TextField") {
                    this.renderTextField(displayObject);
                }
                else if (displayObject.type == "Shape") {
                    this.renderShape(displayObject);
                }
                else if (displayObject.type == "DisplayObjectContainer") {
                    this.renderContainer(displayObject);
                }
            }
        };
        Canvas2DRender.prototype.renderBitmap = function (bitmap) {
            var context = this.context2D;
            if (bitmap.imageResource) {
                context.drawImage(bitmap.imageResource.bitmapData, 0, 0);
            }
        };
        Canvas2DRender.prototype.renderTextField = function (textField) {
            var context = this.context2D;
            context.fillStyle = textField.textcolor;
            context.font = textField.size + "px " + textField.font;
            context.fillText(textField.text, 0, 0);
        };
        Canvas2DRender.prototype.renderShape = function (shape) {
            var context = this.context2D;
            context.fillStyle = shape.color;
            switch (shape.shapeType) {
                case "Rect":
                    context.fillRect(0, 0, shape.width, shape.height);
                    break;
            }
        };
        return Canvas2DRender;
    }());
    dessert.Canvas2DRender = Canvas2DRender;
})(dessert || (dessert = {}));
