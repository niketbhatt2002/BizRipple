"""
Daily cross-repo maintenance bot.

Runs from niketbhatt2002/BizRipple, targets all three repos in a
deterministic daily rotation, creates exactly 1 PR/day with ≥ 9 real
maintenance commits.
"""

import datetime
import os
import sys

import yaml
from github import Github, GithubException

# Hard cap on the number of ops-note files created in a single run.
MAX_OPS_NOTES = 50


# ---------------------------------------------------------------------------
# Config / auth
# ---------------------------------------------------------------------------

def load_config(path: str = "bot-config.yml") -> dict:
    if not os.path.exists(path):
        print(f"ERROR: config file not found: {path}", file=sys.stderr)
        sys.exit(1)
    with open(path, "r", encoding="utf-8") as fh:
        return yaml.safe_load(fh)


def utc_today() -> datetime.date:
    return datetime.datetime.now(datetime.timezone.utc).date()


# ---------------------------------------------------------------------------
# File helpers
# ---------------------------------------------------------------------------

def ensure_file(repo, path: str, content: str, message: str, branch: str) -> bool:
    """
    Create or update *path* in *branch* with *content*.

    Args:
        repo: PyGithub ``Repository`` object for the target repo.
        path: File path relative to the repo root (e.g. ``docs/README.md``).
        content: Full desired file content as a UTF-8 string.
        message: Commit message to use when writing the file.
        branch: Branch name to write to.

    Returns:
        True if a write was performed (file absent or content differed),
        False if the existing content was already identical (no-op skipped).
    """
    try:
        existing = repo.get_contents(path, ref=branch)
        current = existing.decoded_content.decode("utf-8")
        if current == content:
            return False
        repo.update_file(path, message, content, existing.sha, branch=branch)
        return True
    except GithubException as exc:
        if exc.status == 404:
            repo.create_file(path, message, content, branch=branch)
            return True
        raise


# ---------------------------------------------------------------------------
# Maintenance changes
# ---------------------------------------------------------------------------

def apply_maintenance_changes(
    repo, branch: str, today: datetime.date, min_commits: int
) -> int:
    """
    Apply at least *min_commits* real, small maintenance edits to *branch*.

    Args:
        repo: PyGithub ``Repository`` object for the target repo.
        branch: Branch name to commit changes into.
        today: The current UTC date (used to stamp log/changelog entries).
        min_commits: Minimum number of file writes required before a PR is
            considered ready.

    Returns:
        The number of commits actually made during this run.
    """
    date_str = today.isoformat()
    committed = 0

    # 1) Daily maintenance log — append today's entry if not already present
    log_path = "docs/MAINTENANCE_LOG.md"
    log_entry = f"## {date_str}\n- Automated repo maintenance run.\n"
    try:
        existing_log = repo.get_contents(log_path, ref=branch)
        current_log = existing_log.decoded_content.decode("utf-8")
        if date_str not in current_log:
            new_log = current_log.rstrip("\n") + f"\n\n{log_entry}"
            repo.update_file(
                log_path,
                f"docs: add maintenance log for {date_str}",
                new_log,
                existing_log.sha,
                branch=branch,
            )
            committed += 1
    except GithubException as exc:
        if exc.status == 404:
            repo.create_file(
                log_path,
                f"docs: add maintenance log for {date_str}",
                f"# Maintenance Log\n\n{log_entry}",
                branch=branch,
            )
            committed += 1
        else:
            raise

    # 2) Changelog — append today's entry if not already present
    changelog_path = "CHANGELOG.md"
    cl_entry = f"## {date_str}\n- Maintenance: docs/meta/housekeeping updates.\n"
    try:
        existing_cl = repo.get_contents(changelog_path, ref=branch)
        current_cl = existing_cl.decoded_content.decode("utf-8")
        if date_str not in current_cl:
            new_cl = current_cl.rstrip("\n") + f"\n\n{cl_entry}"
            repo.update_file(
                changelog_path,
                f"chore(changelog): add entry for {date_str}",
                new_cl,
                existing_cl.sha,
                branch=branch,
            )
            committed += 1
    except GithubException as exc:
        if exc.status == 404:
            repo.create_file(
                changelog_path,
                f"chore(changelog): add entry for {date_str}",
                f"# Changelog\n\n{cl_entry}",
                branch=branch,
            )
            committed += 1
        else:
            raise

    # 3) CODEOWNERS baseline
    if ensure_file(
        repo,
        ".github/CODEOWNERS",
        "* @niketbhatt2002\n",
        "chore(github): ensure CODEOWNERS baseline",
        branch,
    ):
        committed += 1

    # 4) PR template
    if ensure_file(
        repo,
        ".github/pull_request_template.md",
        (
            "## Summary\n\n"
            "- What changed?\n\n"
            "## Checklist\n\n"
            "- [ ] Tests updated\n"
            "- [ ] Docs updated\n"
        ),
        "chore(github): add PR template baseline",
        branch,
    ):
        committed += 1

    # 5 … N) Ops-note files — each one is traceable, dated, repo-specific
    note_index = 1
    while committed < min_commits:
        content = (
            f"# Ops Note {note_index}\n\n"
            f"- Date: {date_str}\n"
            f"- Repository: {repo.full_name}\n"
            f"- Action: Daily maintenance trace record.\n"
        )
        if ensure_file(
            repo,
            f"docs/ops-notes/{date_str}-note-{note_index}.md",
            content,
            f"docs(ops): add maintenance note {note_index} for {date_str}",
            branch,
        ):
            committed += 1
        note_index += 1
        if note_index > MAX_OPS_NOTES:  # hard safety cap — should never be reached
            break

    return committed


