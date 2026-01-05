package com.daily.tracker.trackmonth;

import java.time.LocalDate;
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

    public List<TrackMonthlyEntity> getHabitMonthDone(int habitKey) {
        return trackMonthlyRepository.findByHabitKey(habitKey);
    }

    @Transactional
    public void toggleHabitMonthDone(int habitKey, LocalDate date, boolean done) {
        TrackMonthlyEntity track = trackMonthlyRepository
            .findByHabitKeyAndDone(habitKey, date)
            .orElseGet(() -> {
                TrackMonthlyEntity newTrack = new TrackMonthlyEntity();
                newTrack.setHabitKey(habitKey);
                newTrack.setDone(date);
                return newTrack;
            });

        track.setStatus(done);
        trackMonthlyRepository.save(track);
    }

}
