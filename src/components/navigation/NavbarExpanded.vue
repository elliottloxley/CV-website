<template>
    <div class="navbar-expand">
        <navbar-expanded-item nav-icon-url="icon.svg" nav-text="web design"/>
        <navbar-expanded-item nav-icon-url="icon.svg" nav-text="Written CV"/>
        <navbar-expanded-item nav-icon-url="icon.svg" nav-text="Art"/>
    </div>
</template>

<script>
    import NavbarExpandedItem from "@/components/navigation/NavbarExpandedItem";

    export default {
        name: "NavbarExpanded",
        components: {
            'navbar-expanded-item': NavbarExpandedItem
        }
    }
</script>

<style lang="stylus" type="text/stylus" scoped>

    .navbar-expand {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
    }
</style>