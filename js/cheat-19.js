/* ===== 速查·第十九层 · 高级话题（可暂缓）（§19.1—§19.7） =====
 * 内容来源：《Python 3 语法完全指南》第十九层（outputs/python-syntax-guide-v1.md），1:1 对齐小节；
 * 示例与课程 §19.x 一致或取自指南（课程示例经实跑验证），均可整体运行。
 * 适用版本：3.8—3.14 ｜ 语言规则以 Python 官方文档为准。
 */
CHEATSHEET_ADV.push({
  layerId: 19,
  layer: "第十九层 · 高级话题（可暂缓）",
  stage: "三",
  topics: [
    {
      id: "19_1", title: "§19.1 描述符：property 的原理", desc: "__get__/__set__/__delete__、数据/非数据描述符、属性访问查找四步顺序、__set_name__",
      doc: "https://docs.python.org/zh-cn/3.14/reference/datamodel.html#descriptors",
      html: `<ul>
<li>实现了 <code>__get__</code> / <code>__set__</code> / <code>__delete__</code> 中<b>任意一个</b>的对象就是<b>描述符</b></li>
<li>你写 <code>a.x = 1</code> 看似普通赋值，实际可能悄悄走了描述符的 <code>__set__</code>——属性访问是有「后台」的</li>
<li><code>__set_name__(self, owner, name)</code>：类创建时回调，让描述符知道自己掌管哪个属性名</li>
<li><code>property</code>、<code>classmethod</code>、<code>staticmethod</code>、普通方法，本质<b>都是描述符</b></li>
<li>入门阶段<b>知道存在、用到再查</b>：读源码见到 <code>__get__</code> 不慌就行</li></ul>
<p>⭐ 属性访问 <code>obj.attr</code> 的<b>查找顺序</b>：</p>
<ol>
<li>类的 MRO 中找<b>数据描述符</b>（同时定义了 <code>__get__</code> 和 <code>__set__</code>/<code>__delete__</code>）→ 优先</li>
<li>实例的 <code>__dict__</code>（普通实例属性）</li>
<li><b>非数据描述符</b>（只定义 <code>__get__</code>，如普通函数→方法）与类属性</li>
<li>都没有则调 <code>__getattr__</code> 兜底（仍没有则 AttributeError）</li></ol>`,
      code: String.raw`class Logged:
    def __set_name__(self, owner, name):
        self.name = name
    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        print(f"读取 {self.name}")
        return obj.__dict__[self.name]
    def __set__(self, obj, value):
        print(f"写入 {self.name} = {value}")
        obj.__dict__[self.name] = value

class A:
    x = Logged()

a = A()
a.x = 1        # 表面是普通赋值，实际走了 Logged.__set__
print(a.x)     # 表面是普通读取，实际走了 Logged.__get__`,
    },
    {
      id: "19_2", title: "§19.2 元类：创建类的类", desc: "元类继承 type、metaclass= 参数、定义类那一刻 __new__ 就执行、__init_subclass__ 更简单的替代",
      doc: "https://docs.python.org/zh-cn/3.14/reference/datamodel.html#metaclasses",
      html: `<ul>
<li>类是造对象的图纸，<b>元类是造图纸的图纸</b>——默认元类就是 <code>type</code>，自定义元类继承 <code>type</code></li>
<li><code>class Foo(metaclass=MyMeta)</code>：<b>定义类的那一刻</b>，元类的 <code>__new__(mcs, name, bases, attrs)</code> 就会执行</li>
<li>⭐ 多数「想控制类创建」的需求，用更简单的 <code>__init_subclass__</code> 就够，别急着上元类</li>
<li><code>__init_subclass__(cls, **kwargs)</code>：每当有类继承本类时自动回调，记得先 <code>super().__init_subclass__(**kwargs)</code></li></ul>`,
      code: String.raw`class MyMeta(type):                       # 元类继承 type
    def __new__(mcs, name, bases, attrs):
        print(f"正在创建类：{name}")
        return super().__new__(mcs, name, bases, attrs)

class Foo(metaclass=MyMeta):               # 定义这行时就会打印
    pass

# 多数「控制类创建」的需求，用更简单的 __init_subclass__ 就够 ⭐
class Base:
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        print(f"{cls.__name__} 继承了 Base")

class Child(Base):
    pass`,
    },
    {
      id: "19_3", title: "§19.3 __new__ vs __init__", desc: "__new__ 创建并返回实例、__init__ 只做初始化、自定义不可变类型（int/str/tuple）必须重写 __new__",
      doc: "https://docs.python.org/zh-cn/3.14/reference/datamodel.html#metaclasses",
      html: `<ul>
<li><code>__new__(cls, ...)</code>：<b>创建并返回</b>实例（真正的「构造函数」），一般只在自定义不可变类型（继承 int/str/tuple）或单例时才重写</li>
<li><code>__init__(self, ...)</code>：实例<b>已经存在</b>，负责<b>初始化</b>（赋初值）</li>
<li>⭐ int/str/tuple 不可变——值在创建瞬间就要定型，所以校验和改造必须放在 <code>__new__</code> 阶段</li>
<li>重写后记得 <code>return super().__new__(cls, value)</code> 把对象真正造出来</li></ul>`,
      code: String.raw`class PositiveInt(int):
    def __new__(cls, value):            # int 不可变，必须在 __new__ 阶段定型
        if value <= 0:
            raise ValueError("必须为正")
        return super().__new__(cls, value)

print(PositiveInt(5) + 1)
try:
    PositiveInt(-1)
except ValueError as e:
    print("拦截：", e)`,
    },
    {
      id: "19_4", title: "§19.4 闭包与延迟绑定坑", desc: "自由变量、nonlocal 修改外层变量、循环里造函数共享循环变量、lambda i=i 固定当前值",
      doc: "https://docs.python.org/zh-cn/3.14/reference/executionmodel.html#naming-and-binding",
      html: `<ul>
<li><b>闭包</b>：内层函数「记住」外层函数的局部变量，即使外层函数已返回——这个被记住的变量叫<b>自由变量</b></li>
<li>修改被带走的外层变量要用 <code>nonlocal</code> 声明（回顾第四层作用域）</li>
<li>⭐⭐ <b>循环里造函数的延迟绑定坑</b>：<code>[lambda: i for i in range(3)]</code> 三个函数共享循环结束后的 i，结果全是 <code>[2, 2, 2]</code></li>
<li>✅ 解法：用默认参数 <code>lambda i=i: i</code> 把当前值「钉」在定义时刻 → <code>[0, 1, 2]</code></li>
<li>这个坑在回调、按钮事件里最常见——知道原理就能一眼认出</li></ul>`,
      code: String.raw`def make_counter():
    count = 0
    def inc():
        nonlocal count
        count += 1
        return count
    return inc

c = make_counter()
print(c(), c(), c())          # 1 2 3：count 被闭包「随身携带」

funcs = [lambda: i for i in range(3)]
print([f() for f in funcs])   # [2, 2, 2] ⭐ 三个函数共享循环结束后的 i

funcs = [lambda i=i: i for i in range(3)]   # ✅ 用默认值把当前 i 固定下来
print([f() for f in funcs])   # [0, 1, 2]`,
    },
    {
      id: "19_5", title: "§19.5 __slots__ 限制实例属性", desc: "实例没有 __dict__ 省内存、禁止新增未声明属性、父类没定义会打折、名字变类级描述符",
      doc: "https://docs.python.org/zh-cn/3.14/reference/datamodel.html#slots",
      html: `<ul>
<li>普通实例随身背一个 <code>__dict__</code> 字典；<code>__slots__ = ("x", "y")</code> 把它省掉：<b>实例只能有 x、y 两个属性，且没有 __dict__</b></li>
<li>好处：<b>省内存</b>（百万级小对象时效果明显）+ 误敲属性名当场报错</li>
<li>⭐ <b>不能阻止给类本身加属性</b>，也不影响继承</li>
<li>⭐ 若父类没定义 <code>__slots__</code>，或子类需要 <code>__slots__</code> 之外的属性——实例会重新出现 <code>__dict__</code>，效果打折扣</li>
<li><code>__slots__</code> 里的名字会变成<b>类级描述符</b>，不要再赋同名类变量（会报 ValueError 冲突）</li></ul>`,
      code: String.raw`class Point:
    __slots__ = ("x", "y")     # 实例只能有 x、y，且没有 __dict__
    def __init__(self, x, y):
        self.x, self.y = x, y

p = Point(1, 2)
print(p.x, p.y)
print("有 __dict__ 吗：", hasattr(p, "__dict__"))
try:
    p.z = 3                  # 未声明的属性，当场拦住
except AttributeError as e:
    print("拦住了：", e)`,
    },
    {
      id: "19_6", title: "§19.6 namedtuple 轻量数据类", desc: "属性/下标双访问且不可变、typing.NamedTuple 带注解与默认值、要可变用 @dataclass",
      doc: "https://docs.python.org/zh-cn/3.14/reference/datamodel.html#slots",
      html: `<ul>
<li><code>namedtuple("Point", ["x", "y"])</code>：一行造出轻量不可变「数据类」</li>
<li><b>属性、下标都能访问</b>：<code>p.x</code> 与 <code>p[0]</code> 等价；且<b>不可变</b>（改属性会 AttributeError）</li>
<li>⭐ 现代写法 <code>typing.NamedTuple</code>（推荐）：可带类型注解和默认值</li>
<li>需要可变/更多功能时选 <code>@dataclass</code>（见 13.5）</li></ul>`,
      code: String.raw`from collections import namedtuple
Point = namedtuple("Point", ["x", "y"])
p = Point(1, 2)
print(p.x, p[0])      # 1 1：属性、下标都能访问，且不可变

# 现代写法（可带注解和默认值，推荐）：
from typing import NamedTuple
class Point2(NamedTuple):
    x: int
    y: int = 0

q = Point2(5)
print(q.x, q.y)       # 5 0：默认值生效`,
    },
    {
      id: "19_7", title: "§19.7 垃圾回收与弱引用", desc: "引用计数归零立即回收、循环引用靠 gc 分代回收、weakref 不增计数、__del__ 时机不可靠",
      doc: "https://docs.python.org/zh-cn/3.14/library/weakref.html",
      html: `<ul>
<li>CPython 主要靠<b>引用计数</b>：对象的引用数归零通常<b>立即</b>回收（<code>del</code> 只是减计数，见 3.8）</li>
<li><b>循环引用</b>（a 引用 b、b 引用 a）计数降不到 0，由分代垃圾回收器 <code>gc</code> 定期处理；<code>gc.collect()</code> 可手动触发一轮回收</li>
<li><code>__del__</code> 析构方法：对象被回收时调用，但触发时机<b>不适合做关键清理</b>（清理请用 with，第十二层）</li>
<li><code>weakref.ref(obj)</code> <b>弱引用不增加引用计数</b>：对象还在就能通过 <code>ref()</code> 拿到；对象被回收后 <code>ref()</code> 返回 <code>None</code>——适合做缓存/观察者</li>
<li>入门阶段记住「引用计数 + 循环引用」两个词，内存问题就有排查方向</li></ul>`,
      code: String.raw`import sys, gc, weakref

a = [1, 2, 3]
n0 = sys.getrefcount(a)
b = a                              # 又多一个标签指向同一个列表
print("引用增加了：", sys.getrefcount(a) - n0)
del b
print("删名后回到：", sys.getrefcount(a) - n0)

class Big:
    pass

obj = Big()
ref = weakref.ref(obj)             # 弱引用：不增加引用计数
print(ref() is obj)                # True：对象还在就能拿到
del obj                            # 计数归零 → CPython 立即回收
gc.collect()                       # 手动触发循环引用回收
print(ref())                       # None：对象没了，弱引用返回 None`,
    },
  ],
});
