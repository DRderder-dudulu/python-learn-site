/* ===== 速查·第十四层 · 异步编程（§14.1—§14.4） =====
 * 内容来源：《Python 3 语法完全指南》第十四层（outputs/python-syntax-guide-v1.md），1:1 对齐小节；
 * 示例与课程 §14.x 一致或取自指南，asyncio.run(...) 跑出入口（3.11+ 的 TaskGroup/timeout 仅注释展示）。
 * 适用版本：3.8—3.14 ｜ 语言规则以 Python 官方文档为准。
 */
CHEATSHEET_ADV.push({
  layerId: 14,
  layer: "第十四层 · 异步编程",
  stage: "三",
  topics: [
    {
      id: "14_1", title: "§14.1 先建立正确认知", desc: "单线程协作式并发、适合 I/O 密集不是多核并行、协程对象调用不执行、asyncio.run 启动",
      doc: "https://docs.python.org/zh-cn/3.14/library/asyncio.html",
      html: `<ul>
<li>⭐⭐ <code>asyncio</code> 是<b>单线程协作式并发</b>：一个线程里多个协程轮流执行，谁在等 I/O（网络、磁盘）谁就让出控制权。<b>适合 I/O 密集型</b>（爬虫、API 服务）</li>
<li>它<b>不是多核并行</b>：CPU 密集型任务（压缩、计算）用 asyncio 不会变快，请用 <code>multiprocessing</code></li>
<li>⭐ <code>async def</code> 定义的是<b>协程函数</b>；调用它<b>只得到协程对象，函数体一行都没执行</b>——必须被 <code>await</code> 或交给事件循环调度才真正运行</li>
<li>只调用不 await 会收到 <code>was never awaited</code> 警告 ⭐；<code>asyncio.run(say())</code> 用 asyncio.run() 启动事件循环跑完它 ✅</li></ul>
<pre>import asyncio

async def say():
    print("hello")

say()                    # 只创建协程对象，不打印，还会收到 "was never awaited" 警告 ⭐
asyncio.run(say())       # ✅ 用 asyncio.run() 启动事件循环跑完它</pre>`,
      code: String.raw`import asyncio

async def say():
    print("hello")

coro = say()                  # ⭐ 只创建协程对象，函数体一行都没执行
print(type(coro).__name__)    # coroutine
coro.close()                  # 手动关掉，避免 "was never awaited" 警告

asyncio.run(say())            # ✅ 启动事件循环，真正执行：打印 hello`,
    },
    {
      id: "14_2", title: "§14.2 基本语法", desc: "await 让出控制权、asyncio.sleep、asyncio.run 入口、async with 与 async for 配套",
      doc: "https://docs.python.org/zh-cn/3.14/library/asyncio-task.html#coroutines",
      html: `<ul>
<li>⭐ <code>await</code>：在此处<b>让出控制权</b>（<code>asyncio.sleep</code> 是异步版 sleep）；<code>await</code> 只能写在 <code>async def</code> 里面</li>
<li><code>asyncio.run(main())</code> 是程序入口：启动事件循环并运行 main()</li>
<li><code>async with</code>（异步上下文管理器，进入走 <code>__aenter__</code>、离开走 <code>__aexit__</code>）、<code>async for</code>（异步迭代，协议 <code>__aiter__</code>/<code>__anext__</code>，取完抛 <code>StopAsyncIteration</code>）配套出现，常见于网络库/数据库驱动</li></ul>
<pre>import asyncio

async def fetch(name, seconds):
    await asyncio.sleep(seconds)   # ⭐ await：在此处让出控制权（异步版 sleep）
    return f"{name} 完成"

async def main():
    r = await fetch("任务A", 1)    # 等待一个协程
    print(r)

asyncio.run(main())    # 程序入口：启动事件循环并运行 main()</pre>`,
      code: String.raw`import asyncio

async def fetch(name, seconds):
    await asyncio.sleep(seconds)   # ⭐ await：在此处让出控制权（异步版 sleep）
    return f"{name} 完成"

class AsyncConn:                   # 异步上下文管理器：__aenter__ / __aexit__
    async def __aenter__(self):
        print("连接打开")
        return self
    async def __aexit__(self, *exc):
        print("连接关闭")
        return False

class AsyncPages:                  # 异步迭代器：__aiter__ / __anext__
    def __init__(self, n):
        self.n = n
    def __aiter__(self):
        self.i = 0
        return self
    async def __anext__(self):
        if self.i >= self.n:
            raise StopAsyncIteration
        self.i += 1
        await asyncio.sleep(0.01)  # 模拟等网络
        return "第" + str(self.i) + "页"

async def main():
    r = await fetch("任务A", 0.01)  # 等待一个协程
    print(r)
    async with AsyncConn():              # async with：常见于网络库/数据库驱动
        async for page in AsyncPages(2): # async for：异步迭代
            print(page)

asyncio.run(main())    # 程序入口：启动事件循环并运行 main()`,
    },
    {
      id: "14_3", title: "§14.3 并发执行多个任务", desc: "gather 一起出发按序收结果、create_task 保存引用、TaskGroup（3.11+）、超时与 CancelledError",
      doc: "https://docs.python.org/zh-cn/3.14/library/asyncio-task.html#asyncio.gather",
      html: `<ul>
<li><b>方式1：gather</b>——一起出发，全部完成后<b>按传入顺序</b>收结果；总耗时 ≈ 最慢那个（约 2s 并行，不是 3s 串行）</li>
<li><b>方式2：create_task</b>——把协程包装成任务，事件循环尽快调度它，<code>await task</code> 处收结果。⭐ 两个细节：① 任务创建后<b>即使不 await 也会被调度执行</b>；但如果主协程先结束，任务可能没跑完就被取消。② <b>要保存任务引用</b>（官方明确提醒）：只写 <code>asyncio.create_task(...)</code> 不存变量，任务可能被垃圾回收提前终结</li></ul>
<pre>async def main():
    # 方式1：gather——一起出发，全部完成后按顺序收结果
    results = await asyncio.gather(
        fetch("A", 2), fetch("B", 1)
    )                      # 总耗时约 2s（并行），不是 3s（串行）

    # 方式2：create_task——把协程包装成任务，事件循环尽快调度它
    task = asyncio.create_task(fetch("C", 1))
    # ……做别的事……
    result = await task    # 在这里收结果</pre>
<ul>
<li>⭐ <b>方式3：TaskGroup（3.11+，官方推荐的结构化并发）</b>：离开 with 时自动等待全部完成；任一失败会取消其余并以 <code>ExceptionGroup</code> 抛出</li></ul>
<pre># 方式3：TaskGroup（3.11+，官方推荐的结构化并发）⭐
async def main():
    async with asyncio.TaskGroup() as tg:
        t1 = tg.create_task(fetch("A", 2))
        t2 = tg.create_task(fetch("B", 1))
    # 离开 with 时自动等待全部完成；任一失败会取消其余并以 ExceptionGroup 抛出
    print(t1.result(), t2.result())</pre>
<p><b>超时与取消</b>：</p>
<pre>async def main():
    try:
        async with asyncio.timeout(1.5):      # 3.11+：超时上下文
            await fetch("慢任务", 5)
    except TimeoutError:
        print("超时了")

# 老式写法：await asyncio.wait_for(coro, timeout=1.5)</pre>
<ul>
<li>协程被取消时收到 <code>CancelledError</code>（3.8+ 起继承 <code>BaseException</code>，不会被 <code>except Exception</code> 误吞）</li></ul>`,
      code: String.raw`import asyncio, time

async def fetch(name, seconds):
    await asyncio.sleep(seconds)
    return f"{name} 完成"

async def main():
    # 方式1：gather——一起出发，全部完成后按顺序收结果
    start = time.perf_counter()
    results = await asyncio.gather(fetch("A", 0.02), fetch("B", 0.01))
    print(results)  # 总耗时约 0.02s（并行），不是 0.03s（串行）
    print(f"总耗时 {time.perf_counter() - start:.2f}s")

    # 方式2：create_task——创建即被调度；⭐ 要保存任务引用（否则可能被 GC 提前回收）
    task = asyncio.create_task(fetch("C", 0.01))
    result = await task          # 在这里收结果
    print(result)

    # 超时：老式写法 wait_for（3.11+ 推荐 asyncio.timeout，见注释）
    try:
        await asyncio.wait_for(fetch("慢任务", 5), timeout=0.05)
    except asyncio.TimeoutError:
        print("超时了")

    # 方式3：TaskGroup（3.11+，官方推荐的结构化并发），仅展示——
    # async with asyncio.TaskGroup() as tg:
    #     t1 = tg.create_task(fetch("A", 0.02))
    #     t2 = tg.create_task(fetch("B", 0.01))
    # # 离开 with 自动等待全部完成；任一失败取消其余并以 ExceptionGroup 抛出
    # print(t1.result(), t2.result())
    # 超时（3.11+）：async with asyncio.timeout(1.5): ...
    # 协程被取消时收到 CancelledError（3.8+ 起继承 BaseException，except Exception 吞不掉）

asyncio.run(main())`,
    },
    {
      id: "14_4", title: "§14.4 最常见的误区", desc: "阻塞调用不会自动异步化、卡死整个事件循环、asyncio.to_thread 救场",
      doc: "https://docs.python.org/zh-cn/3.14/library/asyncio-dev.html",
      html: `<ul>
<li>⭐⭐ <b>阻塞调用不会自动异步化</b>——在协程里调普通阻塞函数会<b>卡住整个事件循环</b>（所有协程被迫陪等）</li>
<li>反面清单：<code>time.sleep</code> ❌ → 用 <code>await asyncio.sleep()</code>；<code>requests</code> ❌ → 用 httpx / aiohttp；普通文件 I/O ❌ → 用第三方 aiofiles</li>
<li>必须用阻塞库时：<code>await asyncio.to_thread(阻塞函数, 参数)</code>（3.9+）把它丢到线程池</li></ul>
<pre>import time
import requests   # 阻塞库，仅作反面示例

async def bad():
    time.sleep(1)              # ❌ 卡死所有协程！要用 await asyncio.sleep(1)
    requests.get("http://x")   # ❌ requests 是阻塞库！要用 httpx/aiohttp
    open("big.zip", "rb")      # ❌ 普通文件 I/O 是阻塞的，不会自动变异步

async def good():
    await asyncio.sleep(1)
    await asyncio.to_thread(time.sleep, 1)   # 3.9+：把阻塞调用丢到线程池
    # 文件异步读写可用第三方 aiofiles；网络用 httpx/aiohttp</pre>`,
      code: String.raw`import asyncio, time

async def bad():
    time.sleep(0.05)        # ❌ 卡死整个事件循环（反面示例）
    # requests.get("http://x")   # ❌ requests 是阻塞库！要用 httpx / aiohttp
    # open("big.zip", "rb")      # ❌ 普通文件 I/O 是阻塞的，不会自动变异步

async def good():
    await asyncio.sleep(0.05)                  # ✅ 异步睡眠：让出控制权
    await asyncio.to_thread(time.sleep, 0.05)  # ✅ 3.9+：阻塞调用丢到线程池

async def main():
    await bad()
    await good()
    print("跑完了")

asyncio.run(main())`,
    },
  ],
});
