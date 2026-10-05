/* ===== 速查·第三层 · 数据结构（§3.1—§3.8） =====
 * 内容来源：《Python 3 语法完全指南》第三层（outputs/python-syntax-guide-v1.md 第 764—1084 行），1:1 对齐小节；
 * 示例与课程 §3.x 一致或取自指南，均可运行（tools/verify_examples.py 实跑验证）。
 * 适用版本：3.8—3.14 ｜ 语言规则以 Python 官方文档为准。
 */
CHEATSHEET_ADV.push({
  layerId: 3,
  layer: "第三层 · 数据结构",
  stage: "一",
  topics: [
    {
      id: "3_1", title: "§3.1 列表完全手册", desc: "增删改查全表、append vs extend、sort 返回 None、⭐⭐拷贝三层辨析、⭐列表乘法陷阱",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#lists",
      html: `<p><b>创建</b>：<code>nums = [1, 2, 3]</code>｜<code>empty = []</code>｜<code>chars = list("abc")</code></p>
<ul>
<li><b>增</b>：<code>append(4)</code> 尾部加一个｜<code>extend([5, 6])</code> 尾部接一串｜<code>insert(0, 0)</code> 在索引 0 处插入｜<code>nums += [7]</code> 等价于 extend｜<code>new = nums + [8]</code> + 造出新列表，原列表不变</li>
<li>⭐ <b>append vs extend</b>：<code>a.append([3, 4])</code> → [1, 2, [3, 4]] 整个列表当一个元素塞进去；<code>b.extend([3, 4])</code> → [1, 2, 3, 4] 元素逐个接上去</li>
<li><b>删</b>：<code>remove(2)</code> 删第一个"值等于 2"的元素（没有则 ValueError）｜<code>pop()</code> 弹出尾部并返回｜<code>pop(0)</code> 弹出索引 0｜<code>del nums[0]</code> 删除索引（见 §3.8）｜<code>del nums[0:2]</code> 删除切片（⭐ 切片越界不报错：<code>del nums[10:99]</code> 安然无事）｜<code>clear()</code> 清空</li>
<li><b>改</b>：<code>nums[0] = 99</code> 按索引改｜<code>nums[1:3] = [7, 8, 9]</code> 切片赋值可改变长度｜<code>reverse()</code> 原地反转</li>
<li><b>查</b>：<code>1 in nums</code> 成员判断｜<code>index(1)</code> 第一次出现的位置（没有则 ValueError）｜<code>count(1)</code> 出现次数｜<code>len(nums)</code> 长度</li>
<li><b>排序</b>：<code>nums.sort()</code> 原地排序，<b>返回 None</b> ⭐｜<code>sort(reverse=True)</code> 降序｜<code>sorted(words)</code> 返回新列表，原列表不变｜<code>sorted(words, key=len)</code> 按长度排｜<code>students.sort(key=lambda s: s[1])</code> 按分数排。⭐ 经典错误：<code>nums = nums.sort()</code>——sort() 返回 None，这一写 nums 就变成 None 了</li>
<li>⭐⭐ <b>拷贝三层辨析</b>：① <code>b = a</code> 赋值只是多贴一个标签，b 和 a 是<b>同一个列表</b>；② <code>c = a[:]</code> / <code>a.copy()</code> / <code>list(a)</code> 浅拷贝——新列表，但里面的子列表还是同一个（外层独立了，内层子列表仍共享 ⭐）；③ <code>copy.deepcopy(a)</code> 深拷贝——层层复制，彻底独立</li>
<li>⭐ <b>列表乘法陷阱</b>：<code>grid = [[0] * 3] * 3</code> 看起来是 3x3 表格，但三行是<b>同一个列表</b>——改 <code>grid[0][0] = 1</code> 后三行全变 [[1, 0, 0], [1, 0, 0], [1, 0, 0]]；正确写法：<code>grid = [[0] * 3 for _ in range(3)]</code> 每行都是新列表</li></ul>`,
      code: String.raw`import copy

nums = [1, 2, 3]
nums.append(4)         # 尾部加一个：[1, 2, 3, 4]
nums.extend([5, 6])    # 尾部接一串
nums.insert(0, 0)      # 在索引 0 处插入
nums += [7]            # 等价于 extend
print(nums)

# ⭐ append vs extend
a = [1, 2]
a.append([3, 4])       # [1, 2, [3, 4]]：整个列表当一个元素塞进去
b = [1, 2]
b.extend([3, 4])       # [1, 2, 3, 4]：元素逐个接上去
print(a, b)

# 删
nums = [1, 2, 3, 2, 4]
nums.remove(2)         # 删第一个值等于 2 的（没有则 ValueError）
x = nums.pop()         # 弹出尾部并返回
y = nums.pop(0)        # 弹出索引 0
print(nums, x, y)

# 改 / 查
nums = [3, 1, 2, 1]
nums[0] = 99
nums[1:3] = [7, 8, 9]  # 切片赋值可改变长度
print(nums)
print(1 in nums, nums.index(1), nums.count(1), len(nums))

# 排序
nums = [3, 1, 2]
nums.sort()            # 原地排序，返回 None ⭐（别写 nums = nums.sort()）
print(nums)
nums.sort(reverse=True)
print(nums)
words = ["bb", "ccc", "a"]
print(sorted(words))                # sorted 返回新列表，原列表不变
print(sorted(words, key=len))       # key=len 按长度排
students = [("Tom", 80), ("Amy", 95)]
students.sort(key=lambda s: s[1])   # 按分数排
print(students)

# ⭐⭐ 拷贝三层辨析
a = [1, [2, 3]]
b2 = a                 # ① 赋值：只是多贴一个标签，同一个列表
c = a[:]               # ② 浅拷贝：新列表，但里面的子列表还是同一个
e = copy.deepcopy(a)   # ③ 深拷贝：层层复制，彻底独立
a[0] = 99
a[1].append(4)
print(b2)   # [99, [2, 3, 4]]：跟着 a 变
print(c)    # [1, [2, 3, 4]]：外层独立了，内层子列表仍共享 ⭐
print(e)    # [1, [2, 3]]：完全不受影响

# ⭐ 列表乘法陷阱
grid = [[0] * 3] * 3        # 看起来是 3x3 表格……
grid[0][0] = 1
print(grid)                 # 三行全变了：三行是同一个列表！
grid = [[0] * 3 for _ in range(3)]   # ✅ 正确写法：每行都是新列表
grid[0][0] = 9
print(grid)`,
    },
    {
      id: "3_2", title: "§3.2 元组", desc: "不可变序列、⭐单元素必须带逗号、打包解包、可变元素内部可改、当字典键",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#tuples",
      html: `<ul>
<li>创建：<code>t = (1, 2, 3)</code>｜⭐ <b>单元素元组必须带逗号</b>：<code>single = (5,)</code>——<code>(5)</code> 只是数字 5｜<code>empty = ()</code></li>
<li><code>pair = 1, 2</code> 括号可省略（打包）；<code>x, y = pair</code> 解包</li>
<li><b>不可变</b>：<code>t[0] = 9</code> ❌ TypeError</li>
<li>⭐ 但元组里的<b>可变元素</b>内部可以改：<code>t = (1, [2, 3])</code> 后 <code>t[1].append(4)</code> 合法，t 变成 (1, [2, 3, 4])</li>
<li>用途：函数多返回值、字典的键（可哈希）、保证数据不被改</li></ul>`,
      code: String.raw`t = (1, 2, 3)
single = (5,)        # ⭐ 单元素元组必须带逗号！(5) 只是数字 5
empty = ()
pair = 1, 2          # 括号可省略：打包
x, y = pair          # 解包
print(t, single, empty, x, y)
print(type((5)).__name__, type((5,)).__name__)   # int tuple

# t[0] = 9           # ❌ TypeError：元组不可变
t2 = (1, [2, 3])
t2[1].append(4)      # ✅ 合法！可变元素内部可以改 ⭐
print(t2)            # (1, [2, 3, 4])

point = {(0, 0): "原点"}   # 元组可哈希，能当字典键
print(point[(0, 0)])`,
    },
    {
      id: "3_3", title: "§3.3 字典", desc: "⭐键必须可哈希、{} 是空字典、get/setdefault/pop、保序与动态视图、3.9+ 合并 |",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#mapping-types-dict",
      html: `<ul>
<li>创建：<code>user = {"name": "Tom", "age": 18}</code>｜⭐ <code>empty = {}</code> 是空<b>字典</b>，不是空集合！空集合是 <code>set()</code>｜<code>cfg = dict(host="localhost", port=8080)</code></li>
<li>⭐ <b>键必须可哈希</b>（hashable）：数字、字符串、元组（元素也可哈希时）、<code>frozenset</code> 可以当键；<code>list</code>、<code>dict</code>、<code>set</code> <b>不行</b>（可变对象不可哈希）。值没有限制</li>
<li><b>增/改</b>：<code>user["age"] = 18</code> 键不存在就新增，存在就覆盖｜<code>user.update({"city": "北京", "age": 20})</code> 批量更新</li>
<li><b>查</b>：<code>user["name"]</code> 直接取，键不存在会 KeyError ⭐｜<code>user.get("email")</code> 不报错，返回 None｜<code>user.get("email", "无")</code> 可给默认值｜<code>user.setdefault("tags", [])</code> 键不存在才设置并返回，存在则直接返回原值</li>
<li><b>删</b>：<code>del user["age"]</code> 删除键（不存在则 KeyError）｜<code>user.pop("email", None)</code> 删除并返回值，可给默认值防报错｜<code>user.popitem()</code> 弹出最后插入的键值对（3.7+ 有序保证）</li>
<li><b>三个视图</b>：<code>keys()</code> / <code>values()</code> / <code>items()</code></li>
<li>⭐ <b>保序与视图</b>：3.7+ 起字典<b>保持插入顺序</b>；三个视图是<b>动态</b>的——字典变了视图跟着变；<b>遍历时不能增删键</b>（RuntimeError），要边遍历边删先 <code>list(d)</code> 固化一份</li>
<li><b>合并（3.9+）</b>：<code>c = a | b</code> 后者覆盖前者，产生新字典；<code>a |= b</code> 原地合并</li></ul>`,
      code: String.raw`user = {"name": "Tom"}
user["age"] = 18                     # 增/改：键不存在就新增，存在就覆盖
print(user["name"])                  # 查：直接取，键不存在会 KeyError ⭐
print(user.get("email"))             # None：get 不报错
print(user.get("email", "无"))       # 无：可给默认值

user.setdefault("tags", [])          # 键不存在才设置并返回，存在则直接返回原值
user["tags"].append("vip")
user.update({"city": "北京", "age": 20})   # 批量更新
print(user.keys(), user.values(), user.items())  # 三个视图

email = user.pop("email", None)      # 删除并返回值，可给默认值防报错
last = user.popitem()                # 弹出最后插入的键值对（3.7+ 有序保证）
print(email, last)

d = {"a": 1, "b": 2}
for k, v in d.items():        # 遍历键值对
    print(k, v)
for k in list(d):             # ⭐ 要边遍历边删，先 list() 固化一份
    if d[k] == 1:
        del d[k]
print(d)

# 合并（3.9+）：后者覆盖前者
a = {"x": 1}
b = {"x": 2, "y": 3}
c = a | b        # 产生新字典
print(c)
a |= b           # 原地合并
print(a)`,
    },
    {
      id: "3_4", title: "§3.4 集合", desc: "自动去重、空集合只能 set()、add/discard/remove/pop、并交差对称差、⭐in 是 O(1)、frozenset",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#set-types-set-frozenset",
      html: `<ul>
<li>创建：<code>s = {1, 2, 3}</code>｜⭐ 空集合只能写 <code>set()</code>（<code>{}</code> 是空字典）｜<code>uniq = set([1, 2, 2, 3])</code> → {1, 2, 3} 自动去重——⭐ 列表去重常用</li>
<li><b>增删</b>：<code>s.add(3)</code> 添加｜<code>s.discard(9)</code> 删除，不存在也不报错｜<code>s.remove(9)</code> 删除，不存在则 KeyError｜⭐ <code>s.pop()</code> 移除并返回<b>任意一个</b>元素（不是随机、也不是最后），空集合 KeyError｜<code>s.clear()</code> 清空</li>
<li><b>集合运算</b>：<code>a | b</code> 并集（a.union(b)）｜<code>a & b</code> 交集（a.intersection(b)）｜<code>a - b</code> 差集（a.difference(b)）｜<code>a ^ b</code> 对称差集（a.symmetric_difference(b)）｜<code>{1, 2} <= a</code> 子集判断（issubset）</li>
<li>⭐ 成员判断 <code>x in s</code> 是 <b>O(1)</b>：要反复判断"在不在一批值里"，先转成 set——<code>set(range(10**6))</code> 里查成员瞬间完成（对比列表 in 是 O(n) 逐个比对）</li>
<li><b>frozenset</b>：不可变集合，可当字典键、可放进别的 set</li></ul>`,
      code: String.raw`s = {1, 2, 3}
empty = set()               # ⭐ 空集合只能这么写（{} 是空字典）
uniq = set([1, 2, 2, 3])    # {1, 2, 3}：自动去重 ⭐ 列表去重常用
print(s, empty, uniq)

s.add(4)            # 添加
s.discard(9)        # 删除，不存在也不报错
# s.remove(9)       # ❌ KeyError：不存在则报错
x = s.pop()         # ⭐ 移除并返回任意一个元素（不是随机、也不是最后）
print(len(s))       # 3

a = {1, 2, 3}
b = {2, 3, 4}
print(a | b)   # {1, 2, 3, 4} 并集（a.union(b)）
print(a & b)   # {2, 3} 交集（a.intersection(b)）
print(a - b)   # {1} 差集（a.difference(b)）
print(a ^ b)   # {1, 4} 对称差集（a.symmetric_difference(b)）
print({1, 2} <= a)   # True：子集判断（issubset）

# ⭐ 成员判断 O(1)：要反复判断"在不在"，先转成 set
valid_ids = set(range(10 ** 6))
print(123456 in valid_ids)   # 瞬间完成

fs = frozenset([1, 2, 3])   # 不可变集合：可当字典键、可放进别的 set
d = {fs: "冻结集合"}
print(d[fs])`,
    },
    {
      id: "3_5", title: "§3.5 字符串方法分组速查", desc: "按返回类型分组：新串/列表元组/int布尔、⭐strip 参数是字符集合、find -1 vs index 报错",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#string-methods",
      html: `<p>字符串不可变，以下方法<b>全部返回新对象</b>，原串不变。按返回类型分组记忆：</p>
<ul>
<li><b>返回新字符串</b>：<code>lower()</code> 全小写｜<code>upper()</code> 全大写｜<code>title()</code> 首字母大写｜<code>strip()</code> 去掉两端所有空白字符（空格、\\t、\\n 都去掉）｜<code>lstrip()</code> / <code>rstrip()</code> 只去左 / 只去右｜<code>replace("World", "Python")</code> 替换｜⭐ <code>"-".join(["a", "b", "c"])</code> → "a-b-c"——join 是"<b>分隔符</b>"的方法｜<code>"abc".zfill(6)</code> → "000abc" 左侧补零到宽度 6｜<code>"hi".center(6, "*")</code> → "**hi**" 居中填充</li>
<li>⭐ <code>strip("abc")</code> 的参数是<b>字符集合</b>不是前后缀：<code>"aabbcc".strip("ab")</code> 会从两端不停去掉 a 和 b，结果是 "cc"；想精确去掉前后缀用 <code>removeprefix</code> / <code>removesuffix</code>（3.9+）</li>
<li><b>返回列表 / 元组</b>：<code>"a,b,,c".split(",")</code> → ['a', 'b', '', 'c'] 按分隔符切（保留空段）｜⭐ <code>"a b  c".split()</code> 无参时按任意空白切并丢弃空段｜<code>"a,b,c".split(",", 1)</code> → ['a', 'b,c'] 最多切 1 刀｜<code>"1=2".partition("=")</code> → ('1', '=', '2') 返回三元组，切一次｜<code>splitlines()</code> 按各种换行符切</li>
<li><b>返回 int / bool（查询类）</b>：<code>find("ll")</code> 找到返回索引、⭐ 找不到返回 <b>-1</b>；<code>index("zz")</code> 找不到抛 <b>ValueError</b>（与 find 的区别）；<code>count("l")</code> 出现次数；<code>startswith("he")</code> / <code>endswith("lo")</code>；<code>isalpha()</code> / <code>isdigit()</code> / <code>isalnum()</code>；<code>isspace()</code> / <code>istitle()</code></li></ul>`,
      code: String.raw`s = "  Hello World  "
print(s.lower(), s.upper(), s.title())     # 全小写 / 全大写 / 首字母大写
print(s.strip())                           # 去掉两端所有空白字符
print(s.lstrip(), s.rstrip())              # 只去左 / 只去右
print(s.replace("World", "Python"))        # 替换
print("-".join(["a", "b", "c"]))           # a-b-c ⭐ join 是"分隔符"的方法
print("abc".zfill(6))                      # 000abc（左侧补零到宽度 6）
print("hi".center(6, "*"))                 # **hi**（居中填充）

# ⭐ strip 的参数是"字符集合"不是前后缀
print("aabbcc".strip("ab"))                # cc：从两端不停去掉 a 和 b
print("report.csv".removesuffix(".csv"))       # report（3.9+）
print("www.example.com".removeprefix("www."))  # example.com（3.9+）

print("a,b,,c".split(","))       # ['a', 'b', '', 'c']：按分隔符切，保留空段
print("a b  c".split())          # ['a', 'b', 'c'] ⭐ 无参：按任意空白切并丢弃空段
print("a,b,c".split(",", 1))     # ['a', 'b,c']：最多切 1 刀
print("1=2".partition("="))      # ('1', '=', '2')：返回三元组，切一次
print("a\nb\r\nc".splitlines())  # ['a', 'b', 'c']：按各种换行符切

s = "hello"
print(s.find("ll"))       # 2：找到返回索引
print(s.find("zz"))       # -1 ⭐ 找不到返回 -1
# s.index("zz")           # ❌ ValueError：找不到抛异常（与 find 的区别）
print(s.count("l"))       # 2
print(s.startswith("he"), s.endswith("lo"))          # True True
print("abc".isalpha(), "123".isdigit(), "a1".isalnum())  # True True True
print("  ".isspace(), "Abc".istitle())                   # True True`,
    },
    {
      id: "3_6", title: "§3.6 切片", desc: "seq[start:stop:step] 含头不含尾、负索引、[::-1] 反转、⭐切片越界不报错、[:] 浅拷贝",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#common-sequence-operations",
      html: `<ul>
<li><code>seq[start:stop:step]</code>：从 start（<b>含</b>）到 stop（<b>不含</b>），步长 step；<b>序列通用</b>：list / tuple / str / bytes / range</li>
<li><code>s[1:4]</code> → "bcd"｜<code>s[:3]</code> start 省略 = 从头｜<code>s[3:]</code> stop 省略 = 到尾｜<code>s[::2]</code> 隔一个取｜⭐ <code>s[::-1]</code> 反转经典写法｜<code>s[-2:]</code> 负索引从尾数</li>
<li>⭐ <b>切片越界不报错</b>，给空结果：<code>s[10:20]</code> → ''（对比：单个索引 <code>s[10]</code> 会 IndexError）</li>
<li><code>copy1 = nums[:]</code> 是浅拷贝惯用法（外层独立、内层共享，见 §3.1 拷贝三层辨析）</li></ul>`,
      code: String.raw`s = "abcdef"
print(s[1:4])     # bcd
print(s[:3])      # abc（start 省略=从头）
print(s[3:])      # def（stop 省略=到尾）
print(s[::2])     # ace（隔一个取）
print(s[::-1])    # fedcba ⭐ 反转经典写法
print(s[-2:])     # ef（负索引从尾数）
print(s[10:20])   # '' ⭐ 切片越界不报错，给空结果（对比：s[10] 会 IndexError）

nums = [1, 2, 3]
copy1 = nums[:]   # 浅拷贝惯用法
copy1[0] = 99
print(copy1, nums)   # 外层独立：改副本不影响原列表`,
    },
    {
      id: "3_7", title: "§3.7 序列解包", desc: "基本解包、⭐* 收集剩余（首/尾/中间）、嵌套解包、循环里解包、数量不对报 ValueError",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/datastructures.html#tuples-and-sequences",
      html: `<ul>
<li>基本解包：<code>x, y = (1, 2)</code>；字符串也能解：<code>a, b, c = "abc"</code></li>
<li>⭐ <code>*</code> 收集剩余成列表：<code>first, *rest = [1, 2, 3, 4]</code> → first=1, rest=[2, 3, 4]；<code>*head, last = [1, 2, 3, 4]</code> → head=[1, 2, 3], last=4；<code>a, *mid, b = [1, 2, 3, 4]</code> → a=1, mid=[2, 3], b=4</li>
<li>嵌套解包：<code>(x, (y, z)) = (1, (2, 3))</code></li>
<li>循环里解包是常态：<code>for k, v in {"a": 1}.items():</code></li>
<li>⭐ 左右<b>数量必须对上</b>：<code>a, b = [1, 2, 3]</code> ❌ ValueError（除非用 *）</li></ul>`,
      code: String.raw`x, y = (1, 2)              # 基本解包
a, b, c = "abc"            # 字符串也能解
first, *rest = [1, 2, 3, 4]    # first=1, rest=[2, 3, 4] ⭐ * 收集剩余
*head, last = [1, 2, 3, 4]     # head=[1, 2, 3], last=4
p, *mid, q = [1, 2, 3, 4]      # p=1, mid=[2, 3], q=4
(m, (n, o)) = (1, (2, 3))      # 嵌套解包
print(x, y, a, b, c)
print(first, rest)
print(head, last)
print(p, mid, q)
print(m, n, o)

for k, v in {"a": 1}.items():  # 循环里解包是常态
    print(k, v)

# a, b = [1, 2, 3]   # ❌ ValueError：数量对不上（除非用 *）`,
    },
    {
      id: "3_8", title: "§3.8 del 语句专题", desc: "del 四种形态：删名字/删元素切片/删字典键/删属性、⭐切片越界静默、del 只是去掉引用",
      doc: "https://docs.python.org/zh-cn/3.14/reference/simple_stmts.html#the-del-statement",
      html: `<ul>
<li><code>del</code> 是<b>语句</b>（不是函数），作用是"解除绑定/删除引用"，有四种形态</li>
<li>① <b>删除名字</b>：<code>del x</code>——之后再用 x 会 NameError</li>
<li>② <b>删除元素/切片</b>：<code>del nums[0]</code>｜<code>del nums[1:3]</code>；⭐ 切片越界不报错，静默无事；但 <code>del nums[99]</code> 单个索引越界会 IndexError</li>
<li>③ <b>删除字典键</b>：<code>del d["a"]</code>（不存在则 KeyError）</li>
<li>④ <b>删除对象属性</b>：<code>del o.attr</code></li>
<li>⭐ <b>del 与内存回收的关系</b>：del 只是<b>去掉一个引用</b>（引用计数减 1），对象要等没有任何名字/容器引用它时才真正销毁（CPython 引用计数归零通常立即回收；循环引用交给 gc，见 §19.7）——所以 <code>del big_list</code> 之后内存不一定立刻释放：如果还有别的名字指着它</li></ul>`,
      code: String.raw`x = 5
del x              # ① 删除名字：之后再用 x 会 NameError

nums = [1, 2, 3, 4]
del nums[0]        # ② 删除元素：[2, 3, 4]
del nums[1:3]      #    删除切片：[2]
print(nums)
del nums[10:99]    # ⭐ 切片越界不报错，静默无事
# del nums[99]     # ❌ 但单个索引越界会 IndexError

d = {"a": 1, "b": 2}
del d["a"]         # ③ 删除字典键（不存在则 KeyError）
print(d)

class Obj: pass
o = Obj()
o.attr = 1
del o.attr         # ④ 删除对象属性
print(hasattr(o, "attr"))   # False`,
    },
  ],
});
