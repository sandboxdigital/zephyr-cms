import axios from 'axios';


const RoleService = {
    getRoles () {
        return axios.get('/cms-api/roles');
    },
    deleteRole (id) {
        return axios.post('/cms-api/roles/delete/' + id , {});
    },
    createUpdateRole (data) {

        let url = '/cms-api/roles/create-update';
        return axios.post(url, data);

    }
};

export default RoleService;