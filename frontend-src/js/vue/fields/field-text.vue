<template>
    <div class="cms-row cms-row-text">
        <div class="cms-label"><label>{{label}}</label></div>
        <div class="cms-field">
            <input type="text" name="field2" id="field1" class="cms-text" v-model="value" />
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