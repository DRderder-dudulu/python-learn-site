/* ===== 速查·第十二层 · 装饰器与上下文管理器（§12.1—§12.2） =====
 * 内容来源：《Python 3 语法完全指南》第十二层（outputs/python-syntax-guide-v1.md），1:1 对齐小节；
 * 示例与课程 §12.x 一致或取自指南，均可运行（课程按教学节奏拆成 6 节，本速查按指南 2 小节组织）。
 * 适用版本：3.8—3.14 ｜ 语言规则以 Python 官方文档为准。
 */
CHEATSHEET_ADV.push({
  layerId: 12,
  layer: "第十二层 · 装饰器与上下文管理器",
  stage: "二",
  topics: [
    {
      id: "12_1", title: "§12.1 装饰器（decorator）", desc: "@ 是 f=deco(f) 语法糖、从下往上包装、functools.wraps 必写、带参数三层嵌套、类实现 __call__ 当装饰器",
      doc: "https://docs.python.org/zh-cn/3.14/glossary.html#term-decorator",
      html: `<p><b>本质</b>：<code>@装饰器</code> 是语法糖——</p>
<pre>@deco
def f():
    ...
# 完全等价于：
def f():
    ...
f = deco(f)</pre>
<ul>
<li>地基：函数是<b>一等对象</b>（能赋给变量、当参数传递、当返回值返回）+ 内层函数能<b>记住</b>外层变量的<b>闭包</b>——装饰器没有任何黑魔法</li>
<li><b>自己写一个</b>：内层 <code>wrapper(*args, **kwargs)</code> 包住原函数，调用前后插入额外逻辑，最后 return 原函数的结果</li>
<li>⭐ 写装饰器<b>必写</b> <code>@functools.wraps(func)</code>：把原函数的 <code>__name__</code>、<code>__doc__</code> 等元信息复制回 wrapper——少了它平时不显形，一旦用 help()、自省或框架注册就露馅</li>
<li>⭐ <b>多个装饰器从下往上包装</b>（最贴近 def 的先应用），调用时从上往下进入：<code>@a @b</code> → <code>f = a(b(f))</code>，b 先包装 f，a 再包装 b 的结果</li>
<li><b>带参数的装饰器</b> = 三层函数嵌套（参数层 → 装饰层 → 包装层）：<code>@repeat(3)</code> 会先调用 <code>repeat(3)</code> 拿到真正的装饰器，再去装饰函数；最里层 wrapper 仍要 <code>@functools.wraps</code> 保住元信息</li>
<li>类实现 <code>__call__</code> 即可当装饰器；装饰器也可以接收类并返回修改后的类（<code>@dataclass</code> 就是这么干的）</li></ul>`,
      code: String.raw`import functools, time

# 自己写一个：内层 wrapper 包住原函数，调用前后插入额外逻辑
def timer(func):
    @functools.wraps(func)     # ⭐ 必写：保留原函数的 __name__、__doc__
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)   # 调用原函数
        print(f"{func.__name__} 耗时 {time.perf_counter() - start:.4f}s")
        return result
    return wrapper

@timer                       # 等价于：slow = timer(slow)
def slow():
    """会被 wraps 保留的文档"""
    time.sleep(0.05)

slow()
print(slow.__name__)         # slow（没 wraps 会变 wrapper）

# ⭐ 多个装饰器从下往上包装：f = a(b(f))，b 先包装，a 包在最外层
def a(f):
    return lambda: "A(" + f() + ")"
def b(f):
    return lambda: "B(" + f() + ")"

@a
@b
def core():
    return "芯"

print(core())                # A(B(芯))

# 带参数的装饰器：三层嵌套（参数层 → 装饰层 → 包装层）
def repeat(times):                  # 第一层：收装饰器自己的参数
    def decorator(func):            # 第二层：收被装饰的函数
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(times):
                func(*args, **kwargs)
        return wrapper
    return decorator

@repeat(3)          # 先调用 repeat(3) 得到 decorator，再装饰 hi
def hi(name):
    print("hi", name)

hi("小明")`,
    },
    {
      id: "12_2", title: "§12.2 上下文管理器（with 的原理）", desc: "__enter__/__exit__ 协议、返回 True 吞异常、@contextmanager 生成器写法、suppress/redirect_stdout/closing/ExitStack",
      doc: "https://docs.python.org/zh-cn/3.14/library/contextlib.html#contextlib.contextmanager",
      html: `<ul>
<li>任何实现了 <code>__enter__</code> / <code>__exit__</code> 的对象都能用于 <code>with</code>（文件就是这么干的）：__enter__ 在进入 with 块时调用，<b>返回值绑定给 as 后的名字</b>；__exit__ 在离开块时调用（<b>无论是否异常</b>），签名 <code>__exit__(self, exc_type, exc_val, exc_tb)</code></li>
<li>⭐ <code>__exit__</code> 返回 True 会<b>吞掉异常</b>——谨慎使用（返回 False/None 则正常向外传播）</li>
<li>⭐ <code>@contextmanager</code> 用<b>生成器</b>快速写一个：yield 之前是 __enter__ 的逻辑，<b>yield 出来的值</b>绑定给 as 后的名字；with 块里抛的异常会在 yield 处<b>重新抛出</b>——用 <code>try/finally</code> 保证收尾一定执行</li>
<li><b>contextlib 其他好帮手</b>：<code>suppress(某异常)</code> 安静忽略指定异常｜<code>redirect_stdout(buf)</code> 把 print 抓进 <code>io.StringIO</code>（测试与收集输出都靠它）｜<code>closing()</code> 给没有 __exit__ 的对象补上 close 调用｜<code>ExitStack</code> 动态管理"数量不定"的多个上下文（<code>stack.enter_context(...)</code>）</li>
<li>顺带一提：<code>@staticmethod</code> / <code>@classmethod</code> 也是内置装饰器（速查表 §7.2 已见过）</li></ul>`,
      code: String.raw`import os, io, time
from contextlib import contextmanager, suppress, redirect_stdout, ExitStack

# 类实现 __enter__ / __exit__ 即可用于 with
class MyResource:
    def __enter__(self):          # 进入 with 块时调用，返回值绑定给 as 后的名字
        print("打开资源")
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):   # 离开块时调用（无论是否异常）
        print("关闭资源")
        return False              # 返回 True 会吞掉异常 ⭐ 谨慎使用

with MyResource() as r:
    print("使用中")
# 打开资源 → 使用中 → 关闭资源

# ⭐ @contextmanager：用生成器快速写一个
@contextmanager
def timer():
    start = time.perf_counter()
    try:
        yield            # yield 之前是 __enter__ 的逻辑；with 块在这里执行
    finally:             # with 块里抛的异常会在 yield 处重新抛出，finally 保证收尾
        print(f"耗时 {time.perf_counter() - start:.4f}s")

with timer():
    time.sleep(0.05)

with suppress(FileNotFoundError):     # 安静忽略指定异常
    os.remove("_tmp_no_such_file.txt")
print("没被异常打断")

buf = io.StringIO()
with redirect_stdout(buf):            # 把 print 重定向到 buf
    print("不会显示在屏幕")
print("抓到：", buf.getvalue().strip())

# ExitStack：动态管理"数量不定"的上下文
with open("_tmp_a.txt", "w", encoding="utf-8") as f:
    f.write("x")
with ExitStack() as stack:
    files = [stack.enter_context(open(p, encoding="utf-8")) for p in ["_tmp_a.txt"]]
    print(files[0].read())
os.remove("_tmp_a.txt")              # 清理临时文件`,
    },
  ],
});
