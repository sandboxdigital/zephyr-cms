import {ucword} from "../utils/string";

const mixin = {

    props : {
        'field':Object,
    },

    computed: {
        label() {
            if (this.field.spec.label) {
                return this.field.spec.label;
            } else {
                let label = this.field.id+'';

                label = label.replace(/_/g,' ');
                label = label.replace(/-/g,' ');
                return ucword(label);
            }
        },
    },

    methods : {
        validate () {

        },

        getData () {
            return {
                id:this.field.spec.id,
                type:this.field.spec.type,
                value:this.value
            };
        },

        loadData () {
            /// stub
        }
    },
};

export default mixin;