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
            return axios.post('/cms-api/files/directory/' + id, data);
        } else {
            return axios.post('/cms-api/files/directory/' + id + '/update', data);
        }
    },
    deleteDirectory (id) {
        return axios.post('/cms-api/files/directory/' + id + '/delete');
    }
};

export default FileService;