package com.example.taskmanager;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    // Spring Data JPA sẽ tự động tạo logic tìm kiếm dựa trên tên hàm này
    List<Task> findByStatus(String status);
}