<template>
  <div class="editor">
    <h1>CloudGraphs</h1>
    <section>
      <h3>Graph Markup</h3>
      <markup @archChange="onArchChange" class="markup"></markup>
    </section>
    <section>
      <label for="diagramWidth">Width:</label>
      <input id="diagramWidth" type="number" v-model="archDiagram.width"/>

      <label for="diagramHeight">Height:</label>
      <input id="diagramHeight" type="number" v-model="archDiagram.height"/>

      <label for="diagramScale">Scale:</label>
      <input id="diagramScale" type="number" v-model="archDiagram.scale"
        step="0.05" min="0.05" />

      <button v-on:click="clearDiagram">Clear</button>
    </section>
    <section>
      <arch-diagram
        class="diagram"
        :height="archDiagram.height"
        :width="archDiagram.width"
        :scale="archDiagram.scale"
        :products="archDiagram.products"
        >
      </arch-diagram>
    </section>
    <section>
      <p>{{ url }}</p>
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
        scale: 1,
        products: [],
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
    clearDiagram() {
      this.archDiagram.products = [];
    },
    onArchChange(ev) {
      this.archDiagram.products = JSON.parse(ev);
    },
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
