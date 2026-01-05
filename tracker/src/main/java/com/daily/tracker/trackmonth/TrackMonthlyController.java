package com.daily.tracker.trackmonth;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

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
    public List<TrackMonthlyEntity> getHabitMonthDone(@PathVariable int habitKey) {
        return service.getHabitMonthDone(habitKey);
    }

    @PostMapping("/{habitKey}")
    public Map<String, String> toggleHabitMonthDone(
            @PathVariable int habitKey,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam boolean done
    ) {
        service.toggleHabitMonthDone(habitKey, date, done);

        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("habitKey", String.valueOf(habitKey));
        response.put("date", date.toString());
        response.put("done", String.valueOf(done));

        return response;
    }
}
