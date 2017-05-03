import * as path from 'path';
import * as fs from 'fs';
export let run = () => {
    let canvas = document.getElementById("app") as HTMLCanvasElement;
    let stage = dessert.run(canvas);

    let textField = new dessert.TextField();
    textField.text = "Hello,User";
    textField.x = 50;
    textField.y = 50;
    stage.addChild(textField);
    dessert.res.loadConfig("test-project/default.json", () => {
        dessert.res.load("test-project/default.json", (data) => {
            let resourceJson = dessert.res.get("default.json");

            let resource: dessert.res.ResourceData[] = JSON.parse(resourceJson)["resource"];

            for (let res of resource) {//加载所有资源
                dessert.res.load(res.url, (data) => {
                    console.log(data);

                });
            }
            setTimeout(function () {
                refresh(stage);
                //refresh(stage);
            }, 300);

        })
    });
}

var startX = 50;
var startY = 100;
var deltaY = 100;
var deltaX = 100;
var gap = 30;

/**
 * 从data直接得到的文件
 */
var data;
/**
 * data中的"resource"
 */
var booksResource: { name: string, ID: string }[];


function refresh(stage: dessert.DisplayObjectContainer) {
    let container = new dessert.DisplayObjectContainer();
    stage.addChild(container);
    let projectUserPick = path.resolve(__dirname, "../../test-project");
    let configPath = path.join(projectUserPick, "data.config");


    let add_Bitmap = new dessert.Bitmap();
    let refresh_Bitmap = new dessert.Bitmap();
    let save_Bitmap = new dessert.Bitmap();

    add_Bitmap.imageResource = dessert.res.get("add.png");
    refresh_Bitmap.imageResource = dessert.res.get("shuaxin.png");
    save_Bitmap.imageResource = dessert.res.get("save.png");

    add_Bitmap.x = 300;
    add_Bitmap.y = 10;
    refresh_Bitmap.x = 400;
    refresh_Bitmap.y = 10;
    save_Bitmap.x = 500;
    save_Bitmap.y = 10;
    container.addChild(add_Bitmap);
    container.addChild(refresh_Bitmap);
    container.addChild(save_Bitmap);
    refresh_Bitmap.touchEnabled = true;
    refresh_Bitmap.addEventListener(dessert.MouseState.MOUSE_CLICK, () => {
        console.log("刷新");
        stage.removeChild(container);
        refresh(stage);
    });
    save_Bitmap.touchEnabled = true;
    save_Bitmap.addEventListener(dessert.MouseState.MOUSE_CLICK, () => {
        //储存
        console.log("储存");
        data.resource = booksResource;
        let dataContent = JSON.stringify(data, null, "\t");
        fs.writeFileSync(configPath, dataContent, "utf-8");
        alert("储存成功！！！");
    });


    if (!fs.existsSync(configPath)) {
        alert("该文件夹不是有效路径");
    }
    else {
        let dataContent = fs.readFileSync(configPath, "utf-8");

        try {
            data = JSON.parse(dataContent);
        }
        catch (e) {
            alert("配置文件解析失败！")
        }
        if (data) {
            booksResource = data.resource;

            let changeY = startY;
            for (let book of booksResource) {
                //建立一本书
                let book_Item = new BookItem(book.name, book.ID, "delete.png", "bianji.png");
                book_Item.x = startX;
                book_Item.y = changeY;
                changeY += deltaY;
                //添加到屏幕里
                container.addChild(book_Item);
            }

        }
    }
}


class BookItem extends dessert.DisplayObjectContainer {
    bookName: string;
    bookId: string;
    bookTextField: dessert.TextField;
    changeButton: dessert.Bitmap;
    deleteButton: dessert.Bitmap;
    constructor(book_name: string, book_id: string, deleteButton_res: string, bianjiButton_res: string) {
        super();
        //赋值
        this.bookName = book_name;
        this.bookId = book_id;
        //建立文本框
        this.bookTextField = new dessert.TextField();
        this.bookTextField.text = this.bookName;
        // this.bookTextField.x = startX;
        // this.bookTextField.y = startY;
        //建立按钮
        let delete_Bitmap = new dessert.Bitmap();
        let change_Bitmap = new dessert.Bitmap();
        delete_Bitmap.x = 50;
        change_Bitmap.x = 150;
        delete_Bitmap.y = 20;
        change_Bitmap.y = 20;

        delete_Bitmap.imageResource = dessert.res.get(deleteButton_res);
        change_Bitmap.imageResource = dessert.res.get(bianjiButton_res);
        this.deleteButton = delete_Bitmap;
        this.changeButton = change_Bitmap;
        this.addChild(this.bookTextField);
        this.addChild(this.deleteButton);
        this.addChild(this.changeButton);


        this.deleteButton.touchEnabled = true;
        this.deleteButton.addEventListener(dessert.MouseState.MOUSE_CLICK, () => {
            //删除事件
            console.log("删除");
            let copy_booksResource = booksResource;
            for (let book of booksResource) {
                if (this.bookId == book.ID) {
                    let deleteIndex = booksResource.indexOf(book); //in(book);
                    copy_booksResource.splice(deleteIndex, 1);
                    break;
                }
            }
            this.removeChild(this);
            booksResource = copy_booksResource;
        });


        this.changeButton.touchEnabled = true;
        this.changeButton.addEventListener(dessert.MouseState.MOUSE_CLICK, () => {
            //修改事件
            console.log("修改");
            this.bookName = 'geng_gai_cheng_gong';
            this.bookTextField.text = this.bookName;
            let copy_booksResource = booksResource;
            for (let book of copy_booksResource) {
                if (this.bookId == book.ID) {
                    book.name = this.bookName;
                }
            }
            booksResource = copy_booksResource;

        });
    }
}