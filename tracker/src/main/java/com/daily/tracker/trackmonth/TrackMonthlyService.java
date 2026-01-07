package com.daily.tracker.trackmonth;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daily.tracker.habit.HabitEntity;
import com.daily.tracker.habit.HabitRepo;

import jakarta.transaction.Transactional;

@Service
public class TrackMonthlyService {
    @Autowired
    private TrackMonthlyRepo trackMonthlyRepository;

    @Autowired
    private HabitRepo habitRepository;

    public List<HabitEntity> getAllMonthHabits() {
        return habitRepository.findAll();
    }

    public List<TrackMonthlyEntity> getMonthData(int habitKey, int year, int month) {
        return trackMonthlyRepository.findByHabitKeyAndYearAndMonth(habitKey, year, month);
    }

    @Transactional
    public void toggleHabit(
            int habitKey,
            int year,
            int month,
            int day,
            boolean done
    ) {
        TrackMonthlyEntity track = trackMonthlyRepository
            .findByHabitKeyAndYearAndMonthAndDay(
                habitKey, year, month, day
            )
            .orElseGet(() -> {
                TrackMonthlyEntity t = new TrackMonthlyEntity();
                t.setHabitKey(habitKey);
                t.setYear(year);
                t.setMonth(month);
                t.setDay(day);
                return t;
            });

        track.setStatus(done);
        trackMonthlyRepository.save(track);
    }

}
