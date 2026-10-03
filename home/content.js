/*
  CONTENT — the ONLY file you edit to change what she practices.

  Each item:  s = simplified,  t = traditional (same length as s),
              py = pinyin with tone NUMBERS (1-4, 5 = neutral), one syllable per space
                   (e.g. "xi3 huan5" shows as "xǐ huan"; v = ü),
              alt = optional second pinyin spelling shown after a slash,
              en = English meaning.
  Each lesson also has a `sticker` emoji and an `accent` color for each style (used on the home screen and celebrations).

  After editing, run:  node scripts/build.mjs   (fetches stroke data + refreshes the offline cache)
*/
window.CONTENT = {
  appTitle: { s: '写汉字', t: '寫漢字' },
  lessons: [
    {
      id: 'l0',
      number: 0,
      sticker: '🌱',
      accent: '#8ab4ff',
      accentElena: '#b57be0',
      title: { s: '我和我的家', t: '我和我的家' },
      py: 'wo3 he2 wo3 de5 jia1',
      en: 'Me and My Family (review)',
      note: '的 works like the English "\'s": 妈妈的手机 = Mom\'s phone, and 我的 = my. Put 不 in front of 是 to say "is not": 不是 (bú shì).',
      characters: [
        { s: '我', t: '我', py: 'wo3', en: 'I, me' },
        { s: '你', t: '你', py: 'ni3', en: 'you' },
        { s: '他', t: '他', py: 'ta1', en: 'he, him' },
        { s: '她', t: '她', py: 'ta1', en: 'she, her' },
        { s: '们', t: '們', py: 'men5', en: 'more than one (我们 = we)' },
        { s: '是', t: '是', py: 'shi4', en: 'is, am, are' },
        { s: '不', t: '不', py: 'bu4', en: 'not' },
        { s: '的', t: '的', py: 'de5', en: 'belongs to (like \'s)' },
        { s: '妈', t: '媽', py: 'ma1', en: 'mom' },
        { s: '爸', t: '爸', py: 'ba4', en: 'dad' },
        { s: '哥', t: '哥', py: 'ge1', en: 'older brother' },
        { s: '姐', t: '姐', py: 'jie3', en: 'older sister' },
        { s: '弟', t: '弟', py: 'di4', en: 'little brother' },
        { s: '妹', t: '妹', py: 'mei4', en: 'little sister' },
        { s: '奶', t: '奶', py: 'nai3', en: 'grandma' },
        { s: '爷', t: '爺', py: 'ye2', en: 'grandpa' },
        { s: '猫', t: '貓', py: 'mao1', en: 'cat' },
        { s: '狗', t: '狗', py: 'gou3', en: 'dog' },
        { s: '手', t: '手', py: 'shou3', en: 'hand' },
        { s: '机', t: '機', py: 'ji1', en: 'machine' },
        { s: '电', t: '電', py: 'dian4', en: 'electric' },
        { s: '脑', t: '腦', py: 'nao3', en: 'brain' }
      ],
      words: [
        { s: '我们', t: '我們', py: 'wo3 men5', en: 'we, us' },
        { s: '你们', t: '你們', py: 'ni3 men5', en: 'you (more than one)' },
        { s: '他们', t: '他們', py: 'ta1 men5', en: 'they (boys or mixed)' },
        { s: '她们', t: '她們', py: 'ta1 men5', en: 'they (girls)' },
        { s: '不是', t: '不是', py: 'bu2 shi4', en: 'is not' },
        { s: '我的', t: '我的', py: 'wo3 de5', en: 'my' },
        { s: '妈妈', t: '媽媽', py: 'ma1 ma5', en: 'mom' },
        { s: '爸爸', t: '爸爸', py: 'ba4 ba5', en: 'dad' },
        { s: '哥哥', t: '哥哥', py: 'ge1 ge5', en: 'older brother' },
        { s: '姐姐', t: '姐姐', py: 'jie3 jie5', en: 'older sister' },
        { s: '弟弟', t: '弟弟', py: 'di4 di5', en: 'little brother' },
        { s: '妹妹', t: '妹妹', py: 'mei4 mei5', en: 'little sister' },
        { s: '奶奶', t: '奶奶', py: 'nai3 nai5', en: 'grandma' },
        { s: '爷爷', t: '爺爺', py: 'ye2 ye5', en: 'grandpa' },
        { s: '手机', t: '手機', py: 'shou3 ji1', en: 'cell phone' },
        { s: '电脑', t: '電腦', py: 'dian4 nao3', en: 'computer' }
      ]
    },
    {
      id: 'l1',
      number: 1,
      sticker: '🐼',          // sticker she earns for this lesson
      accent: '#4fd1c5',      // the lesson's color (Normal style)
      accentElena: '#e85a94', // ... and in Elena style
      title: { s: '在中文学校', t: '在中文學校' },
      py: 'zai4 zhong1 wen2 xue2 xiao4',
      en: 'At a Chinese School',
      characters: [
        { s: '在', t: '在', py: 'zai4', en: 'at, in' },
        { s: '教', t: '教', py: 'jiao1', en: 'to teach' },
        { s: '汉', t: '漢', py: 'han4', en: 'Chinese (Han)' },
        { s: '语', t: '語', py: 'yu3', en: 'language' },
        { s: '写', t: '寫', py: 'xie3', en: 'to write' },
        { s: '字', t: '字', py: 'zi4', en: 'character' },
        { s: '读', t: '讀', py: 'du2', en: 'to read' },
        { s: '歌', t: '歌', py: 'ge1', en: 'song' },
        { s: '画', t: '畫', py: 'hua4', en: 'to draw' },
        { s: '喜', t: '喜', py: 'xi3', en: 'to like' },
        { s: '欢', t: '歡', py: 'huan1', en: 'joyful (喜欢 = to like)' },
        { s: '跑', t: '跑', py: 'pao3', en: 'to run' },
        { s: '跳', t: '跳', py: 'tiao4', en: 'to jump' },
        { s: '笑', t: '笑', py: 'xiao4', en: 'to laugh, to smile' },
        { s: '以', t: '以', py: 'yi3', en: 'by means of (以后 = later)' },
        { s: '本', t: '本', py: 'ben3', en: 'root, origin (本领 = skill)' },
        { s: '领', t: '領', py: 'ling3', en: 'to lead (本领 = skill)' }
      ],
      words: [
        { s: '在家', t: '在家', py: 'zai4 jia1', en: 'at home' },
        { s: '在学校', t: '在學校', py: 'zai4 xue2 xiao4', en: 'at school' },
        { s: '中文', t: '中文', py: 'zhong1 wen2', en: 'Chinese (language)' },
        { s: '汉语', t: '漢語', py: 'han4 yu3', en: 'Chinese language' },
        { s: '汉字', t: '漢字', py: 'han4 zi4', en: 'Chinese characters' },
        { s: '写字', t: '寫字', py: 'xie3 zi4', en: 'to write characters' },
        { s: '画画儿', t: '畫畫兒', py: 'hua4 huar4', en: 'to draw pictures' },
        { s: '儿歌', t: '兒歌', py: 'er2 ge1', en: 'nursery rhyme' },
        { s: '喜欢', t: '喜歡', py: 'xi3 huan5', en: 'to like' },
        { s: '长大', t: '長大', py: 'zhang3 da4', en: 'to grow up' },
        { s: '以后', t: '以後', py: 'yi3 hou4', en: 'later, after' },
        { s: '本领', t: '本領', py: 'ben3 ling3', en: 'skill, ability' }
      ]
    },
    {
      id: 'l2',
      number: 2,
      sticker: '✏️',
      accent: '#f2b632',
      accentElena: '#8a6fe0',
      title: { s: '教室里', t: '教室裡' },
      py: 'jiao4 shi4 li3',
      en: 'In the Classroom',
      note: 'Add 吗 at the end of a sentence to ask a yes/no question: 这是你的书吗？ = Is this your book? Say 不是 to answer "no".',
      characters: [
        { s: '教', t: '教', py: 'jiao4', en: 'teaching (教室 = classroom)' },
        { s: '室', t: '室', py: 'shi4', en: 'room' },
        { s: '里', t: '裡', py: 'li3', en: 'inside' },
        { s: '书', t: '書', py: 'shu1', en: 'book' },
        { s: '吗', t: '嗎', py: 'ma5', en: 'question word (ends a yes/no question)' },
        { s: '不', t: '不', py: 'bu4', en: 'not' },
        { s: '那', t: '那', py: 'na4', en: 'that' },
        { s: '她', t: '她', py: 'ta1', en: 'she, her' },
        { s: '笔', t: '筆', py: 'bi3', en: 'pen, pencil' },
        { s: '本', t: '本', py: 'ben3', en: 'for books (本子 = notebook)' },
        { s: '子', t: '子', py: 'zi3', en: 'small thing (本子 = notebook)' },
        { s: '讲', t: '講', py: 'jiang3', en: 'to speak' },
        { s: '请', t: '請', py: 'qing3', en: 'please' },
        { s: '叫', t: '叫', py: 'jiao4', en: 'to call, to be called' },
        { s: '都', t: '都', py: 'dou1', en: 'all, both' },
        { s: '还', t: '還', py: 'hai2', en: 'also, still' },
        { s: '心', t: '心', py: 'xin1', en: 'heart (放心 = don\'t worry)' }
      ],
      words: [
        { s: '教室', t: '教室', py: 'jiao4 shi4', en: 'classroom' },
        { s: '本子', t: '本子', py: 'ben3 zi5', en: 'notebook' },
        { s: '亲爱', t: '親愛', py: 'qin1 ai4', en: 'dear' },
        { s: '已经', t: '已經', py: 'yi3 jing1', en: 'already' },
        { s: '一定', t: '一定', py: 'yi2 ding4', en: 'for sure, must' },
        { s: '知道', t: '知道', py: 'zhi1 dao5', en: 'to know' },
        { s: '英文', t: '英文', py: 'ying1 wen2', en: 'English (language)' },
        { s: '放心', t: '放心', py: 'fang4 xin1', en: 'don\'t worry' }
      ]
    },
    {
      id: 'l3',
      number: 3,
      sticker: '🎒',
      accent: '#ff8a5b',
      accentElena: '#f08a4b',
      title: { s: '放学了', t: '放學了' },
      py: 'fang4 xue2 le5',
      en: 'Class Is Over',
      characters: [
        { s: '放', t: '放', py: 'fang4', en: 'to let go (放学 = class is over)' },
        { s: '今', t: '今', py: 'jin1', en: 'today' },
        { s: '星', t: '星', py: 'xing1', en: 'star' },
        { s: '期', t: '期', py: 'qi1', en: 'period (星期 = week)' },
        { s: '告', t: '告', py: 'gao4', en: 'to tell' },
        { s: '诉', t: '訴', py: 'su4', en: 'to tell (告诉 = to tell someone)' },
        { s: '午', t: '午', py: 'wu3', en: 'noon' },
        { s: '朋', t: '朋', py: 'peng2', en: 'friend' },
        { s: '友', t: '友', py: 'you3', en: 'friend' },
        { s: '问', t: '問', py: 'wen4', en: 'to ask' },
        { s: '谁', t: '誰', py: 'shei2', alt: 'shui2', en: 'who' },
        { s: '听', t: '聽', py: 'ting1', en: 'to listen' },
        { s: '心', t: '心', py: 'xin1', en: 'heart (放心 = don\'t worry)' },
        { s: '拿', t: '拿', py: 'na2', en: 'to take, to hold' },
        { s: '先', t: '先', py: 'xian1', en: 'first' },
        { s: '鸡', t: '雞', py: 'ji1', en: 'chicken' },
        { s: '再', t: '再', py: 'zai4', en: 'again, then' },
        { s: '话', t: '話', py: 'hua4', en: 'words, speech' }
      ],
      words: [
        { s: '放学', t: '放學', py: 'fang4 xue2', en: 'class is over' },
        { s: '放心', t: '放心', py: 'fang4 xin1', en: 'don\'t worry' },
        { s: '告诉', t: '告訴', py: 'gao4 su5', en: 'to tell' },
        { s: '今天', t: '今天', py: 'jin1 tian1', en: 'today' },
        { s: '星期一', t: '星期一', py: 'xing1 qi1 yi1', en: 'Monday' },
        { s: '上午', t: '上午', py: 'shang4 wu3', en: 'morning' },
        { s: '中午', t: '中午', py: 'zhong1 wu3', en: 'noon' },
        { s: '下午', t: '下午', py: 'xia4 wu3', en: 'afternoon' },
        { s: '朋友', t: '朋友', py: 'peng2 you5', en: 'friend' },
        { s: '星期', t: '星期', py: 'xing1 qi1', en: 'week' },
        { s: '开心', t: '開心', py: 'kai1 xin1', en: 'happy' },
        { s: '每天', t: '每天', py: 'mei3 tian1', en: 'every day' },
        { s: '听话', t: '聽話', py: 'ting1 hua4', en: 'to obey, to listen well' },
        { s: '画家', t: '畫家', py: 'hua4 jia1', en: 'artist, painter' }
      ]
    }
  ],

  /* WORD LAB: extra words she can discover by combining characters from her book.
     group 'starter' = built only from her book's characters; 'stretch' = adds one or two NEW characters.
     `how` is the little "why it means that" story shown on the word card. */
  lab: {
    title: { s: '词语', t: '詞語' },
    words: [
      { group: 'starter', s: '学生', t: '學生', py: 'xue2 sheng5', en: 'student', how: '学 (study) + 生 (a person growing up) = student!' },
      { group: 'starter', s: '同学', t: '同學', py: 'tong2 xue2', en: 'classmate', how: '同 (same) + 学 (study) = people who study together: classmates!' },
      { group: 'starter', s: '上学', t: '上學', py: 'shang4 xue2', en: 'go to school', how: '上 (go to) + 学 (study) = go to school!' },
      { group: 'starter', s: '小学', t: '小學', py: 'xiao3 xue2', en: 'elementary school', how: '小 (small) + 学 (school) = elementary school.' },
      { group: 'starter', s: '大学', t: '大學', py: 'da4 xue2', en: 'university, college', how: '大 (big) + 学 (school) = university!' },
      { group: 'starter', s: '生日', t: '生日', py: 'sheng1 ri4', en: 'birthday', how: '生 (born) + 日 (day) = birthday!' },
      { group: 'starter', s: '老师', t: '老師', py: 'lao3 shi1', en: 'teacher', how: '老 (wise, experienced) + 师 (master) = teacher.' },
      { group: 'starter', s: '开心', t: '開心', py: 'kai1 xin1', en: 'happy', how: '开 (open) + 心 (heart) = an open heart: happy!' },
      { group: 'starter', s: '小心', t: '小心', py: 'xiao3 xin1', en: 'be careful', how: '小 (small) + 心 (heart) = be careful, take care.' },
      { group: 'starter', s: '听写', t: '聽寫', py: 'ting1 xie3', en: 'dictation', how: '听 (listen) + 写 (write) = dictation: listen, then write!' },
      { group: 'starter', s: '星星', t: '星星', py: 'xing1 xing5', en: 'star', how: '星 (star) twice = twinkling stars!' },
      { group: 'starter', s: '好朋友', t: '好朋友', py: 'hao3 peng2 you5', en: 'good friend', how: '好 (good) + 朋友 (friend) = good friend.' },
      { group: 'starter', s: '星期', t: '星期', py: 'xing1 qi1', en: 'week', how: '星 (star) + 期 (period of time) = week. Add 一 to make Monday!' },
      { group: 'stretch', s: '学习', t: '學習', py: 'xue2 xi2', en: 'to study, to learn', how: '学 (study) + 习 (practice) = to study and practice!' },
      { group: 'stretch', s: '先生', t: '先生', py: 'xian1 sheng5', en: 'Mr., sir', how: '先 (first) + 生 (born) = "born first": Mr., sir.' },
      { group: 'stretch', s: '生活', t: '生活', py: 'sheng1 huo2', en: 'life, daily life', how: '生 (life) + 活 (alive) = life, daily life.' },
      { group: 'stretch', s: '医生', t: '醫生', py: 'yi1 sheng1', en: 'doctor', how: '医 (medicine) + 生 (person) = doctor.' },
      { group: 'stretch', s: '教室', t: '教室', py: 'jiao4 shi4', en: 'classroom', how: '教 (teach) + 室 (room) = classroom.' },
      { group: 'stretch', s: '唱歌', t: '唱歌', py: 'chang4 ge1', en: 'to sing', how: '唱 (sing) + 歌 (song) = to sing a song!' },
      { group: 'stretch', s: '欢迎', t: '歡迎', py: 'huan1 ying2', en: 'welcome', how: '欢 (joyful) + 迎 (greet) = welcome!' },
      { group: 'stretch', s: '名字', t: '名字', py: 'ming2 zi5', en: 'name', how: '名 (name) + 字 (character) = a name!' },
      { group: 'stretch', s: '问题', t: '問題', py: 'wen4 ti2', en: 'question', how: '问 (ask) + 题 (topic) = a question.' },
      { group: 'stretch', s: '现在', t: '現在', py: 'xian4 zai4', en: 'now', how: '现 (appear, now) + 在 (at) = right now.' },
      { group: 'stretch', s: '东西', t: '東西', py: 'dong1 xi5', en: 'thing, stuff', how: '东 (east) + 西 (west) = things! Everything from east to west.' }
    ]
  },


  /* FILL THE BLANK: short phrases. b = [start, length] pairs, each one is a puzzle (write the missing 1-2 characters). */
  fill: [
    { s: '他是我的哥哥', t: '他是我的哥哥', py: 'ta1 shi4 wo3 de5 ge1 ge5', en: 'He is my older brother.', b: [[0, 1], [1, 1], [3, 1], [4, 2]] },
    { s: '她是我的姐姐', t: '她是我的姐姐', py: 'ta1 shi4 wo3 de5 jie3 jie5', en: 'She is my older sister.', b: [[0, 1], [2, 1], [4, 2]] },
    { s: '你是我的弟弟', t: '你是我的弟弟', py: 'ni3 shi4 wo3 de5 di4 di5', en: 'You are my little brother.', b: [[0, 1], [4, 2]] },
    { s: '她们是我的妹妹', t: '她們是我的妹妹', py: 'ta1 men5 shi4 wo3 de5 mei4 mei5', en: 'They are my little sisters.', b: [[0, 2], [5, 2]] },
    { s: '我们不是猫', t: '我們不是貓', py: 'wo3 men5 bu2 shi4 mao1', en: 'We are not cats.', b: [[0, 2], [2, 2], [4, 1]] },
    { s: '我不是猫', t: '我不是貓', py: 'wo3 bu2 shi4 mao1', en: 'I am not a cat.', b: [[1, 2], [3, 1]] },
    { s: '他不是我的爸爸', t: '他不是我的爸爸', py: 'ta1 bu2 shi4 wo3 de5 ba4 ba5', en: 'He is not my dad.', b: [[0, 1], [1, 2], [5, 2]] },
    { s: '我的爸爸不是爷爷', t: '我的爸爸不是爺爺', py: 'wo3 de5 ba4 ba5 bu2 shi4 ye2 ye5', en: 'My dad is not grandpa.', b: [[1, 1], [2, 2], [6, 2]] },
    { s: '奶奶是妈妈的妈妈', t: '奶奶是媽媽的媽媽', py: 'nai3 nai5 shi4 ma1 ma5 de5 ma1 ma5', en: 'Grandma is mom\'s mom.', b: [[0, 2], [5, 1]] },
    { s: '我的手机', t: '我的手機', py: 'wo3 de5 shou3 ji1', en: 'my phone', b: [[1, 1], [2, 2]] },
    { s: '你的电脑', t: '你的電腦', py: 'ni3 de5 dian4 nao3', en: 'your computer', b: [[0, 1], [2, 2]] },
    { s: '妈妈的手机', t: '媽媽的手機', py: 'ma1 ma5 de5 shou3 ji1', en: 'Mom\'s phone', b: [[0, 2], [2, 1]] },
    { s: '爸爸的电脑', t: '爸爸的電腦', py: 'ba4 ba5 de5 dian4 nao3', en: 'Dad\'s computer', b: [[0, 2], [3, 2]] },
    { s: '奶奶的猫', t: '奶奶的貓', py: 'nai3 nai5 de5 mao1', en: 'Grandma\'s cat', b: [[3, 1]] },
    { s: '爷爷的狗', t: '爺爺的狗', py: 'ye2 ye5 de5 gou3', en: 'Grandpa\'s dog', b: [[0, 2], [3, 1]] },
    { s: '这是你的书吗', t: '這是你的書嗎', py: 'zhe4 shi4 ni3 de5 shu1 ma5', en: 'Is this your book?', b: [[4, 1], [5, 1]] },
    { s: '那是她的笔', t: '那是她的筆', py: 'na4 shi4 ta1 de5 bi3', en: 'That is her pen.', b: [[0, 1], [4, 1]] },
    { s: '我在家里讲中文', t: '我在家裡講中文', py: 'wo3 zai4 jia1 li3 jiang3 zhong1 wen2', en: 'I speak Chinese at home.', b: [[3, 2], [5, 2]] },
    { s: '我的老师在教室里', t: '我的老師在教室裡', py: 'wo3 de5 lao3 shi1 zai4 jiao4 shi4 li3', en: 'My teacher is in the classroom.', b: [[5, 2], [7, 1]] }
  ],

  /* PICTURE WORDS: a picture + English, she writes the word. */
  pics: [
    { s: '我', t: '我', py: 'wo3', en: 'I, me', e: '🙋' },
    { s: '你', t: '你', py: 'ni3', en: 'you', e: '👉' },
    { s: '他', t: '他', py: 'ta1', en: 'he', e: '👦' },
    { s: '她', t: '她', py: 'ta1', en: 'she', e: '👧' },
    { s: '妈妈', t: '媽媽', py: 'ma1 ma5', en: 'mom', e: '👩' },
    { s: '爸爸', t: '爸爸', py: 'ba4 ba5', en: 'dad', e: '👨' },
    { s: '奶奶', t: '奶奶', py: 'nai3 nai5', en: 'grandma', e: '👵' },
    { s: '爷爷', t: '爺爺', py: 'ye2 ye5', en: 'grandpa', e: '👴' },
    { s: '猫', t: '貓', py: 'mao1', en: 'cat', e: '🐱' },
    { s: '狗', t: '狗', py: 'gou3', en: 'dog', e: '🐶' },
    { s: '手', t: '手', py: 'shou3', en: 'hand', e: '✋' },
    { s: '手机', t: '手機', py: 'shou3 ji1', en: 'cell phone', e: '📱' },
    { s: '电脑', t: '電腦', py: 'dian4 nao3', en: 'computer', e: '💻' },
    { s: '书', t: '書', py: 'shu1', en: 'book', e: '📖' },
    { s: '笔', t: '筆', py: 'bi3', en: 'pen', e: '🖊️' },
    { s: '本子', t: '本子', py: 'ben3 zi5', en: 'notebook', e: '📓' },
    { s: '教室', t: '教室', py: 'jiao4 shi4', en: 'classroom', e: '🏫' }
  ],

  /* STORIES: readings from her textbook, each with 3 sets of 4 English multiple-choice questions (o[0] is always the correct answer in the data; the app shuffles). The app hands out the sets in rotation. */
  stories: [
  {
    "id": "s1",
    "lesson": "l1",
    "icon": "🏫",
    "en": "I study at a Chinese school",
    "title": {
      "s": "我在中文学校学习",
      "t": "我在中文學校學習",
      "py": "wǒ zài zhōng wén xué xiào xué xí"
    },
    "lines": [
      {
        "s": "我在中文学校学习。",
        "t": "我在中文學校學習。",
        "py": "wǒ zài zhōng wén xué xiào xué xí."
      },
      {
        "s": "老师教我们说汉语，写汉字，读儿歌，画画儿。",
        "t": "老師教我們說漢語，寫漢字，讀兒歌，畫畫兒。",
        "py": "lǎo shī jiāo wǒ men shuō hàn yǔ, xiě hàn zì, dú ér gē, huà huàr."
      },
      {
        "s": "我喜欢学中文。",
        "t": "我喜歡學中文。",
        "py": "wǒ xǐ huan xué zhōng wén."
      }
    ],
    "sets": [
      [
        {
          "q": "Where does the writer study?",
          "o": [
            "At a Chinese school",
            "At home",
            "In the garden"
          ],
          "a": 0
        },
        {
          "q": "Which of these does the teacher NOT teach in the story?",
          "o": [
            "Playing soccer",
            "Writing characters",
            "Reading nursery rhymes"
          ],
          "a": 0
        },
        {
          "q": "How does the writer feel about learning Chinese?",
          "o": [
            "Likes it",
            "Is afraid of it",
            "Thinks it is boring"
          ],
          "a": 0
        },
        {
          "q": "Which sentence tells you the writer is happy about Chinese?",
          "o": [
            "我喜欢学中文。",
            "我在中文学校学习。",
            "老师教我们写汉字。"
          ],
          "a": 0
        }
      ],
      [
        {
          "q": "Who teaches the writer?",
          "o": [
            "The teacher",
            "Mom",
            "A classmate"
          ],
          "a": 0
        },
        {
          "q": "The teacher teaches speaking, writing and reading. What do you think 画画儿 means?",
          "o": [
            "To draw pictures",
            "To sing songs",
            "To run outside"
          ],
          "a": 0
        },
        {
          "q": "How many things does the teacher teach in the list (说, 写, 读, 画)?",
          "o": [
            "Four",
            "Two",
            "Six"
          ],
          "a": 0
        },
        {
          "q": "Which sentence is true?",
          "o": [
            "The writer studies Chinese at school.",
            "The writer studies Chinese at the park.",
            "The writer does not like Chinese."
          ],
          "a": 0
        }
      ],
      [
        {
          "q": "What is the story mostly about?",
          "o": [
            "A child who enjoys learning Chinese at school",
            "A child who is lost",
            "A child who is sick at home"
          ],
          "a": 0
        },
        {
          "q": "What do the students write?",
          "o": [
            "Chinese characters",
            "Letters to Mom",
            "Songs"
          ],
          "a": 0
        },
        {
          "q": "What do the students do with 儿歌 (nursery rhymes)?",
          "o": [
            "They read them",
            "They draw them",
            "They eat them"
          ],
          "a": 0
        },
        {
          "q": "If someone asked the writer, \"Do you like Chinese class?\", what would the writer most likely say?",
          "o": [
            "Yes, I like it!",
            "No, I hate it.",
            "I don't know what Chinese is."
          ],
          "a": 0
        }
      ]
    ]
  },
  {
    "id": "s2",
    "lesson": "l1",
    "icon": "🎵",
    "en": "What a Great Chinese School (poem)",
    "title": {
      "s": "中文学校真是好",
      "t": "中文學校真是好",
      "py": "zhōng wén xué xiào zhēn shì hǎo"
    },
    "lines": [
      {
        "s": "中文学校真是好，",
        "t": "中文學校真是好，",
        "py": "zhōng wén xué xiào zhēn shì hǎo,"
      },
      {
        "s": "小朋友们可不少。",
        "t": "小朋友們可不少。",
        "py": "xiǎo péng you men kě bù shǎo."
      },
      {
        "s": "一起跑来一起跳，",
        "t": "一起跑來一起跳，",
        "py": "yì qǐ pǎo lái yì qǐ tiào,"
      },
      {
        "s": "一起唱来一起笑。",
        "t": "一起唱來一起笑。",
        "py": "yì qǐ chàng lái yì qǐ xiào."
      },
      {
        "s": "又学写字又画画儿，",
        "t": "又學寫字又畫畫兒，",
        "py": "yòu xué xiě zì yòu huà huàr,"
      },
      {
        "s": "长大以后本领高。",
        "t": "長大以後本領高。",
        "py": "zhǎng dà yǐ hòu běn lǐng gāo."
      }
    ],
    "sets": [
      [
        {
          "q": "What does the poem say about the Chinese school?",
          "o": [
            "It is really good",
            "It is far away",
            "It is too hard"
          ],
          "a": 0
        },
        {
          "q": "Which of these is NOT in the poem?",
          "o": [
            "Swimming",
            "Running",
            "Jumping"
          ],
          "a": 0
        },
        {
          "q": "The poem says 小朋友们可不少. What does that tell you?",
          "o": [
            "There are many children",
            "There are very few children",
            "The children are asleep"
          ],
          "a": 0
        },
        {
          "q": "What will happen after the children grow up?",
          "o": [
            "They will have great skills",
            "They will forget everything",
            "They will stop learning"
          ],
          "a": 0
        }
      ],
      [
        {
          "q": "Who is the poem about?",
          "o": [
            "Children",
            "Teachers only",
            "Animals"
          ],
          "a": 0
        },
        {
          "q": "In 一起跑来一起跳, what does 一起 mean?",
          "o": [
            "Together",
            "Alone",
            "Slowly"
          ],
          "a": 0
        },
        {
          "q": "Which two things do the children learn to do?",
          "o": [
            "Write characters and draw",
            "Cook and swim",
            "Sleep and sit"
          ],
          "a": 0
        },
        {
          "q": "Why does the poem say their skills will be high when they grow up?",
          "o": [
            "Because they learn many things now",
            "Because they sleep a lot",
            "Because they are tall"
          ],
          "a": 0
        }
      ],
      [
        {
          "q": "Which word in the poem means \"to laugh\"?",
          "o": [
            "笑",
            "跳",
            "唱"
          ],
          "a": 0
        },
        {
          "q": "Which word in the poem means \"to jump\"?",
          "o": [
            "跳",
            "跑",
            "笑"
          ],
          "a": 0
        },
        {
          "q": "How does the writer feel about the school?",
          "o": [
            "Happy and proud",
            "Sad",
            "Angry"
          ],
          "a": 0
        },
        {
          "q": "The poem lists: run, jump, sing, laugh. What comes right after \"jump\"?",
          "o": [
            "Sing",
            "Run",
            "Laugh"
          ],
          "a": 0
        }
      ]
    ]
  },
  {
    "id": "s3",
    "lesson": "l2",
    "icon": "💌",
    "en": "I Have Grown Up (a letter)",
    "title": {
      "s": "我长大了",
      "t": "我長大了",
      "py": "wǒ zhǎng dà le"
    },
    "lines": [
      {
        "s": "亲爱的爸爸、妈妈：",
        "t": "親愛的爸爸、媽媽：",
        "py": "qīn ài de bà ba, mā ma:"
      },
      {
        "s": "请不要叫我小娃娃，我已经上学了。",
        "t": "請不要叫我小娃娃，我已經上學了。",
        "py": "qǐng bú yào jiào wǒ xiǎo wá wa, wǒ yǐ jīng shàng xué le."
      },
      {
        "s": "以前，书呀、笔呀和本子我都乱丢，",
        "t": "以前，書呀、筆呀和本子我都亂丟，",
        "py": "yǐ qián, shū ya, bǐ ya hé běn zi wǒ dōu luàn diū,"
      },
      {
        "s": "现在我一定要好好爱护它们。",
        "t": "現在我一定要好好愛護它們。",
        "py": "xiàn zài wǒ yí dìng yào hǎo hǎo ài hù tā men."
      },
      {
        "s": "以前，我只知道要学好英文，",
        "t": "以前，我只知道要學好英文，",
        "py": "yǐ qián, wǒ zhǐ zhī dào yào xué hǎo yīng wén,"
      },
      {
        "s": "现在，我知道还要学好中文。",
        "t": "現在，我知道還要學好中文。",
        "py": "xiàn zài, wǒ zhī dào hái yào xué hǎo zhōng wén."
      },
      {
        "s": "我真的已经长大了，",
        "t": "我真的已經長大了，",
        "py": "wǒ zhēn de yǐ jīng zhǎng dà le,"
      },
      {
        "s": "请你们放心吧！",
        "t": "請你們放心吧！",
        "py": "qǐng nǐ men fàng xīn ba!"
      },
      {
        "s": "你们的儿子 明明",
        "t": "你們的兒子 明明",
        "py": "nǐ men de ér zi míng ming"
      }
    ],
    "sets": [
      [
        {
          "q": "Who wrote this letter?",
          "o": [
            "Mingming, a boy",
            "The teacher",
            "Mom"
          ],
          "a": 0
        },
        {
          "q": "Who is the letter to?",
          "o": [
            "His parents",
            "His teacher",
            "His friend"
          ],
          "a": 0
        },
        {
          "q": "What does Mingming ask his parents to stop doing?",
          "o": [
            "Calling him a little baby",
            "Making him do homework",
            "Driving him to school"
          ],
          "a": 0
        },
        {
          "q": "What does Mingming promise about his books, pens and notebooks?",
          "o": [
            "To take good care of them",
            "To give them away",
            "To hide them"
          ],
          "a": 0
        }
      ],
      [
        {
          "q": "How do you know Mingming is already in school?",
          "o": [
            "He says 我已经上学了",
            "He says he is a baby",
            "He says he has no books"
          ],
          "a": 0
        },
        {
          "q": "What did Mingming do with his things BEFORE?",
          "o": [
            "He was careless with them",
            "He kept them very neat",
            "He sold them"
          ],
          "a": 0
        },
        {
          "q": "Before, Mingming only knew he had to learn ___ well. Now he knows he must learn ___ too.",
          "o": [
            "English; Chinese",
            "Chinese; English",
            "Math; art"
          ],
          "a": 0
        },
        {
          "q": "Which line shows Mingming wants his parents not to worry?",
          "o": [
            "请你们放心吧！",
            "亲爱的爸爸、妈妈",
            "你们的儿子 明明"
          ],
          "a": 0
        }
      ],
      [
        {
          "q": "Why does Mingming say 我真的已经长大了?",
          "o": [
            "He will take care of his things and learn Chinese too",
            "He is taller than his dad",
            "He is old enough to drive"
          ],
          "a": 0
        },
        {
          "q": "What does 亲爱的 at the start of the letter tell you?",
          "o": [
            "It is a warm way to say \"Dear\"",
            "It is a question",
            "It is an angry word"
          ],
          "a": 0
        },
        {
          "q": "What changed between 以前 (before) and 现在 (now)?",
          "o": [
            "Mingming became more responsible",
            "Mingming moved to a new house",
            "Mingming lost his parents"
          ],
          "a": 0
        },
        {
          "q": "Who signs the letter at the end?",
          "o": [
            "Their son, Mingming",
            "The teacher",
            "Their daughter"
          ],
          "a": 0
        }
      ]
    ]
  },
  {
    "id": "s4",
    "lesson": "l3",
    "icon": "🚗",
    "en": "Class Is Over",
    "title": {
      "s": "放学了",
      "t": "放學了",
      "py": "fàng xué le"
    },
    "lines": [
      {
        "s": "今天星期五，放学了，爸爸在车上告诉我：",
        "t": "今天星期五，放學了，爸爸在車上告訴我：",
        "py": "jīn tiān xīng qī wǔ, fàng xué le, bà ba zài chē shang gào su wǒ:"
      },
      {
        "s": "“下午有一个小朋友来我们家。”",
        "t": "“下午有一個小朋友來我們家。”",
        "py": "“xià wǔ yǒu yí ge xiǎo péng you lái wǒ men jiā.”"
      },
      {
        "s": "我问：“他是谁？”爸爸说：“是云云。”",
        "t": "我問：“他是誰？”爸爸說：“是雲雲。”",
        "py": "wǒ wèn: “tā shì shuí?” bà ba shuō: “shì yún yun.”"
      },
      {
        "s": "云云是我的好朋友，我听了，真开心。",
        "t": "雲雲是我的好朋友，我聽了，真開心。",
        "py": "yún yun shì wǒ de hǎo péng you, wǒ tīng le, zhēn kāi xīn."
      }
    ],
    "sets": [
      [
        {
          "q": "What day is it?",
          "o": [
            "Friday",
            "Monday",
            "Sunday"
          ],
          "a": 0
        },
        {
          "q": "Where is Dad when he tells the news?",
          "o": [
            "In the car",
            "At school",
            "In the garden"
          ],
          "a": 0
        },
        {
          "q": "Who is coming to the house?",
          "o": [
            "Yunyun, a good friend",
            "The teacher",
            "Grandma"
          ],
          "a": 0
        },
        {
          "q": "How does the child feel at the end?",
          "o": [
            "Happy",
            "Sad",
            "Sleepy"
          ],
          "a": 0
        }
      ],
      [
        {
          "q": "When is the friend coming?",
          "o": [
            "This afternoon",
            "Tomorrow morning",
            "Next week"
          ],
          "a": 0
        },
        {
          "q": "What does the child ask Dad?",
          "o": [
            "Who is it?",
            "Where is the car?",
            "What day is it?"
          ],
          "a": 0
        },
        {
          "q": "What does 放学了 mean?",
          "o": [
            "School is over",
            "School is starting",
            "Time to sleep"
          ],
          "a": 0
        },
        {
          "q": "Why is the child happy?",
          "o": [
            "Because the visitor is a good friend",
            "Because there is no school tomorrow",
            "Because Dad bought a car"
          ],
          "a": 0
        }
      ],
      [
        {
          "q": "Who picks the child up after school?",
          "o": [
            "Dad",
            "Mom",
            "The teacher"
          ],
          "a": 0
        },
        {
          "q": "Which word in the story means \"afternoon\"?",
          "o": [
            "下午",
            "今天",
            "星期"
          ],
          "a": 0
        },
        {
          "q": "What will the two friends probably do this afternoon?",
          "o": [
            "Play together at home",
            "Go to the dentist",
            "Take a test"
          ],
          "a": 0
        },
        {
          "q": "Which sentence shows how the child feels?",
          "o": [
            "真开心。",
            "他是谁？",
            "是云云。"
          ],
          "a": 0
        }
      ]
    ]
  },
  {
    "id": "s5",
    "lesson": "l3",
    "icon": "🎨",
    "en": "Yunyun Is Drawing Pictures",
    "title": {
      "s": "云云画画儿",
      "t": "雲雲畫畫兒",
      "py": "yún yun huà huàr"
    },
    "lines": [
      {
        "s": "云云喜欢画画儿。",
        "t": "雲雲喜歡畫畫兒。",
        "py": "yún yun xǐ huan huà huàr."
      },
      {
        "s": "每天放学回到家，她就拿起笔来学画画儿。",
        "t": "每天放學回到家，她就拿起筆來學畫畫兒。",
        "py": "měi tiān fàng xué huí dào jiā, tā jiù ná qǐ bǐ lái xué huà huàr."
      },
      {
        "s": "她先画一只鸡，再画一只鸭，",
        "t": "她先畫一隻雞，再畫一隻鴨，",
        "py": "tā xiān huà yì zhī jī, zài huà yì zhī yā,"
      },
      {
        "s": "还画了牛、马和几朵花儿。",
        "t": "還畫了牛、馬和幾朵花兒。",
        "py": "hái huà le niú, mǎ hé jǐ duǒ huār."
      },
      {
        "s": "小小画笔真听她的话，",
        "t": "小小畫筆真聽她的話，",
        "py": "xiǎo xiǎo huà bǐ zhēn tīng tā de huà,"
      },
      {
        "s": "云云是个小画家。",
        "t": "雲雲是個小畫家。",
        "py": "yún yun shì ge xiǎo huà jiā."
      }
    ],
    "sets": [
      [
        {
          "q": "What does Yunyun like to do?",
          "o": [
            "Draw pictures",
            "Play soccer",
            "Sing songs"
          ],
          "a": 0
        },
        {
          "q": "When does Yunyun draw?",
          "o": [
            "Every day after school, at home",
            "Only on weekends",
            "Only at school"
          ],
          "a": 0
        },
        {
          "q": "What does Yunyun draw first?",
          "o": [
            "A chicken",
            "A flower",
            "A car"
          ],
          "a": 0
        },
        {
          "q": "What is Yunyun called at the end of the story?",
          "o": [
            "A little artist",
            "A little teacher",
            "A little singer"
          ],
          "a": 0
        }
      ],
      [
        {
          "q": "Which word tells you she draws every day?",
          "o": [
            "每天",
            "星期",
            "今天"
          ],
          "a": 0
        },
        {
          "q": "What does 先…再… (first… then…) tell you about the drawings?",
          "o": [
            "The order she draws them in",
            "How big they are",
            "How much they cost"
          ],
          "a": 0
        },
        {
          "q": "The story says her brush \"listens\" to her. What does that mean?",
          "o": [
            "It draws just the way she wants",
            "It talks to her",
            "It is broken"
          ],
          "a": 0
        },
        {
          "q": "What does Yunyun do when she gets home?",
          "o": [
            "She picks up a pen and practices drawing",
            "She goes to sleep",
            "She watches TV"
          ],
          "a": 0
        }
      ],
      [
        {
          "q": "What kind of person is Yunyun?",
          "o": [
            "Someone who loves art and practices a lot",
            "Someone who dislikes school",
            "Someone who is always sleepy"
          ],
          "a": 0
        },
        {
          "q": "What is the main idea of the story?",
          "o": [
            "Yunyun draws every day and gets good at it",
            "Yunyun loses her pen",
            "Yunyun is moving away"
          ],
          "a": 0
        },
        {
          "q": "What does 画家 mean?",
          "o": [
            "Artist",
            "Teacher",
            "Doctor"
          ],
          "a": 0
        },
        {
          "q": "Why do you think the story says the brush \"listens\" to her?",
          "o": [
            "Because she draws well",
            "Because the brush is loud",
            "Because she is angry"
          ],
          "a": 0
        }
      ]
    ]
  }
],

  /* SENTENCE BUILDER: sentences from her book's "read aloud" pages, cut into chunks she puts back in order.
     chunks = simplified pieces, tchunks = the same pieces in traditional. py = numeric pinyin for the whole sentence. */
  sentences: [
    { chunks: ['我', '在家', '写字'], tchunks: ['我', '在家', '寫字'], py: 'wo3 zai4 jia1 xie3 zi4', en: 'I write characters at home.' },
    { chunks: ['云云', '在学校', '学汉语'], tchunks: ['雲雲', '在學校', '學漢語'], py: 'yun2 yun2 zai4 xue2 xiao4 xue2 han4 yu3', en: 'Yunyun studies Chinese at school.' },
    { chunks: ['方方', '在花园', '画画儿'], tchunks: ['方方', '在花園', '畫畫兒'], py: 'fang1 fang1 zai4 hua1 yuan2 hua4 huar4', en: 'Fangfang is drawing in the garden.' },
    { chunks: ['老师', '教', '我们', '写汉字'], tchunks: ['老師', '教', '我們', '寫漢字'], py: 'lao3 shi1 jiao1 wo3 men5 xie3 han4 zi4', en: 'The teacher teaches us to write characters.' },
    { chunks: ['妈妈', '教', '我们', '说汉语'], tchunks: ['媽媽', '教', '我們', '說漢語'], py: 'ma1 ma5 jiao1 wo3 men5 shuo1 han4 yu3', en: 'Mom teaches us to speak Chinese.' },
    { chunks: ['奶奶', '教', '我们', '读儿歌'], tchunks: ['奶奶', '教', '我們', '讀兒歌'], py: 'nai3 nai5 jiao1 wo3 men5 du2 er2 ge1', en: 'Grandma teaches us to read nursery rhymes.' },
    { chunks: ['我', '喜欢', '学', '中文'], tchunks: ['我', '喜歡', '學', '中文'], py: 'wo3 xi3 huan5 xue2 zhong1 wen2', en: 'I like to study Chinese.' },
    { chunks: ['冬冬', '是', '我的', '好朋友'], tchunks: ['冬冬', '是', '我的', '好朋友'], py: 'dong1 dong1 shi4 wo3 de5 hao3 peng2 you5', en: 'Dongdong is my good friend.' },
    { chunks: ['上午', '我', '去', '学校'], tchunks: ['上午', '我', '去', '學校'], py: 'shang4 wu3 wo3 qu4 xue2 xiao4', en: 'In the morning I go to school.' },
    { chunks: ['天上', '的', '星星', '真', '好看'], tchunks: ['天上', '的', '星星', '真', '好看'], py: 'tian1 shang4 de5 xing1 xing5 zhen1 hao3 kan4', en: 'The stars in the sky are so pretty.' },
    { chunks: ['我', '有', '两个', '好朋友'], tchunks: ['我', '有', '兩個', '好朋友'], py: 'wo3 you3 liang3 ge4 hao3 peng2 you5', en: 'I have two good friends.' },
    { chunks: ['他', '是', '我的', '哥哥'], tchunks: ['他', '是', '我的', '哥哥'], py: 'ta1 shi4 wo3 de5 ge1 ge5', en: 'He is my older brother.' },
    { chunks: ['她', '是', '我的', '姐姐'], tchunks: ['她', '是', '我的', '姐姐'], py: 'ta1 shi4 wo3 de5 jie3 jie5', en: 'She is my older sister.' },
    { chunks: ['我们', '不是', '猫'], tchunks: ['我們', '不是', '貓'], py: 'wo3 men5 bu2 shi4 mao1', en: 'We are not cats.' },
    { chunks: ['奶奶', '是', '妈妈的', '妈妈'], tchunks: ['奶奶', '是', '媽媽的', '媽媽'], py: 'nai3 nai5 shi4 ma1 ma5 de5 ma1 ma5', en: 'Grandma is mom\'s mom.' },
    { chunks: ['我的', '爸爸', '不是', '爷爷'], tchunks: ['我的', '爸爸', '不是', '爺爺'], py: 'wo3 de5 ba4 ba5 bu2 shi4 ye2 ye5', en: 'My dad is not grandpa.' },
    { chunks: ['今天', '星期', '五'], tchunks: ['今天', '星期', '五'], py: 'jin1 tian1 xing1 qi1 wu3', en: 'Today is Friday.' },
    { chunks: ['这是', '你的', '书', '吗'], tchunks: ['這是', '你的', '書', '嗎'], py: 'zhe4 shi4 ni3 de5 shu1 ma5', en: 'Is this your book?' },
    { chunks: ['我', '在家里', '讲', '中文'], tchunks: ['我', '在家裡', '講', '中文'], py: 'wo3 zai4 jia1 li3 jiang3 zhong1 wen2', en: 'I speak Chinese at home.' },
    { chunks: ['我的', '老师', '在', '教室里'], tchunks: ['我的', '老師', '在', '教室裡'], py: 'wo3 de5 lao3 shi1 zai4 jiao4 shi4 li3', en: 'My teacher is in the classroom.' }
  ]
};
