/* ===== 速查·第六层 · 模块与包（§6.1—§6.5） =====
 * 内容来源：《Python 3 语法完全指南》第六层（outputs/python-syntax-guide-v1.md），1:1 对齐小节；
 * 示例与课程 §6.x 一致或取自指南，均经本地 Python 实跑验证（exit 0）。
 * 适用版本：3.8—3.14 ｜ 语言规则以 Python 官方文档为准。
 */
CHEATSHEET_ADV.push({
  layerId: 6,
  layer: "第六层 · 模块与包",
  stage: "一",
  topics: [
    {
      id: "6_1", title: "§6.1 import 机制", desc: "模块即 .py、首次导入执行一遍并缓存 sys.modules、三种形态与 as 别名、import * 慎用、循环导入解法",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/modules.html",
      html: `<ul>
<li><b>模块</b>就是一个 <code>.py</code> 文件</li>
<li>⭐ 模块<b>第一次被导入时会从头到尾执行一遍</b>（函数/类定义、顶层语句全部跑一遍），结果被缓存进 <code>sys.modules</code>——之后再次 import 直接拿缓存，<b>不会重复执行</b></li>
<li>形态：<code>import math</code> 导入整个模块（用 <code>math.pi</code> 访问）｜<code>import os.path</code> 导入子模块｜<code>from math import sqrt</code> 只导入 sqrt（可直接用 <code>sqrt(9)</code>）｜<code>from math import pi as PI</code>、<code>import numpy as np</code> 用 <code>as</code> 起别名（第三方库惯例别名）</li>
<li>⭐ <code>from x import *</code>：导入模块的"公开名字"（不以下划线开头；若模块定义了 <code>__all__</code> 则只导入其中列出的）——<b>慎用</b>：名字来源不明、容易互相覆盖</li>
<li>⭐ <b>循环导入</b>：a.py 导入 b、b.py 又导入 a，容易拿到"还没定义完"的对象而报错——解法：把共用部分抽到第三个模块、或把 import 挪到函数内部延迟执行</li></ul>`,
      code: String.raw`import math                 # 导入整个模块，用 math.pi 访问
import os.path              # 导入子模块
from math import sqrt       # 只导入 sqrt，可直接用
from math import pi as PI   # as 起别名
import json as js           # 与 import numpy as np 同款的别名写法

print(math.pi, PI)
print(sqrt(9))
print(os.path.join("a", "b"))
print(js.dumps({"a": 1}))

import sys
print("math" in sys.modules)   # True：首次导入后缓存进 sys.modules，重复导入不重跑 ⭐`,
    },
    {
      id: "6_2", title: "§6.2 if __name__ == \"__main__\": 详解", desc: "直接运行 __name__ 是 \"__main__\"、被导入时是模块名、脚本逻辑收进 main() 加守卫",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/modules.html#executing-modules-as-scripts",
      html: `<ul>
<li>每个模块都有内置变量 <code>__name__</code></li>
<li>⭐ <b>直接运行</b>这个文件时（<code>python app.py</code>），<code>__name__</code> 的值是字符串 <code>"__main__"</code></li>
<li>⭐ <b>被 import</b> 时，<code>__name__</code> 的值是模块名（如 <code>"app"</code>）</li>
<li>⭐ 习惯把脚本逻辑收进 <code>main()</code> 函数再放进守卫里——既可直接运行，又可被安全导入复用（被别人 import 时 <code>main()</code> 不会自动跑）</li></ul>`,
      code: String.raw`# utils.py 的典型写法
def helper():
    return "工具函数"

def main():
    print("脚本入口逻辑")

if __name__ == "__main__":   # ⭐ 只有"直接运行"时才执行 main()
    main()                   # 被别人 import 时不会自动跑

print("__name__ =", __name__)   # 直接运行时打印 __main__；被导入时是模块名`,
    },
    {
      id: "6_3", title: "§6.3 包（package）与两种形态", desc: "常规包 __init__.py vs 命名空间包（3.3+ PEP 420）、包内导入写法、相对导入只在包内有效、python -m 运行",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/modules.html#packages",
      html: `<ul>
<li><b>包</b>是组织模块的目录；导入包内成员：<code>from tools import io</code>｜<code>from tools.io import read</code>｜<code>import tools.net as net</code></li></ul>
<table><tr><th>形态</th><th>说明</th></tr>
<tr><td>⭐ 常规包</td><td>含 <code>__init__.py</code> 的目录（可以是空文件；包被导入时会执行它）——<b>新手推荐</b>，明确、兼容性好</td></tr>
<tr><td>命名空间包（3.3+，PEP 420）</td><td><b>没有</b> <code>__init__.py</code> 的目录也能当包，甚至可以横跨多个路径合并成一个包（大型项目/插件系统用）；混用时<b>常规包优先被识别</b></td></tr></table>
<ul>
<li><b>相对导入</b>（包内部使用）：<code>from . import io</code>（同包的 io 模块）、<code>from .io import read</code>（同上）、<code>from ..other import x</code>（<code>..</code> 表示上一级包）</li>
<li>⭐ 相对导入<b>只在包内有效</b>：直接 <code>python tools/net.py</code> 运行会报 <code>ImportError: attempted relative import with no known parent package</code>——正确姿势是在项目根目录用 <code>python -m tools.net</code> 运行</li></ul>`,
      code: String.raw`# 目录结构示例：
# myproject/
# ├── main.py
# └── tools/              # 常规包：含 __init__.py
#     ├── __init__.py     #   （可以是空文件；包被导入时会执行它）
#     ├── io.py
#     └── net.py
#
# 导入包里的模块：
# from tools import io        # 导入包里的模块
# from tools.io import read   # 直接导入其中的函数
# import tools.net as net
#
# 相对导入（tools/net.py 内部，只在包内有效 ⭐）：
# from . import io            # 同包的 io 模块
# from .io import read        # 同上
# from ..other import x       # .. 表示上一级包
#
# ⭐ 直接 python tools/net.py 会报：
# ImportError: attempted relative import with no known parent package
# 正确姿势（项目根目录）：python -m tools.net
print("包与相对导入需要真实目录，本页先记住规则")`,
    },
    {
      id: "6_4", title: "§6.4 标准库速览", desc: "自带电池：math / random / datetime / os / sys / json / re / collections / pathlib 等 16 个常用模块",
      doc: "https://docs.python.org/zh-cn/3.14/library/index.html",
      html: `<p>Python <b>自带电池</b>：这些模块随解释器一起装好，import 即用；原则是先找标准库，不够再装第三方。</p>
<table><tr><th>模块</th><th>干什么</th></tr>
<tr><td><code>math</code></td><td>数学函数（sqrt/sin/floor/ceil/isclose）</td></tr>
<tr><td><code>random</code></td><td>随机数（randint/choice/shuffle/sample）</td></tr>
<tr><td><code>datetime</code></td><td>日期时间</td></tr>
<tr><td><code>os</code> / <code>os.path</code></td><td>操作系统接口、路径处理（新项目更推荐 pathlib）</td></tr>
<tr><td><code>sys</code></td><td>解释器相关（argv 命令行参数、exit、path）</td></tr>
<tr><td><code>json</code></td><td>JSON 编解码（见 §18.7）</td></tr>
<tr><td><code>re</code></td><td>正则表达式（模式字符串记得加 r 前缀 ⭐）</td></tr>
<tr><td><code>collections</code></td><td>Counter/defaultdict/deque/namedtuple</td></tr>
<tr><td><code>itertools</code> / <code>functools</code></td><td>迭代器工具 / 函数工具（见 §11.4、§12.1）</td></tr>
<tr><td><code>pathlib</code></td><td>面向对象的路径（见 §8.2）</td></tr>
<tr><td><code>typing</code></td><td>类型注解（见第 13 层）</td></tr>
<tr><td><code>copy</code></td><td>copy/deepcopy</td></tr>
<tr><td><code>logging</code></td><td>日志（见 §18.5）</td></tr>
<tr><td><code>subprocess</code></td><td>调用外部命令</td></tr>
<tr><td><code>threading</code> / <code>multiprocessing</code></td><td>线程 / 多进程</td></tr></table>`,
      code: String.raw`import random, math, json
from datetime import date
from collections import Counter

print(random.choice(["石头", "剪刀", "布"]) in ["石头", "剪刀", "布"])
print(math.gcd(12, 18))
print(date.today().year >= 2026)
print(Counter("aabbc"))
print(json.loads('{"x": 1}'))`,
    },
    {
      id: "6_5", title: "§6.5 from __future__ import annotations", desc: "文件最顶部的未来特性开关、注解延迟求值与前向引用、3.14 起默认延迟已无必要",
      doc: "https://docs.python.org/zh-cn/3.14/library/__future__.html",
      html: `<ul>
<li>放在文件<b>最顶部</b>（docstring 之后）的"未来特性开关"，最常见的一条：<code>from __future__ import annotations</code>——让所有注解<b>延迟求值</b>（不再立即计算）</li>
<li>用途：旧版本（3.7—3.13）里可以在注解中提前引用尚未定义的名字（<b>前向引用</b>）、让 <code>list[int]</code> 等写法在 3.8 也能写</li>
<li>⭐ 3.14 起注解默认就是延迟求值（PEP 649/749），这条 import 已无必要——详见 §13.1</li></ul>`,
      code: String.raw`# from __future__ import annotations   # 必须放在文件最顶部（docstring 之后），此处仅示意
# 作用（3.7—3.13）：让所有注解延迟求值——前向引用不用加引号，list[int] 等写法在 3.8 也能写
# 3.14 起：注解默认就是延迟求值（PEP 649/749），无需再写
print("在老代码里看到这行，知道是“未来特性开关”即可")`,
    },
  ],
});
