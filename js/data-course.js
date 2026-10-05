/* ===== 课程内容数据 =====
 * 内容来源：《Python 3 语法完全指南》（outputs/python-syntax-guide.md）第一遍阅读路线：第 1—6、8 层。
 * 每个 section 严格对应指南小节编号（id 即 §x.y），讲解为分条要点；
 * 每节附 Python 官方文档链接（语言规则以官方文档为准）；
 * ver 仅在该节有版本门槛时标注；示例均经本地 Python 自动运行验证（tools/verify_examples.py）。
 * 适用版本：3.8—3.14 ｜ 最后核对：2026-09
 */
const COURSE = [
  {
    id: 1,
    title: "第一层 · 基础语法",
    minutes: 60,
    goal: "掌握注释、变量、数字、字符串、输入输出与运算符，写出第一个程序",
    prereq: "无（零基础起点）",
    versions: "3.8—3.14",
    checked: "2026-09",
    sections: [
      {
        id: "1.1", title: "注释与文档字符串",
        doc: "https://docs.python.org/zh-cn/3.14/tutorial/introduction.html",
        points: [
          "<code>#</code> 开头到行尾是注释，解释器完全忽略",
          "Python 没有 /* */ 块注释，多行说明就每行写一个 #",
          "三引号字符串单独放置<b>不是</b>注释，只是一个没被使用的字符串对象",
          "函数/类/模块的<b>第一条语句</b>是字符串时才是文档字符串（docstring），help() 能读到",
        ],
        code: String.raw`# 这是单行注释
age = 18  # 行尾注释

def add(a, b):
    """计算两个数的和（这是文档字符串）。"""
    return a + b

print(add(2, 3))
print(add.__doc__)`,
        expect: "5\n计算两个数的和（这是文档字符串）。",
        note: "试着把 add.__doc__ 改成 print(add(10, 20))。",
      },
      {
        id: "1.2", title: "标识符与关键字",
        doc: "https://docs.python.org/zh-cn/3.14/reference/lexical_analysis.html#identifiers",
        points: [
          "标识符 = 字母/数字/下划线，不能以数字开头，区分大小写；中文也合法（团队项目不推荐）",
          "3.14 共 35 个关键字（class、for、if……），不能当变量名",
          "软关键字 match、case、_、type(3.12+)：只在特定语法位置特殊，其它地方可作变量名",
          "⭐ 别把变量起名为 list、str、id——会遮蔽内置功能",
        ],
        code: String.raw`import keyword
print(len(keyword.kwlist), "个关键字")

name = "小明"        # 中文变量名合法
user_name = "Tom"    # 蛇形命名是官方推荐风格
print(name, user_name)`,
        note: "keyword.kwlist 可以打印出全部关键字清单。",
      },
      {
        id: "1.3", title: "缩进与代码块",
        doc: "https://docs.python.org/zh-cn/3.14/reference/lexical_analysis.html#indentation",
        points: [
          "Python 用<b>缩进</b>表示层级：每级 4 个空格，同一代码块内必须完全一致",
          "冒号 : 宣告一个代码块开始（if / for / def / class 等后面）",
          "混用 Tab 和空格会报 TabError——编辑器里统一设成 4 空格",
          "括号 () [] {} 内可以自由换行，这是长行的推荐写法",
        ],
        code: String.raw`score = 85
if score >= 60:
    print("及格")       # 缩进 4 格，属于 if 的代码块
    print("继续加油")   # 同样缩进，也属于这个代码块
print("这行总会执行")   # 没有缩进，不属于 if`,
        expect: "及格\n继续加油\n这行总会执行",
        note: "把第二行 print 的缩进删掉再运行，看会发生什么错误。",
      },
      {
        id: "1.4", title: "变量与赋值",
        doc: "https://docs.python.org/zh-cn/3.14/reference/simple_stmts.html#assignment-statements",
        points: [
          "变量是<b>贴在对象上的标签</b>，不是装值的盒子——理解这点后面少踩一半坑",
          "动态类型：同一个名字可以随时改贴到别的类型",
          "链式 a = b = 0、解包 x, y = 1, 2、一行交换 x, y = y, x",
          "type() 看类型、id() 看身份、isinstance() 做类型判断",
        ],
        code: String.raw`x = 10
y = x         # y 贴到同一个 10 上
x = 20        # x 改贴到 20，y 不动
print(y)

a = b = 0     # 链式赋值
m, n = 1, 2   # 解包赋值
m, n = n, m   # 一行交换
print(m, n, a, b, type(m))`,
        expect: "10\n2 1 0 0 <class 'int'>",
        note: "先猜 y 是 10 还是 20，再运行验证。",
      },
      {
        id: "1.5", title: "数字与取整",
        doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#numeric-types-int-float-complex",
        points: [
          "int 任意精度不会溢出；float 是双精度，0.1 + 0.2 ≠ 0.3（用 math.isclose 比较）⭐",
          "/ 恒得 float；// 向负无穷取整（-7 // 2 == -4）⭐；% 符号跟随除数；** 是幂",
          "取整四组：int/trunc 向零、floor 向负无穷、ceil 向正无穷、round 逢五取偶",
          "⭐ round(2.5) 是 2 不是 3（银行家舍入）",
        ],
        code: String.raw`import math
print(0.1 + 0.2 == 0.3, math.isclose(0.1 + 0.2, 0.3))
print(7 / 2, 7 // 2, -7 // 2)
print(int(2.9), math.floor(-2.3), math.ceil(-2.3))
print(round(2.5), round(3.5))`,
        expect: "False True\n3.5 3 -4\n2 -3 -2\n2 4",
        note: "重点观察 -7 // 2 和 round(2.5) 的结果。",
      },
      {
        id: "1.6", title: "字符串与转义",
        doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#text-sequence-type-str",
        points: [
          "单/双/三引号等价；字符串<b>不可变</b>，所有方法都返回新串 ⭐",
          "常用转义：\\n 换行、\\t 制表、\\\\ 反斜杠、\\r 回行首",
          "r\"...\" 原始字符串：反斜杠不转义，写 Windows 路径和正则必备 ⭐",
          "f-string：{表达式} 嵌值、{x:.2f} 两位小数、{x=} 连名带值打印（3.8+）",
        ],
        code: String.raw`name = "小明"
print(f"你好，{name}")
print("C:\\new\\test")    # 转义写法
print(r"C:\new\test")     # 原始字符串写法（推荐）
print("第一行\n第二行")
s = "hello"
s = s.upper()             # 接住返回值才算数
print(s)`,
        expect: "你好，小明\nC:\\new\\test\nC:\\new\\test\n第一行\n第二行\nHELLO",
        note: "把第 2 行的 f 去掉再运行，看输出差别。",
      },
      {
        id: "1.7", title: "布尔、None 与假值",
        doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#truth-value-testing",
        points: [
          "假值：False、None、0、0.0、空字符串、空列表/字典/集合——<b>其余全为真</b>（含 \"0\"、[0]）⭐",
          "判断空容器用 if not x:；判断 None 用 is None ⭐（不用 ==）",
          "and/or 返回<b>操作数</b>而不是布尔值：x or 默认值 是兜底惯用法",
          "短路求值：左边能定结果，右边就不执行",
        ],
        code: String.raw`print(bool(""), bool("0"), bool([]), bool([0]))
name = ""
print(name or "匿名")     # 空串是假值，取右边
print(None is None)`,
        expect: "False True False True\n匿名\nTrue",
        note: '为什么 bool("0") 是 True？非空字符串就是真，与内容无关。',
      },
      {
        id: "1.8", title: "输入与输出",
        doc: "https://docs.python.org/zh-cn/3.14/library/functions.html#print",
        points: [
          "print：sep 改分隔符、end 改结尾、flush 立即显示",
          "input() 返回值<b>永远是字符串</b> ⭐，要数字必须 int() 转换",
          "绝对不要用 eval(input())——严重安全漏洞",
          "input 在网页环境里不可用，本站示例以 print 演示；终端写法见注释",
        ],
        code: String.raw`print("a", "b", "c", sep="-")
print("不换行", end="")
print("接着写")
# 终端里的标准输入写法（了解，网页里不能运行）：
# age = int(input("年龄："))
age = 18
print(f"明年 {age + 1} 岁")`,
        expect: "a-b-c\n不换行接着写\n明年 19 岁",
        note: "在自己电脑上试 input 时，记得 int() 转换。",
      },
      {
        id: "1.9", title: "运算符与优先级",
        doc: "https://docs.python.org/zh-cn/3.14/reference/expressions.html#operator-precedence",
        points: [
          "== 比<b>值</b>，is 比<b>身份</b>——is 只用于 None/True/False/哨兵对象 ⭐⭐",
          "in 成员检查；支持链式比较 1 < x <= 5",
          "优先级大致：下标/调用 > ** > 乘除 > 加减 > 比较 > not > and > or",
          "拿不准就加括号；-1**2 == -1（** 比左边的负号先算）",
        ],
        code: String.raw`a = [1, 2]
b = [1, 2]
print(a == b, a is b)   # True False：值相等但不是同一对象 ⭐
print(2 in a)
print(1 < 2 <= 2)
print(-1 ** 2)`,
        expect: "True False\nTrue\nTrue\n-1",
        note: "a is b 为什么是 False？两个列表内容相同却是两个对象。",
      },
    ],
    quiz: [
      { q: "执行 x = 10; y = x; x = 20 之后，y 的值是？",
        options: ["10", "20", "报错", "None"], answer: 0,
        explain: "y 贴在对象 10 上；x 改贴到 20 不影响 y（变量是标签）。" },
      { q: 'print(f"{3.14159:.2f}") 的输出是？',
        options: ["3.14", "3.15", "3.1416", "报错"], answer: 0,
        explain: ":.2f 保留两位小数，第三位是 1 直接舍去。" },
      { q: "round(2.5) 的结果是？",
        options: ["2", "3", "2.5", "报错"], answer: 0,
        explain: "round 是银行家舍入：恰好 .5 时取偶数那边。" },
    ],
  },
  {
    id: 2,
    title: "第二层 · 流程控制",
    minutes: 55,
    goal: "会用 if 分支、while/for 循环，理解 else 子句与 match 匹配",
    prereq: "第一层",
    versions: "3.8—3.14（match 需 3.10+）",
    checked: "2026-09",
    sections: [
      {
        id: "2.1", title: "if / elif / else",
        doc: "https://docs.python.org/zh-cn/3.14/tutorial/controlflow.html#if-statements",
        points: [
          "冒号 + 缩进；elif 可以有任意多个；else 可省略",
          "条件位置放的是<b>真值测试</b>，不必写 == True",
          "边界值要想清楚：>= 60 含不含 60？这是最常写错的地方",
        ],
        code: String.raw`score = 85
if score >= 90:
    print("优秀")
elif score >= 60:
    print("及格")
else:
    print("不及格")`,
        expect: "及格",
        note: "把 score 改成 60 和 59 各运行一次，确认边界。",
      },
      {
        id: "2.2", title: "while 循环与 else 子句",
        doc: "https://docs.python.org/zh-cn/3.14/tutorial/controlflow.html",
        points: [
          "while 条件为真就循环——⭐ 别忘了更新条件变量，否则死循环",
          "break 立刻跳出整个循环；continue 跳过本轮进下一轮",
          "else 子句在<b>循环没被 break 打断</b>时执行，天生适合「找了一圈没找到」",
        ],
        code: String.raw`n = 0
while n < 3:
    n += 1
print("n =", n)

nums = [1, 3, 5]
for x in nums:
    if x % 2 == 0:
        print("找到偶数", x)
        break
else:
    print("没有偶数")     # 没 break 过才执行`,
        expect: "n = 3\n没有偶数",
        note: "把 5 改成 6，看 else 还执不执行。",
      },
      {
        id: "2.3", title: "for 循环与 range",
        doc: "https://docs.python.org/zh-cn/3.14/tutorial/controlflow.html#for-statements",
        points: [
          "for 是<b>遍历</b>：把可迭代对象的元素一个个取出",
          "range 惰性生成，且不含右端点：range(1, 101) 产生 1—100",
          "enumerate 拿序号（start 改起始）、zip 并行遍历（3.10+ 可加 strict=True 防长短不一）",
          "⭐ 不要边遍历边修改列表——遍历副本 nums[:] 或改用推导式",
        ],
        code: String.raw`for i, name in enumerate(["甲", "乙"], start=1):
    print(i, name)

for a, b in zip([1, 2, 3], "abc"):
    print(a, b)

print(sum(range(1, 101)))`,
        expect: "1 甲\n2 乙\n1 a\n2 b\n3 c\n5050",
        note: "把 start=1 删掉再运行，看编号变化。",
      },
      {
        id: "2.4", title: "match 结构化模式匹配",
        ver: "3.10+",
        doc: "https://docs.python.org/zh-cn/3.14/reference/compound_stmts.html#the-match-statement",
        points: [
          "按<b>数据的形状</b>匹配并顺便拆包取值，不只是 switch",
          "case _ 是通配（相当于 default）",
          "⭐⭐ 裸名字是「捕获」不是「比较」：case x 会匹配一切并赋值给 x；按值比较用点号（Color.RED）或字面量",
          "模式后可加 if 守卫进一步过滤",
        ],
        code: String.raw`command = "go north"
match command.split():
    case ["quit"]:
        print("退出")
    case ["go", direction]:     # 第二个元素捕获到 direction
        print(f"向{direction}走")
    case _:
        print("听不懂")`,
        expect: "向北走",
        note: "把 command 改成 \"quit\" 再运行。3.8/3.9 没有 match——用 if/elif 替代。",
      },
    ],
    quiz: [
      { q: "for...else 结构中，else 什么时候执行？",
        options: ["循环没被 break 打断时", "循环被 break 打断时", "每次循环后都执行", "循环为空时报错"], answer: 0,
        explain: "else 只在没被 break 打断时执行，常用于「没找到」场景。" },
      { q: "range(2, 10, 3) 依次产生的数字是？",
        options: ["2, 5, 8", "2, 5, 8, 10", "3, 6, 9", "2, 4, 6, 8"], answer: 0,
        explain: "从 2 开始、步长 3、不含 10。" },
      { q: 'if "": 这个条件会怎样？',
        options: ["条件为假，不进入分支", "条件为真，进入分支", "报 SyntaxError", "报 ValueError"], answer: 0,
        explain: "空字符串是假值。" },
    ],
  },
  {
    id: 3,
    title: "第三层 · 数据结构",
    minutes: 70,
    goal: "熟练列表、字典、集合、元组的核心操作与切片、解包、del",
    prereq: "第一、二层",
    versions: "3.8—3.14",
    checked: "2026-09",
    sections: [
      {
        id: "3.1", title: "列表：增删改查",
        doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#lists",
        points: [
          "增：append 尾加、extend 接一串、insert 按位插",
          "删：remove 按值（没有则报错）、pop 按下标弹出、del 按下标/切片",
          "改/查：按下标改；in / index / count / len 查询",
          "⭐ sort() 原地排序返回 None；要新列表用 sorted()",
          "⭐ b = a 是同一个列表；拷贝用 a[:] 或 a.copy()（浅拷贝）",
        ],
        code: String.raw`nums = [3, 1, 2]
nums.append(4)
nums.remove(1)
nums[0] = 99
print(nums, len(nums))
nums.sort()
print(nums, nums[::-1])

a = [1, [2]]
b = a[:]          # 浅拷贝：外层独立，内层仍共享
a[1].append(3)
print(b)          # 内层子列表跟着变了 ⭐`,
        expect: "[99, 2, 4] 3\n[2, 4, 99] [99, 4, 2]\n[1, [2, 3]]",
        note: "深拷贝用 copy.deepcopy（指南 §3.1 拷贝三层辨析）。",
      },
      {
        id: "3.2", title: "元组：不可变序列",
        doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#tuples",
        points: [
          "元组不可变：t[0] = 9 会报 TypeError",
          "⭐ 单元素元组必须带逗号：(5,) 才是元组，(5) 只是数字",
          "可以打包/解包；可哈希的元组能当字典键",
          "用途：函数多返回值、保证数据不被改",
        ],
        code: String.raw`t = (1, 2, 3)
single = (5,)
x, y = (10, 20)
print(t, single, x, y)

point = {(0, 0): "原点"}    # 元组当字典键
print(point[(0, 0)])`,
        expect: "(1, 2, 3) (5,) 10 20\n原点",
        note: "试试 t[0] = 9，确认会报 TypeError。",
      },
      {
        id: "3.3", title: "字典：键值对",
        doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#mapping-types-dict",
        points: [
          "⭐ 键必须可哈希（str/int/tuple）；值没有限制",
          "⭐ {} 是空字典，不是空集合！空集合写 set()",
          "取键优先 d.get(键, 默认值)，避免 KeyError",
          "3.7+ 保持插入顺序；合并用 |（3.9+，后者覆盖前者）",
        ],
        code: String.raw`user = {"name": "Tom", "age": 18}
user["city"] = "北京"
print(user.get("email", "无"))
for k, v in user.items():
    print(k, v)

merged = {"a": 1} | {"a": 2, "b": 3}
print(merged)`,
        expect: "无\nname Tom\nage 18\ncity 北京\n{'a': 2, 'b': 3}",
        note: "把 get 换成 user[\"email\"] 直接取，会触发 KeyError。",
      },
      {
        id: "3.4", title: "集合：去重与运算",
        doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#set-types-set-frozenset",
        points: [
          "自动去重、无序；空集合只能写 set() ⭐",
          "运算：| 并、& 交、- 差、^ 对称差",
          "⭐ 成员判断 x in s 是 O(1)：大批量判断先转 set",
          "frozenset 是不可变集合，可以当字典键",
        ],
        code: String.raw`s = set([1, 2, 2, 3])
print(s)

a, b = {1, 2, 3}, {2, 3, 4}
print(a & b, a | b, a - b)
print(2 in a)`,
        expect: "{1, 2, 3}\n{2, 3} {1, 2, 3, 4} {1}\nTrue",
        note: "列表去重常用 set，但要保序用 dict.fromkeys（见习题）。",
      },
      {
        id: "3.5", title: "字符串方法分组",
        doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#string-methods",
        points: [
          "所有方法返回新串，原串不变（字符串不可变）",
          "strip() 去两端空白；⭐ 参数是「字符集合」不是前后缀",
          "精确去前后缀用 removeprefix/removesuffix（3.9+）",
          "split 返回列表；join 是「分隔符」的方法；find 找不到给 -1，index 找不到报错",
        ],
        code: String.raw`s = "  Hello  "
print(s.strip())
print("report.csv".removesuffix(".csv"))
print("a,b,c".split(","))
print("-".join(["a", "b"]))
print("hello".find("zz"))     # 找不到返回 -1，不报错`,
        expect: "Hello\nreport\n['a', 'b', 'c']\na-b\n-1",
        note: "试试 \"aabbcc\".strip(\"ab\")——想想为什么结果是 \"cc\"。",
      },
      {
        id: "3.6", title: "切片",
        doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#common-sequence-operations",
        points: [
          "s[start:stop:step]：含头不含尾；start/stop 可省略",
          "负数从尾数；[::-1] 是经典反转写法 ⭐",
          "⭐ 切片越界不报错给空结果（对比：s[10] 会 IndexError）",
          "[:] 是浅拷贝惯用法",
        ],
        code: String.raw`s = "abcdef"
print(s[1:4], s[:3], s[3:])
print(s[::2], s[::-1])
print(s[10:20])     # 越界不报错，输出空串`,
        expect: "bcd abc def\nace fedcba\n",
        note: "切片对 list/tuple/str/bytes 都通用。",
      },
      {
        id: "3.7", title: "序列解包",
        doc: "https://docs.python.org/zh-cn/3.14/tutorial/datastructures.html#tuples-and-sequences",
        points: [
          "左右数量必须相等，否则 ValueError（除非带 *）",
          "*变量 收集剩余元素成列表 ⭐",
          "支持嵌套解包；遍历 d.items() 就是解包的日常",
        ],
        code: String.raw`first, *rest = [1, 2, 3, 4]
*head, last = [1, 2, 3, 4]
a, *mid, b = [1, 2, 3, 4]
print(first, rest)
print(head, last)
print(a, mid, b)`,
        expect: "1 [2, 3, 4]\n[1, 2, 3] 4\n1 [2, 3] 4",
        note: "把右边换成 [1, 2] 看 mid 变成什么。",
      },
      {
        id: "3.8", title: "del 语句",
        doc: "https://docs.python.org/zh-cn/3.14/reference/simple_stmts.html#the-del-statement",
        points: [
          "del 是语句：删名字、删元素、删切片、删字典键",
          "⭐ del 切片越界不报错；但 del 单个越界索引会 IndexError",
          "del 只是去掉一个引用；对象没有任何引用时才被回收",
        ],
        code: String.raw`nums = [1, 2, 3, 4]
del nums[0]
del nums[1:3]
print(nums)

d = {"a": 1, "b": 2}
del d["a"]
print(d)

del nums[10:99]     # 切片越界：静默无事
print(nums)`,
        expect: "[2]\n{'b': 2}\n[2]",
        note: "试试 del nums[10]——单个索引越界会报错。",
      },
    ],
    quiz: [
      { q: "nums = [3, 1, 2]; result = nums.sort() 之后 result 是？",
        options: ["None", "[1, 2, 3]", "[3, 1, 2]", "报错"], answer: 0,
        explain: "sort() 原地排序并返回 None；要新列表用 sorted(nums)。" },
      { q: "单独一个 {} 创建的是？",
        options: ["空字典", "空集合", "空列表", "报错"], answer: 0,
        explain: "{} 是空字典；空集合要写 set()。" },
      { q: "[x for x in range(5) if x % 2 == 0] 的结果是？",
        options: ["[0, 2, 4]", "[1, 3]", "[0, 1, 2, 3, 4]", "[2, 4]"], answer: 0,
        explain: "range(5) 是 0~4，其中偶数是 0、2、4。" },
    ],
  },
  {
    id: 4,
    title: "第四层 · 函数",
    minutes: 60,
    goal: "会把重复代码封装成函数，掌握参数、返回值与作用域",
    prereq: "第一~三层",
    versions: "3.8—3.14",
    checked: "2026-09",
    sections: [
      {
        id: "4.1", title: "定义与调用",
        doc: "https://docs.python.org/zh-cn/3.14/tutorial/controlflow.html#defining-functions",
        points: [
          "def 定义，return 交还结果；调用时才执行函数体",
          "⭐ 没有 return 的函数返回 None——print 是显示，return 才是交还",
          "返回多个值 = 返回元组，配合解包接收",
          "函数体第一条字符串是 docstring",
        ],
        code: String.raw`def divmod2(a, b):
    """返回商和余数。"""
    return a // b, a % b

q, r = divmod2(7, 2)
print(q, r)

def f():
    pass
print(f())        # None ⭐`,
        expect: "3 1\nNone",
        note: "result = print(\"x\") 之后 result 也是 None——print 没有返回值。",
      },
      {
        id: "4.2", title: "参数的五种形态",
        doc: "https://docs.python.org/zh-cn/3.14/tutorial/controlflow.html#more-on-defining-functions",
        points: [
          "/ 前仅限位置（3.8+）；普通参数位置或关键字均可",
          "*args 收集多余位置参数成元组；* 后的参数仅限关键字；**kwargs 收集多余关键字成字典",
          "有默认值的参数排在无默认值之后",
          "⭐⭐ 可变默认值陷阱：默认值在定义时只求值一次——用 None 占位，函数内再建",
        ],
        code: String.raw`def f(a, b=2, *args, c, **kwargs):
    print(a, b, args, c, kwargs)

f(1, 3, 5, 7, c=9, x=1)

def add(item, box=None):     # ✅ 可变默认值的正确写法
    if box is None:
        box = []
    box.append(item)
    return box

print(add(1), add(2))`,
        expect: "1 3 (5, 7) 9 {'x': 1}\n[1] [2]",
        note: "若写成 def add(item, box=[])：两次调用的结果会共享同一个列表（指南 §4.2）。",
      },
      {
        id: "4.3", title: "调用规则与解包",
        doc: "https://docs.python.org/zh-cn/3.14/reference/expressions.html#calls",
        points: [
          "位置参数不能跟在关键字参数后面（SyntaxError）",
          "⭐ 同一个参数不能既按位置又按关键字传（TypeError）",
          "f(*序列) 拆成位置参数；f(**字典) 拆成关键字参数",
        ],
        code: String.raw`def f(a, b, c):
    print(a, b, c)

args = (1, 2, 3)
f(*args)                        # 等价于 f(1, 2, 3)

f(**{"a": 10, "b": 20, "c": 30})`,
        expect: "1 2 3\n10 20 30",
        note: "试试 f(1, a=1, c=3)——a 被传了两次，会报 TypeError。",
      },
      {
        id: "4.4", title: "作用域与 global / nonlocal",
        doc: "https://docs.python.org/zh-cn/3.14/tutorial/classes.html#python-scopes-and-namespaces",
        points: [
          "名字查找顺序 LEGB：局部 → 外层函数 → 全局 → 内置",
          "⭐ 修改全局变量要 global；修改外层函数的变量要 nonlocal",
          "⭐ 改对象<b>内部</b>（append 等）不需要声明——重新绑定名字才需要",
        ],
        code: String.raw`count = 0
def inc():
    global count      # 声明后才能改全局变量
    count += 1

inc()
inc()
print(count)

nums = []
def push():
    nums.append(1)    # 改对象内部，不需要 global

push()
print(nums)`,
        expect: "2\n[1]",
        note: "把 global 那行删掉，运行会报 UnboundLocalError。",
      },
      {
        id: "4.5", title: "lambda 匿名函数",
        doc: "https://docs.python.org/zh-cn/3.14/tutorial/controlflow.html#lambda-expressions",
        points: [
          "lambda 参数: 表达式——只能写一个表达式",
          "最常用作排序/处理的 key：sorted(..., key=lambda ...)",
          "逻辑稍复杂就老老实实写 def",
        ],
        code: String.raw`words = ["bb", "a", "ccc"]
print(sorted(words, key=lambda w: len(w)))

pairs = [(1, "b"), (2, "a")]
pairs.sort(key=lambda p: p[1])
print(pairs)`,
        expect: "['a', 'bb', 'ccc']\n[(2, 'a'), (1, 'b')]",
        note: "把 key 换成 lambda w: w，观察排序结果。",
      },
      {
        id: "4.6", title: "函数注解（简介）",
        doc: "https://docs.python.org/zh-cn/3.14/tutorial/controlflow.html#function-annotations",
        points: [
          "注解是写给人类和检查工具的「说明书」⭐ 不影响运行",
          "写错类型照样能跑——真正检查靠 mypy 等工具",
          "类型系统深入学习在第二阶段（指南第 13 层），这里认个脸熟",
        ],
        code: String.raw`def add(a: int, b: int) -> int:
    return a + b

print(add(2, 3))
print(add.__annotations__)`,
        note: "注解存进 __annotations__；3.14 起默认延迟求值（指南 §13.1）。",
      },
      {
        id: "4.7", title: "递归",
        doc: "https://docs.python.org/zh-cn/3.14/tutorial/controlflow.html#defining-functions",
        points: [
          "函数调用自己；⭐ 必须有终止条件，否则无限递归",
          "默认递归深度约 1000 层，超过报 RecursionError",
        ],
        code: String.raw`def factorial(n):
    if n <= 1:            # 终止条件
        return 1
    return n * factorial(n - 1)

print(factorial(5))       # 5! = 120`,
        expect: "120",
        note: "把终止条件注释掉（别真跑死循环，想一下结果即可）。",
      },
    ],
    quiz: [
      { q: "def f(): pass 之后 print(f()) 输出什么？",
        options: ["None", "什么都不输出", "pass", "报错"], answer: 0,
        explain: "没有 return 的函数返回 None。" },
      { q: "可变默认值的正确写法是？",
        options: ["def f(box=None) 再在函数内 box = []", "def f(box=[])", "def f(box=list)", "都行"], answer: 0,
        explain: "默认值在定义时只求值一次，用 None 占位再在函数内创建。" },
      { q: "f(1, a=1, c=3) 调用 def f(a, b, c) 会怎样？",
        options: ["TypeError：a 传了两次", "正常执行", "SyntaxError", "返回 None"], answer: 0,
        explain: "同一参数不能既按位置又按关键字传。" },
    ],
  },
  {
    id: 5,
    title: "第五层 · 异常处理",
    minutes: 50,
    goal: "会用 try 保护程序、认识常见异常、会主动抛出和自定义异常",
    prereq: "第一~四层",
    versions: "3.8—3.14",
    checked: "2026-09",
    sections: [
      {
        id: "5.1", title: "try / except / else / finally",
        doc: "https://docs.python.org/zh-cn/3.14/tutorial/errors.html",
        points: [
          "捕获<b>具体</b>的异常类型，别写裸 except:（会吞掉一切，包括 Ctrl+C 之外的系统异常）",
          "一个 except 抓多种异常用元组 (A, B)；3.14+ 不带 as 时可省略括号",
          "else 在 try 块顺利跑完时执行；finally 基本总会执行（清理动作用）⭐",
          "🔶 进阶坑：finally 里写 return 会覆盖返回值——知道即可（指南 §5.1）",
        ],
        code: String.raw`def parse(raw):
    try:
        return int(raw)
    except ValueError:
        return "不是数字"
    finally:
        print("尝试解析完毕")     # 总会执行

print(parse("42"))
print(parse("abc"))`,
        expect: "尝试解析完毕\n42\n尝试解析完毕\n不是数字",
        note: "观察 finally 在 return 之前还是之后执行——答案：return 生效前。",
      },
      {
        id: "5.2", title: "异常对象与 raise",
        doc: "https://docs.python.org/zh-cn/3.14/tutorial/errors.html#raising-exceptions",
        points: [
          "except X as e 拿到异常对象：e.args 是构造参数",
          "raise 异常类型(\"消息\") 主动抛出；except 块里写裸 raise 是原样重抛",
          "raise 新异常 from e 形成异常链，保留底层原因",
        ],
        code: String.raw`def set_age(age):
    if age < 0:
        raise ValueError(f"年龄不能为负：{age}")
    return age

try:
    set_age(-1)
except ValueError as e:
    print("捕获：", e)`,
        expect: "捕获： 年龄不能为负：-1",
        note: "业务代码里用 raise 拒绝非法数据，比默默返回错误值好。",
      },
      {
        id: "5.3", title: "常见内置异常速查",
        doc: "https://docs.python.org/zh-cn/3.14/library/exceptions.html",
        points: [
          "TypeError 类型不对 / ValueError 值不对 / KeyError 键不存在 / IndexError 下标越界",
          "AttributeError 属性不存在 / NameError 名字未定义 / UnboundLocalError 缺 global",
          "⭐ KeyboardInterrupt 和 SystemExit 不是 Exception 的子类——except Exception 不会误吞 Ctrl+C",
          "完整速查表见指南 §5.5 与附录 B 报错自查",
        ],
        code: String.raw`errs = []
for action in ("type", "key", "index"):
    try:
        if action == "type":
            "1" + 1
        elif action == "key":
            {}["x"]
        else:
            [][0]
    except Exception as e:
        errs.append(type(e).__name__)
print(errs)`,
        expect: "['TypeError', 'KeyError', 'IndexError']",
        note: "报错博物馆（导航栏）里可以玩交互式猜错因。",
      },
      {
        id: "5.4", title: "自定义异常",
        doc: "https://docs.python.org/zh-cn/3.14/tutorial/errors.html#user-defined-exceptions",
        points: [
          "继承 Exception；通常只要类名 + docstring，不必重写 __init__",
          "项目里常集中放在一个 exceptions.py 中",
        ],
        code: String.raw`class AppError(Exception):
    """应用异常基类。"""

def check(x):
    if x < 0:
        raise AppError("不能为负")
    return x

try:
    check(-5)
except AppError as e:
    print("抓到自定义异常：", e)`,
        expect: "抓到自定义异常： 不能为负",
        note: "需要附加信息时再写 __init__ 并调 super().__init__（指南 §5.6）。",
      },
      {
        id: "5.5", title: "assert 断言",
        doc: "https://docs.python.org/zh-cn/3.14/reference/simple_stmts.html#the-assert-statement",
        points: [
          "assert 条件, \"消息\"——条件不成立抛 AssertionError",
          "⭐ assert 是调试工具：python -O 运行时会被整体移除",
          "⭐ 所以绝不能用它校验用户输入或做安全检查（该用 if + raise）",
        ],
        code: String.raw`def sqrt(x):
    assert x >= 0, "x 必须非负"
    return x ** 0.5

print(sqrt(16))
try:
    sqrt(-1)
except AssertionError as e:
    print("断言失败：", e)`,
        expect: "4.0\n断言失败： x 必须非负",
        note: "测试代码里大量使用 assert（指南 §18.4 pytest）。",
      },
      {
        id: "5.6", title: "最佳实践：EAFP 风格",
        doc: "https://docs.python.org/zh-cn/3.14/tutorial/errors.html",
        points: [
          "EAFP：先做了再说、出错再处理——Python 的地道风格",
          "很多场景有更简洁的等价写法（如 d.get 代替 try/except KeyError）",
          "🔶 异常组 ExceptionGroup 与 except* 是 3.11+ 的进阶内容（指南 §5.8），第一遍跳过",
        ],
        code: String.raw`d = {"a": 1}

# EAFP 风格
try:
    v = d["b"]
except KeyError:
    v = "默认"
print(v)

# 更简洁的等价写法
print(d.get("b", "默认"))`,
        expect: "默认\n默认",
        note: "两种写法都对，简单场景优先 d.get。",
      },
    ],
    quiz: [
      { q: "except 块里的 else 子句什么时候执行？",
        options: ["try 块顺利跑完（没出异常）时", "出异常时", "finally 之后总是执行", "从不执行"], answer: 0,
        explain: "else 只在没出异常时执行。" },
      { q: "一个 except 捕获多种异常的正确写法是？",
        options: ["except (KeyError, IndexError):", "except KeyError, IndexError:", "except KeyError or IndexError:", "except [KeyError, IndexError]:"], answer: 0,
        explain: "用元组；3.14+ 不带 as 时才可省略括号。" },
      { q: "为什么不能写 assert 校验用户输入？",
        options: ["python -O 运行时 assert 会被移除", "assert 太慢", "assert 不能带消息", "assert 只能用于数字"], answer: 0,
        explain: "assert 是调试工具，-O 模式被移除，校验要用 if + raise。" },
    ],
  },
  {
    id: 6,
    title: "第六层 · 模块与包",
    minutes: 45,
    goal: "会导入模块、理解包的结构与 __main__ 守卫",
    prereq: "第一~五层",
    versions: "3.8—3.14",
    checked: "2026-09",
    sections: [
      {
        id: "6.1", title: "import 机制",
        doc: "https://docs.python.org/zh-cn/3.14/tutorial/modules.html",
        points: [
          "模块就是一个 .py 文件；⭐ 首次导入会从头到尾执行一遍并缓存，重复导入不重跑",
          "三种形态：import 模块 / from 模块 import 名字 / as 起别名",
          "⭐ from x import * 慎用：名字来源不明、容易互相覆盖",
          "循环导入（a 导 b、b 导 a）容易报错——把共用部分抽到第三个模块",
        ],
        code: String.raw`import math
from random import randint
import json as js

print(math.pi)
print(js.dumps({"a": 1}))
print(randint(1, 3) in [1, 2, 3])`,
        note: "js.dumps 里中文默认转义，加 ensure_ascii=False 可显示中文（指南 §18.7）。",
      },
      {
        id: "6.2", title: "__main__ 守卫",
        doc: "https://docs.python.org/zh-cn/3.14/tutorial/modules.html#executing-modules-as-scripts",
        points: [
          "__name__ 在<b>直接运行</b>时是 \"__main__\"，被导入时是模块名 ⭐",
          "把脚本逻辑放进 main() 再用守卫调用：既可直接运行，又可被安全导入复用",
        ],
        code: String.raw`def main():
    print("只有直接运行时才看到我")

if __name__ == "__main__":
    main()

print("__name__ =", __name__)`,
        note: "在这里运行（相当于直接运行），所以 main() 会执行；若被导入则不会。",
      },
      {
        id: "6.3", title: "包与相对导入",
        doc: "https://docs.python.org/zh-cn/3.14/tutorial/modules.html#packages",
        points: [
          "常规包 = 含 __init__.py 的目录；命名空间包（3.3+）可以没有它",
          "相对导入 from . import x 只在包内有效 ⭐",
          "⭐ 直接 python 包内文件.py 会报相对导入错误——正确姿势是 python -m 包.模块",
        ],
        code: String.raw`# 目录结构示例：
# myproject/
# ├── main.py
# └── tools/
#     ├── __init__.py
#     ├── io.py
#     └── net.py
#
# tools/net.py 内部：from . import io   （相对导入，只在包内有效）
# 运行姿势（项目根目录）：python -m tools.net
print("包的结构见上方注释（需要真实目录才能运行）")`,
        note: "新手阶段先用常规包（带 __init__.py），结构明确。",
      },
      {
        id: "6.4", title: "标准库速览",
        doc: "https://docs.python.org/zh-cn/3.14/library/index.html",
        points: [
          "Python 自带电池：math / random / datetime / json / re / os / sys",
          "collections（Counter、defaultdict、deque）、itertools、pathlib 都极常用",
          "原则：先用标准库，不够再装第三方（指南 §18.2）",
        ],
        code: String.raw`import random, math, json
from datetime import date
from collections import Counter

print(random.choice(["石头", "剪刀", "布"]) in ["石头", "剪刀", "布"])
print(math.gcd(12, 18))
print(date.today().year >= 2026)
print(Counter("aabbc"))
print(json.loads('{"x": 1}'))`,
        note: "Counter 一行完成第 4 天的字符统计任务。",
      },
      {
        id: "6.5", title: "from __future__（了解）",
        doc: "https://docs.python.org/zh-cn/3.14/library/__future__.html",
        points: [
          "「未来特性开关」，必须放在文件最顶部（docstring 之后）",
          "最常见的是 from __future__ import annotations（旧版本注解延迟求值）",
          "⭐ 3.14 起注解默认就是延迟求值，这行已不再需要（指南 §13.1）",
        ],
        code: String.raw`# from __future__ import annotations   # 必须在文件最顶部（此处仅示意）
# 作用（3.7—3.13）：注解延迟求值，前向引用不用加引号
# 3.14 起：默认行为已改变，无需再写
print("了解即可")`,
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
  },
  {
    id: 8,
    title: "第八层 · 文件读写",
    minutes: 45,
    goal: "会安全地读写文件：with + encoding + 块内读完三件套",
    prereq: "第一~六层",
    versions: "3.8—3.14",
    checked: "2026-09",
    sections: [
      {
        id: "8.1", title: "open 与 with 三件套",
        doc: "https://docs.python.org/zh-cn/3.14/tutorial/inputoutput.html#reading-and-writing-files",
        points: [
          "⭐⭐ 三件套：用 with、写 encoding=\"utf-8\"、在 with 块内完成读写",
          "模式：r 读 / w 清空写 ⭐ / a 追加 / x 排他创建 / b 二进制 / + 读写",
          "读取三粒度：read() 全读、readline() 一行、for line in f 逐行迭代（推荐，省内存）",
          "⭐ write 不会自动加换行；逐行读出的行尾有 \\n，用 rstrip(\"\\n\") 去掉",
        ],
        code: String.raw`with open("demo.txt", "w", encoding="utf-8") as f:
    f.write("第一行\n第二行\n")

with open("demo.txt", encoding="utf-8") as f:
    for line in f:
        print(line.rstrip("\n"))`,
        expect: "第一行\n第二行",
        note: "忘写 encoding 是中文环境乱码/报错的头号原因。",
      },
      {
        id: "8.2", title: "pathlib（现代推荐）",
        doc: "https://docs.python.org/zh-cn/3.14/library/pathlib.html",
        points: [
          "用 / 拼路径，跨平台；read_text / write_text 一行读写",
          "mkdir(parents=True, exist_ok=True)：递归建目录且已存在不报错 ⭐",
          "glob / rglob 找文件；name / stem / suffix / parent 拆路径",
        ],
        code: String.raw`from pathlib import Path

p = Path("demo2.txt")
p.write_text("你好", encoding="utf-8")
print(p.read_text(encoding="utf-8"))
print(p.name, p.stem, p.suffix)
print(p.exists())`,
        expect: "你好\ndemo2.txt demo2 .txt\nTrue",
        note: "新项目优先 pathlib，比 os.path 字符串拼接直观。",
      },
      {
        id: "8.3", title: "多上下文管理器",
        doc: "https://docs.python.org/zh-cn/3.14/reference/compound_stmts.html#the-with-statement",
        points: [
          "一个 with 管多个资源：with A() as a, B() as b:",
          "典型场景：读一个文件、同时写另一个文件",
          "3.10+ 可用括号把多个资源换行书写，更清晰",
        ],
        code: String.raw`with open("in.txt", "w", encoding="utf-8") as f:
    f.write("数据")

with open("in.txt", encoding="utf-8") as fin, open("out.txt", "w", encoding="utf-8") as fout:
    fout.write(fin.read())

with open("out.txt", encoding="utf-8") as f:
    print(f.read())`,
        expect: "数据",
        note: "多个资源按顺序进入、逆序关闭。",
      },
      {
        id: "8.4", title: "文件与目录的其他操作",
        doc: "https://docs.python.org/zh-cn/3.14/library/shutil.html",
        points: [
          "os.remove 删文件、os.rename 重命名；shutil.copy / move 复制移动",
          "⭐⭐ shutil.rmtree 删除整个目录树且不可恢复——用前三思",
          "pathlib 版：Path.unlink(missing_ok=True)（3.8+）、Path.rename()",
        ],
        code: String.raw`import os, shutil

with open("a.txt", "w", encoding="utf-8") as f:
    f.write("x")
shutil.copy("a.txt", "b.txt")
os.rename("b.txt", "c.txt")
print(os.path.exists("c.txt"))

os.remove("a.txt")
os.remove("c.txt")
print(os.path.exists("a.txt"), os.path.exists("c.txt"))`,
        expect: "True\nFalse False",
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
  },
];
