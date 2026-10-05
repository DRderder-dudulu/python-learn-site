/* ===== 课程内容数据 · 第十四层 =====
 * 内容来源：《Python 3 语法完全指南》（outputs/python-syntax-guide.md）第十四层 · 异步编程。
 * 写法规范与 data-course.js 一致：section.id 即指南小节号；points 为分条要点（内联 <code>/<b>）；
 * code 示例均经本地 Python 实际运行验证（tools/verify_examples.py）；expect 为真实输出。
 * 适用版本：3.8—3.14 ｜ 最后核对：2026-09
 */
COURSE.push({
  id: 14,
  title: "第十四层 · 异步编程",
  minutes: 60,
  goal: "建立异步直觉：会写 async def / await，用 asyncio.run 与 gather 跑并发，避开阻塞误区",
  prereq: "第四层（函数）",
  versions: "3.8—3.14",
  checked: "2026-09",
  sections: [
    {
      id: "14.1", title: "同步 vs 异步：先建立正确认知",
      doc: "https://docs.python.org/zh-cn/3.14/library/asyncio.html",
      points: [
        "同步：一件事做完才做下一件——等待（网络、磁盘）时只能干瞪眼",
        "asyncio 是<b>单线程协作式并发</b>：谁在等 I/O，谁就让出控制权给别人跑",
        "⭐⭐ 它<b>不是多核并行</b>：CPU 密集型任务（压缩、计算）用它不会变快，请用 multiprocessing",
        "适合 I/O 密集型：爬虫、API 服务、大量并发连接",
      ],
      code: String.raw`import asyncio

async def worker(name, seconds):
    print(name, "开始")
    await asyncio.sleep(seconds)   # 等待期间让出控制权
    print(name, "结束")

async def main():
    # 串行：一个做完才轮到下一个（同步的感觉）
    await worker("甲", 0.01)
    await worker("乙", 0.01)

asyncio.run(main())`,
      expect: "甲 开始\n甲 结束\n乙 开始\n乙 结束",
      note: "把两个 await 想象成排队：等待时谁也没干别的——这就是同步。下一节看并发。",
    },
    {
      id: "14.2", title: "async def 与 await：协程不是调用就跑",
      doc: "https://docs.python.org/zh-cn/3.14/library/asyncio-task.html#coroutines",
      points: [
        "<code>async def</code> 定义的是<b>协程函数</b>；<code>await</code> 等待它跑完并取回结果",
        "⭐ 直接调用只得到<b>协程对象，函数体一行都没执行</b>——还会收到「was never awaited」警告",
        "<code>await asyncio.sleep(秒)</code> 是异步版 sleep：等待期间让出控制权",
        "⭐ await 只能写在 async def 里面；顶层入口交给 asyncio.run",
      ],
      code: String.raw`import asyncio

async def say():
    return "协程跑完了"

coro = say()            # ⭐ 只创建协程对象，函数体一行没跑
print(type(coro).__name__)
coro.close()            # 手动关掉，避免「从未被 await」警告

async def main():
    r = await say()     # await：真正运行并取回返回值
    print(r)

asyncio.run(main())`,
      expect: "coroutine\n协程跑完了",
      note: "把 coro.close() 删掉再运行，看 stderr 里那条 RuntimeWarning。",
    },
    {
      id: "14.3", title: "asyncio.run 与 gather：一起出发",
      doc: "https://docs.python.org/zh-cn/3.14/library/asyncio-task.html#asyncio.gather",
      points: [
        "<code>asyncio.run(main())</code> 是程序入口：启动事件循环，跑完 main 再收尾",
        "<code>await asyncio.gather(c1, c2)</code>：一起出发，全部完成后<b>按传入顺序</b>收结果",
        "总耗时 ≈ <b>最慢的那个</b>，不是几个相加——这就是并发的意义",
        "⭐ 任务内部 print 的顺序不可控；要确定顺序，就用 gather 的返回值列表统一打印",
        "3.11+ 官方推荐 <code>asyncio.TaskGroup</code>：自动等待、一个失败取消其余（本层先用 gather）",
      ],
      code: String.raw`import asyncio

async def fetch(name, seconds):
    await asyncio.sleep(seconds)
    return name + " 完成"

async def main():
    results = await asyncio.gather(
        fetch("A", 0.02), fetch("B", 0.01)
    )
    print(results)      # 按传入顺序收结果，与完成先后无关

asyncio.run(main())`,
      expect: "['A 完成', 'B 完成']",
      note: "把 A、B 的秒数对调再运行——results 的顺序会变吗？",
    },
    {
      id: "14.4", title: "async with 与 async for：异步世界的配套语法",
      doc: "https://docs.python.org/zh-cn/3.14/reference/compound_stmts.html#the-async-with-statement",
      points: [
        "异步资源（连接、会话）用 <code>async with</code> 管理：进入走 <code>__aenter__</code>，离开走 <code>__aexit__</code>",
        "<code>async for</code> 消费<b>异步迭代器</b>：每取一条数据都可能要等网络",
        "协议对应：<code>__aiter__</code> / <code>__anext__</code>，取完了抛 <code>StopAsyncIteration</code>",
        "写法就是同步 with / for 加 async——语义同理，只是每一步都可能让出控制权",
      ],
      code: String.raw`import asyncio

class AsyncConn:
    async def __aenter__(self):
        print("连接打开")
        return self
    async def __aexit__(self, *exc):
        print("连接关闭")
        return False

class AsyncPages:
    def __init__(self, n):
        self.n = n
    def __aiter__(self):
        self.i = 0
        return self
    async def __anext__(self):
        if self.i >= self.n:
            raise StopAsyncIteration
        self.i += 1
        await asyncio.sleep(0.01)   # 模拟等网络
        return "第" + str(self.i) + "页"

async def main():
    async with AsyncConn():
        async for page in AsyncPages(2):
            print(page)

asyncio.run(main())`,
      expect: "连接打开\n第1页\n第2页\n连接关闭",
      note: "把 AsyncPages(2) 改成 AsyncPages(5)，感受 async for 一页页地翻。",
    },
    {
      id: "14.5", title: "常见误区：忘记 await 与阻塞调用",
      doc: "https://docs.python.org/zh-cn/3.14/library/asyncio-dev.html",
      points: [
        "⭐ 忘了 await：拿到的是<b>协程对象</b>而不是结果——结果对不上先查这个",
        "⭐⭐ <code>time.sleep</code>、requests、普通文件读写是<b>阻塞调用</b>，会卡死整个事件循环",
        "替代方案：<code>await asyncio.sleep()</code>；网络用 httpx / aiohttp；文件用 aiofiles",
        "必须用阻塞库时：<code>await asyncio.to_thread(函数, 参数)</code>（3.9+）把它丢到线程池",
      ],
      code: String.raw`import asyncio

async def fetch():
    await asyncio.sleep(0.01)   # ✅ 正确：异步等待，让出控制权
    return "结果"

async def main():
    r = await fetch()
    print(r)
    forgot = fetch()            # ⭐ 忘写 await 的典型现场
    print(type(forgot).__name__)
    forgot.close()

asyncio.run(main())`,
      expect: "结果\ncoroutine",
      note: "把 forgot.close() 换成 print(await forgot)——这才算真正调用了它。",
    },
  ],
  quiz: [
    { q: "调用 async def 定义的函数，函数体会立即执行吗？",
      options: ["会，和普通函数一样", "不会，只得到协程对象，需 await 或交给事件循环", "会，但在新线程里跑", "会，但返回值是 None"], answer: 1,
      explain: "async def 调用只创建协程对象，必须 await 或被事件循环调度才真正执行。" },
    { q: "asyncio.gather 并发跑 0.2 秒和 0.1 秒两个任务，总耗时约为？",
      options: ["0.3 秒（两者相加）", "0.1 秒（最快的那个）", "0.2 秒（最慢的那个）", "完全不确定"], answer: 2,
      explain: "并发是一起出发：总耗时 ≈ 最慢的任务，而不是串行的相加。" },
    { q: "在协程里调用 time.sleep(1) 会怎样？",
      options: ["自动变成异步等待", "卡死整个事件循环 1 秒", "抛出 TypeError", "被事件循环自动忽略"], answer: 1,
      explain: "time.sleep 是阻塞调用，不会让出控制权——所有协程都被迫陪等。要用 await asyncio.sleep(1)。" },
  ],
});
