---
name: check-line-endings
description: Check FamilyHub files against the Git line-ending rules (LF in the repository, platform endings in the working copy, CRLF for .bat/.cmd, LF for .sh, no mixed files), then fix what breaks them. Use when asked to check, verify or fix line endings, CRLF/LF or .gitattributes issues anywhere in the repository, and before committing.
argument-hint: "[files or folders] [report]"
---

# Check line endings

Check files in the repository against the line-ending rules below, then fix what you find. The rules come from `.gitattributes` and the "Line endings (Git)" section of the `coding-conventions` skill. If the two ever disagree, `.gitattributes` wins, because Git enforces it.

## Arguments

- **Files or folders** (optional): check only these. Without them, check the changed files: everything `git status --porcelain` lists as modified, added, renamed or untracked. If nothing has changed, check the whole repository.
- **`report`** (optional): only report findings and change nothing.

## Rules

| # | Rule | Where it shows in `git ls-files --eol` |
|---|---|---|
| 1 | The index (what is committed) is LF only. | index column must be `i/lf` (or `i/none` for an empty file, `i/-text` for binary). `i/crlf` or `i/mixed` breaks it. |
| 2 | No file mixes CRLF and LF. | `w/mixed` or `i/mixed` breaks it. |
| 3 | `.bat` and `.cmd` are CRLF in the working copy on every platform. | must be `w/crlf` with `attr/text eol=crlf`. |
| 4 | `.sh` is LF in the working copy on every platform. | must be `w/lf` with `attr/text eol=lf`. |
| 5 | Other text files use the platform's endings in the working copy (CRLF on Windows), matching the files around them. | on Windows, `w/lf` is a finding. It is harmless for Git (the index stays LF) but should match its neighbors. |
| 6 | Every text file type is covered by `.gitattributes`. Binary types are marked `binary`. | a binary file without `-text`, or a new script type without an explicit `eol`, is a finding for `.gitattributes`. |

Rules 1 to 4 are errors. Rule 5 is a warning, because Git normalizes it on commit. Rule 6 is a finding for `.gitattributes`, not for the file.

## Steps

1. Run everything from the repository root (`git rev-parse --show-toplevel`). Use the Bash tool (Git Bash on Windows).
2. Work out which files to check (see Arguments):
   ```sh
   git status --porcelain --untracked-files=all   # changed files, when no arguments are given
   ```
   Skip deleted files, and everything under `bin/`, `obj/`, `node_modules/` and `dist/`.
3. Read the line endings with Git, not with `grep`/`od`. Git Bash's `grep` doesn't match `\r` reliably:
   ```sh
   git ls-files --eol -- <files>                              # tracked files: i/ index, w/ working copy, attr/
   git ls-files --eol --others --exclude-standard -- <files>  # untracked files: only the w/ column is filled
   git diff --check; git diff --cached --check                # stray CR and trailing whitespace in changed lines
   ```
   Detect the platform with `uname -s` (`MINGW*`/`MSYS*` = Windows, CRLF is the native ending).
4. Check every file against the rules. For a file that is staged, the `i/` column is what will be committed.
5. Unless `report` was passed, fix the findings:
   - **Rule 2, 3, 5 (working copy)**: convert the whole file to its correct ending with `unix2dos <file>` (CRLF) or `dos2unix <file>` (LF). Both are part of Git for Windows; if they are missing, use `sed -i 's/\r*$/\r/' <file>` or `sed -i 's/\r$//' <file>`. This rewrites only the working copy. For a tracked text file, `git diff -- <file>` must show no new change afterwards; if it does, undo the conversion and report the file instead.
   - **Rule 4 (`.sh`)**: convert with `dos2unix <file>`.
   - **Rule 1 and 2 (index)**: only for a file that is staged and has no unstaged changes (`git diff --quiet -- <file>`), run `git add --renormalize -- <file>`. Never stage changes the user hasn't staged. Otherwise, report the file and the command to run.
   - **Rule 6**: add the missing pattern to `.gitattributes` next to the similar entries (for example `*.ps1 text eol=crlf`, `*.webp binary`), then run `git add --renormalize .` only if the user asks for it, because it touches every matching file.
   - Never run `git config core.autocrlf`, `git checkout`/`git restore` on changed files, or anything that discards edits.
6. Check again with `git ls-files --eol -- <files>` and `git diff --check` and make sure the findings are gone.
7. Report the result (see Report).

## Notes

- A line-ending-only change belongs in its own commit (see `coding-conventions`). Say so when fixes touched files that also have content changes.
- Prettier (`sources/Web.App/.prettierrc.json`, `endOfLine: auto`) keeps each file's existing ending, so it doesn't fix or cause mixed endings in single files. New files written by tools are usually LF, which is why rule 5 findings are common after editing on Windows.

## Report

Answer in this format:

- One line saying which files were checked (count and scope) and whether anything was found.
- A list of findings, grouped by rule, each with a clickable file link, the `git ls-files --eol` columns and what was changed. With `report`, say what should change and the command that does it.
- The result of the final check from step 6. If something couldn't be fixed, say so and why.

If nothing breaks the rules, say that in one line.
