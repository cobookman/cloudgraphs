<template>
  <div class="markup">
    <h3>Markup</h3>
    <textarea
      class="editor"
      v-model="markupMirror">
    </textarea>
  </div>
</template>

<script>
export default {
  name: 'Markup',
  props: ['markup'],
  data() {
    return {
      markupMirror: '',
    };
  },
  watch: {
    markup: {
      immediate: true,
      handler() {
        this.markupMirror = this.markup;
      },
    },
    markupMirror() {
      this.$emit('markupChange', this.markupMirror);
    },
  },
  created() {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .editor {
    width: 100%;
    height: calc(100% - 60px);
    border: 1px solid #888;
    border-radius: 8px;
    border-bottom-right-radius: 0;
    margin: 0;
    padding: 0.25em 0.5em;
    box-sizing: border-box;
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size: 1em;
    line-height: 1.4em;
  }
</style>
