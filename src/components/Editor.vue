<template>
  <div class="editor">
    <h1>CloudGraphs</h1>
    <section>
      <h3>Graph Markup</h3>
      <markup class="markup"></markup>
    </section>
    <section>
      <label for="diagramWidth">Width:</label>
      <input id="diagramWidth" type="number" v-model="archDiagram.width"/>

      <label for="diagramHeight">Height:</label>
      <input id="diagramHeight" type="number" v-model="archDiagram.height"/>
    </section>
    <section>
      <arch-diagram
        class="diagram"
        :height="archDiagram.height"
        :width="archDiagram.width"
        >
      </arch-diagram>
    </section>
    <section>
      <p> {{ url }}</p>
    </section>
  </div>
</template>

<script>
import Markup from '@/components/Markup';
import ArchDiagram from '@/components/ArchDiagram';

export default {
  name: 'Editor',
  data() {
    return {
      title: 'Create a new cloud graph',
      archDiagram: {
        height: 600,
        width: 800,
      },
    };
  },

  computed: {
    url: {
      get() {
        return `https://localhost:8080/${this.$route.params.id}`;
      },
    },
  },

  beforeMount() {
  },

  beforeDestroy() {
  },

  methods: {
  },

  components: {
    markup: Markup,
    'arch-diagram': ArchDiagram,
  },
};
</script>

<style scoped>
.markup {
  width: 500px;
  height: 300px;
  margin: 0 auto;
}

.diagram {
  margin: 0 auto;
}

section {
  margin-bottom: 10px;
}
h1 {
  font-weight: normal;
}
</style>
