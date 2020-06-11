<template>
    <div>
        <div class="title">
            {{ title }}
        </div>
        <div class="subtitle">
            {{subtitle}}
        </div>
        <div class="description">
            {{description}}
        </div>
    </div>
</template>

<script>

    export default {
        name: "PageBanner",
        props: {
            title: String,
            subtitle: String,
            description: String
        }
    }
</script>

<style lang="stylus" type="text/stylus" scoped>
    .title {
        font-size: 2rem;
    }

    .subtitle {
        font-size: 1.2rem;
    }

    .description {
        font-size: 1rem;
    }
</style>