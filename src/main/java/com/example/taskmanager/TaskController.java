package com.example.taskmanager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    // 1. Lấy tất cả task
    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // 2. Thêm mới task
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        if (task.getStatus() == null) {
            task.setStatus("TODO"); // Mặc định là TODO
        }
        return taskRepository.save(task);
    }

    // 3. Cập nhật task (Sửa title/description)
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy task với ID: " + id));

        if (taskDetails.getTitle() != null) task.setTitle(taskDetails.getTitle());
        if (taskDetails.getDescription() != null) task.setDescription(taskDetails.getDescription());

        return taskRepository.save(task);
    }

    // 4. Cập nhật trạng thái (Drag and Drop)
    @PutMapping("/{id}/status")
    public Task updateStatus(@PathVariable Long id, @RequestBody String status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy task với ID: " + id));

        // Loại bỏ dấu ngoặc kép JSON nếu có
        String cleanStatus = status.replace("\"", "");
        task.setStatus(cleanStatus.toUpperCase());

        return taskRepository.save(task);
    }

    // 5. XÓA MỘT TASK THEO ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // 6. XÓA TẤT CẢ TASK THEO TRẠNG THÁI (Dùng cho nút Clear)
    // Đường dẫn chuẩn: /api/tasks/status/{status}
    @DeleteMapping("/status/{status}")
    public ResponseEntity<?> deleteTasksByStatus(@PathVariable String status) {
        List<Task> tasksToDelete = taskRepository.findByStatus(status.toUpperCase());
        if (!tasksToDelete.isEmpty()) {
            taskRepository.deleteAll(tasksToDelete);
        }
        return ResponseEntity.ok().build();
    }
}