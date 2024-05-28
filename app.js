document.addEventListener('DOMContentLoaded', () => {
    const app = {
        taskTitle: document.getElementById('taskTitle'),
        taskDescription: document.getElementById('taskDescription'),
        taskDueDate: document.getElementById('taskDueDate'),
        taskCategory: document.getElementById('taskCategory'),
        taskPriority: document.getElementById('taskPriority'),
        addTaskButton: document.getElementById('addTaskButton'),
        taskList: document.getElementById('taskList'),
        filterTitle: document.getElementById('filterTitle'),
        filterDueDate: document.getElementById('filterDueDate'),
        filterCategory: document.getElementById('filterCategory'),
        filterPriority: document.getElementById('filterPriority'),
        sortTasks: document.getElementById('sortTasks'),
        tasks: JSON.parse(localStorage.getItem('tasks')) || [],

        init: function() {
            this.addTaskButton.addEventListener('click', this.addTask.bind(this));
            this.filterTitle.addEventListener('input', this.displayFilteredTasks.bind(this));
            this.filterDueDate.addEventListener('change', this.displayFilteredTasks.bind(this));
            this.filterCategory.addEventListener('change', this.displayFilteredTasks.bind(this));
            this.filterPriority.addEventListener('change', this.displayFilteredTasks.bind(this));
            this.sortTasks.addEventListener('change', this.displayFilteredTasks.bind(this));
            this.loadTasks();
        },

        addTaskToList: function(task) {
            const taskItem = document.createElement('div');
            taskItem.className = 'taskItem';
            taskItem.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <small>Due: ${task.dueDate}</small>
                <span>Category: ${task.category}</span>
                <span>Priority: ${task.priority}</span>
            `;
            this.taskList.appendChild(taskItem);
        },

        addTask: function() {
            const title = this.taskTitle.value.trim();
            const description = this.taskDescription.value.trim();
            const dueDate = this.taskDueDate.value;
            const category = this.taskCategory.value;
            const priority = this.taskPriority.value;

            if (!title || !description || !dueDate || !category || !priority) {
                alert('Please fill in all fields correctly.');
                return;
            }

            const task = {
                id: new Date().getTime().toString(),
                title, description, dueDate, category, priority
            };

            this.tasks.push(task);
            this.addTaskToList(task);
            this.saveTasks();
            this.clearInputs();
        },

        clearInputs: function() {
            this.taskTitle.value = '';
            this.taskDescription.value = '';
            this.taskDueDate.value = '';
            this.taskCategory.selectedIndex = 0;
            this.taskPriority.selectedIndex = 0;
        },

        loadTasks: function() {
            this.taskList.innerHTML = '';
            this.tasks.forEach(this.addTaskToList.bind(this));
        },

        displayFilteredTasks: function() {
            const filtered = this.filterTasks();
            const sorted = this.sortTasksList(filtered);
            this.taskList.innerHTML = '';
            sorted.forEach(this.addTaskToList.bind(this));
        },

        filterTasks: function() {
            const titleFilter = this.filterTitle.value.toLowerCase();
            const dueDateFilter = this.filterDueDate.value;
            const categoryFilter = this.filterCategory.value;
            const priorityFilter = this.filterPriority.value;

            return this.tasks.filter(task => {
                return (!titleFilter || task.title.toLowerCase().includes(titleFilter)) &&
                       (!dueDateFilter || task.dueDate === dueDateFilter) &&
                       (!categoryFilter || task.category === categoryFilter) &&
                       (!priorityFilter || task.priority === priorityFilter);
            });
        },

        sortTasksList: function(tasks) {
            const sortBy = this.sortTasks.value;
            return tasks.sort((a, b) => {
                if (sortBy === 'alphabetical') {
                    return a.title.localeCompare(b.title);
                } else if (sortBy === 'reverseAlphabetical') {
                    return b.title.localeCompare(a.title);
                } else if (sortBy === 'soonest') {
                    return new Date(a.dueDate) - new Date(b.dueDate);
                } else { // 'latest'
                    return new Date(b.dueDate) - new Date(a.dueDate);
                }
            });
        },

        saveTasks: function() {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        }
    };

    app.init();
});
