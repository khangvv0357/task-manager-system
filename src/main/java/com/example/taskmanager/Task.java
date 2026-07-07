package com.example.taskmanager;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "tasks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Sử dụng LocalDate vì bạn chỉ cần quản lý ngày tháng, không cần giờ
    private LocalDate startDate;
    private LocalDate dueDate;

    private Integer estimatedDays;

    @Column(nullable = false)
    private String status; // VD: "TODO", "DOING", "DONE"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // Lưu ý: @Data của Lombok đã tự tạo tất cả Getter, Setter,
    // toString, equals, hashCode cho bạn rồi, không cần viết tay nữa.
}