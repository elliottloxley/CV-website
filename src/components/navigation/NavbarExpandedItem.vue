<template>
    <div class="navbar-item-expand">
        <div class="icon-container">
            <img class="nav-item-icon" :src="require('@/assets/buttonicons/' + navIconUrl + '')" alt="icon"/>
        </div>
        <div class="nav-item-text">{{navText}}</div>
    </div>
</template>

<script>
    export default {
        name: "NavbarExpandedItem",
        props: {
            navIconUrl: String,
            navText: String
        }
    }
</script>

<style lang="stylus" type="text/stylus" scoped>

    .navbar-item-expand {
        display: grid;
        grid-template-rows 2fr 8fr;
        justify-content: center;
    }

    .icon-container {
        width: 100%;
        height: 100%;
    }

    .nav-item-icon {
       width: 2rem;
    }
</style>