// دالة موحدة لإضافة مهمة لأي عمود بناءً على الـ IDs
function setupColumn(buttonId, listId, countId) {
    const addBtn = document.getElementById(buttonId);
    const taskList = document.getElementById(listId);
    const taskCount = document.getElementById(countId);

    if (addBtn && taskList && taskCount) {
        addBtn.addEventListener('click', function() {
            const taskTitle = prompt("Enter task title:");
            
            if (taskTitle && taskTitle.trim() !== "") {
                const newCard = document.createElement('div');
                newCard.className = 'task-card';
                newCard.innerHTML = `
                    <h4>${taskTitle}</h4>
                    <p>New task description goes here...</p>
                    <span class="badge medium">Medium</span>
                `;
                
                taskList.appendChild(newCard);
                
                // تحديث العداد
                taskCount.textContent = taskList.getElementsByClassName('task-card').length;
            }
        });
    }
}

// تشغيل الميزة للأعمدة الثلاثة فور تحميل الصفحة
setupColumn('add-todo-btn', 'todo-list', 'todo-count');
setupColumn('add-inprogress-btn', 'inprogress-list', 'inprogress-count');
setupColumn('add-done-btn', 'done-list', 'done-count');