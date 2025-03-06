# Tuntask

# HOW TO CODE

## Penulisan Kode

#### 1. Konvensi Penamaan

Pada project Tuntask, konvensi penamaan yang digunakan adalah camelCase

```javascript
variableName = "string";
```

# HOW TO CLONE PROJECT

#### 1. Clone repository

Buka terminal atau command prompt dan jalankan perintah berikut untuk clone repositori Laravel ke dalam direktori lokal

```git
git clone https://github.com/harycp/managament-tasks-kel-10.git
```

#### 2. Ganti directory project

Setelah clone selesai, masuk ke folder project yang baru saja di-clone

```bash
cd nama-folder-project
```

#### 3. Install dependencies

Project Tuntask menggunakan dependency manager bernama NPM. Untuk menginstall dependency, jalankan

```bash
npm install
```


# HOW TO UPDATE THE PROJECT WITH GIT VERSION CONTROL SYSTEM

#### 1. Membuat branch baru setiap menambahkan fitur baru

Format penamaan branch baru adalah sebagai berikut:

```
git checkout -b feat/<posisi>-<fitur>
```

Contoh:

```git
git checkout -b feat/fe-landing-page
git checkout -b feat/be-auth-user
```


#### 3. Jangan lupa untuk selalu ngemerge code program dari branch master agar selalu up to date dan tidak conflict

Contoh:

```git
git merge master
```

atau 

```git
git merge feature-branch
```

#### 2. Melakukan commit setiap aktivitas yang dilakukan

Format commit adalah sebagai berikut:

```
feat: (new feature for the user, not a new feature for build script)
fix: (bug fix for the user, not a fix to a build script)
docs: (changes to the documentation)
style: (formatting, missing semi colons, etc; no production code change)
refactor: (refactoring production code, eg. renaming a variable)
test: (adding missing tests, refactoring tests; no production code change)
chore: (updating grunt tasks etc; no production code change)
```

Contoh:

```git
git commit -m "feat: add navbar on landing page"
git commit -m "test: add ResetPasswordTest, ForgotPasswordTest, checkPasswordResetTokenByTest"
```

#### 3. Jangan lupa berdoa dan push kode program yang sudah di-commit

Contoh:

```git
git push origin namaBranch
```

## Tentang Tuntask

TunTask adalah platform manajemen tugas yang dikhususkan untuk himpunan atau organisasi kampus. Dirancang untuk membantu tim mengelola proyek, berkolaborasi, dan meningkatkan produktivitas dengan sistem yang terstruktur dan mudah digunakan.

## Referensi Website Sejenis

- **Notion** – Membantu pengguna mencatat, merencanakan proyek, dan berkolaborasi.
- **Trello** – Menyediakan sistem board untuk mengatur tugas secara fleksibel.
- **Monday.com** – Mengelola proyek dengan fitur kolaborasi yang kuat.
- **ClickUp** – Platform project management dengan fitur lengkap.
- **Jira** – Awalnya untuk bug tracking, kini digunakan untuk manajemen proyek.

## Mockup Halaman Utama

Halaman utama TunTask dirancang melalui beberapa tahapan desain:
![Hi-FI Main Tuntask](hi-fimockuptuntask.png)

## Desain Database Tuntask

![Desain Database](DATABASEDIAGRAMTUNTASK.png)

### One-to-Many (1:N)

- **users → workspaces** (workspaces.owner_id → users.id)
- **workspaces → workspace_members** (workspace_members.workspace_id → workspaces.id)
- **users → workspace_members** (workspace_members.user_id → users.id)
- **workspaces → boards** (boards.workspace_id → workspaces.id)
- **boards → lists** (lists.board_id → boards.id)
- **lists → tasks** (tasks.list_id → lists.id)
- **users → tasks** (tasks.assignee_id → users.id)
- **tasks → task_comments** (task_comments.task_id → tasks.id)
- **users → task_comments** (task_comments.user_id → users.id)
- **tasks → task_attachments** (task_attachments.task_id → tasks.id)
- **users → notifications** (notifications.receiver_id → users.id)

### Many-to-Many (M:N)

- **users ↔ user_roles** (Pivot: user_role_assignments)
- **user_roles ↔ permissions** (Pivot: role_permissions)
- **tasks ↔ task_labels** (Pivot: task_label_assignments)

### Tabel Pivot

- **user_role_assignments** → Menghubungkan users dengan user_roles
- **role_permissions** → Menghubungkan user_roles dengan permissions
- **workspace_members** → Menghubungkan workspaces dengan users
- **task_label_assignments** → Menghubungkan tasks dengan task_labels
