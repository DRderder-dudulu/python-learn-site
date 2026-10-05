/* ===== 速查·第八层 · 文件读写（§8.1—§8.4） =====
 * 内容来源：《Python 3 语法完全指南》第八层（outputs/python-syntax-guide-v1.md），1:1 对齐小节；
 * 示例与课程 §8.x 一致或取自指南，均可运行；写文件示例用 _tmp_ 临时文件并在结尾自行清理。
 * 适用版本：3.8—3.14 ｜ 语言规则以 Python 官方文档为准。
 */
CHEATSHEET_ADV.push({
  layerId: 8,
  layer: "第八层 · 文件读写",
  stage: "一",
  topics: [
    {
      id: "8_1", title: "§8.1 open 与 with", desc: "with + encoding 三件套、r/w/a/x/b/t/+ 模式表、读取三种粒度、strip 陷阱、write 不自动加换行",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/inputoutput.html#reading-and-writing-files",
      html: `<ul>
<li>⭐⭐ <b>三个超高频注意点</b>：① <b>一定要写 <code>encoding="utf-8"</code></b>——Windows 上 open 默认编码可能是 GBK，不写会在中文环境互相乱码/报错；② <b>读写动作在 with 块内完成</b>——块结束后文件已关闭，再 <code>f.read()</code> 报 <code>ValueError: I/O operation on closed file</code>（块外使用"已经读出来的数据"完全没问题）；③ <b>务必用 with</b>（或手动 <code>f.close()</code>）——不关闭的文件句柄是资源泄漏</li>
<li><b>读取的三种粒度</b>：<code>f.read()</code> 一次性读全部（大文件慎用）｜<code>f.readline()</code> 读一行（含换行符）｜⭐ 推荐 <code>for line in f:</code> 逐行迭代，不占内存</li>
<li>⭐ <code>str.strip()</code> 无参数时会去掉两端<b>所有空白字符</b>（包括空格和 \\t）——如果行首缩进有意义，要用 <code>line.rstrip("\\n")</code> 或 <code>line.rstrip("\\r\\n")</code> 只去换行符</li>
<li><b>写入</b>：⭐ <code>f.write()</code> <b>不会自动加换行</b>，要自己写 \\n；<code>f.writelines(["a\\n", "b\\n"])</code> 批量写；<code>print("也会进文件", file=f)</code> 用 print 的 file 参数直接写进文件</li></ul>
<table><tr><th>模式</th><th>含义</th></tr>
<tr><td><code>"r"</code></td><td>读（默认），文件不存在则 FileNotFoundError</td></tr>
<tr><td><code>"w"</code></td><td>写，<b>先清空原内容</b> ⭐</td></tr>
<tr><td><code>"a"</code></td><td>追加写，不清空</td></tr>
<tr><td><code>"x"</code></td><td>排他创建，文件已存在则报错</td></tr>
<tr><td><code>"b"</code></td><td>二进制模式（<code>"rb"</code>/<code>"wb"</code>，配合第九层）</td></tr>
<tr><td><code>"t"</code></td><td>文本模式（默认）</td></tr>
<tr><td><code>"+"</code></td><td>读写兼备（<code>"r+"</code>、<code>"w+"</code>）</td></tr></table>`,
      code: String.raw`import os

# 写入：write 不会自动加换行，要自己写 \n
with open("_tmp_notes.txt", "w", encoding="utf-8") as f:
    f.write("第一行\n")
    f.writelines(["第二行\n", "第三行\n"])
    print("这行也会进文件", file=f)      # print 的 file 参数

# 读取粒度 1：一次性读全部（大文件慎用）
with open("_tmp_notes.txt", encoding="utf-8") as f:
    whole = f.read()                     # 读取动作要在 with 块内完成
print(whole)

# 读取粒度 2：读一行（含换行符）
with open("_tmp_notes.txt", encoding="utf-8") as f:
    print(f.readline().rstrip("\n"))

# 读取粒度 3（推荐）：逐行迭代，不占内存
with open("_tmp_notes.txt", encoding="utf-8") as f:
    for line in f:
        print(line.rstrip("\n"))         # 只去行尾换行；strip() 会把行首空格也去掉

os.remove("_tmp_notes.txt")              # 清理临时文件`,
    },
    {
      id: "8_2", title: "§8.2 pathlib（现代推荐）", desc: "/ 拼路径、name/stem/suffix/parent、mkdir 两个关键参数、read_text/write_text、glob 与 rglob",
      doc: "https://docs.python.org/zh-cn/3.14/library/pathlib.html",
      html: `<ul>
<li>⭐ 用 <code>/</code> 拼路径，跨平台：<code>p = Path("data") / "logs" / "app.log"</code>——告别 os.path.join 字符串拼接</li>
<li>拆路径：<code>p.name</code> → "app.log"｜<code>p.stem</code> → "app"｜<code>p.suffix</code> → ".log"｜<code>p.parent</code> → "data/logs"</li>
<li>探查：<code>p.exists()</code>、<code>p.is_file()</code>、<code>p.is_dir()</code></li>
<li><code>p.mkdir(parents=True, exist_ok=True)</code>：⭐ <code>parents=True</code> 父目录不存在就递归创建（否则 FileNotFoundError）；⭐ <code>exist_ok=True</code> 目录已存在也不报错（否则 FileExistsError）</li>
<li>一行读写：<code>p.write_text("你好", encoding="utf-8")</code>、<code>p.read_text(encoding="utf-8")</code>（同样记得 encoding）</li>
<li>找文件：<code>Path(".").glob("*.py")</code> 当前目录匹配｜<code>Path(".").rglob("*.py")</code> <b>递归</b>所有子目录</li></ul>`,
      code: String.raw`from pathlib import Path

p = Path("_tmp_data") / "logs" / "app.log"   # 用 / 拼路径，跨平台
print(p.name, p.stem, p.suffix)               # app.log app .log
print(p.parent)                               # _tmp_data/logs（Windows 显示反斜杠）

p.parent.mkdir(parents=True, exist_ok=True)   # 递归创建；已存在也不报错
p.write_text("你好", encoding="utf-8")        # 写文本（同样记得 encoding）
print(p.read_text(encoding="utf-8"))
print(p.exists(), p.is_file(), p.is_dir())    # True True False

for f in p.parent.glob("*.log"):              # 当前层匹配
    print("glob:", f)
for f in Path("_tmp_data").rglob("*.log"):    # 递归所有子目录
    print("rglob:", f)

# 用完清理
p.unlink()
p.parent.rmdir()
Path("_tmp_data").rmdir()`,
    },
    {
      id: "8_3", title: "§8.3 多上下文管理器", desc: "一个 with 管多个资源、逗号一行写法（任意版本）、3.10+ 括号多行写法、顺序进入逆序关闭",
      doc: "https://docs.python.org/zh-cn/3.14/reference/compound_stmts.html#the-with-statement",
      html: `<ul>
<li>一个 <code>with</code> 管多个资源，逗号分隔即可：<code>with open("in.txt", encoding="utf-8") as fin, open("out.txt", "w", encoding="utf-8") as fout:</code>（任意版本）</li>
<li>典型场景：<b>读一个文件、同时写另一个文件</b>：<code>fout.write(fin.read())</code></li>
<li>多个资源<b>按顺序进入、逆序关闭</b>；任何一个中途异常，已进入的都会被正常收尾</li>
<li><b>带括号的多行写法（3.10+，更清晰）</b>：把多个资源写成括号里的一列，每行一个，行尾逗号随意</li></ul>`,
      code: String.raw`import os

with open("_tmp_in.txt", "w", encoding="utf-8") as f:
    f.write("数据")

# 一行写法（任意版本）：读一个、写另一个
with open("_tmp_in.txt", encoding="utf-8") as fin, open("_tmp_out.txt", "w", encoding="utf-8") as fout:
    fout.write(fin.read())

# 带括号的多行写法（3.10+，更清晰）：
# with (
#     open("_tmp_in.txt", encoding="utf-8") as fin,
#     open("_tmp_out.txt", "w", encoding="utf-8") as fout,
# ):
#     fout.write(fin.read())

with open("_tmp_out.txt", encoding="utf-8") as f:
    print(f.read())

os.remove("_tmp_in.txt")
os.remove("_tmp_out.txt")`,
    },
    {
      id: "8_4", title: "§8.4 文件与目录的其他操作", desc: "os.remove/rename、shutil.copy/move、rmtree 危险警告、pathlib 的 unlink/rename、tempfile 临时文件",
      doc: "https://docs.python.org/zh-cn/3.14/library/shutil.html",
      html: `<ul>
<li><code>os.remove("a.txt")</code> 删文件（不存在则 FileNotFoundError）｜<code>os.rename("a.txt", "b.txt")</code> 重命名/移动</li>
<li><code>shutil.copy("a.txt", "备份.txt")</code> 复制文件｜<code>shutil.move("a.txt", "dir/")</code> 移动</li>
<li>⭐⭐ <code>shutil.rmtree("old_dir")</code> 删除<b>整个目录树</b>——危险，不可恢复，用前三思（可先 print 干跑一遍 dry-run）</li>
<li>pathlib 版：<code>Path("a.txt").unlink(missing_ok=True)</code>（3.8+，missing_ok=True 不存在也不报错）｜<code>Path("a.txt").rename("b.txt")</code></li>
<li><code>tempfile.TemporaryFile("w+", encoding="utf-8")</code>：临时文件，<b>用完自动删</b>，配合 with 最省心</li>
<li>JSON/CSV 的读写见指南 18.7</li></ul>`,
      code: String.raw`import os, shutil, tempfile
from pathlib import Path

with open("_tmp_a.txt", "w", encoding="utf-8") as f:
    f.write("x")
shutil.copy("_tmp_a.txt", "_tmp_b.txt")      # 复制文件
os.rename("_tmp_b.txt", "_tmp_c.txt")        # 重命名/移动
print(os.path.exists("_tmp_c.txt"))          # True

os.remove("_tmp_a.txt")                      # 删文件
os.remove("_tmp_c.txt")
print(os.path.exists("_tmp_a.txt"), os.path.exists("_tmp_c.txt"))   # False False

# pathlib 版删除：missing_ok=True（3.8+）不存在也不报错
Path("_tmp_none.txt").unlink(missing_ok=True)

# 临时文件：with 结束自动删除，不用清理
with tempfile.TemporaryFile("w+", encoding="utf-8") as tf:
    tf.write("临时数据")
    tf.seek(0)                               # 写完想读，先回到开头
    print(tf.read())

# shutil.rmtree("目录")  # ⭐⭐ 删除整个目录树，不可恢复：演示请保持注释状态`,
    },
  ],
});
