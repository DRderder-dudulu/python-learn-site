/* ===== 课程内容数据 · 第十九层 =====
 * 内容来源：《Python 3 语法完全指南》（outputs/python-syntax-guide.md）第十九层 · 高级话题（入门阶段可暂缓）。
 * 写法规范与 data-course.js 一致：section.id 即指南小节号；points 为分条要点（内联 <code>/<b>）；
 * 【对应规范】points 每条要点必须在 code 中有明确对应：可演示的写成可运行代码并配注释；
 * 错误/危险示范以「故意注释掉」的形式呈现（学员可取消注释亲测报错）；
 * 每节配一个「看得见效果」的小示例，强调「知道存在、用到再查」；
 * code 示例均经本地 Python 实际运行验证（verify_course_expect.py）；expect 为真实输出。
 * 适用版本：3.8—3.14 ｜ 最后核对：2026-10
 */
COURSE.push({
  id: 19,
  title: "第十九层 · 高级话题",
  minutes: 50,
  goal: "认识五个高级机制：描述符、元类、闭包陷阱、__slots__、垃圾回收——知道存在、用到再查",
  prereq: "第七层（面向对象）",
  versions: "3.8—3.14",
  checked: "2026-10",
  sections: [
    {
      id: "19.1", title: "描述符：属性访问的「后台」",
      use: "解释 a.x = 1 这种普通操作为什么能「带动作」——@property、普通方法本质都是它。读源码见到 __get__ 不慌、想搞清属性查找顺序时回这节。",
      doc: "https://docs.python.org/zh-cn/3.14/reference/datamodel.html#descriptors",
      points: [
        "实现了 <code>__get__</code> / <code>__set__</code> / <code>__delete__</code> 之一的对象就是<b>描述符</b>",
        "你写 <code>a.x = 1</code> 看似普通赋值，实际可能悄悄走了描述符的 __set__——属性访问是有后台的",
        "⭐ 查找顺序：数据描述符（有 __set__）→ 实例 __dict__ → 非数据描述符/类属性 → __getattr__ 兜底",
        "<code>@property</code>、<code>classmethod</code>、<code>staticmethod</code>、普通方法，本质都是描述符",
        "入门阶段<b>知道存在、用到再查</b>：读源码见到 __get__ 不慌就行",
      ],
      code: String.raw`# 描述符：实现了 __get__ / __set__ / __delete__ 之一的对象（本例实现了前两个）。
# @property、classmethod、staticmethod、普通方法，本质都是描述符——入门阶段知道存在、用到再查。
# ⭐ 查找顺序：数据描述符（有 __set__）→ 实例 __dict__ → 非数据描述符/类属性 → __getattr__ 兜底
class Logged:
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
a.x = 1        # 表面是普通赋值，实际悄悄走了 Logged.__set__——属性访问是有后台的
print(a.x)     # 表面是普通读取，实际走了 Logged.__get__`,
      expect: "写入 x = 1\n读取 x\n1",
      note: "把 a.x = 1 换成 print(A.x)——通过类访问时 __get__ 收到的 obj 是 None。",
    },
    {
      id: "19.2", title: "元类与 __new__：创建类的类",
      use: "「定义类的瞬间」统一做事：99% 的需求 __init_subclass__ 就够，别急着上元类。int/str 不可变子类，靠 __new__ 定型。",
      doc: "https://docs.python.org/zh-cn/3.14/reference/datamodel.html#metaclasses",
      points: [
        "类是造对象的图纸，<b>元类是造图纸的图纸</b>——默认元类就是 <code>type</code>",
        "<code>class Foo(metaclass=MyMeta)</code>：定义类的那一刻，元类的 __new__ 就会执行",
        "⭐ 99% 的「想控制类创建」需求，用更简单的 <code>__init_subclass__</code> 就够，别急着上元类",
        "<code>__new__(cls)</code> 真正创建并返回实例；<code>__init__(self)</code> 只做初始化赋值",
        "自定义不可变类型（继承 int/str/tuple）必须重写 __new__：值在创建瞬间就要定型",
      ],
      code: String.raw`# 类是造对象的图纸，元类是造图纸的图纸——默认元类就是 type（自定义元类都继承它）
class MyMeta(type):
    def __new__(mcs, name, bases, attrs):
        print(f"正在创建类：{name}")
        return super().__new__(mcs, name, bases, attrs)

class Foo(metaclass=MyMeta):               # 定义类的这一刻，元类的 __new__ 就会执行
    pass

# ⭐ 99% 的「想控制类创建」需求，用更简单的 __init_subclass__ 就够，别急着上元类
class Base:
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        print(f"{cls.__name__} 继承了 Base")

class Child(Base):
    pass

# __new__(cls) 真正创建并返回实例；__init__(self) 只做初始化赋值。
# 自定义不可变类型（继承 int/str/tuple）必须重写 __new__：值在创建瞬间就要定型
class PositiveInt(int):
    def __new__(cls, value):
        if value <= 0:
            raise ValueError("必须为正")
        return super().__new__(cls, value)

print(PositiveInt(5) + 1)
try:
    PositiveInt(-1)
except ValueError as e:
    print("拦截：", e)`,
      expect: "正在创建类：Foo\nChild 继承了 Base\n6\n拦截： 必须为正",
      note: "把 PositiveInt(-1) 改成 PositiveInt(0)，确认 0 也会被拦。",
    },
    {
      id: "19.3", title: "闭包与延迟绑定坑",
      use: "让函数「记住」出生时的外层变量，做计数器、回调全靠它。循环批量造 lambda 必踩共享变量的坑——拿到同一个值，用 lambda i=i: i 钉住当前值。",
      doc: "https://docs.python.org/zh-cn/3.14/reference/executionmodel.html#naming-and-binding",
      points: [
        "闭包：内层函数把外层的局部变量「打包带走」，外层函数返回后变量还活着",
        "修改被带走的外层变量要用 <code>nonlocal</code> 声明（回顾第四层作用域）",
        "⭐⭐ 循环里造 lambda：所有函数共享同一个循环变量，最后<b>全是同一个值</b>",
        "解法：用默认参数 <code>lambda i=i: i</code> 把当前值「钉」在定义时刻",
        "这个坑在回调、按钮事件里最常见——知道原理就能一眼认出",
      ],
      code: String.raw`def make_counter():
    count = 0
    def inc():
        nonlocal count         # 修改被带走的外层变量，要用 nonlocal 声明
        count += 1
        return count
    return inc                 # 闭包：内层函数把外层变量「打包带走」，外层返回后它还活着

c = make_counter()
print(c(), c(), c())          # count 被闭包「随身携带」

# ⭐⭐ 延迟绑定坑（回调、按钮事件里最常见）：所有 lambda 共享同一个循环变量
funcs = [lambda: i for i in range(3)]
print([f() for f in funcs])   # 调用时才取 i，那时循环已结束——全是同一个值

funcs = [lambda i=i: i for i in range(3)]   # 解法：默认参数把当前值「钉」在定义时刻
print([f() for f in funcs])`,
      expect: "1 2 3\n[2, 2, 2]\n[0, 1, 2]",
      note: "把第二组 lambda 的 i=i 去掉，输出又变回 [2, 2, 2]。",
    },
    {
      id: "19.4", title: "__slots__ 与 namedtuple：给实例瘦身",
      use: "造几百万个小对象时，__slots__ 省内存，还拦住敲错的属性名。几个值捆成轻量记录用 namedtuple 省事；要可变再上 @dataclass。",
      doc: "https://docs.python.org/zh-cn/3.14/reference/datamodel.html#slots",
      points: [
        "普通实例随身背一个 <code>__dict__</code> 字典；<code>__slots__ = (\"x\", \"y\")</code> 把它省掉，属性名固定",
        "好处：<b>省内存</b>（百万级小对象效果明显）+ 误敲属性名当场报错",
        "⭐ 父类没定义 __slots__ 时，子类实例仍会有 __dict__，效果打折",
        "<code>namedtuple</code> 是轻量不可变「数据类」：属性、下标都能访问",
        "现代写法 <code>typing.NamedTuple</code> 可带注解和默认值；要可变就上 @dataclass（13.5）",
      ],
      code: String.raw`class Point:
    __slots__ = ("x", "y")     # 省掉实例的 __dict__ 字典：省内存（百万级小对象效果明显）+ 属性名固定
    def __init__(self, x, y):
        self.x, self.y = x, y

p = Point(1, 2)
print(p.x, p.y)
print("有 __dict__ 吗：", hasattr(p, "__dict__"))
try:
    p.z = 3                  # 误敲未声明的属性名，当场拦住
except AttributeError as e:
    print("拦住了：", e)

# ⭐ 父类没定义 __slots__ 时，子类实例仍会有 __dict__，效果打折
class NoSlots:
    pass
class Kid(NoSlots):
    __slots__ = ()
print("父类没定义，子类还有 __dict__：", hasattr(Kid(), "__dict__"))

from typing import NamedTuple   # 现代写法：可带注解和默认值（要可变就上 @dataclass，见 13.5）
class P2(NamedTuple):           # 轻量不可变「数据类」
    x: int
    y: int = 0

q = P2(5)
print(q.x, q.y)                # 属性访问
print(q[0], q[1])              # 下标也能访问`,
      expect: "1 2\n有 __dict__ 吗： False\n拦住了： 'Point' object has no attribute 'z' and no __dict__ for setting new attributes\n父类没定义，子类还有 __dict__： True\n5 0\n5 0",
      note: "把 __slots__ 里的 y 删掉，再访问 p.y 看报什么错。",
    },
    {
      id: "19.5", title: "垃圾回收与弱引用：对象何时消失",
      use: "回答「对象什么时候消失」：对象计数归零即回收，互指的循环引用交给 gc 清扫。缓存怕「拽着对象不让它死」用弱引用；关键清理别押 __del__，用 with。",
      doc: "https://docs.python.org/zh-cn/3.14/library/weakref.html",
      points: [
        "CPython 主要靠<b>引用计数</b>：没有名字指向的对象，计数归零立即回收（del 只是减计数）",
        "循环引用（a 指 b、b 指 a）计数降不到 0，交给分代回收器 <code>gc</code> 定期清扫",
        "<code>weakref.ref(obj)</code> 弱引用<b>不增加计数</b>：对象没了它自动变 None，适合做缓存",
        "⭐ __del__ 的触发时机不可靠，关键清理请用 with（第十二层）",
        "入门阶段记住「引用计数 + 循环引用」两个词，内存问题就有排查方向",
      ],
      code: String.raw`import sys, gc, weakref

# CPython 主要靠【引用计数】：没有名字指向的对象，计数归零立即回收
a = [1, 2, 3]
n0 = sys.getrefcount(a)
b = a                              # 又多一个标签指向同一个列表
print("引用增加了：", sys.getrefcount(a) - n0)
del b                              # del 只是减计数，不是删对象
print("删名后回到：", sys.getrefcount(a) - n0)

# 循环引用（a 指 b、b 指 a）：计数降不到 0，交给分代回收器 gc 定期清扫
a2, b2 = {}, {}
a2["friend"] = b2
b2["friend"] = a2
del a2, b2
gc.collect()
print("循环引用已交给 gc 清扫")

class Big:
    pass

obj = Big()
ref = weakref.ref(obj)             # 弱引用：不增加引用计数，对象没了自动变 None，适合做缓存
print(ref() is obj)                # 对象还在，能拿到
del obj                            # 计数归零 → CPython 立即回收
gc.collect()
print(ref())                       # 对象没了，弱引用返回 None
# ⭐ __del__ 的触发时机不可靠，关键清理请用 with（第十二层）`,
      expect: "引用增加了： 1\n删名后回到： 0\n循环引用已交给 gc 清扫\nTrue\nNone",
      note: "在 del obj 前后各打印一次 ref()，体会弱引用的「不续命」。",
    },
  ],
  quiz: [
    { q: "a.x = 1 会触发描述符的哪个方法？",
      options: ["__set__", "__get__", "__delete__", "__init__"], answer: 0,
      explain: "赋值走 __set__；读取 a.x 才走 __get__。" },
    { q: "[lambda: i for i in range(3)] 的结果全是 2，原因是？",
      options: ["所有 lambda 共享同一个循环变量 i", "lambda 本身有缺陷", "range 只生成了一个值", "列表推导缓存了第一次的结果"], answer: 0,
      explain: "延迟绑定：lambda 里的 i 在调用时才取值，那时循环已结束；用 lambda i=i: i 固定当前值。" },
    { q: "关于 __slots__ 与弱引用，正确的是？",
      options: ["__slots__ 实例没有 __dict__；weakref 不增加引用计数", "__slots__ 能阻止给类本身加属性", "weakref 会让对象永不被回收", "__slots__ 在任何情况下都省内存"], answer: 0,
      explain: "__slots__ 省掉实例字典（父类没定义会打折）；弱引用不续命，对象回收后 ref() 返回 None。" },
  ],
});
