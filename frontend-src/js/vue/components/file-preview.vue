
<template>
    <div class="file-preview">
        <div class="file-preview-container">
            <button class="btn-round-delete" v-if="hasFile" @click.prevent="deleteFile()"><span class="oi oi-trash"></span></button>
            <div class="no-file" v-if="!hasFile"><span>No file</span></div>
            <div class="image-container" v-else-if="isImage()" :style="{backgroundImage:'url('+value.url+')'}"></div>
            <div class="icon-container" v-else-if="isMovie()"><span class="oi oi-video" title="Movie" aria-hidden="true"></span></div>
            <div class="icon-container" v-else><span class="oi oi-file" title="File" aria-hidden="true"></span></div>
        </div>
        <div class="file-name" v-if="hasFile">{{value.name}}</div>
    </div>
</template>

<script>

    export default {
        props:{
            value : {},
            showDelete : true,
        },

        computed : {
            hasFile () {
                return (this.value && this.value.id !== 0);
            }
        },

        methods : {
            isImage (url) {
                return(this.value.url.match(/\.(jpeg|jpg|gif|png)$/) != null);
            },

            isMovie (url) {
                return(this.value.url.match(/\.(mov)$/) != null);
            },

            deleteFile () {
                this.$emit('delete');
            }
        }

    }
</script>