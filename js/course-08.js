/* ===== 课程内容数据 · 第八层 =====
 * 内容来源：《Python 3 语法完全指南》（outputs/python-syntax-guide.md）第八层 · 文件读写。
 * 写法规范：section.id 即指南小节号；points 为分条要点（内联 <code>/<b>）；
 * 【对应规范】points 每条要点必须在 code 中有明确对应：可演示的写成可运行代码并配注释；
 * 错误/危险示范以「故意注释掉」的形式呈现（学员可取消注释亲测报错）；
 * code 示例均经本地 Python 实际运行验证（tools/verify_examples.py + verify_expects.py）；expect 为真实输出。
 * 适用版本：3.8—3.14 ｜ 最后核对：2026-10
 */
COURSE.push({
  id: 8,
  title: "第八层 · 文件读写",
  minutes: 45,
  goal: "会安全地读写文件：with + encoding + 块内读完三件套",
  prereq: "第一~六层",
  versions: "3.8—3.14",
  checked: "2026-10",
  sections: [
    {
      id: "8.1", title: "open 与 with 三件套",
      use: "读写文本文件的标配动作。要存结果、读配置、处理日志文件时，就照这三件套写，既不漏关文件也不怕中文乱码。",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/inputoutput.html#reading-and-writing-files",
      points: [
        "⭐⭐ 三件套：用 with、写 encoding=\"utf-8\"、在 with 块内完成读写",
        "模式：r 读 / w 清空写 ⭐ / a 追加 / x 排他创建 / b 二进制 / + 读写",
        "读取三粒度：read() 全读、readline() 一行、for line in f 逐行迭代（推荐，省内存）",
        "⭐ write 不会自动加换行；逐行读出的行尾有 \\n，用 rstrip(\"\\n\") 去掉",
      ],
      code: String.raw`# ⭐⭐ 三件套：with 自动关闭 + encoding="utf-8" + 在 with 块内完成读写
with open("demo.txt", "w", encoding="utf-8") as f:   # w 清空写：原内容先被清空 ⭐
    f.write("第一行\n")      # ⭐ write 不会自动加换行，\n 要自己写
    f.write("第二行\n")

with open("demo.txt", "a", encoding="utf-8") as f:   # a 追加：不清空，接在末尾
    f.write("第三行\n")

# with open("demo.txt", "x", encoding="utf-8") as f:  # ⭐ x 排他创建（故意注释掉）：文件已存在会报 FileExistsError
#     f.write("不会执行到")
# 另有 b 二进制模式（读出/写入都是 bytes，第九层细说）与 + 读写模式（如 r+ 不清空从头改）

with open("demo.txt", "r", encoding="utf-8") as f:   # r 读（默认模式，可省略）
    print(f.read().splitlines())        # read() 全读：整个文件读成一个字符串

with open("demo.txt", encoding="utf-8") as f:
    print(f.readline().rstrip("\n"))    # readline() 只读一行

with open("demo.txt", encoding="utf-8") as f:
    for line in f:                      # for line in f 逐行迭代（推荐，省内存）
        print(line.rstrip("\n"))        # ⭐ 逐行读出的行尾带 \n，用 rstrip("\n") 去掉`,
      expect: "['第一行', '第二行', '第三行']\n第一行\n第一行\n第二行\n第三行",
      note: "忘写 encoding 是中文环境乱码/报错的头号原因。",
    },
    {
      id: "8.2", title: "pathlib（现代推荐）",
      use: "拼路径、建目录、按模式找文件、拆文件名，都归它管。要写「处理某个文件夹里所有 .txt」这类脚本时，比手拼路径字符串省心得多。",
      doc: "https://docs.python.org/zh-cn/3.14/library/pathlib.html",
      points: [
        "用 / 拼路径，跨平台；read_text / write_text 一行读写",
        "mkdir(parents=True, exist_ok=True)：递归建目录且已存在不报错 ⭐",
        "glob / rglob 找文件；name / stem / suffix / parent 拆路径",
      ],
      code: String.raw`from pathlib import Path

d = Path("data") / "sub"              # 用 / 拼路径，跨平台
d.mkdir(parents=True, exist_ok=True)  # ⭐ 递归建目录，已存在也不报错

p = d / "hello.txt"
p.write_text("你好", encoding="utf-8")   # write_text 一行写入
print(p.read_text(encoding="utf-8"))     # read_text 一行读出

(d / "a.py").write_text("x = 1", encoding="utf-8")
print(sorted(x.name for x in d.glob("*.txt")))       # glob 按模式找文件
print(sorted(x.name for x in Path(".").rglob("*.py")))  # rglob 递归找（含子目录）
print(p.name, p.stem, p.suffix, p.parent.as_posix())  # name / stem / suffix / parent 拆路径
print(p.exists())`,
      expect: "你好\n['hello.txt']\n['a.py']\nhello.txt hello .txt data/sub\nTrue",
      note: "新项目优先 pathlib，比 os.path 字符串拼接直观。",
    },
    {
      id: "8.3", title: "多上下文管理器",
      use: "要同时开着好几个文件时用——典型场景是边读一个边写另一个。一个 with 全管好，全都正常关闭。",
      doc: "https://docs.python.org/zh-cn/3.14/reference/compound_stmts.html#the-with-statement",
      points: [
        "一个 with 管多个资源：with A() as a, B() as b:",
        "典型场景：读一个文件、同时写另一个文件",
        "3.10+ 可用括号把多个资源换行书写，更清晰",
      ],
      code: String.raw`with open("in.txt", "w", encoding="utf-8") as f:
    f.write("数据")

# 一个 with 管多个资源：读一个文件、同时写另一个文件（典型场景）
with open("in.txt", encoding="utf-8") as fin, open("out.txt", "w", encoding="utf-8") as fout:
    fout.write(fin.read())

# with (open("in.txt", encoding="utf-8") as fin,      # 3.10+ 可用括号把多个资源换行书写（本层兼容 3.8，故意注释掉）
#       open("out2.txt", "w", encoding="utf-8") as fout):
#     fout.write(fin.read())

with open("out.txt", encoding="utf-8") as f:
    print(f.read())`,
      expect: "数据",
      note: "多个资源按顺序进入、逆序关闭。",
    },
    {
      id: "8.4", title: "文件与目录的其他操作",
      use: "复制、移动、重命名、删除文件时来这里抄。删整个目录树的 rmtree 不可恢复，批量动手前先 print 一遍名单确认。",
      doc: "https://docs.python.org/zh-cn/3.14/library/shutil.html",
      points: [
        "os.remove 删文件、os.rename 重命名；shutil.copy / move 复制移动",
        "⭐⭐ shutil.rmtree 删除整个目录树且不可恢复——用前三思",
        "pathlib 版：Path.unlink(missing_ok=True)（3.8+）、Path.rename()",
      ],
      code: String.raw`import os, shutil
from pathlib import Path

with open("a.txt", "w", encoding="utf-8") as f:
    f.write("x")

shutil.copy("a.txt", "b.txt")       # shutil.copy 复制
os.rename("b.txt", "c.txt")         # os.rename 重命名
shutil.move("c.txt", "d.txt")       # shutil.move 移动
print(os.path.exists("d.txt"))

os.remove("a.txt")                  # os.remove 删文件
os.remove("d.txt")
print(os.path.exists("a.txt"), os.path.exists("d.txt"))

p = Path("e.txt")
p.write_text("y", encoding="utf-8")
p.rename("f.txt")                   # pathlib 版：Path.rename()
Path("f.txt").unlink(missing_ok=True)  # pathlib 版：删文件，missing_ok=True 文件不在也不报错（3.8+）
print(Path("f.txt").exists())

# shutil.rmtree("某目录")           # ⭐⭐ 危险示范（故意注释掉）：删除整个目录树且不可恢复，用前三思`,
      expect: "True\nFalse False\nFalse",
      note: "批量删除/移动前先 print 干跑一遍确认（dry-run）。",
    },
  ],
  quiz: [
    { q: "读写文件最重要的「三件套」是？",
      options: ["with + encoding + 块内完成读写", "open + close + read", "try + except + finally", "r + w + b"], answer: 0,
      explain: "with 自动关文件；encoding 防乱码；块外文件已关闭。" },
    { q: 'open("a.txt", "w") 打开已存在的文件会怎样？',
      options: ["原内容被清空", "在原内容后追加", "报 FileExistsError", "报 PermissionError"], answer: 0,
      explain: "w 模式先清空；要追加用 a。" },
    { q: "with 块结束后再 f.read() 会怎样？",
      options: ["ValueError：对已关闭文件操作", "正常读取", "返回空串", "报 FileNotFoundError"], answer: 0,
      explain: "文件已在块尾关闭——读写要在块内完成。" },
  ],
});
