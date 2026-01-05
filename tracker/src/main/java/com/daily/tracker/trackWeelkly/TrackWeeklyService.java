package com.daily.tracker.trackWeelkly;

import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.daily.tracker.habit.HabitEntity;
import com.daily.tracker.habit.HabitRepo;
import jakarta.transaction.Transactional;


@Service
public class TrackWeeklyService {
    @Autowired
    private TrackWeeklyRepo trackweeklyRepository;

    @Autowired
    private HabitRepo habitRepository;

    public List<HabitEntity> getAllweekHabits() {
        return habitRepository.findAll();
    }

    public List<TrackWeeklyEntity> getHabitweekDone(int habitKey) {
        return trackweeklyRepository.findByHabitKey(habitKey);
    }

    @Transactional
    public void toggleHabitweekDone(int habitKey, LocalDate date, boolean done) {
        TrackWeeklyEntity track = trackweeklyRepository
            .findByHabitKeyAndDone(habitKey, date)
            .orElseGet(() -> {
                TrackWeeklyEntity newTrack = new TrackWeeklyEntity();
                newTrack.setHabitKey(habitKey);
                newTrack.setDone(date);
                return newTrack;
            });

        track.setStatus(done);
        trackweeklyRepository.save(track);
    }
}
