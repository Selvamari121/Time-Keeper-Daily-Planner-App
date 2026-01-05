package com.daily.tracker.habit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HabitRepo extends JpaRepository<HabitEntity, Integer> {
    
}
