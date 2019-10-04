import jQuery from "jquery";
import Vue from "vue";

Vue.test = 'asd';

const App = {
    run () {
        if (jQuery('#cms').length) {
            let app = new Vue({
                el: '#cms',

                components: {
                },

                methods: {
                    loadJson(jsonString) {

                        if (this.$refs) {
                            let json = JSON.parse(jsonString);
                            this.$refs.form.loadJson(json);
                        }
                    }
                }
            });
        } else {
            console.log ('#cms not found');
        }
    }
};

export default App;