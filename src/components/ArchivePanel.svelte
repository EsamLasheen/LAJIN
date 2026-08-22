<script lang="ts">
import { onMount } from "svelte";

import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";
import { getPostUrlBySlug } from "../utils/url-utils";

export let tags: string[] = [];
export let categories: string[] = [];
export let sortedPosts: Post[] = [];

interface Post {
	slug: string;
	data: {
		title: string;
		tags: string[];
		category?: string | null;
		published: Date;
	};
}

interface Group {
	year: number;
	posts: Post[];
}

let selectedTags: string[] = [];
let selectedCategories: string[] = [];
let uncategorizedOnly = false;
let initialized = false;

$: groups = (() => {
	let filtered = sortedPosts;
	if (selectedTags.length > 0) {
		filtered = filtered.filter(
			(post) =>
				Array.isArray(post.data.tags) &&
				post.data.tags.some((tag) => selectedTags.includes(tag)),
		);
	}
	if (selectedCategories.length > 0) {
		filtered = filtered.filter(
			(post) =>
				post.data.category && selectedCategories.includes(post.data.category),
		);
	}
	if (uncategorizedOnly) {
		filtered = filtered.filter((post) => !post.data.category);
	}
	const grouped = filtered.reduce<Record<number, Post[]>>((acc, post) => {
		const year = post.data.published.getFullYear();
		if (!acc[year]) {
			acc[year] = [];
		}
		acc[year].push(post);
		return acc;
	}, {});
	return Object.keys(grouped)
		.map((yearStr) => ({
			year: Number.parseInt(yearStr, 10),
			posts: grouped[Number.parseInt(yearStr, 10)],
		}))
		.sort((a, b) => b.year - a.year);
})();

function readParams() {
	const params = new URLSearchParams(window.location.search);
	selectedTags = params.getAll("tag");
	selectedCategories = params.getAll("category");
	uncategorizedOnly = params.has("uncategorized");
}

function syncUrl() {
	const params = new URLSearchParams();
	for (const t of selectedTags) params.append("tag", t);
	for (const c of selectedCategories) params.append("category", c);
	if (uncategorizedOnly) params.set("uncategorized", "true");
	const qs = params.toString();
	history.replaceState(
		null,
		"",
		window.location.pathname + (qs ? `?${qs}` : ""),
	);
}

function removeTag(tag: string) {
	selectedTags = selectedTags.filter((t) => t !== tag);
	syncUrl();
}

function removeCategory(category: string) {
	selectedCategories = selectedCategories.filter((c) => c !== category);
	syncUrl();
}

function clearFilters() {
	selectedTags = [];
	selectedCategories = [];
	uncategorizedOnly = false;
	syncUrl();
}

function formatDate(date: Date) {
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	return `${month}-${day}`;
}

function formatTag(tagList: string[]) {
	return tagList.map((t) => `#${t}`).join(" ");
}

onMount(() => {
	readParams();
	initialized = true;
});
</script>

<div class="card-base px-8 py-6">
    {#if (selectedTags.length > 0 || selectedCategories.length > 0 || uncategorizedOnly)}
        <div class="flex flex-wrap items-center gap-2 mb-4" data-pagefind-ignore>
            <span class="text-sm text-50">filters:</span>
            {#each selectedTags as tag (tag)}
                <button class="filter-chip" type="button" on:click={() => removeTag(tag)}>
                    #{tag} <span class="chip-x">×</span>
                </button>
            {/each}
            {#each selectedCategories as category (category)}
                <button class="filter-chip" type="button" on:click={() => removeCategory(category)}>
                    {category} <span class="chip-x">×</span>
                </button>
            {/each}
            {#if uncategorizedOnly}
                <button class="filter-chip" type="button" on:click={() => { uncategorizedOnly = false; syncUrl(); }}>
                    uncategorized <span class="chip-x">×</span>
                </button>
            {/if}
            <button class="text-sm text-[var(--primary)] hover:underline font-medium" type="button"
                    on:click={clearFilters}>clear all</button>
        </div>
    {/if}

    {#if groups.length === 0 && initialized}
        <div class="py-10 text-center text-50">
            no writeups match these filters — try clearing them.
        </div>
    {:else}
        {#each groups as group (group.year)}
            <div>
                <div class="flex flex-row w-full items-center h-[3.75rem]">
                    <div class="w-[15%] md:w-[10%] transition text-2xl font-bold text-right text-75">
                        {group.year}
                    </div>
                    <div class="w-[15%] md:w-[10%]">
                        <div
                                class="h-3 w-3 bg-none rounded-full outline outline-[var(--primary)] mx-auto
                  -outline-offset-[2px] z-50 outline-3"
                        ></div>
                    </div>
                    <div class="w-[70%] md:w-[80%] transition text-left text-50">
                        {group.posts.length} {i18n(group.posts.length === 1 ? I18nKey.postCount : I18nKey.postsCount)}
                    </div>
                </div>

                {#each group.posts as post (post.slug)}
                    <a
                            href={getPostUrlBySlug(post.slug)}
                            aria-label={post.data.title}
                            class="group btn-plain !block h-10 w-full rounded-lg hover:text-[initial]"
                    >
                        <div class="flex flex-row justify-start items-center h-full">
                            <!-- date -->
                            <div class="w-[15%] md:w-[10%] transition text-sm text-right text-50">
                                {formatDate(post.data.published)}
                            </div>

                            <!-- dot and line -->
                            <div class="w-[15%] md:w-[10%] relative dash-line h-full flex items-center">
                                <div
                                        class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5
                       bg-[oklch(0.5_0.05_var(--hue))] group-hover:bg-[var(--primary)]
                       outline outline-4 z-50
                       outline-[var(--card-bg)]
                       group-hover:outline-[var(--btn-plain-bg-hover)]
                       group-active:outline-[var(--btn-plain-bg-active)]"
                                ></div>
                            </div>

                            <!-- post title -->
                            <div
                                    class="w-[70%] md:max-w-[65%] md:w-[65%] text-left font-bold
                     group-hover:translate-x-1 transition-all group-hover:text-[var(--primary)]
                     text-75 pr-8 whitespace-nowrap overflow-ellipsis overflow-hidden"
                            >
                                {post.data.title}
                            </div>

                            <!-- tag list -->
                            <div
                                    class="hidden md:block md:w-[15%] text-left text-sm transition
                     whitespace-nowrap overflow-ellipsis overflow-hidden text-30"
                            >
                                {formatTag(post.data.tags)}
                            </div>
                        </div>
                    </a>
                {/each}
            </div>
        {/each}
    {/if}
</div>

<style>
    .filter-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.25rem 0.7rem;
        border-radius: 999px;
        border: 1px solid oklch(0.6 0 0 / 0.45);
        background: oklch(0.72 0 0 / 0.1);
        color: var(--primary);
        font-size: 0.82rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.15s ease, transform 0.15s ease;
    }

    .filter-chip:hover {
        background: oklch(0.72 0 0 / 0.2);
    }

    .filter-chip:active {
        transform: scale(0.96);
    }

    .chip-x {
        opacity: 0.55;
        font-weight: 400;
    }
</style>
