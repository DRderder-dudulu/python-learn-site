/* ===== 速查·第十八层 · 工程基础（§18.1—§18.8） =====
 * 内容来源：《Python 3 语法完全指南》第十八层（outputs/python-syntax-guide-v1.md），1:1 对齐小节；
 * 示例与课程 §18.x 一致或取自指南（课程示例经实跑验证）；venv / pip / pytest 等命令行操作写进注释。
 * 适用版本：3.8—3.14 ｜ 语言规则以 Python 官方文档为准。
 */
CHEATSHEET_ADV.push({
  layerId: 18,
  layer: "第十八层 · 工程基础",
  stage: "二",
  topics: [
    {
      id: "18_1", title: "§18.1 虚拟环境 venv", desc: "每个项目一个隔离依赖、创建/激活/退出命令、激活后 (.venv) 提示、程序内判断环境",
      doc: "https://docs.python.org/zh-cn/3.14/library/venv.html",
      html: `<ul>
<li>⭐ <b>每个项目一个虚拟环境</b>：第三方包装进系统 Python 会互相打架，隔离后各装各的互不污染</li>
<li>创建（在项目目录执行）：<code>python -m venv .venv</code></li>
<li>激活后命令行前出现 <code>(.venv)</code> 提示，之后的 <code>pip install</code> 只装进这个环境，<b>不污染系统 Python</b></li>
<li>退出：<code>deactivate</code></li>
<li>程序里也能判断自己正跑在哪个环境：<code>sys.prefix != sys.base_prefix</code> 为 True 即在虚拟环境中</li></ul>
<table><tr><th>系统</th><th>激活命令</th></tr>
<tr><td>Windows cmd</td><td><code>.venv\\Scripts\\activate</code></td></tr>
<tr><td>Windows PowerShell</td><td><code>.venv\\Scripts\\Activate.ps1</code>（若被策略拦截先执行 <code>Set-ExecutionPolicy -Scope CurrentUser RemoteSigned</code>）</td></tr>
<tr><td>macOS / Linux</td><td><code>source .venv/bin/activate</code></td></tr></table>`,
      code: String.raw`# 命令行操作（在系统终端执行，不是 Python 代码）：
#   python -m venv .venv              # 创建虚拟环境
#   .venv\Scripts\activate            # Windows 激活
#   .venv\Scripts\Activate.ps1        # Windows PowerShell 激活
#   source .venv/bin/activate         # macOS / Linux 激活
#   deactivate                        # 退出
import sys

# 程序里也能判断自己正跑在哪个环境
print("在虚拟环境里吗：", sys.prefix != sys.base_prefix)
print("Python 大版本：", sys.version_info.major)`,
    },
    {
      id: "18_2", title: "§18.2 pip 包管理", desc: "install/指定版本/-U 升级/uninstall/list、freeze 导出清单、-r 复现环境、安装名≠导入名",
      doc: "https://docs.python.org/zh-cn/3.14/installing/index.html",
      html: `<pre>pip install requests                # 安装
pip install "requests==2.32.3"      # 指定版本（锁版本，项目越大越要锁）
pip install -U requests             # 升级
pip uninstall requests              # 卸载
pip list                            # 看已装
pip freeze &gt; requirements.txt       # 导出依赖清单：给环境「拍照存档」
pip install -r requirements.txt     # 按清单安装（换机器/部署时一键复现环境）</pre>
<ul>
<li>第三方包索引官网：<code>pypi.org</code>；网络慢可临时换源：<code>-i https://pypi.tuna.tsinghua.edu.cn/simple</code></li>
<li>⭐ <b>安装名 ≠ 导入名</b>：beautifulsoup4→bs4、pillow→PIL、opencv-python→cv2，装错名字找不到包</li>
<li>⭐ <b>装错解释器是新手第一大坑</b>：用 <code>python -m pip install 库名</code> 最保险</li>
<li>程序里不导入就能探测某个库装没装：<code>importlib.util.find_spec("名字")</code> 返回 None 即未安装</li></ul>`,
      code: String.raw`# 命令行回顾（激活虚拟环境后执行）：
#   pip install requests               # 安装
#   pip install "requests==2.32.3"     # 锁版本
#   pip install -U requests            # 升级
#   pip freeze > requirements.txt      # 导出依赖清单
#   pip install -r requirements.txt    # 换机器按清单复现环境
import sys
import importlib.util

# 自检 1：Python 版本底线
if sys.version_info < (3, 8):
    raise SystemExit("需要 Python 3.8+")
print("Python 版本：", sys.version.split()[0])

# 自检 2：不导入就能探测某个库装没装
for name in ["pip", "json"]:
    print(name, "可用：", importlib.util.find_spec(name) is not None)`,
    },
    {
      id: "18_3", title: "§18.3 项目布局与 pyproject.toml", desc: "现代项目骨架（了解）：pyproject.toml 身份证、src 布局、tests 平级、最小配置示例",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/modules.html#packages",
      html: `<ul>
<li>脚本随手堆在一个文件夹，三个月后连自己都不敢动——<b>结构就是可维护性</b></li>
<li>现代骨架四件套：<code>pyproject.toml</code>（项目「身份证」：名称、版本、依赖、工具配置）+ <code>src/包名/</code> + <code>tests/</code> + README</li>
<li>src 布局强迫你按「安装后的包」来导入，提前暴露导包错误</li>
<li>测试统一放 <code>tests/</code> 与源码平级，pytest 默认就来这里找（见 §18.4）</li></ul>
<pre>myproject/
├── pyproject.toml        # 现代项目的「身份证」：名称、版本、依赖、工具配置
├── README.md
├── src/
│   └── myproject/
│       ├── __init__.py
│       └── main.py
└── tests/
    └── test_main.py</pre>
<p><code>pyproject.toml</code> 最小示例：</p>
<pre>[project]
name = "myproject"
version = "0.1.0"
dependencies = ["requests&gt;=2.32"]</pre>`,
      code: String.raw`# 推荐的项目骨架（先用 pathlib 造出来，比手点鼠标快）：
# myproject/
# ├── pyproject.toml      # 项目「身份证」：名称/版本/依赖
# ├── src/myproject/__init__.py
# └── tests/
from pathlib import Path

root = Path("myproject")
(root / "src" / "myproject").mkdir(parents=True, exist_ok=True)
(root / "tests").mkdir(exist_ok=True)
(root / "src" / "myproject" / "__init__.py").write_text("", encoding="utf-8")
(root / "pyproject.toml").write_text('[project]\nname = "myproject"\n', encoding="utf-8")

for p in sorted(root.rglob("*")):
    print(p.as_posix())`,
    },
    {
      id: "18_4", title: "§18.4 代码质量三件套", desc: "ruff 检查与格式化、mypy 静态类型检查、pytest 自动发现 test_* 并用普通 assert 断言",
      doc: "https://docs.pytest.org/en/stable/",
      html: `<pre>pip install ruff mypy pytest

ruff check .          # 代码检查（找问题，速度极快）
ruff format .         # 自动格式化（替代 black）

mypy src/             # 静态类型检查（配合第 13 层的注解）

pytest                # 自动发现并运行 tests/ 下所有 test_*.py</pre>
<ul>
<li>手工点一遍验证叫冒烟；写成测试就能<b>每次改完自动全跑一遍</b>，绿的通过、红的失败并定位</li>
<li>pytest 约定：文件叫 <code>test_*.py</code>、函数叫 <code>test_*</code>，断言用普通 <code>assert</code></li>
<li>测试之间互不影响：一个挂了其他照跑，报告最后汇总</li></ul>
<p>pytest 最小示例：</p>
<pre># tests/test_calc.py
def add(a, b):
    return a + b

def test_add():            # 函数名以 test_ 开头
    assert add(2, 3) == 5  # 用普通 assert 断言</pre>`,
      code: String.raw`# 命令行用法（先把测试存进 tests/test_calc.py）：
#   pip install ruff mypy pytest
#   ruff check .     # 找问题
#   ruff format .    # 自动格式化
#   mypy src/        # 静态类型检查
#   pytest           # 自动发现并运行所有 test_ 开头的函数
def add(a, b):
    return a + b

def test_add():                  # 函数名以 test_ 开头
    assert add(2, 3) == 5        # 用普通 assert 断言
    assert add(-1, 1) == 0

test_add()                       # 手动调用演示：不报错就是「通过」
print("test_add 通过")

def test_add_wrong():
    assert add(2, 2) == 5

try:
    test_add_wrong()
except AssertionError:
    print("test_add_wrong 失败：pytest 会标红并定位到这一行")`,
    },
    {
      id: "18_5", title: "§18.5 logging 日志", desc: "别再到处 print 调试、五级 DEBUG→CRITICAL、basicConfig、except 块用 logging.exception 自动带堆栈",
      doc: "https://docs.python.org/zh-cn/3.14/library/logging.html",
      html: `<ul>
<li>⭐ 别再到处 print 调试：print 用完得一个个删；logging 是正规军——<b>分级记录、一键开关</b></li>
<li>级别从低到高：<code>DEBUG &lt; INFO &lt; WARNING &lt; ERROR &lt; CRITICAL</code>；<code>basicConfig(level=...)</code> 决定显示到哪一级（设到哪级就显示哪级及以上）</li>
<li>一行配全局：<code>logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")</code>；正式项目用 <code>getLogger("名字")</code> 分模块</li>
<li>五个方法对应五级：<code>debug()</code> <code>info()</code> <code>warning()</code> <code>error()</code> <code>critical()</code></li>
<li>⭐ except 块里用 <code>logging.exception(...)</code>：<b>自动附带异常堆栈</b></li>
<li>日志默认写到 <b>stderr</b>（print 是 stdout）——用 <code>StreamHandler(sys.stdout)</code> 可改到标准输出</li></ul>`,
      code: String.raw`import logging, sys

# 默认日志输出到 stderr；这里接到 stdout 方便观察
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(logging.Formatter("[%(levelname)s] %(message)s"))
log = logging.getLogger("demo")
log.setLevel(logging.INFO)
log.addHandler(handler)

log.debug("细节：级别不够，不显示")
log.info("普通信息")
log.warning("警告")

try:
    1 / 0
except ZeroDivisionError:
    log.exception("出错了")     # ⭐ 自动附带异常堆栈`,
    },
    {
      id: "18_6", title: "§18.6 命令行参数", desc: "sys.argv 全是字符串、argparse 位置参数/选项/开关、type=int 自动校验、自带 -h 帮助",
      doc: "https://docs.python.org/zh-cn/3.14/library/argparse.html",
      html: `<ul>
<li><code>sys.argv</code> 是最原始的参数来源：<code>['脚本名.py', '参数1', '参数2']</code>——⭐ <b>全是字符串</b>，要数字自己 int()</li>
<li>稍复杂就用 <code>argparse</code>：位置参数、<code>-n/--count</code> 长短选项、<code>action="store_true"</code> 开关旗标</li>
<li><code>type=int</code> 自动转换并校验；<code>default=</code> 给默认值</li>
<li>自带 <code>-h</code>/<code>--help</code> 帮助信息，不用自己写</li></ul>
<pre>import argparse
parser = argparse.ArgumentParser(description="示例工具")
parser.add_argument("input", help="输入文件")
parser.add_argument("-n", "--count", type=int, default=1, help="次数")
parser.add_argument("--verbose", action="store_true", help="详细模式")
args = parser.parse_args()
# python tool.py data.txt -n 3 --verbose
# → args.input == "data.txt", args.count == 3, args.verbose == True</pre>`,
      code: String.raw`import sys
print("sys.argv 形如：['脚本名.py', '参数1']——全是字符串")

import argparse

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
    {
      id: "18_7", title: "§18.7 JSON 与 CSV", desc: "dumps/loads 与 dump/load、ensure_ascii=False 中文坑、JSON 只认六种类型、csv 必加 newline=\"\"",
      doc: "https://docs.python.org/zh-cn/3.14/library/json.html",
      html: `<ul>
<li>⭐ <code>json.dumps(data, ensure_ascii=False)</code>：对象→JSON 字符串；不加 <code>ensure_ascii=False</code> 中文会变 \\uXXXX 转义</li>
<li><code>json.loads(s)</code>：JSON 字符串→对象；<code>dumps/loads</code> 管字符串，<code>dump/load</code> 管文件对象——多个字母，多个参数</li>
<li>⭐ JSON 只认：<b>对象/数组/字符串/数字/true/false/null</b>——<code>datetime</code>、元组、集合等需要先转换</li>
<li>文件读写都显式 <code>encoding="utf-8"</code>；写文件常用 <code>indent=2</code> 美化</li>
<li>⭐ csv 打开文件要加 <code>newline=""</code>（否则 Windows 上多空行）</li>
<li><code>csv.DictReader</code> 按列名读成字典；<code>csv.DictWriter(f, fieldnames=[...])</code> + <code>writeheader()</code> + <code>writerow(字典)</code> 按列名写</li></ul>`,
      code: String.raw`import json, csv, io

data = {"name": "小明", "age": 18}

s = json.dumps(data, ensure_ascii=False)   # ⭐ 不加这个中文会变 \uXXXX
print(s)
obj = json.loads(s)                        # JSON 字符串 → 对象
print(obj["name"], obj["age"])

with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)     # 写文件
with open("data.json", encoding="utf-8") as f:
    print(json.load(f))                                  # 读文件

# 真实文件写法：open("a.csv", newline="", encoding="utf-8")  ⭐ csv 要加 newline=""
buf = io.StringIO()                        # 这里用内存缓冲演示，省去临时文件
w = csv.DictWriter(buf, fieldnames=["姓名", "年龄"])
w.writeheader()
w.writerow({"姓名": "小明", "年龄": 18})
buf.seek(0)
for row in csv.DictReader(buf):            # 按列名读成字典
    print(row["姓名"], row["年龄"])`,
    },
    {
      id: "18_8", title: "§18.8 环境变量与配置", desc: "os.getenv 读环境变量不报错、带默认值、os.environ 设置仅当前进程、密钥不写死代码",
      html: `<ul>
<li><code>os.getenv("API_KEY")</code>：读环境变量，不存在返回 <code>None</code>（<b>不报错</b>）</li>
<li>带默认值：<code>int(os.getenv("PORT", "8080"))</code>——注意 getenv 拿到的<b>总是字符串</b></li>
<li><code>os.environ["DEBUG"] = "1"</code>：设置环境变量，<b>仅当前进程有效</b>，退出即失效</li>
<li>⭐ 密钥/密码<b>不要写死在代码里</b>：用环境变量或 <code>.env</code> 文件（第三方库 python-dotenv）+ <code>.gitignore</code> 防止提交</li></ul>`,
      code: String.raw`import os

key = os.getenv("API_KEY")                 # 读环境变量，不存在返回 None（不报错）
print("API_KEY =", key)
port = int(os.getenv("PORT", "8080"))      # 带默认值；getenv 拿到的总是字符串
print("PORT =", port)

os.environ["DEBUG"] = "1"                  # 设置（仅当前进程有效）
print("DEBUG =", os.getenv("DEBUG"))`,
    },
  ],
});
