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
        { s: '欢', t: '歡', py: 'huan1', en: 'joyful (喜欢 = to like)' }
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
        { s: '喜欢', t: '喜歡', py: 'xi3 huan5', en: 'to like' }
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
        { s: '心', t: '心', py: 'xin1', en: 'heart (放心 = don\'t worry)' }
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
        { s: '朋友', t: '朋友', py: 'peng2 you5', en: 'friend' }
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
    { s: '爷爷的狗', t: '爺爺的狗', py: 'ye2 ye5 de5 gou3', en: 'Grandpa\'s dog', b: [[0, 2], [3, 1]] }
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
    { s: '电脑', t: '電腦', py: 'dian4 nao3', en: 'computer', e: '💻' }
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
    { chunks: ['今天', '星期', '五'], tchunks: ['今天', '星期', '五'], py: 'jin1 tian1 xing1 qi1 wu3', en: 'Today is Friday.' }
  ]
};
