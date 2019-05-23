import axios from 'axios';


const FileService = {
    getFile(id){
      return axios.get('/cms-api/files/file/' + id);
    },
    getTree () {
        return axios.get('/cms-api/files/tree');
    },
    getFiles (id) {
        return axios.get('/cms-api/files/get/' + id);
    },
    deleteFile (id) {
        return axios.post('/cms-api/files/delete/' + id , {});
    },
    createUpdateDirectory (id, create, data) {
        if(create){
            let url = '/cms-api/files/directory/';
            url += id ? id : ''
            return axios.post(url, data);
        } else {
            return axios.post('/cms-api/files/directory/' + id + '/update', data);
        }
    },
    deleteDirectory (id) {
        return axios.post('/cms-api/files/directory/' + id + '/delete');
    },
    addDirectoryPermissions(id, permissions) {
        let data = {
            permissions: permissions
        }
        return axios.post('/cms-api/files/directory/' + id + '/permissions', data)
    },
    getDirectoryPermissions(id) {
        return axios.get('/cms-api/files/directory/' + id + '/permissions')
    },
    deleteDirectoryPermission(directoryId, permissionId){
        return axios.post('/cms-api/files/directory/' + directoryId + '/permissions/' + permissionId + '/delete')
    }
};

export default FileService;