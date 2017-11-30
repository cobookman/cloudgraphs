<template>
  <div class="markup">
    <h3>Markup</h3>
    <textarea v-model="archMarkup" class="editor"></textarea>
  </div>
</template>

<script>
export default {
  name: 'Markup',
  data() {
    return {
      archMarkup: JSON.stringify([
        {
          product: 'GAE',
          title: 'Hadoop & Spark',
          byline: 'Cloud Dataproc',
          x: 10,
          y: 10,
        }, {
          product: 'GCE',
          title: 'Frontend Service',
          x: 600,
          y: 10,
        },
      ]),
    };
  },
  watch: {
    archMarkup() {
      this.$emit('archChange', this.archMarkup);
    },
  },
  created() {
    this.$emit('archChange', this.archMarkup);
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
