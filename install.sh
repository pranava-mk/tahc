#!/usr/bin/env bash
# tahc one-command installer
#
#   curl -fsSL https://raw.githubusercontent.com/pranava-mk/tahc/main/install.sh | bash
#
# What this does:
#   1. Checks for git, node, npm — offers to install anything missing
#      (asks for confirmation before any system-level/sudo action).
#   2. Clones pranava-mk/tahc into ./tahc (unless already inside the repo).
#   3. Runs `npm install`.
#   4. Prints the required manual step (real Supabase credentials) and
#      either starts `npm run dev` or prints the next command to run.
#
# Safe to re-run. Never silently installs system packages without asking.

set -euo pipefail

REPO_URL="https://github.com/pranava-mk/tahc.git"
REPO_NAME="tahc"

bold() { printf '\033[1m%s\033[0m\n' "$1"; }
info() { printf '\033[36m==>\033[0m %s\n' "$1"; }
warn() { printf '\033[33m!!\033[0m %s\n' "$1"; }
err()  { printf '\033[31mERROR:\033[0m %s\n' "$1" >&2; }

confirm() {
  # confirm "question" -> 0 (yes) / 1 (no). Defaults to "no" if non-interactive.
  local prompt="$1"
  if [ ! -t 0 ] && [ ! -t 1 ]; then
    warn "Non-interactive shell detected; skipping: $prompt"
    return 1
  fi
  read -r -p "$prompt [y/N] " reply </dev/tty || return 1
  case "$reply" in
    [yY][eE][sS]|[yY]) return 0 ;;
    *) return 1 ;;
  esac
}

detect_pkg_manager() {
  if command -v apt-get >/dev/null 2>&1; then echo "apt"; return; fi
  if command -v pacman >/dev/null 2>&1; then echo "pacman"; return; fi
  if command -v brew >/dev/null 2>&1; then echo "brew"; return; fi
  echo "unknown"
}

install_pkg() {
  local name="$1" pkg="$2"
  local pm
  pm="$(detect_pkg_manager)"
  local cmd=""
  case "$pm" in
    apt)    cmd="sudo apt-get update && sudo apt-get install -y $pkg" ;;
    pacman) cmd="sudo pacman -Sy --noconfirm $pkg" ;;
    brew)   cmd="brew install $pkg" ;;
    *)
      err "Could not detect a supported package manager (apt/pacman/brew)."
      err "Please install $name manually, then re-run this script."
      exit 1
      ;;
  esac

  bold "Missing dependency: $name"
  info "Detected package manager: $pm"
  info "Proposed command:"
  printf '    %s\n' "$cmd"
  if confirm "Run this now?"; then
    eval "$cmd"
  else
    err "$name is required. Install it manually and re-run this script."
    exit 1
  fi
}

check_or_install() {
  local bin="$1" name="$2" pkg="$3"
  if ! command -v "$bin" >/dev/null 2>&1; then
    install_pkg "$name" "$pkg"
  else
    info "$name found: $($bin --version 2>/dev/null | head -n1)"
  fi
}

main() {
  bold "tahc installer"
  echo

  # ---- 1. dependency checks -------------------------------------------
  check_or_install git  "git"  "git"
  check_or_install node "Node.js" "nodejs"
  check_or_install npm  "npm" "npm"

  if ! command -v git >/dev/null 2>&1 || ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
    err "Required tools still missing after install attempt. Aborting."
    exit 1
  fi
  echo

  # ---- 2. clone (unless already inside the repo) ----------------------
  if [ -f "./package.json" ] && grep -q '"name": "tahc"' ./package.json 2>/dev/null; then
    info "Already inside the tahc repo — skipping clone."
  elif [ -d "./$REPO_NAME/.git" ]; then
    info "./$REPO_NAME already exists — skipping clone."
    cd "./$REPO_NAME"
  else
    info "Cloning $REPO_URL ..."
    git clone "$REPO_URL" "$REPO_NAME"
    cd "./$REPO_NAME"
  fi
  echo

  # ---- 3. npm install ---------------------------------------------------
  info "Running npm install ..."
  npm install
  echo

  # ---- 4. Supabase credentials (manual, can't be automated) -----------
  if [ -f ".env.local.example" ] && [ ! -f ".env.local" ]; then
    cp .env.local.example .env.local
    bold "⚠️  MANUAL STEP REQUIRED — Supabase credentials"
    cat <<'EOF'

tahc needs a real Supabase project to run (Postgres, Realtime, Edge
Functions). This cannot be automated — credentials are secrets.

  1. Open .env.local.example -> .env.local has been created for you.
  2. Go to your Supabase project dashboard -> Project Settings -> API.
  3. Fill in VITE_SUPABASE_ANON_KEY in .env.local
     (VITE_SUPABASE_URL is pre-filled from .env.local.example).
  4. If you don't have a Supabase project yet, create one free at
     https://supabase.com, then apply the schema in supabase/migrations/.

EOF
  elif [ -f ".env.local" ]; then
    info ".env.local already present — skipping credential setup."
  else
    warn "No .env.local.example found; check the repo for required env vars."
  fi

  # ---- 5. start dev server, or tell the user how --------------------
  echo
  bold "Install complete."
  if [ -f ".env.local" ] && grep -q 'VITE_SUPABASE_ANON_KEY=.\+' .env.local 2>/dev/null; then
    info "Supabase credentials detected — starting dev server (npm run dev)..."
    npm run dev
  else
    warn "Supabase credentials are not yet set in .env.local."
    echo
    echo "Once you've filled them in, start the app with:"
    echo
    printf '    cd %s && npm run dev\n' "$REPO_NAME"
    echo
    echo "It will be available at http://localhost:3000"
  fi
}

main "$@"
