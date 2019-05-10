<template>
    <div class="cms-row cms-row-text">
        <div class="cms-label"><label>{{label}}</label></div>
        <div class="cms-field">
            <div class="cms-select-c">
                <select class="cms-select" v-model="value">
                    <option v-for="option in options" :value="option.value">{{option.label}}</option>
                </select>
            </div>
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
            options:[]
        }
    },

    created () {

    },

    mounted () {
        if (this.field.spec && this.field.spec.options) {
            this.options = this.field.spec.options;
            for (let option of this.options) {
                // console.log(option);
                if (option.default) {
                    this.value = option.value;
                }
            }
            if (!this.value) {
                this.value = this.options[0].value;
            }
        }
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