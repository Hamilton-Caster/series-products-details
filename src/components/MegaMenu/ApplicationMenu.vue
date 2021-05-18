<template>
  <transition name="fade" mode="out-in">
    <ul class="applications-list">
      <li
        v-for="item in linkList"
        :key="item.name">
        <a :href="item.href">{{ item.name }}</a>
      </li>
    </ul>
  </transition>
</template>

<script>
export default {
  name: 'application-menu',
  props: {
    linkList: {
      type: Array
    }
  },
  data () {
    return {}
  },
  methods: {},
  created () {

  },
  mounted () {

  }
}
</script>

<style lang="scss">
.series-menu-wrap {
  ul {
    &.applications-list {
      display: block;
      margin-left: 1rem;
      margin-top: 1rem;
      width: auto;

      > li {
        > a {
          display: block;
          font-size: 1.25rem;
          padding: 1rem 2rem;
        }

        &:hover {
          > a {
            background-color: #eaeaea;
            text-decoration: none;
          }
        }
      }
    }
  }
}
</style>
