function ToDosRecord(name) {
    this.name = name;
    this.status = false;
    this.id = Math.random().toString();
}

function ToDos() {
    this.todos = [];
    this.add = function(name, status) {
        const record = new ToDosRecord(name, status)
        this.todos.push(record);
    }
    this.remove = function(record) {
        let index = this.todos.indexOf(record)
        if (index !== -1) {
            this.todos.splice(index, 1);
        }
    }

    this.toggleStatus = function(id) {
        const item = this.todos.find(function(item) {
            return item.id === id;
        });
        if (item) {
            item.status = !item.status;
        }
    }
}

function ElementBuilder(name) {
    this.element = document.createElement(name);
    this.type = function(type) {
        this.type = type;
        return this;
    }
    this.text = function(text) {
        this.element.textContent = text;

        return this;
    }

    this.className = function(name) {
        this.element.className = name;
        return this;
    }
    this.placeholder = function(text) {
        this.element.placeholder = text;
        return this;
    }
    this.html = function(html) {
        this.element.innerHTML = html;
        return this;
    }
    this.appendTo = function(parent) {
        parent.appendChild(this.element);
        return this;
    }
    this.build = function(params) {
        return this.element;
    }
    this.hide = function() {
        this.element.style.display = 'none';
        return this;
    }
    this.show = function() {
        this.element.style.display = 'block';
        return this;
    }
    this.onEvent = function(event, fn) {
        this.element.addEventListener(event, fn)
        return this;
    }

}
const builder = {
    create: function(name) {
        return new ElementBuilder(name);
    },
};

function TooDoCreate(container) {
    this.container = container;
    const todoItem = new ToDos();
    let list = null

    function createList(recordsList) {
        list.innerHTML = ' ';

        recordsList.forEach(function(record) {
            const taskId = record.id;


            const li = builder
                .create('li')
                .appendTo(list)
                .className(record.status ? "li-item selected" : "li-item")
                .onEvent('click', function(record) {
                    todoItem.toggleStatus(taskId);

                    createList(todoItem.todos);

                    console.log(todoItem.todos)
                })
                .build();


            const listItem = builder
                .create('div')
                .className('')
                .appendTo(li)
                .build();
            const name = builder
                .create('div')
                .text(`${record.name }`)
                .className(' name')
                .appendTo(listItem);
            const deletedItem = builder
                .create('button')
                .text('x')
                .className(' close')
                .appendTo(listItem)
                .onEvent('click', function(params) {
                    todoItem.remove(record);
                    createList(todoItem.todos);
                })
                .build()

        });

    }

    this.init = function() {
        const todo = document.getElementById('app');

        const addTodo = builder.
        create('div')
            .className('center')
            .appendTo(todo)
            .build();

        const header = builder
            .create('h3')
            .text('To-Do List')
            .className('header')
            .appendTo(addTodo)
            .build()

        const input = builder
            .create('input')
            .type('text')
            .placeholder('new task')
            .className('input-text')
            .appendTo(addTodo)

        .onEvent('keyup', function(e) {
            if (e.keyCode === 13) {
                list.html = '';
                list.style.display = 'block';
                const name = input.value;
                todoItem.add(name);
                createList(todoItem.todos);
                input.value = '';
            }

        }).build()

        list = builder
            .create('ul')
            .appendTo(todo)

        .className('list-Item')
            .hide()
            .build();

        const btn = builder
            .create('button')
            .type('button')
            .text('ADD')
            .className('btn')
            .appendTo(addTodo)
            .onEvent('click', function(params) {
                list.html = '';
                list.style.display = 'block';
                const name = input.value;
                todoItem.add(name);
                createList(todoItem.todos);
                input.value = '';
            })
            .build()



    }
}
const container = document.getElementById('app');
const app = new TooDoCreate(container);
app.init();