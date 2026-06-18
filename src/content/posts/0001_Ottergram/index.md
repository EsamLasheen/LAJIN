---
title: Ottergram - Bugforge CTF Walkthrough
published: 2026-06-18
description: A complete walkthrough of the Ottergram Web CTF challenge on Bugforge, detailing how we exploit Broken Access Control (BAC) to delete administrative posts and capture the flag.
image: ./after-flag-post.png
tags: [CTF, Web Security, Broken Access Control, Writeup]
category: CTF
draft: false
---

# Ottergram: Broken Access Control Walkthrough

In this post, we will walk through the **Ottergram** challenge from Bugforge's Daily Challenges. This is an **Easy** difficulty web application challenge (worth 10 points) designed by user **arlix**. 

The vulnerability demonstrated in this challenge is **Broken Access Control** (specifically, missing function-level access control on administrative API endpoints).

---

## 🔍 Challenge Overview

- **Platform:** Bugforge (Daily Challenge)
- **Challenge Name:** Ottergram
- **Difficulty:** Easy
- **Category:** Web Security / Broken Access Control
- **Target URL:** `https://<lab-id>.labs-app.bugforge.io`
- **Initial Credentials Provided:** `admin:admin123` (for administration review demonstration)

---

## 🛠️ Step-by-Step Exploitation

### Step 1: Reconnaissance and Flagging a Post

Upon navigating to the target app, we see **Ottergram**, a simple photo-sharing social application for otters. 

We see a post by user `otter_lover` showing an adorable otter holding a soccer ball.

![Otter Lover Post](./after-flag-post.png)

At the bottom right of the post, we notice a flag icon. When we click it, we are prompted to report/flag the post for moderation. Let's flag the post for **"Inappropriate content"**.

---

### Step 2: The Admin Review Queue

Under the hood, flagged posts are sent to a moderation queue for administrative review (accessible at `/admin`).

Visiting the admin panel, we can see the post flagged by `esam` (our user account):

![Admin Review Queue](./admin-review.png)

As an administrator, there are two buttons available:
- **Mark as OK**
- **Delete Post**

If a standard user visits the main feed, they do not have access to any delete buttons. However, we want to see if the server restricts the underlying API endpoint from being called by a regular user.

---

### Step 3: Intercepting the Action

Using a proxy tool like **Burp Suite** or your browser's Developer Tools network tab, we capture the request sent when deleting a post. 

The delete button calls an API endpoint:
`DELETE /api/admin/posts/4`

Let's test if our regular user token (belonging to `esam`) can make this call directly. We send the request via Burp Suite Repeater using our normal user session JWT token:

![Token Deletion Request](./normal-token-user-delete.png)

:::important[The Vulnerability]
The server fails to perform authorization checks. Although the endpoint is `/api/admin/posts/4`, it only validates that the caller has a valid JWT token, without checking whether the user holds the **Admin** role. 
:::

The server accepts our unauthorized request and successfully deletes the post!

---

### Step 4: Obtaining the Flag

The server response contains the post-deletion message along with our flag:

```json
{
  "message": "Post deleted successfully",
  "flag": "bug{9gFA95dfDULowmvk4RJowbusb1YL2WFk}"
}
```

We can now submit this flag on the Bugforge dashboard:

![Flag Submission](./flag.png)

The flag is:
:spoiler[bug{9gFA95dfDULowmvk4RJowbusb1YL2WFk}]

---

## 🛡️ Remediation and Prevention

To fix this vulnerability, the developers must enforce strict authorization checks on the server:

1. **Implement Server-Side Role Checks:** Do not rely on hiding buttons in the frontend UI. The server must verify that the requesting user's JWT contains the `admin` role before processing requests at `/api/admin/*`.
2. **Principle of Least Privilege:** Users should only have access to API endpoints that are strictly necessary for their role.
3. **Use a Shared Authorization Middleware:** Utilize an authentication/authorization middleware library to wrap administrative routes and ensure checks are consistently applied.
