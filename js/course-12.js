/* ===== 课程内容数据 · 第十二层 =====
 * 内容来源：《Python 3 语法完全指南》（outputs/python-syntax-guide.md）第十二层 · 装饰器与上下文管理器。
 * 写法规范与 data-course.js 一致：section.id 即指南小节号；points 为分条要点（内联 <code>/<b>）；
 * code 示例均经本地 Python 实际运行验证（tools/verify_examples.py）；expect 为真实输出。
 * 适用版本：3.8—3.14 ｜ 最后核对：2026-09
 */
COURSE.push({
  id: 12,
  title: "第十二层 · 装饰器与上下文管理器",
  minutes: 55,
  goal: "理解装饰器本质并能手写，会用 @contextmanager 与 contextlib 内置工具",
  prereq: "第四层（函数）与第七层（面向对象）",
  versions: "3.8—3.14",
  checked: "2026-09",
  sections: [
    {
      id: "12.1", title: "函数即对象：装饰器的地基",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/controlflow.html#defining-functions",
      points: [
        "函数在 Python 里是<b>一等对象</b>：能赋给变量、当参数传递、当返回值返回",
        "<code>hello</code> 不加括号拿到的是函数本身；加了括号才是执行",
        "函数里还能定义函数（嵌套），内层函数能<b>记住</b>外层的变量——这叫闭包",
        "装饰器没有任何黑魔法：就是把这三板斧组合起来",
      ],
      code: String.raw`def hello():
    return "你好"

f = hello          # 函数赋给变量，没加括号
print(f())         # 通过新名字调用
print(hello is f)  # 同一个对象

def make_adder(n):
    def adder(x):
        return x + n    # 内层函数记住了外层的 n
    return adder

add3 = make_adder(3)
print(add3(10))`,
      expect: "你好\nTrue\n13",
      note: "把 add3(10) 换成 make_adder(3)(10)——一回事，只是没存中间变量。",
    },
    {
      id: "12.2", title: "最简装饰器：@ 只是语法糖",
      doc: "https://docs.python.org/zh-cn/3.14/glossary.html#term-decorator",
      points: [
        "<code>@loud</code> 写在 def 上面，完全等价于 <code>hello = loud(hello)</code>",
        "装饰器 = <b>接收函数、返回新函数</b>的函数；新函数（wrapper）包住原函数",
        "wrapper 在原函数前后插入额外逻辑，最后 return 原函数的结果",
        "⭐ 多个装饰器<b>从下往上</b>包装：<code>@a @b</code> → <code>f = a(b(f))</code>，最贴近 def 的先应用",
      ],
      code: String.raw`def loud(func):
    def wrapper():
        return func() + "！"
    return wrapper

@loud
def hello():
    return "你好"
# 上面等价于：hello = loud(hello)
print(hello())

def a(f):
    return lambda: "A(" + f() + ")"
def b(f):
    return lambda: "B(" + f() + ")"

@a
@b
def core():
    return "芯"

print(core())      # b 先包装，a 再包装`,
      expect: "你好！\nA(B(芯))",
      note: "把 @loud 删掉，手动写 hello = loud(hello)，输出一模一样——语法糖而已。",
    },
    {
      id: "12.3", title: "functools.wraps：别把原函数弄丢",
      doc: "https://docs.python.org/zh-cn/3.14/library/functools.html#functools.wraps",
      points: [
        "被装饰后，<code>add</code> 这个名字其实指向 wrapper：<code>__name__</code>、<code>__doc__</code> 全丢了",
        "⭐ 写装饰器<b>必写</b> <code>@functools.wraps(func)</code>：把原函数的元信息复制回 wrapper",
        "wrapper 用 <code>*args, **kwargs</code> 接住任意参数，原样转交给原函数",
        "少了 wraps 平时不显形，一旦用 help()、自省或框架注册就露馅",
      ],
      code: String.raw`import functools

def trace(func):
    @functools.wraps(func)          # ⭐ 保留原函数的元信息
    def wrapper(*args, **kwargs):
        print("调用", func.__name__)
        return func(*args, **kwargs)
    return wrapper

@trace
def add(a, b):
    """两个数相加。"""
    return a + b

print(add(2, 3))
print(add.__name__)
print(add.__doc__)`,
      expect: "调用 add\n5\nadd\n两个数相加。",
      note: "把 @functools.wraps(func) 删掉再运行，看 add.__name__ 变成了什么。",
    },
    {
      id: "12.4", title: "带参数的装饰器：三层套娃",
      doc: "https://docs.python.org/zh-cn/3.14/glossary.html#term-decorator",
      points: [
        "<code>@repeat(3)</code> 会先调用 <code>repeat(3)</code> 拿到真正的装饰器，再去装饰函数",
        "所以比普通装饰器<b>多包一层</b>：参数层 → 装饰层 → 包装层，三层函数嵌套",
        "记忆法：装饰器本身要参数，就在外面再套一个收参数的函数",
        "⭐ 老规矩不变：最里层 wrapper 仍要 <code>@functools.wraps</code> 保住元信息",
      ],
      code: String.raw`import functools

def repeat(times):                  # 第一层：收装饰器自己的参数
    def decorator(func):            # 第二层：收被装饰的函数
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(times):
                func(*args, **kwargs)
        return wrapper
    return decorator

@repeat(3)          # 先 repeat(3)，再装饰 hi
def hi(name):
    print("hi", name)

hi("小明")`,
      expect: "hi 小明\nhi 小明\nhi 小明",
      note: "把 @repeat(3) 改成 @repeat(1)，再试试不用 @：repeat(2)(hi)(\"喂\")。",
    },
    {
      id: "12.5", title: "@contextmanager：用生成器写 with",
      doc: "https://docs.python.org/zh-cn/3.14/library/contextlib.html#contextlib.contextmanager",
      points: [
        "with 的原理：对象实现 <code>__enter__</code> / <code>__exit__</code> 即可（文件就是这么干的）",
        "<code>@contextmanager</code> 让你用<b>生成器</b>写一个：yield 之前是进入逻辑，之后是收尾",
        "<code>as</code> 后面的变量 = yield 出来的值",
        "⭐ with 块里抛的异常会在 yield 处重新抛出——用 <code>try/finally</code> 保证收尾一定执行",
      ],
      code: String.raw`from contextlib import contextmanager

@contextmanager
def banner():
    print("—— 开始 ——")
    try:
        yield "内部变量"       # 绑定给 as 后的名字
    finally:
        print("—— 结束 ——")  # 无论是否异常都执行

with banner() as v:
    print("使用中，", v)`,
      expect: "—— 开始 ——\n使用中， 内部变量\n—— 结束 ——",
      note: "在 with 块里加一行 raise ValueError(\"x\") 看看——结束横幅照样打印。",
    },
    {
      id: "12.6", title: "内置好帮手：suppress 与 redirect_stdout",
      doc: "https://docs.python.org/zh-cn/3.14/library/contextlib.html",
      points: [
        "<code>contextlib.suppress(某异常)</code>：安静吞掉指定异常，程序继续走",
        "<code>redirect_stdout(buf)</code>：把 print 抓进 <code>io.StringIO</code>，测试与收集输出都靠它",
        "还有 <code>ExitStack</code>：动态管理数量不定的多个上下文",
        "顺带一提：<code>@staticmethod</code> / <code>@classmethod</code> 也是内置装饰器（第七层已见过）",
      ],
      code: String.raw`from contextlib import suppress, redirect_stdout
import io

with suppress(FileNotFoundError):   # 安静忽略指定异常
    raise FileNotFoundError("不存在的文件")
print("程序没崩")

buf = io.StringIO()
with redirect_stdout(buf):          # 把 print 重定向到 buf
    print("这句话进了缓冲区")
print("抓到：", buf.getvalue().strip())`,
      expect: "程序没崩\n抓到： 这句话进了缓冲区",
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
