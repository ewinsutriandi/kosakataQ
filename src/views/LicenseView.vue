<template>
  <div class="container text-view">
    <header class="main-header">
      <h1>kosakataQ</h1>
      <p class="subtitle">Bermain dan belajar arti kata ayat-ayat al Qur'an</p>
    </header>

    <div class="card text-card">
      <h2 class="section-title">MIT License</h2>
      <div class="copyright">Copyright © 2023 Alza Interactive</div>
      <div class="license-text">
        <p>
          Permission is hereby granted, free of charge, to any person obtaining
          a copy copy of this software and associated documentation files (the
          "Software"), to deal in the Software without restriction, including
          without limitation the rights to use, copy, modify, merge, publish,
          distribute, sublicense, and/or sell copies of the Software, and to
          permit persons to whom the Software is furnished to do so, subject to
          the following conditions:
        </p>
        <p>
          The above copyright notice and this permission notice shall be
          included in all copies or substantial portions of the Software.
        </p>
        <p>
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
          EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
          IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
          CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
          TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
          SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-view {
  padding-top: var(--spacing-lg);
  padding-bottom: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Header Styles */
.main-header {
  text-align: center;
  margin: 10px 0 30px 0;
}

.main-header h1 {
  font-size: 1.5rem;
  letter-spacing: 1px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 5px;
}

.subtitle {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 5px;
}

.text-card {
  width: 100%;
  max-width: 600px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
}

.copyright {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
}

.license-text p {
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
  font-size: 0.875rem;
  line-height: 1.6;
}
</style>
<script>
export default {
  name: "LicenseView",
  components: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {},
};
</script>
