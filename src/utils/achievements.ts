export interface Achievement {
	id: string;
	title: string;
	desc: string;
}

export const ACHIEVEMENTS: Achievement[] = [
	{
		id: "identity",
		title: "Identity Confirmed",
		desc: "Answered the whoami gate correctly.",
	},
	{
		id: "first-contact",
		title: "First Contact",
		desc: "Opened the LAJIN shell.",
	},
	{
		id: "know-thyself",
		title: "Know Thyself",
		desc: "Ran whoami inside the shell.",
	},
	{
		id: "digital-rain",
		title: "Digital Rain",
		desc: "Toggled matrix rain in the shell.",
	},
	{
		id: "pwn-mode",
		title: "Pwn Master",
		desc: "Found the Konami code. ↑↑↓↓←→←→BA",
	},
	{
		id: "signal-lost",
		title: "Off The Grid",
		desc: "Reached the 404 page. Not all who wander are lost.",
	},
	{
		id: "flag-hunter",
		title: "Flag Hunter",
		desc: "Captured your first hidden flag.",
	},
	{
		id: "completionist",
		title: "Completionist",
		desc: "Captured every hidden flag on the blog.",
	},
];

const KEY = "lajin-achievements";

export function getUnlockedAchievements(): string[] {
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? (JSON.parse(raw) as string[]) : [];
	} catch {
		return [];
	}
}

export function isAchievementUnlocked(id: string): boolean {
	return getUnlockedAchievements().includes(id);
}

function persist(ids: string[]) {
	localStorage.setItem(KEY, JSON.stringify(ids));
}

/** Unlock an achievement; no-op if already owned. Dispatches a toast event. */
export function unlock(id: string): void {
	const achievement = ACHIEVEMENTS.find((a) => a.id === id);
	if (!achievement) return;
	const unlocked = getUnlockedAchievements();
	if (unlocked.includes(id)) return;
	unlocked.push(id);
	persist(unlocked);
	document.dispatchEvent(
		new CustomEvent("lajin:achievement", { detail: achievement }),
	);
}
