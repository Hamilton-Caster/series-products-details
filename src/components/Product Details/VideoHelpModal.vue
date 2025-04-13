

<template>
  <vue-modality
    ref="myRef" title="Modal" hide-footer
    centered>
    <img src="/portals/0/Images/castergridvideo.webp" alt="Animated Caster Video">
  </vue-modality>
</template>
<script>
 

  export default {
    name: 'video-help-modal',
    props: {
      type: Object
    },

    methods: {},
    created() {

    },
    mounted() {

    },
    components: {
      VueModality
    }
  }
</script>

<style lang="scss">
   @import "../../assets/variables";

</style>
