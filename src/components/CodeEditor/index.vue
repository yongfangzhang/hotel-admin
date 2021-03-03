<template>
  <div class="code-editor"> <textarea ref="textarea" /> </div>
</template>

<script>
import CodeMirror from 'codemirror';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/elegant.css'
require('script-loader!jsonlint');
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/lua/lua';
import 'codemirror/addon/lint/lint';
import { obj2Str, str2Obj } from '@/utils/index';
import 'codemirror/addon/lint/json-lint';

export default {
  name: 'CodeEditor',
  /* eslint-disable vue/require-prop-types */
  props: {
    value: { type: [Object, String, Array, Number], default: null },
    code: { type: String, default: 'json' },
    readonly: { type: Boolean, default: false }
  },
  data() {
    return {
      jsonEditor: false,
      availableCode: {
        js: 'application/x-javascript',
        json: 'application/json',
        lua: 'text/x-lua'
      }
    };
  },
  computed: {
    mode() {
      return this.availableCode[this.code];
    },
    isJson() {
      return this.code === 'json';
    }
  },
  watch: {
    value(v, o) {
      const editorValue = this.jsonEditor.getValue();
      const fv = this.format(v);
      if (fv !== editorValue) {
        this.jsonEditor.setValue(fv);
      }
    },
    readonly(v) {
      this.jsonEditor.setOption('readOnly', v);
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    initValue(v) {
      this.jsonEditor.setValue(this.format(v));
    },
    init() {
      if (this.jsonEditor) {
        this.jsonEditor.toTextArea();
      }
      this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
        lineNumbers: false,
        mode: this.mode,
        gutters: ['CodeMirror-lint-markers'],
        //   theme: 'elegant',
        lint: true,
        readOnly: this.readonly
      });

      this.jsonEditor.setValue(this.format(this.value));
      this.jsonEditor.on('change', cm => {
        this.$emit('changed', this.parseValue(cm.getValue()));
        this.$emit('input', this.parseValue(cm.getValue()));
      });
    },
    format(v) {
      const str = obj2Str(v, 2);
      if (str === null) return '';
      return str;
    },
    getValue() {
      return this.parseValue(this.jsonEditor.getValue());
    },
    parseValue(v) {
      if (this.isJson) {
        return str2Obj(v);
      }
      return v;
    }
  }
};
</script>

<style lang="scss" scoped>
.code-editor >>> .CodeMirror {
  height: auto;
  min-height: 100px;
  background: #faf8f5;
}

.code-editor.full-height >>> .CodeMirror {
  height: 100%;
  min-height: 100px;
  background: #faf8f5;
}
.code-editor >>> .CodeMirror-scroll {
  min-height: 100px;
  //   padding-bottom: 0;
}
</style>
