// دالة موحدة لإضافة مهمة لأي عمود بناءً على الـ IDs
function setupColumn(buttonId, listId, countId) {
    const addBtn = document.getElementById(buttonId);
    const taskList = document.getElementById(listId);
    const taskCount = document.getElementById(countId);

    if (addBtn && taskList && taskCount) {
        addBtn.addEventListener('click', function() {
            const taskTitle = prompt("Enter task title:");
            
            if (taskTitle && taskTitle.trim() !== "") {
                // إنشاء الكارد الفعلي هنا وتجهيزه للسحب فوراً
                const newCard = document.createElement('div');
                newCard.className = 'task-card';
                newCard.setAttribute('draggable', 'true'); // تفعيل ميزة السحب للبطاقة الجديدة
                
                newCard.innerHTML = `
                    <h4>${taskTitle}</h4>
                    <p>New task description goes here...</p>
                    <span class="badge medium">Medium</span>
                `;
                
                taskList.appendChild(newCard);
                
                // تحديث العداد الخاص بالعمود الحالي
                taskCount.textContent = taskList.getElementsByClassName('task-card').length;
            }
        });
    }
}

// تشغيل الميزة للأعمدة الثلاثة فور تحميل الصفحة
setupColumn('add-todo-btn', 'todo-list', 'todo-count');
setupColumn('add-inprogress-btn', 'inprogress-list', 'inprogress-count');
setupColumn('add-done-btn', 'done-list', 'done-count');

// ==========================================================================
// 2. برمجة ميزة السحب والإفلات (Drag and Drop)
// ==========================================================================

let draggedTask = null;

// الاستماع لحدث بدء السحب على مستوى الصفحة كاملة
document.addEventListener('dragstart', function(e) {
    if (e.target.classList.contains('task-card')) {
        draggedTask = e.target;
        e.target.style.opacity = '0.5'; // جعل البطاقة شبه شفافة أثناء السحب
    }
});

// الاستماع لحدث نهاية السحب لإرجاع المظهر الطبيعي
document.addEventListener('dragend', function(e) {
    if (e.target.classList.contains('task-card')) {
        e.target.style.opacity = '1'; // إرجاع الشفافية لطبيعتها
    }
});

// السماح بالإفلات داخل أعمدة المهام
const columns = document.querySelectorAll('.task-list');
columns.forEach(column => {
    column.addEventListener('dragover', function(e) {
        e.preventDefault(); // خطوة إجبارية للسماح بالإفلات
    });

    column.addEventListener('drop', function(e) {
        e.preventDefault();
        if (draggedTask) {
            // نقل البطاقة فعلياً داخل قائمة العمود الجديد
            column.appendChild(draggedTask);
            
            // تحديث جميع العدادات في اللوحة تلقائياً بعد النقل
            updateAllCounters();
        }
    });
});

// دالة ذكية لتحديث عدادات الأعمدة الثلاثة فوراً
function updateAllCounters() {
    const todoCount = document.getElementById('todo-list').getElementsByClassName('task-card').length;
    const inprogressCount = document.getElementById('inprogress-list').getElementsByClassName('task-card').length;
    const doneCount = document.getElementById('done-list').getElementsByClassName('task-card').length;

    document.getElementById('todo-count').textContent = todoCount;
    document.getElementById('inprogress-count').textContent = inprogressCount;
    document.getElementById('done-count').textContent = doneCount;
}