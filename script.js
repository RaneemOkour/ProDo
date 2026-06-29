// ==========================================================================
// 1. دالة إضافة المهام وحفظها وتحديث العدادات
// ==========================================================================

function setupColumn(buttonId, listId, countId) {
    const addBtn = document.getElementById(buttonId);
    const taskList = document.getElementById(listId);

    if (addBtn && taskList) {
        addBtn.addEventListener('click', function() {
            const taskTitle = prompt("Enter task title:");
            
            if (taskTitle && taskTitle.trim() !== "") {
                createTaskCard(taskTitle, "New task description goes here...", "Medium", listId);
                
                // حفظ التغييرات فوراً في ذاكرة المتصفح
                saveBoardState();
            }
        });
    }
}

// دالة فرعية لبناء بطاقة HTML وحقنها في العمود المناسب
function createTaskCard(title, description, priority, columnId) {
    const taskList = document.getElementById(columnId);
    if (!taskList) return;

    const newCard = document.createElement('div');
    newCard.className = 'task-card';
    newCard.setAttribute('draggable', 'true');
    
    newCard.innerHTML = `
        <h4>${title}</h4>
        <p>${description}</p>
        <span class="badge ${priority.toLowerCase()}">${priority}</span>
    `;
    
    taskList.appendChild(newCard);
    updateAllCounters();
}

// ==========================================================================
// 2. برمجة ميزة السحب والإفلات (Drag and Drop)
// ==========================================================================

let draggedTask = null;

document.addEventListener('dragstart', function(e) {
    if (e.target.classList.contains('task-card')) {
        draggedTask = e.target;
        e.target.style.opacity = '0.5';
    }
});

document.addEventListener('dragend', function(e) {
    if (e.target.classList.contains('task-card')) {
        e.target.style.opacity = '1';
    }
});

const columns = document.querySelectorAll('.task-list');
columns.forEach(column => {
    column.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    column.addEventListener('drop', function(e) {
        e.preventDefault();
        if (draggedTask) {
            column.appendChild(draggedTask);
            
            // حفظ التغييرات بعد سحب وإفلات البطاقة في مكانها الجديد
            saveBoardState();
        }
    });
});

// ==========================================================================
// 3. برمجة الحفظ التلقائي (Local Storage Logic)
// ==========================================================================

// دالة لتجميع وحفظ حالة اللوحة كاملة
function saveBoardState() {
    const boardData = {
        todo: getTasksFromColumn('todo-list'),
        inprogress: getTasksFromColumn('inprogress-list'),
        done: getTasksFromColumn('done-list')
    };
    // تحويل المصفوفات بنص ذكي وحفظها في المتصفح
    localStorage.setItem('prodo_board', JSON.stringify(boardData));
}

// دالة فرعية لاستخراج بيانات البطاقات من عمود معين
function getTasksFromColumn(listId) {
    const list = document.getElementById(listId);
    const cards = list.getElementsByClassName('task-card');
    const tasks = [];
    
    for (let card of cards) {
        tasks.push({
            title: card.querySelector('h4').textContent,
            description: card.querySelector('p').textContent,
            priority: card.querySelector('.badge').textContent
        });
    }
    return tasks;
}

// دالة لاستعادة البيانات المحفوظة فور فتح الصفحة
function loadBoardState() {
    const savedData = localStorage.getItem('prodo_board');
    
    if (savedData) {
        const boardData = JSON.parse(savedData);
        
        // تفريغ اللوحة القديمة الثابتة أولاً لبناء المحفوظ
        document.getElementById('todo-list').innerHTML = '';
        document.getElementById('inprogress-list').innerHTML = '';
        document.getElementById('done-list').innerHTML = '';
        
        // إعادة بناء المهام المحفوظة داخل أعمدتها الصحيحة
        boardData.todo.forEach(t => createTaskCard(t.title, t.description, t.priority, 'todo-list'));
        boardData.inprogress.forEach(t => createTaskCard(t.title, t.description, t.priority, 'inprogress-list'));
        boardData.done.forEach(t => createTaskCard(t.title, t.description, t.priority, 'done-list'));
    }
    updateAllCounters();
}

// دالة ذكية لتحديث عدادات الأعمدة الثلاثة فوراً
function updateAllCounters() {
    ['todo-list', 'inprogress-list', 'done-list'].forEach(id => {
        const count = document.getElementById(id).getElementsByClassName('task-card').length;
        const countId = id.replace('-list', '-count');
        document.getElementById(countId).textContent = count;
    });
}
// ==========================================================================
// 🔑 فحص كود صفحة تسجيل الدخول والتحقق من البيانات (Form Validation)
// ==========================================================================

// نتحقق أولاً إذا كنا متواجدين داخل صفحة تسجيل الدخول (عن طريق البحث عن حقل اليوزرنيم)
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginForm = document.querySelector('form');

if (loginForm && usernameInput && passwordInput) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // منع الصفحة من إعادة التحميل التلقائي الافتراضي

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // 1. فحص البريد الإلكتروني البسيط (التأكد من احتوائه على @ ونطاق)
        const emailPattern = /^[^\s@]+@[^\s@]+\.[com|net|org]+$/;
        
        if (!emailPattern.test(username)) {
            alert("Please enter a valid email address! (e.g., example@mail.com)");
            return;
        }

        // 2. فحص كلمة المرور (التأكد من أنها لا تقل عن 6 أحرف لحماية الحساب)
        if (password.length < 6) {
            alert("Password must be at least 6 characters long!");
            return;
        }

        // 3. النقل التلقائي إلى لوحة التحكم إذا كانت البيانات سليمة
        window.location.href = "dashboard.html";
    });
}

// ==========================================================================
// 4. تشغيل اللوحة واستعادة البيانات فور تحميل الصفحة
// ==========================================================================
setupColumn('add-todo-btn', 'todo-list', 'todo-count');
setupColumn('add-inprogress-btn', 'inprogress-list', 'inprogress-count');
setupColumn('add-done-btn', 'done-list', 'done-count');

// استدعاء الحفظ التلقائي فور تشغيل الصفحة
loadBoardState();