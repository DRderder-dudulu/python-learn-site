/* ===== 速查·第二层 · 流程控制（§2.1—§2.4） =====
 * 内容来源：《Python 3 语法完全指南》第二层（outputs/python-syntax-guide-v1.md 第 583—763 行），1:1 对齐小节；
 * 示例与课程 §2.x 一致或取自指南，均可运行（tools/verify_examples.py 实跑验证）。
 * 适用版本：3.8—3.14（match 需 3.10+） ｜ 语言规则以 Python 官方文档为准。
 */
CHEATSHEET_ADV.push({
  layerId: 2,
  layer: "第二层 · 流程控制",
  stage: "一",
  topics: [
    {
      id: "2_1", title: "§2.1 if / elif / else 条件分支", desc: "冒号+缩进、elif 任意多个、条件是真值测试、不写 == True、边界值与分支顺序",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/controlflow.html#if-statements",
      html: `<ul>
<li>结构：冒号 + 缩进代码块；<code>elif</code>（= else if）可写<b>任意多个</b>；<code>else</code> 在以上都不满足时执行，<b>可省略</b></li>
<li>条件<b>不必写括号</b>；条件位置放的是<b>真值测试</b>——任何表达式都行，按 §1.7 假值清单判断真假（空串、0、None、空容器为假）</li>
<li>⭐ <code>if x == True:</code> 是多余写法，直接 <code>if x:</code>；判空用 <code>if not name:</code></li>
<li>⭐ <b>边界值要想清楚</b>：<code>score >= 60</code> 含不含 60？分支<b>从高到低按顺序判断</b>，第一个满足的执行后其余全部跳过——条件顺序写反是新手最常犯的错</li></ul>`,
      code: String.raw`score = 85

if score >= 90:
    print("优秀")
elif score >= 60:     # elif = else if，可写任意多个
    print("及格")
else:                 # 以上都不满足时执行，可省略
    print("不及格")

# 条件位置是真值测试：不用写 == True
x = 1
if x:
    print("x 为真")

name = ""
if not name:          # 惯用：判空不用 == ""
    print("名字为空")

# 边界值检查：60 到底算不算及格？
print(60 >= 60, 59 >= 60)   # True False`,
    },
    {
      id: "2_2", title: "§2.2 while 循环", desc: "while 条件循环、更新条件变量防死循环、break/continue、循环 else 子句与「没找到」用法",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/controlflow.html",
      html: `<ul>
<li><code>while 条件:</code> 条件为真就一圈圈执行；⭐ <b>别忘了在循环体里更新条件变量</b>，否则死循环</li>
<li><code>break</code>：立刻跳出整个循环（<code>else</code> <b>不</b>执行）；<code>continue</code>：跳过本轮剩余部分，进入下一轮</li>
<li>⭐ <b>while / for 的 else 子句</b>：循环<b>正常结束</b>（没被 break 打断）时执行；天生适合"找了一圈没找到"——找到就 break，没找到走 else</li></ul>`,
      code: String.raw`count = 0
while count < 3:      # 条件为真就一圈圈执行
    print(count)
    count += 1        # ⭐ 别忘了更新条件变量，否则死循环
else:                 # ⭐ while 的 else：循环正常结束（没被 break 打断）时执行
    print("循环正常跑完")

# ⭐ else 子句的典型用途——"找了一圈没找到"
nums = [1, 3, 5, 7]
for n in nums:
    if n % 2 == 0:
        print("找到偶数", n)
        break
else:                 # 没 break 过，即没找到
    print("没有偶数")`,
    },
    {
      id: "2_3", title: "§2.3 for 循环与 range", desc: "for 是遍历、range 四种形式与惰性、enumerate/zip/reversed/sorted、边遍历边修改的坑",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/controlflow.html#for-statements",
      html: `<ul>
<li>Python 的 <code>for</code> 是<b>遍历</b>：把可迭代对象（字符串、列表等）里的元素一个个取出来</li>
<li><code>range(5)</code> → 0~4｜<code>range(2, 10)</code> → 2~9｜<code>range(0, 10, 3)</code> → 0 3 6 9｜<code>range(10, 0, -1)</code> → 10~1 负步长倒数——<b>不含右端点</b></li>
<li>⭐ <code>range</code> 是<b>惰性</b>的：不生成完整列表，循环时才逐个产出数字（<code>range(10**9)</code> 不占内存）；<code>list(range(5))</code> 才真的造出 [0, 1, 2, 3, 4]</li>
<li>遍历搭档：⭐ <code>enumerate(names)</code> 同时拿索引和值，<code>enumerate(names, start=1)</code> 从 1 开始编号｜<code>zip(a, b)</code> 并行遍历两个序列｜<code>reversed(...)</code> 倒序遍历｜<code>sorted(...)</code> 按排序后遍历（原列表不变）</li>
<li>⭐ <b>边遍历边修改列表的坑</b>：删除当前元素后，后面的元素前移，下一个被跳过。正确姿势①：遍历副本 <code>nums[:]</code>，修改原列表；姿势②（更推荐）：用推导式造新列表 <code>[n for n in nums if ...]</code></li></ul>`,
      code: String.raw`for ch in "abc":        # 遍历字符串
    print(ch, end=" ")
print()
print(list(range(5)))          # [0, 1, 2, 3, 4]：不含右端点
print(list(range(0, 10, 3)))   # [0, 3, 6, 9]：步长 3
print(list(range(10, 0, -1)))  # 10 到 1：负步长倒数

names = ["甲", "乙", "丙"]
for i, name in enumerate(names):           # 同时拿索引和值 ⭐
    print(i, name)
for i, name in enumerate(names, start=1):  # 从 1 开始编号
    print(i, name)

for a, b in zip(names, [90, 80, 70]):      # 并行遍历两个序列
    print(a, b)

for x in reversed([1, 2, 3]):              # 倒序遍历
    print(x, end=" ")
print()
for x in sorted([3, 1, 2]):                # 按排序后遍历（原列表不变）
    print(x, end=" ")
print()

# ⭐ 边遍历边修改列表的坑：删除后元素前移，下一个被跳过
# nums = [1, 2, 3, 4]
# for n in nums:
#     if n % 2 == 0:
#         nums.remove(n)      # ❌ 结果可能不符合预期

nums = [1, 2, 3, 4]
for n in nums[:]:             # ✅ 正确姿势1：遍历副本，修改原列表
    if n % 2 == 0:
        nums.remove(n)
print(nums)

# ✅ 正确姿势2（更推荐）：用推导式造新列表
nums = [n for n in [1, 2, 3, 4] if n % 2 != 0]
print(nums)`,
    },
    {
      id: "2_4", title: "§2.4 match 模式匹配（3.10+）", desc: "序列/映射/类模式、OR 与 AS 模式、守卫、⭐⭐裸名字是捕获不是比较、__match_args__",
      doc: "https://docs.python.org/zh-cn/3.14/reference/compound_stmts.html#the-match-statement",
      html: `<ul>
<li><code>match</code> 不只是"加强版 switch"，它能按<b>数据的形状</b>做匹配并顺便拆包取值（3.10+）</li>
<li><b>序列模式</b>：<code>case ["quit"]</code> 匹配长度 1 且元素是 "quit"；<code>case ["go", direction]</code> 长度 2、首元素 "go"、第二个捕获到 direction；<code>case ["drop", *items]</code> 用 * 收集剩余元素</li>
<li><code>case _:</code> 通配符匹配一切（相当于 default），通常放最后</li>
<li><b>OR 模式</b>：<code>case 0 | 1 | 2:</code> 用 | 连接多个备选（各分支绑定的名字必须一致）</li>
<li><b>AS 模式</b>：<code>case [x, y] as pair:</code> 匹配的同时把整体起名为 pair</li>
<li><b>守卫</b>：<code>case [x] if x > 0:</code> 模式匹配后再加 if 条件进一步过滤</li>
<li><b>映射模式</b>：<code>case {"type": "user", "name": name}:</code> 匹配字典；⭐ 字典里多出的键默认被忽略；<code>**rest</code> 收集字典剩余部分</li>
<li><b>类模式</b>：<code>case str() as s:</code> 检查类型并捕获；<code>case int(x):</code> 是 int 则绑定到 x</li>
<li>⭐⭐ <b>最大的坑：裸名字是"捕获"不是"比较"</b>——<code>case x:</code> 不是"等于变量 x"，而是"匹配任何东西并绑定给 x"（x 还会被重新赋值）；大写常量名 <code>case EXIT:</code> 也不行，普通名字依然是捕获！想按"变量的值"匹配必须用<b>点号名称</b>（值模式）如 <code>case Cmd.EXIT:</code>，或用字面值，或加守卫 <code>case s if s == EXIT:</code></li>
<li><b>类模式与 __match_args__</b>：自定义类要支持位置参数匹配，需声明 <code>__match_args__ = ("x", "y")</code> 指定位置参数对应的属性名；关键字形式 <code>case Point(x=0, y=y):</code> 总是可用</li>
<li>软关键字提醒：<code>match</code>、<code>case</code>、<code>_</code> 只在 match 语句里是关键字，其它地方仍是普通名字（见 §1.2）</li></ul>`,
      code: String.raw`# match 需要 Python 3.10+
command = "go north"

match command.split():               # 对列表 ["go", "north"] 做匹配
    case ["quit"]:                   # 序列模式：长度 1 且元素是 "quit"
        print("退出")
    case ["go", direction]:          # 长度 2，第二个捕获到 direction
        print(f"向{direction}走")
    case ["drop", *items]:           # * 收集剩余元素
        print(f"丢弃 {len(items)} 件物品")
    case _:                          # 通配符：匹配一切（相当于 default）
        print("听不懂")

value = [3, 4]
match value:
    case 0 | 1 | 2:              # OR 模式：| 连接多个备选
        print("小数字")
    case [x, y] as pair:         # AS 模式：整体起名为 pair
        print(f"坐标 {pair}")
    case [x] if x > 0:           # 守卫：匹配后再加 if 条件
        print(f"正数 {x}")

user = {"type": "user", "name": "Tom", "age": 18}
match user:
    case {"type": "user", "name": name}:   # 映射模式：多出的 age 被忽略 ⭐
        print(f"用户 {name}")
    case {"type": "admin", **rest}:        # **rest 收集剩余键
        print(f"管理员，其余信息 {rest}")

data = "hello"
match data:
    case str() as s:             # 类模式：检查类型并捕获
        print(f"是字符串：{s}")
    case int(x):                 # 是 int 则绑定到 x
        print(f"是整数：{x}")

# ⭐⭐ 最大的坑：裸名字是"捕获"不是"比较"
x = 5
match 5:
    case x:        # ⭐ 这不是"等于变量 x"！而是匹配任何东西并绑定给 x
        print(x)   # 5（而且 x 被重新赋值了）

# 想按"变量的值"匹配，必须用点号名称（值模式）：
class Cmd:
    EXIT = "exit"

match "exit":
    case Cmd.EXIT:   # ✅ 点号名称才是值比较
        print("退出命令")
# 或者加守卫：case s if s == EXIT

# 类模式与 __match_args__：自定义类支持位置参数匹配
class Point:
    __match_args__ = ("x", "y")       # 声明位置参数对应的属性名
    def __init__(self, x, y):
        self.x, self.y = x, y

p = Point(0, 5)
match p:
    case Point(0, y):            # 位置参数按 __match_args__ 顺序对应属性
        print(f"在 y 轴上，y={y}")
    case Point(x=0, y=y):        # 关键字形式总是可用
        print(f"x=0, y={y}")`,
    },
  ],
});
