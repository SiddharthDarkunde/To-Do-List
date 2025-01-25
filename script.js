
        // Task data
        let tasks = [
            { id: 1, name: "Complete project proposal 🎯", project: "Work", completed: false, date: new Date() },
            { id: 2, name: "Buy groceries 🛍️", project: "Personal", completed: false, date: new Date() },
            { id: 3, name: "Schedule dentist appointment 📝", project: "Personal", completed: false, date: new Date(Date.now() + 86400000) }
        ];

        // DOM elements
        const taskList = document.getElementById('taskList');
        const sidebarAddTaskBtn = document.getElementById('sidebarAddTaskBtn');
        const headerAddTaskBtn = document.getElementById('headerAddTaskBtn');
        const addTaskModal = document.getElementById('addTaskModal');
        const newTaskForm = document.getElementById('newTaskForm');
        const closeModal = document.querySelector('.close');
        const toggleSidebarBtn = document.getElementById('toggleSidebar');
        const sidebar = document.getElementById('sidebar');
        const sectionTitle = document.getElementById('sectionTitle');
        const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
        const addProjectBtn = document.getElementById('addProjectBtn');
        const projectList = document.getElementById('projectList');

        let currentSection = 'today';
        let currentProject = null;

        // Render tasks
        function renderTasks() {
            taskList.innerHTML = '';
            const filteredTasks = filterTasks();
            filteredTasks.forEach(task => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
                    <div class="task-text ${task.completed ? 'completed' : ''}">
                        <div>${task.name}</div>
                        <div class="task-project">${task.project}</div>
                    </div>
                    <div class="task-actions">
                        <button onclick="editTask(${task.id})"><i class="fas fa-edit"></i></button>
                        <button onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                taskList.appendChild(li);
            });
        }

        // Filter tasks based on current section and project
        function filterTasks() {
            let filteredTasks = tasks;
            const today = new Date().setHours(0, 0, 0, 0);

            switch (currentSection) {
                case 'inbox':
                    break;
                case 'today':
                    filteredTasks = tasks.filter(task => new Date(task.date).setHours(0, 0, 0, 0) === today);
                    break;
                case 'upcoming':
                    filteredTasks = tasks.filter(task => new Date(task.date).setHours(0, 0, 0, 0) > today);
                    break;
                default:
                    if (currentProject) {
                        filteredTasks = tasks.filter(task => task.project === currentProject);
                    }
            }

            return filteredTasks;
        }

        // Toggle task completion
        function toggleTask(id) {
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.completed = !task.completed;
                renderTasks();
            }
        }

        // Add new task
        function addTask(name, project) {
            const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
            tasks.push({ id: newId, name, project, completed: false, date: new Date() });
            renderTasks();
        }

        // Edit task
        function editTask(id) {
            const task = tasks.find(t => t.id === id);
            if (task) {
                const newName = prompt("Edit task name:", task.name);
                if (newName !== null) {
                    task.name = newName;
                    renderTasks();
                }
            }
        }

        // Delete task
        function deleteTask(id) {
            tasks = tasks.filter(t => t.id !== id);
            renderTasks();
        }

        // Event listeners
        sidebarAddTaskBtn.addEventListener('click', () => {
            addTaskModal.style.display = 'block';
        });

        headerAddTaskBtn.addEventListener('click', () => {
            addTaskModal.style.display = 'block';
        });

        closeModal.addEventListener('click', () => {
            addTaskModal.style.display = 'none';
        });

        newTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('taskName').value;
            const project = document.getElementById('taskProject').value;
            addTask(name, project);
            addTaskModal.style.display = 'none';
            newTaskForm.reset();
        });

        toggleSidebarBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === addTaskModal) {
                addTaskModal.style.display = 'none';
            }
        });

        // Sidebar navigation
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                sidebarLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                if (link.dataset.section) {
                    currentSection = link.dataset.section;
                    currentProject = null;
                    sectionTitle.textContent = link.textContent.trim();
                } else if (link.dataset.project) {
                    currentSection = 'project';
                    currentProject = link.dataset.project;
                    sectionTitle.textContent = link.textContent.trim();
                }
                
                renderTasks();
            });
        });

        // Add project functionality
        addProjectBtn.addEventListener('click', () => {
            const projectName = prompt("Enter new project name:");
            if (projectName) {
                const projectColor = '#' + Math.floor(Math.random()*16777215).toString(16);
                const newProjectLi = document.createElement('li');
                newProjectLi.innerHTML = `<a href="#" data-project="${projectName}"><i class="fas fa-circle" style="color: ${projectColor};"></i> ${projectName}</a>`;
                projectList.appendChild(newProjectLi);

                // Add click event listener to the new project
                newProjectLi.querySelector('a').addEventListener('click', (e) => {
                    e.preventDefault();
                    sidebarLinks.forEach(l => l.classList.remove('active'));
                    e.target.classList.add('active');
                    currentSection = 'project';
                    currentProject = projectName;
                    sectionTitle.textContent = projectName;
                    renderTasks();
                });

                // Add the new project to the task project select options
                const taskProjectSelect = document.getElementById('taskProject');
                const newOption = document.createElement('option');
                newOption.value = projectName;
                newOption.textContent = projectName;
                taskProjectSelect.appendChild(newOption);
            }
        });

        // Initial render
        renderTasks();
    
