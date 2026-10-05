/* ===== 课程内容数据 · 第十九层 =====
 * 内容来源：《Python 3 语法完全指南》（outputs/python-syntax-guide.md）第十九层 · 高级话题（入门阶段可暂缓）。
 * 写法规范与 data-course.js 一致：section.id 即指南小节号；points 为分条要点（内联 <code>/<b>）；
 * 每节配一个「看得见效果」的小示例，强调「知道存在、用到再查」；
 * code 示例均经本地 Python 实际运行验证（verify_course_expect.py）；expect 为真实输出。
 * 适用版本：3.8—3.14 ｜ 最后核对：2026-09
 */
COURSE.push({
  id: 19,
  title: "第十九层 · 高级话题",
  minutes: 50,
  goal: "认识五个高级机制：描述符、元类、闭包陷阱、__slots__、垃圾回收——知道存在、用到再查",
  prereq: "第七层（面向对象）",
  versions: "3.8—3.14",
  checked: "2026-09",
  sections: [
    {
      id: "19.1", title: "描述符：属性访问的「后台」",
      doc: "https://docs.python.org/zh-cn/3.14/reference/datamodel.html#descriptors",
      points: [
        "实现了 <code>__get__</code> / <code>__set__</code> / <code>__delete__</code> 之一的对象就是<b>描述符</b>",
        "你写 <code>a.x = 1</code> 看似普通赋值，实际可能悄悄走了描述符的 __set__——属性访问是有后台的",
        "⭐ 查找顺序：数据描述符（有 __set__）→ 实例 __dict__ → 非数据描述符/类属性 → __getattr__ 兜底",
        "<code>@property</code>、<code>classmethod</code>、<code>staticmethod</code>、普通方法，本质都是描述符",
        "入门阶段<b>知道存在、用到再查</b>：读源码见到 __get__ 不慌就行",
      ],
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
      expect: "写入 x = 1\n读取 x\n1",
      note: "把 a.x = 1 换成 print(A.x)——通过类访问时 __get__ 收到的 obj 是 None。",
    },
    {
      id: "19.2", title: "元类与 __new__：创建类的类",
      doc: "https://docs.python.org/zh-cn/3.14/reference/datamodel.html#metaclasses",
      points: [
        "类是造对象的图纸，<b>元类是造图纸的图纸</b>——默认元类就是 <code>type</code>",
        "<code>class Foo(metaclass=MyMeta)</code>：定义类的那一刻，元类的 __new__ 就会执行",
        "⭐ 99% 的「想控制类创建」需求，用更简单的 <code>__init_subclass__</code> 就够，别急着上元类",
        "<code>__new__(cls)</code> 真正创建并返回实例；<code>__init__(self)</code> 只做初始化赋值",
        "自定义不可变类型（继承 int/str/tuple）必须重写 __new__：值在创建瞬间就要定型",
      ],
      code: String.raw`class MyMeta(type):                       # 元类继承 type
    def __new__(mcs, name, bases, attrs):
        print(f"正在创建类：{name}")
        return super().__new__(mcs, name, bases, attrs)

class Foo(metaclass=MyMeta):               # 定义这行时就会打印
    pass

# 多数「控制类创建」的需求，用更简单的 __init_subclass__ 就够
class Base:
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        print(f"{cls.__name__} 继承了 Base")

class Child(Base):
    pass

# 自定义不可变类型：必须在 __new__ 阶段定型
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
        nonlocal count
        count += 1
        return count
    return inc

c = make_counter()
print(c(), c(), c())          # count 被闭包「随身携带」

funcs = [lambda: i for i in range(3)]
print([f() for f in funcs])   # 三个函数共享循环结束后的 i

funcs = [lambda i=i: i for i in range(3)]   # 用默认值把当前 i 固定下来
print([f() for f in funcs])`,
      expect: "1 2 3\n[2, 2, 2]\n[0, 1, 2]",
      note: "把第二组 lambda 的 i=i 去掉，输出又变回 [2, 2, 2]。",
    },
    {
      id: "19.4", title: "__slots__ 与 namedtuple：给实例瘦身",
      doc: "https://docs.python.org/zh-cn/3.14/reference/datamodel.html#slots",
      points: [
        "普通实例随身背一个 <code>__dict__</code> 字典；<code>__slots__ = (\"x\", \"y\")</code> 把它省掉，属性名固定",
        "好处：<b>省内存</b>（百万级小对象效果明显）+ 误敲属性名当场报错",
        "⭐ 父类没定义 __slots__ 时，子类实例仍会有 __dict__，效果打折",
        "<code>namedtuple</code> 是轻量不可变「数据类」：属性、下标都能访问",
        "现代写法 <code>typing.NamedTuple</code> 可带注解和默认值；要可变就上 @dataclass（13.5）",
      ],
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
    print("拦住了：", e)

from typing import NamedTuple
class P2(NamedTuple):
    x: int
    y: int = 0

q = P2(5)
print(q.x, q.y)`,
      expect: "1 2\n有 __dict__ 吗： False\n拦住了： 'Point' object has no attribute 'z' and no __dict__ for setting new attributes\n5 0",
      note: "把 __slots__ 里的 y 删掉，再访问 p.y 看报什么错。",
    },
    {
      id: "19.5", title: "垃圾回收与弱引用：对象何时消失",
      doc: "https://docs.python.org/zh-cn/3.14/library/weakref.html",
      points: [
        "CPython 主要靠<b>引用计数</b>：没有名字指向的对象，计数归零立即回收（del 只是减计数）",
        "循环引用（a 指 b、b 指 a）计数降不到 0，交给分代回收器 <code>gc</code> 定期清扫",
        "<code>weakref.ref(obj)</code> 弱引用<b>不增加计数</b>：对象没了它自动变 None，适合做缓存",
        "⭐ __del__ 的触发时机不可靠，关键清理请用 with（第十二层）",
        "入门阶段记住「引用计数 + 循环引用」两个词，内存问题就有排查方向",
      ],
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
print(ref() is obj)                # 对象还在，能拿到
del obj                            # 计数归零 → CPython 立即回收
gc.collect()
print(ref())                       # 对象没了，弱引用返回 None`,
      expect: "引用增加了： 1\n删名后回到： 0\nTrue\nNone",
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
