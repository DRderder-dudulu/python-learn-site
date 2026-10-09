/* ===== 课程内容数据 · 第六层 =====
 * 内容来源：《Python 3 语法完全指南》（outputs/python-syntax-guide.md）第六层 · 模块与包。
 * 写法规范：section.id 即指南小节号；points 为分条要点（内联 <code>/<b>）；
 * 【对应规范】points 每条要点必须在 code 中有明确对应：可演示的写成可运行代码并配注释；
 * 错误/危险示范以「故意注释掉」的形式呈现（学员可取消注释亲测报错）；
 * code 示例均经本地 Python 实际运行验证（tools/verify_examples.py + verify_expects.py）；expect 为真实输出。
 * 适用版本：3.8—3.14 ｜ 最后核对：2026-10
 */
COURSE.push({
  id: 6,
  title: "第六层 · 模块与包",
  minutes: 45,
  goal: "会导入模块、理解包的结构与 __main__ 守卫",
  prereq: "第一~五层",
  versions: "3.8—3.14",
  checked: "2026-10",
  sections: [
    {
      id: "6.1", title: "import 机制",
      what: "模块就是一个 .py 文件；import 是把这个文件里的功能拿过来用，像把别人做好的工具搬上自己的工作台。",
      use: "想用别人写好的功能、或把自己的代码拆成几个文件时，靠 import。三种导入形态怎么选、为什么重复 import 不会重跑，都在这节。",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/modules.html",
      points: [
        "模块就是一个 .py 文件；⭐ 首次导入会从头到尾执行一遍并缓存，重复导入不重跑",
        "三种形态：import 模块 / from 模块 import 名字 / as 起别名",
        "⭐ from x import * 慎用：名字来源不明、容易互相覆盖",
        "循环导入（a 导 b、b 导 a）容易报错——把共用部分抽到第三个模块",
      ],
      code: String.raw`import math                     # 形态一：import 模块（模块就是一个 .py 文件）
from math import gcd            # 形态二：from 模块 import 名字
import json as js               # 形态三：as 起别名

import math as math2
print(math2 is math)            # ⭐ 首次导入执行一遍并缓存：重复导入拿到同一个模块对象

print(math.pi)
print(gcd(12, 18))
print(js.dumps({"a": 1}))       # 通过别名 js 调用 json

# from math import *            # ⭐ 慎用（故意注释掉）：名字来源不明、容易互相覆盖

# 循环导入（a 导 b、b 导 a）容易报错——需要两个文件才能演示；
# 解决办法：把共用部分抽到第三个模块`,
      expect: "True\n3.141592653589793\n6\n{\"a\": 1}",
      note: "js.dumps 里中文默认转义，加 ensure_ascii=False 可显示中文（指南 §18.7）。",
    },
    {
      id: "6.2", title: "__main__ 守卫",
      what: "每个文件都自带一张名牌 __name__：直接运行时写的是「__main__」，被导入时是模块名；守卫就是认这张牌决定跑不跑。",
      use: "想让一个文件既能直接运行、又能被别人安全导入（导入时不乱跑），就把脚本逻辑放进 main()，用 if __name__ == 「__main__」 守住入口。",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/modules.html#executing-modules-as-scripts",
      points: [
        "__name__ 在<b>直接运行</b>时是 \"__main__\"，被导入时是模块名 ⭐",
        "把脚本逻辑放进 main() 再用守卫调用：既可直接运行，又可被安全导入复用",
      ],
      code: String.raw`import math
print("math.__name__ =", math.__name__)   # 被导入时：__name__ 是模块名
print("__name__ =", __name__)             # ⭐ 直接运行时：__name__ 是 "__main__"

def main():
    print("只有直接运行时才看到我")        # 脚本逻辑放进 main()

if __name__ == "__main__":      # __main__ 守卫：直接运行才调用，被导入时不执行
    main()`,
      expect: "math.__name__ = math\n__name__ = __main__\n只有直接运行时才看到我",
      note: "在这里运行（相当于直接运行），所以 main() 会执行；若被导入则不会。",
    },
    {
      id: "6.3", title: "包与相对导入",
      what: "包是把相关模块装进一个目录的「文件夹」，里面放个 __init__.py 就算数；相对导入是包内文件用「.」互相指路的写法。",
      use: "项目大了要把模块按目录分装，就成了包。包内文件要互相引用，就用相对导入；运行时记得用 python -m 包.模块——直接 python 包内文件会报错。",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/modules.html#packages",
      points: [
        "常规包 = 含 __init__.py 的目录；命名空间包（3.3+）可以没有它",
        "相对导入 from . import x 只在包内有效 ⭐",
        "⭐ 直接 python 包内文件.py 会报相对导入错误——正确姿势是 python -m 包.模块",
      ],
      code: String.raw`# 包需要真实目录才能运行，这里用注释把三条要点对应清楚：
#
# myproject/
# ├── main.py
# └── tools/                        # 常规包 = 含 __init__.py 的目录
#     ├── __init__.py               # （命名空间包 3.3+ 可以没有它；新手先用常规包）
#     ├── io.py
#     └── net.py
#
# tools/net.py 内部：from . import io         # ⭐ 相对导入：只在包内有效
#
# ❌ 错误姿势：python tools/net.py            # ⭐ 直接运行包内文件会报相对导入错误
# ✅ 正确姿势（项目根目录）：python -m tools.net
print("包的结构见上方注释（需要真实目录才能运行）")`,
      expect: "包的结构见上方注释（需要真实目录才能运行）",
      note: "新手阶段先用常规包（带 __init__.py），结构明确。",
    },
    {
      id: "6.4", title: "标准库速览",
      what: "标准库是 Python 官方随语言一起发给你的模块合集，相当于出厂自带的全套工具箱——数学、日期、JSON、正则都有。",
      use: "常用功能 Python 大多自带，import 就能用，pip 都不用装。造轮子前先翻标准库：统计用 Counter、路径用 pathlib，常有现成的。",
      doc: "https://docs.python.org/zh-cn/3.14/library/index.html",
      points: [
        "Python 自带电池：math / random / datetime / json / re / os / sys",
        "collections（Counter、defaultdict、deque）、itertools、pathlib 都极常用",
        "原则：先用标准库，不够再装第三方（指南 §18.2）",
      ],
      code: String.raw`# 自带电池，想用就有；原则：先用标准库，不够再装第三方
import math, random, json, re, os, sys
from datetime import date
from collections import Counter, defaultdict, deque
from itertools import chain
from pathlib import PurePath

print(math.gcd(12, 18))                 # math：数学
random.seed(42)                         # random：固定种子，输出才确定
print(round(random.random(), 4))
print(date(2026, 10, 1).isoformat())    # datetime：日期
print(json.loads('{"x": 1}'))           # json：解析
print(re.findall(r"\d+", "a1b22"))      # re：正则
print(os.name in ("posix", "nt"), sys.version_info >= (3, 8))   # os / sys

print(Counter("aabbc"))                 # Counter：一行统计
dd = defaultdict(int)                   # defaultdict：自动给默认值
dd["x"] += 1
print(dd["x"])
dq = deque([1, 2])                      # deque：两头都快
dq.appendleft(0)
print(list(dq))
print(list(chain([1, 2], [3])))         # itertools：拼接
print(PurePath("a/b/c.txt").suffix)     # pathlib：路径`,
      expect: "6\n0.6394\n2026-10-01\n{'x': 1}\n['1', '22']\nTrue True\nCounter({'a': 2, 'b': 2, 'c': 1})\n1\n[0, 1, 2]\n[1, 2, 3]\n.txt",
      note: "Counter 一行完成第 4 天的字符统计任务。",
    },
    {
      id: "6.5", title: "from __future__（了解）",
      what: "from __future__ 是只能待在文件最顶部的一行特殊 import，用来提前借用未来版本的语法特性。",
      use: "在老代码文件顶部看到这行，知道它是「提前打开新版本特性」的开关就行。最常见的 annotations 那行，3.14 起已经不用写了。",
      doc: "https://docs.python.org/zh-cn/3.14/library/__future__.html",
      points: [
        "「未来特性开关」，必须放在文件最顶部（docstring 之后）",
        "最常见的是 from __future__ import annotations（旧版本注解延迟求值）",
        "⭐ 3.14 起注解默认就是延迟求值，这行已不再需要（指南 §13.1）",
      ],
      code: String.raw`# from __future__ import annotations   # 「未来特性开关」：必须放在文件最顶部（docstring 之后）
# 作用（3.7—3.13）：注解延迟求值，前向引用不用加引号——这是最常见的一行
# ⭐ 3.14 起：注解默认就是延迟求值，这行已不再需要（指南 §13.1）
print("了解即可")`,
      expect: "了解即可",
      note: "在老代码里看到它，知道是干什么的就行。",
    },
  ],
  quiz: [
    { q: "同一个模块被 import 两次会怎样？",
      options: ["第二次直接用缓存，不重跑", "每次都重新执行", "报 ImportError", "报 RuntimeError"], answer: 0,
      explain: "首次导入执行一遍后缓存进 sys.modules。" },
    { q: "模块被导入时，__name__ 的值是？",
      options: ["模块名", '"__main__"', "None", "空字符串"], answer: 0,
      explain: "直接运行时才是 \"__main__\"。" },
    { q: "在包里直接 python tools/net.py 运行相对导入会怎样？",
      options: ["报 ImportError（相对导入只在包内有效）", "正常运行", "报 SyntaxError", "自动转为绝对导入"], answer: 0,
      explain: "正确姿势是在项目根目录用 python -m tools.net。" },
  ],
});
