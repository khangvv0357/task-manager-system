// --- 1. Hàm tải và render danh sách task ---
function loadTasks() {
    fetch('http://localhost:8080/api/tasks')
        .then(response => response.json())
        .then(data => {
            // Xóa sạch các cột trước khi render lại
            ['todo-list', 'doing-list', 'done-list'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.innerHTML = '';
            });

            data.forEach(task => {
                const item = document.createElement('div');
                item.className = 'list-group-item mb-2';
                item.dataset.id = task.id;

                // Tạo cấu trúc HTML an toàn
                item.innerHTML = `
    <div class="d-flex justify-content-between align-items-start w-100">
        <div class="task-content">
            <strong>${escapeHtml(task.title)}</strong><br>
            <small>${escapeHtml(task.description)}</small>
        </div>
        <div class="btn-group flex-shrink-0">
            <button class="btn btn-info btn-sm edit-btn me-1"><i class="bi bi-pencil-fill"></i></button>
            <button class="btn btn-danger btn-sm delete-btn"><i class="bi bi-trash-fill"></i></button>
        </div>
    </div>`;

// Gán sự kiện cho nút Edit
                item.querySelector('.edit-btn').addEventListener('click', () => {
                    openEditModal(task.id, task.title, task.description);
                });

// Gán sự kiện cho nút Xóa
                item.querySelector('.delete-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                });

                // 1. Tìm nút Edit
                const editBtn = document.createElement('button');
                editBtn.className = 'btn btn-sm btn-link';
                editBtn.innerHTML = '<i class="bi bi-pencil-fill"></i>';

// Dòng này là chìa khóa: Gắn sự kiện click vào nút
                editBtn.onclick = function() {
                    openEditModal(task); // task ở đây là đối tượng dữ liệu của dòng đó
                };

// 2. Tìm nút Xóa
                const deleteBtn = item.querySelector('.delete-btn');
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                    });
                }

                // Xác định cột và chèn vào
                const status = (task.status || 'TODO').toUpperCase();
                let colId = (status === 'DOING') ? 'doing-list' : (status === 'DONE') ? 'done-list' : 'todo-list';
                const column = document.getElementById(colId);
                if (column) column.appendChild(item);
            });
            initDragAndDrop();
        })
        .catch(err => console.error('Lỗi tải task:', err));
}

// --- 2. Các chức năng CRUD ---
function addTask() {
    const title = document.getElementById('taskTitle').value;
    const desc = document.getElementById('taskDesc').value;
    if (!title) return alert("Vui lòng nhập tên công việc!");

    fetch('http://localhost:8080/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: desc, user: { id: 1 } })
    }).then(() => {
        // 1. Xóa nội dung đã nhập
        titleInput.value = '';
        descInput.value = '';

        // 2. Focus lại vào ô nhập tên công việc để nhập tiếp ngay lập tức
        titleInput.focus();

        // 3. Tải lại danh sách
        loadTasks();
    });
}

function deleteTask(id) {
    if (confirm("Xóa công việc này?")) {
        fetch(`http://localhost:8080/api/tasks/${id}`, { method: 'DELETE' }).then(loadTasks);
    }
}


function saveEdit() {
    const id = document.getElementById('editId').value;
    const title = document.getElementById('editTitle').value;
    const description = document.getElementById('editDesc').value;

    fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
    }).then(() => {
        // 1. Ẩn modal bằng Bootstrap API
        const modalEl = document.getElementById('editModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        // 2. Xóa thủ công backdrop nếu nó còn sót lại (nguyên nhân gây đơ màn hình)
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        // 3. Reset lại body để cho phép cuộn trang
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        loadTasks();
    });
}


// --- 3. Tiện ích & Hỗ trợ ---
function openEditModal(id, title, desc) {
    document.getElementById('editId').value = id;
    document.getElementById('editTitle').value = title;
    document.getElementById('editDesc').value = desc;
    new bootstrap.Modal(document.getElementById('editModal')).show();
}

