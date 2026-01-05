package com.daily.tracker.habit;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HabitService {
	@Autowired
	private HabitRepo habitRepo;

	public HabitEntity createHabit(HabitEntity habit) {
        habit.setCreateDate(LocalDateTime.now());
        return habitRepo.save(habit);
    }

    public List<HabitEntity> getAllHabits() {
        return habitRepo.findAll();
    }

    public HabitEntity getHabitById(int habitKey) {
        return habitRepo.findById(habitKey)
                .orElseThrow(() -> new RuntimeException("Habit not found"));
    }

    public HabitEntity updateHabit(int habitKey, HabitEntity updatedHabit) {
        HabitEntity existingHabit = habitRepo.findById(habitKey)
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        existingHabit.setName(updatedHabit.getName());
        existingHabit.setDescription(updatedHabit.getDescription());
        existingHabit.setStartDateTime(updatedHabit.getStartDateTime());
        existingHabit.setEndDateTime(updatedHabit.getEndDateTime());

        return habitRepo.save(existingHabit);
    }

    public void deleteHabit(int habitKey) {
        if (!habitRepo.existsById(habitKey)) {
            throw new RuntimeException("Habit not found");
        }
        habitRepo.deleteById(habitKey);
    }
}
