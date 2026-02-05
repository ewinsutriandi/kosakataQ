export default {
  methods: {
    randomize(arr) {
      arr = arr
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
      return arr;
    },
    generate_quiz_fr_surah(surah_idx) {
      let specialChar2Rmv = [
        "\u{F500}",
        "\u{F501}",
        "\u{F502}",
        "\u{F503}",
        "\u{F504}",
        "\u{F505}",
        "\u{F506}",
        "\u{F61E}",
      ];
      let surah = this.$store.state.surahs[surah_idx];
      let surah_words = this.$store.getters.surah_words(surah_idx);
      // console.time("Generating quiz for" + surah.name);
      let ayahKeys = Object.keys(surah_words);
      let maxAya = surah.nAyah;
      let surahQuizL = [];
      for (let curAidx = 0; curAidx < maxAya; curAidx++) {
        let ayahQuizL = []; // list of quiz by ayah
        let ayahIdx = ayahKeys[curAidx];
        let curAyah = surah_words[ayahIdx];
        let words = curAyah.words;
        for (let wIdx = 0; wIdx < words.length; wIdx++) {
          let word = words[wIdx];
          let quiz = {};
          quiz.surahIdx = surah_idx;
          quiz.ayahIdx = curAidx + 1; // 1-based index within surah
          quiz.surahName = this.$store.state.surahs_translit_id[surah_idx].nama;
          quiz.ayah_text = curAyah.text;
          let the_word = word.uthmani;
          // rmv unneeded special characters
          for (let i = 0; i < specialChar2Rmv.length; i++) {
            let the_c = specialChar2Rmv[i];
            the_word = the_word.replace(the_c, "");
          }
          quiz.word_to_translate = the_word;
          quiz.answer = word.translation;
          quiz.wordIndex = word.index;
          // prepare choices
          quiz.choices = this.generate_quiz_choices(ayahIdx, words, word);
          ayahQuizL.push(quiz);
        }
        surahQuizL.push(ayahQuizL);
      }
      // console.timeEnd("Generating quiz for" + surah.name);
      return surahQuizL;
    },
    generate_quiz_choices(ayahIdx, words, word) {
      let choice_candidates = words.slice();
      // ensure sufficient randomized words as choices
      if (choice_candidates.length < 5) {
        let additional_words = [];
        // add words from next ayah
        if (parseInt(ayahIdx) < 6236) {
          let nextAyahIdx = parseInt(ayahIdx) + 1;
          additional_words = additional_words.concat(
            this.$store.getters.ayah_words(nextAyahIdx)
          );
        }
        // add words from previous ayah
        if (parseInt(ayahIdx) > 1) {
          let nextAyahIdx = parseInt(ayahIdx) - 1;
          additional_words = additional_words.concat(
            this.$store.getters.ayah_words(nextAyahIdx.toString())
          );
        }
        // merge choice candidates from prev/next ayah
        choice_candidates = choice_candidates.concat(additional_words);
      }
      choice_candidates = this.randomize(choice_candidates); // shuffle
      // construct choices
      let choices = [word];
      let cnt = 0; // choice candidate index
      while (choices.length < 3) {
        let word_exist = false;
        // do not use identical word/translation
        for (let i = 0; i < choices.length; i++) {
          let w = choices[i];
          let w_cand = choice_candidates[cnt];
          let identical_text = w.uthmani === w_cand.uthmani;
          let identical_translation = w.translation === w_cand.translation;
          if (identical_text || identical_translation) {
            word_exist = true;
            break;
          }
        }
        if (!word_exist) {
          choices.push(choice_candidates[cnt]);
        }
        cnt++;
      }
      return this.randomize(choices);
    },
    async generate_quiz_fr_tier(tierId) {
      const filters = {
        '100': { min: 101, max: Infinity, label: 'Kata yang muncul > 100x' },
        '50': { min: 51, max: 100, label: 'Kata yang muncul 51-100x' },
        '10': { min: 11, max: 50, label: 'Kata yang muncul 11-50x' },
        '5': { min: 6, max: 10, label: 'Kata yang muncul 6-10x' },
        'rare': { min: 0, max: 5, label: 'Kata yang muncul <= 5x' },
        'all': { min: 0, max: Infinity, label: 'Semua' }
      };

      const filter = filters[tierId] || filters['all'];

      try {
        const response = await fetch('/data/word_frequency.json');
        const allWords = await response.json();

        let filteredWords = allWords.filter(w => w.count >= filter.min && w.count <= filter.max);
        filteredWords = this.randomize(filteredWords);

        // Use all words in the filtered tier for this session
        const sessionWords = filteredWords;

        let tierQuizL = [];
        for (let word of sessionWords) {
          // Select one random occurrence
          const occ = word.occurrences[Math.floor(Math.random() * word.occurrences.length)];

          // Get full ayah info for context
          // We need to calculate GAN for fetching ayah text
          const surahMeta = this.$store.state.surahs[occ.surah];
          const surahName = this.$store.state.surahs_translit_id[occ.surah].nama;
          const gan = surahMeta.start + (occ.ayah - 1);

          const ayahText = this.$store.state.ayah_uthmani[gan];
          const ayahWords = this.$store.getters.ayah_words(gan);
          const targetWord = ayahWords[occ.index - this.$store.state.ayah_word_map[gan].start];

          if (!targetWord) continue;

          let quiz = {};
          quiz.ayah_text = ayahText;
          quiz.word_to_translate = word.text; // Use the word from frequency map
          quiz.wordIndex = occ.index;
          quiz.answer = targetWord.translation;
          quiz.tierLabel = filter.label;
          quiz.surahIdx = occ.surah;
          quiz.surahName = surahName;
          quiz.ayahIdx = occ.ayah;

          // Generate choices using existing logic but adapting to the occurrence context
          quiz.choices = this.generate_quiz_choices_tier(gan, ayahWords, targetWord);
          tierQuizL.push(quiz);
        }

        return tierQuizL;
      } catch (error) {
        console.error("Error generating tier quiz:", error);
        return [];
      }
    },
    async generate_quiz_fr_level(levelId) {
      try {
        const response = await fetch('/data/word_frequency.json');
        const allWords = await response.json();
        const startIdx = (levelId - 1) * 50;
        const endIdx = startIdx + 50;
        const sessionWords = allWords.slice(startIdx, endIdx);

        let levelQuizL = [];
        for (let word of sessionWords) {
          // Select one random occurrence
          const occ = word.occurrences[Math.floor(Math.random() * word.occurrences.length)];

          const surahMeta = this.$store.state.surahs[occ.surah];
          const surahName = this.$store.state.surahs_translit_id[occ.surah].nama;
          const gan = surahMeta.start + (occ.ayah - 1);

          const ayahText = this.$store.state.ayah_uthmani[gan];
          const ayahWords = this.$store.getters.ayah_words(gan);
          const targetWord = ayahWords[occ.index - this.$store.state.ayah_word_map[gan].start];

          if (!targetWord) continue;

          let quiz = {};
          quiz.ayah_text = ayahText;
          quiz.word_to_translate = word.text;
          quiz.wordIndex = occ.index;
          quiz.answer = targetWord.translation;
          quiz.levelLabel = `Level ${levelId}`;
          quiz.surahIdx = occ.surah;
          quiz.surahName = surahName;
          quiz.ayahIdx = occ.ayah;

          quiz.choices = this.generate_quiz_choices(gan, ayahWords, targetWord);
          levelQuizL.push(quiz);
        }

        return this.randomize(levelQuizL);
      } catch (error) {
        console.error("Error generating level quiz:", error);
        return [];
      }
    },
    generate_quiz_choices_tier(gan, words, word) {
      return this.generate_quiz_choices(gan, words, word);
    }
  },
};
