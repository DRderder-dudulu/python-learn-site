/* ===== 课程内容数据 · 第四层 =====
 * 内容来源：《Python 3 语法完全指南》（outputs/python-syntax-guide.md）第四层 · 函数。
 * 写法规范：section.id 即指南小节号；points 为分条要点（内联 <code>/<b>）；
 * 【对应规范】points 每条要点必须在 code 中有明确对应：可演示的写成可运行代码并配注释；
 * 错误/危险示范以「故意注释掉」的形式呈现（学员可取消注释亲测报错）；
 * code 示例均经本地 Python 实际运行验证（tools/verify_examples.py + verify_expects.py）；expect 为真实输出。
 * 适用版本：3.8—3.14 ｜ 最后核对：2026-10
 */
COURSE.push({
  id: 4,
  title: "第四层 · 函数",
  minutes: 60,
  goal: "会把重复代码封装成函数，掌握参数、返回值与作用域",
  prereq: "第一~三层",
  versions: "3.8—3.14",
  checked: "2026-10",
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
      code: String.raw`def divmod2(a, b):          # def 定义；函数体【调用时】才执行
    """返回商和余数。"""      # 函数体第一条字符串是 docstring
    return a // b, a % b     # return 交还结果；返回多个值 = 返回元组

q, r = divmod2(7, 2)         # 配合解包接收多返回值
print(q, r)
print(divmod2.__doc__)

def f():
    pass                     # ⭐ 没有 return 的函数返回 None
print(f())

result = print("x")          # print 是【显示】，return 才是【交还】
print(result)                # print 没有返回值，result 是 None`,
      expect: "3 1\n返回商和余数。\nNone\nx\nNone",
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
    # a 普通参数位置/关键字均可；b 有默认值（有默认值的排在无默认值之后）；
    # *args 收集多余位置参数成元组；* 后的 c 仅限关键字；**kwargs 收集多余关键字成字典
    print(a, b, args, c, kwargs)

f(1, 3, 5, 7, c=9, x=1)
f(1, c=9)                    # 普通参数按关键字传也行

def g(x, /, y):              # / 前的参数仅限位置（3.8+）
    print(x, y)
g(1, y=2)
# g(x=1, y=2)                # ⭐ 错误示范（故意注释掉）：x 在 / 前，按关键字传报 TypeError

def add(item, box=None):     # ⭐⭐ 可变默认值陷阱：用 None 占位，函数内再建
    if box is None:
        box = []
    box.append(item)
    return box
print(add(1), add(2))

# def bad(item, box=[]):     # ⭐⭐ 错误示范（故意注释掉）：默认值在定义时只求值一次
#     box.append(item)       #     多次调用共享同一个列表，结果互相污染
#     return box`,
      expect: "1 3 (5, 7) 9 {'x': 1}\n1 2 () 9 {}\n1 2\n[1] [2]",
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
f(*args)                     # f(*序列)：拆成位置参数，等价于 f(1, 2, 3)

kwargs = {"a": 10, "b": 20, "c": 30}
f(**kwargs)                  # f(**字典)：拆成关键字参数

# f(a=1, 2, 3)               # ⭐ 错误示范（故意注释掉）：位置参数不能跟在关键字参数后面（SyntaxError）
# f(1, a=1, c=3)             # ⭐ 错误示范（故意注释掉）：同一参数既按位置又按关键字传（TypeError）`,
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
      code: String.raw`x = "全局"
def outer():
    x = "外层"
    def inner():
        x = "局部"
        print(x)             # LEGB：局部 → 外层函数 → 全局 → 内置，就近取名字
    inner()
    print(x)                 # 这里是 outer 的局部
outer()
print(x)                     # 这里找不到局部/外层，落到全局

count = 0
def inc():
    global count             # ⭐ 修改全局变量要 global（重新绑定名字才需要声明）
    count += 1
inc()
inc()
print(count)

def make_counter():
    n = 0
    def tick():
        nonlocal n           # ⭐ 修改外层函数的变量要 nonlocal
        n += 1
        return n
    return tick
t = make_counter()
print(t(), t())

nums = []
def push():
    nums.append(1)           # ⭐ 改对象【内部】（append 等）不需要声明
push()
print(nums)`,
      expect: "局部\n外层\n全局\n2\n1 2\n[1]",
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
print(sorted(words, key=lambda w: len(w)))   # lambda 参数: 表达式——最常用作排序/处理的 key

pairs = [(1, "b"), (2, "a")]
pairs.sort(key=lambda p: p[1])
print(pairs)

def grade(score):            # lambda 只能写一个表达式；逻辑稍复杂就老老实实写 def
    if score >= 60:
        return "及格"
    return "不及格"
print(grade(60))`,
      expect: "['a', 'bb', 'ccc']\n[(2, 'a'), (1, 'b')]\n及格",
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
      code: String.raw`def add(a: int, b: int) -> int:   # 注解是写给人类和检查工具的【说明书】
    return a + b

print(add(2, 3))
print(add.__annotations__)   # 注解存进 __annotations__

print(add("x", "y"))         # ⭐ 注解不影响运行：写错类型照样能跑（这里变成字符串拼接）
# 真正做类型检查靠 mypy 等工具；类型系统深入学习在第二阶段（指南第 13 层），这里认个脸熟`,
      expect: "5\n{'a': <class 'int'>, 'b': <class 'int'>, 'return': <class 'int'>}\nxy",
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
    if n <= 1:               # ⭐ 必须有终止条件，否则无限递归
        return 1
    return n * factorial(n - 1)   # 函数调用自己

print(factorial(5))          # 5! = 120

import sys
print(sys.getrecursionlimit())   # 默认递归深度上限约 1000 层，超过报 RecursionError

# def boom():
#     return boom()          # ⭐ 错误示范（故意注释掉）：没有终止条件，报 RecursionError`,
      expect: "120\n1000",
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
});
