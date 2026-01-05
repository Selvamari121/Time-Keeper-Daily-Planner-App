package com.daily.tracker.habit;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tracker/habit")
public class HabitController {
	
	@Autowired
	private HabitService habitService;

	@PostMapping
	public ResponseEntity<Void> createHabit(@RequestBody HabitEntity crew) {
		habitService.createHabit(crew);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	@GetMapping
	public ResponseEntity<List<HabitEntity>> getAllHabits() {
		List<HabitEntity> crewList = habitService.getAllHabits();
		return ResponseEntity.status(HttpStatus.OK).body(crewList);
	}

	@GetMapping("/{habitKey}")
	public ResponseEntity<HabitEntity> getHabitById(@PathVariable int habitKey) {
		HabitEntity crewData = habitService.getHabitById(habitKey);
		return ResponseEntity.status(HttpStatus.OK).body(crewData);
	}

	@PutMapping("/{habitKey}")
	public ResponseEntity<Void> updateHabit(@PathVariable int habitKey, @RequestBody HabitEntity crewEntity) {
		habitService.updateHabit(habitKey, crewEntity);
		return ResponseEntity.status(HttpStatus.OK).build();
	}

	@DeleteMapping("/{habitKey}")
	public ResponseEntity<Void> deleteHabit(@PathVariable int habitKey) {
		habitService.deleteHabit(habitKey);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}
}