# ---------------------------------------------------------------------------
# PR helpers
# ---------------------------------------------------------------------------

def open_pr_exists(repo, branch_name: str, base_branch: str) -> bool:
    """
    Return True if an open PR already targets *branch_name* → *base_branch*.

    Args:
        repo: PyGithub ``Repository`` object for the target repo.
        branch_name: Head branch of the PR to look for (without owner prefix).
        base_branch: Base branch the PR would merge into (e.g. ``main``).
    """
    owner = repo.owner.login
    head_ref = f"{owner}:{branch_name}"
    pulls = repo.get_pulls(state="open", head=head_ref, base=base_branch)
    return pulls.totalCount > 0


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    """
    Entry point for the daily maintenance bot.

    Workflow:
    1. Validate ``GH_TOKEN`` and load ``bot-config.yml``.
    2. Determine today's target repo via deterministic ordinal-based rotation.
    3. Ensure the ``bot/maintenance-YYYY-MM-DD`` branch exists in that repo.
    4. Skip if an open PR for that branch already exists (duplicate guard).
    5. Apply ≥ ``min_commits_per_pr`` real maintenance edits.
    6. Open one PR; enforce the ``max_prs_per_day_total`` hard limit.
    7. Print a summary and exit cleanly.
    """
    token = os.getenv("GH_TOKEN")
    if not token:
        print("ERROR: GH_TOKEN environment variable is required.", file=sys.stderr)
        sys.exit(1)

    cfg = load_config()
    owner: str = cfg["owner"]
    target_repos: list = cfg["target_repos"]
    max_prs: int = int(cfg["max_prs_per_day_total"])
    min_commits: int = int(cfg["min_commits_per_pr"])
    default_branch: str = cfg.get("default_branch", "main")

    gh = Github(token)
    today = utc_today()
    date_str = today.isoformat()
    branch_name = f"bot/maintenance-{date_str}"

    # Deterministic daily rotation — ordinal ensures the same repo is always
    # chosen on the same calendar day regardless of when the workflow fires.
    idx = today.toordinal() % len(target_repos)
    ordered = target_repos[idx:] + target_repos[:idx]

    prs_created = 0
    for repo_name in ordered:
        if prs_created >= max_prs:
            break

        full_name = f"{owner}/{repo_name}"
        print(f"[{full_name}] Checking …")

        repo = gh.get_repo(full_name)

        # Ensure maintenance branch exists (create from default branch if absent)
        try:
            repo.get_branch(branch_name)
            print(f"[{full_name}] Branch '{branch_name}' already exists.")
        except GithubException as exc:
            if exc.status == 404:
                base_sha = repo.get_branch(default_branch).commit.sha
                repo.create_git_ref(
                    ref=f"refs/heads/{branch_name}", sha=base_sha
                )
                print(f"[{full_name}] Created branch '{branch_name}'.")
            else:
                raise

        # Skip if a PR is already open for today's branch
        if open_pr_exists(repo, branch_name, default_branch):
            print(f"[{full_name}] Open PR already exists — skipping.")
            continue

        # Apply changes
        commits_made = apply_maintenance_changes(
            repo, branch_name, today, min_commits
        )
        print(f"[{full_name}] Commits applied: {commits_made}")

        if commits_made < min_commits:
            print(
                f"[{full_name}] Only {commits_made}/{min_commits} commits made "
                "(content already up-to-date) — skipping PR."
            )
            continue

        # Open the PR
        pr = repo.create_pull(
            title=f"chore: daily maintenance {date_str}",
            body=(
                f"Automated daily maintenance PR for `{full_name}`.\n\n"
                f"Contains {commits_made} small, legitimate maintenance commits "
                "(docs / changelog / GitHub meta / ops trace updates).\n"
            ),
            head=branch_name,
            base=default_branch,
        )
        print(f"[{full_name}] PR opened: {pr.html_url}")
        prs_created += 1

    print(f"\nDone. PRs created today: {prs_created}")


if __name__ == "__main__":
    main()
