<script lang="ts">
  import { basicSetup } from 'codemirror';
  import { EditorView, keymap } from '@codemirror/view';
  import { Prec } from '@codemirror/state';
  import { python } from '@codemirror/lang-python';
  import { oneDark } from '@codemirror/theme-one-dark';

  let {
    code = $bindable(''),
    onlancer,
  }: {
    code: string;
    onlancer: () => void;
  } = $props();

  let conteneur: HTMLDivElement;

  $effect(() => {
    const vue = new EditorView({
      doc: code,
      parent: conteneur,
      extensions: [
        // Prioritaire sur tout : Ctrl+Entrée lance, même depuis l'éditeur.
        Prec.highest(
          keymap.of([
            {
              key: 'Ctrl-Enter',
              run: () => {
                onlancer();
                return true;
              },
            },
          ]),
        ),
        basicSetup,
        python(),
        oneDark,
        EditorView.updateListener.of((maj) => {
          if (maj.docChanged) code = maj.state.doc.toString();
        }),
      ],
    });
    vue.focus();
    return () => vue.destroy();
  });
</script>

<div class="editeur" bind:this={conteneur}></div>

<style>
  .editeur {
    flex: 1;
    min-height: 0;
    overflow: auto;
    border-radius: 8px;
  }

  .editeur :global(.cm-editor) {
    height: 100%;
    font-size: 1em;
  }
</style>
