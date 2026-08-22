interface MatrixRainOptions {
	fontSize?: number;
	color?: string;
	trailAlpha?: number;
	speed?: number;
}

/**
 * Renders the classic "digital rain" on a canvas.
 * Returns a stop function that cancels the animation and clears the canvas.
 */
export function startMatrixRain(
	canvas: HTMLCanvasElement,
	options: MatrixRainOptions = {},
): () => void {
	const ctx = canvas.getContext("2d");
	if (!ctx) return () => {};

	const fontSize = options.fontSize ?? 16;
	const color = options.color ?? "oklch(0.75 0 0)";
	const trailAlpha = options.trailAlpha ?? 0.08;
	const speed = options.speed ?? 1;

	let columns = 0;
	let drops: number[] = [];
	let rafId = 0;
	let stopped = false;
	let lastTime = 0;
	const frameInterval = 1000 / (30 * speed);

	const resize = () => {
		const rect = canvas.getBoundingClientRect();
		canvas.width = Math.max(1, Math.floor(rect.width));
		canvas.height = Math.max(1, Math.floor(rect.height));
		columns = Math.ceil(canvas.width / fontSize);
		drops = Array.from({ length: columns }, () =>
			Math.floor((Math.random() * canvas.height) / fontSize),
		);
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	};

	const chars =
		"アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF$#@%&*<>{}[]/\\|";

	const draw = (time: number) => {
		if (stopped) return;
		rafId = requestAnimationFrame(draw);
		if (time - lastTime < frameInterval) return;
		lastTime = time;

		ctx.fillStyle = `rgba(0, 0, 0, ${trailAlpha})`;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = color;
		ctx.font = `${fontSize}px "JetBrains Mono Variable", monospace`;

		for (let i = 0; i < columns; i++) {
			const char = chars[Math.floor(Math.random() * chars.length)];
			ctx.fillText(char, i * fontSize, drops[i] * fontSize);
			if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
				drops[i] = 0;
			}
			drops[i]++;
		}
	};

	resize();
	window.addEventListener("resize", resize);
	rafId = requestAnimationFrame(draw);

	return () => {
		stopped = true;
		cancelAnimationFrame(rafId);
		window.removeEventListener("resize", resize);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	};
}
