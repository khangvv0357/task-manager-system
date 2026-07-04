package com.example.taskmanager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    // Lấy danh sách tất cả các task
    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Tạo một task mới
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskRepository.save(task);
    }

    // Xóa một task dựa trên ID
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
    }

    // Cập nhật một task đã tồn tại
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task không tìm thấy với id: " + id));

        // Chỉ cập nhật nếu dữ liệu gửi lên không null
        if (taskDetails.getTitle() != null) task.setTitle(taskDetails.getTitle());
        if (taskDetails.getDescription() != null) task.setDescription(taskDetails.getDescription());
        if (taskDetails.getDueDate() != null) task.setDueDate(taskDetails.getDueDate());

        // Nếu bạn muốn cập nhật cả User:
        if (taskDetails.getUser() != null && taskDetails.getUser().getId() != null) {
            task.setUser(taskDetails.getUser());
        }

        return taskRepository.save(task);
    }
}