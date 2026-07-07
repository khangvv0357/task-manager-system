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

    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        if (task.getStatus() == null) {
            task.setStatus("TODO");
        }
        return taskRepository.save(task);
    }

    // Cập nhật đầy đủ: Bao gồm cả thông tin ngày tháng
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy task với ID: " + id));

        // Cập nhật các thông tin cơ bản
        if (taskDetails.getTitle() != null) task.setTitle(taskDetails.getTitle());
        if (taskDetails.getDescription() != null) task.setDescription(taskDetails.getDescription());

        // Cập nhật các thông tin lịch trình mới
        if (taskDetails.getStartDate() != null) task.setStartDate(taskDetails.getStartDate());
        if (taskDetails.getDueDate() != null) task.setDueDate(taskDetails.getDueDate());
        if (taskDetails.getEstimatedDays() != null) task.setEstimatedDays(taskDetails.getEstimatedDays());

        return taskRepository.save(task);
    }

    @PutMapping("/{id}/status")
    public Task updateStatus(@PathVariable Long id, @RequestBody String status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy task với ID: " + id));

        String cleanStatus = status.replace("\"", "");
        task.setStatus(cleanStatus.toUpperCase());

        return taskRepository.save(task);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/status/{status}")
    public ResponseEntity<?> deleteTasksByStatus(@PathVariable String status) {
        List<Task> tasksToDelete = taskRepository.findByStatus(status.toUpperCase());
        if (!tasksToDelete.isEmpty()) {
            taskRepository.deleteAll(tasksToDelete);
        }
        return ResponseEntity.ok().build();
    }
}