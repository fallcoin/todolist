(function() {
    let itemId = 0; //用来辨识每一个item的id
    window.onload = function() {
        const $ = id => document.getElementById(id);  //document.getElementById()
        
        const Item = function(content, id) {
            this.status = "todo";   //状态默认未完成
            this.content = content; //item内容
            this.id = id;   //识别id
        }
        
        const TodoList = function(inputId = "input", addButtonId = "add", navId = "nav", listId = "list-content", navList = "#nav li", sumId = "sum") {
            this.status = "all";    //标识默认未完成
            this.inputId = $(inputId);  //搜索框
            this.addButtonId = $(addButtonId);  //add按钮
            this.navId = $(navId);  //标签栏
            this.navList = [...document.querySelectorAll(navList)]; //三个状态标签
            this.itemList = []; //所有的todo项
            this.listId = $(listId);    //显示列表
            this.sumId = $(sumId)   //item的数量

            this.addButtonId.addEventListener("click", () => {
                this.addTodoItem(this.inputId);
            });     //当点击confirm后
            this.inputId.onkeypress = (e) => {
                if(e.keyCode === 13) {
                    this.addTodoItem(this.inputId);
                }
            };  //当按下回车后
            this.navId.addEventListener("click", e => {
                if(e.target.dataset.id) //如果点击的是三个标签之一
                    this.changeStatus(e.target.dataset.id, this.navList);
            }); //当点击上面的标签栏时
            this.listId.addEventListener("click", e => {
                if(e.target.classList.contains("status"))   //当点击的是左边的状态标识
                    this.changeItemStatus(e.target.dataset.id); //将item的id传入
                else if(e.target.classList.contains("delete")) //当点击的是右边的删除标识
                    this.deleteItem(e.target.dataset.id)    //将item的id传入
            })  //当点击item时
        }

        TodoList.prototype.addTodoItem = function(inputId = "input") {
            let todoString = inputId.value.trim();
            if(todoString.length === 0) {
                alert("不能为空！");
                inputId.value = "";
                return; //输入为空时结束这个函数
            }   //不为空时继续往下执行
            let currentItem = new Item(todoString, itemId++);   //创建一个item对象，将内容和id传入后，id自增
            this.itemList.push(currentItem);    //把item添加进itemList这个数组
            inputId.value = ""; //清空输入框
            inputId.focus();    //输入框聚焦
            this.load(this.listId, this.sumId); //渲染页面
        }   //添加item

        TodoList.prototype.load = function(listId = "list-content", sumId = "sum") {
            let currentList = [];   //当前状态标识下的数组
            if(this.status === "all")   //当标识为all时
                currentList = this.itemList;    //不论是未完成还是完成的都添加进当前状态标识下的数组
            else {
                currentList = this.itemList.filter(current => current.status === this.status)   //只筛选出指定状态的item添加加进当前标识下的数组
            }
            sumId.innerHTML = currentList.length;   //当前状态标识下的数组的长度 = 数量
            const listHTML = currentList.reduce((html, current) => {
                html += `<li>
                <div class="item">
                    <div class="status ${current.status === "finish" ? "finish" : ""}" data-id="${current.id}"></div>
                    <p class="item-content ${current.status === "finish" ? "content-finish" : ""}">${current.content}</p>
                    <div class="delete" data-id="${current.id}">X</div>
                </div>
            </li>`
            return html;
            }, "")  //初始为""字符串，通过遍历当前状态标识下的数组，累加成一段html代码
            listId.innerHTML = listHTML;    //将html代码渲染到dom节点上
        }   //将数据渲染到列表

        TodoList.prototype.changeStatus = function(status, navList = "#nav li") {
            if(this.status != status) { //当点击的标识不是自身时
                let currentStatus = navList.find(current => current.dataset.id === status);     //获得点击的标识
                navList.forEach(current => current.classList.remove("on")); //把所有标识的聚焦样式取消
                currentStatus.classList.add("on");  //在点击的标识上添加聚焦样式
                this.status = status;   //todolist对象的标识属性更新为点击的标识
                this.load(this.listId, this.sumId); //渲染页面
            }
        }   //切换标签栏的三个标识

        TodoList.prototype.changeItemStatus = function(id) {
            let item = this.itemList.find(current => id == current.id); //通过id找到对应的item
            item.status === "todo" ? (item.status = "finish") : (item.status = "todo"); //如果当前状态为todo的话，就改为finish，否则改为todo
            this.load(this.listId, this.sumId); //渲染页面
        }   //改变item的状态

        TodoList.prototype.deleteItem = function(id) {
            let index = this.itemList.findIndex(current => id == current.id);   //通过id找到对应的item在数组的下标
            this.itemList.splice(index,1);  //再通过下标将其删除
            this.load(this.listId, this.sumId); //渲染页面
        }   //删除item

        let todoList = new TodoList("input", "add", "nav", "list-content", "#nav li", "sum");  //实例化TodoList对象
    }
})();