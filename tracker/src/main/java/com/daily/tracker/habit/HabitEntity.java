package com.daily.tracker.habit;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "habit_add")
public class HabitEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "pk_hid")
	private Integer habitKey;

	@Column(name = "name")
	private String name;

	@Column(name = "description")
	private String description;

	@Column(name = "start_at")
	private LocalDateTime startDateTime;

	@Column(name = "end_at")
	private LocalDateTime endDateTime;

	@Column(name = "create_date")
	private LocalDateTime createDate;

}
