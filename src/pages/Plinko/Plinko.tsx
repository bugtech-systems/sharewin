import { useState, useEffect, useCallback } from "react";
import {
	Bodies,
	Body,
	Composite,
	Engine,
	Events,
	IEventCollision,
	Render,
	Runner,
	World,
} from "matter-js";
import { useGameStore } from "store/game";
import { random } from "utils/random";
import { LinesType } from "./@types";
import { config } from "./config";
import MainLayout from "layouts/MainLayout";
import Panel from "./components/BetAction";
import GameBoard from "./components/GameBoard";
import styles from "./plinko.module.scss";

const Plinko = () => {
	const engine = Engine.create();
	const [lines, setLines] = useState<LinesType>(8);
	const inGameBallsCount = useGameStore((state) => state.gamesRunning);
	const incrementInGameBallsCount = useGameStore((state) => state.incrementGamesRunning);
	const decrementInGameBallsCount = useGameStore((state) => state.decrementGamesRunning);
	// const [lastMultipliers, setLastMultipliers] = useState<number[]>([]);
	const {
		pins: pinsConfig,
		colors,
		ball: ballConfig,
		engine: engineConfig,
		world: worldConfig,
		maxBallsCount,
	} = config;
	const worldWidth: number = worldConfig.width;
	const worldHeight: number = worldConfig.height;

	const alertUser = (e: BeforeUnloadEvent) => {
		if (inGameBallsCount > 0) {
			e.preventDefault();
			alert("Do you really want to leave?");
			e.returnValue = "";
		}
	};

	useEffect(() => {
		window.addEventListener("beforeunload", alertUser);
		return () => {
			window.removeEventListener("beforeunload", alertUser);
		};
	}, [inGameBallsCount]); //eslint-disable-line

	useEffect(() => {
		engine.gravity.y = engineConfig.engineGravity;
		const element = document.getElementById("plinko");
		const render = Render.create({
			element: element!,
			bounds: {
				max: {
					x: worldWidth,
					y: worldHeight,
				},
				min: {
					x: 0,
					y: 0,
				},
			},
			options: {
				background: colors.background,
				hasBounds: true,
				width: worldWidth,
				height: worldHeight,
				wireframes: false,
			},
			engine,
		});
		const runner = Runner.create();
		Runner.run(runner, engine);
		Render.run(render);
		return () => {
			World.clear(engine.world, true);
			Engine.clear(engine);
			render.canvas.remove();
			render.textures = {};
		};
	}, [lines]); //eslint-disable-line

	const pins: Body[] = [];

	const widthUnit = (worldWidth - pinsConfig.pinSize * 2) / (lines * 2 + 2);
	const heightUnit = (worldHeight - pinsConfig.pinSize * 2) / (lines + 1);
	for (let i = 0; i < lines; i++) {
		for (let j = lines - i - 1; j <= lines - i + (i + 2) * 2; j += 2) {
			const pin = Bodies.circle(
				widthUnit * j + pinsConfig.pinSize,
				heightUnit * (i + 2) - pinsConfig.pinSize,
				pinsConfig.pinSize,
				{
					label: `pin-${i}`,
					render: {
						fillStyle: "#F5DCFF",
					},
					isStatic: true,
				}
			);
			pins.push(pin);
		}
	}

	// for (let l = 0; l < lines; l++) {
	// 	console.log(lines);
	// 	const pinGap = (worldWidth + pinsConfig.pinSize) / (lines + 1);
	// 	const linePins = pinsConfig.startPins + l;
	// 	const lineWidth = linePins * pinGap;
	// 	for (let i = 0; i < linePins; i++) {
	// 		const pinX =
	// 			worldWidth / 2 - lineWidth / 2 + i * pinGap + pinGap / 2;
	// 		const pinY = worldWidth / lines + l * pinGap + pinGap;
	// 		const pin = Bodies.circle(pinX, pinY, pinsConfig.pinSize, {
	// 			label: `pin-${i}`,
	// 			render: {
	// 				fillStyle: "#F5DCFF",
	// 			},
	// 			isStatic: true,
	// 		});
	// 		console.log(pinX, pinY);
	// 		pins.push(pin);
	// 	}
	// }

	const addInGameBall = () => {
		if (inGameBallsCount > maxBallsCount) return;
		incrementInGameBallsCount();
	};

	const removeInGameBall = () => {
		decrementInGameBallsCount();
	};

	const addBall = useCallback(
		(ballValue: number) => {
			addInGameBall();

			const minBallX = worldWidth / 2 + pinsConfig.pinGap;
			const maxBallX = worldWidth / 2 - pinsConfig.pinGap + pinsConfig.pinGap / 2;
			const ballX = random(minBallX, maxBallX);
			const ballColor = ballValue <= 0 ? colors.text : colors.purple;
			const ball = Bodies.circle(ballX, 20, ballConfig.ballSize, {
				restitution: 1,
				friction: 0.6,
				label: `ball-${ballValue}`,
				id: new Date().getTime(),
				frictionAir: 0.05,
				collisionFilter: {
					group: -1,
				},
				render: {
					fillStyle: ballColor,
				},
				isStatic: false,
			});
			Composite.add(engine.world, ball);
		},
		[lines] //eslint-disable-line
	);

	const leftWall = Bodies.rectangle(
		worldWidth / 3 - 60,
		worldWidth / 2 - 2,
		worldWidth * 2,
		40,
		{
			angle: 90,
			render: {
				visible: true,
			},
			isStatic: true,
		}
	);
	const rightWall = Bodies.rectangle(
		worldWidth - 2 * pinsConfig.pinGap - pinsConfig.pinGap - pinsConfig.pinGap / 2,
		worldWidth / 2 - 2,
		worldWidth * 2,
		40,
		{
			angle: -90,
			render: {
				visible: true,
			},
			isStatic: true,
		}
	);
	const floor = Bodies.rectangle(0, worldWidth + 10, worldWidth * 10, 30, {
		label: "block-1",
		render: {
			visible: true,
		},
		isStatic: true,
	});

	Composite.add(engine.world, [...pins, leftWall, rightWall, floor]);

	const bet = (betValue: number) => {
		addBall(betValue);
	};

	const onCollideWithMultiplier = async (ball: Body, multiplier: Body) => {
		ball.collisionFilter.group = 2;
		World.remove(engine.world, ball);
		removeInGameBall();
		const ballValue = ball.label.split("-")[1];
		const multiplierValue = +multiplier.label.split("-")[1] as Number;
		console.log(multiplierValue);

		if (+ballValue <= 0) return;
	};
	const onBodyCollision = async (event: IEventCollision<Engine>) => {
		const pairs = event.pairs;
		for (const pair of pairs) {
			const { bodyA, bodyB } = pair;
			if (bodyB.label.includes("ball") && bodyA.label.includes("block"))
				await onCollideWithMultiplier(bodyB, bodyA);
		}
	};

	Events.on(engine, "collisionActive", onBodyCollision);

	return (
		<MainLayout title="PLINKO" className={styles.plinko}>
			<div className="plinko-container">
				<div className="game-box">
					<Panel
						inGameBallsCount={inGameBallsCount}
						onChangeLines={setLines}
						onRunBet={bet}
					/>
					<div className="game-board">
						<GameBoard />
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default Plinko;
