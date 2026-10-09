/* ===== 课程内容数据 · 第二十层 =====
 * 内容来源：《Python 3 语法完全指南》（outputs/python-syntax-guide.md）第二十层 · 应用板块。
 * 写法规范与 data-course.js 一致：section.id 即指南小节号；points 为分条要点（内联 <code>/<b>）；
 * 【对应规范】points 每条要点必须在 code 中有明确对应：可演示的写成可运行代码并配注释；
 * 错误/危险示范以「故意注释掉」的形式呈现（学员可取消注释亲测报错）；
 * 示例不依赖任何第三方库（requests/pandas 不安装），全部用标准库演示；
 * 联网操作需要网络与合规前提，只写进注释不实际执行；
 * code 示例均经本地 Python 实际运行验证（verify_course_expect.py）；expect 为真实输出。
 * 适用版本：3.8—3.14 ｜ 最后核对：2026-10
 */
COURSE.push({
  id: 20,
  title: "第二十层 · 应用板块",
  minutes: 50,
  goal: "用纯标准库完成四个小实战：文件归档、日志分析、数据格式、CLI 工具，并看清下一步方向",
  prereq: "第十八层（工程基础）",
  versions: "3.8—3.14",
  checked: "2026-10",
  sections: [
    {
      id: "20.1", title: "文件批处理：新手的第一个作品",
      use: "整理乱糟糟的下载文件夹：按类型归档、批量改名、清理重复，几行标准库代码搞定。批量动手前先把 move 换成 print 演练，确认清单无误再放行。",
      doc: "https://docs.python.org/zh-cn/3.14/library/pathlib.html",
      points: [
        "⭐ 最推荐的起点：<b>批量重命名、按类型归档、清理重复文件</b>——纯标准库，立刻变现",
        "<code>Path(\"下载\").glob(\"*.jpg\")</code> 匹配文件（第八层），<code>shutil.move</code> 移动",
        "先 <code>mkdir(exist_ok=True)</code> 再造目标路径，避免「文件夹不存在」报错",
        "真实操作建议<b>先打印演练</b>（把 move 换成 print），确认清单无误再放行",
        "本例在临时目录里造文件演示，换成你自己的下载文件夹同理",
      ],
      code: String.raw`# ⭐ 新手最推荐的起点作品：批量重命名、按类型归档、清理重复文件——纯标准库，立刻变现
from pathlib import Path
import shutil

# 本例在临时目录里造文件演示（换成你自己的下载文件夹同理）
d = Path("下载")
d.mkdir(exist_ok=True)
for name in ["a.jpg", "b.jpg", "笔记.txt"]:
    (d / name).write_text("x", encoding="utf-8")

# 把所有 .jpg 归档到子文件夹
target = d / "图片归档"
target.mkdir(exist_ok=True)     # 先建目标文件夹，避免「文件夹不存在」报错
for f in sorted(d.glob("*.jpg")):
    shutil.move(str(f), target / f.name)
    # 真实操作建议【先打印演练】：把上一行换成 print("将移动", f)，确认清单无误再放行

for p in sorted(d.rglob("*")):
    print(p.as_posix())`,
      expect: "下载/图片归档\n下载/图片归档/a.jpg\n下载/图片归档/b.jpg\n下载/笔记.txt",
      note: "把 *.jpg 换成 *.txt 再跑，看看这次归档了什么。",
    },
    {
      id: "20.2", title: "文本与日志分析：从几千行里捞信息",
      use: "几千行日志肉眼翻不动：re 抓目标、Counter 自动数数，几秒统计出「哪种报错最多」、捞出全部 ERROR 行。排查、分析聊天记录或账单都用这套。",
      doc: "https://docs.python.org/zh-cn/3.14/library/re.html",
      points: [
        "场景：几千行日志里统计关键字、抓出所有报错——<code>re</code>（6.4）+ <code>Counter</code> 就够",
        "<code>re.findall</code> 一次抓出所有匹配；正则记得用原始字符串 r\"...\"",
        "<code>Counter</code> 是计数专用字典：扔进去自动数好；<code>most_common()</code> 按次数从多到少排队",
        "按行处理用 <code>splitlines()</code>，逐行判断比一大坨正则更好读懂",
        "同样的套路能分析聊天记录、导出的账单、服务器访问日志",
      ],
      code: String.raw`import re
from collections import Counter

# 场景：几千行日志里统计关键字、抓出所有报错——re（6.4）+ Counter 就够；
# 同样的套路能分析聊天记录、导出的账单、服务器访问日志
log = """INFO 启动
ERROR 连接失败
INFO 重试
ERROR 连接失败
WARNING 内存偏高
ERROR 磁盘已满"""

# 统计各级别出现次数：re.findall 一次抓出所有匹配（正则记得用原始字符串 r"..."）
levels = re.findall(r"^(INFO|ERROR|WARNING)", log, flags=re.M)
# Counter 是计数专用字典：扔进去自动数好；most_common() 按次数从多到少排队
print(Counter(levels).most_common())

# 抓出所有 ERROR 行：按行处理用 splitlines()，逐行判断比一大坨正则更好读懂
for line in log.splitlines():
    if line.startswith("ERROR"):
        print(line)`,
      expect: "[('ERROR', 3), ('INFO', 2), ('WARNING', 1)]\nERROR 连接失败\nERROR 连接失败\nERROR 磁盘已满",
      note: "给日志加一行 DEBUG 调试，正则里也加上它，看 Counter 怎么变。",
    },
    {
      id: "20.3", title: "数据格式与小型数据库",
      use: "存配置、读表格、换数据靠 JSON 和 csv（导出中文用 ensure_ascii=False）；按条件查，标准库自带 sqlite3，零安装当单文件数据库。",
      doc: "https://docs.python.org/zh-cn/3.14/library/json.html",
      points: [
        "⭐ <code>json.dumps(data, ensure_ascii=False)</code>：不加这个参数，中文会变 \\uXXXX 转义",
        "<code>dumps/loads</code> 管字符串，<code>dump/load</code> 管文件对象——多个字母，多个参数",
        "JSON 只认：对象/数组/字符串/数字/true/false/null——datetime、集合要先转换",
        "csv 打开文件记得 <code>newline=\"\"</code>；<code>DictReader/DictWriter</code> 按列名读写最直观",
        "<code>sqlite3</code> 是标准库自带的单文件数据库：零安装，小项目结构化存储首选",
      ],
      code: String.raw`import json, csv, io, sqlite3

data = {"name": "小明", "tags": ["Python", "入门"]}
s = json.dumps(data, ensure_ascii=False)   # ⭐ 不加这个参数，中文会变 \uXXXX 转义
print(s)
print(json.loads(s)["tags"][0])
# dumps/loads 管【字符串】；dump/load 管【文件对象】——多个字母，多个参数
# JSON 只认：对象/数组/字符串/数字/true/false/null——datetime、集合要先转换
# json.dumps({"时间": datetime.now()})   # ⭐ 错误示范（故意注释掉）：datetime 不能直接转 JSON

buf = io.StringIO()                        # 用内存缓冲演示 csv（真实文件记得 open(..., newline="")）
w = csv.DictWriter(buf, fieldnames=["姓名", "年龄"])
w.writeheader()
w.writerow({"姓名": "小明", "年龄": 18})
buf.seek(0)
for row in csv.DictReader(buf):            # DictReader/DictWriter 按列名读写最直观
    print(row["姓名"], row["年龄"])

con = sqlite3.connect(":memory:")          # sqlite3：标准库自带的单文件数据库，零安装；本例用内存库演示
con.execute("CREATE TABLE user (name TEXT, age INTEGER)")
con.executemany("INSERT INTO user VALUES (?, ?)", [("小明", 18), ("小红", 20)])
for row in con.execute("SELECT name, age FROM user WHERE age >= 18 ORDER BY age"):
    print(row)
con.close()`,
      expect: "{\"name\": \"小明\", \"tags\": [\"Python\", \"入门\"]}\nPython\n小明 18\n('小明', 18)\n('小红', 20)",
      note: "把 SELECT 里的 18 改成 19，只剩小红满足条件。",
    },
    {
      id: "20.4", title: "网络请求思路：先学原理，再装 requests",
      use: "写爬虫调接口前，练 URL 基本功：urlparse 拆零件、urlencode 拼参数。发请求用 requests；联网守 robots.txt 和频率限制。",
      doc: "https://docs.python.org/zh-cn/3.14/library/urllib.parse.html",
      points: [
        "标准库 <code>urllib</code> 能发 HTTP 请求；日常更推荐第三方 <code>requests</code>，语法更顺手",
        "⭐ 联网示例课堂不演示：需要网络，且要遵守目标站 robots.txt 与频率限制",
        "URL 拆解与拼接是爬虫基本功：<code>urlparse</code> 拆、<code>urlencode</code> 拼",
        "<code>urlencode</code> 自动做百分号编码：中文变 %E5%85%A5 这种形式，空格变 +",
        "装上 requests 后的最小示例与运行条件，见指南 §20.2",
      ],
      code: String.raw`# ⭐ 联网抓取课堂不演示：需要网络，且要遵守目标站 robots.txt 与频率限制：
#   from urllib.request import urlopen    # 标准库 urllib 能发 HTTP 请求
#   html = urlopen("https://example.com", timeout=10).read().decode("utf-8")
# 日常更推荐第三方 requests，语法更顺手；装上后的最小示例与运行条件见指南 §20.2：
#   import requests
#   r = requests.get("https://example.com", timeout=10)
#   print(r.status_code)
from urllib.parse import urlparse, urlencode

# 拆：一个 URL 由哪些零件组成（爬虫基本功：urlparse 拆、urlencode 拼）
u = urlparse("https://example.com:8080/path/to?page=2#top")
print(u.scheme, u.netloc, u.path)

# 拼：把字典变成查询字符串；urlencode 自动做百分号编码：中文变 %E5%85%A5 这种形式，空格变 +
params = urlencode({"q": "Python 入门", "page": 1})
print(params)`,
      expect: "https example.com:8080 /path/to\nq=Python+%E5%85%A5%E9%97%A8&page=1",
      note: "给 urlencode 的字典再加一个键，看查询串怎么变长。",
    },
    {
      id: "20.5", title: "把脚本做成 CLI 工具",
      use: "把脚本变成命令行工具：不改代码就能换输入。argparse 管解析、类型校验、自动生成 -h 帮助；sys.argv 认得就行（取到的全是字符串）。",
      doc: "https://docs.python.org/zh-cn/3.14/library/argparse.html",
      points: [
        "<code>sys.argv</code> 是最原始的参数来源：列表，第一个元素是脚本名，⭐ <b>全是字符串</b>",
        "稍复杂就上 <code>argparse</code>：位置参数、-n/--count 选项、开关旗标，自带 -h 帮助",
        "<code>type=int</code> 自动转换并校验；<code>action=\"store_true\"</code> 做开关",
        "真实用法是命令行传参；本例手动喂列表，只为让你看清解析结果",
        "下一步（指南 §20.3）：typer/rich/tqdm 做漂亮 CLI，pyinstaller 打包 exe 发给没装 Python 的人",
      ],
      code: String.raw`import sys, argparse

# 最原始的参数来源是 sys.argv：列表，第一个元素是脚本名，⭐ 而且【全是字符串】
print(isinstance(sys.argv, list), all(isinstance(x, str) for x in sys.argv))

# 稍复杂就上 argparse：位置参数、-n/--count 选项、开关旗标，自带 -h 帮助
parser = argparse.ArgumentParser(description="示例工具")
parser.add_argument("input", help="输入文件")
parser.add_argument("-n", "--count", type=int, default=1, help="次数")   # type=int 自动转换并校验
parser.add_argument("--verbose", action="store_true", help="详细模式")     # 开关旗标

# 真实用法是命令行传参：python tool.py data.txt -n 3 --verbose
# 这里手动喂列表，只为让你看清解析结果：
args = parser.parse_args(["data.txt", "-n", "3", "--verbose"])
print(args.input, args.count, args.verbose)

args2 = parser.parse_args(["a.txt"])       # 不带可选项：用默认值
print(args2.input, args2.count, args2.verbose)

try:
    parser.parse_args(["a.txt", "-n", "三"])   # type=int 转不过去：打印用法并退出
except SystemExit:
    print("type=int 校验拦截：-n 后面必须是整数")

# 下一步（指南 §20.3）：typer / rich / tqdm 做漂亮 CLI；
# pyinstaller 打包 exe，发给没装 Python 的人`,
      expect: "True True\ndata.txt 3 True\na.txt 1 False\ntype=int 校验拦截：-n 后面必须是整数",
      note: "把 parse_args 的列表改成 [\"b.txt\", \"--verbose\"]，预测输出再运行验证。",
    },
  ],
  quiz: [
    { q: "批量处理文件前，最稳妥的第一步是？",
      options: ["先打印演练，确认要动的文件清单", "直接 shutil.move 全部移走", "先删除原文件省空间", "重启电脑释放内存"], answer: 0,
      explain: "把 move 换成 print 演练一遍，确认范围无误再真动——批量操作没有后悔药。" },
    { q: "json.dumps({\"name\": \"小明\"}) 不加 ensure_ascii=False 会怎样？",
      options: ["中文变成 \\uXXXX 转义序列", "直接报错", "中文丢失", "输出变慢两倍"], answer: 0,
      explain: "默认 ensure_ascii=True 会把非 ASCII 字符转义；加上 False 中文原样输出。" },
    { q: "add_argument(\"-n\", \"--count\", type=int) 的作用是？",
      options: ["接收 -n 3 或 --count 3，并自动转成 int", "定义一个叫 int 的变量", "只能接收 -n，不能接收 --count", "一次生成 3 个参数"], answer: 0,
      explain: "type=int 让 argparse 自动转换并校验；-n 与 --count 是同一个参数的短长两种写法。" },
  ],
});
