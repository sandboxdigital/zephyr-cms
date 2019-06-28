
const mixin = {

    methods : {

        createFields (fields) {
            // console.log('->createFields');

            for (let field of fields) {
                this.createField(field);
            }
        },

        loadFieldsData(data) {
            // console.log('->loadFieldsData');
            for (let fieldData of data) {
                this.loadFieldData(fieldData);
            }
        },

        loadFieldData(data) {
            let key = data.id;
            // console.log('->loadChildData for:' + data.id);
            let comp = this.getFieldComponent(data.id);

            if (comp) {
                comp.loadData(data);
            } else {
                console.warn('CMS component for data field `' + key + '` not found')
            }
        },


        getFieldComponent (key) {
            let comp = this.$refs[key];

            if (comp) {
                return comp[0];
            } else {
                console.warn('CMS component for data field `'+key+'` not found');
                console.log(this.$refs);
            }
            return null;
        },
    }
};

export default mixin;