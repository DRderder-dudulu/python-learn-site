/* ===== 课程内容数据 · 第二层 =====
 * 内容来源：《Python 3 语法完全指南》（outputs/python-syntax-guide.md）第二层 · 流程控制。
 * 写法规范：section.id 即指南小节号；points 为分条要点（内联 <code>/<b>）；
 * 【对应规范】points 每条要点必须在 code 中有明确对应：可演示的写成可运行代码并配注释；
 * 错误/危险示范以「故意注释掉」的形式呈现（学员可取消注释亲测报错）；
 * code 示例均经本地 Python 实际运行验证（tools/verify_examples.py + verify_expects.py）；expect 为真实输出。
 * 适用版本：3.8—3.14 ｜ 最后核对：2026-10
 */
COURSE.push({
  id: 2,
  title: "第二层 · 流程控制",
  minutes: 55,
  goal: "会用 if 分支、while/for 循环，理解 else 子句与 match 匹配",
  prereq: "第一层",
  versions: "3.8—3.14（match 需 3.10+）",
  checked: "2026-10",
  sections: [
    {
      id: "2.1", title: "if / elif / else",
      use: "让程序分情况办事：条件成立走这条分支，不成立走那条。凡是「如果…就…否则…」的判断都靠它；>= 60 含不含 60 这种边界最要想清楚。",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/controlflow.html#if-statements",
      points: [
        "冒号 + 缩进；elif 可以有任意多个；else 可省略",
        "条件位置放的是<b>真值测试</b>，不必写 == True",
        "边界值要想清楚：>= 60 含不含 60？这是最常写错的地方",
      ],
      code: String.raw`score = 85
if score >= 90:              # 冒号 + 缩进：宣告一个分支开始
    print("优秀")
elif score >= 60:            # elif 可以有任意多个
    print("及格")
else:                        # else 可省略；写了就是兜底
    print("不及格")

passed = score >= 60
if passed:                   # 条件位置放的是【真值测试】，不必写 == True
    print("passed 为真")

print(60 >= 60, 59 >= 60)    # ⭐ 边界值要想清楚：>= 60 含 60；59 才是 False`,
      expect: "及格\npassed 为真\nTrue False",
      note: "把 score 改成 60 和 59 各运行一次，确认边界。",
    },
    {
      id: "2.2", title: "while 循环与 else 子句",
      use: "不知道要循环几次、只知道什么条件下该停，就用 while。中途收工（break）、跳过某轮（continue）、「找了一圈没找到」（else），这节全包了。",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/controlflow.html",
      points: [
        "while 条件为真就循环——⭐ 别忘了更新条件变量，否则死循环",
        "break 立刻跳出整个循环；continue 跳过本轮进下一轮",
        "else 子句在<b>循环没被 break 打断</b>时执行，天生适合「找了一圈没找到」",
      ],
      code: String.raw`n = 0
while n < 3:                 # 条件为真就循环
    n += 1                   # ⭐ 别忘了更新条件变量，否则死循环
print("n =", n)

for x in range(1, 6):
    if x == 3:
        continue             # continue：跳过本轮进下一轮（3 被跳过）
    if x == 5:
        break                # break：立刻跳出整个循环（5 之后不再执行）
    print(x)

nums = [1, 3, 5]
for x in nums:
    if x % 2 == 0:
        print("找到偶数", x)
        break
else:                        # 循环【没被 break 打断】才执行——天生适合「找了一圈没找到」
    print("没有偶数")`,
      expect: "n = 3\n1\n2\n4\n没有偶数",
      note: "把 5 改成 6，看 else 还执不执行。",
    },
    {
      id: "2.3", title: "for 循环与 range",
      use: "把列表、字符串里的元素一个个取出来处理，就用 for。要数数（range）、想要序号（enumerate）、两列一起走（zip），都是它的日常搭档。",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/controlflow.html#for-statements",
      points: [
        "for 是<b>遍历</b>：把可迭代对象的元素一个个取出",
        "range 惰性生成，且不含右端点：range(1, 101) 产生 1—100",
        "enumerate 拿序号（start 改起始）、zip 并行遍历（3.10+ 可加 strict=True 防长短不一）",
        "⭐ 不要边遍历边修改列表——遍历副本 nums[:] 或改用推导式",
      ],
      code: String.raw`fruits = ["苹果", "香蕉", "橙子"]
for fruit in fruits:         # for 是【遍历】：把可迭代对象的元素一个个取出
    print(fruit)

print(list(range(1, 6)))     # range 惰性生成，list() 才展开；不含右端点
print(sum(range(1, 101)))    # 结果是 5050：证明产生 1—100，右端点不含

for i, name in enumerate(["甲", "乙"], start=1):   # enumerate 拿序号，start 改起始
    print(i, name)

for a, b in zip([1, 2, 3], "abc"):                 # zip 并行遍历
    print(a, b)
# for a, b in zip([1, 2, 3], "ab", strict=True):   # 3.10+ 可加 strict=True，长短不一就报错（故意注释掉，可取消亲测）

nums = [1, 2, 3, 4]
for x in nums[:]:            # ⭐ 不要边遍历边修改列表：遍历副本 nums[:]，改的是原列表
    if x % 2 == 0:
        nums.remove(x)
print(nums)                  # 偶数被删掉，剩 [1, 3]
evens = [x for x in [1, 2, 3, 4] if x % 2 == 0]    # 或改用推导式生成新列表
print(evens)`,
      expect: "苹果\n香蕉\n橙子\n[1, 2, 3, 4, 5]\n5050\n1 甲\n2 乙\n1 a\n2 b\n3 c\n[1, 3]\n[2, 4]",
      note: "把 start=1 删掉再运行，看编号变化。",
    },
    {
      id: "2.4", title: "match 结构化模式匹配",
      use: "按「数据的形状」分情况处理：命令是「go north」还是「quit」，match 匹配结构、顺便拆值，省掉一长串 if/elif。3.10 及以上才能用。",
      ver: "3.10+",
      doc: "https://docs.python.org/zh-cn/3.14/reference/compound_stmts.html#the-match-statement",
      points: [
        "按<b>数据的形状</b>匹配并顺便拆包取值，不只是 switch",
        "case _ 是通配（相当于 default）",
        "⭐⭐ 裸名字是「捕获」不是「比较」：case x 会匹配一切并赋值给 x；按值比较用点号（Color.RED）或字面量",
        "模式后可加 if 守卫进一步过滤",
      ],
      code: String.raw`command = "go north"
match command.split():               # 按【数据的形状】匹配，还能顺便拆包取值，不只是 switch
    case ["quit"]:
        print("退出")
    case ["go", "north"]:            # 按值比较用字面量（类成员用点号，如 Color.RED）
        print("向北走")
    case ["go", direction]:          # ⭐⭐ 裸名字是【捕获】不是比较：direction 会接住任意值
        print(f"向{direction}走")
    case _:                          # case _ 是通配，相当于 default
        print("听不懂")

age = 15
match age:
    case int() if age >= 18:         # 模式后可加 if 守卫进一步过滤
        print("成年人")
    case _:
        print("未成年")`,
      expect: "向北走\n未成年",
      note: "把 command 改成 \"quit\" 再运行。3.8/3.9 没有 match——用 if/elif 替代。",
    },
  ],
  quiz: [
    { q: "for...else 结构中，else 什么时候执行？",
      options: ["循环没被 break 打断时", "循环被 break 打断时", "每次循环后都执行", "循环为空时报错"], answer: 0,
      explain: "else 只在没被 break 打断时执行，常用于「没找到」场景。" },
    { q: "range(2, 10, 3) 依次产生的数字是？",
      options: ["2, 5, 8", "2, 5, 8, 10", "3, 6, 9", "2, 4, 6, 8"], answer: 0,
      explain: "从 2 开始、步长 3、不含 10。" },
    { q: 'if "": 这个条件会怎样？',
      options: ["条件为假，不进入分支", "条件为真，进入分支", "报 SyntaxError", "报 ValueError"], answer: 0,
      explain: "空字符串是假值。" },
  ],
});
