package com.daily.tracker.trackWeelkly;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrackWeeklyRepo extends JpaRepository<TrackWeeklyEntity, Integer> {
    List<TrackWeeklyEntity> findByHabitKey(int habitKey);
    Optional<TrackWeeklyEntity> findByHabitKeyAndDone(int habitKey, LocalDate done);
}
