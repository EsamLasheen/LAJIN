/* Scaffolds a new post with full front-matter.
 *
 * Usage:
 *   pnpm new-post -- my-post-slug [--title "My Title"] [--tags "a,b,c"]
 *                    [--category "CTF"] [--description "..."] [--series "Name"] [--order 2]
 */

import fs from "fs"
import path from "path"

function getDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const args = process.argv.slice(2)

if (args.length === 0) {
  console.error(`Error: No filename argument provided
Usage: pnpm new-post -- <slug> [--title "Title"] [--tags "a,b"] [--category "CTF"] [--series "Name"] [--order 1]`)
  process.exit(1)
}

// parse named options
const named = {}
for (let i = 1; i < args.length; i++) {
  const arg = args[i]
  if (arg.startsWith("--")) {
    const key = arg.slice(2)
    named[key] = args[i + 1]
    i++
  }
}

let fileName = args[0]

// slugify the filename
fileName = fileName
  .toLowerCase()
  .replace(/[^a-z0-9-_]+/g, "-")
  .replace(/^-+|-+$/g, "")

if (!fileName) {
  console.error("Error: invalid slug")
  process.exit(1)
}

// Add .md extension if not present
const fileExtensionRegex = /\.(md|mdx)$/i
if (!fileExtensionRegex.test(fileName)) {
  fileName += ".md"
}

const targetDir = "./src/content/posts/"
const fullPath = path.join(targetDir, fileName)

if (fs.existsSync(fullPath)) {
  console.error(`Error: File ${fullPath} already exists `)
  process.exit(1)
}

// recursive mode creates multi-level directories
const dirPath = path.dirname(fullPath)
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
}

const title = named.title || fileName
const tags = (named.tags || "")
  .split(",")
  .map((t) => t.trim())
  .filter(Boolean)
const tagList = tags.map((t) => `"${t}"`).join(", ")
const seriesLines = named.series
  ? `series: "${named.series}"\n${named.order ? `seriesOrder: ${Number.parseInt(named.order, 10)}\n` : ""}`
  : ""

const content = `---
title: "${title}"
published: ${getDate()}
description: '${named.description || ""}'
image: ''
tags: [${tagList}]
category: '${named.category || ""}'
bismillah: true
draft: false
lang: ''
${seriesLines}---
`

fs.writeFileSync(path.join(targetDir, fileName), content)

console.log(`Post ${fullPath} created`)
console.log(`Tip: put your cover image next to index.md and set image: ./cover.jpg`)
