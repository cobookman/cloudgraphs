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

      <label for="diagramScale">Scale:</label>
      <input id="diagramScale" type="number" v-model="archDiagram.scale"
        step="0.05" />

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
        scale: 1,
        products: [
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
        ],
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
      console.log('clearing products');
      this.archDiagram.products = [];
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