function initDragAndDrop() {
    ['todo-list', 'doing-list', 'done-list'].forEach(id => {
        const el = document.getElementById(id);
        if (el) new Sortable(el, { group: 'shared', animation: 150, onEnd: (evt) => {
                fetch(`http://localhost:8080/api/tasks/${evt.item.dataset.id}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(evt.to.id.split('-')[0].toUpperCase())
                });
            }});
    });
}

// Hàm hỗ trợ chống lỗi ký tự đặc biệt trong HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

const titleInput = document.getElementById('taskTitle');
const descInput = document.getElementById('taskDesc');

// Xử lý ô Tên công việc: Nhấn Enter -> Nhảy xuống ô Mô tả
titleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        descInput.focus();
    }
});

// Xử lý ô Mô tả: Nhấn Enter -> Gọi hàm thêm task
descInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTask();
    }
});

document.addEventListener('click', (e) => {
    if (e.target.closest('.clear-btn')) {
        const btn = e.target.closest('.clear-btn');
        const status = btn.getAttribute('data-status');

        if (confirm(`Bạn có chắc muốn xóa tất cả task trong cột ${status}?`)) {
            // Thêm log để kiểm tra đường dẫn API
            console.log(`Đang gọi API xóa cho status: ${status}`);

            fetch(`http://localhost:8080/api/tasks/status/${status}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.ok) {
                        loadTasks();
                    } else {
                        console.error("Lỗi Server:", response.statusText);
                        alert("Không thể xóa, hãy kiểm tra Backend!");
                    }
                })
                .catch(err => console.error("Lỗi Fetch:", err));
        }
    }
});

const kanbanSection = document.querySelector('.container'); // Khối chứa Kanban
const pomodoroSection = document.getElementById('pomodoro-section');
const navLinks = document.querySelectorAll('.sidebar-nav a');

// Chuyển đổi màn hình
document.getElementById('nav-kanban').addEventListener('click', () => {
    document.getElementById('kanban-section').style.display = 'block';
    document.getElementById('pomodoro-section').style.display = 'none';
});

document.getElementById('nav-pomodoro').addEventListener('click', () => {
    document.getElementById('kanban-section').style.display = 'none';
    document.getElementById('pomodoro-section').style.display = 'block';
});

document.getElementById('nav-pomodoro').addEventListener('click', () => {
    // Ẩn Kanban, Hiện Pomodoro
    document.getElementById('kanban-section').style.display = 'none';
    document.getElementById('pomodoro-section').style.display = 'block';

    // Đổi nền toàn trang sang ảnh riêng cho Pomodoro
    document.body.style.backgroundImage = "url('../img/pomodoro-bg.jpg')";
});

document.getElementById('nav-kanban').addEventListener('click', () => {
    // Hiện Kanban, Ẩn Pomodoro
    document.getElementById('kanban-section').style.display = 'block';
    document.getElementById('pomodoro-section').style.display = 'none';

    // Trả lại nền cũ cho Kanban
    document.body.style.backgroundImage = "url('../img/bg-img.jpg')";
});

document.getElementById('menu-toggle').addEventListener('click', function(e) {
    e.preventDefault();
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
});

// Khi người dùng chọn ngày bắt đầu và nhập số ngày
document.getElementById('editEstimatedDays').addEventListener('input', function() {
    const start = new Date(document.getElementById('editStartDate').value);
    const days = parseInt(this.value);
    if (!isNaN(days) && start) {
        const due = new Date(start);
        due.setDate(start.getDate() + days);
        document.getElementById('editDueDate').value = due.toISOString().split('T')[0];
    }
});

function openEditModal(task) {
    // Đổ dữ liệu vào Modal
    document.getElementById('editId').value = task.id;
    document.getElementById('editTitle').value = task.title;
    document.getElementById('editDesc').value = task.description || '';

    // Nếu bạn đã có trường ngày tháng trong HTML
    if(task.startDate) document.getElementById('editStartDate').value = task.startDate;
    if(task.dueDate) document.getElementById('editDueDate').value = task.dueDate;

    // Kích hoạt Modal Bootstrap
    const modalElement = document.getElementById('editModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

// Khởi tạo
window.addEventListener('load', loadTasks);