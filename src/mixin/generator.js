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
          quiz.ayah_text = curAyah.text;
          quiz.word_to_translate = word.uthmani;
          quiz.answer = word.translation;
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
  },
};
