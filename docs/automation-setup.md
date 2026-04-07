# Automation Setup

This document describes how to configure and run the daily cross-repo maintenance bot hosted in `niketbhatt2002/BizRipple`.

## Overview

A GitHub Actions workflow (`.github/workflows/daily-maintenance.yml`) runs daily at 04:30 UTC.  
It authenticates via a GitHub App, selects one target repository per day using a deterministic rotation, and opens **exactly 1 pull request** containing at least **9 meaningful maintenance commits** (docs, changelog, GitHub metadata, ops-trace notes).

Target repositories:
- `niketbhatt2002/BizRipple`
- `niketbhatt2002/Credify`
- `niketbhatt2002/mina-crm-ai`

---

## Required Secrets

Add the following secrets to **`niketbhatt2002/BizRipple`** → Settings → Secrets and variables → Actions:

| Secret name | Value |
|---|---|
| `MAINT_BOT_APP_ID` | Numeric App ID shown on the GitHub App's settings page |
| `MAINT_BOT_PRIVATE_KEY` | Full PEM private key generated for the GitHub App |

---

## GitHub App Setup (one-time)

1. Go to **GitHub Settings → Developer settings → GitHub Apps → New GitHub App**.
2. Fill in a name (e.g. `BizRipple Maintenance Bot`) and homepage URL.
3. Under **Repository permissions**, set:
   - **Contents**: Read & Write
   - **Pull requests**: Read & Write
   - **Metadata**: Read (required by default)
4. Leave webhooks disabled.
5. Click **Create GitHub App**.
6. Note the **App ID** shown at the top of the app settings page → save as `MAINT_BOT_APP_ID`.
7. Scroll to **Private keys** → **Generate a private key** → save the downloaded `.pem` file contents as `MAINT_BOT_PRIVATE_KEY`.
8. Click **Install App** and choose **niketbhatt2002** as the account.
9. Select **Only select repositories** and include all three repos:
   - `BizRipple`
   - `Credify`
   - `mina-crm-ai`
10. Click **Install**.

---

## Running the Workflow Manually

1. Go to `niketbhatt2002/BizRipple` → **Actions**.
2. Select **Daily Cross-Repo Maintenance** in the left sidebar.
3. Click **Run workflow** → **Run workflow**.

The bot will run immediately and print a summary of what it did.

---

## How It Works

- **Rotation**: `today.toordinal() % 3` deterministically picks one repo per calendar day.
- **Branch**: `bot/maintenance-YYYY-MM-DD` is created from `main` if it does not exist.
- **Changes**: at least 9 real file writes (maintenance log, changelog, CODEOWNERS, PR template, dated ops-note files).
- **Duplicate guard**: if an open PR already targets today's branch, no new PR is opened.
- **Max PRs**: hard limit of 1 PR per day total across all repos (configurable in `bot-config.yml`).
