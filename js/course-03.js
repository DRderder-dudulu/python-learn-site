/* ===== 课程内容数据 · 第三层 =====
 * 内容来源：《Python 3 语法完全指南》（outputs/python-syntax-guide.md）第三层 · 数据结构。
 * 写法规范：section.id 即指南小节号；points 为分条要点（内联 <code>/<b>）；
 * 【对应规范】points 每条要点必须在 code 中有明确对应：可演示的写成可运行代码并配注释；
 * 错误/危险示范以「故意注释掉」的形式呈现（学员可取消注释亲测报错）；
 * code 示例均经本地 Python 实际运行验证（tools/verify_examples.py + verify_expects.py）；expect 为真实输出。
 * 适用版本：3.8—3.14 ｜ 最后核对：2026-10
 */
COURSE.push({
  id: 3,
  title: "第三层 · 数据结构",
  minutes: 70,
  goal: "熟练列表、字典、集合、元组的核心操作与切片、解包、del",
  prereq: "第一、二层",
  versions: "3.8—3.14",
  checked: "2026-10",
  sections: [
    {
      id: "3.1", title: "列表：增删改查",
      what: "列表是有顺序的一排格子，用方括号写、按下标取，里面的东西随时能加能改。",
      use: "装一串会变化的数据——名单、成绩、购物车——列表是最常用的容器。往里面加、删、改、查、排序的基本操作，全在这节。",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#lists",
      points: [
        "增：append 尾加、extend 接一串、insert 按位插",
        "删：remove 按值（没有则报错）、pop 按下标弹出、del 按下标/切片",
        "改/查：按下标改；in / index / count / len 查询",
        "⭐ sort() 原地排序返回 None；要新列表用 sorted()",
        "⭐ b = a 是同一个列表；拷贝用 a[:] 或 a.copy()（浅拷贝）",
      ],
      code: String.raw`nums = [3, 1, 2]
nums.append(4)               # 增：append 尾加
nums.extend([5, 6])          # 增：extend 接一串
nums.insert(0, 99)           # 增：insert 按位插
print(nums)

nums.remove(99)              # 删：remove 按值
# nums.remove(42)            # ⭐ 错误示范（故意注释掉）：值不存在会报 ValueError
last = nums.pop()            # 删：pop 按下标弹出（默认末尾）
del nums[0]                  # 删：del 按下标（也能删切片）
print(nums, "弹出的是", last)

nums[0] = 100                # 改：按下标改
print(2 in nums, nums.index(2), nums.count(2), len(nums))   # 查：in / index / count / len

result = nums.sort()         # ⭐ sort() 原地排序，返回值是 None
print(nums, result)
print(sorted([3, 1, 2]))     # 要新列表用 sorted()，原列表不动

a = [1, [2]]
b = a                        # ⭐ b = a 是同一个列表：贴了两个名字
c = a[:]                     # 拷贝用 a[:] 或 a.copy()——浅拷贝：外层独立，内层仍共享
a[1].append(3)
print(b)                     # b 跟着变：它就是 a
print(c)                     # c 的内层子列表也变了：浅拷贝共享内层
print(b is a, c is a)`,
      expect: "[99, 3, 1, 2, 4, 5, 6]\n[1, 2, 4, 5] 弹出的是 6\nTrue 1 1 4\n[2, 4, 5, 100] None\n[1, 2, 3]\n[1, [2, 3]]\n[1, [2, 3]]\nTrue False",
      note: "深拷贝用 copy.deepcopy（指南 §3.1 拷贝三层辨析）。",
    },
    {
      id: "3.2", title: "元组：不可变序列",
      what: "元组是加了锁的列表：圆括号包起来，写定之后一个元素都不许改，改了直接报错。",
      use: "数据不想被任何人改动时用元组：改一下就报错，天然安全。函数一次返回多个结果、拿坐标当字典键，背后都是它。",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#tuples",
      points: [
        "元组不可变：t[0] = 9 会报 TypeError",
        "⭐ 单元素元组必须带逗号：(5,) 才是元组，(5) 只是数字",
        "可以打包/解包；可哈希的元组能当字典键",
        "用途：函数多返回值、保证数据不被改",
      ],
      code: String.raw`t = (1, 2, 3)             # 元组不可变：数据保证不被改
# t[0] = 9                   # ⭐ 错误示范（故意注释掉）：元组不可变，报 TypeError
single = (5,)                # ⭐ 单元素元组必须带逗号
not_tuple = (5)              # (5) 只是数字 5，不是元组
print(t, single, not_tuple)

x, y = (10, 20)              # 打包/解包：右边 (10, 20) 是打包，左边逐个解开
print(x, y)

def minmax(nums):            # 用途：函数多返回值 = 返回元组
    return min(nums), max(nums)
lo, hi = minmax([3, 1, 4])
print(lo, hi)

point = {(0, 0): "原点"}     # 可哈希的元组能当字典键
print(point[(0, 0)])`,
      expect: "(1, 2, 3) (5,) 5\n10 20\n1 4\n原点",
      note: "试试 t[0] = 9，确认会报 TypeError。",
    },
    {
      id: "3.3", title: "字典：键值对",
      what: "字典是一对一对存数据的容器：花括号里写「键: 值」，找东西时报键名，立刻拿到对应的值。",
      use: "按「名字」查「内容」的数据用字典存：按用户名查年龄、按学号查成绩，一一对应的查找关系就该想到它。",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#mapping-types-dict",
      points: [
        "⭐ 键必须可哈希（str/int/tuple）；值没有限制",
        "⭐ {} 是空字典，不是空集合！空集合写 set()",
        "取键优先 d.get(键, 默认值)，避免 KeyError",
        "3.7+ 保持插入顺序；合并用 |（3.9+，后者覆盖前者）",
      ],
      code: String.raw`user = {"name": "Tom", "age": 18}   # ⭐ 键必须可哈希（str/int/tuple）；值没有限制
user["city"] = "北京"
user[(1, 2)] = "元组键"      # 元组可哈希，可以当键
# user[[1, 2]] = "列表键"    # ⭐ 错误示范（故意注释掉）：列表不可哈希，报 TypeError

empty_dict = {}              # ⭐ {} 是空字典，不是空集合
empty_set = set()            # 空集合只能写 set()
print(type(empty_dict), type(empty_set))

print(user.get("email", "无"))   # 取键优先 d.get(键, 默认值)，避免 KeyError
# print(user["email"])           # 错误示范（故意注释掉）：直接取不存在的键，报 KeyError

for k, v in user.items():    # 3.7+ 保持插入顺序：按写入顺序遍历
    print(k, v)

merged = {"a": 1} | {"a": 2, "b": 3}   # 合并用 |（3.9+）：后者覆盖前者
print(merged)`,
      expect: "<class 'dict'> <class 'set'>\n无\nname Tom\nage 18\ncity 北京\n(1, 2) 元组键\n{'a': 2, 'b': 3}",
      note: "把 get 换成 user[\"email\"] 直接取，会触发 KeyError。",
    },
    {
      id: "3.4", title: "集合：去重与运算",
      what: "集合是一堆不重复、无顺序的值：重复元素只保留一个；空集合要写 set()，{} 是空字典。",
      use: "要自动去重，或求两批数据的交集、差集（比如「两人共同加过的群」），集合最顺手；要反复判断「在不在里面」，先转 set 再查快得多。",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#set-types-set-frozenset",
      points: [
        "自动去重、无序；空集合只能写 set() ⭐",
        "运算：| 并、& 交、- 差、^ 对称差",
        "⭐ 成员判断 x in s 是 O(1)：大批量判断先转 set",
        "frozenset 是不可变集合，可以当字典键",
      ],
      code: String.raw`s = set([1, 2, 2, 3])     # 自动去重、无序
print(sorted(s))             # 集合顺序不定，演示时用 sorted() 输出才确定
empty = set()                # ⭐ 空集合只能写 set()，{} 是空字典

a, b = {1, 2, 3}, {2, 3, 4}
print(sorted(a | b))         # | 并
print(sorted(a & b))         # & 交
print(sorted(a - b))         # - 差
print(sorted(a ^ b))         # ^ 对称差

print(2 in a)                # ⭐ 成员判断 x in s 是 O(1)
big = set(range(10000))      # 大批量判断先转 set 再查
print(9999 in big)

frozen = frozenset([1, 2])   # frozenset 是不可变集合，可以当字典键
d = {frozen: "一组"}
print(d[frozen])`,
      expect: "[1, 2, 3]\n[1, 2, 3, 4]\n[2, 3]\n[1]\n[1, 4]\nTrue\nTrue\n一组",
      note: "列表去重常用 set，但要保序用 dict.fromkeys（见习题）。",
    },
    {
      id: "3.5", title: "字符串方法分组",
      what: "字符串方法是对字符串做小加工的工具：strip 切边、split 切开、join 拼合，全都返回新串、不改原串。",
      use: "处理文字的日常工具箱：去两端空白、按逗号切开、再拼回去、找子串。清洗用户输入、处理文本内容时，这组方法出现率最高。",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#string-methods",
      points: [
        "所有方法返回新串，原串不变（字符串不可变）",
        "strip() 去两端空白；⭐ 参数是「字符集合」不是前后缀",
        "精确去前后缀用 removeprefix/removesuffix（3.9+）",
        "split 返回列表；join 是「分隔符」的方法；find 找不到给 -1，index 找不到报错",
      ],
      code: String.raw`s = "  Hello  "
print(s.strip())             # strip() 去两端空白
print(s)                     # 原串不变：所有方法都返回新串（字符串不可变）

print("aabbcc".strip("ab"))  # ⭐ strip 的参数是【字符集合】不是前后缀
print("report.csv".removesuffix(".csv"))       # 精确去前后缀用 removeprefix/removesuffix（3.9+）
print("https://example.com".removeprefix("https://"))

parts = "a,b,c".split(",")   # split 返回列表
print(parts)
print("-".join(parts))       # join 是【分隔符】的方法

print("hello".find("zz"))    # find 找不到给 -1，不报错
# print("hello".index("zz")) # 错误示范（故意注释掉）：index 找不到会报 ValueError`,
      expect: "Hello\n  Hello  \ncc\nreport\nexample.com\n['a', 'b', 'c']\na-b-c\n-1",
      note: "试试 \"aabbcc\".strip(\"ab\")——想想为什么结果是 \"cc\"。",
    },
    {
      id: "3.6", title: "切片",
      what: "切片就是给序列「剪一段」的方括号写法：三个位置用冒号隔开，分别管从哪开始、到哪停、隔几个取。",
      use: "从序列里截取一段：取前三个、隔一个取一个、整体倒过来，都写成 s[起:止:步长]。字符串、列表、元组通用。",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#common-sequence-operations",
      points: [
        "s[start:stop:step]：含头不含尾；start/stop 可省略",
        "负数从尾数；[::-1] 是经典反转写法 ⭐",
        "⭐ 切片越界不报错给空结果（对比：s[10] 会 IndexError）",
        "[:] 是浅拷贝惯用法",
      ],
      code: String.raw`s = "abcdef"
print(s[1:4], s[:3], s[3:])  # s[start:stop:step]：含头不含尾；start/stop 可省略
print(s[-2:], s[::-1])       # 负数从尾数；[::-1] 是经典反转写法 ⭐
print(s[::2])                # step=2：隔一个取一个
print("[" + s[10:20] + "]")  # ⭐ 切片越界不报错，给空结果
# print(s[10])               # 对比（故意注释掉）：单下标越界会报 IndexError

nums = [1, 2, 3]
copy = nums[:]               # [:] 是浅拷贝惯用法
nums.append(4)
print(copy, nums)            # 副本不跟着变`,
      expect: "bcd abc def\nef fedcba\nace\n[]\n[1, 2, 3] [1, 2, 3, 4]",
      note: "切片对 list/tuple/str/bytes 都通用。",
    },
    {
      id: "3.7", title: "序列解包",
      what: "解包是一次性给多个变量赋值的写法：等号左边排几个名字，右边放一串值，按位置一一对上。",
      use: "把一串值一次性拆进多个变量，不用按下标一个个取；带 * 的变量还能把剩余元素一网打尽。遍历字典的键值对，用的就是它。",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/datastructures.html#tuples-and-sequences",
      points: [
        "左右数量必须相等，否则 ValueError（除非带 *）",
        "*变量 收集剩余元素成列表 ⭐",
        "支持嵌套解包；遍历 d.items() 就是解包的日常",
      ],
      code: String.raw`first, *rest = [1, 2, 3, 4]   # ⭐ *变量 收集剩余元素成列表
*head, last = [1, 2, 3, 4]
a, *mid, b = [1, 2, 3, 4]
print(first, rest)
print(head, last)
print(a, mid, b)

# x, y = [1, 2, 3]           # ⭐ 错误示范（故意注释掉）：左右数量必须相等（除非带 *），否则 ValueError

name, (chinese, math) = ("甲", (90, 95))   # 嵌套解包
print(name, chinese, math)

d = {"a": 1, "b": 2}
for k, v in d.items():       # 遍历 d.items() 就是解包的日常
    print(k, v)`,
      expect: "1 [2, 3, 4]\n[1, 2, 3] 4\n1 [2, 3] 4\n甲 90 95\na 1\nb 2",
      note: "把右边换成 [1, 2] 看 mid 变成什么。",
    },
    {
      id: "3.8", title: "del 语句",
      what: "del 是语句不是函数：后面直接跟要删的目标（名字、下标、切片、键），不用加括号。",
      use: "专门负责删除的语句：删变量名、删列表元素、删切片、删字典键都靠它。del 只是摘掉名字，对象还有人用就不会消失。",
      doc: "https://docs.python.org/zh-cn/3.14/reference/simple_stmts.html#the-del-statement",
      points: [
        "del 是语句：删名字、删元素、删切片、删字典键",
        "⭐ del 切片越界不报错；但 del 单个越界索引会 IndexError",
        "del 只是去掉一个引用；对象没有任何引用时才被回收",
      ],
      code: String.raw`name = "临时"
del name                     # del 是语句：删名字
# print(name)                # 错误示范（故意注释掉）：名字已删，报 NameError

nums = [1, 2, 3, 4]
del nums[0]                  # 删元素（按下标）
del nums[1:3]                # 删切片
print(nums)

d = {"a": 1, "b": 2}
del d["a"]                   # 删字典键
print(d)

del nums[10:99]              # ⭐ del 切片越界不报错：静默无事
# del nums[10]               # 对比（故意注释掉）：单个越界索引会报 IndexError
print(nums)

x = [1, 2, 3]
y = x
del x                        # del 只是去掉一个引用（名字）
print(y)                     # 对象还有 y 引用，安然无恙；没有任何引用时才被回收`,
      expect: "[2]\n{'b': 2}\n[2]\n[1, 2, 3]",
      note: "试试 del nums[10]——单个索引越界会报错。",
    },
  ],
  quiz: [
    { q: "nums = [3, 1, 2]; result = nums.sort() 之后 result 是？",
      options: ["None", "[1, 2, 3]", "[3, 1, 2]", "报错"], answer: 0,
      explain: "sort() 原地排序并返回 None；要新列表用 sorted(nums)。" },
    { q: "单独一个 {} 创建的是？",
      options: ["空字典", "空集合", "空列表", "报错"], answer: 0,
      explain: "{} 是空字典；空集合要写 set()。" },
    { q: "[x for x in range(5) if x % 2 == 0] 的结果是？",
      options: ["[0, 2, 4]", "[1, 3]", "[0, 1, 2, 3, 4]", "[2, 4]"], answer: 0,
      explain: "range(5) 是 0~4，其中偶数是 0、2、4。" },
  ],
});
