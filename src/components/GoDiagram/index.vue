<template>
  <div class="d-flex justify-content-between">
    <div ref="palettePanel"
         style="width: 150px;"
         :class="{'d-none': readonly || !palette}" />
    <div class="flex-fill h-100 position-relative">
      <div ref="diagramPanel"
           class="h-100" />
    </div>
  </div>
</template>
<script>
import {
  initDiagram,
  initPalette,
  updateDiagram,
  getDiagramData,
  createZoomSlider
} from './diagram';

import { str2Obj } from '@/utils/index';

export default {
  name: 'GoDiagram',
  props: {
    scale: {
      type: Number,
      default: 1
    },
    modelData: {
      type: Object,
      default: null
    },
    palette: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    modelData: function(val) {
      updateDiagram(this.diagram, str2Obj(val));
    },
    scale(v) {
      this.diagram.scale = v;
    }
  },
  mounted: function() {
    this.diagram = initDiagram(this.$refs.diagramPanel, {
      isReadOnly: this.readonly
    });
    initPalette(this.diagram, this.$refs.palettePanel);
    this.diagram.scale = this.scale;
    updateDiagram(this.diagram, this.modelData);
    createZoomSlider(this.diagram);
  },
  methods: {
    getDiagramData() {
      return getDiagramData(this.diagram);
    }
  }
};
</script>
<style lang="scss">
.zoomSlider {
  position: absolute;
  padding: 0;
  opacity: 0.75;
  z-index: 99;
  width: 125px;
  height: 25px;
  top: 0px;
  left: 0px;
}

.zoomButton {
  display: inline-block;
  vertical-align: top;
  text-align: center;
  padding: 0;
  transition: opacity 0.2s;
}

.zoomRangeContainer {
  display: inline-block;
  vertical-align: top;
  padding: 0;
}

.zoomRangeInput {
  margin: 0;
  padding: 0;
  outline: none;
  transition: opacity 0.2s;
  background: transparent;
  -webkit-appearance: none;
}

/* Set up additional styling to ensure consistenty across browsers */
.zoomRangeInput::-webkit-slider-runnable-track {
  box-sizing: border-box;
  border: none;
  width: 100%;
  height: 3px;
  background: #ccc;
}
.zoomRangeInput::-moz-range-track {
  box-sizing: border-box;
  border: none;
  width: 100%;
  height: 3px;
  background: #ccc;
}
.zoomRangeInput::-ms-track {
  box-sizing: border-box;
  border: none;
  width: 100%;
  height: 3px;
  background: #ccc;
  color: transparent;
}
.zoomRangeInput::-webkit-slider-thumb {
  -webkit-appearance: none;
  margin-top: -3.33px;
  box-sizing: border-box;
  border: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #444;
}
.zoomRangeInput::-moz-range-thumb {
  box-sizing: border-box;
  border: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #444;
}
.zoomRangeInput::-ms-thumb {
  margin-top: 0;
  box-sizing: border-box;
  border: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #444;
}
.zoomRangeInput::-ms-tooltip,
.zoomRangeInput::-ms-fill-lower,
.zoomRangeInput::-ms-fill-upper {
  display: none;
}
</style>
