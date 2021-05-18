<template>
  <transition
    name="fade"
    mode="out-in">
    <div class="spinner-box" v-show="showSpinner">
      <div class="circle-border">
        <div class="circle-core"></div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "spinner",
    props: {
      showSpinner: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {}
    },
    methods: {

    },
    created () {

    },
    mounted () {

    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/variables";


  $containerSize: 18.75rem;
  $spinnerColor: $primaryColor;
  $spinnerColor2: rgba($primaryColor, .1);

  // KEYFRAMES

  @keyframes spin {
    from {
      transform: rotate(0);
    }
    to{
      transform: rotate(359deg);
    }
  }

  @keyframes spin3D {
    from {
      transform: rotate3d(.5,.5,.5, 360deg);
    }
    to{
      transform: rotate3d(0,0,0, 0deg);
    }
  }

  @keyframes configure-clockwise {
    0% {
      transform: rotate(0);
    }
    25% {
      transform: rotate(90deg);
    }
    50% {
      transform: rotate(180deg);
    }
    75% {
      transform: rotate(270deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes configure-xclockwise {
    0% {
      transform: rotate(45deg);
    }
    25% {
      transform: rotate(-45deg);
    }
    50% {
      transform: rotate(-135deg);
    }
    75% {
      transform: rotate(-225deg);
    }
    100% {
      transform: rotate(-315deg);
    }
  }

  @keyframes pulse {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: .25;
      transform: scale(.75);
    }
  }

  // Spinner Container

  .spinner-box {
    width: $containerSize;
    height: $containerSize;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    position: absolute;
    left: calc(50% - #{$containerSize / 2});
    top: 9rem;
  }

  // Orbit styling

  .circle-border {
    width: $containerSize / 2;
    height: $containerSize / 2;
    padding: 0.1875rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: $spinnerColor;
    background: linear-gradient(0deg, $spinnerColor2 33%,$spinnerColor 100%);
    animation: spin .8s linear 0s infinite;
  }

  .circle-core {
    width: 100%;
    height: 100%;
    background-color: rgba($lightGreyBg, .8);
    border-radius: 50%;
  }
  .product-finder-modal {
    .circle-core {
      background-color: rgba($darkGreyBg, .8);
    }
  }

</style>
