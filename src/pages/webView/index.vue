<template>
    <div class="main">
        <web-view :src="src"></web-view>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        src: ''
      }
    },
    onLoad (e) {
      this.src = decodeURIComponent(e.src)
    }
  }
</script>