// Menu and Tutorial

//instructions shown on main screen at start of game

scene("startscreen", () => {
	var show = false; 
		
	});

	action(() => {
		if (keyIsPressed("space")) {
			go("startscreen");
		};
	});

// Menu and Tutorial

scene("startscreen", () => {
	var isStart = false;

	add([
		text("Super Jim 2021", 30),
		pos(width() / 2, 40),
		origin("center")
	]);

	add([
		text("Arrows or Wasd to move", 10),
		pos(width() / 2, 90),
		origin("center")
	]);

	add([
		text("Get Super Jim through CI course", 10),
		pos(width() / 2, 110),
		origin("center")
	]);

	add([
		text("M - Mute music", 10),
		pos(width() / 2, 130),
		origin("center")
	]);

	add([
		text("Collect 6 coins for 6 projects", 8),
		pos(width() / 2, 170),
		origin("center")
	]);

	add([
		text("Avoid the baddies", 8),
		pos(width() / 2, 180),
		origin("center")
	]);

	var startText = add([
		text("Backspace for start!", 13),
		pos(width() / 2, height() - 30),
		origin("center")
	]);

	loop(0.2, () => {
		if(isStart) return;

		startText.hidden = !startText.hidden;
	});

	// Input for Menu

	action(() => {
		if (keyIsPressed("space") && !isStart) {
			isStart = true;
			
			play("start");
			loop(0.1, () => startText.hidden = !startText.hidden);
			wait(2, () => go("main"));
		};
	});
})