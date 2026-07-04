document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:8080/api/tasks')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('task-list');
            data.forEach(task => {
                const li = document.createElement('li');
                li.textContent = `${task.title}: ${task.description}`;
                list.appendChild(li);
            });
        })
        .catch(error => console.error('Lỗi rồi:', error));
});