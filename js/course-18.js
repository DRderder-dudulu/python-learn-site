/* ===== 课程内容数据 · 第十八层 =====
 * 内容来源：《Python 3 语法完全指南》（outputs/python-syntax-guide.md）第十八层 · 工程基础。
 * 写法规范与 data-course.js 一致：section.id 即指南小节号；points 为分条要点（内联 <code>/<b>）；
 * 【对应规范】points 每条要点必须在 code 中有明确对应：可演示的写成可运行代码并配注释；
 * 错误/危险示范以「故意注释掉」的形式呈现（学员可取消注释亲测报错）；
 * venv / pip / pytest 等命令行操作无法直接运行，按约定写进注释，代码体演示可运行的相关 Python；
 * code 示例均经本地 Python 实际运行验证（verify_course_expect.py）；expect 为真实输出。
 * 适用版本：3.8—3.14 ｜ 最后核对：2026-10
 */
COURSE.push({
  id: 18,
  title: "第十八层 · 工程基础",
  minutes: 55,
  goal: "会用 venv/pip 管理依赖、搭项目骨架、用 logging 记录运行、靠断言与 pytest 守住质量",
  prereq: "第六层（模块与包）",
  versions: "3.8—3.14",
  checked: "2026-10",
  sections: [
    {
      id: "18.1", title: "虚拟环境与 pip：给每个项目一座独立厨房",
      use: "装第三方包之前先做这一步：给每个项目单独配一个环境，各装各的互不污染。要装库、升级、卸载，或明明装好了程序却找不到（八成装错解释器）时，按这节的命令来。",
      doc: "https://docs.python.org/zh-cn/3.14/library/venv.html",
      points: [
        "第三方包装进系统 Python 会互相打架：<b>每个项目一个虚拟环境</b>，各装各的互不污染",
        "<code>python -m venv .venv</code> 创建；激活后命令行前出现 (.venv)，之后的 pip 只装进这里",
        "激活：Windows 用 <code>.venv\\Scripts\\activate</code>，macOS/Linux 用 <code>source .venv/bin/activate</code>；<code>deactivate</code> 退出",
        "pip 四板斧：<code>pip install 库名</code>、<code>-U</code> 升级、<code>uninstall</code> 卸载、<code>list</code> 看已装",
        "⭐ 装错解释器是新手第一大坑：用 <code>python -m pip install 库名</code> 最保险",
      ],
      code: String.raw`# 第三方包装进系统 Python 会互相打架：每个项目一个虚拟环境，各装各的互不污染。
# 命令行操作（在系统终端执行，不是 Python 代码）：
#   python -m venv .venv              # 创建虚拟环境；激活后命令行前出现 (.venv)，之后的 pip 只装进这里
#   .venv\Scripts\activate            # Windows 激活
#   source .venv/bin/activate         # macOS / Linux 激活
#   deactivate                        # 退出
# pip 四板斧：
#   pip install 库名                   # 安装
#   pip install -U 库名                # 升级
#   pip uninstall 库名                 # 卸载
#   pip list                          # 看已装
#   python -m pip install 库名         # ⭐ 最保险写法：装错解释器是新手第一大坑，这样保证装进当前 Python
import sys

# 程序里也能判断自己正跑在哪个环境
print("在虚拟环境里吗：", sys.prefix != sys.base_prefix)
print("Python 大版本：", sys.version_info.major)`,
      expect: "在虚拟环境里吗： False\nPython 大版本： 3",
      note: "再加一行 print(sys.executable)，看看当前解释器的完整路径。",
    },
    {
      id: "18.2", title: "requirements 与依赖管理：给环境「拍照存档」",
      use: "把依赖写进 requirements.txt，换机器或部署时一条命令复现环境。交付、或 import 报「找不到模块」却装过（安装名≠导入名）时，看这节。",
      doc: "https://docs.python.org/zh-cn/3.14/installing/index.html",
      points: [
        "<code>pip freeze > requirements.txt</code> 把当前环境所有库和版本写进清单——像给环境拍照",
        "换机器或部署时 <code>pip install -r requirements.txt</code> 按清单一键复现同一个环境",
        "锁版本写法：<code>pip install \"requests==2.32.3\"</code>——项目越大越要锁",
        "程序里也能自检：版本不够就提示，缺库就报清楚，别让用户猜",
        "⭐ 安装名 ≠ 导入名：beautifulsoup4 → bs4、pillow → PIL，装错名字找不到包",
      ],
      code: String.raw`# 命令行回顾（激活虚拟环境后执行）：
#   pip freeze > requirements.txt      # 导出依赖清单：把当前环境所有库和版本写进清单——像给环境拍照
#   pip install -r requirements.txt    # 换机器/部署时按清单一键复现同一个环境
#   pip install "requests==2.32.3"     # 锁版本写法：项目越大越要锁
# ⭐ 安装名 ≠ 导入名：beautifulsoup4 → 导入 bs4、pillow → 导入 PIL，装错名字找不到包
import sys
import importlib.util

# 自检 1：Python 版本底线——版本不够就提示，别让用户猜
if sys.version_info < (3, 8):
    raise SystemExit("需要 Python 3.8+")
print("满足 3.8+ 底线：", sys.version_info >= (3, 8))

# 自检 2：不导入就能探测某个库装没装，缺库就报清楚
for name in ["pip", "json"]:
    print(name, "可用：", importlib.util.find_spec(name) is not None)`,
      expect: "满足 3.8+ 底线： True\npip 可用： True\njson 可用： True",
      note: "把 json 换成 requests 再跑——没装就会显示 False。",
    },
    {
      id: "18.3", title: "项目目录结构：给代码一个像样的家",
      use: "脚本堆一个文件夹、三个月后不敢动，就该立骨架。照这节搭：pyproject.toml 当身份证、src/ 放源码、tests/ 放测试，pytest 默认就认。",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/modules.html#packages",
      points: [
        "脚本随手堆在一个文件夹，三个月后连自己都不敢动——<b>结构就是可维护性</b>",
        "现代骨架：<code>pyproject.toml</code>（项目身份证）+ <code>src/包名/</code> + <code>tests/</code> + README",
        "pyproject.toml 里写名称、版本、依赖：[project] 下的 name / version / dependencies",
        "src 布局强迫你按「安装后的包」来导入，提前暴露导包错误",
        "测试统一放 <code>tests/</code> 与源码平级，pytest 默认就来这里找",
      ],
      code: String.raw`# 结构就是可维护性：脚本随手堆在一个文件夹，三个月后连自己都不敢动。
# 推荐的项目骨架（先用 pathlib 造出来，比手点鼠标快）：
# myproject/
# ├── pyproject.toml      # 项目「身份证」：[project] 下写 name / version / dependencies
# ├── README.md           # 项目说明书
# ├── src/myproject/__init__.py   # src 布局：强迫按「安装后的包」来导入，提前暴露导包错误
# └── tests/              # 测试统一放这里、与源码平级，pytest 默认就来这里找
from pathlib import Path

root = Path("myproject")
(root / "src" / "myproject").mkdir(parents=True, exist_ok=True)
(root / "tests").mkdir(exist_ok=True)
(root / "src" / "myproject" / "__init__.py").write_text("", encoding="utf-8")
(root / "pyproject.toml").write_text(
    '[project]\nname = "myproject"\nversion = "0.1.0"\ndependencies = []\n', encoding="utf-8")

for p in sorted(root.rglob("*")):
    print(p.as_posix())`,
      expect: "myproject/pyproject.toml\nmyproject/src\nmyproject/src/myproject\nmyproject/src/myproject/__init__.py\nmyproject/tests",
      note: "把 rglob 换成 glob 并加个后缀过滤试试，只列出 .toml 文件。",
    },
    {
      id: "18.4", title: "logging 日志：别再到处 print 调试",
      use: "print 排查完得挨个删，logging 分级记录、一键开关才是正路。程序要长期跑、想留下出错现场，或让报错自动带上堆栈，就用它。",
      doc: "https://docs.python.org/zh-cn/3.14/library/logging.html",
      points: [
        "print 调试像狗仔队：用完得一个个删；logging 是正规军：分级记录、一键开关",
        "级别：<code>DEBUG < INFO < WARNING < ERROR < CRITICAL</code>，设到哪级就显示哪级及以上",
        "<code>basicConfig(level=...)</code> 一行配全局；正式项目用 <code>getLogger(\"名字\")</code> 分模块",
        "⭐ 日志默认写到 <b>stderr</b> 而非 print 的 stdout——本例特意接到 stdout 方便观察",
        "except 块里用 <code>logging.exception(...)</code>：自动附带异常堆栈",
      ],
      code: String.raw`import logging, sys

# print 调试像狗仔队：用完得一个个删；logging 是正规军：分级记录、一键开关。
# 快速玩法：logging.basicConfig(level=logging.INFO) 一行配全局；
# 正式项目用 getLogger("名字") 分模块（本例即此写法）。
# ⭐ 日志默认写到 stderr 而非 print 的 stdout；这里特意接到 stdout 方便观察
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(logging.Formatter("[%(levelname)s] %(message)s"))
log = logging.getLogger("demo")
log.setLevel(logging.INFO)          # 设到哪级，就显示哪级及以上
log.addHandler(handler)

# 级别链：DEBUG < INFO < WARNING < ERROR < CRITICAL
log.debug("细节：级别不够，不显示")
log.info("普通信息")
log.warning("警告")

print("级别比大小：", logging.DEBUG < logging.INFO < logging.WARNING)

try:
    1 / 0
except ZeroDivisionError:
    log.exception("算崩了")     # except 块里用 logging.exception：自动附带异常堆栈`,
      expect: "[INFO] 普通信息\n[WARNING] 警告\n级别比大小： True\n[ERROR] 算崩了\nTraceback (most recent call last):\n  File \"<string>\", line 21, in <module>\n    1 / 0\n    ~~^~~\nZeroDivisionError: division by zero",
      note: "把 setLevel 改成 logging.WARNING，看哪几行会消失。",
    },
    {
      id: "18.5", title: "调试三板斧：断言、print 与 pdb 思路",
      use: "程序出错找不到原因？先复现、再缩小范围：assert 守底线、print 二分定位、pdb 单步。python -O 会删掉所有 assert，不能当输入校验。",
      doc: "https://docs.python.org/zh-cn/3.14/library/pdb.html",
      points: [
        "<code>assert 条件, \"出错说明\"</code>：守住「绝不该发生」的底线，一破就当场爆炸",
        "⭐ <code>python -O</code> 会删掉所有 assert——它是开发期护栏，<b>不能</b>当输入校验用",
        "print 调试法：在关键位置打印中间值，二分定位比干瞪眼快十倍",
        "pdb 是单步显微镜：<code>python -m pdb script.py</code>；或写 <code>breakpoint()</code> 自动进入",
        "调试核心思路：<b>先复现，再缩小范围，最后才猜原因</b>",
      ],
      code: String.raw`# 交互式调试（在终端执行）：python -m pdb script.py 是单步显微镜；或代码里写 breakpoint() 自动进入
# ⭐ python -O 运行会删掉所有 assert：它是开发期护栏，【不能】当输入校验用
# 调试核心思路：先复现，再缩小范围，最后才猜原因
def average(nums):
    assert len(nums) > 0, "列表不能为空"   # 断言：守住「绝不该发生」的底线，一破就当场爆炸
    return sum(nums) / len(nums)

print(average([80, 90, 100]))

try:
    average([])
except AssertionError as e:
    print("断言拦截：", e)

# print 调试法：在关键位置打印中间值，二分定位比干瞪眼快十倍
total = 0
for i in range(3):
    total += i * 10
    print(f"第{i}轮后 total = {total}")`,
      expect: "90.0\n断言拦截： 列表不能为空\n第0轮后 total = 0\n第1轮后 total = 10\n第2轮后 total = 30",
      note: "把断言里的出错说明删掉再触发一次，看拦截信息变成什么。",
    },
    {
      id: "18.6", title: "pytest 测试入门：让机器替你检查",
      use: "手动点一遍验证太原始：写成测试，以后每改一次自动全跑，挂了立刻标红。按「文件 test_*.py、函数 test_*、断言用普通 assert」的约定上手。",
      doc: "https://docs.pytest.org/en/stable/",
      points: [
        "手工点一遍验证叫冒烟；写成测试就能<b>每次改完自动全跑一遍</b>",
        "pytest 约定：文件叫 <code>test_*.py</code>、函数叫 <code>test_*</code>，断言用普通 <code>assert</code>",
        "运行 <code>pytest</code>：自动发现 tests/ 下所有测试，绿的通过、红的失败并定位",
        "测试之间互不影响：一个挂了其他照跑，报告最后汇总",
        "同门三件套顺带认识：<code>ruff</code> 查代码问题、<code>mypy</code> 查类型（配合第十三层）",
      ],
      code: String.raw`# 手工点一遍验证叫冒烟；写成测试，就能每次改完自动全跑一遍。
# 命令行用法（先把测试存进 tests/test_calc.py——文件叫 test_*.py、函数叫 test_*）：
#   pip install pytest
#   pytest            # 自动发现 tests/ 下所有测试，绿的通过、红的失败并定位
# 测试之间互不影响：一个挂了其他照跑，报告最后汇总。
# 同门三件套顺带认识：ruff 查代码问题、mypy 查类型（配合第十三层）。
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
      expect: "test_add 通过\ntest_add_wrong 失败：pytest 会标红并定位到这一行",
      note: "故意把 add(2, 3) == 5 改成 == 6，体验一次测试失败。",
    },
  ],
  quiz: [
    { q: "激活虚拟环境后，pip install requests 会把包装到哪里？",
      options: ["当前项目的虚拟环境里", "系统 Python 里", "C 盘临时目录", "所有环境共享一份"], answer: 0,
      explain: "激活后 pip 与当前环境绑定，只装进 .venv，不污染系统 Python。" },
    { q: "requirements.txt 的作用是？",
      options: ["记录依赖清单，换机器一键复现环境", "存放项目源代码", "记录程序运行日志", "pip 的账号配置文件"], answer: 0,
      explain: "pip freeze 导出清单、pip install -r 按清单安装，是环境「拍照—复现」的组合拳。" },
    { q: "关于 logging 与 assert，正确的是？",
      options: ["日志默认输出到 stderr；python -O 会移除所有 assert", "日志默认输出到 stdout；assert 可以当输入校验", "assert 在任何情况下都会执行", "logging.exception 不会附带堆栈"], answer: 0,
      explain: "默认日志走 stderr（本层用 StreamHandler(sys.stdout) 只是为了观察）；assert 是开发期护栏，-O 模式会被删掉。" },
  ],
});
