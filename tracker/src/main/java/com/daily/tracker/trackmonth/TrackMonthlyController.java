package com.daily.tracker.trackmonth;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.daily.tracker.habit.HabitEntity;

@RestController
@RequestMapping("/api/tracker/monthly")
public class TrackMonthlyController {

    @Autowired
    private TrackMonthlyService service;

    @GetMapping
    public List<HabitEntity> getAllMonthHabits() {
        return service.getAllMonthHabits();
    }

    @GetMapping("/{habitKey}")
    public List<TrackMonthlyEntity> getMonthData(
            @PathVariable int habitKey,
            @RequestParam int year,
            @RequestParam int month
    ) {
        return service.getMonthData(habitKey, year, month);
    }

    @PostMapping("/{habitKey}")
    public void toggle(
            @PathVariable int habitKey,
            @RequestParam int year,
            @RequestParam int month,
            @RequestParam int day,
            @RequestParam boolean done
    ) {
        service.toggleHabit(habitKey, year, month, day, done);
    }
}
