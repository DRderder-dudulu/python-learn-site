/* ===== 课程内容数据 · 第一层 =====
 * 内容来源：《Python 3 语法完全指南》（outputs/python-syntax-guide.md）第一层 · 基础语法。
 * 写法规范：section.id 即指南小节号；points 为分条要点（内联 <code>/<b>）；
 * 【对应规范】points 每条要点必须在 code 中有明确对应：可演示的写成可运行代码并配注释；
 * 错误/危险示范以「故意注释掉」的形式呈现（学员可取消注释亲测报错）；
 * code 示例均经本地 Python 实际运行验证（tools/verify_examples.py + verify_expects.py）；expect 为真实输出。
 * 适用版本：3.8—3.14 ｜ 最后核对：2026-10
 */
COURSE.push({
  id: 1,
  title: "第一层 · 基础语法",
  minutes: 60,
  goal: "掌握注释、变量、数字、字符串、输入输出与运算符，写出第一个程序",
  prereq: "无（零基础起点）",
  versions: "3.8—3.14",
  checked: "2026-10",
  sections: [
    {
      id: "1.1", title: "注释与文档字符串",
      what: "注释是写给人看的说明，解释器会直接跳过；放在函数、类开头的说明字符串叫 docstring，help() 读的就是它。",
      use: "写给人看的说明。代码稍一复杂，就要靠注释说清「为什么这样写」；docstring 写好了，help() 和编辑器才能给你提示。",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/introduction.html",
      points: [
        "<code>#</code> 开头到行尾是注释，解释器完全忽略",
        "Python 没有 /* */ 块注释，多行说明就每行写一个 #",
        "三引号字符串单独放置<b>不是</b>注释，只是一个没被使用的字符串对象",
        "函数/类/模块的<b>第一条语句</b>是字符串时才是文档字符串（docstring），help() 能读到",
      ],
      code: String.raw`# 这是单行注释：# 开头到行尾，解释器完全忽略
# Python 没有 /* */ 块注释，
# 多行说明就每行写一个 #。
age = 18  # 行尾注释也很常用

"""单独放置的三引号字符串【不是】注释——
它只是创建了一个没人使用的字符串对象，解释器会路过它，什么也不输出"""

def add(a, b):
    """计算两个数的和（这才是文档字符串 docstring：函数第一条语句是字符串）。"""
    return a + b

print(add(2, 3))
print(add.__doc__)   # help() 读到的就是它`,
      expect: "5\n计算两个数的和（这才是文档字符串 docstring：函数第一条语句是字符串）。",
      note: "试着把 add.__doc__ 改成 print(add(10, 20))。",
    },
    {
      id: "1.2", title: "标识符与关键字",
      what: "标识符是你自己起的名字（变量名、函数名）；关键字是 Python 预留的词（if、for 这些），不能拿来当名字用。",
      use: "给变量、函数起名字的规则。起名报错，或是不小心盖住 list、str 这类内置功能时，回这节查。",
      doc: "https://docs.python.org/zh-cn/3.14/reference/lexical_analysis.html#identifiers",
      points: [
        "标识符 = 字母/数字/下划线，不能以数字开头，区分大小写；中文也合法（团队项目不推荐）",
        "3.14 共 35 个关键字（class、for、if……），不能当变量名",
        "软关键字 match、case、_、type(3.12+)：只在特定语法位置特殊，其它地方可作变量名",
        "⭐ 别把变量起名为 list、str、id——会遮蔽内置功能",
      ],
      code: String.raw`import keyword
print(len(keyword.kwlist), "个关键字")   # 3.14 共 35 个关键字，不能当变量名

name = "小明"        # 中文变量名合法（团队项目不推荐）
user_name = "Tom"    # 标识符 = 字母/数字/下划线，不能以数字开头，区分大小写
print(name, user_name)

match = "比赛"       # 软关键字 match / case 只在特定语法位置特殊，平时可作变量名
print(match)

# list = [1, 2]      # ⭐ 错误示范（故意注释掉）：遮蔽内置 list，之后 list("abc") 就会报错`,
      expect: "35 个关键字\n小明 Tom\n比赛",
      note: "keyword.kwlist 可以打印出全部关键字清单。",
    },
    {
      id: "1.3", title: "缩进与代码块",
      what: "Python 不用大括号，靠行首的空格（缩进）划分「哪些行属于谁」；冒号后面缩进的那几行，就是一个代码块。",
      use: "写 if、for、def 都靠缩进划地盘。看到 IndentationError，或代码执行的时机跟想的不一样，多半错在缩进。",
      doc: "https://docs.python.org/zh-cn/3.14/reference/lexical_analysis.html#indentation",
      points: [
        "Python 用<b>缩进</b>表示层级：每级 4 个空格，同一代码块内必须完全一致",
        "冒号 : 宣告一个代码块开始（if / for / def / class 等后面）",
        "混用 Tab 和空格会报 TabError——编辑器里统一设成 4 空格",
        "括号 () [] {} 内可以自由换行，这是长行的推荐写法",
      ],
      code: String.raw`score = 85
if score >= 60:          # 冒号 : 宣告一个代码块开始
    print("及格")        # 缩进 4 格，属于 if 的代码块
    print("继续加油")    # 同样缩进，也属于这个代码块
print("这行总会执行")    # 没有缩进，不属于 if

total = (1 + 2           # 括号 () [] {} 内可以自由换行，长行推荐这样写
         + 3 + 4)
print(total)

# if score >= 60:
# \tprint("Tab 缩进")    # ⭐ 错误示范（故意注释掉）：Tab 与空格混用会报 TabError`,
      expect: "及格\n继续加油\n这行总会执行\n10",
      note: "把第二行 print 的缩进删掉再运行，看会发生什么错误。",
    },
    {
      id: "1.4", title: "变量与赋值",
      what: "变量就是给数据贴的名字：用 = 把值存进这个名字，以后喊一声名字，就能把数据取出来。",
      use: "要记住用户输入或中间结果时，就赋值给变量——几乎每一行程序都在用它。",
      doc: "https://docs.python.org/zh-cn/3.14/reference/simple_stmts.html#assignment-statements",
      points: [
        "变量是<b>贴在对象上的标签</b>，不是装值的盒子——理解这点后面少踩一半坑",
        "动态类型：同一个名字可以随时改贴到别的类型",
        "链式 a = b = 0、解包 x, y = 1, 2、一行交换 x, y = y, x",
        "type() 看类型、id() 看身份、isinstance() 做类型判断",
      ],
      code: String.raw`x = 10
y = x            # y 贴到同一个 10 上（变量是标签，不是装值的盒子）
x = 20           # x 改贴到 20，y 不动
print(y)
x = "二十"       # 动态类型：同一个名字随时可以改贴到别的类型
print(x)

a = b = 0        # 链式赋值
m, n = 1, 2      # 解包赋值
m, n = n, m      # 一行交换
print(m, n, a, b)

print(id(y) == id(10))          # id() 看身份：y 还贴在对象 10 上
print(type(m))                  # type() 看类型
print(isinstance(m, int))       # isinstance() 做类型判断`,
      expect: "10\n二十\n2 1 0 0\nTrue\n<class 'int'>\nTrue",
      note: "先猜 y 是 10 还是 20，再运行验证。",
    },
    {
      id: "1.5", title: "数字与取整",
      what: "数字分整数（int）和小数（float）；除了加减乘除，还有整除 //、取余 %，取整用 round，不过它的规则是「逢五取偶」。",
      use: "算账、计数、算平均分都离不开数字运算。碰到取整、除法结果跟直觉不一样时，先回这节对答案。",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#numeric-types-int-float-complex",
      points: [
        "int 任意精度不会溢出；float 是双精度，0.1 + 0.2 ≠ 0.3（用 math.isclose 比较）⭐",
        "/ 恒得 float；// 向负无穷取整（-7 // 2 == -4）⭐；% 符号跟随除数；** 是幂",
        "取整四组：int/trunc 向零、floor 向负无穷、ceil 向正无穷、round 逢五取偶",
        "⭐ round(2.5) 是 2 不是 3（银行家舍入）",
      ],
      code: String.raw`import math
print(10 ** 20)                                  # int 任意精度：再大的整数也不会溢出
print(0.1 + 0.2 == 0.3, math.isclose(0.1 + 0.2, 0.3))  # ⭐ float 有误差，比较用 isclose
print(7 / 2, 7 // 2, -7 // 2)                    # / 恒得 float；// 向负无穷取整 ⭐
print(7 % 2, -7 % 2)                             # % 符号跟随除数：-7 % 2 得 1
print(2 ** 10)                                   # ** 是幂
print(int(2.9), math.trunc(-2.9))                # int / trunc：向零取整
print(math.floor(-2.3), math.ceil(-2.3))         # floor 向负无穷、ceil 向正无穷
print(round(2.5), round(3.5))                    # ⭐ round 逢五取偶（银行家舍入）`,
      expect: "100000000000000000000\nFalse True\n3.5 3 -4\n1 1\n1024\n2 -2\n-3 -2\n2 4",
      note: "重点观察 -7 // 2 和 round(2.5) 的结果。",
    },
    {
      id: "1.6", title: "字符串与转义",
      what: "字符串就是一段文字，用引号包起来；想在文字里放引号、换行这类特殊字符，要靠 \\ 转义，或者干脆用原始字符串。",
      use: "处理文字的基本功：拼接、查找、改写。想在字符串里放引号、换行或 Windows 路径时，转义和原始字符串能救场。",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#text-sequence-type-str",
      points: [
        "单/双/三引号等价；字符串<b>不可变</b>，所有方法都返回新串 ⭐",
        "常用转义：\\n 换行、\\t 制表、\\\\ 反斜杠、\\r 回行首",
        "r\"...\" 原始字符串：反斜杠不转义，写 Windows 路径和正则必备 ⭐",
        "f-string：{表达式} 嵌值、{x:.2f} 两位小数、{x=} 连名带值打印（3.8+）",
      ],
      code: String.raw`print('ab' == "ab" == """ab""")   # 单/双/三引号完全等价
name = "小明"
print(f"你好，{name}")              # f-string：{表达式} 嵌值
pi = 3.14159
print(f"{pi:.2f}")                  # :.2f 保留两位小数
print(f"{name=}")                   # {x=} 连名带值打印（3.8+）
print("a\tb")                       # \t 制表符（\r 回行首在终端才看得出效果）
print("C:\\new\\test")              # \\ 才是字面反斜杠
print(r"C:\new\test")               # ⭐ r"..." 原始字符串：反斜杠不转义（路径/正则必备）
print("第一行\n第二行")              # \n 换行
s = "hello"
s = s.upper()                       # ⭐ 字符串不可变：方法返回新串，接住才算数
print(s)`,
      expect: "True\n你好，小明\n3.14\nname='小明'\na\tb\nC:\\new\\test\nC:\\new\\test\n第一行\n第二行\nHELLO",
      note: "把 f-string 前面的 f 去掉再运行，看输出差别。",
    },
    {
      id: "1.7", title: "布尔、None 与假值",
      what: "布尔值只有 True 和 False 两个，表示「是」和「否」；None 表示「什么都没有」。0、空字符串在判断里也算「否」，叫假值。",
      use: "写 if 判断、检查用户有没有填内容时，天天都要跟它们打交道。",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#truth-value-testing",
      points: [
        "假值：False、None、0、0.0、空字符串、空列表/字典/集合——<b>其余全为真</b>（含 \"0\"、[0]）⭐",
        "判断空容器用 if not x:；判断 None 用 is None ⭐（不用 ==）",
        "and/or 返回<b>操作数</b>而不是布尔值：x or 默认值 是兜底惯用法",
        "短路求值：左边能定结果，右边就不执行",
      ],
      code: String.raw`print(bool(""), bool("0"), bool([]), bool([0]))  # ⭐ 假值就那几样："0" 和 [0] 反而是真
names = []
if not names:                # 判断空容器用 if not x:
    print("名单是空的")
print(None is None)          # ⭐ 判断 None 用 is None，不用 ==
name = ""
print(name or "匿名")        # or 返回【操作数】：左边假就取右边——兜底惯用法
print("甲" and "乙")         # and 同样返回操作数：左边真就取右边
print(0 and 1 / 0)           # 短路求值：左边已能定结果，右边不执行（所以没报错）`,
      expect: "False True False True\n名单是空的\nTrue\n匿名\n乙\n0",
      note: '为什么 bool("0") 是 True？非空字符串就是真，与内容无关。',
    },
    {
      id: "1.8", title: "输入与输出",
      what: "print 把内容显示到屏幕上；input 停下来等你打字，再把你输入的内容交给程序。",
      use: "做任何命令行小工具都离不开这两个——一个负责听，一个负责说。",
      doc: "https://docs.python.org/zh-cn/3.14/library/functions.html#print",
      points: [
        "print：sep 改分隔符、end 改结尾、flush 立即显示",
        "input() 返回值<b>永远是字符串</b> ⭐，要数字必须 int() 转换",
        "绝对不要用 eval(input())——严重安全漏洞",
        "input 在网页环境里不可用，本站示例以 print 演示；终端写法见注释",
      ],
      code: String.raw`print("a", "b", "c", sep="-")   # sep 改分隔符
print("不换行", end="")             # end 改结尾（默认是换行）
print("接着写")
# print("立即显示", flush=True)     # flush 立即显示（网页里感知不到，故意注释掉）

# 终端里的标准输入写法（input 在网页环境不可用，故意注释掉）：
# age = int(input("年龄："))        # ⭐ input() 返回的永远是字符串，要数字必须 int() 转换
# value = eval(input())             # ❌ 绝对不要这么写：严重安全漏洞
age = 18
print(f"明年 {age + 1} 岁")`,
      expect: "a-b-c\n不换行接着写\n明年 19 岁",
      note: "在自己电脑上试 input 时，记得 int() 转换。",
    },
    {
      id: "1.9", title: "运算符与优先级",
      what: "运算符是做计算和比较的符号（+、==、and 这些）；优先级决定一个式子里先算哪一步，拿不准就加括号。",
      use: "加减乘除之外，还有整除、取余、比较和逻辑运算。表达式算出来跟预期不符时，多半是优先级没想清楚。",
      doc: "https://docs.python.org/zh-cn/3.14/reference/expressions.html#operator-precedence",
      points: [
        "== 比<b>值</b>，is 比<b>身份</b>——is 只用于 None/True/False/哨兵对象 ⭐⭐",
        "in 成员检查；支持链式比较 1 < x <= 5",
        "优先级大致：下标/调用 > ** > 乘除 > 加减 > 比较 > not > and > or",
        "拿不准就加括号；-1**2 == -1（** 比左边的负号先算）",
      ],
      code: String.raw`a = [1, 2]
b = [1, 2]
print(a == b, a is b)   # ⭐ == 比值、is 比身份：值相等但不是同一对象（is 只用于 None/True/False/哨兵）
print(2 in a)           # in 成员检查
print(1 < 2 <= 2)       # 链式比较
print(-1 ** 2)          # ** 比左边的负号先算：等价于 -(1 ** 2)
print(True or False and False)    # 优先级：and 比 or 先算，所以整体是 True
print((True or False) and False)  # 拿不准就加括号，语义立刻清楚`,
      expect: "True False\nTrue\nTrue\n-1\nTrue\nFalse",
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
});
