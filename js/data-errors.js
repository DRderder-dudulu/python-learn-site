/* ===== 报错博物馆数据 =====
 * 覆盖课程（第 1—6、8 层）每一节：每节至少一个真实高频报错，sec 字段对应课程小节号。
 * 玩法：看 traceback 猜原因 → 选择后立即揭晓对错 + 解析 + 正确写法。
 * traceback 文案按 3.10+ 解释器的真实报错格式编写。
 */
const ERRORS = [
  /* ---------- 第一层 · 基础语法 ---------- */
  {
    id: 1, sec: "1.1", title: "SyntaxError：/* */ 不是 Python 注释",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 1, in <module>
    /* 这是一段说明 */
    ^^
SyntaxError: invalid syntax`,
    options: ["Python 没有 /* */ 块注释，注释只能用 #", "说明文字不能有中文", "第一行不允许写注释"],
    answer: 0,
    explain: "Python 只认 # 单行注释；/* */ 是 C/Java 的写法。多行说明就每行开头加一个 #。",
    fix: String.raw`# 这是一段说明
# 第二行说明
print("你好")`,
  },
  {
    id: 2, sec: "1.2", title: "SyntaxError：关键字不能当变量名",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 1, in <module>
    class = 90
    ^^^^^
SyntaxError: invalid syntax`,
    options: ["字符串没加引号", "class 是关键字，不能用作变量名", "90 应该写成浮点数"],
    answer: 1,
    explain: "class、for、if 等 35 个关键字被语言占用。换个名字即可，比如 score 或 class_score。",
    fix: String.raw`score = 90
print(score)   # 变量名避开关键字；拿不准就先 print(keyword.kwlist) 查清单`,
  },
  {
    id: 3, sec: "1.3", title: "IndentationError：意外缩进",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 2, in <module>
    print("第二行")
IndentationError: unexpected indent`,
    options: ["print 前面不能有空格", "普通语句行首多了缩进，Python 认为层级错乱", "两行之间必须空一行"],
    answer: 1,
    explain: "缩进在 Python 里是语法：只有 if/for/def 等冒号之后才允许向内缩。普通语句行首不要有多余空格。",
    fix: String.raw`print("第一行")
print("第二行")   # 顶格写；需要分层时先写 if/for/def 加冒号`,
  },
  {
    id: 4, sec: "1.4", title: "NameError：名字未定义",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 2, in <module>
    print(naem)
NameError: name 'naem' is not defined. Did you mean: 'name'?`,
    options: ["变量名拼写错误", "Python 不支持中文变量", "print 用法错误"],
    answer: 0,
    explain: "naem 是 name 的笔误。3.10+ 的解释器会顺便给出最接近的名字提示（Did you mean）。",
    fix: String.raw`name = "小明"
print(name)   # 变量名必须和定义时完全一致（区分大小写）`,
  },
  {
    id: 5, sec: "1.5", title: "ZeroDivisionError：除数为零",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 2, in <module>
    avg = total / count
ZeroDivisionError: division by zero`,
    options: ["/ 只能用于整数", "变量名 count 太长了", "count 为 0，任何数都不能除以 0"],
    answer: 2,
    explain: "除法、取整除、取余碰到 0 都会抛这个错。除数来自用户输入或计算结果时，先判断再除。",
    fix: String.raw`if count == 0:
    print("没有数据")
else:
    avg = total / count`,
  },
  {
    id: 6, sec: "1.6", title: "SyntaxError：字符串没收尾",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 1, in <module>
    s = "你好，世界
        ^
SyntaxError: unterminated string literal (detected at line 1)`,
    options: ["字符串里不能有逗号", "引号必须成对，结尾少了右引号", "字符串太长了"],
    answer: 1,
    explain: "引号要成对出现。字符串内容本身含引号时，换另一种引号包外层，或用 \\ 转义。",
    fix: String.raw`s = "你好，世界"
say = '他说："加油"'   # 外层单引号，内层双引号互不干扰`,
  },
  {
    id: 7, sec: "1.7", title: "TypeError：None 没有长度",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 5, in <module>
    print(len(result))
TypeError: object of type 'NoneType' has no len()`,
    options: ["len() 不能用在 print 里", "result 是空字符串", "函数没写 return，result 拿到的是 None"],
    answer: 2,
    explain: "函数没有 return 时默认返回 None，None 不是空字符串/空列表，它没有长度。检查函数是否忘了返回值。",
    fix: String.raw`def find():
    return "找到了"   # 补上 return，调用处才有值可用

result = find()
print(len(result))`,
  },
  {
    id: 8, sec: "1.8", title: "TypeError：字符串和数字不能直接拼",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 1, in <module>
    print("年龄：" + 18)
TypeError: can only concatenate str (not "int") to str`,
    options: ["字符串和数字不能用 + 拼接", "引号不成对", "18 太大了"],
    answer: 0,
    explain: "+ 两边类型要一致。用 f-string 最省事，或者用 str() 转换。",
    fix: String.raw`age = 18
print(f"年龄：{age}")       # 推荐：f-string
print("年龄：" + str(age))   # 或手动转换`,
  },
  {
    id: 9, sec: "1.8", title: "TypeError：input 拿到的是字符串",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 2, in <module>
    if age >= 18:
TypeError: '>=' not supported between instances of 'str' and 'int'`,
    options: ["if 后面不能跟 >=", "18 应该加引号", "input() 返回的是字符串，不能直接和数字比大小"],
    answer: 2,
    explain: "input() 永远返回 str，哪怕用户输入的是数字。比较或计算前先 int() 转换。",
    fix: String.raw`age = int(input("年龄："))   # 转换后再比较
if age >= 18:
    print("成年")`,
  },
  {
    id: 10, sec: "1.9", title: "SyntaxError：= 和 == 写反了",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 1, in <module>
    if x = 5:
       ^
SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?`,
    options: ["比较要用 ==，一个 = 是赋值", "x 必须先赋值为 0", "if 后面缺引号"],
    answer: 0,
    explain: "= 是赋值，== 才是比较。3.10+ 的解释器会猜你想写的是 == 或 :=，直接给提示。",
    fix: String.raw`x = 5
if x == 5:      # 判断相等用双等号
    print("x 是 5")`,
  },
  /* ---------- 第二层 · 流程控制 ---------- */
  {
    id: 11, sec: "2.1", title: "SyntaxError：Python 没有 else if",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 4, in <module>
    else if score >= 60:
         ^^
SyntaxError: invalid syntax`,
    options: ["else 和 if 之间要加冒号", "多分支要写 elif，不是 else if", "score 未定义"],
    answer: 1,
    explain: "Python 的多分支关键字是 elif（else if 的缩写）。else if 是其他语言的写法。",
    fix: String.raw`if score >= 90:
    print("优")
elif score >= 60:   # 中间分支用 elif
    print("及格")
else:
    print("不及格")`,
  },
  {
    id: 12, sec: "2.2", title: "SyntaxError：break 只能在循环里",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 3, in <module>
    break
SyntaxError: 'break' outside loop`,
    options: ["break 拼写错误", "break 写在了 if 里，但 if 不是循环", "break 后面要加分号"],
    answer: 1,
    explain: "break/continue 只对 for/while 循环有效。if 只是分支，包不住 break；想提前结束函数用 return。",
    fix: String.raw`while True:
    cmd = input("输入 q 退出：")
    if cmd == "q":
        break       # break 在循环内部才合法
    print("执行：", cmd)`,
  },
  {
    id: 13, sec: "2.3", title: "TypeError：整数不能直接 for",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 1, in <module>
    for i in 10:
TypeError: 'int' object is not iterable`,
    options: ["for 后面缺冒号", "i 这个名字不合法", "要循环 10 次得用 range(10)，数字本身不可迭代"],
    answer: 2,
    explain: "for 遍历的是可迭代对象（列表、字符串、range……）。想数 0 到 9，用 range(10)。",
    fix: String.raw`for i in range(10):   # 0 到 9，共 10 次
    print(i)`,
  },
  {
    id: 14, sec: "2.4", title: "SyntaxError：case 后面不是判断式",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 3, in <module>
    case score >= 90:
         ^^^^^^^^^
SyntaxError: invalid syntax`,
    options: ["match 语句版本太低", "case 跟的是模式（值/结构），范围判断要用 if 守卫", "score 不能用在 case 里"],
    answer: 1,
    explain: "case 后面写的是“长什么样”的模式，不是比较式。要加条件，用 if 守卫：case s if s >= 90。",
    fix: String.raw`match score:
    case s if s >= 90:   # 守卫：模式匹配后再加条件
        print("优")
    case _:
        print("其他")    # 范围判断多的场景，用 if/elif 更直观`,
  },
  /* ---------- 第三层 · 数据结构 ---------- */
  {
    id: 15, sec: "3.1", title: "IndexError：下标越界",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 2, in <module>
    print(nums[3])
IndexError: list index out of range`,
    options: ["列表最多存 3 个元素", "nums 不是列表", "下标从 0 开始，3 个元素最大下标是 2"],
    answer: 2,
    explain: "下标从 0 数起：长度为 3 的列表，合法下标是 0、1、2（负数 -1 是最后一个）。拿不准先 len()。",
    fix: String.raw`nums = [10, 20, 30]
print(nums[2])     # 最后一个：30
print(nums[-1])    # 负数下标更稳妥：也是 30`,
  },
  {
    id: 16, sec: "3.2", title: "TypeError：元组不能改",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 2, in <module>
    point[0] = 99
TypeError: 'tuple' object does not support item assignment`,
    options: ["元组是不可变的，创建后不能改元素", "下标 0 不存在", "point 应该是字典"],
    answer: 0,
    explain: "元组的设计就是“定死的数据”。需要可改就用列表；需要“基于旧元组改一下”就拼一个新元组。",
    fix: String.raw`point = (1, 2)
point = (99,) + point[1:]   # 造一个新元组：(99, 2)
print(point)`,
  },
  {
    id: 17, sec: "3.3", title: "KeyError：字典里没这个键",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 2, in <module>
    print(scores["小明"])
KeyError: '小明'`,
    options: ["字典不能用中文键", "键不存在，直接 [键] 取会报错", "scores 应该用列表"],
    answer: 1,
    explain: "d[键] 要求键必须存在。不确定时用 d.get(键, 默认值)，或者先 if 键 in d 判断。",
    fix: String.raw`scores = {"小红": 90}
print(scores.get("小明", 0))        # 缺键给默认值 0
if "小明" in scores:                # 或先判断
    print(scores["小明"])`,
  },
  {
    id: 18, sec: "3.4", title: "TypeError：列表不能进集合",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 1, in <module>
    s = {[1, 2], [3, 4]}
TypeError: unhashable type: 'list'`,
    options: ["集合元素必须可哈希（不可变），列表不行，换元组", "集合最多存 2 个元素", "中括号写错了位置"],
    answer: 0,
    explain: "集合和字典键都依赖哈希值，可变的列表/字典/集合都不能当元素。换成不可变的元组即可。",
    fix: String.raw`s = {(1, 2), (3, 4)}   # 元组可哈希，能进集合
print((1, 2) in s)   # True`,
  },
  {
    id: 19, sec: "3.5", title: "TypeError：字符串不能改字",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 2, in <module>
    s[0] = "A"
TypeError: 'str' object does not support item assignment`,
    options: ["字符串下标不能从 0 开始", "应该用双引号赋值", "字符串不可变，改动要生成新字符串"],
    answer: 2,
    explain: "字符串和元组一样不可变。replace()、切片拼接都会返回新串，原串不动——把结果接回去就行。",
    fix: String.raw`s = "abc"
s = "A" + s[1:]        # 拼出新串再贴回 s
print(s)               # Abc`,
  },
  {
    id: 20, sec: "3.6", title: "ValueError：切片步长不能是 0",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 1, in <module>
    nums = [1, 2, 3][::0]
ValueError: slice step cannot be zero`,
    options: ["切片最多写两个冒号", "步长为 0 意味着永远走不动，被禁止；倒序用 -1", "列表太短不能切片"],
    answer: 1,
    explain: "步长控制方向和间隔：1 顺取、2 隔一个、-1 倒序。0 没有意义，直接报 ValueError。",
    fix: String.raw`nums = [1, 2, 3]
print(nums[::-1])   # [3, 2, 1] 倒序
print(nums[::2])    # [1, 3] 隔一个取`,
  },
  {
    id: 21, sec: "3.7", title: "ValueError：解包个数对不上",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 1, in <module>
    a, b = 1, 2, 3
ValueError: too many values to unpack (expected 2)`,
    options: ["左边变量个数必须和右边值的个数一致", "数字不能解包", "应该用等号连接"],
    answer: 0,
    explain: "解包讲究一一对应。多出来的值用 *rest 收编，或者检查数据源为什么多了元素。",
    fix: String.raw`a, b, *rest = 1, 2, 3, 4   # a=1, b=2, rest=[3, 4]
first, *mid, last = 1, 2, 3, 4   # 首尾各一个，中间全归 mid`,
  },
  {
    id: 22, sec: "3.8", title: "NameError：del 之后名字就没了",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 3, in <module>
    print(x)
NameError: name 'x' is not defined`,
    options: ["del 删的是变量这个名字，删完再用就报未定义", "x 被回收进内存了还能用", "print 不能打印数字"],
    answer: 0,
    explain: "del x 摘掉的是“x 这张标签”。标签没了，再用这个名字就是 NameError；原对象若没人引用会被回收。",
    fix: String.raw`x = 10
print(x)      # 先用
del x         # 确认不再需要再删；删完想用得重新赋值
x = 20
print(x)`,
  },
  /* ---------- 第四层 · 函数 ---------- */
  {
    id: 23, sec: "4.1", title: "TypeError：少传了参数",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 4, in <module>
    print(add(1))
TypeError: add() missing 1 required positional argument: 'b'`,
    options: ["add 这个名字被占用了", "print 里不能调用函数", "定义要两个参数，调用只给了一个"],
    answer: 2,
    explain: "报错信息直接点名缺哪个参数（b）。要么调用时补全，要么定义时给默认值。",
    fix: String.raw`def add(a, b=0):    # 给 b 默认值后，add(1) 也能用
    return a + b

print(add(1, 2))    # 3
print(add(1))       # 1`,
  },
  {
    id: 24, sec: "4.2", title: "SyntaxError：默认参数排错队",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 1, in <module>
    def greet(name="同学", greeting):
                              ^^^^^^^^
SyntaxError: non-default argument follows default argument`,
    options: ["默认值不能用中文", "带默认值的参数后面不能再跟普通参数，顺序要调", "def 后面缺空格"],
    answer: 1,
    explain: "规则：必填参数在前，带默认值的参数在后——否则调用时按位置传参会产生歧义。",
    fix: String.raw`def greet(greeting, name="同学"):   # 必填在前，默认在后
    return f"{greeting}，{name}"

print(greet("早上好"))`,
  },
  {
    id: 25, sec: "4.3", title: "SyntaxError：关键字参数后混位置参数",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 4, in <module>
    f(1, b=2, 3)
              ^
SyntaxError: positional argument follows keyword argument`,
    options: ["一旦用了 名字=值，后面就都得用 名字=值", "f 的参数太多了", "数字 3 要加引号"],
    answer: 0,
    explain: "位置参数必须整体排在关键字参数前面。调乱顺序，解释器就不知道 3 该给谁。",
    fix: String.raw`def f(a, b, c):
    return a, b, c

f(1, 2, b=3)        # 位置在前，关键字在后
f(a=1, b=2, c=3)    # 或全用关键字，顺序随意`,
  },
  {
    id: 26, sec: "4.4", title: "UnboundLocalError：函数里的同名变量",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 3, in f
    print(count)
UnboundLocalError: cannot access local variable 'count' where it is not associated with a value`,
    options: ["count 名字太长", "print 不能打印全局变量", "函数内一旦有赋值，count 全程算局部变量，赋值前打印就报错"],
    answer: 2,
    explain: "函数里出现 count += 1，Python 就把 count 当局部变量；打印在它的赋值之前，自然“还没值”。要改全局变量需先 global 声明（更好的做法是传参+返回）。",
    fix: String.raw`count = 0

def add():
    global count    # 声明后才能改全局（能不用就不用）
    count += 1

add()
print(count)        # 1`,
  },
  {
    id: 27, sec: "4.5", title: "TypeError：lambda 参数个数不符",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 2, in <module>
    print(add(1, 2, 3))
TypeError: <lambda>() takes 2 positional arguments but 3 were given`,
    options: ["lambda 只能算加法", "lambda 定义了两个参数，调用给了三个", "print 不能套 lambda"],
    answer: 1,
    explain: "lambda 就是函数，参数规则和 def 一样。报错里的 <lambda>() 说明问题出在那个匿名函数。",
    fix: String.raw`add = lambda a, b: a + b
print(add(1, 2))          # 3
total = lambda *xs: sum(xs)   # 个数不固定就用 *xs
print(total(1, 2, 3))         # 6`,
  },
  {
    id: 28, sec: "4.6", title: "TypeError：老版本不支持 list[int]",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 1, in <module>
    def f(items: list[int]) -> int:
TypeError: 'type' object is not subscriptable`,
    options: ["注解里不能用中文", "def 不能写返回值注解", "list[int] 写法要 3.9+；3.8 环境得用 typing.List[int]"],
    answer: 2,
    explain: "内置泛型 list[int]、dict[str, int] 从 3.9 才开始支持。老代码库常见 typing.List / typing.Dict 写法，是同一件事的旧形式。",
    fix: String.raw`from typing import List   # 3.8 环境的兼容写法

def f(items: List[int]) -> int:
    return len(items)`,
  },
  {
    id: 29, sec: "4.7", title: "RecursionError：递归没有出口",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 2, in countdown
    return countdown(n - 1)
  [Previous line repeated 996 more times]
RecursionError: maximum recursion depth exceeded`,
    options: ["递归最多只能写 3 层", "少了终止条件，函数无限自我调用", "n 的初始值太大了"],
    answer: 1,
    explain: "递归必须有一个“不再调用自己”的出口（基准情形）。没有它，调用栈很快撞上限（默认约 1000 层）。",
    fix: String.raw`def countdown(n):
    if n <= 0:        # 基准情形：递归出口
        return
    print(n)
    countdown(n - 1)  # 每次离出口更近一步

countdown(3)`,
  },
  /* ---------- 第五层 · 异常处理 ---------- */
  {
    id: 30, sec: "5.1", title: "SyntaxError：try 后面缺搭档",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 4, in <module>
    print("结束")
          ^
SyntaxError: expected 'except' or 'finally' block`,
    options: ["try 块里不能写 print", "except 要写在 try 上面", "try 必须至少跟一个 except 或 finally"],
    answer: 2,
    explain: "try 不能单独出现。最常见的写法是 try + except；只关心收尾就 try + finally。",
    fix: String.raw`try:
    n = int("abc")
except ValueError:
    print("不是数字")
finally:
    print("收尾总会执行")   # 可选`,
  },
  {
    id: 31, sec: "5.2", title: "TypeError：raise 不能抛字符串",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 2, in <module>
    raise "余额不足"
TypeError: exceptions must derive from BaseException`,
    options: ["raise 后面要加括号", "只能抛异常对象，字符串不行；用 ValueError 等异常类", "中文不能作为报错信息"],
    answer: 1,
    explain: "raise 抛的必须是异常（BaseException 的子类实例）。想表达“值不对”用 ValueError，消息作为参数传进去。",
    fix: String.raw`balance = -1
if balance < 0:
    raise ValueError(f"余额不足：{balance}")   # 异常类 + 消息`,
  },
  {
    id: 32, sec: "5.3", title: "ValueError：int() 转不动",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 1, in <module>
    n = int("12.5")
ValueError: invalid literal for int() with base 10: '12.5'`,
    options: ["int() 只吃整数字符串，带小数点要先过 float()", "数字太大超出范围", "引号用错了种类"],
    answer: 0,
    explain: "int() 严格：\"12\" 行，\"12.5\" 不行。用户输入可能带小数或杂字符时，先 float() 再 int()，或者 try 接住。",
    fix: String.raw`n = int(float("12.5"))   # 12：先转浮点再取整
try:
    m = int(input("整数："))
except ValueError:
    print("请输入整数")`,
  },
  {
    id: 33, sec: "5.4", title: "TypeError：except 接了个普通类",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 3, in <module>
    except MyError:
TypeError: catching classes that do not inherit from BaseException is not allowed`,
    options: ["except 后面要跟异常类；自定义异常必须继承 Exception", "MyError 名字不合法", "try 块缩进错了"],
    answer: 0,
    explain: "能被 except 捕捉的必须是异常家族成员。自定义异常的写法是 class MyError(Exception)，少了继承就接不住。",
    fix: String.raw`class MyError(Exception):   # 继承 Exception
    pass

try:
    raise MyError("出错了")
except MyError as e:
    print("接住了：", e)`,
  },
  {
    id: 34, sec: "5.5", title: "AssertionError：断言没通过",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 1, in <module>
    assert age >= 0, "年龄不能为负"
AssertionError: 年龄不能为负`,
    options: ["assert 条件为假就抛 AssertionError，逗号后是附带消息", "年龄必须是正数", "assert 不能写中文"],
    answer: 0,
    explain: "assert 条件, 消息：条件不成立就抛错并带上消息。它用于开发期自查，正式校验用户输入要用 if + raise。",
    fix: String.raw`age = 18
assert age >= 0, "年龄不能为负"   # 通过则什么都没发生
# 注意：python -O 运行时 assert 会被整行跳过`,
  },
  {
    id: 35, sec: "5.6", title: "FileNotFoundError：文件不存在",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 1, in <module>
    f = open("data.txt")
FileNotFoundError: [Errno 2] No such file or directory: 'data.txt'`,
    options: ["open 的引号写错了", "txt 文件不能用 open", "文件不在那里：先检查路径，或用 try 按 EAFP 风格接住"],
    answer: 2,
    explain: "路径不对、文件名打错、工作目录不同都会触发。EAFP 做法：直接开，出错了 except 处理；或者先 Path.exists() 检查。",
    fix: String.raw`from pathlib import Path

p = Path("data.txt")
if p.exists():
    print(p.read_text(encoding="utf-8"))
else:
    print("文件不存在，使用默认配置")`,
  },
  /* ---------- 第六层 · 模块与包 ---------- */
  {
    id: 36, sec: "6.1", title: "ModuleNotFoundError：模块没安装",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 1, in <module>
    import requests
ModuleNotFoundError: No module named 'requests'`,
    options: ["import 拼写错误", "这个第三方库还没装进当前环境；标准库不会这样报", "requests 只能在网上用"],
    answer: 1,
    explain: "第三方库要先 pip install 才能 import。还要注意：装到了 A 环境却在 B 环境运行，也会报同样的错。",
    fix: String.raw`# 命令行先安装（注意选对虚拟环境）：
#   pip install requests
# 然后代码里再：
import requests`,
  },
  {
    id: 37, sec: "6.2", title: "NameError：__name__ 少写了下划线",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 1, in <module>
    if __name == "__main__":
NameError: name '__name' is not defined`,
    options: ["__name__ 前后各两个下划线，少一个就成了未定义的名字", "if 后面不能跟字符串比较", "main 要加引号"],
    answer: 0,
    explain: "__name__ 是解释器自动设置的特殊变量，左右各两个下划线。守卫写法固定：if __name__ == \"__main__\":。",
    fix: String.raw`def main():
    print("程序入口")

if __name__ == "__main__":   # 直接运行才执行；被 import 时跳过
    main()`,
  },
  {
    id: 38, sec: "6.3", title: "ImportError：相对导入用错场景",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 1, in <module>
    from . import utils
ImportError: attempted relative import with no known parent package`,
    options: ["utils 文件不存在", "from 后面不能跟点", "带 . 的相对导入只在包内部有效，直接运行单个文件时没有“包”可言"],
    answer: 2,
    explain: "相对导入（from . import x）是给包内模块互相引用用的。直接 python 某个文件，它不属于任何包，相对导入无从谈起。",
    fix: String.raw`# 场景：包 mypkg/ 里的模块互相引用
# mypkg/main.py 中：
from . import utils        # 包内相对导入
# 运行入口放在包外：
#   python -m mypkg.main`,
  },
  {
    id: 39, sec: "6.4", title: "JSONDecodeError：JSON 只认双引号",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 2, in <module>
    obj = json.loads("{'a': 1}")
json.decoder.JSONDecodeError: Expecting property name enclosed in double quotes: line 1 column 2 (char 1)`,
    options: ["json.loads 只能读文件", "JSON 标准要求双引号，单引号是 Python 写法不是 JSON", "冒号后面缺空格"],
    answer: 1,
    explain: "JSON 是独立格式：键必须双引号、没有单引号、没有尾随逗号、布尔是 true/false。Python 字面量长得像但不是 JSON。",
    fix: String.raw`import json

obj = json.loads('{"a": 1}')      # 双引号才合法
print(obj["a"])
s = json.dumps(obj, ensure_ascii=False)  # Python 对象 → JSON 字符串`,
  },
  {
    id: 40, sec: "6.5", title: "SyntaxError：__future__ 没放文件头",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 3, in <module>
    from __future__ import annotations
SyntaxError: from __future__ imports must occur at the beginning of the file`,
    options: ["annotations 这个名字不存在", "一行只能写一个 import", "__future__ 导入必须是文件最前面的语句（注释和文档字符串除外）"],
    answer: 2,
    explain: "__future__ 会改变解释器对整份文件的解析方式，所以必须放在所有普通代码之前。",
    fix: String.raw`"""模块说明。"""
from __future__ import annotations   # 紧跟文档字符串之后

import json                          # 其他 import 排在后面`,
  },
  /* ---------- 第八层 · 文件读写 ---------- */
  {
    id: 41, sec: "8.1", title: "UnicodeDecodeError：编码对不上",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 2, in <module>
    text = f.read()
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xd6 in position 0: invalid continuation byte`,
    options: ["文件是空的", "read() 后面缺参数", "文件实际编码（如 GBK）和你声明的 utf-8 不一致"],
    answer: 2,
    explain: "Windows 中文系统很多老文件是 GBK 编码。读文件显式指定 encoding，写文件统一用 utf-8，能避开大多数乱码和报错。",
    fix: String.raw`with open("笔记.txt", encoding="gbk") as f:   # 按文件真实编码打开
    text = f.read()
# 自己写文件时统一 utf-8：
with open("新文件.txt", "w", encoding="utf-8") as f:
    f.write(text)`,
  },
  {
    id: 42, sec: "8.2", title: "TypeError：write_text 只收字符串",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 2, in <module>
    p.write_text(123)
TypeError: data must be str, not int`,
    options: ["write_text 写的是文本，数字要先 str() 转换", "路径不存在", "123 太小了"],
    answer: 0,
    explain: "write_text / write 处理的是文本。写数字、列表等内容前先转成字符串；结构化数据用 json.dumps。",
    fix: String.raw`from pathlib import Path

p = Path("结果.txt")
p.write_text(str(123), encoding="utf-8")        # 数字先转字符串
p.write_text(f"平均分：{92.5}", encoding="utf-8")  # f-string 更常用`,
  },
  {
    id: 43, sec: "8.3", title: "ValueError：文件已关闭还在读",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 4, in <module>
    print(f.read())
ValueError: I/O operation on closed file.`,
    options: ["with 块结束后文件就关了，读写要在缩进块内做完", "read() 只能调用一次", "文件被别的程序占用"],
    answer: 0,
    explain: "with 的价值就是自动关文件：缩进块一退出，文件立即关闭。想在块外用内容，块内先读进变量。",
    fix: String.raw`with open("笔记.txt", encoding="utf-8") as f:
    text = f.read()      # 块内读完，存进变量
print(text)              # 块外随便用变量，文件已安全关闭`,
  },
  {
    id: 44, sec: "8.4", title: "PermissionError：把文件夹当文件打开",
    traceback: String.raw`Traceback (most recent call last):
  File "main.py", line 1, in <module>
    f = open("downloads")
PermissionError: [Errno 13] Permission denied: 'downloads'`,
    options: ["open 只能打开文件；传入文件夹路径会被拒绝", "文件名不能有英文", "需要先 import os"],
    answer: 0,
    explain: "open() 的对象必须是文件。路径指向目录时 Windows 报 PermissionError，macOS/Linux 报 IsADirectoryError——处理前先判断类型。",
    fix: String.raw`from pathlib import Path

p = Path("downloads")
if p.is_dir():
    for child in p.iterdir():   # 遍历目录内容
        print(child.name)
elif p.is_file():
    print(p.read_text(encoding="utf-8"))`,
  },
];
