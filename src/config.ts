import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "LAJIN",
	subtitle: "CTF Walkthroughs",
	lang: "en",
	themeColor: {
		hue: 24,
		fixed: true,
	},
	banner: {
		enable: false,
		src: "",
		position: "center",
		credit: {
			enable: false,
			text: "",
			url: "",
		},
	},
	toc: {
		enable: true,
		depth: 2,
	},
	favicon: [],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "Trophies",
			url: "/achievements/",
		},
		{
			name: "GitHub",
			url: "https://github.com/EsamLasheen/LAJIN",
			external: true,
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/profile.jpg",
	name: "Esam Lasheen",
	bio: "CTF writeups, web security notes, and practical walkthroughs.",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/EsamLasheen",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};

/* Hidden flags for the blog-wide CTF treasure hunt.
 * Embed the literal flag string anywhere in the target post (a <spoiler> works great),
 * readers capture it with `submit flag{...}` in the LAJIN shell (Ctrl+K). */
export interface HiddenFlag {
	id: string;
	flag: string;
	post: string;
	hint: string;
}

export const hiddenFlags: HiddenFlag[] = [
	{
		id: "ai-platform",
		flag: "flag{claude_ships_secrets}",
		post: "0002_ai-platform-pentest",
		hint: "something is hiding under the surface of the AI platform writeup — hover around",
	},
	{
		id: "ottergram",
		flag: "flag{access_control_matters}",
		post: "0001_ottergram",
		hint: "the otter knows something about access control… read carefully",
	},
];

/* Privacy-friendly analytics (optional).
 * Set `goatcounter` to your GoatCounter code, e.g. "myblog", to enable:
 * <script data-goatcounter="https://myblog.goatcounter.com/count"></script> */
export const analyticsConfig: { goatcounter?: string } = {};

/* Giscus comments (optional).
 * 1. Enable Discussions on this GitHub repo and install the giscus app
 * 2. Fill in repo / repoId / categoryId from https://giscus.app
 * Leave repo empty to keep comments disabled. */
export const giscusConfig: {
	repo?: `${string}/${string}`;
	repoId?: string;
	categoryId?: string;
} = {};
