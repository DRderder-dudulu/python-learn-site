"""网站代码示例自动验证（进入网站前的强制检查）。

1) 抽取 js/data-course.js 中所有 String.raw`...` 课程示例，用当前 Python 在独立临时目录逐个运行；
2) 抽取 js/data-exercises.js 中每题的 solution 与全部判题 expr，拼接后运行（答案必须通过所有断言）。
任何失败以非零码退出。用法：python tools/verify_examples.py
最后核对：2026-09
"""
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PY = sys.executable


def run_code(code, cwd):
    return subprocess.run(
        [PY, "-c", code],
        capture_output=True, text=True, cwd=cwd, timeout=30,
        encoding="utf-8", errors="replace",
    )


def unesc(s):
    """还原 JS 字符串转义（仅处理本站数据用到的几种）。"""
    return s.replace('\\"', '"').replace("\\'", "'").replace("\\n", "\n").replace("\\\\", "\\")


failures = []

# ---------- 1) 课程与速查示例 ----------
files = ["js/data-course.js", "js/data-cheatsheet-adv.js"]
files += [f"js/{p.name}" for p in sorted((ROOT / "js").glob("course-*.js"))]
files += [f"js/{p.name}" for p in sorted((ROOT / "js").glob("cheat-*.js"))]
blocks = []
for rel in files:
    text = (ROOT / rel).read_text(encoding="utf-8")
    found = re.findall(r"code:\s*String\.raw`([^`]*)`", text)
    blocks += [(rel, c) for c in found]
print(f"[课程+速查示例] 共 {len(blocks)} 个")
passed = 0
for i, (rel, code) in enumerate(blocks, 1):
    if "input(" in code:
        print(f"  #{i}({rel}): 跳过（含 input，网页环境不适用）")
        continue
    with tempfile.TemporaryDirectory() as td:
        r = run_code(code, td)
    if r.returncode == 0:
        passed += 1
    else:
        tail = (r.stderr.strip().splitlines() or ["非零退出"])[-1]
        failures.append(f"{rel} 示例 #{i}: {tail}")
        print(f"  #{i}({rel}): 失败 -> {tail}")
print(f"  通过 {passed}/{len(blocks)}")

# ---------- 2) 习题参考答案 + 判题用例 ----------
ex = (ROOT / "js" / "data-exercises.js").read_text(encoding="utf-8")
sol_blocks = re.findall(r'solution:\s*"((?:[^"\\]|\\.)*)"', ex)
expr_blocks = re.findall(r"expr:\s*'((?:[^'\\]|\\.)*)'", ex)
chunks = re.split(r"\{\s*id:\s*\d+", ex)[1:]
case_counts = [len(re.findall(r"expr:\s*'", c)) for c in chunks]
print(f"[习题] 答案 {len(sol_blocks)} 个，用例共 {len(expr_blocks)} 条")
idx = 0
for ti, sol in enumerate(sol_blocks):
    n = case_counts[ti] if ti < len(case_counts) else 0
    exprs = [unesc(e) for e in expr_blocks[idx:idx + n]]
    idx += n
    full = unesc(sol) + "\n\n" + "\n".join(exprs)
    with tempfile.TemporaryDirectory() as td:
        r = run_code(full, td)
    if r.returncode == 0:
        print(f"  习题 {ti + 1}: 通过（{n} 条用例）")
    else:
        tail = (r.stderr.strip().splitlines() or ["非零退出"])[-1]
        failures.append(f"习题 {ti + 1}: {tail}")
        print(f"  习题 {ti + 1}: 失败 -> {tail}")

print()
if failures:
    print("失败汇总：")
    for f in failures:
        print(" -", f)
    sys.exit(1)
print(f"全部验证通过：课程+速查示例 {passed} 个 + 习题 {len(sol_blocks)} 个。")
