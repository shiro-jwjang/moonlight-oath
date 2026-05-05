#!/usr/bin/env python3
"""Check indentation consistency in script.js.
Detects 3-tab lines surrounded by 2-tab lines — these cause Monogatari.js
to misinterpret commands as callbacks, freezing the game."""
import sys

def main():
    with open('js/script.js') as f:
        lines = f.readlines()

    mismatches = []
    for i, line in enumerate(lines):
        stripped = line.lstrip('\t')
        if not stripped or stripped.startswith('//') or stripped.startswith('/*'):
            continue
        tabs = len(line) - len(stripped)
        if tabs == 3 and stripped.startswith("'"):
            prev_tabs = len(lines[i-1]) - len(lines[i-1].lstrip('\t')) if i > 0 and lines[i-1].strip() else 2
            next_tabs = len(lines[i+1]) - len(lines[i+1].lstrip('\t')) if i+1 < len(lines) and lines[i+1].strip() else 2
            if prev_tabs == 2 and next_tabs == 2:
                mismatches.append((i + 1, stripped.strip()[:70]))

    if mismatches:
        print(f"❌ 들여쓰기 불일치 {len(mismatches)}건 감지:")
        for ln, txt in mismatches[:10]:
            print(f"  L{ln}: {txt}")
        if len(mismatches) > 10:
            print(f"  ... 외 {len(mismatches)-10}건")
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == '__main__':
    main()
