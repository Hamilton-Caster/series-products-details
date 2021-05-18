<template functional>
  <div class="panel-body">
    <div class="col-md-6" v-html="props.CAPTION"></div>
    <div class="col-md-6" v-html="props.VALUE"></div>
  </div>
</template>

<script>

  export default {
    name: "detail-text",
    data: () => ({

    })
  }
</script>

<style scoped lang="scss">

</style>
