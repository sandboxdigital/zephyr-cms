
import axios from 'axios';
import Events from '../core/event-bus'

const MenuService = {
    load () {
        return axios.get('/cms-api/menus');
    },

    reorder (data) {
        return axios.post('/cms-api/menus/reorder',{orderData:data});
    },

    save (menu) {
        return  new Promise((resolve, reject) => {
            let then = function (response) {
                let menuNew = response.data;
                Events.$emit('menus-refresh', menuNew.id);
                resolve (menuNew);
            };
            if (menu.id) {
                axios.post('/cms-api/menus/'+menu.id, menu).then(then);
            } else {
                axios.post('/cms-api/menus', menu).then(then);
            }
        });
    }
};

export default MenuService;