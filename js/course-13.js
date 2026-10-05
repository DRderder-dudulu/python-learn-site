/* ===== 课程内容数据 · 第十三层 =====
 * 内容来源：《Python 3 语法完全指南》（outputs/python-syntax-guide.md）第十三层 · 类型注解。
 * 写法规范与 data-course.js 一致：section.id 即指南小节号；points 为分条要点（内联 <code>/<b>）；
 * code 示例均经本地 Python 实际运行验证（tools/verify_examples.py）；expect 为真实输出。
 * 适用版本：3.8—3.14 ｜ 最后核对：2026-09
 */
COURSE.push({
  id: 13,
  title: "第十三层 · 类型注解",
  minutes: 50,
  goal: "会给变量与函数写类型注解，理解注解不影响运行，认识常见写法与 @dataclass",
  prereq: "第七层（面向对象）",
  versions: "3.8—3.14",
  checked: "2026-09",
  sections: [
    {
      id: "13.1", title: "为什么需要注解：不影响运行的说明书",
      doc: "https://docs.python.org/zh-cn/3.14/library/typing.html",
      points: [
        "⭐ 注解<b>不影响程序运行</b>：类型传错照样跑，Python 仍是动态类型",
        "它是写给<b>人类 + 静态检查器</b>（mypy / pyright）看的说明书",
        "项目越大、人越多，注解越像护栏：看一眼签名就知道该传什么",
        "<code>函数.__annotations__</code> 能读到这些标注——它们确实存在，只是没人强制执行",
      ],
      code: String.raw`def greet(name: str, times: int = 1) -> str:
    return name * times

print(greet("哈", 3))
print(greet(2, 3))        # 注解说该传 str，传 int 也照跑
print(greet.__annotations__)`,
      expect: "哈哈哈\n6\n{'name': <class 'str'>, 'times': <class 'int'>, 'return': <class 'str'>}",
      note: "把注解改成 def greet(name: int, times: str)——照样跑，没人拦你。",
    },
    {
      id: "13.2", title: "变量与函数注解基础",
      doc: "https://docs.python.org/zh-cn/3.14/reference/simple_stmts.html#annotated-assignment-statements",
      points: [
        "变量：<code>age: int = 18</code>；参数：<code>a: int</code>；返回值：<code>-> int</code>",
        "带默认值的写法：<code>times: int = 1</code>——注解在前，默认值在后",
        "空容器先标外壳再赋值：<code>scores: list = []</code>，元素类型下一节再细化",
        "⭐ 注解写错了也没人管：<code>int</code> 写成 <code>str</code>，解释器眼皮都不抬",
      ],
      code: String.raw`age: int = 18
name: str = "小明"
scores: list = [90, 85]     # 元素类型先不写，13.4 再细化

def add(a: int, b: int = 0) -> int:
    return a + b

print(age, name, scores)
print(add(5), add(5, 2))`,
      expect: "18 小明 [90, 85]\n5 7",
      note: "试试 age: int = \"abc\"——能跑。再说一遍：注解不是检查。",
    },
    {
      id: "13.3", title: "mypy 的思路：运行前先挑错（说明性）",
      doc: "https://mypy.readthedocs.io/en/latest/",
      points: [
        "mypy / pyright 是<b>不运行代码</b>的检查器：只读注解，找出类型矛盾",
        "工作流：写注解 → 跑 <code>mypy 文件.py</code> → 按提示修——错误在运行之前暴露",
        "⭐ 本层不要求安装 mypy，先建立认知：注解是给工具和人的，不是给解释器的",
        "⭐ 注解也<b>不是运行时检查</b>：<code>isinstance([1,2], list[int])</code> 会直接 TypeError——运行时只查外壳，查不了元素",
      ],
      code: String.raw`def double(x: int) -> int:
    return x * 2

print(double(21))
print(double("ab"))    # mypy 会在这里标红，运行时却给出 abab

data = [1, 2]
print(isinstance(data, list))   # 运行时检查只能看外壳`,
      expect: "42\nabab\nTrue",
      note: "有条件的话 pip install mypy 后对这段跑 mypy，看它精确指出 double(\"ab\")。",
    },
    {
      id: "13.4", title: "常见类型写法：List / Optional / Union",
      ver: "3.9+",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#types-genericalias",
      points: [
        "3.9+ 直接用内置泛型：<code>list[int]</code>、<code>dict[str, int]</code>，不用再 import typing",
        "<b>3.8 项目</b>用 typing 版：<code>List[int]</code>、<code>Dict[str, int]</code>——含义完全一样",
        "<code>Optional[int]</code> = int 或 None；<code>Union[int, str]</code> = 二选一",
        "3.10+ 联合类型可写 <code>int | None</code>，更简洁；老版本仍用 Optional / Union",
        "<code>tuple[int, ...]</code> 表示任意个 int；<code>Any</code> 表示放弃检查（能不用就不用）",
      ],
      code: String.raw`from typing import Optional, Union

def first(items: list[int]) -> int:     # 3.9+ 写法；3.8 换成 List[int]
    return items[0]

scores: dict[str, int] = {"Tom": 90}    # 3.8 用 Dict[str, int]

def find(flag: bool) -> Optional[int]:  # int 或 None
    return 1 if flag else None

def pick(x: Union[int, str]) -> str:    # 二选一
    return str(x)

print(first([10, 20, 30]))
print(scores, find(False), pick(7))`,
      expect: "10\n{'Tom': 90} None 7",
      note: "3.10+ 环境把 Optional[int] 换成 int | None 试试，效果相同。",
    },
    {
      id: "13.5", title: "dataclass 简介：少写样板代码",
      doc: "https://docs.python.org/zh-cn/3.14/library/dataclasses.html",
      points: [
        "<code>@dataclass</code> 按类体里的注解自动生成 <code>__init__</code>、<code>__repr__</code>、<code>__eq__</code>",
        "⭐⭐ 可变默认值必须 <code>field(default_factory=list)</code>——直接写 <code>= []</code> 会被拒绝",
        "<code>field(repr=False)</code> 让敏感字段（如密码）不出现在打印里",
        "常用参数：<code>frozen=True</code> 不可变、<code>order=True</code> 支持大小比较",
      ],
      code: String.raw`from dataclasses import dataclass, field

@dataclass
class User:
    name: str
    age: int = 0
    tags: list = field(default_factory=list)   # ⭐ 可变默认值
    password: str = field(repr=False, default="")

u = User("Tom")
u.tags.append("vip")
print(u)                            # password 不出现在 repr
print(User("Amy") == User("Amy"))   # True：自动 __eq__`,
      expect: "User(name='Tom', age=0, tags=['vip'])\nTrue",
      note: "试试写成 tags: list = []（不带 field）——dataclass 会直接报错拒绝。",
    },
  ],
  quiz: [
    { q: "给函数加了类型注解后，传入错误类型的实参会怎样？",
      options: ["立即抛出 TypeError", "正常运行——注解不做强制", "打印警告但继续", "程序拒绝启动"], answer: 1,
      explain: "注解只是说明书，解释器完全不看；查错要靠 mypy / pyright 这类静态检查器。" },
    { q: "Optional[int] 的含义是？",
      options: ["任意类型都行", "可选的函数参数", "int 或 None", "未初始化的 int"], answer: 2,
      explain: "Optional[X] 等价于 Union[X, None]，即「要么是 X，要么是 None」。" },
    { q: "dataclass 里列表字段的正确默认值写法是？",
      options: ["tags: list = []", "tags: list = field(default_factory=list)", "tags: list = None", "tags = list()"], answer: 1,
      explain: "可变默认值（列表/字典）必须用 default_factory，否则所有实例共享同一个列表，dataclass 会直接报错拦住。" },
  ],
});
