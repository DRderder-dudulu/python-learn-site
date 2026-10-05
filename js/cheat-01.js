/* ===== 速查·第一层 · 基础语法（§1.1—§1.9） =====
 * 内容来源：《Python 3 语法完全指南》第一层（outputs/python-syntax-guide-v1.md），1:1 对齐小节；
 * 示例与课程 §1.x 一致或取自指南，均可运行（tools/verify_examples.py 实跑验证）。
 * 适用版本：3.8—3.14 ｜ 语言规则以 Python 官方文档为准。
 */
CHEATSHEET_ADV.push({
  layerId: 1,
  layer: "第一层 · 基础语法",
  stage: "一",
  topics: [
    {
      id: "1_1", title: "§1.1 注释与文档字符串", desc: "# 单行注释、每行一个 # 的多行惯例、三引号伪注释、docstring 与 help()",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/introduction.html",
      html: `<ul>
<li><code>#</code> 开头到本行结尾是注释，解释器完全忽略；代码和行尾注释之间建议空两格</li>
<li>Python <b>没有</b> /* ... */ 块注释；多行说明的惯例是每行写一个 <code>#</code></li>
<li>三引号字符串单独放一条语句<b>不是</b>真注释——它本质上是一个没被使用的字符串对象（了解即可）</li>
<li>⭐ <b>文档字符串（docstring）</b>：模块 / 类 / 函数体的<b>第一条语句</b>是字符串字面量时才是 docstring，存入 <code>__doc__</code>，能被 <code>help()</code> 和 IDE 读取；写在其它位置的三引号字符串只是普通语句</li></ul>`,
      code: String.raw`# 这是单行注释
age = 18  # 行尾注释

def add(a, b):
    """计算两个数的和（这是文档字符串）。"""
    return a + b

print(add(2, 3))
print(add.__doc__)`,
    },
    {
      id: "1_2", title: "§1.2 标识符与关键字", desc: "命名规则、35 个关键字、4 个软关键字、内置名遮蔽、PEP 8 命名规范",
      doc: "https://docs.python.org/zh-cn/3.14/reference/lexical_analysis.html#identifiers",
      html: `<ul>
<li>标识符由<b>字母、数字、下划线</b>组成，<b>不能以数字开头</b>；"字母"是 Unicode 字母，中文也能当变量名（团队项目不推荐）</li>
<li><b>区分大小写</b>：<code>age</code> 与 <code>Age</code> 是两个名字；解释器按 NFKC 规范化处理（知道即可）</li>
<li>用 <code>"名字".isidentifier()</code> 检测字符串是否是合法标识符</li>
<li><b>关键字</b>（3.14 共 35 个）不能当名字：False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield</li>
<li><b>软关键字</b>（4 个）只在特定语法位置特殊：<code>match</code>、<code>case</code>、<code>_</code>（仅在 match 模式里）、<code>type</code>（3.12+，仅在类型别名语句中）；其它位置可当普通变量名</li>
<li>⭐ <b>内置名不是关键字</b>：<code>print</code>/<code>len</code>/<code>list</code>/<code>str</code> 语法上可被赋值覆盖，但覆盖后原功能失效——千万别把变量起名为 <code>list</code>、<code>str</code>、<code>id</code></li></ul>
<table><tr><th>种类</th><th>风格（PEP 8）</th><th>示例</th></tr>
<tr><td>变量、函数</td><td>蛇形小写</td><td><code>user_name</code>、<code>get_price()</code></td></tr>
<tr><td>类</td><td>大驼峰</td><td><code>UserAccount</code></td></tr>
<tr><td>常量</td><td>全大写</td><td><code>MAX_RETRY = 3</code></td></tr>
<tr><td>模块/包</td><td>全小写短名</td><td><code>utils.py</code>、<code>json</code></td></tr></table>`,
      code: String.raw`print("abc".isidentifier(), "2abc".isidentifier())   # True False

user_name = "Tom"      # 推荐：蛇形命名（小写+下划线）
name = "小明"          # 中文变量名合法，但不推荐
# 2name = "x"        # ❌ SyntaxError：数字开头
print(user_name, name)

match = 5              # ✅ match 是软关键字，这里只是普通变量
print(match)

import keyword
print(keyword.iskeyword("class"), keyword.iskeyword("match"))  # True False`,
    },
    {
      id: "1_3", title: "§1.3 缩进与代码块", desc: "4 空格缩进、冒号宣告代码块、TabError、括号内自由续行、行尾反斜杠、分号",
      doc: "https://docs.python.org/zh-cn/3.14/reference/lexical_analysis.html#indentation",
      html: `<ul>
<li>⭐ Python 用<b>缩进</b>（行首空白）表示从属关系，不用 {} ——新手第一个坎</li>
<li>标准做法：<b>每级 4 个空格</b>（编辑器按 Tab 通常自动转 4 空格）</li>
<li><b>同一代码块内缩进量必须完全一致</b>；混用 Tab 和空格会报 <code>TabError</code></li>
<li>冒号 <code>:</code> 宣告"接下来是一个代码块"（if、for、def、class 等后面）</li>
<li><b>续行方法 1（推荐）</b>：括号 / 方括号 / 花括号内可以自由换行</li>
<li><b>续行方法 2（不推荐）</b>：行尾加反斜杠 <code>\\</code>——容易因行尾多一个空格而出错</li>
<li>一行多条简单语句可用 <code>;</code> 分隔（不推荐）：<code>a = 1; b = 2</code></li></ul>`,
      code: String.raw`age = 20
if age >= 18:
    print("成年了")      # ← 缩进 4 格，属于 if 的代码块
    print("可以考驾照")  # ← 同样缩进，也属于这个代码块
print("这行总会执行")    # ← 没有缩进，不属于 if

# 括号内可以自由换行（推荐的续行方式）
total = (1 + 2 + 3
         + 4 + 5 + 6)
names = [
    "张三",
    "李四",
]
print(total, names)`,
    },
    {
      id: "1_4", title: "§1.4 变量与赋值", desc: "变量是贴在对象上的标签、动态类型、链式/多重/增量赋值、海象运算符 :=、type/id/isinstance",
      doc: "https://docs.python.org/zh-cn/3.14/reference/simple_stmts.html#assignment-statements",
      html: `<ul>
<li>⭐ Python 变量<b>不是装值的盒子</b>，而是<b>贴在对象上的标签</b>：<code>x = 10</code> 是创建整数对象 10 再把名字 x 贴上去；<code>y = x</code> 让 y 贴到<b>同一个对象</b>（不是复制）；x 改贴新对象不影响 y</li>
<li><b>动态类型</b>：同一个名字可随时改贴到不同类型的对象上（<code>x = 10</code> 后 <code>x = "你好"</code> 完全合法）</li>
<li>赋值形式：基本 <code>a = 1</code>｜链式 <code>a = b = c = 0</code>（贴同一对象）｜多重 <code>x, y = 1, 2</code>（本质是元组解包）｜⭐ 一行交换 <code>x, y = y, x</code>｜增量 <code>+=  -=  *=  /=  //=  %=  **=</code> 等｜带类型注解 <code>name: str = "Tom"</code>（注解不影响运行，见第 13 层）</li>
<li><b>海象运算符 :=（3.8+）</b>：在表达式内部赋值，既能赋值又能立刻用值，如 <code>if (n := len(s)) > 3:</code></li>
<li>查看对象：<code>type(x)</code> 类型｜<code>id(x)</code> 内存身份（唯一标识）｜<code>isinstance(x, list)</code> 类型判断（推荐，支持继承）</li></ul>`,
      code: String.raw`x = 10        # 把名字 x 贴到整数对象 10 上
y = x         # y 也贴到同一个对象上（不是复制！）
x = 20        # x 改贴到新对象 20，y 还贴在 10 上
print(y)      # 10

a = b = c = 0            # 链式赋值
x, y = 1, 2              # 多重赋值（元组解包）
x, y = y, x              # ⭐ 一行交换
print(x, y, a, b, c)

n = 0
n += 1                   # 增量赋值
print(n)

# 海象运算符 :=（3.8+）：判断的同时完成赋值
data = "hello"
if (length := len(data)) > 3:
    print("长度是", length)

print(type(data))               # <class 'str'>
print(isinstance(data, str))    # True`,
    },
    {
      id: "1_5", title: "§1.5 数字类型与取整专题", desc: "int/float/complex/bool、四种进制、浮点精度坑、向零/向下/向上/银行家四组取整对比",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#numeric-types-int-float-complex",
      html: `<ul>
<li><code>int</code> 整数：<b>任意精度</b>，不会溢出｜<code>float</code>：IEEE 754 双精度，约 15~17 位有效数字｜<code>complex</code>：<code>3 + 4j</code>｜<code>bool</code>：int 子类，True == 1</li>
<li>整数字面量：<code>0b1010</code> 二进制、<code>0o17</code> 八进制、<code>0xff</code> 十六进制；<code>1_000_000</code> 下划线只是视觉分隔</li>
<li>⭐ <b>浮点精度坑</b>：<code>0.1 + 0.2</code> 是 0.30000000000000004——<b>永远不要直接用 == 比较浮点数</b>；用 <code>math.isclose()</code>；要精确小数（金额）用 <code>Decimal("0.1")</code>（传字符串），要精确分数用 <code>Fraction(1, 3)</code></li>
<li>⭐ <b>取整四组</b>（按"往哪边取"记）：① 向零：<code>int(x)</code>、<code>math.trunc(x)</code>；② 向负无穷（地板）：<code>math.floor(x)</code>、整除 <code>//</code>、<code>divmod()</code>；③ 向正无穷（天花板）：<code>math.ceil(x)</code>；④ 四舍五入：<code>round(x)</code> 是<b>银行家舍入</b>（逢五取偶）——round(2.5) 是 2，round(3.5) 是 4；round(2.675, 2) 因二进制存储误差得 2.67</li>
<li>只想<b>显示</b>两位小数（不改值）用格式化：<code>f"{3.14159:.2f}"</code> → "3.14"</li></ul>
<table><tr><th>输入</th><th>int / trunc（向零）</th><th>floor / //（向负无穷）</th><th>ceil（向正无穷）</th><th>round（逢五取偶）</th></tr>
<tr><td>2.3</td><td>2</td><td>2</td><td>3</td><td>2</td></tr>
<tr><td>2.5</td><td>2</td><td>2</td><td>3</td><td><b>2</b> ⭐</td></tr>
<tr><td>-2.3</td><td><b>-2</b></td><td><b>-3</b> ⭐</td><td>-2</td><td>-2</td></tr>
<tr><td>-2.5</td><td>-2</td><td>-3</td><td>-2</td><td><b>-2</b> ⭐</td></tr></table>`,
      code: String.raw`import math
from decimal import Decimal
from fractions import Fraction

a = 42            # int：任意精度，不会溢出
b = 3.14          # float：IEEE 754 双精度
c = 3 + 4j        # complex 复数
d = True          # bool：int 的子类，True == 1
print(type(a).__name__, type(b).__name__, type(c).__name__, type(d).__name__)

print(0b1010, 0o17, 0xff, 1_000_000)   # 二/八/十六进制 + 下划线分隔

print(0.1 + 0.2)                        # 0.30000000000000004 ⭐
print(math.isclose(0.1 + 0.2, 0.3))     # True：比较浮点数的正确姿势
print(Decimal("0.1") + Decimal("0.2"))  # 0.3（传字符串，别把浮点误差带进去）
print(Fraction(1, 3) + Fraction(1, 6))  # 1/2

print(int(2.9), int(-2.9))              # 2 -2（向零砍）
print(math.floor(-2.3), -7 // 2)        # -3 -4（向负无穷）
print(divmod(-7, 2))                    # (-4, 1)：同时得商和余数
print(math.ceil(-2.3))                  # -2（向正无穷）
print(round(2.5), round(3.5))           # 2 4（银行家舍入，逢五取偶）⭐
print(round(2.675, 2))                  # 2.67（二进制存储误差）⭐`,
    },
    {
      id: "1_6", title: "§1.6 字符串与转义字符大全", desc: "四种引号、转义字符完整表、\\r 回车详解、r 原始字符串三细则、f-string 与版本差异、不可变",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#text-sequence-type-str",
      html: `<ul>
<li>四种引号等价：<code>'单'</code> <code>"双"</code> <code>"""三引号可跨行，换行保留"""</code> <code>'''也可'''</code>；引号里有引号就外层换另一种</li>
<li>⭐ <b>\\r 回车</b>：光标回到<b>本行行首</b>不换行，后续输出覆盖本行——经典用途是原地刷新的进度条（配合 <code>end=""</code>、<code>flush=True</code>）；\\n 才是换行</li>
<li>⭐ <b>原始字符串 r"..."</b>：反斜杠不再转义，所见即所得，写 Windows 路径和正则必用。三细则：① 不能以奇数个反斜杠结尾（<code>r"C:\\"</code> ❌）；② <code>r"\\""</code> 合法，反斜杠被保留在串里，只是顺带阻止字符串提前结束；③ 需要以反斜杠结尾时用 <code>"C:\\\\"</code>、<code>r"C:" + "\\\\"</code>、正斜杠或 pathlib（第八层）</li>
<li>未识别的转义（如 <code>\\d</code>）目前原样保留，但 3.12+ 给 <code>SyntaxWarning</code>——正则字符串务必加 <code>r</code> 前缀</li>
<li>前缀：<code>r</code> 原始、<code>b</code> 字节串（第九层）、<code>f</code> 格式化、<code>t</code> 模板（3.14+）、<code>u</code> 无效果仅兼容；可组合 fr/rf/br/rb 等，顺序大小写不限</li>
<li>⭐ <b>f-string</b>：<code>{表达式}</code> 运行时求值嵌入；<code>{x:.2f}</code> 两位小数、<code>{x:10.2f}</code> 宽度对齐、<code>{255:x}</code> 十六进制、<code>{0.85:.0%}</code> 百分比、<code>{1000000:,}</code> 千分位、<code>{x=}</code> 连名带值打印（3.8+ 调试神器）</li>
<li>f-string 版本差异：3.12 之前 {} 内不能用与外层相同的引号、不能含反斜杠；3.12+ 放宽（引号可复用、允许反斜杠、多行表达式可写注释）</li>
<li>⭐ <b>字符串不可变</b>：<code>s[0] = "H"</code> 报 TypeError；所有"修改"方法都<b>返回新串</b>——<code>s.upper()</code> 不接返回值等于白调（新手高频错误）</li></ul>
<table><tr><th>转义</th><th>含义</th><th>说明</th></tr>
<tr><td><code>\\\\</code></td><td>反斜杠本身</td><td>写一个 \\ 得写两个</td></tr>
<tr><td><code>\\'</code> <code>\\"</code></td><td>单/双引号</td><td>在同类引号串里放引号</td></tr>
<tr><td><code>\\n</code></td><td>换行 (LF)</td><td>最常用</td></tr>
<tr><td><code>\\r</code></td><td>回车 (CR)</td><td>回本行行首，不换行 ⭐</td></tr>
<tr><td><code>\\t</code></td><td>水平制表符</td><td>对齐</td></tr>
<tr><td><code>\\a</code> <code>\\b</code> <code>\\f</code> <code>\\v</code></td><td>响铃/退格/换页/垂直制表</td><td>很少用</td></tr>
<tr><td><code>\\ooo</code></td><td>八进制字符</td><td><code>'\\101'</code> 是 'A'（1~3 位）</td></tr>
<tr><td><code>\\xhh</code></td><td>十六进制字符</td><td><code>'\\x41'</code> 是 'A'（恰好 2 位）</td></tr>
<tr><td><code>\\uxxxx</code></td><td>16 位 Unicode</td><td><code>'\\u4e2d'</code> 是 '中'（恰好 4 位）</td></tr>
<tr><td><code>\\Uxxxxxxxx</code></td><td>32 位 Unicode</td><td><code>'\\U0001f40d'</code> 是 '🐍'（恰好 8 位）</td></tr>
<tr><td><code>\\N{名称}</code></td><td>Unicode 官方名称</td><td>⭐ 必须用官方字符名（英文大写），如 \\N{LATIN CAPITAL LETTER A}、\\N{CJK UNIFIED IDEOGRAPH-4E2D}；随手写中文名会 SyntaxError</td></tr>
<tr><td>行尾 <code>\\</code></td><td>续行</td><td>忽略这个换行，把下一行接上来</td></tr></table>`,
      code: String.raw`s1 = "双引号"
s2 = '单引号'          # 与双引号完全等价
s3 = """三引号
可以跨多行，换行会被保留"""
print(s1, s2)
print(s3)

print("C:\\new\\test")    # 转义写法：C:\new\test
print(r"C:\new\test")     # 原始字符串写法（推荐）⭐
print("\N{LATIN CAPITAL LETTER A}")       # A
print("\N{CJK UNIFIED IDEOGRAPH-4E2D}")   # 中（官方名称）

name = "小明"
age = 18
print(f"我叫{name}，今年{age}岁")
print(f"明年{age + 1}岁")        # {} 里可以写任意表达式
print(f"{age=}")                # age=18（3.8+：连名带值）
price = 3.14159
print(f"{price:.2f}")           # 3.14
print(f"{255:x}", f"{0.85:.0%}", f"{1000000:,}")   # ff 85% 1,000,000

s = "hello"
# s[0] = "H"        # ❌ TypeError：字符串不可变
s = "H" + s[1:]     # ✅ 拼出一个新字符串
print(s.upper())    # HELLO：方法返回新串，要接住`,
    },
    {
      id: "1_7", title: "§1.7 布尔、None 与假值清单", desc: "None 用 is 判断、假值完整清单、and/or 返回操作数、短路求值与兜底写法",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#truth-value-testing",
      html: `<ul>
<li><code>None</code> 表示"空/没有"，是 NoneType 的唯一实例；⭐ 判断用 <code>if x is None:</code>（不要用 ==）</li>
<li>⭐ <b>假值完整清单</b>：① <code>None</code>、<code>False</code>；② 任何数值的零：<code>0</code>、<code>0.0</code>、<code>0j</code>、<code>Decimal("0")</code>、<code>Fraction(0)</code>；③ 空序列与空容器：<code>""</code>、<code>[]</code>、<code>()</code>、<code>{}</code>、<code>set()</code>、<code>frozenset()</code>、<code>range(0)</code>；④ 定义了 <code>__bool__()</code> 返回 False 或 <code>__len__()</code> 返回 0 的对象</li>
<li>⭐ 其余一切皆为真值——包括 <code>"0"</code>、<code>"False"</code>、<code>[0]</code>、<code>[-1]</code>（非空就是真）</li>
<li>惯用：<code>if not name:</code> 判空串，不用写 == ""</li>
<li>⭐ <b>短路求值</b>：<code>and</code>/<code>or</code> 不返回 True/False，而是<b>返回决定结果的那个操作数</b>：<code>x or 默认值</code> 是兜底惯用法；<code>0 and 1/0</code> 右边根本不执行（不报错）</li></ul>`,
      code: String.raw`ok = True
done = False
result = None     # NoneType 的唯一实例
print(result is None)          # True：判断 None 用 is ⭐

print(bool("0"), bool([0]), bool([]))   # True True False ⭐

name = ""
if not name:                    # 惯用写法：判空不用 == ""
    print("名字不能为空")

print(0 or "默认值")      # 默认值：0 是假，返回右边 ⭐ 兜底写法
print(3 and "ok")         # ok：3 是真，返回右边
print(0 and 1 / 0)        # 0：右边根本不执行，不报错 ⭐
print("" or [] or "有值") # 有值：or 返回第一个真值`,
    },
    {
      id: "1_8", title: "§1.8 输入与输出", desc: "print 的 sep/end/flush/file 参数、input 永远返回字符串、EOFError、禁用 eval(input())",
      doc: "https://docs.python.org/zh-cn/3.14/library/functions.html#print",
      html: `<ul>
<li><b>print()</b> 常用参数：<code>sep="-"</code> 改分隔符（默认空格）｜<code>end=""</code> 改结尾（默认 "\\n"）｜<code>flush=True</code> 强制立刻输出不等缓冲｜<code>file=sys.stderr</code> 输出到标准错误流</li>
<li>⭐ <b>input()</b> 返回值<b>永远是字符串</b>，要数字必须 <code>int()</code> 自己转换（输入非数字会 ValueError）</li>
<li>用户按 Ctrl+Z 回车（Windows）或 Ctrl+D（macOS/Linux）抛 <code>EOFError</code>；Ctrl+C 抛 <code>KeyboardInterrupt</code></li>
<li>⭐ <b>绝对不要</b>用 <code>eval(input())</code> 把输入当代码执行——严重安全漏洞</li>
<li>稳妥读数字写法：<code>while True:</code> 循环 + <code>try: age = int(raw); break</code> + <code>except ValueError:</code> 提示重输（异常详见第五层）</li></ul>`,
      code: String.raw`print("a", "b", "c")              # a b c（默认空格分隔）
print("a", "b", sep="-")          # a-b
print("不换行", end="")           # 结尾不加换行
print("接着写")

# 终端里的输入写法（网页环境没有键盘输入，以注释展示）：
# age = int(input("请输入年龄："))   # int() 转换；输入非数字会 ValueError
# 稳妥写法：循环 + 异常捕获，直到输入合法（见第五层）
age = 18
print(f"今年 {age} 岁，明年 {age + 1} 岁")`,
    },
    {
      id: "1_9", title: "§1.9 运算符大全", desc: "算术/比较/身份/成员/位运算、/ 永远得 float、% 符号跟随除数、is 超高频坑、优先级表",
      doc: "https://docs.python.org/zh-cn/3.14/reference/expressions.html#operator-precedence",
      html: `<ul>
<li>算术：⭐ <code>/</code> 内置整数相除<b>永远返回 float</b>（4/2 是 2.0）；<code>//</code> 向负无穷取整（-7//2 是 -4，而 int(-7/2) 是 -3）⭐；<code>%</code> 结果符号跟随<b>除数</b>（-7%2 是 1）；<code>**</code> 幂；<code>pow(2, 10, 1000)</code> 三参数快速幂取模</li>
<li>比较：⭐ Python 特有<b>链式比较</b> <code>1 < 2 <= 2 < 3</code>；<code>3 == 3.0</code> 为 True（值相等即可，类型可不同）；字符串按字典序逐字符比</li>
<li>⭐⭐ <b>is / is not（超高频坑）</b>：<code>==</code> 比<b>值</b>，<code>is</code> 比<b>身份</b>（id 相同）；小整数缓存是解释器实现细节，绝不要依赖——规矩：<b>比较值用 ==，is 只用于 None、True、False 和自定义哨兵对象</b></li>
<li>成员：<code>in</code> / <code>not in</code>；⭐ 对字典检查的是<b>键</b>；列表 in 是 O(n) 逐个比对，集合/字典是 O(1) 哈希——大数据量成员判断用 set（见 §3.4）</li>
<li>位运算：<code>&</code> 与、<code>|</code> 或、<code>^</code> 异或、<code>~x</code> 取反（== -(x+1)）、<code><<</code> <code>>></code> 移位</li>
<li>⭐ 优先级细则：<code>**</code> 比它<b>左边</b>的一元运算符结合紧、比右边的松——<code>-1**2 == -1</code> 但 <code>2**-1 == 0.5</code>；连续幂右结合：<code>2**3**2 == 512</code>；记不住就加括号！</li></ul>
<table><tr><th>优先级（低→高，越靠下先算）</th><th>运算符</th></tr>
<tr><td>最低</td><td><code>:=</code> 海象</td></tr>
<tr><td></td><td><code>lambda</code></td></tr>
<tr><td></td><td><code>x if 条件 else y</code> 条件表达式</td></tr>
<tr><td></td><td><code>or</code></td></tr>
<tr><td></td><td><code>and</code></td></tr>
<tr><td></td><td><code>not x</code></td></tr>
<tr><td></td><td><code>in</code>、<code>not in</code>、<code>is</code>、<code>is not</code>、<code>&lt;</code> <code>&lt;=</code> <code>&gt;</code> <code>&gt;=</code> <code>!=</code> <code>==</code></td></tr>
<tr><td></td><td><code>|</code>（按位或）</td></tr>
<tr><td></td><td><code>^</code>（按位异或）</td></tr>
<tr><td></td><td><code>&amp;</code>（按位与）</td></tr>
<tr><td></td><td><code>&lt;&lt;</code>、<code>&gt;&gt;</code></td></tr>
<tr><td></td><td><code>+</code>、<code>-</code>（加减）</td></tr>
<tr><td></td><td><code>*</code>、<code>@</code>、<code>/</code>、<code>//</code>、<code>%</code></td></tr>
<tr><td></td><td><code>+x</code>、<code>-x</code>、<code>~x</code>（一元）</td></tr>
<tr><td></td><td><code>**</code> 幂</td></tr>
<tr><td></td><td><code>await x</code></td></tr>
<tr><td>最高</td><td><code>x[i]</code> 下标、<code>x[i:j]</code> 切片、<code>x(...)</code> 调用、<code>x.attr</code> 属性</td></tr></table>`,
      code: String.raw`print(7 / 2, 4 / 2)              # 3.5 2.0：/ 永远返回 float ⭐
print(7 // 2, -7 // 2)           # 3 -4：// 向负无穷取整
print(7 % 2, -7 % 2)             # 1  1：% 符号跟随除数 ⭐
print(2 ** 10, pow(2, 10, 1000))  # 1024 24：三参数 pow 快速幂取模

print(1 < 2 <= 2 < 3)            # True：链式比较 ⭐
print(3 == 3.0)                  # True：值相等即可
print("abc" < "abd")             # True：字典序

a = [1, 2]
b = [1, 2]
c = a
print(a == b, a is b, a is c)    # True False True ⭐⭐
print("ell" in "hello", 2 in [1, 2, 3], "key" in {"key": 1})

print(0b1100 & 0b1010, 0b1100 | 0b1010, 0b1100 ^ 0b1010)  # 8 14 6
print(~5, 1 << 3, 256 >> 2)      # -6 8 64

print(-1 ** 2)                   # -1：** 比左边的负号先算 ⭐
print(2 ** -1, 2 ** 3 ** 2)      # 0.5 512（右结合）`,
    },
  ],
});
