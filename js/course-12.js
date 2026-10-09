/* ===== 课程内容数据 · 第十二层 =====
 * 内容来源：《Python 3 语法完全指南》（outputs/python-syntax-guide.md）第十二层 · 装饰器与上下文管理器。
 * 写法规范：section.id 即指南小节号；points 为分条要点（内联 <code>/<b>）；
 * 【对应规范】points 每条要点必须在 code 中有明确对应：可演示的写成可运行代码并配注释；
 * 错误/危险示范以「故意注释掉」的形式呈现（学员可取消注释亲测报错）；
 * code 示例均经本地 Python 实际运行验证（tools/verify_examples.py + verify_expects.py）；expect 为真实输出。
 * 适用版本：3.8—3.14 ｜ 最后核对：2026-10
 */
COURSE.push({
  id: 12,
  title: "第十二层 · 装饰器与上下文管理器",
  minutes: 55,
  goal: "理解装饰器本质并能手写，会用 @contextmanager 与 contextlib 内置工具",
  prereq: "第四层（函数）与第七层（面向对象）",
  versions: "3.8—3.14",
  checked: "2026-10",
  sections: [
    {
      id: "12.1", title: "函数即对象：装饰器的地基",
      use: "函数能赋给变量、当参数传、还能记住外层变量（闭包）。这三板斧不熟，后面的装饰器看一百遍也像黑魔法。",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/controlflow.html#defining-functions",
      points: [
        "函数在 Python 里是<b>一等对象</b>：能赋给变量、当参数传递、当返回值返回",
        "<code>hello</code> 不加括号拿到的是函数本身；加了括号才是执行",
        "函数里还能定义函数（嵌套），内层函数能<b>记住</b>外层的变量——这叫闭包",
        "装饰器没有任何黑魔法：就是把这三板斧组合起来",
      ],
      code: String.raw`def hello():
    return "你好"

f = hello          # 一等对象：函数赋给变量；不加括号拿到函数本身，加括号才是执行
print(f())         # 通过新名字调用
print(hello is f)  # 同一个对象

def call_twice(func):      # 一等对象：函数还能当【参数】传递
    return func() + func()
print(call_twice(hello))

def make_adder(n):
    def adder(x):
        return x + n    # 嵌套：内层函数【记住】了外层的变量 n —— 这就是闭包
    return adder        # 一等对象：函数也能当【返回值】返回

add3 = make_adder(3)
print(add3(10))
# 装饰器没有任何黑魔法：就是把「赋给变量、当参数、当返回值」三板斧组合起来（下节见）`,
      expect: "你好\nTrue\n你好你好\n13",
      note: "把 add3(10) 换成 make_adder(3)(10)——一回事，只是没存中间变量。",
    },
    {
      id: "12.2", title: "最简装饰器：@ 只是语法糖",
      use: "想给一批函数统一加「前后动作」（打日志、计时）又不改动原函数，就用 @。它完全等价于 f = deco(f)，没有黑魔法。",
      doc: "https://docs.python.org/zh-cn/3.14/glossary.html#term-decorator",
      points: [
        "<code>@loud</code> 写在 def 上面，完全等价于 <code>hello = loud(hello)</code>",
        "装饰器 = <b>接收函数、返回新函数</b>的函数；新函数（wrapper）包住原函数",
        "wrapper 在原函数前后插入额外逻辑，最后 return 原函数的结果",
        "⭐ 多个装饰器<b>从下往上</b>包装：<code>@a @b</code> → <code>f = a(b(f))</code>，最贴近 def 的先应用",
      ],
      code: String.raw`def loud(func):             # 装饰器 = 接收函数、返回新函数的函数
    def wrapper():          # 新函数 wrapper 包住原函数
        print("（前）先插一脚")    # wrapper 在原函数【前】插入额外逻辑
        result = func()     # 调用原函数
        print("（后）再补一刀")    # 在原函数【后】插入额外逻辑
        return result + "！"    # 最后 return 原函数的结果（加工后）
    return wrapper

@loud
def hello():
    return "你好"
# hello = loud(hello)    # 等价写法（故意注释掉）：@loud 完全就是这句的语法糖
print(hello())

def a(f):
    return lambda: "A(" + f() + ")"
def b(f):
    return lambda: "B(" + f() + ")"

@a
@b                      # ⭐ 多个装饰器【从下往上】包装：core = a(b(core))，最贴近 def 的先应用
def core():
    return "芯"

print(core())`,
      expect: "（前）先插一脚\n（后）再补一刀\n你好！\nA(B(芯))",
      note: "把 @loud 删掉，手动写 hello = loud(hello)，输出一模一样——语法糖而已。",
    },
    {
      id: "12.3", title: "functools.wraps：别把原函数弄丢",
      use: "自己写装饰器时的必带配件：少了它，被装饰函数的名字和文档全丢，help() 一看就露馅。wrapper 里配 *args、**kwargs 通吃任意参数。",
      doc: "https://docs.python.org/zh-cn/3.14/library/functools.html#functools.wraps",
      points: [
        "被装饰后，<code>add</code> 这个名字其实指向 wrapper：<code>__name__</code>、<code>__doc__</code> 全丢了",
        "⭐ 写装饰器<b>必写</b> <code>@functools.wraps(func)</code>：把原函数的元信息复制回 wrapper",
        "wrapper 用 <code>*args, **kwargs</code> 接住任意参数，原样转交给原函数",
        "少了 wraps 平时不显形，一旦用 help()、自省或框架注册就露馅",
      ],
      code: String.raw`import functools

def trace(func):
    @functools.wraps(func)          # ⭐ 必写：把原函数的元信息复制回 wrapper
    def wrapper(*args, **kwargs):   # *args, **kwargs 接住任意参数，原样转交原函数
        print("调用", func.__name__)
        return func(*args, **kwargs)
    return wrapper

@trace
def add(a, b):
    """两个数相加。"""
    return a + b

print(add(2, 3))
print(add.__name__)    # 有 wraps：名字还是 "add"
print(add.__doc__)     # 有 wraps：文档字符串还在

# 删掉上面那行 @functools.wraps(func) 再跑：add 这个名字其实指向 wrapper，
# add.__name__ 会变成 "wrapper"、add.__doc__ 变成 None（元信息全丢）。
# 平时不显形，一旦用 help()、自省或框架注册就露馅——可亲手注释掉验证`,
      expect: "调用 add\n5\nadd\n两个数相加。",
      note: "把 @functools.wraps(func) 删掉再运行，看 add.__name__ 变成了什么。",
    },
    {
      id: "12.4", title: "带参数的装饰器：三层套娃",
      use: "想让装饰器本身也能收参数（比如 @repeat(3) 控制重复几次）时，就在外面再套一层。看到三层嵌套别慌，就是参数层、装饰层、包装层这个套路。",
      doc: "https://docs.python.org/zh-cn/3.14/glossary.html#term-decorator",
      points: [
        "<code>@repeat(3)</code> 会先调用 <code>repeat(3)</code> 拿到真正的装饰器，再去装饰函数",
        "所以比普通装饰器<b>多包一层</b>：参数层 → 装饰层 → 包装层，三层函数嵌套",
        "记忆法：装饰器本身要参数，就在外面再套一个收参数的函数",
        "⭐ 老规矩不变：最里层 wrapper 仍要 <code>@functools.wraps</code> 保住元信息",
      ],
      code: String.raw`import functools

def repeat(times):                  # 第一层（参数层）：收装饰器自己的参数
    def decorator(func):            # 第二层（装饰层）：收被装饰的函数
        @functools.wraps(func)      # ⭐ 老规矩不变：最里层 wrapper 仍要保住元信息
        def wrapper(*args, **kwargs):   # 第三层（包装层）：真正干活的 wrapper
            for _ in range(times):
                func(*args, **kwargs)
        return wrapper
    return decorator

@repeat(3)          # 先调用 repeat(3) 拿到真正的装饰器 decorator，再去装饰 hi
def hi(name):
    print("hi", name)
# hi = repeat(3)(hi)    # 等价写法（故意注释掉）：装饰器本身要参数，就在外面再套一个收参数的函数

hi("小明")`,
      expect: "hi 小明\nhi 小明\nhi 小明",
      note: "把 @repeat(3) 改成 @repeat(1)，再试试不用 @：repeat(2)(hi)(\"喂\")。",
    },
    {
      id: "12.5", title: "@contextmanager：用生成器写 with",
      use: "想自己发明一个 with 语句（进入时做准备、退出时必收尾）时用。写一个带 yield 的函数就行，不必手写 __enter__/__exit__ 的类。",
      doc: "https://docs.python.org/zh-cn/3.14/library/contextlib.html#contextlib.contextmanager",
      points: [
        "with 的原理：对象实现 <code>__enter__</code> / <code>__exit__</code> 即可（文件就是这么干的）",
        "<code>@contextmanager</code> 让你用<b>生成器</b>写一个：yield 之前是进入逻辑，之后是收尾",
        "<code>as</code> 后面的变量 = yield 出来的值",
        "⭐ with 块里抛的异常会在 yield 处重新抛出——用 <code>try/finally</code> 保证收尾一定执行",
      ],
      code: String.raw`from contextlib import contextmanager

# with 的原理：对象实现 __enter__ / __exit__ 即可（文件就是这么干的）；
# @contextmanager 让你用【生成器】写一个，不必手写类
@contextmanager
def banner():
    print("—— 开始 ——")      # yield 之前 = 进入逻辑（相当于 __enter__）
    try:
        yield "内部变量"       # as 后面的变量 = yield 出来的值
    finally:
        print("—— 结束 ——")  # ⭐ yield 之后 = 收尾；块里异常会在 yield 处重新抛出，finally 保证收尾必执行

with banner() as v:
    print("使用中，", v)

# with banner() as v2:
#     raise ValueError("炸了")   # 错误示范（故意注释掉）：取消注释可见——结束横幅照打，异常随后继续抛出`,
      expect: "—— 开始 ——\n使用中， 内部变量\n—— 结束 ——",
      note: "在 with 块里加一行 raise ValueError(\"x\") 看看——结束横幅照样打印。",
    },
    {
      id: "12.6", title: "内置好帮手：suppress 与 redirect_stdout",
      use: "两个即取即用的现成工具：某些异常「知道了、不用管」时用 suppress 安静跳过；想抓住 print 的输出做测试，用 redirect_stdout。",
      doc: "https://docs.python.org/zh-cn/3.14/library/contextlib.html",
      points: [
        "<code>contextlib.suppress(某异常)</code>：安静吞掉指定异常，程序继续走",
        "<code>redirect_stdout(buf)</code>：把 print 抓进 <code>io.StringIO</code>，测试与收集输出都靠它",
        "还有 <code>ExitStack</code>：动态管理数量不定的多个上下文",
        "顺带一提：<code>@staticmethod</code> / <code>@classmethod</code> 也是内置装饰器（速查表 §7.2 已见过）",
      ],
      code: String.raw`from contextlib import suppress, redirect_stdout, ExitStack
import io

with suppress(FileNotFoundError):   # suppress(某异常)：安静吞掉指定异常，程序继续走
    raise FileNotFoundError("不存在的文件")
print("程序没崩")

buf = io.StringIO()
with redirect_stdout(buf):          # redirect_stdout：把 print 抓进 io.StringIO（测试/收集输出靠它）
    print("这句话进了缓冲区")
print("抓到：", buf.getvalue().strip())

with ExitStack() as stack:          # ExitStack：动态管理数量不定的多个上下文
    stack.enter_context(suppress(ValueError))   # 运行时想登记几个就登记几个
    stack.enter_context(suppress(KeyError))
    raise ValueError("照样被吞")
print("ExitStack 收工")

# 顺带一提：@staticmethod / @classmethod 也是内置装饰器（速查表 §7.2 已见过）`,
      expect: "程序没崩\n抓到： 这句话进了缓冲区\nExitStack 收工",
      note: "用 suppress(ZeroDivisionError) 包住 1 / 0，体会「安静跳过」。",
    },
  ],
  quiz: [
    { q: "@deco 写在 def f 上面，完全等价于？",
      options: ["f = deco(f)", "deco = f(deco)", "f = deco()", "import deco"], answer: 0,
      explain: "@ 只是语法糖：把 f 传给 deco，再把返回的新函数绑回 f 这个名字。" },
    { q: "@a、@b 两个装饰器叠在 def f 上面，包装顺序是？",
      options: ["a 先包装，b 后包装", "b 先包装 f，a 包在最外层", "谁写在上面谁先包装", "两个装饰器互相包装"], answer: 1,
      explain: "从下往上包装：f = a(b(f))——最贴近 def 的 b 先应用，调用时则从 a 进入。" },
    { q: "装饰器里 @functools.wraps(func) 的作用是？",
      options: ["让装饰器运行更快", "阻止原函数被外部调用", "保留原函数的 __name__、__doc__ 等元信息", "让装饰器可以带参数"], answer: 2,
      explain: "装饰后名字指向 wrapper，wraps 把原函数的元信息复制回来，help() 与自省才不会露馅。" },
  ],
});
