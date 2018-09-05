<template>
    <div class="cms-row cms-row-text">
        <div class="cms-label"><label>{{label}}</label></div>

        <div class="cms-field">
            <textarea name="field2" class="cms-text" v-model="value"></textarea>
        </div>
    </div>
</template>

<script>
import fieldMixins from '../mixins/field'

export default {

    mixins : [fieldMixins],

    data () {
        return {
            value:'',
        }
    },

    created () {

    },

    mounted () {
        if (this.field.data) {
            this.loadData(this.field.data)
        }
    },

    computed : {
    },

    methods : {
        loadData (data) {
            this.value = data.value;
        },
    }
}
</script>