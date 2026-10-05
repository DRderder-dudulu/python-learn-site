/* ===== 速查版进阶内容：第 7、9—20 层（核心语法） =====
 * 逐条对齐《Python 3 语法完全指南》（outputs/python-syntax-guide.md）对应小节，
 * 与课程数据（第 1—6、8 层）共同构成覆盖核心语法的完整速查；
 * 第三方库（第 21 层）单独维护，见 data-libraries.js。
 * 适用版本 3.8—3.14 ｜ 最后核对 2026-09 ｜ 语言规则以 Python 官方文档为准。
 */
const CHEATSHEET_ADV = [
  {
    layer: "第七层 · 面向对象",
    stage: "二",
    topics: [
      {
        id: "7_1", title: "§7.1 类与实例", desc: "class 定义、__init__、类属性 vs 实例属性、可变类属性陷阱",
        html: `<ul>
<li><code>class 名字:</code> 定义类；<code>对象 = 类名(参数)</code> 实例化（self 自动传入）</li>
<li>⭐ <code>__init__</code> <b>不创建对象</b>：实例由 __new__ 先建好，__init__ 只做初始化（赋初值），必须返回 None</li>
<li>类属性写在类体里，<b>所有实例共享</b>；实例属性写在 __init__ 里（self.xxx），每个实例独立</li>
<li>⭐⭐ <b>可变类属性陷阱</b>：类体里写 <code>tags = []</code> 会被所有实例共享——可变属性一律放 __init__ 里</li>
<li>self 只是约定俗成的名字，但请遵守惯例</li></ul>`,
        code: String.raw`class Dog:
    species = "犬科"              # 类属性：所有实例共享

    def __init__(self, name, age):
        self.name = name          # 实例属性：每个实例各一份
        self.age = age

    def bark(self):
        return f"{self.name}：汪汪！"

d = Dog("旺财", 3)
print(d.bark())
print(d.species)                  # 实例也能读类属性`,
      },
      {
        id: "7_2", title: "§7.2 三种方法", desc: "实例方法 / @classmethod / @staticmethod",
        html: `<table><tr><th>种类</th><th>第一个参数</th><th>用途</th></tr>
<tr><td>实例方法</td><td><code>self</code>（实例）</td><td>操作某个具体实例（默认）</td></tr>
<tr><td>@classmethod</td><td><code>cls</code>（类本身）</td><td>操作类；常做"备选构造函数"（如 from_string）</td></tr>
<tr><td>@staticmethod</td><td>无</td><td>只是寄放在类里的普通工具函数</td></tr></table>
<p>调用：实例方法用对象调；后两者用类或对象调都行。</p>`,
        code: String.raw`class MyClass:
    def instance_method(self):
        return "实例方法"

    @classmethod
    def from_string(cls, s):
        return cls()              # 备选构造

    @staticmethod
    def is_valid(x):
        return x > 0

obj = MyClass()
print(obj.instance_method())
print(MyClass.from_string("x") is not None)
print(MyClass.is_valid(5))`,
      },
      {
        id: "7_3", title: "§7.3 属性访问控制与 @property", desc: "单/双下划线约定、名称改写、property 校验",
        html: `<ul>
<li>Python 没有真正的 private，只有约定：<code>_x</code> = "内部使用"（君子协定）</li>
<li>⭐ <code>__x</code> 双下划线触发<b>名称改写</b>：变成 <code>_类名__x</code>——防误触，不是真私有（_User__secret 仍能访问）</li>
<li><code>@property</code> 把方法伪装成属性：读取时自动计算；配 <code>@x.setter</code> 可在赋值时校验</li></ul>`,
        code: String.raw`class Circle:
    def __init__(self, radius):
        self.radius = radius

    @property
    def area(self):                       # 读：c.area（不加括号）
        return 3.14159 * self.radius ** 2

    @property
    def radius(self):
        return self._radius

    @radius.setter                        # 写：c.radius = x 时校验
    def radius(self, value):
        if value < 0:
            raise ValueError("半径不能为负")
        self._radius = value

c = Circle(2)
print(c.area)
c.radius = 3
print(c.area)`,
      },
      {
        id: "7_4", title: "§7.4 继承、MRO 与抽象基类", desc: "super()、C3 线性化、ABC",
        html: `<ul>
<li><code>class 子类(父类):</code> 继承；子类实例也是父类的实例（isinstance 为 True）</li>
<li><code>super().方法()</code> 调用父类版本；重写同名方法即覆盖</li>
<li>⭐ 多继承查找顺序由 <b>C3 线性化</b>决定：<code>类名.__mro__</code> 或 <code>类名.mro()</code> 可查看，不用背算法</li>
<li>抽象基类 ABC：有 @abstractmethod 的类<b>不能实例化</b>，强制子类实现</li></ul>`,
        code: String.raw`class A:
    def who(self):
        return "A"
class B(A):
    def who(self):
        return "B"
class C(A):
    def who(self):
        return "C"
class D(B, C):
    pass

print(D().who())                        # B：按 MRO 找到的第一个
print([c.__name__ for c in D.__mro__])  # 查看完整查找顺序

from abc import ABC, abstractmethod
class Shape(ABC):
    @abstractmethod
    def area(self):
        ...
try:
    Shape()
except TypeError as e:
    print("不能实例化抽象类")`,
      },
      {
        id: "7_5", title: "§7.5 魔术方法速查", desc: "让自定义对象支持内置语法",
        html: `<table><tr><th>魔术方法</th><th>对应语法</th></tr>
<tr><td>__init__ / __new__</td><td>初始化 / 创建实例</td></tr>
<tr><td>__str__ / __repr__</td><td>print() 用户视角 / repr() 开发者视角 ⭐</td></tr>
<tr><td>__len__ / __bool__</td><td>len() / 真值测试</td></tr>
<tr><td>__getitem__ / __setitem__</td><td>obj[i] 读 / 写</td></tr>
<tr><td>__contains__</td><td>x in obj</td></tr>
<tr><td>__iter__ / __next__</td><td>for x in obj</td></tr>
<tr><td>__enter__ / __exit__</td><td>with obj:</td></tr>
<tr><td>__eq__ / __lt__</td><td>== / &lt;（functools.total_ordering 可补全）</td></tr>
<tr><td>__add__ / __call__</td><td>+ / obj()</td></tr></table>
<p>⭐ 重写 __eq__ 后默认不可哈希，需同时定义 __hash__ 才能当字典键。</p>`,
        code: String.raw`class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __repr__(self):
        return f"Vector({self.x}, {self.y})"
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)
    def __eq__(self, other):
        return (self.x, self.y) == (other.x, other.y)

v = Vector(1, 2) + Vector(3, 4)
print(v)
print(v == Vector(4, 6))`,
      },
    ],
  },
  {
    layer: "第九层 · 二进制数据",
    stage: "二",
    topics: [
      {
        id: "9_1", title: "§9.1 bytes：字节序列", desc: "str↔bytes 的编解码桥梁",
        html: `<ul>
<li>str 是"字符"，bytes 是"原始字节"（0—255）；网络、图片、压缩包都是字节</li>
<li><code>b"ABC"</code> 字面量只能放 ASCII；<code>b[0]</code> 取出的是<b>整数</b> ⭐</li>
<li>⭐ 桥梁：<code>"字".encode("utf-8")</code> 编码成字节；<code>data.decode("utf-8")</code> 解码回文字——编解码必须同格式，否则 UnicodeDecodeError</li>
<li>bytes 的方法与 str 类似（find/split/replace…），但参数也要加 b 前缀</li></ul>`,
        code: String.raw`data = "你好".encode("utf-8")
print(data)                     # b'\\xe4\\xbd\\xa0\\xe5\\xa5\\xbd'
text = data.decode("utf-8")
print(text)                     # 你好

b = b"ABC"
print(b[0])                     # 65（整数）
print(b"a,b".split(b","))       # 分隔符也要是 bytes`,
      },
      {
        id: "9_2", title: "§9.2 bytearray 与 memoryview", desc: "可变字节序列、零拷贝视图",
        html: `<ul>
<li><code>bytearray</code> 是 bytes 的可变版：可按下标改（赋整数）、append、extend</li>
<li><code>memoryview</code> 是不复制的"视图"：透过它直接操作底层字节，处理大二进制数据省内存</li>
<li>读二进制文件：<code>open("x.zip", "rb")</code> 得到的就是 bytes</li></ul>`,
        code: String.raw`ba = bytearray(b"ABC")
ba[0] = 97              # ✅ 可以改（赋整数 0—255）
ba.append(68)
print(bytes(ba))

data = bytearray(b"hello world")
mv = memoryview(data)
mv[6:] = b"WORLD"       # 透过视图改底层数据，不发生拷贝
print(data)`,
      },
      {
        id: "9_3", title: "§9.3 struct：二进制结构打包", desc: "网络协议/文件格式解析",
        html: `<ul>
<li><code>struct.pack(格式串, 值...)</code> 打包成 bytes；<code>struct.unpack(格式串, 字节)</code> 解包</li>
<li>格式串：&gt; 大端、&lt; 小端；i=4 字节 int、h=2 字节 short、c=单字节、f=float</li>
<li>用途：二进制协议、文件头解析；日常文本处理用不到，知道即可</li></ul>`,
        code: String.raw`import struct
packed = struct.pack(">ih", 1000, 2)   # 大端：4字节int + 2字节short
print(packed)
print(struct.unpack(">ih", packed))    # (1000, 2)`,
      },
    ],
  },
  {
    layer: "第十层 · 内置函数速查",
    stage: "二",
    topics: [
      {
        id: "10_1", title: "§10.1 内置函数分组总表", desc: "全部内置函数按用途分组",
        html: `<pre>类型转换: int float str bool list tuple set frozenset dict bytes bytearray complex
          chr(码点→字符) ord(字符→码点) hex oct bin
数学:     abs round divmod pow(x,y[,mod]) sum min max
迭代:     len range enumerate zip map filter sorted reversed iter next slice all any
对象反射: type isinstance issubclass id hash repr ascii format dir vars
          getattr setattr hasattr delattr callable super object property classmethod staticmethod
输入输出: print input open help breakpoint(3.7+)
动态执行: eval exec compile globals locals __import__（⭐ 慎用）
异步迭代: aiter anext（3.10+）</pre>
<p>官方完整清单：docs.python.org/3.14/library/functions.html</p>`,
      },
      {
        id: "10_2", title: "§10.2 高频细节", desc: "zip strict、iter 哨兵、min/max default、literal_eval",
        html: `<ul>
<li>⭐ <code>zip(a, b)</code> 长度不同<b>静默截断</b>；<code>strict=True</code>（3.10+）不等长就报错；<code>map(strict=)</code>（3.14+）同理</li>
<li>⭐ <code>iter(callable, sentinel)</code>：反复调用直到返回哨兵值（如 <code>iter(f.readline, "")</code>）</li>
<li>⭐ <code>min([], default=0)</code>：空序列不报错；min/max 都支持 key=</li>
<li><code>enumerate(seq, start=1)</code> 改起始编号；sorted/reversed 返回新对象，原序列不变</li>
<li>⭐ eval/exec 危险，勿喂用户输入；解析字面量用 <code>ast.literal_eval</code>（安全）</li></ul>`,
        code: String.raw`print(list(zip([1, 2], [1, 2, 3])))               # 静默截断
try:
    list(zip([1, 2], [1, 2, 3], strict=True))     # 3.10+
except ValueError as e:
    print("strict 报错：", e)

print(min([], default=0))       # 空序列兜底
print(max(["a", "bb"], key=len))

import ast
print(ast.literal_eval("[1, 2, {'a': 3}]"))       # 安全解析字面量`,
      },
    ],
  },
  {
    layer: "第十一层 · 推导式、迭代器与生成器",
    stage: "二",
    topics: [
      {
        id: "11_1", title: "§11.1 推导式", desc: "四种模板、条件位置、独立作用域",
        html: `<ul>
<li><code>[expr for x in seq]</code> 列表 / <code>{expr for ...}</code> 集合 / <code>{k: v for ...}</code> 字典 / <code>(expr for ...)</code> 生成器表达式（惰性）⭐</li>
<li>⭐ 条件位置决定含义：<b>if 在末尾 = 过滤</b>；<b>if-else 在前 = 三元表达式</b></li>
<li>推导式有<b>独立作用域</b>：循环变量不泄漏到外部</li>
<li>逻辑超过一层过滤就写回 for 循环，可读性优先</li></ul>`,
        code: String.raw`print([x * x for x in range(10) if x % 2 == 0])      # 过滤
print(["偶" if x % 2 == 0 else "奇" for x in range(4)])  # 三元
print({x: x * x for x in range(5)})                     # 字典推导式

x = 100
_ = [x for x in range(3)]
print(x)          # 100：外面的 x 不受影响（独立作用域）`,
      },
      {
        id: "11_2", title: "§11.2 可迭代 vs 迭代器", desc: "严格区分、for 的内部机制",
        html: `<ul>
<li><b>可迭代</b>（有 __iter__）：list/str/dict/range/文件……可<b>反复</b>遍历</li>
<li><b>迭代器</b>（有 __iter__ + __next__）：一次性遍历过程，<b>耗尽就没了</b> ⭐⭐</li>
<li><code>iter(可迭代)</code> 产出迭代器；<code>next(it)</code> 取一个，耗尽抛 StopIteration</li>
<li>for 的真相：先 iter() 再不断 next()，遇 StopIteration 正常结束</li>
<li>实用判断：能被 next() 直接用的是迭代器</li></ul>`,
        code: String.raw`nums = [1, 2, 3]        # 可迭代，不是迭代器
it = iter(nums)
print(next(it), next(it), next(it))
try:
    next(it)                  # 耗尽
except StopIteration:
    print("迭代器已耗尽")

print(list(it))               # []：耗尽后什么也拿不到 ⭐
print(list(iter(nums)))       # [1, 2, 3]：nums 本身完好`,
      },
      {
        id: "11_3", title: "§11.3 生成器完整版", desc: "yield、send/throw/close、return 值、yield from",
        html: `<ul>
<li>含 <code>yield</code> 的函数是生成器函数：调用<b>不执行</b>，返回生成器对象（迭代器的一种）</li>
<li>每次 next 跑到下一个 yield 暂停；⭐ 生成器<b>只能遍历一次</b></li>
<li>⭐ yield 是表达式：<code>x = yield total</code> 能接收 <code>send()</code> 进来的值；<code>return</code> 的值藏在 <code>StopIteration.value</code></li>
<li>完整接口：send() 送值、throw() 抛异常、close() 提前终止</li>
<li><code>yield from 子生成器</code>：委托产出，还能传递 send/return</li>
<li>用途：大文件逐行、无限序列（配 itertools.islice 截取），内存 O(1)</li></ul>`,
        code: String.raw`def accumulator():
    total = 0
    while True:
        x = yield total          # 交出 total，等 send 一个 x
        if x is None:
            break
        total += x
    return total                 # 生成器的"返回值"

g = accumulator()
print(next(g))        # 0（先推进到第一个 yield）
print(g.send(10))     # 10
print(g.send(5))      # 15
try:
    g.send(None)      # 触发 return
except StopIteration as e:
    print("return 值：", e.value)   # 15 ⭐`,
      },
      {
        id: "11_4", title: "§11.4 itertools 精选", desc: "迭代器工具箱",
        html: `<pre>count(10, 2)              # 10,12,14,... 无限等差
cycle("AB")               # A,B,A,B,... 无限循环
repeat("x", 3)            # x,x,x
chain([1,2], "ab")        # 串联多个可迭代
islice(seq, 5, 10)        # 惰性切片 ⭐ 配无限序列
takewhile / dropwhile     # 满足条件就取 / 丢
accumulate([1,2,3])       # 1,3,6 累计
zip_longest(a, b, fillvalue=0)   # 补齐式 zip
combinations("ABC", 2)    # AB AC BC 组合
permutations("AB", 2)     # AB BA 排列
product([0,1], repeat=2)  # 笛卡尔积</pre>`,
      },
    ],
  },
  {
    layer: "第十二层 · 装饰器与上下文管理器",
    stage: "二",
    topics: [
      {
        id: "12_1", title: "§12.1 装饰器", desc: "本质、顺序、functools.wraps、带参数装饰器",
        html: `<ul>
<li>本质：<code>@deco</code> 就是 <code>f = deco(f)</code> 的语法糖</li>
<li>⭐ 多个装饰器<b>从下往上包装</b>：<code>@a @b</code> → <code>f = a(b(f))</code>（最贴近 def 的先应用）</li>
<li>⭐ 写装饰器必加 <code>@functools.wraps(func)</code>：保留原函数的 __name__/__doc__</li>
<li>带参数的装饰器 = 三层函数嵌套（参数层 → 装饰层 → 包装层）</li>
<li>类实现 __call__ 可当装饰器；装饰器也能装饰类（@dataclass 就是）</li></ul>`,
        code: String.raw`import functools, time

def timer(func):
    @functools.wraps(func)         # ⭐ 必写：保留元信息
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__} 耗时 {time.perf_counter() - start:.4f}s")
        return result
    return wrapper

@timer
def slow():
    """会被 wraps 保留的文档"""
    time.sleep(0.05)

slow()
print(slow.__name__)    # slow（没 wraps 会变 wrapper）`,
      },
      {
        id: "12_2", title: "§12.2 上下文管理器", desc: "__enter__/__exit__、@contextmanager、contextlib 工具",
        html: `<ul>
<li>实现 <code>__enter__</code> / <code>__exit__</code> 的对象即可用于 with；__exit__ 返回 True 会吞掉异常（慎用）</li>
<li>⭐ <code>@contextmanager</code> 用生成器快速写一个：yield 前是进入逻辑，finally 里是清理逻辑</li>
<li>with 块里的异常会在 yield 处重新抛出——用 try/finally 保证收尾</li>
<li>contextlib 好帮手：suppress 忽略异常、redirect_stdout 重定向、ExitStack 动态管理多个</li></ul>`,
        code: String.raw`from contextlib import contextmanager, suppress
import time

@contextmanager
def timer():
    start = time.perf_counter()
    try:
        yield                        # with 块在这里执行
    finally:
        print(f"耗时 {time.perf_counter() - start:.4f}s")

with timer():
    time.sleep(0.05)

with suppress(FileNotFoundError):    # 安静忽略指定异常
    raise FileNotFoundError("不存在的文件")
print("没被异常打断")`,
      },
    ],
  },
  {
    layer: "第十三层 · 类型注解",
    stage: "三",
    topics: [
      {
        id: "13_1", title: "§13.1 注解基础与 3.14 延迟求值", desc: "不影响运行、PEP 649/749、annotationlib",
        html: `<ul>
<li>⭐ 注解<b>不影响程序运行</b>（Python 仍是动态类型），是给人类和 mypy/pyright 看的"说明书"</li>
<li>写法：<code>def f(x: int) -&gt; str:</code>、<code>age: int = 18</code></li>
<li>⭐ <b>3.14 起注解默认延迟求值</b>（PEP 649/749）：前向引用不用加引号；<code>from __future__ import annotations</code> 已无必要</li>
<li>运行时读注解：新模块 <code>annotationlib.get_annotations()</code> 或 <code>typing.get_type_hints()</code></li></ul>`,
      },
      {
        id: "13_2", title: "§13.2 内置泛型与 typing 速查", desc: "list[int]（3.9+）、X|Y（3.10+）、常用注解表",
        html: `<pre>def f(items: list[int]) -&gt; int: ...     # 内置泛型 3.9+，不用 import
def g(x: int | None) -&gt; str | bytes: ...  # 联合写法 3.10+
scores: dict[str, int]
rest: tuple[int, ...]          # 任意个 int
cls: type[Exception]</pre>
<table><tr><th>注解</th><th>含义</th></tr>
<tr><td>Any</td><td>任意类型（放弃检查；与 object 不同 ⭐）</td></tr>
<tr><td>Final</td><td>常量，禁止重新赋值</td></tr>
<tr><td>ClassVar</td><td>类属性（不属于实例）</td></tr>
<tr><td>Literal["a","b"]</td><td>只能取这几个字面值</td></tr>
<tr><td>Never / NoReturn</td><td>永不正常返回（3.11+ 推荐 Never）</td></tr>
<tr><td>Annotated[int, "元数据"]</td><td>类型 + 附加信息（框架常用）</td></tr>
<tr><td>Protocol</td><td>结构化类型（静态鸭子类型）</td></tr>
<tr><td>TypeGuard(3.10+) / TypeIs(3.13+)</td><td>自定义类型收窄</td></tr>
<tr><td>@deprecated(3.13)</td><td>标记弃用（PEP 702）</td></tr></table>`,
      },
      {
        id: "13_3", title: "§13.3 TypedDict / Self / overload / NewType / ParamSpec", desc: "五个高频进阶注解",
        html: `<pre>from typing import TypedDict, Self, overload, NewType, ParamSpec, TypeVar, Callable

class User(TypedDict):          # 规定字典的键与类型
    name: str
    age: int

class Builder:
    def set_name(self, n: str) -&gt; Self:   # 返回自己，支持链式
        return self

@overload                        # 同一函数多套签名
def parse(x: str) -&gt; str: ...
@overload
def parse(x: bytes) -&gt; bytes: ...
def parse(x):
    return x

UserId = NewType("UserId", int)  # 静态上的"新类型"，运行时零开销
# 区别于别名：Vector = list[float] 只是换个名字

P = ParamSpec("P"); R = TypeVar("R")
def logged(func: Callable[P, R]) -&gt; Callable[P, R]: ...  # 装饰器保签名</pre>`,
      },
      {
        id: "13_4", title: "§13.4 泛型：老写法与 3.12 新语法", desc: "TypeVar/Generic vs class Box[T]、type 别名",
        html: `<pre># 老写法
from typing import Generic, TypeVar
T = TypeVar("T")
class Box(Generic[T]): ...
def first(items: list[T]) -&gt; T: ...

# 3.12+ 新语法 ⭐：直接在名字后声明，不再需要 TypeVar/Generic
class Box[T]: ...
def first[T](items: list[T]) -&gt; T: ...
type Vector = list[float]      # type 别名语句（type 在此是软关键字）

# 3.13+ 类型参数默认值（PEP 696）
class Box[T = int]: ...</pre>`,
      },
      {
        id: "13_5", title: "§13.5 dataclass 完整版", desc: "少写样板代码、default_factory、常用参数",
        html: `<ul>
<li><code>@dataclass</code> 自动生成 __init__/__repr__/__eq__（3.7+）</li>
<li>⭐⭐ 可变默认值必须 <code>field(default_factory=list)</code>，不能写 <code>tags: list = []</code></li>
<li>常用参数：frozen=True 不可变、order=True 支持比较、kw_only=True（3.10+）、slots=True（3.10+）</li>
<li><code>field(repr=False)</code> 隐藏敏感字段；<code>__post_init__</code> 做初始化后处理</li></ul>`,
        code: String.raw`from dataclasses import dataclass, field

@dataclass
class User:
    name: str
    age: int = 0
    tags: list = field(default_factory=list)   # ⭐ 可变默认值
    password: str = field(repr=False, default="")

u = User("Tom")
u.tags.append("vip")
print(u)                       # password 不出现在 repr
print(u == User("Tom"))        # True：自动 __eq__`,
      },
      {
        id: "13_6", title: "§13.6 运行时检查的限制", desc: "isinstance 与泛型、pydantic",
        html: `<ul>
<li>⭐ <code>isinstance([1,2], list)</code> 可以；<code>isinstance([1,2], list[int])</code> 报 TypeError——运行时只查"外壳"</li>
<li>需要运行时校验复杂数据（如 API 入参）：用 <code>pydantic</code> 等第三方库</li>
<li>dataclass/pydantic 是"注解 + 运行时行为"的两类典型搭档</li></ul>`,
        code: String.raw`print(isinstance([1, 2], list))        # True
try:
    isinstance([1, 2], list[int])     # ❌ TypeError
except TypeError as e:
    print("泛型不能做运行时检查")`,
      },
    ],
  },
  {
    layer: "第十四层 · 异步编程",
    stage: "三",
    topics: [
      {
        id: "14_1", title: "§14.1 异步认知与基本语法", desc: "协作式并发、协程对象、asyncio.run",
        html: `<ul>
<li>⭐⭐ asyncio 是<b>单线程协作式并发</b>：等 I/O 时让出控制权；适合 I/O 密集，<b>不是多核并行</b>（CPU 密集用 multiprocessing）</li>
<li>⭐ <code>async def</code> 定义协程函数；调用它<b>只得到协程对象，函数体一行都没跑</b>——必须 await 或交给事件循环</li>
<li><code>await</code> 等待一个协程/任务；<code>asyncio.run(main())</code> 是程序入口</li>
<li>配套：async with、async for（异步库中常见）</li></ul>`,
        code: String.raw`import asyncio

async def fetch(name, seconds):
    await asyncio.sleep(seconds)   # 异步版 sleep：让出控制权
    return f"{name} 完成"

async def main():
    r = await fetch("任务A", 0.1)
    print(r)

asyncio.run(main())`,
      },
      {
        id: "14_2", title: "§14.2 并发执行多个任务", desc: "gather、create_task、TaskGroup、超时与取消",
        html: `<ul>
<li><code>asyncio.gather(c1, c2)</code>：一起出发，全部完成按顺序收结果（总耗时≈最慢那个）</li>
<li>⭐ <code>create_task</code> 创建即被调度；<b>要保存任务引用</b>（否则可能被 GC 提前回收）</li>
<li>⭐ <b>TaskGroup（3.11+，官方推荐）</b>：自动等待全部完成，任一失败取消其余并以 ExceptionGroup 抛出</li>
<li>超时：<code>async with asyncio.timeout(秒):</code>（3.11+）；取消时收到 CancelledError（继承 BaseException）</li></ul>`,
        code: String.raw`import asyncio, time

async def fetch(name, seconds):
    await asyncio.sleep(seconds)
    return f"{name} 完成"

async def main():
    start = time.perf_counter()
    results = await asyncio.gather(fetch("A", 0.2), fetch("B", 0.1))
    print(results, f"总耗时 {time.perf_counter() - start:.1f}s")  # ≈0.2s 不是 0.3s

    async with asyncio.TaskGroup() as tg:   # 3.11+ 推荐
        t1 = tg.create_task(fetch("C", 0.1))
        t2 = tg.create_task(fetch("D", 0.1))
    print(t1.result(), t2.result())

asyncio.run(main())`,
      },
      {
        id: "14_3", title: "§14.3 最常见的误区", desc: "阻塞调用不会自动异步化",
        html: `<ul>
<li>⭐⭐ 在协程里调<b>阻塞函数会卡死整个事件循环</b>：time.sleep、requests、普通文件 I/O 都不会自动变异步</li>
<li>替代：<code>await asyncio.sleep()</code>、httpx/aiohttp（网络）、aiofiles（文件）</li>
<li>必须用阻塞库时：<code>await asyncio.to_thread(阻塞函数, 参数)</code>（3.9+）丢到线程池</li></ul>`,
        code: String.raw`import asyncio, time

async def bad():
    time.sleep(0.1)          # ❌ 卡死事件循环（反面示例）

async def good():
    await asyncio.sleep(0.1)                  # ✅ 异步睡眠
    await asyncio.to_thread(time.sleep, 0.1)  # ✅ 阻塞调用丢线程池

asyncio.run(good())
print("ok")`,
      },
    ],
  },
  {
    layer: "第十五层 · Python 3.8—3.14 新特性总览",
    stage: "二",
    topics: [
      {
        id: "15_1", title: "§15 各版本新特性速查", desc: "3.8 到 3.14 每个版本的重点",
        html: `<table><tr><th>版本</th><th>重点（⭐ 日常高频）</th></tr>
<tr><td>3.8</td><td>⭐ 海象 :=；仅限位置参数 /；f-string 调试 {x=}；cached_property</td></tr>
<tr><td>3.9</td><td>⭐ 内置泛型 list[int]；⭐ 字典合并 |；removeprefix/removesuffix；zoneinfo</td></tr>
<tr><td>3.10</td><td>⭐ match 模式匹配；⭐ 联合 int | str；⭐ zip(strict=)；带括号多行 with；更准的错误提示</td></tr>
<tr><td>3.11</td><td>异常组 except*；tomllib；Self；⭐ TaskGroup、asyncio.timeout；速度大提升；traceback 精确到表达式</td></tr>
<tr><td>3.12</td><td>⭐ type 别名语句、泛型新语法 class Box[T]；⭐ f-string 放宽（同引号/反斜杠/注释）；override</td></tr>
<tr><td>3.13</td><td>⭐ 新交互式解释器（彩色/多行）；自由线程（实验）；JIT（实验）；类型参数默认值（PEP 696）；TypeIs；@deprecated；copy.replace</td></tr>
<tr><td>3.14</td><td>⭐ t-string 模板字符串（PEP 750，产出 Template 对象）；⭐ 注解默认延迟求值（PEP 649/749 + annotationlib）；except 可省括号（PEP 758）；finally 控制流警告（PEP 765）；map(strict=)；zstd；多解释器</td></tr></table>
<p>查版本：<code>python --version</code>；各版本完整说明：docs.python.org/3.14/whatsnew/</p>`,
      },
    ],
  },
  {
    layer: "第十六层 · 词法与表达式体系",
    stage: "二",
    topics: [
      {
        id: "16_1", title: "§16.1 字面量", desc: "各类直接写出的值、Ellipsis、相邻字符串拼接",
        html: `<ul>
<li>字面量 = 直接写出来的值：<code>42 3.14 0xff "str" b"bin" [1,2] (1,2) {1,2} {"a":1}</code></li>
<li>None/True/False 是关键字单例；<code>...</code> 是 Ellipsis 字面量 ⭐</li>
<li>Ellipsis 三用途：类型注解占位（tuple[int, ...]）、numpy 切片、临时代码占位</li>
<li>⭐ <b>相邻字符串字面量自动拼接</b>：<code>"a" "b"</code> → "ab"（长串分行写法；注意与元组 ("a", "b") 的区别）</li></ul>`,
        code: String.raw`s = ("这是一段很长的"
     "字符串，写不下就分行，"
     "解释器会自动拼成一个")
print(s)
print(("a" "b"), ("a", "b"))    # 'ab' 与 ('a', 'b') 的区别 ⭐`,
      },
      {
        id: "16_2", title: "§16.2 字符串前缀与表达式一览", desc: "前缀组合、表达式家族",
        html: `<table><tr><th>前缀</th><th>含义</th><th>版本</th></tr>
<tr><td>r</td><td>原始字符串（反斜杠不转义）</td><td>全版本</td></tr>
<tr><td>b</td><td>字节串</td><td>全版本</td></tr>
<tr><td>f</td><td>格式化字符串</td><td>3.6+</td></tr>
<tr><td>t</td><td>模板字符串（Template 对象）</td><td>3.14+</td></tr>
<tr><td>u</td><td>无效果（Py2 兼容遗留）</td><td>全版本</td></tr>
<tr><td>fr/rf/br 等</td><td>前缀可组合，顺序/大小写不限</td><td>视成员</td></tr></table>
<p><b>表达式家族</b>：名字/字面量/括号（原子）→ 属性 x.attr、下标 x[i]、切片 x[i:j]、调用 f() → 幂/一元/算术/位运算 → 比较/成员/身份 → not/and/or → 条件表达式 → lambda → 海象 → await/yield 也是表达式。</p>`,
      },
      {
        id: "16_3", title: "§16.3 求值顺序", desc: "从左到右、赋值从右到左、短路",
        html: `<ul>
<li>一般<b>从左到右</b>：<code>f() + g()</code> 先调 f；<code>f(a(), b())</code> 先算 a()</li>
<li><b>赋值从右到左</b>：a = b = 值 先算值，再从左到右绑定</li>
<li>解包 <code>x, y = f(), g()</code>：右边整体求值完再绑定</li>
<li>and/or/if-else 短路：定结果后右边不再求值</li>
<li>⭐ 不要在一个表达式里既修改又读取同一对象（如 lst[i] = lst.pop()）</li></ul>`,
      },
    ],
  },
  {
    layer: "第十七层 · 完整语句清单",
    stage: "二",
    topics: [
      {
        id: "17_1", title: "§17.1 简单语句（一行一句）", desc: "全部简单语句一览",
        html: `<table><tr><th>语句</th><th>作用</th></tr>
<tr><td>表达式语句</td><td>单独写个表达式（调用、docstring 等）</td></tr>
<tr><td>赋值 / 增量赋值 / 注解赋值</td><td>x = 1｜x += 1｜x: int = 1</td></tr>
<tr><td>assert</td><td>调试断言（-O 移除）</td></tr>
<tr><td>pass</td><td>空操作占位</td></tr>
<tr><td>del</td><td>解除绑定/删除</td></tr>
<tr><td>return / yield</td><td>函数返回 / 生成器交出值</td></tr>
<tr><td>raise</td><td>抛异常</td></tr>
<tr><td>break / continue</td><td>循环控制</td></tr>
<tr><td>import / from import</td><td>导入</td></tr>
<tr><td>global / nonlocal</td><td>作用域声明</td></tr>
<tr><td>type 语句</td><td>类型别名（3.12+，软关键字）</td></tr></table>`,
      },
      {
        id: "17_2", title: "§17.2 复合语句 + 语句 vs 表达式", desc: "全部复合语句；表达式有值、语句是动作",
        html: `<p><b>复合语句</b>（带头行 + 缩进块）：if / while / for / try（含 except*）/ with / match / def / class / async def / async with / async for</p>
<p>⭐ <b>语句 vs 表达式</b>：表达式有值可放 = 右边；语句是动作没有值——</p>
<pre># if (x = 1):    ❌ SyntaxError：赋值是【语句】
if (x := 1):      # ✅ 海象是【表达式】
    ...
x = print("hi")   # print 调用是表达式（返回 None）
y = 1 if True else 2   # 条件表达式可以；if 语句不行</pre>`,
      },
    ],
  },
  {
    layer: "第十八层 · 工程基础",
    stage: "二",
    topics: [
      {
        id: "18_1", title: "§18.1 虚拟环境 venv", desc: "每个项目一个，隔离依赖",
        html: `<pre>python -m venv .venv                # 创建
.venv\\Scripts\\activate              # 激活（Windows cmd）
.venv\\Scripts\\Activate.ps1          # 激活（PowerShell）
source .venv/bin/activate           # 激活（macOS/Linux）
deactivate                          # 退出</pre>
<p>⭐ 激活后命令行前出现 (.venv)，之后 pip install 只装进这个环境，不污染系统 Python。</p>`,
      },
      {
        id: "18_2", title: "§18.2 pip 包管理", desc: "装/卸/导出/按清单装 + 安装坑",
        html: `<pre>pip install 库名[==版本]    pip install -U 库名    pip uninstall 库名
pip list                    pip freeze &gt; requirements.txt
pip install -r requirements.txt</pre>
<ul>
<li>⭐ 安装名 ≠ 导入名：beautifulsoup4→bs4、pillow→PIL、opencv-python→cv2</li>
<li>⭐ 装错解释器：用 <code>python -m pip install 库名</code> 保险</li>
<li>网络慢：<code>-i https://pypi.tuna.tsinghua.edu.cn/simple</code> 临时换源</li></ul>`,
      },
      {
        id: "18_3", title: "§18.3 项目布局与 pyproject.toml", desc: "现代项目结构（了解）",
        html: `<pre>myproject/
├── pyproject.toml        # 项目"身份证"：名称/版本/依赖/工具配置
├── README.md
├── src/
│   └── myproject/
│       ├── __init__.py
│       └── main.py
└── tests/
    └── test_main.py</pre>
<pre>[project]
name = "myproject"
version = "0.1.0"
dependencies = ["requests&gt;=2.32"]</pre>`,
      },
      {
        id: "18_4", title: "§18.4 代码质量三件套", desc: "ruff / mypy / pytest",
        html: `<pre>pip install ruff mypy pytest
ruff check .          # 检查问题
ruff format .         # 自动格式化
mypy src/             # 静态类型检查（配合注解）
pytest                # 自动发现 tests/ 下 test_*.py 并运行</pre>
<pre># tests/test_calc.py：pytest 最小示例
def add(a, b):
    return a + b

def test_add():            # test_ 开头
    assert add(2, 3) == 5</pre>`,
      },
      {
        id: "18_5", title: "§18.5 logging 日志", desc: "别再用 print 调试生产代码",
        html: `<ul>
<li>级别：DEBUG &lt; INFO &lt; WARNING &lt; ERROR &lt; CRITICAL；basicConfig(level=...) 决定显示到哪级</li>
<li>⭐ except 块里用 <code>logging.exception()</code>：自动附带异常堆栈</li></ul>`,
        code: String.raw`import logging
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

logging.debug("默认不显示")
logging.info("普通信息")
logging.warning("警告")

try:
    1 / 0
except ZeroDivisionError:
    logging.exception("出错了")     # 自动带堆栈 ⭐`,
      },
      {
        id: "18_6", title: "§18.6 命令行参数", desc: "sys.argv 基础、argparse 进阶",
        html: `<pre>import sys
print(sys.argv)     # ['脚本名.py', '参数1']（都是字符串 ⭐）</pre>
<pre>import argparse
parser = argparse.ArgumentParser(description="示例工具")
parser.add_argument("input", help="输入文件")
parser.add_argument("-n", "--count", type=int, default=1)
parser.add_argument("--verbose", action="store_true")
args = parser.parse_args()
# python tool.py data.txt -n 3 --verbose；自带 -h 帮助</pre>`,
      },
      {
        id: "18_7", title: "§18.7 JSON 与 CSV", desc: "ensure_ascii=False、newline= 两个高频坑",
        html: `<ul>
<li>⭐ <code>json.dumps(data, ensure_ascii=False)</code>：不加则中文变 \\uXXXX</li>
<li>dumps/loads 管字符串；dump/load 管文件对象</li>
<li>JSON 只认：对象/数组/字符串/数字/true/false/null——datetime、集合要先转换</li>
<li>⭐ csv 打开要加 <code>newline=""</code>；DictReader/DictWriter 按列名读写</li></ul>`,
        code: String.raw`import json

data = {"name": "小明", "age": 18}
s = json.dumps(data, ensure_ascii=False)
print(s)                          # 中文正常显示
obj = json.loads(s)
print(obj["name"])

with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
with open("data.json", encoding="utf-8") as f:
    print(json.load(f))`,
      },
      {
        id: "18_8", title: "§18.8 环境变量与配置", desc: "密钥不写死代码",
        html: `<pre>import os
key = os.getenv("API_KEY")            # 不存在返回 None（不报错）
port = int(os.getenv("PORT", "8080")) # 带默认值
os.environ["DEBUG"] = "1"             # 设置（仅当前进程有效）</pre>
<p>⭐ 密钥/密码<b>不要写死在代码里</b>：用环境变量或 .env 文件（python-dotenv）+ .gitignore。</p>`,
      },
    ],
  },
  {
    layer: "第十九层 · 高级话题（可暂缓）",
    stage: "三",
    topics: [
      {
        id: "19_1", title: "§19.1 描述符：property 的原理", desc: "__get__/__set__、属性查找顺序",
        html: `<ul>
<li>实现了 <code>__get__</code> / <code>__set__</code> / <code>__delete__</code> 之一的对象就是描述符</li>
<li>⭐ 属性访问 obj.attr 的<b>查找顺序</b>：① 类的数据描述符（有 __set__/__delete__）→ ② 实例 __dict__ → ③ 非数据描述符/类属性 → ④ __getattr__ 兜底</li>
<li>property、classmethod、staticmethod、普通方法，本质都是描述符</li></ul>`,
      },
      {
        id: "19_2", title: "§19.2 元类与 __new__", desc: "type 是默认元类、__init_subclass__、__new__ vs __init__",
        html: `<ul>
<li>元类 = 创建类的类；<code>type</code> 是默认元类；<code>class Foo(metaclass=MyMeta)</code></li>
<li>⭐ 多数"控制类创建"的需求用更简单的 <code>__init_subclass__</code> 就够</li>
<li><code>__new__(cls)</code> <b>创建并返回</b>实例（真构造函数）；<code>__init__(self)</code> 只做初始化</li>
<li>自定义不可变类型（继承 int/str/tuple）必须重写 __new__</li></ul>`,
        code: String.raw`class PositiveInt(int):
    def __new__(cls, value):            # int 不可变，必须在 __new__ 定型
        if value <= 0:
            raise ValueError("必须为正")
        return super().__new__(cls, value)

print(PositiveInt(5))
try:
    PositiveInt(-1)
except ValueError as e:
    print(e)`,
      },
      {
        id: "19_3", title: "§19.3 闭包与延迟绑定坑", desc: "自由变量、循环里造函数的坑",
        html: `<ul>
<li>闭包：内层函数"记住"外层函数的局部变量（自由变量），外层返回后仍可用</li>
<li>修改外层变量用 <code>nonlocal</code> 声明</li>
<li>⭐⭐ <b>延迟绑定坑</b>：循环里造 lambda 共享循环变量——用默认参数 <code>lambda i=i: i</code> 固定</li></ul>`,
        code: String.raw`def make_counter():
    count = 0
    def inc():
        nonlocal count
        count += 1
        return count
    return inc

c = make_counter()
print(c(), c(), c())                    # 1 2 3

funcs = [lambda: i for i in range(3)]
print([f() for f in funcs])             # [2, 2, 2] ⭐ 共享循环变量

funcs = [lambda i=i: i for i in range(3)]   # ✅ 默认值固定
print([f() for f in funcs])             # [0, 1, 2]`,
      },
      {
        id: "19_4", title: "§19.4 __slots__ 与 namedtuple", desc: "省内存、轻量数据类",
        html: `<ul>
<li><code>__slots__ = ("x", "y")</code>：实例没有 __dict__，省内存、禁止新增未声明属性</li>
<li>⭐ 注意：不阻止给类加属性；父类没 __slots__ 时实例仍会有 __dict__</li>
<li>namedtuple：轻量不可变"数据类"，属性/下标都能访问；现代写法 <code>typing.NamedTuple</code></li></ul>`,
        code: String.raw`class Point:
    __slots__ = ("x", "y")
    def __init__(self, x, y):
        self.x, self.y = x, y

p = Point(1, 2)
try:
    p.z = 3           # ❌ AttributeError
except AttributeError:
    print("slots 阻止新增属性")

from typing import NamedTuple
class P2(NamedTuple):
    x: int
    y: int = 0
print(P2(1).x, P2(1, 2))`,
      },
      {
        id: "19_5", title: "§19.5 垃圾回收与弱引用", desc: "引用计数、循环引用、weakref",
        html: `<ul>
<li>CPython 主要靠<b>引用计数</b>：归零通常<b>立即</b>回收（del 只是减计数）</li>
<li>循环引用计数降不到 0，由分代回收器 gc 定期处理；<code>gc.collect()</code> 手动触发</li>
<li><code>weakref.ref(obj)</code> 弱引用不增加计数：对象没了返回 None，适合缓存/观察者</li>
<li>__del__ 时机不可靠，关键清理请用 with</li></ul>`,
        code: String.raw`import gc, weakref

class Big: pass
obj = Big()
ref = weakref.ref(obj)
print(ref() is obj)     # True
del obj
gc.collect()
print(ref())            # None：对象被回收后`,
      },
    ],
  },
  {
    layer: "第二十层 · 应用板块",
    stage: "三",
    topics: [
      {
        id: "20_1", title: "§20.1 零安装方向（纯标准库）", desc: "新手第一个作品的来源",
        html: `<ul>
<li><b>文件与系统自动化</b> ⭐ 推荐起点：批量重命名/归档/清理（pathlib + shutil）</li>
<li>文本与日志分析：re + collections.Counter</li>
<li>数据格式处理：json / csv（§18.7）、sqlite3 标准库数据库</li>
<li>邮件通知：smtplib + email；桌面小窗口：tkinter</li></ul>
<p>原则：先跑通标准库，再按需装第三方库（别一上来装几十个）。</p>`,
      },
      {
        id: "20_2", title: "§20.2 一个库打开一个领域", desc: "办公与数据日常（含运行条件提醒）",
        html: `<table><tr><th>方向</th><th>核心库</th><th>能干什么</th></tr>
<tr><td>网络爬虫</td><td>requests + beautifulsoup4</td><td>抓网页数据存表格（需联网，遵守 robots.txt）</td></tr>
<tr><td>Excel 自动化</td><td>openpyxl</td><td>合并报表、批量改表</td></tr>
<tr><td>Word 自动化</td><td>python-docx</td><td>模板生成合同/通知</td></tr>
<tr><td>PDF 处理</td><td>pypdf / pdfplumber</td><td>提取文字表格、合并拆分</td></tr>
<tr><td>数据分析</td><td>pandas + matplotlib</td><td>分组统计、出图表</td></tr>
<tr><td>图像处理</td><td>pillow、qrcode</td><td>批量压缩、水印、二维码</td></tr>
<tr><td>AI 大模型调用</td><td>openai 等</td><td>对话/翻译/总结（需 API key，有费用）</td></tr></table>
<p>⭐ 运行第三方示例前先确认：Python 版本、安装命令、是否需要网络/API key、输入文件位置（指南 §20 每个示例都标了运行条件）。</p>`,
      },
      {
        id: "20_3", title: "§20.3 工程化方向", desc: "建议学完 §7/§12/§13 再上",
        html: `<table><tr><th>方向</th><th>核心库</th><th>说明</th></tr>
<tr><td>Web 后端</td><td>fastapi / flask</td><td>FastAPI 让类型注解变成接口文档和参数校验</td></tr>
<tr><td>命令行工具</td><td>typer + rich + tqdm</td><td>参数、帮助、彩色输出、进度条</td></tr>
<tr><td>低代码网页</td><td>streamlit / gradio</td><td>不懂前端也能做数据看板/AI 演示</td></tr>
<tr><td>浏览器自动化</td><td>playwright / selenium</td><td>动态网页抓取、自动填报</td></tr>
<tr><td>定时调度</td><td>apscheduler / schedule</td><td>到点自动干活 + webhook 通知</td></tr>
<tr><td>打包发布</td><td>pyinstaller</td><td>打包成 exe 发给没装 Python 的人</td></tr></table>`,
      },
      {
        id: "20_4", title: "§20.4 方向选择建议", desc: "四条实用建议",
        html: `<ul>
<li>① 先做"为自己省事"的小工具（如整理下载文件夹）——真实需求驱动，语法才记得牢</li>
<li>② 第三方库报错先排查：虚拟环境没激活 / 装错环境（§18.1/§18.2，新手问题半壁江山）</li>
<li>③ 爬虫先查目标站 robots.txt 与服务条款，控制频率，合规优先</li>
<li>④ 每个最小示例亲手敲一遍并改两处，比看十篇教程有效</li></ul>`,
      },
    ],
  },
];
