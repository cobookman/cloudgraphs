<template>
  <div class="editor">
    <h1>CloudGraphs</h1>
    <section>
      <h3>Graph Markup</h3>
      <markup @markupChange="onMarkupChange" class="markup" :markup="this.markup"></markup>
    </section>
    <section>
      <label for="diagramWidth">Width:</label>
      <input id="diagramWidth" type="number" v-model.number="archDiagram.width"
        step="1" min="800" />

      <label for="diagramHeight">Height:</label>
      <input id="diagramHeight" type="number" v-model.number="archDiagram.height"
        step="1" min="600" />

      <label for="diagramScale">Scale:</label>
      <input id="diagramScale" type="number" v-model.number="archDiagram.scale"
        step="0.05" min="0.05" />

      <button v-on:click="clearDiagram">Clear</button>
    </section>
    <section>
      <arch-diagram
        class="diagram"
        :scale="archDiagram.scale"
        :diagramData="archDiagram.diagramData"
        :width="archDiagram.width"
        :height="archDiagram.height"
        @diagramDataChange="onDiagramDataChange"
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
        scale: 1.0,
        width: 800,
        height: 600,
        diagramData: [],
      },
    };
  },
  computed: {
    url: {
      get() {
        return `https://localhost:8080/${this.$route.params.id}`;
      },
    },
    markup: {
      get() {
        return JSON.stringify(this.archDiagram.diagramData);
      },
      set(value) {
        this.archDiagram.diagramData = JSON.parse(value);
      },
    },
  },

  created() {
    // use http hook to fetch diagram data.
    this.archDiagram.diagramData = {
      elms: [
        {
          id: 'a',
          type: 'GcpProductGrouping',
          grouping: 'REGION',
          heading: 'us-east1',
          subhead: 'a',
          x: 30,
          y: 10,
          elms: [
            {
              id: 'b',
              type: 'GcpProductCard',
              product: 'GAE',
              heading: 'Hado3op & Spark',
              subhead: 'Cloud Dataproc',
              x: 10,
              y: 10,
            }, {
              id: 'c',
              type: 'GcpProductCard',
              product: 'GCE',
              heading: 'Frontend Service',
              x: 200,
              y: 100,
            }, {
              id: 'e',
              type: 'GcpProductGrouping',
              grouping: 'ZONE',
              heading: 'us-east1-a',
              x: 200,
              y: 300,
              elms: [{
                id: 'f',
                type: 'GcpProductCard',
                product: 'DATAFLOW',
                heading: 'ETL',
                x: 0,
                y: 0,
              }],
            },
          ],
        },
        {
          id: 'g',
          type: 'GcpProductCard',
          product: 'GAE',
          heading: 'Hado2op & Spark',
          subhead: 'Cloud Dataproc',
          x: 200,
          y: 500,
        },
      ],
      arrows: [
        {
          from: 'a',
          to: 'g',
          arrow: 'ARROW_TO',
          path: 'PRIMARY',
          optional: false,
          midpoint: {
            x: 100,
            y: 150,
          },
        },
      ],
    };
  },

  methods: {
    clearDiagram() {
      this.archDiagram.products = [];
    },
    onMarkupChange(markup) {
      this.markup = markup;
      this.archDiagram.diagramData = JSON.parse(this.markup);
    },
    onDiagramDataChange(newDiagramData) {
      this.archDiagram.diagramData = newDiagramData;
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
