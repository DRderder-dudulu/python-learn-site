/* ===== 课程内容数据 · 第十一层 =====
 * 内容来源：《Python 3 语法完全指南》（outputs/python-syntax-guide.md）第十一层 · 推导式、迭代器与生成器。
 * 写法规范：section.id 即指南小节号；points 为分条要点（内联 <code>/<b>）；
 * 【对应规范】points 每条要点必须在 code 中有明确对应：可演示的写成可运行代码并配注释；
 * 错误/危险示范以「故意注释掉」的形式呈现（学员可取消注释亲测报错）；
 * code 示例均经本地 Python 实际运行验证（tools/verify_examples.py + verify_expects.py）；expect 为真实输出。
 * 说明：按教学节奏将指南 §11.1 拆为 11.1/11.2 两节、§11.3 拆为 11.4/11.5 两节，全层共 6 节。
 * 适用版本：3.8—3.14 ｜ 最后核对：2026-10
 */
COURSE.push({
  id: 11,
  title: "第十一层 · 推导式、迭代器与生成器",
  minutes: 65,
  goal: "用推导式一行造容器，吃透迭代器协议，会用 yield 写惰性生成器",
  prereq: "第三层（数据结构）与第四层（函数）",
  versions: "3.8—3.14",
  checked: "2026-10",
  sections: [
    {
      id: "11.1", title: "列表、字典与集合推导式",
      what: "推导式是一行造出列表、字典或集合的语法：[expr for x in seq]，读作「对每个 x，算出 expr 装进去」。",
      use: "把「循环加 append」那三四行压成一行的招牌写法。要对一批数据逐个加工、再造个新列表、字典或集合时就用它。",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/datastructures.html#list-comprehensions",
      points: [
        "推导式是「一行造容器」的招牌语法：<code>[expr for x in seq]</code> 列表、<code>{expr for ...}</code> 集合、<code>{k: v for ...}</code> 字典",
        "读法：从 for 开始读——「对每个 x，算出 expr 装进去」",
        "集合推导式自动去重；字典推导式同一个键后写的覆盖先写的",
        "⭐ 圆括号 <code>(expr for ...)</code> 不是「元组推导式」，是生成器表达式（11.5 节细说）",
        "⭐ 推导式有<b>独立作用域</b>：循环变量不会泄漏到外面的同名变量",
      ],
      code: String.raw`squares = [x * x for x in range(5)]   # 列表推导式；读法：从 for 开始读——「对每个 x，算出 expr 装进去」
print(squares)

words = ["hi", "yo", "hello"]
print({w: len(w) for w in words})       # 字典推导式 {k: v for ...}
print(sorted({len(w) for w in words}))  # 集合推导式 {expr for ...}：自动去重（sorted 仅为固定打印顺序）
print({n % 2: n for n in [1, 2, 3]})    # 字典推导式同一个键：后写的覆盖先写的

gen = (x * x for x in range(3))         # ⭐ 圆括号不是「元组推导式」，是生成器表达式（11.5 节细说）
print(type(gen).__name__, list(gen))

x = 100
_ = [x for x in range(3)]               # ⭐ 推导式有独立作用域：循环变量不会泄漏到外面
print(x)                                # 外面的 x 不受影响`,
      expect: "[0, 1, 4, 9, 16]\n{'hi': 2, 'yo': 2, 'hello': 5}\n[2, 5]\n{1: 3, 0: 2}\ngenerator [0, 1, 4]\n100",
      note: "把集合那行的 {} 改成 []，对比「去重」和「不去重」两个结果。",
    },
    {
      id: "11.2", title: "嵌套与条件推导",
      what: "在推导式里叠多个 for、加 if：for 从左到右相当于循环从外到内，if 的位置不同，意思也不同。",
      use: "造容器时顺带挑拣或给元素换模样：if 在末尾是过滤，if-else 在最前是二选一。拍平二维列表一行搞定，条件一复杂就写回 for 循环。",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/datastructures.html#nested-list-comprehensions",
      points: [
        "多个 for 按「从左到右 = 从外到内」套：<code>[(x, y) for x in A for y in B]</code>",
        "⭐ 条件写在哪，意思完全不同：<b>if 在末尾 = 过滤</b>（不满足就丢弃）",
        "<b>if-else 在最前 = 三元表达式</b>（每个元素二选一换个模样），两者别记混",
        "经验法则：一行写不下、条件超过一层，就老老实实写回 for 循环——可读性优先",
      ],
      code: String.raw`pairs = [(x, y) for x in range(2) for y in range(3)]   # 多个 for：从左到右 = 从外到内
print(pairs)

print([a for a in range(6) if a % 2 == 0])              # ⭐ if 在末尾 = 过滤：不满足就丢弃
print(["偶" if a % 2 == 0 else "奇" for a in range(4)])  # if-else 在最前 = 三元表达式：每个元素二选一

matrix = [[1, 2], [3, 4]]
print([n for row in matrix for n in row])   # 拍平二维列表

flat = []                 # 经验法则：一行写不下、条件超过一层，就老老实实写回 for 循环——可读性优先
for row in matrix:        # 上面那行推导式等价于这段普通循环
    for n in row:
        flat.append(n)
print(flat)`,
      expect: "[(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2)]\n[0, 2, 4]\n['偶', '奇', '偶', '奇']\n[1, 2, 3, 4]\n[1, 2, 3, 4]",
      note: "把三元那行的 if-else 挪到 for 后面再运行，看 SyntaxError——位置不是随便写的。",
    },
    {
      id: "11.3", title: "迭代器协议：iter、next 与 StopIteration",
      what: "能被遍历的叫「可迭代」；iter() 从它造出一个一次性的迭代器，next() 取一个值，取完抛 StopIteration。",
      use: "搞懂 for 循环的内部原理：iter 开工、next 取值、StopIteration 收工。碰到迭代器「取一次就空」的怪事，回这节找答案。",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#iterator-types",
      points: [
        "<b>可迭代</b>（有 __iter__）：list、str、dict、range、文件……可以<b>反复</b>遍历",
        "<b>迭代器</b>（有 __iter__ + __next__）：代表一次性的遍历过程，<b>耗尽就没了</b> ⭐⭐",
        "<code>iter(可迭代)</code> 造出一个迭代器；<code>next(it)</code> 取一个值，耗尽时抛 <code>StopIteration</code>",
        "for 循环的内部真相：先 iter() 再不断 next()，接到 StopIteration 就正常收工",
        "实用判断：能被 next() 直接用的是迭代器；列表得先 iter() 包一层才行",
      ],
      code: String.raw`nums = [1, 2, 3]     # 可迭代（有 __iter__）：list/str/dict/range 都是，可反复遍历
print(hasattr(nums, "__iter__"), hasattr(nums, "__next__"))  # 实用判断：光有 __iter__ 只是可迭代
# next(nums)          # ⭐ 错误示范（故意注释掉）：列表不是迭代器，直接 next() 报 TypeError，得先 iter() 包一层

it = iter(nums)       # iter(可迭代) 造出一个迭代器（有 __iter__ + __next__）
print(hasattr(it, "__next__"))
print(next(it))       # next(it) 取一个值
print(next(it), next(it))

try:
    next(it)          # ⭐⭐ 迭代器代表一次性的遍历过程：耗尽就没了
except StopIteration:
    print("StopIteration：到头了")   # 耗尽时抛 StopIteration

print(list(it))           # 耗尽后再要也没东西
print(list(iter(nums)))   # nums 完好，可反复造新迭代器

for ch in "ab":           # for 循环的内部真相：先 iter() 再不断 next()，接到 StopIteration 就正常收工
    print(ch)`,
      expect: "True False\nTrue\n1\n2 3\nStopIteration：到头了\n[]\n[1, 2, 3]\na\nb",
      note: "把第一行换成 nums = \"ab\"，字符串同样是可迭代对象。",
    },
    {
      id: "11.4", title: "生成器函数：yield 暂停术",
      what: "函数里写了 yield 就成了生成器函数：调用它不执行函数体，只返回一个生成器，每次 next 才推进到下一个 yield。",
      use: "想要「要一个、算一个」的序列时用它：逐行读大文件、生成无限数列，内存里一次只留一个值，列表装不下的场合全靠它。",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/classes.html#generators",
      points: [
        "函数里出现 <code>yield</code> 就成了<b>生成器函数</b>：调用它<b>不执行</b>函数体，只返回一个生成器对象 ⭐",
        "每次 next() 从上次「定格」处接着跑到下一个 yield，交出一个值后再定格——局部变量原样保留",
        "函数执行到 return 或末尾，迭代结束（抛 StopIteration）",
        "⭐ 生成器也是迭代器：<b>只能遍历一次</b>，想要第二遍得重新调用函数造个新的",
        "进阶预告：yield 是表达式，能接收 send() 送来的值，还有 throw/close/yield from——本层先用熟 next",
      ],
      code: String.raw`def count_up_to(n):      # 函数里出现 yield 就成了生成器函数
    i = 1
    while i <= n:
        yield i     # 每次 next() 从上次「定格」处接着跑到这里，交出一个值后再定格——局部变量原样保留
        i += 1
    # 函数执行到 return 或末尾，迭代结束（抛 StopIteration）

g = count_up_to(3)     # ⭐ 调用它【不执行】函数体，只返回一个生成器对象
print(next(g))
print(next(g), next(g))

for v in count_up_to(2):    # 生成器可以直接 for
    print("for 拿到", v)

g2 = count_up_to(1)
print(list(g2))
print(list(g2))            # ⭐ 只能遍历一次：已耗尽，想要第二遍得重新调用函数造个新的

# 进阶预告：yield 是表达式，能接收 send() 送来的值，还有 throw/close/yield from——本层先用熟 next`,
      expect: "1\n2 3\nfor 拿到 1\nfor 拿到 2\n[1]\n[]",
      note: "在 yield 前后各加一行 print，观察「调用不执行、next 才推进」的节奏。",
    },
    {
      id: "11.5", title: "生成器表达式与惰性求值",
      what: "把列表推导式的 [] 换成 () 就是生成器表达式：一个值都不先算，要一个才给一个——这叫「惰性求值」。",
      use: "数据量大或干脆算不完（无限序列）时，把 [] 换成 ()：不一次算完，内存只占一个对象。直接喂给 sum、max、join 最顺手。",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/classes.html#generator-expressions",
      points: [
        "把列表推导式的 [] 换成 () 就是<b>生成器表达式</b>：不一次算完，要一个给一个",
        "<b>惰性</b>意味着能表示「无限」：数据像在生产线上随取随造，内存占用 O(1)",
        "对比：列表推导式一口气把结果全装进内存；生成器表达式只占一个对象",
        "常直接喂给 sum/max/any/join：<code>sum(x * x for x in range(100))</code> 连外层括号都能省",
        "⭐ 它也是一次性的：耗尽即空，想重用只能把表达式重新写一遍",
      ],
      code: String.raw`gen = (x * x for x in range(5))   # 把列表推导式的 [] 换成 ()：不一次算完，一个值都还没算
print(next(gen), next(gen))       # 要一个，给一个（算一个）
print(list(gen))                  # 拿走剩下的
print(list(gen))                  # ⭐ 它也是一次性的：耗尽即空，想重用只能把表达式重新写一遍

total = sum(x * x for x in range(100))   # 常直接喂给 sum/max/any，连外层括号都能省
print(total)
print("-".join(str(n) for n in range(3)))   # 喂给 join 也一样

print([x * x for x in range(5)])  # 对比：列表推导式一口气把结果全装进内存
big = (x for x in range(10 ** 9))   # 惰性意味着能表示「无限」：「十亿个数」也只占一个对象，内存 O(1)
print(next(big))                  # 数据像在生产线上随取随造`,
      expect: "0 1\n[4, 9, 16]\n[]\n328350\n0-1-2\n[0, 1, 4, 9, 16]\n0",
      note: "把 big 改成 [x for x in range(10 ** 9)]——别真运行，想想内存会发生什么。",
    },
    {
      id: "11.6", title: "itertools 精选",
      what: "itertools 是自带的迭代器工具箱：count、cycle、islice、chain 这些现成工具，全都返回惰性迭代器。",
      use: "官方现成的迭代器工具箱：串联、惰性切片、累计、无限数列都有。处理流水式数据先翻翻它；无限流记得用 islice 截断，直接 list() 会卡死。",
      doc: "https://docs.python.org/zh-cn/3.14/library/itertools.html",
      points: [
        "<code>itertools</code> 是官方迭代器工具箱：全部返回<b>惰性迭代器</b>，要 list() 或 for 取用",
        "无限流：<code>count(10, 2)</code> 等差数列、<code>cycle(\"AB\")</code> 循环往复——⭐ 直接 list() 会卡死，必须截断",
        "<code>islice(seq, 起, 止)</code> 惰性切片，是驯服无限序列的缰绳；<code>chain(a, b)</code> 把多个可迭代串成一条",
        "有限工具：<code>accumulate</code> 累计、<code>takewhile</code> 满足就取、<code>zip_longest</code> 补齐式 zip",
      ],
      code: String.raw`import itertools as it

# itertools 是官方迭代器工具箱：全部返回惰性迭代器，要 list() 或 for 取用
print(list(it.chain([1, 2], "ab")))          # chain：把多个可迭代串成一条
print(list(it.islice(it.count(10, 2), 4)))   # count(10, 2) 无限等差数列；islice 惰性切片，是驯服无限序列的缰绳
print(list(it.islice(it.cycle("AB"), 6)))    # cycle("AB") 循环往复，同样靠 islice 截断
# list(it.count(10, 2))                      # ⭐ 危险示范（故意注释掉）：无限流直接 list() 会卡死，必须截断
print(list(it.accumulate([1, 2, 3, 4])))     # accumulate 累计
print(list(it.takewhile(lambda x: x < 3, [1, 2, 3, 1])))   # takewhile 满足就取
print(list(it.zip_longest([1, 2], "ab", fillvalue=0)))     # zip_longest 补齐式 zip

def fib():                    # 无限斐波那契
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

print(list(it.islice(fib(), 10)))   # 取前 10 项`,
      expect: "[1, 2, 'a', 'b']\n[10, 12, 14, 16]\n['A', 'B', 'A', 'B', 'A', 'B']\n[1, 3, 6, 10]\n[1, 2]\n[(1, 'a'), (2, 'b')]\n[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]",
      note: "试试 list(it.islice(it.cycle(\"AB\"), 6))——cycle 会让序列无限循环。",
    },
  ],
  quiz: [
    { q: "[a for a in range(6) if a % 2 == 0] 的结果是？",
      options: ["[0, 2, 4]", "[1, 3, 5]", "[0, 1, 2, 3, 4, 5]", "[True, False, True, False, True, False]"], answer: 0,
      explain: "if 写在末尾是过滤：只保留满足条件的元素，其余丢弃。" },
    { q: "it = iter([1, 2])，调两次 next(it) 之后再调一次会怎样？",
      options: ["抛 StopIteration", "返回 None", "从头返回 1", "报 TypeError"], answer: 0,
      explain: "迭代器耗尽后再 next 就抛 StopIteration；for 循环正是靠捕获它正常结束的。" },
    { q: "g = (x for x in range(3))，list(g) 得到 [0, 1, 2] 后，再执行 list(g) 得到？",
      options: ["[]", "[0, 1, 2]", "抛 StopIteration", "None"], answer: 0,
      explain: "生成器表达式是一次性迭代器，耗尽即空；想要第二遍只能重新造一个。" },
  ],
});
