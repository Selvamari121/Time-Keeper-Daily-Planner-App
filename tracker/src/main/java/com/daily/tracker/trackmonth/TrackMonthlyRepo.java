package com.daily.tracker.trackmonth;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrackMonthlyRepo extends JpaRepository<TrackMonthlyEntity, Integer> {
    List<TrackMonthlyEntity> findByHabitKey(int habitKey);
    Optional<TrackMonthlyEntity> findByHabitKeyAndDone(int habitKey, LocalDate done);
}