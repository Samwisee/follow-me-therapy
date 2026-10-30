"""Is what's published on claude.ai the same as the repo?

    python3 tools/check_published.py            list anything published that's behind the repo
    python3 tools/check_published.py --record design-system|worksheets
                                                after publishing, record what was sent

Two artifacts carry copies of the design and can't be updated from CI, so
they're published by hand (see CLAUDE.md):
  - the Design System artifact: every file under design/design-system/project
  - the worksheets canvas: its ds/followmetherapy copy of the Design System
design/published.json holds a fingerprint of each file as last published.
The Design checks workflow runs this on every push to preview and warns when
something is behind, with the files to publish.
"""
import hashlib, json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RECORD = ROOT / "design/published.json"
DS = ROOT / "design/design-system"

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()[:16]

def sources(name):
    """Published path → the repo file it's published from."""
    if name == "design-system":
        return {str(p.relative_to(DS)): p for p in sorted((DS / "project").rglob("*")) if p.is_file() and p.name != ".DS_Store"}
    if name == "worksheets":
        return {
            "project/ds/followmetherapy/components/bundle.css": DS / "project/components/bundle.css",
            "project/ds/followmetherapy/tokens.css": ROOT / "css/tokens.css",
            "project/ds/followmetherapy/tokens.json": DS / "project/tokens.json",
        }
    raise SystemExit(f"unknown artifact {name}")

ARTIFACTS = {"design-system": "Design System (claude.ai/artifact/PpGrcgoW6GiisT7FzdRUoK, root design/design-system)",
             "worksheets": "Worksheets canvas (claude.ai/artifact/WsfwJ2fGnjRRfkam2rUmfk)"}
record = json.loads(RECORD.read_text()) if RECORD.exists() else {}

if len(sys.argv) == 3 and sys.argv[1] == "--record":
    name = sys.argv[2]
    record[name] = {k: sha(v) for k, v in sources(name).items()}
    RECORD.write_text(json.dumps(record, indent=1, sort_keys=True) + "\n")
    print(f"recorded {len(record[name])} files for {name}")
    sys.exit(0)

behind = 0
for name, what in ARTIFACTS.items():
    was = record.get(name, {})
    stale = [k for k, v in sources(name).items() if was.get(k) != sha(v)]
    if stale:
        behind += 1
        # Annotation for GitHub, plain for a terminal.
        print(f"::warning::{what} is behind the repo: publish {', '.join(stale[:12])}{' …' if len(stale) > 12 else ''}")
print("Everything published matches the repo." if not behind else f"{behind} artifact(s) to publish (then --record).")
