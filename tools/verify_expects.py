# -*- coding: utf-8 -*-
"""expect 实跑比对：课程/速查每个声明了 expect 的代码块，真实运行后 stdout 必须与 expect 完全一致。

用法：python tools/verify_expects.py            # 全量
      python tools/verify_expects.py course-01  # 只查文件名含该子串的文件
任何不一致以非零码退出。
"""
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PY = sys.executable
ONLY = sys.argv[1] if len(sys.argv) > 1 else ""

files = ["js/data-course.js"]
files += [f"js/{p.name}" for p in sorted((ROOT / "js").glob("course-*.js"))]
files += [f"js/{p.name}" for p in sorted((ROOT / "js").glob("cheat-*.js"))]
if ONLY:
    files = [f for f in files if ONLY in f]

CODE_RE = re.compile(r"code:\s*String\.raw`([^`]*)`")
EXPECT_RE = re.compile(r'expect:\s*"((?:[^"\\]|\\.)*)"')


def unesc(s):
    """按 JS 字符串语义单遍还原转义（避免 \\n 与 \\\\ 的处理顺序互相污染）。"""
    out = []
    i = 0
    while i < len(s):
        c = s[i]
        if c == "\\" and i + 1 < len(s):
            n = s[i + 1]
            out.append({"n": "\n", "t": "\t", "\\": "\\", '"': '"', "'": "'"}.get(n, c + n))
            i += 2
        else:
            out.append(c)
            i += 1
    return "".join(out)


pairs = []
for rel in files:
    text = (ROOT / rel).read_text(encoding="utf-8")
    for m in CODE_RE.finditer(text):
        nxt_code = CODE_RE.search(text, m.end())
        limit = nxt_code.start() if nxt_code else len(text)
        nxt = EXPECT_RE.search(text, m.end(), min(m.end() + 600, limit))
        if nxt:
            pairs.append((rel, m.group(1), unesc(nxt.group(1))))

print(f"[expect 实跑比对] 共 {len(pairs)} 对（仅含声明 expect 的块）")
fails = 0
skipped = 0
for i, (rel, code, expect) in enumerate(pairs, 1):
    if "input(" in code:
        skipped += 1
        continue
    with tempfile.TemporaryDirectory() as td:
        r = subprocess.run([PY, "-c", code], capture_output=True, text=True,
                           cwd=td, timeout=30, encoding="utf-8", errors="replace")
    got = r.stdout.strip()
    want = expect.strip()
    if r.returncode != 0:
        tail = (r.stderr.strip().splitlines() or ["非零退出"])[-1]
        print(f"  #{i}({rel}): 运行失败 -> {tail}")
        fails += 1
    elif got != want:
        print(f"  #{i}({rel}): 输出不符\n    期望: {want[:120]!r}\n    实际: {got[:120]!r}")
        fails += 1

print(f"  一致 {len(pairs) - fails - skipped}/{len(pairs)}（跳过 input 块 {skipped} 个）")
if fails:
    print(f"失败 {fails} 处")
    sys.exit(1)
print("EXPECT OK")
