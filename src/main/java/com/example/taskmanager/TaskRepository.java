package com.example.taskmanager;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List; // Import đúng ở đây

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(String status);
}