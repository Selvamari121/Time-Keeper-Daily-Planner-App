package com.daily.tracker.trackmonth;

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
@Table(name = "track_month")
public class TrackMonthlyEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "pk_tmid")
	private Integer tmKey;

	@Column(name = "year")
	private int year;   

	@Column(name = "month")
    private int month;  

	@Column(name = "day")
    private int day; 

	@Column(name = "status")
	private boolean status;

	@Column(name = "fk_hid")
	private int habitKey;
}
