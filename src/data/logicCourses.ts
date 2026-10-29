import type { Lesson } from './courses';

/* 逻辑实战线：从“算一个答案”改成“做一个小系统”。
   设计原则（和概念关的区别）：
   - 有状态：判题按顺序调用多次，查每一步之后的状态变没变对。
   - 多步骤：前一步的输出就是后一步的输入，中间结果也要查。
   - 有边界：空数据、重复、库存不足、非法输入都要测，不只测正常情况。
   - 给需求不给步骤：起手只给函数签名和 TODO，让小白自己决定数据结构和拆分。
   答案本身不刻意堆行数（Python 写得简洁是好事），逻辑密度才是关键：
   每关都有多个函数、多步顺序调用和边界判题，完整程序（含起手数据）约 20-40 行，
   概念关是 2-6 行单答案，项目关是拆函数的完整程序。 */

export const LOGIC_COURSES: Lesson[] = [
  {
    id: 'logic-01',
    track: 'logic',
    title: '逻辑第 1 关：成绩管理系统',
    markdown: `### 这关练什么
不再是一次算出一个数，而是一套“记录会越变越多”的操作。判题会按顺序调用你的函数，查每一步之后的状态。

### 需求（只给行为，不给步骤）
- \`add_student(records, name, score)\`：往记录里加一个学生，记录是一条字典 \`{"name": ..., "score": ...}\`。分数不在 0 到 100 之间时，抛 \`ValueError\`，并且不能把这条脏数据加进去。
- \`average(records)\`：返回平均分；记录为空时返回 0，不能崩。
- \`top_student(records)\`：返回分数最高的那条记录；记录为空时返回 \`None\`。
- \`failing(records)\`：返回所有不及格（分数 < 60）学生的名字列表。

🎯 **通关任务**：实现上面 4 个函数。判题会加 3 个学生、查平均分和最高分、查不及格名单，还会试一次非法分数和空记录。`,
    starterCode: `# records 是一条条 {"name": ..., "score": ...} 的列表\n# 请实现下面 4 个函数\ndef add_student(records, name, score):\n    pass\n\ndef average(records):\n    pass\n\ndef top_student(records):\n    pass\n\ndef failing(records):\n    pass`,
    testCode: `records = []\nadd_student(records, "小白", 85)\nadd_student(records, "大白", 59)\nadd_student(records, "小明", 92)\nassert average(records) == 236 / 3, f"平均分不对：{average(records)}"\nassert top_student(records)["name"] == "小明", f"最高分学生不对：{top_student(records)}"\nassert failing(records) == ["大白"], f"不及格名单不对：{failing(records)}"\nassert average([]) == 0, "空记录的平均分应该是 0，不能崩"\nassert top_student([]) is None, "空记录的最高分应该是 None"\ntry:\n    add_student(records, "坏数据", 150)\n    assert False, "150 分应该抛 ValueError，不能悄悄加进去"\nexcept ValueError:\n    pass\nassert len(records) == 3, "非法分数加进去后记录数就不该变"`,
    solution: `def add_student(records, name, score):\n    if not 0 <= score <= 100:\n        raise ValueError("分数必须在 0 到 100 之间")\n    records.append({"name": name, "score": score})\n\ndef average(records):\n    if not records:\n        return 0\n    return sum(r["score"] for r in records) / len(records)\n\ndef top_student(records):\n    if not records:\n        return None\n    return max(records, key=lambda r: r["score"])\n\ndef failing(records):\n    return [r["name"] for r in records if r["score"] < 60]`,
  },
  {
    id: 'logic-02',
    track: 'logic',
    title: '逻辑第 2 关：购物车结算',
    markdown: `### 这关练什么
分支组合：库存、满减档位、优惠券、税费，顺序错了结果就错。真实结算就是这么一层层算下来的。

### 需求
实现 \`checkout(items, coupon=None)\`，其中每件商品是 \`{"name": ..., "price": ..., "qty": ..., "stock": ...}\`。

按这个顺序算，顺序本身就是题目的一部分：
1. 先查库存：任何一件 \`qty > stock\`，就抛 \`ValueError\`，不能先算钱再报错。
2. 再算小计：所有 \`price * qty\` 加起来。
3. 再算满减：小计 >= 200 打 9 折，>= 100 打 95 折，不到 100 不打折。
4. 再算优惠券：\`coupon == "SAVE20"\` 时减 20，减完如果小于 0 就按 0 算。
5. 最后加 8% 的税，结果用 \`round(..., 2)\` 保留两位小数。

🎯 **通关任务**：实现 \`checkout\`。判题会测正常结算、两个满减档位、优惠券、库存不足、优惠券减到负数这几种情况。`,
    starterCode: `# 请实现 checkout 函数\n# items 里的每件商品是 {"name": ..., "price": ..., "qty": ..., "stock": ...}\ndef checkout(items, coupon=None):\n    pass`,
    testCode: `items1 = [{"name": "咖啡", "price": 25, "qty": 2, "stock": 10}, {"name": "蛋糕", "price": 30, "qty": 1, "stock": 5}]\nassert checkout(items1) == 86.4, f"80 元不打折加税应该是 86.4，你算出：{checkout(items1)}"\nitems2 = [{"name": "书", "price": 70, "qty": 3, "stock": 10}]\nassert checkout(items2) == 204.12, f"210 元打 9 折加税应该是 204.12，你算出：{checkout(items2)}"\nassert checkout(items1, coupon="SAVE20") == 64.8, f"80 元减 20 再加税应该是 64.8，你算出：{checkout(items1, coupon='SAVE20')}"\ntry:\n    checkout([{"name": "书", "price": 70, "qty": 5, "stock": 2}])\n    assert False, "库存不足应该抛 ValueError"\nexcept ValueError:\n    pass\nassert checkout([{"name": "糖", "price": 10, "qty": 1, "stock": 5}], coupon="SAVE20") == 0, "减到负数应该按 0 算"`,
    solution: `def checkout(items, coupon=None):\n    for item in items:\n        if item["qty"] > item["stock"]:\n            raise ValueError(f"{item['name']} 库存不足")\n    total = sum(item["price"] * item["qty"] for item in items)\n    if total >= 200:\n        total *= 0.9\n    elif total >= 100:\n        total *= 0.95\n    if coupon == "SAVE20":\n        total -= 20\n    if total < 0:\n        total = 0\n    return round(total * 1.08, 2)`,
  },
  {
    id: 'logic-03',
    track: 'logic',
    title: '逻辑第 3 关：猜数字游戏',
    markdown: `### 这关练什么
循环 + 状态：游戏不是一次判断，而是一轮轮猜，每轮都要根据上一轮的结果给提示，最后还要知道赢没赢、用了几次。

### 需求
实现 \`play_game(secret, guesses)\`，返回一个字典：
- \`{"won": True/False, "attempts": 用了几次, "hints": [...]}\`
- 每猜一次，如果猜对了就直接赢，不再给提示；猜小了提示 \`"太小了"\`，猜大了提示 \`"太大了"\`。
- 猜完整个列表都没猜对，\`won\` 是 False，\`attempts\` 就是列表长度。

注意：这里用一个猜测列表来模拟游戏过程，不用 \`input()\`，浏览器里交互输入不好做，真实游戏的逻辑就是这个循环。

🎯 **通关任务**：实现 \`play_game\`。判题会测三轮猜中、一直没猜中、一次猜中这三种情况。`,
    starterCode: `# 请实现 play_game 函数\n# 返回 {"won": ..., "attempts": ..., "hints": [...]}\ndef play_game(secret, guesses):\n    pass`,
    testCode: `r1 = play_game(42, [10, 50, 42])\nassert r1 == {"won": True, "attempts": 3, "hints": ["太小了", "太大了"]}, f"三轮猜中不对：{r1}"\nr2 = play_game(42, [1, 2])\nassert r2 == {"won": False, "attempts": 2, "hints": ["太小了", "太小了"]}, f"没猜中不对：{r2}"\nr3 = play_game(7, [7])\nassert r3 == {"won": True, "attempts": 1, "hints": []}, f"一次猜中不应该有提示：{r3}"`,
    solution: `def play_game(secret, guesses):\n    hints = []\n    for i, guess in enumerate(guesses, start=1):\n        if guess == secret:\n            return {"won": True, "attempts": i, "hints": hints}\n        elif guess < secret:\n            hints.append("太小了")\n        else:\n            hints.append("太大了")\n    return {"won": False, "attempts": len(guesses), "hints": hints}`,
  },
  {
    id: 'logic-04',
    track: 'logic',
    title: '逻辑第 4 关：记账本',
    markdown: `### 这关练什么
按条件汇总：同一批记录，换个维度（按月、按分类）就要算出不同的结果，真实的数据处理基本都是这个套路。

### 需求
记录是一条条 \`{"date": "2026-10-01", "category": "餐饮", "amount": 25}\`。
- \`add_record(records, date, category, amount)\`：加一条记录；金额小于 0 抛 \`ValueError\`。
- \`monthly_total(records, month)\`：返回某个月（比如 \`"2026-10"\`）的总支出，日期以这个前缀开头的都算；那个月没记录返回 0。
- \`category_total(records)\`：返回一个字典，键是分类，值是该分类的总支出。

🎯 **通关任务**：实现上面 3 个函数。判题会加 10 月和 11 月的记录，查两个月的合计、查各分类合计，还会试一次负数金额。`,
    starterCode: `# 请实现 add_record、monthly_total、category_total 三个函数\ndef add_record(records, date, category, amount):\n    pass\n\ndef monthly_total(records, month):\n    pass\n\ndef category_total(records):\n    pass`,
    testCode: `records = []\nadd_record(records, "2026-10-01", "餐饮", 25)\nadd_record(records, "2026-10-02", "交通", 10)\nadd_record(records, "2026-10-03", "餐饮", 35)\nadd_record(records, "2026-11-01", "餐饮", 20)\nassert monthly_total(records, "2026-10") == 70, f"10 月合计应该是 70：{monthly_total(records, '2026-10')}"\nassert monthly_total(records, "2026-11") == 20, f"11 月合计应该是 20：{monthly_total(records, '2026-11')}"\nassert monthly_total(records, "2026-12") == 0, "没有记录的月份应该是 0"\nassert category_total(records) == {"餐饮": 80, "交通": 10}, f"分类合计不对：{category_total(records)}"\ntry:\n    add_record(records, "2026-10-04", "餐饮", -5)\n    assert False, "负数金额应该抛 ValueError"\nexcept ValueError:\n    pass\nassert len(records) == 4, "非法记录加进去后记录数就不该变"`,
    solution: `def add_record(records, date, category, amount):\n    if amount < 0:\n        raise ValueError("金额不能小于 0")\n    records.append({"date": date, "category": category, "amount": amount})\n\ndef monthly_total(records, month):\n    return sum(r["amount"] for r in records if r["date"].startswith(month))\n\ndef category_total(records):\n    totals = {}\n    for r in records:\n        totals[r["category"]] = totals.get(r["category"], 0) + r["amount"]\n    return totals`,
  },
  {
    id: 'logic-05',
    track: 'logic',
    title: '逻辑第 5 关：图书馆借还',
    markdown: `### 这关练什么
共享状态的增减：借一本少一本，还一本多一本，借完、借没有的书、还没有的书，每一步的边界都要守住。

### 需求
书库是一个字典，键是书名，值是剩余可借本数，比如 \`{"Python入门": 2, "爬虫实战": 0}\`。
- \`borrow(books, title)\`：书不存在抛 \`ValueError\`；剩余为 0 抛 \`ValueError\`；否则剩余减 1，返回 True。
- \`return_book(books, title)\`：书不存在抛 \`ValueError\`；否则剩余加 1，返回 True。
- \`available(books, title)\`：返回剩余本数；书不存在返回 0，不能崩。

🎯 **通关任务**：实现上面 3 个函数。判题会连续借、借完再借、还书、借不存在的书，查每一步之后的剩余数。`,
    starterCode: `# 请实现 borrow、return_book、available 三个函数\ndef borrow(books, title):\n    pass\n\ndef return_book(books, title):\n    pass\n\ndef available(books, title):\n    pass`,
    testCode: `books = {"Python入门": 2, "爬虫实战": 0}\nassert borrow(books, "Python入门") is True and available(books, "Python入门") == 1, "借一次应该剩 1"\nassert borrow(books, "Python入门") is True and available(books, "Python入门") == 0, "借两次应该剩 0"\ntry:\n    borrow(books, "Python入门")\n    assert False, "借完再借应该抛 ValueError"\nexcept ValueError:\n    pass\ntry:\n    borrow(books, "不存在的书")\n    assert False, "借不存在的书应该抛 ValueError"\nexcept ValueError:\n    pass\nassert return_book(books, "Python入门") is True and available(books, "Python入门") == 1, "还一次应该剩 1"\nassert available(books, "不存在的书") == 0, "不存在的书剩余应该是 0"`,
    solution: `def borrow(books, title):\n    if title not in books:\n        raise ValueError("没有这本书")\n    if books[title] <= 0:\n        raise ValueError("已借完")\n    books[title] -= 1\n    return True\n\ndef return_book(books, title):\n    if title not in books:\n        raise ValueError("没有这本书")\n    books[title] += 1\n    return True\n\ndef available(books, title):\n    return books.get(title, 0)`,
  },
  {
    id: 'logic-06',
    track: 'logic',
    title: '逻辑第 6 关：爬虫进阶，过滤、排序、分组',
    markdown: `### 这关练什么
多步骤链条：同一批数据，先过滤、再排序、再取前几名、再算平均、再分组，每一步的输出都是下一步的输入。

### 需求
下面已经给了 12 本书的数据，每本是 \`{"title": ..., "price": ..., "category": ...}\`。请算出下面 4 个结果：
- \`filtered\`：价格 >= 70 的书的列表（保持原顺序）。
- \`top3\`：在 \`filtered\` 里按价格从高到低排，取前 3 本的书名列表。
- \`avg_price\`：所有 12 本书的平均价格。
- \`category_count\`：一个字典，键是分类，值是该分类有几本书（算全部 12 本，不是只算过滤后的）。

🎯 **通关任务**：算出上面 4 个变量并打印。判题会同时查这 4 个结果，任何一步错了都过不了。`,
    starterCode: `books = [\n    {"title": "Python入门", "price": 59, "category": "编程"},\n    {"title": "爬虫实战", "price": 79, "category": "爬虫"},\n    {"title": "数据分析", "price": 99, "category": "数据"},\n    {"title": "算法图解", "price": 69, "category": "编程"},\n    {"title": "网络爬虫", "price": 89, "category": "爬虫"},\n    {"title": "SQL必知必会", "price": 49, "category": "数据"},\n    {"title": "深入Python", "price": 109, "category": "编程"},\n    {"title": "反爬虫指南", "price": 65, "category": "爬虫"},\n    {"title": "统计学习", "price": 119, "category": "数据"},\n    {"title": "Flask入门", "price": 55, "category": "编程"},\n    {"title": "数据可视化", "price": 85, "category": "数据"},\n    {"title": "Scrapy实战", "price": 75, "category": "爬虫"},\n]\n# 请算出 filtered、top3、avg_price、category_count\nprint(filtered)\nprint(top3)\nprint(avg_price)\nprint(category_count)`,
    testCode: `assert len(filtered) == 7, f"价格 >= 70 的书应该是 7 本，你得到 {len(filtered)} 本"\nassert top3 == ["统计学习", "深入Python", "数据分析"], f"前 3 名不对：{top3}"\nassert avg_price == 952 / 12, f"平均价格不对：{avg_price}"\nassert category_count == {"编程": 4, "爬虫": 4, "数据": 4}, f"分类计数不对：{category_count}"`,
    solution: `books = [\n    {"title": "Python入门", "price": 59, "category": "编程"},\n    {"title": "爬虫实战", "price": 79, "category": "爬虫"},\n    {"title": "数据分析", "price": 99, "category": "数据"},\n    {"title": "算法图解", "price": 69, "category": "编程"},\n    {"title": "网络爬虫", "price": 89, "category": "爬虫"},\n    {"title": "SQL必知必会", "price": 49, "category": "数据"},\n    {"title": "深入Python", "price": 109, "category": "编程"},\n    {"title": "反爬虫指南", "price": 65, "category": "爬虫"},\n    {"title": "统计学习", "price": 119, "category": "数据"},\n    {"title": "Flask入门", "price": 55, "category": "编程"},\n    {"title": "数据可视化", "price": 85, "category": "数据"},\n    {"title": "Scrapy实战", "price": 75, "category": "爬虫"},\n]\nfiltered = [b for b in books if b["price"] >= 70]\nsorted_books = sorted(filtered, key=lambda b: b["price"], reverse=True)\ntop3 = [b["title"] for b in sorted_books[:3]]\navg_price = sum(b["price"] for b in books) / len(books)\ncategory_count = {}\nfor b in books:\n    category_count[b["category"]] = category_count.get(b["category"], 0) + 1\nprint(filtered)\nprint(top3)\nprint(avg_price)\nprint(category_count)`,
  },
  {
    id: 'logic-07',
    track: 'logic',
    title: '逻辑第 7 关：后端进阶，搜索、过滤、分页',
    markdown: `### 这关练什么
真实接口的常见组合：搜索 + 过滤 + 分页 + 校验，缺一个，接口就没法给前端用。

### 需求
待办是一条条 \`{"text": ..., "done": ...}\`。
- \`add_todo(todos, text)\`：文本去掉首尾空格后如果为空，抛 \`ValueError\`；否则加一条未完成待办（存去掉空格后的文本）。
- \`complete_todo(todos, index)\`：下标越界抛 \`IndexError\`；否则把那条标为已完成。
- \`search(todos, keyword)\`：返回文本里包含关键词的待办列表。
- \`pending(todos)\`：返回所有未完成的待办。
- \`page(todos, page_num, page_size)\`：页码从 1 开始；页码小于 1 抛 \`ValueError\`；返回那一页的切片，超出范围返回空列表，不能崩。

🎯 **通关任务**：实现上面 5 个函数。判题会加 5 条、完成 1 条、搜索、查未完成、翻 3 页，还会试空文本、越界下标、非法页码。`,
    starterCode: `# 请实现 add_todo、complete_todo、search、pending、page 五个函数\ndef add_todo(todos, text):\n    pass\n\ndef complete_todo(todos, index):\n    pass\n\ndef search(todos, keyword):\n    pass\n\ndef pending(todos):\n    pass\n\ndef page(todos, page_num, page_size):\n    pass`,
    testCode: `todos = []\nadd_todo(todos, "学Python")\nadd_todo(todos, "学爬虫")\nadd_todo(todos, "跑步")\nadd_todo(todos, "读Python书")\nadd_todo(todos, "买菜")\ncomplete_todo(todos, 0)\nassert len(pending(todos)) == 4, f"未完成应该是 4 条：{pending(todos)}"\nassert [t["text"] for t in search(todos, "Python")] == ["学Python", "读Python书"], f"搜索 Python 不对：{search(todos, 'Python')}"\nassert [t["text"] for t in page(todos, 1, 2)] == ["学Python", "学爬虫"], "第 1 页不对"\nassert [t["text"] for t in page(todos, 2, 2)] == ["跑步", "读Python书"], "第 2 页不对"\nassert [t["text"] for t in page(todos, 3, 2)] == ["买菜"], "第 3 页不对"\nassert page(todos, 4, 2) == [], "超出范围的页应该是空列表"\ntry:\n    add_todo(todos, "   ")\n    assert False, "空文本应该抛 ValueError"\nexcept ValueError:\n    pass\ntry:\n    complete_todo(todos, 99)\n    assert False, "越界下标应该抛 IndexError"\nexcept IndexError:\n    pass\ntry:\n    page(todos, 0, 2)\n    assert False, "页码小于 1 应该抛 ValueError"\nexcept ValueError:\n    pass`,
    solution: `def add_todo(todos, text):\n    cleaned = text.strip()\n    if not cleaned:\n        raise ValueError("待办内容不能为空")\n    todos.append({"text": cleaned, "done": False})\n\ndef complete_todo(todos, index):\n    if not 0 <= index < len(todos):\n        raise IndexError("下标越界")\n    todos[index]["done"] = True\n\ndef search(todos, keyword):\n    return [t for t in todos if keyword in t["text"]]\n\ndef pending(todos):\n    return [t for t in todos if not t["done"]]\n\ndef page(todos, page_num, page_size):\n    if page_num < 1:\n        raise ValueError("页码必须从 1 开始")\n    start = (page_num - 1) * page_size\n    return todos[start:start + page_size]`,
  },
  {
    id: 'logic-08',
    track: 'logic',
    title: '逻辑第 8 关：数据进阶，分组、缺失、最高',
    markdown: `### 这关练什么
真实数据从来不干净：这一关的数据里有一行缺了金额，算的时候要跳过它，而不是让程序崩掉或把缺失算成 0 拉低平均。

### 需求
下面是一份 CSV 格式的销售记录，格式是 \`月份,城市,金额\`，第一行是表头，有一行金额是空的。
请算出下面 4 个结果：
- \`totals_by_city\`：每个城市的总金额字典（缺失行不计入）。
- \`totals_by_month\`：每个月的总金额字典（缺失行不计入）。
- \`best_city\`：总金额最高的城市名字。
- \`valid_count\`：有效记录的条数（有金额的才算）。

🎯 **通关任务**：算出上面 4 个变量并打印。判题会同时查这 4 个结果，缺失行处理错了就过不了。`,
    starterCode: `data = "月份,城市,金额\\n2026-10,上海,100\\n2026-10,上海,50\\n2026-10,北京,80\\n2026-11,上海,120\\n2026-11,北京,90\\n2026-11,北京,\\n2026-11,广州,200\\n2026-12,广州,150"\n# 请算出 totals_by_city、totals_by_month、best_city、valid_count\nprint(totals_by_city)\nprint(totals_by_month)\nprint(best_city)\nprint(valid_count)`,
    testCode: `assert totals_by_city == {"上海": 270, "北京": 170, "广州": 350}, f"按城市合计不对：{totals_by_city}"\nassert totals_by_month == {"2026-10": 230, "2026-11": 410, "2026-12": 150}, f"按月合计不对：{totals_by_month}"\nassert best_city == "广州", f"最高城市应该是 广州：{best_city}"\nassert valid_count == 7, f"有效记录应该是 7 条：{valid_count}"`,
    solution: `data = "月份,城市,金额\\n2026-10,上海,100\\n2026-10,上海,50\\n2026-10,北京,80\\n2026-11,上海,120\\n2026-11,北京,90\\n2026-11,北京,\\n2026-11,广州,200\\n2026-12,广州,150"\ntotals_by_city = {}\ntotals_by_month = {}\nvalid_count = 0\nfor line in data.split("\\n")[1:]:\n    month, city, amount_text = line.split(",")\n    if amount_text == "":\n        continue\n    amount = int(amount_text)\n    valid_count += 1\n    totals_by_city[city] = totals_by_city.get(city, 0) + amount\n    totals_by_month[month] = totals_by_month.get(month, 0) + amount\nbest_city = max(totals_by_city, key=lambda city: totals_by_city[city])\nprint(totals_by_city)\nprint(totals_by_month)\nprint(best_city)\nprint(valid_count)`,
  },
  // ---------- 调试题：给一段能跑但有 bug 的代码，找错并修好 ----------
  {
    id: 'logic-debug-01',
    track: 'logic',
    title: '调试第 1 关：买 2 件只算 1 件钱',
    markdown: `### 这关练什么
真实工作里，大部分时间不是从零写代码，而是读别人的代码、找 bug。这一关的程序能跑，但有个 bug。

### 症状（先自己看症状，再去看代码）
- 买 1 件时，算出来的总价是对的。
- 买 2 件、3 件时，总价就少了。

### 起手代码（就是这段有 bug 的程序，别直接重写，先找错）
起手代码里的 \`total_price\` 循环里，每件商品到底加了什么？数量 \`qty\` 在哪里丢了？

🎯 **通关任务**：只修这个 bug，让 \`total_price\` 在任何数量下都算对。判题会测数量为 1、2、3 的情况，数量为 1 时 bug 藏得住，数量大于 1 时就会露出来。`,
    starterCode: `def total_price(items):\n    total = 0\n    for item in items:\n        total += item["price"]\n    return total`,
    testCode: `assert total_price([{"price": 25, "qty": 1}]) == 25, "数量为 1 时也应该对"\nassert total_price([{"price": 25, "qty": 2}, {"price": 30, "qty": 1}]) == 80, f"25x2 + 30x1 应该是 80，你算出：{total_price([{'price': 25, 'qty': 2}, {'price': 30, 'qty': 1}])}"\nassert total_price([{"price": 10, "qty": 3}]) == 30, "10 元买 3 件应该是 30"`,
    solution: `def total_price(items):\n    total = 0\n    for item in items:\n        total += item["price"] * item["qty"]\n    return total`,
  },
  {
    id: 'logic-debug-02',
    track: 'logic',
    title: '调试第 2 关：刚好 60 分也被算成不及格',
    markdown: `### 这关练什么
边界 bug：程序在大部分分数上都是对的，只有刚好卡在分界线上的那个值会错。这种 bug 最难发现，也最常见。

### 症状
- 59 分算成不及格，对。
- 61 分算成及格，对。
- 60 分算成不及格，错了——60 分按规则应该是及格。

### 起手代码
看看不及格的判断条件里，\`<= 60\` 和 \`< 60\` 到底差在哪里？分界线上的值应该归哪一边？

🎯 **通关任务**：只修这个边界 bug，让 60 分算及格，59 分算不及格。`,
    starterCode: `def failing(records):\n    return [r["name"] for r in records if r["score"] <= 60]`,
    testCode: `records = [{"name": "小白", "score": 59}, {"name": "大白", "score": 60}, {"name": "小明", "score": 61}]\nassert failing(records) == ["小白"], f"不及格应该只有小白（59 分），60 分是及格：{failing(records)}"`,
    solution: `def failing(records):\n    return [r["name"] for r in records if r["score"] < 60]`,
  },
  {
    id: 'logic-debug-03',
    track: 'logic',
    title: '调试第 3 关：计数器每轮都被清空',
    markdown: `### 这关练什么
循环里的初始化位置错了：一个本该在循环外面初始化一次的东西，被放进了循环里面，每轮都重新开始。

### 症状
不管输入多少个词，最后的结果里永远只有最后一个词，而且次数永远是 1。

### 起手代码
看看 \`counts = {}\` 这一行到底在循环外面还是里面？如果每轮都执行一次 \`counts = {}\`，之前数过的就全没了。

🎯 **通关任务**：只修这个位置 bug，让计数能跨轮次累加。`,
    starterCode: `def count_words(words):\n    for word in words:\n        counts = {}\n        counts[word] = counts.get(word, 0) + 1\n    return counts`,
    testCode: `assert count_words(["python", "java", "python"]) == {"python": 2, "java": 1}, f"计数不对：{count_words(['python', 'java', 'python'])}"\nassert count_words(["a", "a", "a"]) == {"a": 3}, "同一个词 3 次应该数出 3"`,
    solution: `def count_words(words):\n    counts = {}\n    for word in words:\n        counts[word] = counts.get(word, 0) + 1\n    return counts`,
  },
  // ---------- 重构题：行为不变，把代码拆干净 ----------
  {
    id: 'logic-refactor-01',
    track: 'logic',
    title: '重构第 1 关：把长函数拆成三个小函数',
    markdown: `### 这关练什么
起手代码能跑、结果也对，但一个函数里堆了三件事：算小计、算折扣、加税。以后改折扣规则，就得在这个长函数里翻。

### 重构要求（行为不能变）
把 \`checkout\` 拆成下面三个小函数，并且让 \`checkout\` 调用它们：
- \`subtotal(items)\`：返回所有 \`price * qty\` 的和。
- \`apply_discount(total)\`：>= 200 打 9 折，>= 100 打 95 折，否则不变。
- \`add_tax(total)\`：加 8% 的税，返回 \`round(total * 1.08, 2)\`。
- \`checkout(items)\`：按“小计 → 折扣 → 税”的顺序调用上面三个函数。

判题会同时查：三个小函数单独算得对不对，以及 \`checkout\` 的最终结果对不对。
如果直接提交起手代码，小函数不存在，判题就会失败——这就是重构题和普通题的区别。

🎯 **通关任务**：重构，但不改结果。`,
    starterCode: `def checkout(items):\n    total = 0\n    for item in items:\n        total += item["price"] * item["qty"]\n    if total >= 200:\n        total *= 0.9\n    elif total >= 100:\n        total *= 0.95\n    total *= 1.08\n    return round(total, 2)`,
    testCode: `assert subtotal([{"price": 25, "qty": 2}, {"price": 30, "qty": 1}]) == 80, "subtotal 应该是 80"\nassert apply_discount(210) == 189, "210 打 9 折应该是 189"\nassert apply_discount(150) == 142.5, "150 打 95 折应该是 142.5"\nassert apply_discount(50) == 50, "不到 100 不打折"\nassert add_tax(100) == 108, "100 加税应该是 108"\nassert checkout([{"price": 70, "qty": 3}]) == 204.12, f"checkout 最终结果应该是 204.12：{checkout([{'price': 70, 'qty': 3}])}"`,
    solution: `def subtotal(items):\n    return sum(item["price"] * item["qty"] for item in items)\n\ndef apply_discount(total):\n    if total >= 200:\n        return total * 0.9\n    elif total >= 100:\n        return total * 0.95\n    return total\n\ndef add_tax(total):\n    return round(total * 1.08, 2)\n\ndef checkout(items):\n    return add_tax(apply_discount(subtotal(items)))`,
  },
  {
    id: 'logic-refactor-02',
    track: 'logic',
    title: '重构第 2 关：把重复的加税逻辑抽成一个函数',
    markdown: `### 这关练什么
起手代码里，“加 8% 的税”这行逻辑出现了三次：书的价格、食品的价格、总价里各写了一遍。
以后税率一改，就得改三个地方，漏一个就错。

### 重构要求（行为不能变）
抽出一个 \`add_tax(amount)\` 函数，返回 \`round(amount * 1.08, 2)\`，
并且让 \`book_price_with_tax\`、\`food_price_with_tax\`、\`total_with_tax\` 都调用它，
而不是各自再写一遍 \`* 1.08\`。

判题会同时查：\`add_tax\` 单独算得对不对，以及三个原函数的结果对不对。
直接提交起手代码，\`add_tax\` 不存在，判题就会失败。

🎯 **通关任务**：消除重复，但不改结果。`,
    starterCode: `def book_price_with_tax(price):\n    return round(price * 1.08, 2)\n\ndef food_price_with_tax(price):\n    return round(price * 1.08, 2)\n\ndef total_with_tax(items):\n    total = 0\n    for item in items:\n        total += round(item["price"] * item["qty"] * 1.08, 2)\n    return round(total, 2)`,
    testCode: `assert add_tax(100) == 108, "add_tax(100) 应该是 108"\nassert book_price_with_tax(50) == 54, "书 50 元加税应该是 54"\nassert food_price_with_tax(50) == 54, "食品 50 元加税应该是 54"\nitems = [{"price": 25, "qty": 1}, {"price": 30, "qty": 1}]\nassert total_with_tax(items) == 59.4, f"总价加税应该是 59.4：{total_with_tax(items)}"`,
    solution: `def add_tax(amount):\n    return round(amount * 1.08, 2)\n\ndef book_price_with_tax(price):\n    return add_tax(price)\n\ndef food_price_with_tax(price):\n    return add_tax(price)\n\ndef total_with_tax(items):\n    total = 0\n    for item in items:\n        total += add_tax(item["price"] * item["qty"])\n    return round(total, 2)`,
  },
  {
    id: 'logic-refactor-03',
    track: 'logic',
    title: '重构第 3 关：把魔法数字换成有名字的常量',
    markdown: `### 这关练什么
起手代码里到处是“裸数字”：60、18、200、100、0.9、0.95。过一个月再看，没人知道 60 是及格线还是别的什么，
改规则时也很容易漏改一处。

### 重构要求（行为不能变）
在代码顶部定义下面这些常量，并且让函数使用它们，而不是继续写裸数字：
- \`PASS_SCORE = 60\`（及格线）
- \`ADULT_AGE = 18\`（成年年龄）
- \`DISCOUNT_HIGH_THRESHOLD = 200\`、\`DISCOUNT_LOW_THRESHOLD = 100\`
- \`DISCOUNT_HIGH_RATE = 0.9\`、\`DISCOUNT_LOW_RATE = 0.95\`

函数还是这三个：\`passed(score)\`（>= 及格线返回 True）、\`is_adult(age)\`、\`discount(total)\`（按档位打折，否则不变）。
判题会同时查：常量值对不对，以及三个函数的结果对不对。
直接提交起手代码，常量不存在，判题就会失败。

🎯 **通关任务**：给数字起名字，但不改结果。`,
    starterCode: `def passed(score):\n    return score >= 60\n\ndef is_adult(age):\n    return age >= 18\n\ndef discount(total):\n    if total >= 200:\n        return total * 0.9\n    elif total >= 100:\n        return total * 0.95\n    return total`,
    testCode: `assert PASS_SCORE == 60, "PASS_SCORE 应该是 60"\nassert ADULT_AGE == 18, "ADULT_AGE 应该是 18"\nassert DISCOUNT_HIGH_THRESHOLD == 200 and DISCOUNT_LOW_THRESHOLD == 100\nassert DISCOUNT_HIGH_RATE == 0.9 and DISCOUNT_LOW_RATE == 0.95\nassert passed(60) is True and passed(59) is False\nassert is_adult(18) is True and is_adult(17) is False\nassert discount(210) == 189 and discount(150) == 142.5 and discount(50) == 50`,
    solution: `PASS_SCORE = 60\nADULT_AGE = 18\nDISCOUNT_HIGH_THRESHOLD = 200\nDISCOUNT_LOW_THRESHOLD = 100\nDISCOUNT_HIGH_RATE = 0.9\nDISCOUNT_LOW_RATE = 0.95\n\ndef passed(score):\n    return score >= PASS_SCORE\n\ndef is_adult(age):\n    return age >= ADULT_AGE\n\ndef discount(total):\n    if total >= DISCOUNT_HIGH_THRESHOLD:\n        return total * DISCOUNT_HIGH_RATE\n    elif total >= DISCOUNT_LOW_THRESHOLD:\n        return total * DISCOUNT_LOW_RATE\n    return total`,
  },
];
