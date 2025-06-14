<script lang="ts">
  import DepthNPerf from './DepthNPerf.svelte';

  let target = $state() as HTMLElement;
  export function getTargetElement(): HTMLElement {
    return target;
  }

  let subject = $state() as HTMLElement;
  export function getSubjectElement(): HTMLElement {
    return subject;
  }
</script>

<DepthNPerf bind:target bind:subject n={10}></DepthNPerf>
