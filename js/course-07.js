/* ===== 课程内容数据 · 第七层 =====
 * 内容来源：《Python 3 语法完全指南》（outputs/python-syntax-guide.md）第七层 · 面向对象。
 * 写法规范与 data-course.js 一致：section.id 即指南小节号；points 为分条要点（内联 <code>/<b>）；
 * code 示例均经本地 Python 实际运行验证（tools/verify_examples.py）；expect 为真实输出。
 * 适用版本：3.8—3.14 ｜ 最后核对：2026-09
 */
COURSE.push({
  id: 7,
  title: "第七层 · 面向对象",
  minutes: 80,
  goal: "会用 class 建模：实例属性、方法、继承、特殊方法与 @property",
  prereq: "第四层（函数）",
  versions: "3.8—3.14",
  checked: "2026-09",
  sections: [
    {
      id: "7.1", title: "类与对象：自己定义一种「东西」",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/classes.html",
      points: [
        "类（class）是<b>图纸</b>，对象是图纸造出来的<b>实物</b>；同一张图纸能造很多个互不相干的实物",
        "<code>class Dog:</code> 后接缩进代码块，里面暂没东西可写 <code>pass</code>",
        "调用类名 <code>Dog()</code> 就是造一个对象（实例化），每次得到独立的新对象",
        "<code>isinstance(对象, 类)</code> 判断对象是不是某个类造出来的",
      ],
      code: String.raw`class Dog:
    """小狗类：暂时空着，后面填。"""
    pass

d1 = Dog()
d2 = Dog()
print(d1 is d2)             # 两次实例化是两个独立对象
print(isinstance(d1, Dog))
print(Dog.__doc__)`,
      expect: "False\nTrue\n小狗类：暂时空着，后面填。",
      note: "把 d1 is d2 改成 d1 == d2 运行看看——没定义比较规则时，== 默认也是比较身份。",
    },
    {
      id: "7.2", title: "__init__ 与实例属性",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/classes.html#class-objects",
      points: [
        "<code>__init__</code> 是实例化时自动执行的初始化方法，不是构造函数（对象在它还轮不到造）",
        "第一个参数 <code>self</code> 就是刚造出来的那个对象本身",
        "<code>self.name = name</code> 把值贴在对象上，这就是<b>实例属性</b>",
        "实例属性随时可改可增：Python 的对象是个开放的包",
      ],
      code: String.raw`class Dog:
    def __init__(self, name, age):
        self.name = name   # 实例属性：贴在自己身上
        self.age = age

d = Dog("旺财", 3)
print(d.name, d.age)
d.age = 4                  # 属性可以随时改
print(d.age)`,
      expect: "旺财 3\n4",
      note: "试试在最后一行加 d.weight = 10; print(d.weight)——给对象临时加属性完全合法。",
    },
    {
      id: "7.3", title: "实例方法与 self",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/classes.html#instance-objects",
      points: [
        "类里定义的函数就是<b>方法</b>，第一个参数习惯叫 <code>self</code>",
        "<code>d.bark()</code> 实际是 <code>Dog.bark(d)</code> 的语法糖——self 由 Python 自动传入",
        "方法里通过 self 读写这个对象自己的属性，各对象互不影响",
        "⭐ 忘了写 self 是最常见的新手错误：TypeError 会说参数对不上",
      ],
      code: String.raw`class Dog:
    def __init__(self, name):
        self.name = name
    def bark(self):
        return f"{self.name}：汪汪！"

d = Dog("旺财")
print(d.bark())        # 等价于下面这行
print(Dog.bark(d))     # self 就是 d`,
      expect: "旺财：汪汪！\n旺财：汪汪！",
      note: "把 bark 的 self 参数删掉再运行，看 TypeError 说什么。",
    },
    {
      id: "7.4", title: "类属性 vs 实例属性",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/classes.html#class-and-instance-variables",
      points: [
        "写在类体里、方法外面的是<b>类属性</b>：全类共享一份，改一处处处生效",
        "写在 <code>self.x = ...</code> 的是实例属性：每个对象各有一份",
        "给某个对象赋值同名属性，会<b>遮蔽</b>类属性——只影响它自己",
        "⭐ 别用可变对象（列表/字典）当类属性：一处 append，所有对象跟着变",
      ],
      code: String.raw`class Dog:
    species = "犬科"          # 类属性：所有实例共享

    def __init__(self, name):
        self.name = name      # 实例属性：各玩各的

a = Dog("旺财")
b = Dog("来福")
print(a.species, b.species)
Dog.species = "狼"            # 类属性一改全改
print(a.species, b.species)
a.species = "猫"              # 给 a 贴了同名实例属性，遮蔽类属性
print(a.species, b.species)`,
      expect: "犬科 犬科\n狼 狼\n猫 狼",
      note: "体会第三次打印：为什么 a 是猫、b 还是狼？",
    },
    {
      id: "7.5", title: "继承与 super()",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/classes.html#inheritance",
      points: [
        "<code>class Dog(Animal):</code> 表示 Dog 继承 Animal：自动拥有父类的一切",
        "子类写<b>同名方法</b>会覆盖父类版本；想顺带用父类的就用 <code>super().方法名(...)</code>",
        "多态：把不同子类对象装进同一个列表，同一行调用各自表现出不同行为",
        "继承表示「是一种」（Dog 是一种 Animal）；只是用到就写成属性组合，别硬继承",
      ],
      code: String.raw`class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        return f"{self.name} 汪汪"

class Cat(Animal):
    def speak(self):
        return f"{self.name} 喵喵"

pets = [Dog("旺财"), Cat("咪咪")]
for p in pets:
    print(p.speak())      # 多态：同一调用，各自表现`,
      expect: "旺财 汪汪\n咪咪 喵喵",
      note: "给 Animal 加 def eat(self): return 「进食」，两个子类不用改也能直接 p.eat()。",
    },
    {
      id: "7.6", title: "特殊方法：让对象融入 Python 语法",
      doc: "https://docs.python.org/zh-cn/3.14/reference/datamodel.html#special-method-names",
      points: [
        "双下划线方法（dunder）是 Python 的<b>协议</b>：定义了它，内置语法就认识你的对象",
        "<code>__repr__</code> 决定 print/交互式显示什么；<code>__add__</code> 让对象能用 + 相加",
        "<code>__len__</code> 对应 len()、<code>__eq__</code> 对应 ==、<code>__abs__</code> 对应 abs()",
        "这就是列表、字符串用起来「天生顺手」的原因——它们都实现了这套协议",
      ],
      code: String.raw`class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __repr__(self):
        return f"Vector({self.x}, {self.y})"
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)
    def __abs__(self):
        return (self.x ** 2 + self.y ** 2) ** 0.5

v = Vector(3, 4) + Vector(1, 2)
print(v)
print(abs(v))`,
      expect: "Vector(4, 6)\n7.211102550927978",
      note: "加一行 print(len(v)) 会报 TypeError——没实现 __len__ 的对象没有长度。",
    },
    {
      id: "7.7", title: "属性保护与 @property",
      doc: "https://docs.python.org/zh-cn/3.14/library/functions.html#property",
      points: [
        "单下划线 <code>_age</code> 是约定：「内部使用，别直接碰」——Python 不做强制，靠自觉",
        "<code>@property</code> 把方法伪装成属性：读 <code>p.age</code> 实际走的是方法",
        "配 <code>@age.setter</code> 就能在赋值时做校验，把非法值拦在门外",
        "好处：外部用法不变，内部随时能加逻辑——这是封装的基本功",
      ],
      code: String.raw`class Person:
    def __init__(self, name, age):
        self.name = name
        self._age = age          # 单下划线：约定"内部使用"

    @property
    def age(self):               # 读 age 像访问属性，实际走方法
        return self._age

    @age.setter
    def age(self, value):
        if value < 0:
            raise ValueError("年龄不能为负")
        self._age = value

p = Person("小明", 18)
p.age = 19
print(p.age)
try:
    p.age = -1
except ValueError as e:
    print("拦住了：", e)`,
      expect: "19\n拦住了： 年龄不能为负",
      note: "把 p.age = -1 换成 print(p._age) 看看——单下划线挡不住你，它只是约定。",
    },
    {
      id: "7.8", title: "综合实战：一个银行账户类",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/classes.html",
      points: [
        "建模思路：<b>名词变属性，动词变方法</b>——账户有余额（属性），能存取（方法）",
        "非法操作（存负数、取得比余额多）在方法里 raise 拦住，对象就不会进入坏状态",
        "顺手实现 __repr__，调试时一眼看清对象内容",
        "到这一步，你已经能写出别人拿来就能用的类了",
      ],
      code: String.raw`class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("金额必须为正")
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("余额不足")
        self.balance -= amount

    def __repr__(self):
        return f"Account({self.owner!r}, {self.balance})"

acc = Account("小明", 100)
acc.deposit(50)
acc.withdraw(30)
print(acc)
try:
    acc.withdraw(999)
except ValueError as e:
    print("拦截：", e)`,
      expect: "Account('小明', 120)\n拦截： 余额不足",
      note: "给 Account 加 transfer(self, other, amount) 转账方法，试着转 50 给另一个账户。",
    },
  ],
  quiz: [
    { q: "d = Dog(\"旺财\") 之后调用 d.bark()，方法里的 self 是谁？",
      options: ["d 这个实例", "Dog 类", "None（自动传入空值）", "一个全局变量"], answer: 0,
      explain: "d.bark() 是 Dog.bark(d) 的语法糖，self 就是调用它的那个实例。" },
    { q: "关于类属性和实例属性，正确的是？",
      options: ["类属性所有实例共享一份，实例属性各自独立", "实例属性所有对象共享", "类属性必须在 __init__ 里定义", "两者没有任何区别"], answer: 0,
      explain: "类属性写在类体里全类共享；self.x 写的是实例属性，每个对象一份。" },
    { q: "子类重写了父类的 speak()，对子类实例调用 speak() 会执行？",
      options: ["子类的版本", "父类的版本", "两个都执行", "报冲突错误"], answer: 0,
      explain: "方法查找先在子类找，找到就用——这就是覆盖（多态的基础）。" },
  ],
});
