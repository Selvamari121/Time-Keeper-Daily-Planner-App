package com.daily.tracker.trackWeelkly;
import java.time.LocalDate;
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
@Table(name = "track_week")
public class TrackWeeklyEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "pk_twid")
	private Integer tmKey;

	@Column(name = "done_date")
	private LocalDate done;

	@Column(name = "status")
	private boolean status;

	@Column(name = "fk_hid")
	private int habitKey;
}