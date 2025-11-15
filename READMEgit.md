🚀 Team Workflow Guide (GitHub)

This project uses a clean and safe workflow to avoid breaking the main branch.
Follow these rules exactly.

🔥 1. Main Branch Rules

main = stable, working, clean.

No one pushes directly to main.

All changes must come through feature branches + Pull Requests (PRs).

🔥 2. How to Start (Clone Project)
git clone https://github.com/OWNER/REPO.git
cd REPO

🔥 3. Create Your Feature Branch

Use this when you start a new task:

git checkout main
git pull origin main
git checkout -b feature/task-name


Examples:

feature/login
feature/api-auth
fix/navbar
ui/update-home

🔥 4. Daily Workflow (Every Morning)

Always sync with main before working:

git checkout main
git pull origin main
git checkout feature/task-name
git merge main

🔥 5. Work Normally (Coding Phase)
git add .
git commit -m "Short clear message"
git push origin feature/task-name

🔥 6. Open a Pull Request

On GitHub:

Go to Pull Requests

Click New Pull Request

Select:
base: main ← compare: feature/task-name

Submit PR for review

🔥 7. Code Review Rules

At least one teammate reviews and approves.

Fix comments if needed.

Then merge the PR.

🔥 8. Updating Your Branch When Main Changes

If someone merged into main while you were working:

git checkout main
git pull origin main
git checkout feature/task-name
git merge main


Resolve conflicts if needed → continue working.

🔥 9. NEVER Do This

❌ Don’t push directly to main

git push origin main


❌ Don’t create feature branches without pulling main first.

❌ Don’t work on main directly.
