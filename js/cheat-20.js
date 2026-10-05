/* ===== 速查·第二十层 · 应用板块（§20.1—§20.5） =====
 * 内容来源：指南 v1 无本层原文，以课程 §20.x（js/course-20.js）为 1:1 结构基准，并吸收旧速查第 20 层全部信息；
 * 示例全部使用标准库、经实跑验证；联网与第三方库操作只写进注释，不实际执行。
 * 适用版本：3.8—3.14 ｜ 语言规则以 Python 官方文档为准。
 */
CHEATSHEET_ADV.push({
  layerId: 20,
  layer: "第二十层 · 应用板块",
  stage: "三",
  topics: [
    {
      id: "20_1", title: "§20.1 文件批处理：新手第一个作品", desc: "pathlib + shutil 批量重命名/归档、mkdir(exist_ok=True)、先打印演练、零安装方向全景",
      doc: "https://docs.python.org/zh-cn/3.14/library/pathlib.html",
      html: `<ul>
<li>⭐ <b>最推荐的起点</b>：<b>批量重命名、按类型归档、清理重复文件</b>——纯标准库（pathlib + shutil），立刻变现</li>
<li><code>Path("下载").glob("*.jpg")</code> 匹配文件（第八层），<code>shutil.move</code> 移动</li>
<li>先 <code>mkdir(exist_ok=True)</code> 再造目标路径，避免「文件夹不存在」报错</li>
<li>⭐ 真实操作建议<b>先打印演练</b>（把 move 换成 print），确认清单无误再放行——批量操作没有后悔药</li>
<li>先做「为自己省事」的小工具（如整理下载文件夹）——真实需求驱动，语法才记得牢</li>
<li>其它零安装方向：文本与日志分析（re + collections.Counter，见 §20.2）、数据格式处理（json / csv / sqlite3，见 §20.3）、邮件通知（smtplib + email）、桌面小窗口（tkinter）</li>
<li>原则：<b>先跑通标准库，再按需装第三方库</b>（别一上来装几十个）</li></ul>`,
      code: String.raw`from pathlib import Path
import shutil

# 先造几个「下载」里的文件来演示
d = Path("下载")
d.mkdir(exist_ok=True)
for name in ["a.jpg", "b.jpg", "笔记.txt"]:
    (d / name).write_text("x", encoding="utf-8")

# 把所有 .jpg 归档到子文件夹
target = d / "图片归档"
target.mkdir(exist_ok=True)
for f in sorted(d.glob("*.jpg")):
    shutil.move(str(f), target / f.name)

for p in sorted(d.rglob("*")):
    print(p.as_posix())`,
    },
    {
      id: "20_2", title: "§20.2 文本与日志分析", desc: "re.findall 抓匹配、Counter 计数与 most_common、splitlines 逐行判断",
      doc: "https://docs.python.org/zh-cn/3.14/library/re.html",
      html: `<ul>
<li>场景：几千行日志里统计关键字、抓出所有报错——<code>re</code>（6.4）+ <code>collections.Counter</code> 就够</li>
<li><code>re.findall</code> 一次抓出所有匹配；正则记得用原始字符串 <code>r"..."</code></li>
<li><code>Counter</code> 是计数专用字典：扔进去自动数好；<code>most_common()</code> 按次数从多到少排队</li>
<li>按行处理用 <code>splitlines()</code>，逐行判断比一大坨正则更好读懂</li>
<li>同样的套路能分析聊天记录、导出的账单、服务器访问日志</li></ul>`,
      code: String.raw`import re
from collections import Counter

log = """INFO 启动
ERROR 连接失败
INFO 重试
ERROR 连接失败
WARNING 内存偏高
ERROR 磁盘已满"""

# 统计各级别出现次数，按次数从多到少排
levels = re.findall(r"^(INFO|ERROR|WARNING)", log, flags=re.M)
print(Counter(levels).most_common())

# 抓出所有 ERROR 行
for line in log.splitlines():
    if line.startswith("ERROR"):
        print(line)`,
    },
    {
      id: "20_3", title: "§20.3 数据格式与小型数据库", desc: "json ensure_ascii=False 中文坑、dumps/loads 与 dump/load、csv 必加 newline=\"\"、sqlite3 零安装",
      doc: "https://docs.python.org/zh-cn/3.14/library/json.html",
      html: `<ul>
<li>⭐ <code>json.dumps(data, ensure_ascii=False)</code>：不加这个参数，中文会变 \\uXXXX 转义</li>
<li><code>dumps/loads</code> 管字符串，<code>dump/load</code> 管文件对象——多个字母，多个参数</li>
<li>JSON 只认：<b>对象/数组/字符串/数字/true/false/null</b>——datetime、集合要先转换</li>
<li>csv 打开文件记得 <code>newline=""</code>；<code>DictReader/DictWriter</code> 按列名读写最直观</li>
<li><code>sqlite3</code> 是标准库自带的<b>单文件数据库</b>：零安装，小项目结构化存储首选；参数占位用 <code>?</code>，批量插入用 <code>executemany</code></li></ul>`,
      code: String.raw`import json, csv, io, sqlite3

data = {"name": "小明", "tags": ["Python", "入门"]}
s = json.dumps(data, ensure_ascii=False)   # ⭐ 不加这个中文会变 \uXXXX
print(s)
print(json.loads(s)["tags"][0])

buf = io.StringIO()                        # 用内存缓冲演示 csv
w = csv.DictWriter(buf, fieldnames=["姓名", "年龄"])
w.writeheader()
w.writerow({"姓名": "小明", "年龄": 18})
buf.seek(0)
for row in csv.DictReader(buf):            # 按列名读成字典
    print(row["姓名"], row["年龄"])

con = sqlite3.connect(":memory:")          # 内存里的临时数据库
con.execute("CREATE TABLE user (name TEXT, age INTEGER)")
con.executemany("INSERT INTO user VALUES (?, ?)", [("小明", 18), ("小红", 20)])
for row in con.execute("SELECT name, age FROM user WHERE age >= 18 ORDER BY age"):
    print(row)
con.close()`,
    },
    {
      id: "20_4", title: "§20.4 网络请求思路", desc: "urllib 原理、urlparse 拆 / urlencode 拼、robots.txt 合规、requests 与第三方示例运行条件",
      doc: "https://docs.python.org/zh-cn/3.14/library/urllib.parse.html",
      html: `<ul>
<li>标准库 <code>urllib</code> 能发 HTTP 请求；日常更推荐第三方 <code>requests</code>，语法更顺手</li>
<li>⭐ 联网示例不直接演示：需要网络，且要<b>遵守目标站 robots.txt 与服务条款、控制频率</b>——合规优先</li>
<li>URL 拆解与拼接是爬虫基本功：<code>urlparse</code> 拆、<code>urlencode</code> 拼</li>
<li><code>urlencode</code> 自动做百分号编码：中文变 <code>%E5%85%A5</code> 这种形式，空格变 <code>+</code></li>
<li>⭐ 运行第三方示例前先确认：<b>Python 版本、安装命令、是否需要网络/API key、输入文件位置</b></li></ul>
<p>一个库打开一个领域（办公与数据日常）：</p>
<table><tr><th>方向</th><th>核心库</th><th>能干什么</th></tr>
<tr><td>网络爬虫</td><td>requests + beautifulsoup4</td><td>抓网页数据存表格（需联网，遵守 robots.txt）</td></tr>
<tr><td>Excel 自动化</td><td>openpyxl</td><td>合并报表、批量改表</td></tr>
<tr><td>Word 自动化</td><td>python-docx</td><td>模板生成合同/通知</td></tr>
<tr><td>PDF 处理</td><td>pypdf / pdfplumber</td><td>提取文字表格、合并拆分</td></tr>
<tr><td>数据分析</td><td>pandas + matplotlib</td><td>分组统计、出图表</td></tr>
<tr><td>图像处理</td><td>pillow、qrcode</td><td>批量压缩、水印、二维码</td></tr>
<tr><td>AI 大模型调用</td><td>openai 等</td><td>对话/翻译/总结（需 API key，有费用）</td></tr></table>`,
      code: String.raw`# 联网抓取（需网络 + 遵守 robots.txt，课堂不演示）：
#   from urllib.request import urlopen
#   html = urlopen("https://example.com", timeout=10).read().decode("utf-8")
from urllib.parse import urlparse, urlencode

# 拆：一个 URL 由哪些零件组成
u = urlparse("https://example.com:8080/path/to?page=2#top")
print(u.scheme, u.netloc, u.path)

# 拼：把字典变成查询字符串（自动处理中文编码）
params = urlencode({"q": "Python 入门", "page": 1})
print(params)`,
    },
    {
      id: "20_5", title: "§20.5 把脚本做成 CLI 工具", desc: "sys.argv 全字符串、argparse 三件套、type=int 校验、工程化方向全景与打包 exe",
      doc: "https://docs.python.org/zh-cn/3.14/library/argparse.html",
      html: `<ul>
<li><code>sys.argv</code> 是最原始的参数来源：列表，第一个元素是脚本名，⭐ <b>全是字符串</b></li>
<li>稍复杂就上 <code>argparse</code>：位置参数、<code>-n/--count</code> 选项、开关旗标，自带 <code>-h</code> 帮助</li>
<li><code>type=int</code> 自动转换并校验；<code>action="store_true"</code> 做开关</li>
<li>真实用法是命令行传参；本页示例手动喂列表，只为让你看清解析结果</li>
<li>⭐ 第三方库报错先排查：<b>虚拟环境没激活 / 装错环境</b>（§18.1/§18.2，新手问题半壁江山）</li>
<li>每个最小示例<b>亲手敲一遍并改两处</b>，比看十篇教程有效</li></ul>
<p>下一步·工程化方向（建议学完 §7/§12/§13 再上）：</p>
<table><tr><th>方向</th><th>核心库</th><th>说明</th></tr>
<tr><td>Web 后端</td><td>fastapi / flask</td><td>FastAPI 让类型注解变成接口文档和参数校验</td></tr>
<tr><td>命令行工具</td><td>typer + rich + tqdm</td><td>参数、帮助、彩色输出、进度条</td></tr>
<tr><td>低代码网页</td><td>streamlit / gradio</td><td>不懂前端也能做数据看板/AI 演示</td></tr>
<tr><td>浏览器自动化</td><td>playwright / selenium</td><td>动态网页抓取、自动填报</td></tr>
<tr><td>定时调度</td><td>apscheduler / schedule</td><td>到点自动干活 + webhook 通知</td></tr>
<tr><td>打包发布</td><td>pyinstaller</td><td>打包成 exe 发给没装 Python 的人</td></tr></table>`,
      code: String.raw`import argparse

parser = argparse.ArgumentParser(description="示例工具")
parser.add_argument("input", help="输入文件")
parser.add_argument("-n", "--count", type=int, default=1, help="次数")
parser.add_argument("--verbose", action="store_true", help="详细模式")

# 真实用法：python tool.py data.txt -n 3 --verbose
# 这里手动喂参数，演示解析结果：
args = parser.parse_args(["data.txt", "-n", "3", "--verbose"])
print(args.input, args.count, args.verbose)

args2 = parser.parse_args(["a.txt"])       # 不带可选项：用默认值
print(args2.input, args2.count, args2.verbose)`,
    },
  ],
});
