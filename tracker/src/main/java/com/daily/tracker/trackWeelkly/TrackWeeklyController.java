package com.daily.tracker.trackWeelkly;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.daily.tracker.habit.HabitEntity;


@RestController
@RequestMapping("/api/tracker/weekly")
public class TrackWeeklyController {
    @Autowired
    private TrackWeeklyService service;

    @GetMapping
    public List<HabitEntity> getAllweekHabits() {
        return service.getAllweekHabits();
    }

    @GetMapping("/{habitKey}")
    public List<TrackWeeklyEntity> getHabitWeekDone(@PathVariable int habitKey) {
        return service.getHabitweekDone(habitKey);
    }

    @PostMapping("/{habitKey}")
    public Map<String, String> toggleHabitweekDone(
            @PathVariable int habitKey,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam boolean done
    ) {
        service.toggleHabitweekDone(habitKey, date, done);

        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("habitKey", String.valueOf(habitKey));
        response.put("date", date.toString());
        response.put("done", String.valueOf(done));

        return response;
    }
}
