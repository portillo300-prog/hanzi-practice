/*
  CONTENT — the ONLY file you edit to change what she practices.

  Each item:  s = simplified,  t = traditional (same length as s),
              py = pinyin with tone NUMBERS (1-4, 5 = neutral), one syllable per space
                   (e.g. "xi3 huan5" shows as "xǐ huan"; v = ü),
              alt = optional second pinyin spelling shown after a slash,
              en = English meaning.

  After editing, run:  node scripts/build.mjs   (fetches stroke data + refreshes the offline cache)
*/
window.CONTENT = {
  appTitle: { s: '写汉字', t: '寫漢字' },
  lessons: [
    {
      id: 'l1',
      number: 1,
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
  ]
};
