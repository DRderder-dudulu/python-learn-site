/* ===== 速查·第七层 · 面向对象（§7.1—§7.5） =====
 * 内容来源：《Python 3 语法完全指南》第七层（outputs/python-syntax-guide-v1.md），1:1 对齐小节；
 * 吸收原速查 7_1…7_5 全部要点并扩写；示例与课程 §7.x 一致或取自指南，均经本地 Python 实跑验证（exit 0）。
 * 适用版本：3.8—3.14 ｜ 语言规则以 Python 官方文档为准。
 */
CHEATSHEET_ADV.push({
  layerId: 7,
  layer: "第七层 · 面向对象",
  stage: "二",
  topics: [
    {
      id: "7_1", title: "§7.1 类与实例", desc: "class 定义与实例化、__init__ 不创建对象、类属性 vs 实例属性、可变类属性陷阱",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/classes.html",
      html: `<ul>
<li><code>class 名字:</code> 定义类；<code>对象 = 类名(参数)</code> 实例化（注意：不传 self，self 由 Python 自动传入）</li>
<li><b>类属性</b>写在类体里（如 <code>species = "犬科"</code>），<b>所有实例共享</b>；<b>实例属性</b>写在 <code>__init__</code> 里（<code>self.xxx</code>），每个实例各有一份；实例也能读到类属性</li>
<li><b>实例方法</b>：第一个参数惯例叫 <code>self</code>（只是约定俗成的名字，但请遵守惯例）</li>
<li>⭐ <code>__init__</code> <b>不创建对象</b>：实例由 <code>__new__</code> 先创建出来，再交给 <code>__init__</code> 做初始化（给属性赋初值）；<code>__init__</code> 必须返回 <code>None</code></li>
<li>⭐⭐ <b>可变类属性陷阱</b>：类体里写 <code>tags = []</code> 会被所有实例共享——<code>a.tags.append(1)</code> 后 <code>b.tags</code> 也变成 [1]；正解：可变属性放 <code>__init__</code> 里变成实例属性 <code>self.tags = []</code></li></ul>`,
      code: String.raw`class Dog:
    species = "犬科"              # 类属性：所有实例共享

    def __init__(self, name, age):
        self.name = name          # 实例属性：每个实例各有一份
        self.age = age

    def bark(self):               # 实例方法：第一个参数惯例叫 self
        return f"{self.name}：汪汪！"

d = Dog("旺财", 3)                # 实例化（注意：不传 self）
print(d.bark())                   # 旺财：汪汪！
print(d.species)                  # 犬科（实例能读到类属性）

# ⭐ 可变类属性陷阱：所有实例共享同一个列表
class Bad:
    tags = []          # ❌ 所有实例共享！

a, b = Bad(), Bad()
a.tags.append(1)
print(b.tags)          # [1] ⭐ b 也被"污染"了

# 正解：可变属性放 __init__ 里变成实例属性
class Good:
    def __init__(self):
        self.tags = []

x, y = Good(), Good()
x.tags.append(1)
print(y.tags)          # []：各玩各的`,
    },
    {
      id: "7_2", title: "§7.2 三种方法", desc: "实例方法 self / @classmethod cls 备选构造函数 / @staticmethod 普通工具函数",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/classes.html#instance-objects",
      html: `<table><tr><th>种类</th><th>第一个参数</th><th>用途</th></tr>
<tr><td>实例方法（默认）</td><td><code>self</code>（实例）</td><td>操作某个具体实例</td></tr>
<tr><td><code>@classmethod</code></td><td><code>cls</code>（类本身）</td><td>操作类本身；常用来做"备选构造函数"（如 from_string）</td></tr>
<tr><td><code>@staticmethod</code></td><td>无</td><td>只是寄放在类里的普通函数，不需要 self 也不需要 cls</td></tr></table>
<p>调用：实例方法用对象调；后两者用类或实例调都行。</p>`,
      code: String.raw`class MyClass:
    count = 0

    def instance_method(self):      # 实例方法：操作某个具体实例
        return "self 是实例"

    @classmethod                    # 类方法：操作类本身，第一个参数惯例叫 cls
    def from_string(cls, s):        # 常用来做"备选构造函数"
        return cls()

    @staticmethod                   # 静态方法：只是寄放在类里的普通函数
    def is_valid(x):                # 不需要 self 也不需要 cls
        return x > 0

obj = MyClass()
print(obj.instance_method())
print(MyClass.from_string("x") is not None)
print(MyClass.is_valid(5))          # 用类调用，也可用实例调用`,
    },
    {
      id: "7_3", title: "§7.3 属性访问控制与 @property", desc: "没有真 private、单下划线君子协定、双下划线名称改写、@property 伪装属性加校验",
      doc: "https://docs.python.org/zh-cn/3.14/library/functions.html#property",
      html: `<ul>
<li>Python <b>没有真正的 private</b>，只有<b>约定</b></li>
<li><code>self.public</code>：公开，随便用</li>
<li>⭐ <code>self._internal</code> 单下划线：约定"别从外面碰"，纯<b>君子协定</b>，解释器不拦</li>
<li>⭐ <code>self.__secret</code> 双下划线：触发<b>名称改写</b>——变成 <code>_类名__属性</code>（<code>u._User__secret</code> 仍能访问）：只是"防误触"不是真私有；从外面直接 <code>u.__secret</code> 报 AttributeError</li>
<li><b>@property</b>：把方法伪装成<b>属性</b>，读取时自动计算（<code>c.area</code> 不加括号）；配 <code>@radius.setter</code> 在赋值时校验，把非法值拦在门外；真正的存储值放 <code>self._radius</code>——外部用法不变，内部随时能加逻辑</li></ul>`,
      code: String.raw`class User:
    def __init__(self):
        self.public = "公开"        # 随便用
        self._internal = "内部"     # ⭐ 单下划线：约定"别从外面碰"，纯君子协定
        self.__secret = "机密"      # ⭐ 双下划线：触发名称改写

u = User()
# print(u.__secret)      # ❌ AttributeError
print(u._User__secret)   # 机密：被改写成 _类名__属性 ⭐ 只是防误触不是真私有

class Circle:
    def __init__(self, radius):
        self.radius = radius

    @property
    def area(self):                       # 读：c.area（不加括号）
        return 3.14159 * self.radius ** 2

    @property
    def radius(self):                     # 真正的存储属性也包一层
        return self._radius

    @radius.setter                        # 写：c.radius = 5 时校验
    def radius(self, value):
        if value < 0:
            raise ValueError("半径不能为负")
        self._radius = value

c = Circle(2)
print(c.area)      # 12.56636
c.radius = 3       # 走 setter
print(c.area)
# c.radius = -1    # ❌ ValueError`,
    },
    {
      id: "7_4", title: "§7.4 继承与 MRO", desc: "重写与 super()、isinstance / issubclass、多继承 C3 线性化 __mro__、ABC 抽象基类",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/classes.html#inheritance",
      html: `<ul>
<li><code>class Dog(Animal):</code> 继承：自动拥有父类的一切；子类写<b>同名方法</b>即<b>重写（override）</b>父类版本</li>
<li><code>super().speak()</code> 调用父类版本</li>
<li>⭐ <code>isinstance(d, Dog)</code> 和 <code>isinstance(d, Animal)</code> 都是 True——<b>子类实例也是父类的实例</b>；<code>issubclass(Dog, Animal)</code> 判断类之间的继承关系</li>
<li>⭐ <b>多继承与 MRO（方法解析顺序）</b>：属性查找顺序由 <b>C3 线性化算法</b>决定（保证"子类优先于父类、声明顺序优先、整体一致"）；用 <code>类名.__mro__</code> 或 <code>类名.mro()</code> 查看，不用背算法</li>
<li><b>抽象基类</b>（强制子类实现某些方法）：<code>from abc import ABC, abstractmethod</code>；有 <code>@abstractmethod</code> 的类<b>不能实例化</b>（TypeError），子类实现全部抽象方法后才能实例化</li></ul>`,
      code: String.raw`class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return "..."

class Dog(Animal):                          # 继承 Animal
    def speak(self):                        # 重写（override）父类方法
        return "汪汪"
    def describe(self):
        return f"{super().speak()}→{self.speak()}"   # super() 调父类版本

d = Dog("旺财")
print(d.describe())
print(isinstance(d, Dog), isinstance(d, Animal))   # True True ⭐ 子类实例也是父类的实例
print(issubclass(Dog, Animal))                     # True

# ⭐ 多继承与 MRO（方法解析顺序）
class A:
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

print(D().who())     # B：按 MRO 顺序找到的第一个
print([c.__name__ for c in D.__mro__])   # ['D', 'B', 'C', 'A', 'object']

# 抽象基类：强制子类实现某些方法
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        ...

class Circle(Shape):
    def area(self):
        return 3.14

try:
    Shape()        # ❌ TypeError：有抽象方法的类不能实例化
except TypeError as e:
    print("拦截：", e)
print(Circle().area())   # ✅ 实现全部抽象方法后才能实例化`,
    },
    {
      id: "7_5", title: "§7.5 魔术方法速查", desc: "dunder 协议：__repr__ / __str__ 分工、重写 __eq__ 后要定义 __hash__、运算符重载、12 组对照表",
      doc: "https://docs.python.org/zh-cn/3.14/reference/datamodel.html#special-method-names",
      html: `<p>魔术方法（双下划线方法 / dunder）是 Python 的<b>协议</b>：定义了它，内置语法就认识你的对象——这就是列表、字符串用起来"天生顺手"的原因。</p>
<ul>
<li><code>__repr__</code> 开发者视角：repr(v)、交互式直接回显；⭐ 惯例：尽量写成<b>能还原对象的表达式</b></li>
<li><code>__str__</code> 用户视角：print(v)、str(v)；缺省<b>回退到 __repr__</b></li>
<li><code>__add__</code> 对应 v1 + v2、<code>__eq__</code> 对应 ==、<code>__len__</code> 对应 len()、<code>__getitem__</code> 对应 v[0]（还能顺带支持切片和迭代）、<code>__call__</code> 把对象当函数调</li>
<li>⭐ 重写 <code>__eq__</code> 后默认<b>不可哈希</b>，需同时定义 <code>__hash__</code> 才能当字典键/放集合</li></ul>
<table><tr><th>魔术方法</th><th>对应语法</th></tr>
<tr><td><code>__init__</code> / <code>__new__</code></td><td>初始化 / 创建实例（见 §19.3）</td></tr>
<tr><td><code>__str__</code> / <code>__repr__</code></td><td><code>str()</code> / <code>repr()</code> ⭐ 两者用途不同</td></tr>
<tr><td><code>__len__</code> / <code>__bool__</code></td><td><code>len()</code> / 真值测试</td></tr>
<tr><td><code>__getitem__</code> / <code>__setitem__</code> / <code>__delitem__</code></td><td><code>obj[i]</code> 读 / 写 / 删</td></tr>
<tr><td><code>__contains__</code></td><td><code>x in obj</code></td></tr>
<tr><td><code>__iter__</code> / <code>__next__</code></td><td><code>for x in obj</code>（见 §11.2）</td></tr>
<tr><td><code>__enter__</code> / <code>__exit__</code></td><td><code>with obj:</code>（见 §12.2）</td></tr>
<tr><td><code>__eq__</code> / <code>__lt__</code> 等</td><td><code>==</code> / <code>&lt;</code>（<code>functools.total_ordering</code> 可补全）</td></tr>
<tr><td><code>__hash__</code></td><td>当字典键/放集合（重写 <code>__eq__</code> 后默认不可哈希，需同时定义）⭐</td></tr>
<tr><td><code>__add__</code> / <code>__mul__</code> 等</td><td>运算符重载</td></tr>
<tr><td><code>__call__</code></td><td><code>obj()</code></td></tr>
<tr><td><code>__getattr__</code> / <code>__setattr__</code></td><td>属性访问拦截（见 §19.1）</td></tr></table>`,
      code: String.raw`class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):                       # 开发者视角：repr(v)、交互式直接回显
        return f"Vector({self.x}, {self.y})"  # ⭐ 惯例：尽量写成能还原对象的表达式

    def __str__(self):                        # 用户视角：print(v)、str(v)；缺省回退到 __repr__
        return f"({self.x}, {self.y})"

    def __add__(self, other):                 # v1 + v2
        return Vector(self.x + other.x, self.y + other.y)

    def __eq__(self, other):                  # v1 == v2
        return (self.x, self.y) == (other.x, other.y)

    def __len__(self):                        # len(v)
        return 2

    def __getitem__(self, i):                 # v[0]、v[1]，还能顺带支持切片和迭代
        return (self.x, self.y)[i]

    def __call__(self):                       # v() 把对象当函数调
        return "被调用了"

v = Vector(1, 2) + Vector(3, 4)
print(repr(v))          # Vector(4, 6)
print(str(v))           # (4, 6)
print(v == Vector(4, 6))
print(len(v), v[0], v[1], v())`,
    },
  ],
});
