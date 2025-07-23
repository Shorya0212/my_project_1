document.addEventListener("DOMContentLoaded", () => {
    const taskinput = document.getElementById('task-input');
    const addtaskbtn = document.getElementById('add-task-btn');
    const tasklist = document.getElementById('task_list');
    const emptyimg = document.querySelector('.empty-image');
    const todocont = document.querySelector('.todo-container');
    const numbers = document.getElementById('numbers');
    const progress = document.getElementById('progress');

    
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasklist.innerHTML = '';
        tasks.forEach(task => {
            const li = createTaskElement(task.text, task.completed);
            tasklist.appendChild(li);
        });
        toggleemptystate();
    };

    
    const saveTasks = () => {
        const tasks = Array.from(tasklist.children).map(li => {
            return {
                text: li.querySelector("span").textContent,
                completed: li.querySelector(".checkbox").checked
            };
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    
    const createTaskElement = (text, completed = false) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${completed ? "checked" : ""}>
            <span>${text}</span>
            <div class="task-btn">
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        const checkbox = li.querySelector('.checkbox');
        checkbox.addEventListener('change', () => {
            updateProgress();
            saveTasks();
        });

        const editbtn = li.querySelector('.edit-btn');
        editbtn.addEventListener('click', () => {
            if (!checkbox.checked) {
                taskinput.value = li.querySelector('span').textContent;
                li.remove();
                toggleemptystate();
                saveTasks();
            }
        });

        const deletebtn = li.querySelector('.delete-btn');
        deletebtn.addEventListener('click', () => {
            li.remove();
            toggleemptystate();
            saveTasks();
        });

        return li;
    };

    
    const updateProgress = () => {
        const totalTasks = tasklist.children.length;
        const completedTasks = Array.from(tasklist.children)
            .filter(li => li.querySelector('.checkbox').checked).length;

        numbers.textContent = `${completedTasks}/${totalTasks}`;
        const percentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
        progress.style.width = `${percentage}%`;
    };

    
    const toggleemptystate = () => {
        emptyimg.style.display = tasklist.children.length === 0 ? 'block' : 'none';
        todocont.style.width = tasklist.children.length > 0 ? '100%' : '50%';
        updateProgress();
    };

    
    const addtask = (event) => {
        event.preventDefault();
        const tasktext = taskinput.value.trim();
        if (!tasktext) return;

        const li = createTaskElement(tasktext);
        tasklist.appendChild(li);
        taskinput.value = '';
        toggleemptystate();
        saveTasks();
    };

    
    addtaskbtn.addEventListener("click", addtask);
    taskinput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            addtask(e);
        }
    });

    
    loadTasks();
});
