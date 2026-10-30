import type { Lesson } from './courses';

/* 教科书进阶线：对照主流教科书的共同章节补齐的缺口。
   参考书目（只对照章节结构，不抄书里的例题和习题）：
   - 《Python 编程：从入门到实践》（Eric Matthes）：变量、列表、字典、if、while、函数、类、文件异常、测试
   - 廖雪峰《Python 教程》：基础、高级特性（切片、迭代、列表生成式、生成器）、高阶函数、面向对象、面向对象高级编程
   - 《Automate the Boring Stuff with Python》：基础、流程、函数、调试、列表、字典、字符串、正则、文件、CSV/JSON、爬虫
   已有路线已覆盖：变量、if、for、列表、字典、函数、异常、类、文件、计数、import、默认参数。
   这一线补的是之前没有、但教科书里都有的：字符串方法、元组集合、切片、while、函数进阶、递归、
   高阶函数、生成器、继承多态、类进阶、JSON、正则进阶、异常进阶、排序搜索。
   每关题头都写了“教科书对应”和“这一关的学习方法”，难度在 L2 到 L4 之间。 */

export const TEXTBOOK_COURSES: Lesson[] = [
  {
    id: 'textbook-01',
    track: 'textbook',
    title: '教科书第 1 关：字符串方法，清洗一段文本',
    markdown: `### 教科书对应
《从入门到实践》第 2 章字符串、《Automate》第 8 章字符串处理。之前只练了 f-string，没练过字符串本身的方法。

### 学习方法：主动回忆
先自己想：去掉首尾空格、按逗号切分、再用短横线连起来，分别对应哪个方法？想不起来再看提示，不要一上来就看答案。

🎯 **通关任务**：对下面这段文本，算出 \`cleaned\`（去掉首尾空格）、\`parts\`（按逗号切分后每段再去掉首尾空格）、\`joined\`（用 \`-\` 把 parts 连起来）、\`replaced\`（把 joined 里的 Python 换成 Py）。`,
    starterCode: `text = "  Python 学习, 爬虫, 数据  "\n# 请算出 cleaned、parts、joined、replaced\nprint(cleaned)\nprint(parts)\nprint(joined)\nprint(replaced)`,
    testCode: `assert cleaned == "Python 学习, 爬虫, 数据", f"cleaned 不对：{cleaned}"\nassert parts == ["Python 学习", "爬虫", "数据"], f"parts 不对：{parts}"\nassert joined == "Python 学习-爬虫-数据", f"joined 不对：{joined}"\nassert replaced == "Py 学习-爬虫-数据", f"replaced 不对：{replaced}"`,
    solution: `text = "  Python 学习, 爬虫, 数据  "\ncleaned = text.strip()\nparts = [part.strip() for part in cleaned.split(",")]\njoined = "-".join(parts)\nreplaced = joined.replace("Python", "Py")\nprint(cleaned)\nprint(parts)\nprint(joined)\nprint(replaced)`,
  },
  {
    id: 'textbook-02',
    track: 'textbook',
    title: '教科书第 2 关：元组与集合，去重和交集',
    markdown: `### 教科书对应
《从入门到实践》第 3、6 章列表与字典、廖雪峰基础篇 list 和 tuple、dict 和 set。元组不可变、集合去重，是教科书里和列表字典并列的基础数据结构，之前没单独练过。

### 学习方法：对比记忆
列表、元组、集合、字典放在一起记：哪个有序、哪个可改、哪个去重、哪个用键取值？能讲出区别才算会。

🎯 **通关任务**：算出 \`unique_scores\`（scores 去重后从小到大排）、\`pair\`（把名字和年龄解包成元组后原样返回）、\`common\`（两个兴趣集合的交集，从小到大排）。`,
    starterCode: `scores = [85, 92, 85, 70, 92]\nname_age = ("小白", 18)\ninterests_a = {"Python", "爬虫", "音乐"}\ninterests_b = {"Python", "数据", "音乐"}\n# 请算出 unique_scores、pair、common\nprint(unique_scores)\nprint(pair)\nprint(common)`,
    testCode: `assert unique_scores == [70, 85, 92], f"去重排序不对：{unique_scores}"\nassert pair == ("小白", 18), f"元组解包不对：{pair}"\nassert common == ["Python", "音乐"], f"交集不对：{common}"`,
    solution: `scores = [85, 92, 85, 70, 92]\nname_age = ("小白", 18)\ninterests_a = {"Python", "爬虫", "音乐"}\ninterests_b = {"Python", "数据", "音乐"}\nunique_scores = sorted(set(scores))\nname, age = name_age\npair = (name, age)\ncommon = sorted(interests_a & interests_b)\nprint(unique_scores)\nprint(pair)\nprint(common)`,
  },
  {
    id: 'textbook-03',
    track: 'textbook',
    title: '教科书第 3 关：切片，取一段列表',
    markdown: `### 教科书对应
廖雪峰高级特性 7.1 切片、《从入门到实践》第 4 章操作列表。切片是 Python 特有的常用写法，之前只练了按下标取单个元素。

### 学习方法：默写变式
通关后把数字换成另一组，自己再默写一遍切片：前 3 个、后 3 个、倒着取、隔一个取，四个都对才算会。

🎯 **通关任务**：对 \`nums = list(range(10))\`，算出 \`first3\`、\`last3\`、\`reversed_nums\`、\`step2\`（隔一个取）、\`middle\`（下标 2 到 4，不含 5）。`,
    starterCode: `nums = list(range(10))\n# 请用切片算出 first3、last3、reversed_nums、step2、middle\nprint(first3)\nprint(last3)\nprint(reversed_nums)\nprint(step2)\nprint(middle)`,
    testCode: `assert first3 == [0, 1, 2], f"前 3 个不对：{first3}"\nassert last3 == [7, 8, 9], f"后 3 个不对：{last3}"\nassert reversed_nums == [9, 8, 7, 6, 5, 4, 3, 2, 1, 0], "倒着取不对"\nassert step2 == [0, 2, 4, 6, 8], f"隔一个取不对：{step2}"\nassert middle == [2, 3, 4], f"中间一段不对：{middle}"`,
    solution: `nums = list(range(10))\nfirst3 = nums[:3]\nlast3 = nums[-3:]\nreversed_nums = nums[::-1]\nstep2 = nums[::2]\nmiddle = nums[2:5]\nprint(first3)\nprint(last3)\nprint(reversed_nums)\nprint(step2)\nprint(middle)`,
  },
  {
    id: 'textbook-04',
    track: 'textbook',
    title: '教科书第 4 关：while 循环，break 和 continue',
    markdown: `### 教科书对应
《从入门到实践》第 7 章用户输入和 while 循环。之前只练了 for 循环，while、break、continue 是教科书里单独一章的内容。

### 学习方法：调试驱动
while 最容易写成死循环或少算一次。先在纸上走一遍 i 的变化，再提交；报错先看最后一行。

🎯 **通关任务**：实现 \`countdown(n)\`（用 while 从 n 倒数到 1）、\`sum_to(n)\`（用 while 算 1 到 n 的和）、\`first_over(numbers, threshold)\`（用 while + break 找第一个大于 threshold 的数，找不到返回 None）、\`odd_sum(n)\`（用 while + continue 只加奇数）。`,
    starterCode: `# 请实现 countdown、sum_to、first_over、odd_sum 四个函数\ndef countdown(n):\n    pass\n\ndef sum_to(n):\n    pass\n\ndef first_over(numbers, threshold):\n    pass\n\ndef odd_sum(n):\n    pass`,
    testCode: `assert countdown(3) == [3, 2, 1], f"倒数不对：{countdown(3)}"\nassert sum_to(10) == 55, "1 到 10 的和应该是 55"\nassert first_over([1, 5, 9, 2], 6) == 9, "第一个大于 6 的应该是 9"\nassert first_over([1, 2], 10) is None, "找不到应该返回 None"\nassert odd_sum(6) == 9, "1+3+5 应该是 9"`,
    solution: `def countdown(n):\n    result = []\n    while n > 0:\n        result.append(n)\n        n -= 1\n    return result\n\ndef sum_to(n):\n    total = 0\n    i = 1\n    while i <= n:\n        total += i\n        i += 1\n    return total\n\ndef first_over(numbers, threshold):\n    i = 0\n    while i < len(numbers):\n        if numbers[i] > threshold:\n            return numbers[i]\n        i += 1\n    return None\n\ndef odd_sum(n):\n    total = 0\n    i = 1\n    while i <= n:\n        if i % 2 == 0:\n            i += 1\n            continue\n        total += i\n        i += 1\n    return total`,
  },
  {
    id: 'textbook-05',
    track: 'textbook',
    title: '教科书第 5 关：函数进阶，可变参数和返回多个值',
    markdown: `### 教科书对应
《从入门到实践》第 8 章函数（传递任意数量的实参）、廖雪峰函数参数。之前只练了普通参数和默认参数，没练过 *args、**kwargs 和返回多个值。

### 学习方法：费曼讲解
通关后试着讲一遍：*args 是把多余的位置参数收成元组，**kwargs 是把多余的关键字参数收成字典，返回多个值其实是返回了一个元组。讲不出来就说明还没真懂。

🎯 **通关任务**：实现 \`greet(name, greeting="你好", punctuation="!")\`、\`add_all(*args)\`（任意多个数求和，没有数返回 0）、\`make_profile(**kwargs)\`（原样返回关键字参数字典）、\`swap(a, b)\`（返回交换后的两个值）。`,
    starterCode: `# 请实现 greet、add_all、make_profile、swap 四个函数\ndef greet(name, greeting="你好", punctuation="!"):\n    pass\n\ndef add_all(*args):\n    pass\n\ndef make_profile(**kwargs):\n    pass\n\ndef swap(a, b):\n    pass`,
    testCode: `assert greet("小白") == "你好，小白!", f"默认问候不对：{greet('小白')}"\nassert greet("小白", greeting="Hi", punctuation="?") == "Hi，小白?", "关键字参数不对"\nassert add_all(1, 2, 3) == 6 and add_all() == 0, "可变参数求和不对"\nassert make_profile(name="小白", age=18) == {"name": "小白", "age": 18}, "关键字参数字典不对"\nassert swap(1, 2) == (2, 1), "交换不对"`,
    solution: `def greet(name, greeting="你好", punctuation="!"):\n    return f"{greeting}，{name}{punctuation}"\n\ndef add_all(*args):\n    return sum(args)\n\ndef make_profile(**kwargs):\n    return kwargs\n\ndef swap(a, b):\n    return b, a`,
  },
  {
    id: 'textbook-06',
    track: 'textbook',
    title: '教科书第 6 关：递归，函数调用自己',
    markdown: `### 教科书对应
廖雪峰函数 6.4 递归函数。递归是教科书里单独讲的一节，之前没练过：函数调用自己时，一定要先想清楚“什么时候停”。

### 学习方法：画调用栈
先在纸上画 factorial(3) = 3 * factorial(2) = 3 * 2 * factorial(1)，看到停在 1 再往回算，再写代码。

🎯 **通关任务**：实现 \`factorial(n)\`（n 的阶乘，0 和 1 都是 1）、\`fib(n)\`（斐波那契：fib(0)=0、fib(1)=1、其余等于前两项之和）、\`sum_list(nums)\`（用递归算列表的和，空列表返回 0）。`,
    starterCode: `# 请实现 factorial、fib、sum_list 三个递归函数\ndef factorial(n):\n    pass\n\ndef fib(n):\n    pass\n\ndef sum_list(nums):\n    pass`,
    testCode: `assert factorial(5) == 120 and factorial(0) == 1, "阶乘不对"\nassert fib(6) == 8 and fib(0) == 0 and fib(1) == 1, "斐波那契不对"\nassert sum_list([1, 2, 3, 4]) == 10 and sum_list([]) == 0, "递归求和不对"`,
    solution: `def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\ndef fib(n):\n    if n <= 1:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\ndef sum_list(nums):\n    if not nums:\n        return 0\n    return nums[0] + sum_list(nums[1:])`,
  },
  {
    id: 'textbook-07',
    track: 'textbook',
    title: '教科书第 7 关：高阶函数，map、filter 和按条件排序',
    markdown: `### 教科书对应
廖雪峰高阶函数 8.1（map、filter、sorted）、《从入门到实践》第 8 章函数的返回值与排序。之前只练了 sorted 的基本用法，没练过把函数当参数传进去。

### 学习方法：对比记忆
map 是“每个都变一下”，filter 是“只留下符合条件的”，sorted 的 key 是“按什么来排”。三个放一起记，别混。

🎯 **通关任务**：对 \`numbers\` 和 \`words\`，算出 \`doubled\`（每个数乘 2）、\`evens\`（只留偶数）、\`sorted_by_len\`（单词按长度从小到大排）、\`top_student\`（成绩列表里分数最高的学生名字，成绩是 (名字, 分数) 的元组）。`,
    starterCode: `numbers = [1, 2, 3, 4]\nwords = ["Python", "AI", "爬虫"]\nscores = [("小白", 85), ("大白", 92), ("小明", 78)]\n# 请算出 doubled、evens、sorted_by_len、top_student\nprint(doubled)\nprint(evens)\nprint(sorted_by_len)\nprint(top_student)`,
    testCode: `assert doubled == [2, 4, 6, 8], f"map 乘 2 不对：{doubled}"\nassert evens == [2, 4], f"filter 偶数不对：{evens}"\nassert sorted_by_len == ["AI", "爬虫", "Python"], f"按长度排序不对：{sorted_by_len}"\nassert top_student == "大白", f"最高分学生不对：{top_student}"`,
    solution: `numbers = [1, 2, 3, 4]\nwords = ["Python", "AI", "爬虫"]\nscores = [("小白", 85), ("大白", 92), ("小明", 78)]\ndoubled = list(map(lambda x: x * 2, numbers))\nevens = list(filter(lambda x: x % 2 == 0, numbers))\nsorted_by_len = sorted(words, key=len)\ntop_student = max(scores, key=lambda item: item[1])[0]\nprint(doubled)\nprint(evens)\nprint(sorted_by_len)\nprint(top_student)`,
  },
  {
    id: 'textbook-08',
    track: 'textbook',
    title: '教科书第 8 关：生成器，用 yield 慢慢产出',
    markdown: `### 教科书对应
廖雪峰高级特性 7.4 生成器、7.5 迭代器。生成器是教科书进阶篇的重点：它不一次性算出所有结果，而是用到哪算到哪，省内存。

### 学习方法：对比记忆
列表是“先全算好放着”，生成器是“要一个算一个”。用 list() 可以把生成器一次性展开，但展开后就不能再从头取了。

🎯 **通关任务**：实现 \`count_up(n)\`（用 yield 从 1 产出到 n）、\`squares(n)\`（用 yield 产出 1 到 n 的平方），并算出 \`gen_sum\`（用生成器表达式算 0 到 4 的和）。`,
    starterCode: `# 请实现 count_up、squares 两个生成器函数，并算出 gen_sum\ndef count_up(n):\n    pass\n\ndef squares(n):\n    pass\n\ngen_sum = 0\nprint(list(count_up(3)))\nprint(list(squares(4)))\nprint(gen_sum)`,
    testCode: `assert list(count_up(3)) == [1, 2, 3], "count_up 不对"\nassert list(squares(4)) == [1, 4, 9, 16], "squares 不对"\ng = count_up(2)\nassert next(g) == 1 and next(g) == 2, "next 取值不对"\nassert gen_sum == 10, f"生成器表达式求和应该是 10：{gen_sum}"`,
    solution: `def count_up(n):\n    for i in range(1, n + 1):\n        yield i\n\ndef squares(n):\n    for i in range(1, n + 1):\n        yield i * i\n\ngen_sum = sum(x for x in range(5))\nprint(list(count_up(3)))\nprint(list(squares(4)))\nprint(gen_sum)`,
  },
  {
    id: 'textbook-09',
    track: 'textbook',
    title: '教科书第 9 关：继承与多态，同一方法不同表现',
    markdown: `### 教科书对应
《从入门到实践》第 9 章继承、廖雪峰面向对象 10.3 继承和多态。之前只练了单个类，没练过子类继承父类、再重写同一个方法。

### 学习方法：项目驱动
这一关就是后面项目关的底子：先有一个通用的父类，再有不同的子类，调用同一个方法时各自表现不同，这就是多态。

🎯 **通关任务**：定义 \`Animal\`（有名字 name，有 speak 方法默认返回“……”）、\`Dog\`（继承 Animal，speak 返回“名字：汪汪”）、\`Cat\`（继承 Animal，speak 返回“名字：喵喵”），再实现 \`animal_sounds(animals)\`（返回每个动物的 speak 结果列表）。`,
    starterCode: `# 请定义 Animal、Dog、Cat 三个类，并实现 animal_sounds 函数\nclass Animal:\n    pass\n\nclass Dog(Animal):\n    pass\n\nclass Cat(Animal):\n    pass\n\ndef animal_sounds(animals):\n    pass`,
    testCode: `assert Dog("大白").speak() == "大白：汪汪", "Dog 的 speak 不对"\nassert Cat("小白").speak() == "小白：喵喵", "Cat 的 speak 不对"\nassert isinstance(Dog("大白"), Animal) is True, "Dog 应该是 Animal 的实例"\nassert animal_sounds([Dog("大白"), Cat("小白")]) == ["大白：汪汪", "小白：喵喵"], "多态调用不对"`,
    solution: `class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return "……"\n\nclass Dog(Animal):\n    def speak(self):\n        return f"{self.name}：汪汪"\n\nclass Cat(Animal):\n    def speak(self):\n        return f"{self.name}：喵喵"\n\ndef animal_sounds(animals):\n    return [animal.speak() for animal in animals]`,
  },
  {
    id: 'textbook-10',
    track: 'textbook',
    title: '教科书第 10 关：类进阶，@property 和定制类',
    markdown: `### 教科书对应
廖雪峰面向对象高级编程 11.2 @property、11.4 定制类。@property 是教科书里“把方法当属性用”的写法，__str__ 是“让对象打印出来好看”的写法。

### 学习方法：重构阅读
先读懂起手代码里直接暴露 score 有什么问题（外面可以随便改成 999），再用 @property 把校验收进类里。

🎯 **通关任务**：定义 \`Student\`：初始化时传名字和分数；分数用 @property 管理，读出来就是分数，改成不在 0 到 100 之间的数时抛 ValueError 且原分数不变；\`str(学生)\` 返回“名字：分数分”，例如“小白：85分”。`,
    starterCode: `# 请定义 Student 类：用 @property 管理分数，用 __str__ 定制打印\nclass Student:\n    pass`,
    testCode: `s = Student("小白", 85)\nassert s.score == 85, "分数读出来不对"\nassert str(s) == "小白：85分", f"打印不对：{str(s)}"\ns.score = 90\nassert s.score == 90 and str(s) == "小白：90分", "改分数后不对"\ntry:\n    s.score = 150\n    assert False, "150 分应该抛 ValueError"\nexcept ValueError:\n    pass\nassert s.score == 90, "非法赋值后原分数不该变"`,
    solution: `class Student:\n    def __init__(self, name, score):\n        self.name = name\n        self.score = score\n\n    @property\n    def score(self):\n        return self._score\n\n    @score.setter\n    def score(self, value):\n        if not 0 <= value <= 100:\n            raise ValueError("分数必须在 0 到 100 之间")\n        self._score = value\n\n    def __str__(self):\n        return f"{self.name}：{self.score}分"`,
  },
  {
    id: 'textbook-11',
    track: 'textbook',
    title: '教科书第 11 关：JSON 数据，字符串和字典互转',
    markdown: `### 教科书对应
《从入门到实践》第 10 章存储数据、《Automate》第 18 章 CSV、JSON 和 XML。JSON 是前后端、爬虫、数据分析里最常见的数据格式，之前只练了手写 CSV 字符串，没练过标准库 json。

### 学习方法：间隔重复
JSON 的两个方向最容易记反：loads 是“字符串变字典”，dumps 是“字典变字符串”。通关后隔一天再默写一遍这两个方向。

🎯 **通关任务**：对下面这段 JSON 字符串，算出 \`parsed\`（解析成字典）、\`avg\`（scores 的平均分）、\`dumped\`（把 {"name": 名字, "avg": 平均分} 再转回 JSON 字符串，中文不要变成转义码）。`,
    starterCode: `import json\ntext = '{"name": "小白", "scores": [85, 92]}'\n# 请算出 parsed、avg、dumped\nprint(parsed)\nprint(avg)\nprint(dumped)`,
    testCode: `assert parsed == {"name": "小白", "scores": [85, 92]}, f"解析不对：{parsed}"\nassert avg == 88.5, f"平均分不对：{avg}"\nassert json.loads(dumped) == {"name": "小白", "avg": 88.5}, f"转回 JSON 不对：{dumped}"\nassert "小白" in dumped, "中文应该直接出现，不要变成转义码"`,
    solution: `import json\ntext = '{"name": "小白", "scores": [85, 92]}'\nparsed = json.loads(text)\navg = sum(parsed["scores"]) / len(parsed["scores"])\ndumped = json.dumps({"name": parsed["name"], "avg": avg}, ensure_ascii=False)\nprint(parsed)\nprint(avg)\nprint(dumped)`,
  },
  {
    id: 'textbook-12',
    track: 'textbook',
    title: '教科书第 12 关：正则进阶，分组提取',
    markdown: `### 教科书对应
《Automate》第 9 章正则表达式、廖雪峰正则表达式。之前只练了找数字，这关练分组：括号里每一组分别是什么，findall 返回的就是这些组。

### 学习方法：调试驱动
正则写错时先拿最短的一段文本试：只留一个手机号、一个邮箱，看能不能提出来，再放回整段文本。

🎯 **通关任务**：对下面两段文本，算出 \`phones\`（所有 11 位手机号列表）、\`emails\`（所有邮箱列表）、\`score_dict\`（把“科目:分数”这种形式提出来，转成科目到整数分数的字典）。`,
    starterCode: `import re\ntext = "联系：小白 13812345678，邮箱 xiaobai@example.com，价格 59元"\ntext2 = "Python:85, Java:92"\n# 请算出 phones、emails、score_dict\nprint(phones)\nprint(emails)\nprint(score_dict)`,
    testCode: `assert phones == ["13812345678"], f"手机号不对：{phones}"\nassert emails == ["xiaobai@example.com"], f"邮箱不对：{emails}"\nassert score_dict == {"Python": 85, "Java": 92}, f"分组提取不对：{score_dict}"`,
    solution: `import re\ntext = "联系：小白 13812345678，邮箱 xiaobai@example.com，价格 59元"\ntext2 = "Python:85, Java:92"\nphones = re.findall(r"1\\d{10}", text)\nemails = re.findall(r"\\w+@\\w+\\.\\w+", text)\nscore_dict = {name: int(score) for name, score in re.findall(r"(\\w+):(\\d+)", text2)}\nprint(phones)\nprint(emails)\nprint(score_dict)`,
  },
  {
    id: 'textbook-13',
    track: 'textbook',
    title: '教科书第 13 关：异常进阶，else、finally 和自定义异常',
    markdown: `### 教科书对应
《从入门到实践》第 10 章异常、廖雪峰错误、调试和测试。之前只练了 try/except 和 ValueError，这关练完整的 try/except/else/finally，以及自己定义一个异常类。

### 学习方法：对比记忆
except 是“出错时怎么办”，else 是“没出错时怎么办”，finally 是“不管出不出错都要怎么办”。三个放一起记，别只记 except。

🎯 **通关任务**：实现 \`divide_with_log(a, b)\`（返回 (结果, 日志列表)：成功时日志是 ["ok", "done"]，除零时结果是 None、日志是 ["error", "done"]，其中 "done" 必须来自 finally），再定义 \`ScoreError\`（继承 ValueError 的自定义异常），实现 \`check_score(score)\`（0 到 100 之间返回 True，否则抛 ScoreError）。`,
    starterCode: `# 请实现 divide_with_log、ScoreError、check_score\ndef divide_with_log(a, b):\n    pass\n\nclass ScoreError(ValueError):\n    pass\n\ndef check_score(score):\n    pass`,
    testCode: `assert divide_with_log(10, 2) == (5.0, ["ok", "done"]), f"成功时不对：{divide_with_log(10, 2)}"\nassert divide_with_log(10, 0) == (None, ["error", "done"]), f"除零时不对：{divide_with_log(10, 0)}"\nassert check_score(85) is True\ntry:\n    check_score(150)\n    assert False, "150 分应该抛 ScoreError"\nexcept ScoreError:\n    pass\ntry:\n    check_score(150)\n    assert False, "ScoreError 应该也是 ValueError"\nexcept ValueError:\n    pass`,
    solution: `def divide_with_log(a, b):\n    log = []\n    try:\n        result = a / b\n    except ZeroDivisionError:\n        log.append("error")\n        return None, log\n    else:\n        log.append("ok")\n        return result, log\n    finally:\n        log.append("done")\n\nclass ScoreError(ValueError):\n    pass\n\ndef check_score(score):\n    if not 0 <= score <= 100:\n        raise ScoreError("分数必须在 0 到 100 之间")\n    return True`,
  },
  {
    id: 'textbook-14',
    track: 'textbook',
    title: '教科书第 14 关：排序与搜索，冒泡排序和二分查找',
    markdown: `### 教科书对应
教科书和算法入门里最常见的两个基础算法：冒泡排序是“相邻两个比大小、大的往后冒”，二分查找是“每次砍掉一半”。之前只练了内置 sorted，这关练自己写算法。

### 学习方法：费曼讲解 + 调试驱动
先讲一遍冒泡排序为什么外层要跑 n-1 轮、内层为什么越跑越短，再写代码；二分查找先讲清楚 left、right、mid 每次怎么变，再写 while。

🎯 **通关任务**：实现 \`bubble_sort(nums)\`（返回从小到大排好的新列表，不要改动原列表）、\`binary_search(sorted_nums, target)\`（在已排好的列表里找 target，返回下标，找不到返回 -1，空列表也返回 -1）。`,
    starterCode: `# 请实现 bubble_sort、binary_search 两个函数\ndef bubble_sort(nums):\n    pass\n\ndef binary_search(sorted_nums, target):\n    pass`,
    testCode: `assert bubble_sort([5, 2, 9, 1]) == [1, 2, 5, 9], "冒泡排序不对"\noriginal = [5, 2, 9, 1]\nbubble_sort(original)\nassert original == [5, 2, 9, 1], "排序不应该改动原列表"\nassert binary_search([1, 2, 5, 9], 5) == 2, "二分查找下标不对"\nassert binary_search([1, 2, 5, 9], 7) == -1, "找不到应该返回 -1"\nassert binary_search([], 1) == -1, "空列表应该返回 -1"`,
    solution: `def bubble_sort(nums):\n    result = list(nums)\n    n = len(result)\n    for i in range(n):\n        for j in range(n - 1 - i):\n            if result[j] > result[j + 1]:\n                result[j], result[j + 1] = result[j + 1], result[j]\n    return result\n\ndef binary_search(sorted_nums, target):\n    left, right = 0, len(sorted_nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if sorted_nums[mid] == target:\n            return mid\n        elif sorted_nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1`,
  },
];
