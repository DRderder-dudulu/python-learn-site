/* ===== 速查·第十三层 · 类型注解（§13.1—§13.6） =====
 * 内容来源：《Python 3 语法完全指南》第十三层（outputs/python-syntax-guide-v1.md），1:1 对齐小节；
 * 示例与课程 §13.x 一致或取自指南，均可运行（3.11+/3.12+ 独有语法仅注释展示）。
 * 适用版本：3.8—3.14 ｜ 语言规则以 Python 官方文档为准。
 */
CHEATSHEET_ADV.push({
  layerId: 13,
  layer: "第十三层 · 类型注解",
  stage: "三",
  topics: [
    {
      id: "13_1", title: "§13.1 基础与 3.14 延迟求值", desc: "注解不影响运行、写给人类与 mypy 的说明书、PEP 649/749 延迟求值、annotationlib",
      doc: "https://docs.python.org/zh-cn/3.14/library/typing.html",
      html: `<ul>
<li>⭐ 注解<b>不影响程序运行</b>（Python 仍是动态类型），它是写给<b>人类 + mypy/pyright 等静态检查器</b>的"说明书"；写完注解用 <code>mypy 文件.py</code> 检查（见 18.4）</li></ul>
<pre>def greet(name: str, times: int = 1) -&gt; str:
    return name * times

age: int = 18
names: list[str] = ["Tom"]</pre>
<ul>
<li>⭐ <b>3.14 起注解默认延迟求值</b>（PEP 649 + PEP 749）：注解不再在定义时立即计算，而是以"延迟形式"存储，用到时才求值——<b>前向引用</b>（类还没定义完就引用自己）不再需要加引号</li>
<li>旧代码里的 <code>from __future__ import annotations</code>（见 6.5）已无必要（但保留也无害）</li>
<li>运行时要读注解，用新的 <code>annotationlib</code> 模块或 <code>typing.get_type_hints()</code></li></ul>
<pre>import annotationlib                       # 3.14+

class Node:
    def __init__(self, next: Node | None = None):   # 3.14 里类体内直接引用自己、不加引号也没问题
        self.next = next

print(annotationlib.get_annotations(Node.__init__))
# 或 typing.get_type_hints(Node.__init__)：解析成真实类型对象</pre>`,
      code: String.raw`def greet(name: str, times: int = 1) -> str:
    return name * times

age: int = 18
names: list[str] = ["Tom"]      # 内置泛型写法（3.9+）

print(greet("哈", 3))
print(age, names)
print(greet.__annotations__)    # 注解确实存在，只是没人强制执行

# 3.14 起注解默认延迟求值（PEP 649/749），仅展示——
# class Node:
#     def __init__(self, next: Node | None = None):   # 类体内直接引用自己，不加引号
#         self.next = next
# 运行时读注解：annotationlib.get_annotations(Node.__init__)
# 或 typing.get_type_hints(Node.__init__)（解析成真实类型对象）
# from __future__ import annotations 已无必要（保留也无害）`,
    },
    {
      id: "13_2", title: "§13.2 内置泛型（3.9+）", desc: "list[int]、dict[str, int]、tuple[int, ...]、set[str]、type[Exception]，无需 import typing",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#types-genericalias",
      html: `<ul>
<li>⭐ <b>3.9+ 直接用内置泛型</b>，<code>list[int]</code>、<code>dict[str, int]</code> 等无需 <code>import typing</code>；3.8 项目用 typing 版 <code>List[int]</code>、<code>Dict[str, int]</code>——含义完全一样</li>
<li><code>tuple[int, ...]</code> 表示<b>任意个</b> int（<code>...</code> 是 Ellipsis，见 16.1）；<code>tuple[int, str]</code> 是定长两元</li>
<li><code>type[Exception]</code> 表示"Exception 类本身或其子类"，不是实例</li></ul>
<pre>def first(items: list[int]) -&gt; int:
    return items[0]

scores: dict[str, int] = {"Tom": 90}
pair: tuple[int, str] = (1, "a")
rest: tuple[int, ...] = (1, 2, 3)     # 任意个 int（... 是 Ellipsis，见 16.1）
tags: set[str] = {"a"}
cls_type: type[Exception] = ValueError</pre>`,
      code: String.raw`def first(items: list[int]) -> int:
    return items[0]

scores: dict[str, int] = {"Tom": 90}
pair: tuple[int, str] = (1, "a")
rest: tuple[int, ...] = (1, 2, 3)     # 任意个 int（... 是 Ellipsis，见 16.1）
tags: set[str] = {"a"}
cls_type: type[Exception] = ValueError

print(first([10, 20, 30]), scores)
print(pair, rest, tags, cls_type.__name__)
# 3.8 项目改写：from typing import List, Dict —— List[int]、Dict[str, int] 含义相同`,
    },
    {
      id: "13_3", title: "§13.3 typing 精选速查", desc: "Optional/Union/Any、常用注解表、TypedDict、Self、@overload、NewType vs 别名、ParamSpec",
      doc: "https://docs.python.org/zh-cn/3.14/library/typing.html",
      html: `<pre>from typing import Optional, Union, Any

# 可空 / 联合
def find(x: Optional[int]) -&gt; Union[int, str]: ...
# 3.10+ 更简洁的写法：用 |
def find2(x: int | None) -&gt; int | str: ...

# Any：任意类型（放弃检查）；与 object 不同：object 是"什么都能装但什么都不能直接干"，
# Any 是"什么都能干（检查器不拦）"
def dumb(x: Any) -&gt; Any: return x.whatever()</pre>
<table><tr><th>注解</th><th>含义</th></tr>
<tr><td><code>Final</code></td><td>常量，禁止重新赋值：<code>MAX: Final = 100</code></td></tr>
<tr><td><code>ClassVar</code></td><td>类属性（不属于实例）：<code>count: ClassVar[int] = 0</code></td></tr>
<tr><td><code>Literal["a", "b"]</code></td><td>只能取这几个字面值</td></tr>
<tr><td><code>Never</code> / <code>NoReturn</code></td><td>永不正常返回的函数（抛异常/死循环）；<code>Never</code> 还是"空类型"（3.11+，新代码推荐 Never）</td></tr>
<tr><td><code>Annotated[int, "元数据"]</code></td><td>给类型附加额外信息（框架如 FastAPI 大量使用）</td></tr>
<tr><td><code>TypedDict</code></td><td>规定字典的键与值类型（见下）</td></tr>
<tr><td><code>Protocol</code></td><td>结构化类型："只要长得像就算"（静态鸭子类型）</td></tr>
<tr><td><code>Self</code>（3.11+）</td><td>表示"当前类"，链式调用/工厂方法必备</td></tr>
<tr><td><code>NewType</code></td><td>创建静态层面的新类型（见下）</td></tr>
<tr><td><code>TypeGuard</code>（3.10+）/ <code>TypeIs</code>（3.13+）</td><td>自定义类型收窄函数</td></tr>
<tr><td><code>@deprecated</code>（3.13，PEP 702）</td><td>标记弃用，IDE/检查器会画删除线警告</td></tr></table>
<p><b>TypedDict</b>（给"形状固定的字典"加类型）⭐：3.13+ 支持 <code>ReadOnly</code>（PEP 705）：<code>from typing import ReadOnly</code></p>
<pre>from typing import TypedDict

class User(TypedDict):
    name: str
    age: int

u: User = {"name": "Tom", "age": 18}     # 键或类型写错，mypy 会报错</pre>
<p><b>Self</b>：</p>
<pre>from typing import Self                    # 3.11+

class Builder:
    def set_name(self, name: str) -&gt; Self:   # 返回自己，支持链式调用
        ...
        return self</pre>
<p><b>@overload</b>：同一个函数给多套签名（实现只写一个）：</p>
<pre>from typing import overload

@overload
def parse(x: str) -&gt; str: ...
@overload
def parse(x: bytes) -&gt; bytes: ...
def parse(x):
    return x   # 实现不带注解；调用方按 overload 签名检查</pre>
<p>⭐ <b>NewType vs 类型别名</b>：</p>
<pre>from typing import NewType, TypeAlias

UserId = NewType("UserId", int)      # 静态上是"新类型"：不能把任意 int 当 UserId 传
uid = UserId(42)                     # 运行时零开销（就是原值）

Vector: TypeAlias = list[float]      # 只是起别名：Vector 就是 list[float]，可互换</pre>
<p><b>ParamSpec</b>（装饰器保持原函数签名）：</p>
<pre>from typing import Callable, ParamSpec, TypeVar

P = ParamSpec("P")
R = TypeVar("R")

def logged(func: Callable[P, R]) -&gt; Callable[P, R]:
    def wrapper(*args: P.args, **kwargs: P.kwargs) -&gt; R:
        print(f"调用 {func.__name__}")
        return func(*args, **kwargs)
    return wrapper</pre>`,
      code: String.raw`from typing import Optional, Union, Any, TypedDict, NewType, TypeAlias, overload, Final

def find2(x: int | None) -> int | str:   # 3.10+：| 联合写法更简洁
    return "无" if x is None else x

class User(TypedDict):          # 规定字典的键与值类型
    name: str
    age: int

u: User = {"name": "Tom", "age": 18}   # 键或类型写错，mypy 会报错
print(find2(None), find2(7), u["name"])

UserId = NewType("UserId", int)   # 静态上的"新类型"，运行时零开销（就是原值）
uid = UserId(42)
print(uid + 1)

Vector: TypeAlias = list[float]   # 只是别名：Vector 就是 list[float]，可互换
MAX: Final = 100                  # Final：常量，禁止重新赋值
print(MAX)

@overload                         # 同一函数多套签名（实现只写一个）
def parse(x: str) -> str: ...
@overload
def parse(x: bytes) -> bytes: ...
def parse(x):
    return x

print(parse("ab"), parse(b"ab"))

# ParamSpec：装饰器保持原函数签名（3.10+）
from typing import Callable, ParamSpec, TypeVar
P = ParamSpec("P")
R = TypeVar("R")

def logged(func: Callable[P, R]) -> Callable[P, R]:
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        print("调用", func.__name__)
        return func(*args, **kwargs)
    return wrapper

@logged
def add(a, b):
    return a + b

print(add(2, 3))
# Self（3.11+）/ Never（3.11+）/ TypeIs（3.13+）/ @deprecated（3.13）写法见上方 html`,
    },
    {
      id: "13_4", title: "§13.4 泛型：老写法与 3.12 新语法", desc: "TypeVar+Generic 老写法、3.12 class Box[T]/def f[T]、type 别名语句、3.13 类型参数默认值",
      doc: "https://docs.python.org/zh-cn/3.14/library/typing.html",
      html: `<p>老写法：<code>TypeVar</code> + <code>Generic</code>：</p>
<pre>from typing import Generic, TypeVar
T = TypeVar("T")

class Box(Generic[T]):
    def __init__(self, item: T):
        self.item = item

def first_old(items: list[T]) -&gt; T:
    return items[0]</pre>
<p>⭐ <b>3.12+ 新语法</b>：直接在名字后声明类型参数，不再需要 TypeVar/Generic：</p>
<pre>class Box[T]:
    def __init__(self, item: T):
        self.item = item

def first[T](items: list[T]) -&gt; T:
    return items[0]

# 类型别名语句（3.12+，type 在此是软关键字）
type Vector = list[float]
type IntOrStr = int | str</pre>
<ul>
<li>3.13+ 类型参数支持<b>默认值</b>（PEP 696）：<code>class Box[T = int]: ...</code></li></ul>`,
      code: String.raw`from typing import Generic, TypeVar
T = TypeVar("T")

class Box(Generic[T]):            # 老写法：TypeVar + Generic
    def __init__(self, item: T):
        self.item = item

def first_old(items: list[T]) -> T:
    return items[0]

b = Box(42)
print(b.item, first_old([10, 20, 30]))

# 3.12+ 新语法（仅展示）：直接在名字后声明类型参数，不再需要 TypeVar/Generic——
# class Box[T]:
#     def __init__(self, item: T):
#         self.item = item
# def first[T](items: list[T]) -> T:
#     return items[0]
# type Vector = list[float]       # 类型别名语句（type 在此是软关键字）
# type IntOrStr = int | str
# 3.13+ 类型参数支持默认值（PEP 696）：class Box[T = int]: ...`,
    },
    {
      id: "13_5", title: "§13.5 dataclass 完整版", desc: "少写样板代码、default_factory、frozen/order/kw_only/slots、__post_init__",
      doc: "https://docs.python.org/zh-cn/3.14/library/dataclasses.html",
      html: `<ul>
<li><code>@dataclass</code> 按类体里的注解自动生成 <code>__init__</code>、<code>__repr__</code>、<code>__eq__</code>——少写大段样板代码（3.7+）</li>
<li>⭐⭐ <b>可变默认值必须</b> <code>field(default_factory=list)</code>——直接写 <code>tags: list[str] = []</code> 会被拒绝</li>
<li><code>field(repr=False)</code> 让敏感字段（如密码）不出现在打印里</li>
<li>常用参数：<code>frozen=True</code>（不可变）、<code>order=True</code>（自动支持 &lt; 比较）、<code>kw_only=True</code>（强制关键字传参，3.10+）、<code>slots=True</code>（3.10+，省内存）</li>
<li>需要初始化后处理用 <code>__post_init__</code></li></ul>
<pre>from dataclasses import dataclass, field

@dataclass
class User:
    name: str
    age: int = 0
    tags: list[str] = field(default_factory=list)   # ⭐ 可变默认值必须用 default_factory
    password: str = field(repr=False)               # 不出现在 repr 里

u = User("Tom")
print(u)                       # User(name='Tom', age=0, tags=[])：自动 __repr__
print(u == User("Tom"))        # True：自动 __eq__</pre>`,
      code: String.raw`from dataclasses import dataclass, field

@dataclass
class User:
    name: str
    age: int = 0
    tags: list[str] = field(default_factory=list)   # ⭐ 可变默认值必须用 default_factory
    password: str = field(repr=False, default="")   # 不出现在 repr 里

u = User("Tom")
print(u)                       # User(name='Tom', age=0, tags=[])：自动 __repr__
print(u == User("Tom"))        # True：自动 __eq__

@dataclass(frozen=True)         # 不可变
class Point:
    x: int
    y: int

p = Point(1, 2)
print(p)
# p.x = 10        # ❌ FrozenInstanceError：frozen=True 不允许改
# order=True 支持 < 比较；kw_only=True（3.10+）强制关键字传参；slots=True（3.10+）省内存
# 初始化后处理：def __post_init__(self): ...`,
    },
    {
      id: "13_6", title: "§13.6 运行时检查的限制", desc: "isinstance 对泛型只查外壳、list[int] 报 TypeError、运行时校验用 pydantic",
      html: `<ul>
<li>⭐ <code>isinstance</code> 对泛型只能查<b>"外壳"</b>，查不了参数：<code>isinstance([1, 2], list)</code> 是 True，而 <code>isinstance([1, 2], list[int])</code> 直接 <b>TypeError</b>——运行时不检查元素类型</li>
<li>需要运行时校验复杂数据（如 API 入参）请用 <b>pydantic</b> 等第三方库</li>
<li>dataclass / pydantic 是"注解 + 运行时行为"的两类典型搭档</li></ul>
<pre>isinstance([1, 2], list)          # True
isinstance([1, 2], list[int])     # ❌ TypeError：运行时不检查元素类型
# 需要运行时校验复杂数据请用 pydantic 等第三方库</pre>`,
      code: String.raw`print(isinstance([1, 2], list))        # True：查外壳可以
try:
    isinstance([1, 2], list[int])     # ❌ TypeError：运行时不检查元素类型
except TypeError:
    print("泛型不能做运行时检查：isinstance 只查外壳")
# 需要运行时校验复杂数据（如 API 入参）请用 pydantic 等第三方库`,
    },
  ],
});
