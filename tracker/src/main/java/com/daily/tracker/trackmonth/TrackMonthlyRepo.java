package com.daily.tracker.trackmonth;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrackMonthlyRepo extends JpaRepository<TrackMonthlyEntity, Integer> {
    List<TrackMonthlyEntity>
    findByHabitKeyAndYearAndMonth(int habitKey, int year, int month);

    Optional<TrackMonthlyEntity>
    findByHabitKeyAndYearAndMonthAndDay(
        int habitKey, int year, int month, int day
    );
}