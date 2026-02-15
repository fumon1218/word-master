export const CONSONANTS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
export const VOWELS = ['ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ'];

// Basic syllables for Stage 2 (Combos)
// Organized by Consonant for easier navigation
export const SYLLABLES_BY_CONSONANT: Record<string, string[]> = {};

CONSONANTS.forEach(c => {
  SYLLABLES_BY_CONSONANT[c] = VOWELS.map(v => {
    // Simple mapping logic or hardcoded for specific unicode composition if needed
    // Using String.fromCharCode for Hangul composition
    // Hangul Syllable = ((Initial * 21) + Medial) * 28 + Final + 0xAC00
    // Initial indices: ㄱ=0, ㄲ=1, ㄴ=2, ㄷ=3, ㄸ=4, ㄹ=5, ㅁ=6, ㅂ=7, ㅃ=8, ㅅ=9, ㅆ=10, ㅇ=11, ㅈ=12, ㅉ=13, ㅊ=14, ㅋ=15, ㅌ=16, ㅍ=17, ㅎ=18
    // Note: Our CONSONANTS array indices don't perfectly map to unicode initial indices (skip double consonants)
    
    const initialMap: Record<string, number> = {
      'ㄱ': 0, 'ㄴ': 2, 'ㄷ': 3, 'ㄹ': 5, 'ㅁ': 6, 'ㅂ': 7, 'ㅅ': 9, 
      'ㅇ': 11, 'ㅈ': 12, 'ㅊ': 14, 'ㅋ': 15, 'ㅌ': 16, 'ㅍ': 17, 'ㅎ': 18
    };
    
    const medialMap: Record<string, number> = {
      'ㅏ': 0, 'ㅑ': 1, 'ㅓ': 2, 'ㅕ': 3, 'ㅗ': 4, 'ㅛ': 5, 'ㅜ': 6, 'ㅠ': 7, 'ㅡ': 18, 'ㅣ': 20
    };

    const initialCode = initialMap[c];
    const medialCode = medialMap[v];
    const finalCode = 0; // No batchim

    if (initialCode !== undefined && medialCode !== undefined) {
      const charCode = 0xAC00 + (initialCode * 21 * 28) + (medialCode * 28) + finalCode;
      return String.fromCharCode(charCode);
    }
    return '';
  }).filter(s => s !== '');
});

export const WORDS_NO_BATCHIM = [
  '가구', '고기', '나비', '누나', '다리', '도구', 
  '마차', '모자', '바지', '부모', '사자', '소수', 
  '아가', '오리', '자두', '주사', '차도', '치즈', 
  '카드', '코피', '타조', '토마토', '파도', '포도', 
  '하루', '허리', '기차', '나무', '머리', '보리'
];

export const FALLBACK_SENTENCES = [
  "하늘이 매우 푸릅니다.",
  "학교에 가서 공부를 해요.",
  "친구와 사이좋게 지내요.",
  "맛있는 밥을 먹습니다.",
  "어머니 사랑해요.",
];
