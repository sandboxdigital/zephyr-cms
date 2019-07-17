import axios from 'axios';


const FileService = {
    createLink(data){
        return axios.post('/cms-api/files/create-link', data);
    },
    getFile(id){
      return axios.get('/cms-api/files/file/' + id);
    },
    getTree () {
        return axios.get('/cms-api/files/tree');
    },
    getFiles (id, params) {
        return axios.get('/cms-api/files/get/' + id, { params : params });
    },
    deleteFile (id) {
        return axios.post('/cms-api/files/delete/' + id , {});
    },
    createUpdateDirectory (id, create, data) {
        if(create){
            let url = '/cms-api/files/directory/';
            url += id ? id : '';
            return axios.post(url, data);
        } else {
            return axios.post('/cms-api/files/directory/' + id + '/update', data);
        }
    },
    deleteDirectory (id) {
        return axios.post('/cms-api/files/directory/' + id + '/delete');
    },

    /* Permissions */
    syncMultipleFilePermissions(ids, permissions){
        let data = {
            ids: ids,
            permissions: permissions
        };

        return axios.post('/cms-api/files/multiple-file/permissions', data);
    },
    getMultipleFilePermissions(ids){
        return axios.get('/cms-api/files/multiple-file/permissions', { params : { ids: ids } });
    },

    syncFilePermissions(id, permissions) {
        let data = {
            permissions: permissions
        };
        return axios.post('/cms-api/files/file/' + id + '/permissions', data);
    },
    getFilePermissions(id) {
        return axios.get('/cms-api/files/file/' + id + '/permissions');
    },
    syncDirectoryPermissions(id, permissions) {
        let data = {
            permissions: permissions
        };
        return axios.post('/cms-api/files/directory/' + id + '/permissions', data);
    },
    getDirectoryPermissions(id) {
        return axios.get('/cms-api/files/directory/' + id + '/permissions');
    }
};

export default FileService;