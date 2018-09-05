
import axios from 'axios';
import Events from '../core/event-bus'

const PageService = {
    load () {
        return axios.get('/cms-api/pages');
    },

    reorder (data) {
        return axios.post('/cms-api/pages/reorder', {orderData:data});
    },

    save (menu) {
        return  new Promise((resolve, reject) => {
            let then = function (response) {
                let menuNew = response.data;
                Events.$emit('page-refresh', menuNew.id);
                resolve (menuNew);
            };
            if (menu.id) {
                axios.post('/cms-api/pages/'+menu.id, menu).then(then);
            } else {
                axios.post('/cms-api/pages', menu).then(then);
            }
        });
    },

    loadTemplates () {
        return axios.get('/cms-api/page-templates');
    },

};

export default PageService;