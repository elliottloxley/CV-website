<template>
    <div class="avatar-container">
        <img class="avatar-img" :src="require('@/assets/temp.jpg')"/>
    </div>
</template>

<script>
    export default {
        name: "AvatarBanner"
    }
</script>

<style lang="stylus" type="text/stylus" scoped>

    .avatar-container {
        height: 100%;
        width: auto;
    }

    .avatar-img {
        border-radius: 50%;
        border: solid 3px grey;
    }
</style>