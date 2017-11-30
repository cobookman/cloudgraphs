<template>
  <div class="editor">
    <h1>CloudGraphs</h1>
    <section>
      <h3>Graph Markup</h3>
      <markup @markupChange="onMarkupChange" class="markup" :markup="this.markup"></markup>
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
        @cardMove="onCardMove"
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
        scale: 0.5,
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
    markup: {
      get() {
        return JSON.stringify(this.archDiagram.products);
      },
      set(value) {
        this.archDiagram.products = JSON.parse(value);
      },
    },
  },

  created() {
    this.archDiagram.products = [
      {
        productAcronym: 'GAE',
        title: 'Hadoop & Spark',
        byline: 'Cloud Dataproc',
        x: 10,
        y: 10,
      }, {
        productAcronym: 'GCE',
        title: 'Frontend Service',
        x: 300,
        y: 10,
      },
    ];
  },

  methods: {
    clearDiagram() {
      this.archDiagram.products = [];
    },
    onMarkupChange(markup) {
      this.markup = markup;
      this.archDiagram.products = JSON.parse(this.markup);
    },
    getProductCardId(card) {
      return `${card.productAcronym}${card.title}|${card.byline}`;
    },
    onCardMove(movedCard) {
      const id = this.getProductCardId(movedCard);
      this.archDiagram.products = this.archDiagram.products.map((card) => {
        if (id === this.getProductCardId(card)) {
          return movedCard.toJSON();
        }
        return card;
      });
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
