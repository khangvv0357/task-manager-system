package com.example.taskmanager;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Data
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDateTime dueDate;

    @ManyToOne
    @JoinColumn(name = "user_id") // Tạo mối quan hệ với bảng Users
    private User user;
}