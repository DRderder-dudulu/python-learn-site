/* ===== 速查·第四层 · 函数（§4.1—§4.7） =====
 * 内容来源：《Python 3 语法完全指南》第四层（outputs/python-syntax-guide-v1.md 第 1085—1252 行），1:1 对齐小节；
 * 示例与课程 §4.x 一致或取自指南，均可运行（tools/verify_examples.py 实跑验证）。
 * 适用版本：3.8—3.14 ｜ 语言规则以 Python 官方文档为准。
 */
CHEATSHEET_ADV.push({
  layerId: 4,
  layer: "第四层 · 函数",
  stage: "一",
  topics: [
    {
      id: "4_1", title: "§4.1 定义与调用", desc: "def+return、关键字传参、⭐没有 return 返回 None、返回多值本质是元组解包",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/controlflow.html#defining-functions",
      html: `<ul>
<li><code>def 函数名(参数列表):</code> + 缩进函数体；<code>return</code> 把结果交还给调用者；调用时才执行函数体</li>
<li>函数体第一条字符串是 docstring（见 §1.1）；调用可位置传参，也可关键字传参：<code>greet("小红", greeting="早上好")</code></li>
<li>⭐ <b>没有 return 的函数返回 None</b>——<code>result = print("x")</code> 接到的也是 None：print 是"显示"，return 才是"交还"，别接 print 的返回值（新手高频混淆）</li>
<li><b>返回多个值</b>：本质是返回一个元组——<code>return a // b, a % b</code> 返回 (商, 余数)，配合解包接收：<code>q, r = divmod2(7, 2)</code></li></ul>`,
      code: String.raw`def greet(name, greeting="你好"):     # def + 函数名 + 参数列表
    """打招呼。（docstring）"""
    return f"{greeting}，{name}！"    # return 把结果交还给调用者

print(greet("小明"))                    # 你好，小明！
print(greet("小红", greeting="早上好"))  # 关键字传参

def f():
    pass
print(f())          # None ⭐ 没有 return 的函数返回 None
result = print("x") # ⭐ print 也返回 None，别接它的返回值
print(result)       # None

# 返回多个值：本质是返回一个元组，配合解包使用
def divmod2(a, b):
    return a // b, a % b      # 返回元组 (商, 余数)

q, r = divmod2(7, 2)          # 解包接收：q=3, r=1
print(q, r)`,
    },
    {
      id: "4_2", title: "§4.2 参数的五种类别", desc: "仅限位置/普通/*args/仅限关键字/**kwargs 五类与书写顺序、⭐⭐可变默认值陷阱与 None 占位",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/controlflow.html#more-on-defining-functions",
      html: `<p>按定义时的书写顺序：<code>def func(pos_only, /, normal, default=1, *args, kw_only, kw_default=2, **kwargs):</code></p>
<table><tr><th>类别</th><th>写法</th><th>说明</th></tr>
<tr><td>① 仅限位置参数</td><td><code>/</code> 之前的参数</td><td>调用时<b>只能</b>按位置传，不能写名字（3.8+）</td></tr>
<tr><td>② 位置或关键字参数</td><td>普通参数</td><td>两种传法都行</td></tr>
<tr><td>③ 可变位置参数</td><td><code>*args</code></td><td>收集多余的位置参数成<b>元组</b></td></tr>
<tr><td>④ 仅限关键字参数</td><td>单独一个 <code>*</code> 之后的参数</td><td>调用时<b>必须</b>写名字</td></tr>
<tr><td>⑤ 可变关键字参数</td><td><code>**kwargs</code></td><td>收集多余的关键字参数成<b>字典</b></td></tr></table>
<ul>
<li>调用示例：<code>def f(a, b, /, c, d=4, *args, e, **kwargs)</code> 后 <code>f(1, 2, 3, 5, 6, 7, e=8, x=9)</code> → a=1 b=2（仅限位置）、c=3 d=5（位置或关键字）、args=(6, 7)、e=8（仅限关键字）、kwargs={'x': 9}</li>
<li>⭐⭐ <b>默认参数铁律 1</b>：默认值在 <code>def</code> <b>执行时只求值一次</b>，之后所有调用共享——<b>绝对不能用可变对象当默认值</b>：<code>def add_item(item, box=[])</code> 的 box 是所有调用共享的同一个列表，第二次调用时上次的元素还在！✅ 惯例：<code>box=None</code> 占位，函数内 <code>if box is None: box = []</code></li>
<li>⭐ <b>默认参数铁律 2</b>：有默认值的参数必须排在无默认值参数之后（仅限位置/位置或关键字这一段内）</li></ul>`,
      code: String.raw`def f(a, b, /, c, d=4, *args, e, **kwargs):
    print(a, b, c, d, args, e, kwargs)

f(1, 2, 3, 5, 6, 7, e=8, x=9)
# a=1 b=2（仅限位置）c=3 d=5（位置或关键字）
# args=(6, 7)（可变位置）e=8（仅限关键字）kwargs={'x': 9}

# ⭐⭐ 可变默认值陷阱：默认值在 def 执行时只求值一次，之后所有调用共享
# def add_item(item, box=[]):     # ❌ 坑：box 是所有调用共享的同一个列表
#     box.append(item)
#     return box
# 调用 add_item(1) 得 [1]，再调 add_item(2) 得 [1, 2]——上次的 1 还在！

def add_item(item, box=None):   # ✅ 惯例：用 None 占位
    if box is None:
        box = []
    box.append(item)
    return box

print(add_item(1))   # [1]
print(add_item(2))   # [2]：互不影响`,
    },
    {
      id: "4_3", title: "§4.3 调用规则与冲突", desc: "关键字必须在位置之后、⭐同参数不能传两次、数量不符 TypeError、* 与 ** 解包调用",
      doc: "https://docs.python.org/zh-cn/3.14/reference/expressions.html#calls",
      html: `<ul>
<li>传参方式：<code>f(1, 2, 3)</code> 全位置｜<code>f(1, b=2, c=3)</code> 位置 + 关键字（<b>关键字必须放在位置之后</b>）</li>
<li>❌ <code>f(a=1, 2, 3)</code> SyntaxError：位置参数不能跟在关键字参数后面</li>
<li>⭐ ❌ <code>f(1, a=1, c=3)</code> TypeError：a 同时按位置和关键字<b>传了两次</b></li>
<li>❌ <code>f(1, 2, 3, 4)</code> TypeError：参数数量对不上</li>
<li><b>解包调用</b>：<code>*</code> 拆序列当位置参数，<code>**</code> 拆字典当关键字参数：<code>f(*args)</code> 等价于 <code>f(1, 2, 3)</code>；<code>f(**kwargs)</code> 等价于 <code>f(a=1, b=2, c=3)</code></li>
<li>❌ <code>f(**{"a": 1, "x": 2})</code> TypeError：字典里有多余的键</li></ul>`,
      code: String.raw`def f(a, b, c):
    print(a, b, c)

f(1, 2, 3)              # 全位置
f(1, b=2, c=3)          # 位置 + 关键字（关键字必须放在位置之后）
# f(a=1, 2, 3)          # ❌ SyntaxError：位置参数不能跟在关键字参数后面
# f(1, a=1, c=3)        # ❌ TypeError：a 同时按位置和关键字传了两次 ⭐
# f(1, 2, 3, 4)         # ❌ TypeError：参数数量对不上

# 解包调用：* 拆序列当位置参数，** 拆字典当关键字参数
args = (1, 2, 3)
f(*args)                      # 等价于 f(1, 2, 3)
kwargs = {"a": 1, "b": 2, "c": 3}
f(**kwargs)                   # 等价于 f(a=1, b=2, c=3)
# f(**{"a": 1, "x": 2})       # ❌ TypeError：字典里有多余的键`,
    },
    {
      id: "4_4", title: "§4.4 作用域（LEGB）与 global / nonlocal", desc: "L→E→G→B 查找顺序、global 改全局、nonlocal 改外层、⭐改对象内部不需要声明",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/classes.html#python-scopes-and-namespaces",
      html: `<ul>
<li>名字查找顺序 <b>LEGB</b>：<b>L</b>ocal（函数内）→ <b>E</b>nclosing（外层函数）→ <b>G</b>lobal（模块全局）→ <b>B</b>uiltins（内置）</li>
<li>⭐ <code>global count</code>：声明"我要修改全局的那个 count"——没有 global 时函数里 <code>count += 1</code> 会报 <code>UnboundLocalError</code>（赋值使名字变成本地变量，而 += 又要先读它）</li>
<li>⭐ <code>nonlocal n</code>：声明"我要修改外层函数的 n"（嵌套函数场景，闭包见 §19.4）</li>
<li>⭐ <b>关键区分</b>：<b>"修改对象内部"不需要声明，"重新绑定名字"才需要</b>——<code>nums.append(1)</code> 合法（改列表内容）；<code>nums = []</code> 没有 global 声明时会把 nums 变成本地变量</li></ul>`,
      code: String.raw`count = 0                  # 全局变量

def inc():
    global count           # ⭐ 声明：我要修改全局的那个 count
    count += 1             # 没有 global 的话，这行会报 UnboundLocalError

inc()
inc()
print(count)               # 2

def outer():
    n = 0
    def inner():
        nonlocal n         # ⭐ 声明：我要修改外层函数的 n
        n += 1
        return n
    return inner

counter = outer()
print(counter(), counter())   # 1 2

nums = []

def push():
    nums.append(1)    # ✅ 合法：修改列表内容，不涉及重新绑定
    # nums = []       # ❌ 没有 global 声明时，这会把 nums 变成本地变量

push()
print(nums)`,
    },
    {
      id: "4_5", title: "§4.5 lambda 匿名函数", desc: "只有一个表达式、用完即扔、⭐最常见用途是排序 key、复杂逻辑写 def",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/controlflow.html#lambda-expressions",
      html: `<ul>
<li><code>lambda 参数: 表达式</code>——只能写<b>一个表达式</b>，适合"用完即扔"的小函数；逻辑稍复杂就老老实实写 def</li>
<li>⭐ 最常见用途：排序/处理的 key——<code>sorted(words, key=lambda w: len(w))</code> 按长度排；<code>pairs.sort(key=lambda p: p[1])</code> 按第二个元素排</li>
<li>⭐ 循环里造 lambda 的坑（延迟绑定）：闭包记住的是变量本身而不是当时的值，见 §19.4 闭包</li></ul>`,
      code: String.raw`add = lambda a, b: a + b
print(add(2, 3))          # 5

words = ["bb", "a", "ccc"]
print(sorted(words, key=lambda w: len(w)))   # ['a', 'bb', 'ccc'] ⭐ 最常见用途

pairs = [(1, "b"), (2, "a")]
pairs.sort(key=lambda p: p[1])               # 按第二个元素排序
print(pairs)`,
    },
    {
      id: "4_6", title: "§4.6 函数注解（简介）", desc: ": 类型与 -> 返回值注解、⭐注解不影响运行、给人类和 mypy 看、存进 __annotations__",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/controlflow.html#function-annotations",
      html: `<ul>
<li>写法：<code>def add(a: int, b: int) -> int:</code>——参数后写 <code>: 类型</code>，返回值前写 <code>-> 类型</code></li>
<li>⭐ 注解<b>不影响运行</b>：写错类型照样能跑——它是给人类和 mypy 等检查工具看的"说明书"，真正检查靠工具</li>
<li>注解存进 <code>__annotations__</code>；完整体系见第 13 层</li></ul>`,
      code: String.raw`def add(a: int, b: int) -> int:
    return a + b

print(add(2, 3))              # 5
print(add("1", "2"))          # 12 ⭐ 注解不影响运行，类型不对照样跑
print(add.__annotations__)    # 注解存进 __annotations__`,
    },
    {
      id: "4_7", title: "§4.7 递归", desc: "函数调用自己、⭐必须有终止条件、默认深度约 1000 层 RecursionError、setrecursionlimit",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/controlflow.html#defining-functions",
      html: `<ul>
<li>函数调用自己；⭐ <b>递归必须有终止条件</b>（如 <code>if n <= 1: return 1</code>），否则无限递归</li>
<li>默认递归深度约 1000 层，超过报 <code>RecursionError</code></li>
<li>可 <code>sys.setrecursionlimit(10**5)</code> 调整（深度优先遍历等场景）</li></ul>`,
      code: String.raw`def factorial(n):
    if n <= 1:            # ⭐ 递归必须有终止条件
        return 1
    return n * factorial(n - 1)

print(factorial(5))       # 120

import sys
print(sys.getrecursionlimit())   # 默认约 1000 层，超过报 RecursionError
# sys.setrecursionlimit(10 ** 5)   # 深度优先遍历等场景可调大`,
    },
  ],
});
